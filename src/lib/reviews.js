// Teacher reviews of questions.
//
// Firestore layout (rules in firestore.rules):
//   reviewers/{uid}  { name }                    added by the Skilly team only
//   reviews/{qid}    { status, note, by, byName, at, version }
//     status:  'approved' | 'needs-fix'
//     version: a hash of the question's text, options and explanation. If the
//              question is edited later, its old review no longer counts.
//
// Public pages read reviews with a tiny REST request (no Firebase SDK), so a
// report page stays light. Reviewers write through the SDK (signed in).
import { FIREBASE_CONFIG, USE_EMULATORS, accountsEnabled, loadFirebase } from './firebase.js';
import VERIFIED from '../data/questions/verified.json';

const VERIFIED_SET = new Set(VERIFIED);
export const isMachineChecked = (id) => VERIFIED_SET.has(id);
export const MACHINE_CHECKED_COUNT = VERIFIED_SET.size;

// Stable short hash of everything a reviewer approves.
export function questionVersion(q) {
  const text = JSON.stringify([q.prompt, q.code || '', q.options, q.explanation]);
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

// A review counts only if it matches the current version of the question.
export function reviewState(q, review) {
  if (!review) return 'none';
  if (review.version !== questionVersion(q)) return 'stale';
  return review.status; // 'approved' | 'needs-fix'
}

const DB_PATH = () => `projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents`;
const REST_BASE = () => (USE_EMULATORS ? 'http://127.0.0.1:8080/v1' : 'https://firestore.googleapis.com/v1');

function fromFields(f = {}) {
  const v = (x) => x?.stringValue ?? x?.timestampValue ?? null;
  return { status: v(f.status), note: v(f.note) || '', byName: v(f.byName) || '', at: v(f.at), version: v(f.version) };
}

// Public read of the reviews for some question ids. Never throws: if
// accounts are off or the request fails, returns {}.
export async function fetchReviews(ids) {
  if (!accountsEnabled || !ids.length) return {};
  try {
    const res = await fetch(`${REST_BASE()}/${DB_PATH()}:batchGet?key=${encodeURIComponent(FIREBASE_CONFIG.apiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documents: ids.map((id) => `${DB_PATH()}/reviews/${id}`) }),
    });
    if (!res.ok) return {};
    const out = {};
    for (const item of await res.json()) {
      if (item.found) out[item.found.name.split('/').pop()] = fromFields(item.found.fields);
    }
    return out;
  } catch { return {}; }
}

// ─── Reviewer actions (signed in, SDK) ────────────────────────────────────
export async function isReviewer(uid) {
  const { db, F } = await loadFirebase();
  try { return (await F.getDoc(F.doc(db, 'reviewers', uid))).exists(); } catch { return false; }
}

// All reviews whose id starts with prefix, e.g. 'py-easy-'.
export async function loadReviewsByPrefix(prefix) {
  const { db, F } = await loadFirebase();
  const q = F.query(F.collection(db, 'reviews'), F.orderBy(F.documentId()), F.startAt(prefix), F.endAt(`${prefix}`));
  const snap = await F.getDocs(q);
  const out = {};
  snap.forEach((d) => { out[d.id] = d.data(); });
  return out;
}

export async function saveReview(q, { status, note, uid, name }) {
  const { db, F } = await loadFirebase();
  const data = { status, note: note.trim().slice(0, 900), by: uid, byName: (name || 'Reviewer').slice(0, 80), at: F.serverTimestamp(), version: questionVersion(q) };
  await F.setDoc(F.doc(db, 'reviews', q.id), data);
  return { ...data, at: new Date().toISOString() };
}
