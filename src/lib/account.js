// Accounts: sign up / sign in (email, Google, phone OTP), the profile, and
// syncing progress to the account so it follows the person to any device.
//
// Progress is saved as one Firestore document per person: users/{uid}.
// The device keeps working offline; changes are saved a moment after they
// happen, and other signed-in devices pick them up live.
import { useSyncExternalStore } from 'react';
import { store, sanitize, DEFAULT_STATE } from './store.js';
import { accountsEnabled, loadFirebase } from './firebase.js';
import { syncable, withSynced, mergeGenerous, applyRemote, fitToLimit, SYNC_SCHEMA } from './sync.js';
import { trackEvent } from './analytics.js';
import { notifyAccountEvent } from './notify.js';

const FLAG = 'skilly:account';   // '1' when someone was signed in on this device
const OWNER = 'skilly:owner';    // uid whose progress the local data belongs to
const DEVICE = 'skilly:device';  // random id, so a device ignores its own saves
const SAVE_DELAY = 1200;

const ls = {
  get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } },
  del: (k) => { try { localStorage.removeItem(k); } catch { /* ignore */ } },
};

function deviceId() {
  let id = ls.get(DEVICE);
  if (!id) { id = Math.random().toString(36).slice(2) + Date.now().toString(36); ls.set(DEVICE, id); }
  return id;
}

// ─── Account state (for React) ─────────────────────────────────────────────
// status: off | idle | loading | signedOut | signedIn
// sync:   idle | syncing | saving | saved | offline | error
let acct = { status: accountsEnabled ? 'idle' : 'off', user: null, sync: 'idle', syncedAt: null, error: null };
const subs = new Set();
const setAcct = (patch) => { acct = { ...acct, ...patch }; subs.forEach((f) => f()); };
export const useAccount = () => useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f); }, () => acct);
export const getAccount = () => acct;

function toUser(u) {
  if (!u) return null;
  return {
    uid: u.uid,
    name: u.displayName || '',
    email: u.email || '',
    phone: u.phoneNumber || '',
    photo: u.photoURL || '',
    emailVerified: u.emailVerified,
    providers: u.providerData.map((p) => p.providerId),
    createdAt: u.metadata.creationTime ? Date.parse(u.metadata.creationTime) : null,
    lastSignInAt: u.metadata.lastSignInTime ? Date.parse(u.metadata.lastSignInTime) : null,
  };
}

// ─── Start-up ──────────────────────────────────────────────────────────────
let fb = null;
let started = null;

// Loads Firebase and starts listening for sign-in changes. Safe to call often.
export function startAccounts() {
  if (!accountsEnabled) return Promise.resolve(null);
  if (started) return started;
  setAcct({ status: 'loading' });
  started = loadFirebase().then((f) => {
    fb = f;
    f.A.onAuthStateChanged(f.auth, (u) => {
      if (u) {
        ls.set(FLAG, '1');
        setAcct({ status: 'signedIn', user: toUser(u), error: null });
        beginSync(u.uid);
      } else {
        endSync();
        setAcct({ status: 'signedOut', user: null, sync: 'idle', syncedAt: null, error: null });
      }
    });
    // Finishes a Google sign-in that had to use a full-page redirect.
    f.A.getRedirectResult(f.auth)
      .then((cred) => { if (cred) notifyAccountEvent(f.A.getAdditionalUserInfo(cred)?.isNewUser ? 'new-account' : 'sign-in', 'google', cred.user); })
      .catch((e) => setAcct({ error: friendly(e) }));
    return f;
  }).catch((e) => {
    started = null;
    setAcct({ status: 'signedOut', error: 'Accounts couldn’t load. Check your connection and try again.' });
    throw e;
  });
  return started;
}

// Only load Firebase on page load if someone was signed in here before.
export function resumeIfSignedIn() {
  if (accountsEnabled && ls.get(FLAG) === '1') startAccounts().catch(() => {});
}

const ready = async () => fb || startAccounts();

// ─── Friendly error messages ───────────────────────────────────────────────
const MESSAGES = {
  'auth/invalid-email': 'That email address doesn’t look right.',
  'auth/missing-email': 'Enter your email address.',
  'auth/missing-password': 'Enter your password.',
  'auth/email-already-in-use': 'There’s already an account with this email. Sign in instead, or reset your password.',
  'auth/weak-password': 'Use a password with at least 8 characters.',
  'auth/invalid-credential': 'Email or password is wrong. Check them, or reset your password.',
  'auth/wrong-password': 'Email or password is wrong. Check them, or reset your password.',
  'auth/user-not-found': 'No account uses this email. Create one instead?',
  'auth/too-many-requests': 'Too many tries. Wait a few minutes, then try again.',
  'auth/network-request-failed': 'No connection. Check your internet and try again.',
  'auth/popup-closed-by-user': 'The Google window was closed before signing in.',
  'auth/cancelled-popup-request': 'The Google window was closed before signing in.',
  'auth/account-exists-with-different-credential': 'This email already has an account with a different sign-in method. Sign in that way first.',
  'auth/invalid-phone-number': 'That phone number doesn’t look right. Include the country code, for example +91 98765 43210.',
  'auth/missing-phone-number': 'Enter your phone number.',
  'auth/quota-exceeded': 'We’ve hit today’s limit for text messages. Please sign in with Google or email for now.',
  'auth/invalid-verification-code': 'That code isn’t right. Check the SMS and try again.',
  'auth/code-expired': 'That code has expired. Send a new one.',
  'auth/captcha-check-failed': 'The security check failed. Reload the page and try again.',
  'auth/requires-recent-login': 'For your safety, sign out and sign in again, then retry.',
  'auth/operation-not-allowed': 'This sign-in method isn’t switched on yet.',
  'auth/unauthorized-domain': 'This website address isn’t allowed to sign in yet (Firebase → Authentication → Settings → Authorized domains).',
  // Database (Firestore) errors while saving progress.
  unavailable: 'Can’t reach Skilly’s servers right now.',
  'deadline-exceeded': 'Can’t reach Skilly’s servers right now.',
  'permission-denied': 'Your progress couldn’t be saved: the account database isn’t set up correctly.',
  'resource-exhausted': 'Skilly’s servers are busy. Your progress is kept on this device.',
  unauthenticated: 'Your sign-in expired. Sign out and back in.',
};
export function friendly(e) {
  return MESSAGES[e?.code] || 'Something went wrong. Please try again.';
}
const fail = (e) => {
  // Keep the real reason in the console for debugging; users see a friendly message.
  console.warn('[skilly account]', e?.code || '', e?.message || e);
  throw Object.assign(new Error(friendly(e)), { code: e?.code });
};

// ─── Sign up / sign in ─────────────────────────────────────────────────────
export async function signUpWithEmail({ name, email, password }) {
  const { auth, A } = await ready();
  try {
    const cred = await A.createUserWithEmailAndPassword(auth, email.trim(), password);
    if (name.trim()) await A.updateProfile(cred.user, { displayName: name.trim() });
    A.sendEmailVerification(cred.user).catch(() => {});
    setAcct({ user: toUser(auth.currentUser) });
    trackEvent('account-created-email');
    notifyAccountEvent('new-account', 'email', auth.currentUser);
  } catch (e) { fail(e); }
}

export async function signInWithEmail({ email, password }) {
  const { auth, A } = await ready();
  try {
    const cred = await A.signInWithEmailAndPassword(auth, email.trim(), password);
    trackEvent('sign-in-email');
    notifyAccountEvent('sign-in', 'email', cred.user);
  } catch (e) { fail(e); }
}

export async function resetPassword(email) {
  const { auth, A } = await ready();
  try { await A.sendPasswordResetEmail(auth, email.trim()); } catch (e) { fail(e); }
}

export async function signInWithGoogle() {
  const { auth, A } = await ready();
  const provider = new A.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  try {
    const cred = await A.signInWithPopup(auth, provider);
    trackEvent('sign-in-google');
    notifyAccountEvent(A.getAdditionalUserInfo(cred)?.isNewUser ? 'new-account' : 'sign-in', 'google', cred.user);
  } catch (e) {
    // Some phone browsers block pop-ups: fall back to a full-page redirect.
    if (e?.code === 'auth/popup-blocked' || e?.code === 'auth/operation-not-supported-in-this-environment') {
      ls.set(FLAG, '1');
      await A.signInWithRedirect(auth, provider);
      return;
    }
    fail(e);
  }
}

let recaptcha = null;
let confirmation = null;

// Step 1 of phone sign-in: send the SMS. `buttonId` is the element the
// invisible reCAPTCHA attaches to.
export async function sendPhoneCode(phone, buttonId) {
  const { auth, A } = await ready();
  try {
    if (!recaptcha) recaptcha = new A.RecaptchaVerifier(auth, buttonId, { size: 'invisible' });
    confirmation = await A.signInWithPhoneNumber(auth, phone, recaptcha);
  } catch (e) {
    try { recaptcha?.clear(); } catch { /* ignore */ }
    recaptcha = null;
    fail(e);
  }
}

// Step 2: check the 6-digit code from the SMS.
export async function confirmPhoneCode(code) {
  if (!confirmation) throw new Error('Send a code first.');
  try {
    const cred = await confirmation.confirm(code.trim());
    resetPhoneFlow();
    trackEvent('sign-in-phone');
    ready().then(({ A }) => notifyAccountEvent(A.getAdditionalUserInfo(cred)?.isNewUser ? 'new-account' : 'sign-in', 'phone', cred.user)).catch(() => {});
  } catch (e) { fail(e); }
}

export function resetPhoneFlow() {
  confirmation = null;
  try { recaptcha?.clear(); } catch { /* ignore */ }
  recaptcha = null;
}

// ─── Profile ───────────────────────────────────────────────────────────────
export async function updateName(name) {
  const { auth, A } = await ready();
  try { await A.updateProfile(auth.currentUser, { displayName: name.trim() }); setAcct({ user: toUser(auth.currentUser) }); } catch (e) { fail(e); }
}

export async function resendVerification() {
  const { auth, A } = await ready();
  try { await A.sendEmailVerification(auth.currentUser); } catch (e) { fail(e); }
}

export async function signOut({ clearDevice }) {
  const { auth, A } = await ready();
  // Try to save the last changes, but never let a slow or missing connection
  // block signing out (Firestore keeps the write queued if it can).
  await Promise.race([flushSave(), new Promise((r) => setTimeout(r, 3000))]);
  endSync();
  await A.signOut(auth);
  ls.del(FLAG);
  if (clearDevice) { store.reset(); ls.del(OWNER); }
}

// Deleting needs a recent sign-in (Firebase's rule, to protect the account).
export const RECENT_MS = 5 * 60 * 1000;
export async function deleteAccount() {
  const { auth, db, A, F } = await ready();
  const u = auth.currentUser;
  if (!u) return;
  if (Date.now() - Date.parse(u.metadata.lastSignInTime) > RECENT_MS) {
    throw Object.assign(new Error(MESSAGES['auth/requires-recent-login']), { code: 'auth/requires-recent-login' });
  }
  endSync();
  try {
    await F.deleteDoc(F.doc(db, 'users', u.uid));
    await A.deleteUser(u);
  } catch (e) { fail(e); }
  ls.del(FLAG); ls.del(OWNER);
  store.reset();
}

// ─── Sync ──────────────────────────────────────────────────────────────────
let uid = null;
let unsubStore = null;
let unsubDoc = null;
let saveTimer = null;
let lastJson = null;     // the synced data as last saved or received
let applying = false;    // true while we're writing remote data into the store
let merged0 = false;     // first merge with the account's server copy is done
let pendingJson = null;  // the last data handed to Firestore, maybe not yet confirmed

const parseRemote = (data) => {
  try {
    if (!data || data.schema !== SYNC_SCHEMA || typeof data.data !== 'string') return null;
    return syncable(sanitize(JSON.parse(data.data)));
  } catch { return null; }
};

function applyToStore(synced) {
  applying = true;
  try { store.set((s) => sanitize(withSynced(s, synced))); } finally { applying = false; }
}

async function beginSync(userId) {
  if (uid === userId && unsubDoc) return;
  endSync();
  uid = userId;
  merged0 = false;
  const { db, F } = fb;
  const ref = F.doc(db, 'users', userId);
  setAcct({ sync: 'syncing' });

  // First merge: combine this device with what the account already holds.
  // Saving stays switched off until this has happened with the server's real
  // data, so an offline sign-in can never overwrite progress made elsewhere.
  const firstMerge = (remote) => {
    const local = syncable(store.get());
    const owner = ls.get(OWNER);
    const merged = owner && owner !== userId
      ? (remote || syncable(structuredClone(DEFAULT_STATE))) // device held someone else's progress
      : mergeGenerous(local, remote);                         // guest or own offline progress joins
    ls.set(OWNER, userId);
    applyToStore(merged);
    merged0 = true;
    const { json } = fitToLimit(syncable(store.get()));
    if (!remote || JSON.stringify(remote) !== json) save(json);
    else { lastJson = json; setAcct({ sync: 'saved', syncedAt: Date.now(), error: null }); }
  };

  try {
    const snap = await F.getDocFromServer(ref);
    if (uid !== userId) return; // signed out meanwhile
    firstMerge(snap.exists() ? parseRemote(snap.data()) : null);
  } catch (e) {
    // Offline or server unreachable: keep working locally; the live listener
    // below does the first merge as soon as the server answers.
    setAcct({ sync: isOffline(e) ? 'offline' : 'error', error: friendly(e) });
  }

  // Save local changes shortly after they happen.
  unsubStore = store.subscribe(() => {
    if (applying || !uid) return;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => { saveTimer = null; flushSave(); }, SAVE_DELAY);
  });

  // Live updates: other devices' changes, and the first merge if the initial
  // read failed. Cached snapshots are ignored: only the server's copy counts.
  unsubDoc = F.onSnapshot(ref, { includeMetadataChanges: true }, (snap) => {
    if (snap.metadata.fromCache || snap.metadata.hasPendingWrites) return;
    if (!merged0) { firstMerge(snap.exists() ? parseRemote(snap.data()) : null); return; }
    if (!snap.exists()) return;
    const data = snap.data();
    if (data.deviceId === deviceId()) return;
    const remote = parseRemote(data);
    if (!remote) return;
    const remoteJson = JSON.stringify(remote);
    if (remoteJson === lastJson) return;
    const local = syncable(store.get());
    const merged = saveTimer ? mergeGenerous(local, remote) : applyRemote(local, remote);
    applyToStore(merged);
    lastJson = remoteJson;
    const { json } = fitToLimit(syncable(store.get()));
    if (json !== remoteJson) flushSave();
    else setAcct({ sync: 'saved', syncedAt: Date.now(), error: null });
  }, (e) => setAcct({ sync: isOffline(e) ? 'offline' : 'error', error: friendly(e) }));
}

const isOffline = (e) => navigator.onLine === false || e?.code === 'unavailable' || /offline/i.test(e?.message || '');

async function save(json) {
  if (!uid || !fb || !merged0) return;
  const { db, F } = fb;
  const mine = uid;
  pendingJson = json;
  setAcct({ sync: navigator.onLine === false ? 'offline' : 'saving' });
  try {
    // Resolves only once the server has the data (Firestore queues it offline).
    await F.setDoc(F.doc(db, 'users', mine), {
      schema: SYNC_SCHEMA,
      data: json,
      deviceId: deviceId(),
      updatedAt: F.serverTimestamp(),
    });
    if (uid !== mine) return;
    lastJson = json;
    if (pendingJson === json) setAcct({ sync: 'saved', syncedAt: Date.now(), error: null });
  } catch (e) {
    if (uid === mine) setAcct({ sync: isOffline(e) ? 'offline' : 'error', error: friendly(e) });
  }
}

async function flushSave() {
  clearTimeout(saveTimer);
  saveTimer = null;
  if (!uid) return;
  if (!merged0) return;
  const { json } = fitToLimit(syncable(store.get()));
  if (json === lastJson || json === pendingJson) return;
  await save(json);
}

function endSync() {
  clearTimeout(saveTimer);
  saveTimer = null;
  unsubStore?.(); unsubStore = null;
  unsubDoc?.(); unsubDoc = null;
  uid = null;
  lastJson = null;
  pendingJson = null;
  merged0 = false;
}

// When the connection comes back, Firestore sends queued saves by itself.
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => { if (uid && merged0 && acct.sync === 'offline') setAcct({ sync: 'saving' }); });
  window.addEventListener('offline', () => { if (uid) setAcct({ sync: 'offline' }); });
}

// Save right away if the person leaves or switches tabs.
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && saveTimer) flushSave(); });
}
