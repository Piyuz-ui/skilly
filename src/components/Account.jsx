import { useEffect, useRef, useState } from 'react';
import { useStore } from '../lib/store.js';
import { accountsEnabled, USE_EMULATORS } from '../lib/firebase.js';
import {
  useAccount, startAccounts, signUpWithEmail, signInWithEmail, resetPassword, signInWithGoogle,
  sendPhoneCode, confirmPhoneCode, resetPhoneFlow, updateName, resendVerification, signOut, deleteAccount,
} from '../lib/account.js';
import { summary } from '../lib/sync.js';
import { streakInfo } from '../lib/streak.js';
import { ShareButton } from './ShareCard.jsx';
import { progressCard, hasProgress } from '../lib/shareCard.js';
import { useConfirm } from './Confirm.jsx';
import { navigate } from '../lib/hooks.js';

// Small avatar used in the header and on the profile.
export function Avatar({ user, size = 36 }) {
  const [broken, setBroken] = useState(false);
  const initial = (user?.name || user?.email || user?.phone || '?').replace(/^\+/, '').trim().charAt(0).toUpperCase();
  return (
    <span className="avatar" style={{ width: size, height: size, fontSize: size * 0.42 }} aria-hidden="true">
      {user?.photo && !broken
        ? <img src={user.photo} alt="" referrerPolicy="no-referrer" onError={() => setBroken(true)} />
        : user ? initial : <PersonIcon />}
    </span>
  );
}

const PersonIcon = () => (
  <svg viewBox="0 0 24 24" width="58%" height="58%" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" width="20" height="20" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" /><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" /><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" /><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" /></svg>
);

export function Account() {
  const acct = useAccount();
  useEffect(() => { if (accountsEnabled) startAccounts().catch(() => {}); }, []);

  return (
    <main id="main" tabIndex={-1} className="page wrap narrow account-page">
      {!accountsEnabled ? <AccountsOff />
        : acct.status === 'signedIn' ? <Profile acct={acct} />
        : acct.status === 'signedOut' ? <SignIn error={acct.error} />
        : <div className="panel slab"><p className="muted">Loading your account…</p></div>}
    </main>
  );
}

function AccountsOff() {
  return (
    <section className="panel slab">
      <p className="eyebrow">Accounts</p>
      <h1>Accounts are coming soon</h1>
      <p className="muted">Your progress is saved in this browser for now. Soon you’ll be able to sign in with Google, your phone number or email and keep it on every device.</p>
      {import.meta.env.DEV && <p className="small muted">Developer note: add the Firebase keys to <code>.env.local</code> (see <code>.env.example</code> and SETUP-ACCOUNTS.md) to switch accounts on.</p>}
    </section>
  );
}

// ─── Signed out ────────────────────────────────────────────────────────────
function SignIn({ error: startError }) {
  const [mode, setMode] = useState('signin'); // signin | signup | reset | phone
  const hasProgress = useStore((s) => s.reports.length > 0 || Object.keys(s.plans).length > 0 || Object.keys(s.paths).length > 0);

  return (
    <section className="panel slab auth-card">
      <p className="eyebrow">Your Skilly account</p>
      <h1>{mode === 'signup' ? 'Create your account' : mode === 'reset' ? 'Reset your password' : mode === 'phone' ? 'Sign in with your phone' : 'Sign in'}</h1>
      <p className="muted">
        {mode === 'reset' ? 'We’ll email you a link to choose a new password.'
          : 'Save every test, report, roadmap and career path to your account, and pick up on any device.'}
      </p>
      {hasProgress && mode !== 'reset' && <p className="auth-note">Your progress on this device will be added to your account.</p>}
      {startError && <p className="fb-error" role="alert">{startError}</p>}

      {(mode === 'signin' || mode === 'signup') && (
        <>
          <div className="auth-tabs" role="tablist" aria-label="Sign in or create account">
            <button type="button" role="tab" aria-selected={mode === 'signin'} className={mode === 'signin' ? 'on' : ''} onClick={() => setMode('signin')}>Sign in</button>
            <button type="button" role="tab" aria-selected={mode === 'signup'} className={mode === 'signup' ? 'on' : ''} onClick={() => setMode('signup')}>Create account</button>
          </div>
          <SocialButtons onPhone={() => setMode('phone')} />
          <div className="auth-or"><span>or with email</span></div>
          <EmailForm key={mode} mode={mode} onForgot={() => setMode('reset')} />
          <p className="small muted auth-legal">By continuing you agree that Skilly stores your progress in your account. We never share it or show it to anyone else.</p>
        </>
      )}
      {mode === 'reset' && <ResetForm onBack={() => setMode('signin')} />}
      {mode === 'phone' && <PhoneForm onBack={() => { resetPhoneFlow(); setMode('signin'); }} />}
    </section>
  );
}

function SocialButtons({ onPhone }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const google = async () => {
    setBusy(true); setError('');
    try { await signInWithGoogle(); } catch (e) { setError(e.message); } finally { setBusy(false); }
  };
  return (
    <div className="auth-social">
      <button type="button" className="btn auth-btn google" onClick={google} disabled={busy}><GoogleIcon /> {busy ? 'Opening Google…' : 'Continue with Google'}</button>
      <button type="button" className="btn auth-btn" onClick={onPhone}><span aria-hidden="true">📱</span> Continue with phone number</button>
      {error && <p className="fb-error" role="alert">{error}</p>}
    </div>
  );
}

function PasswordInput({ value, onChange, autoComplete }) {
  const [show, setShow] = useState(false);
  return (
    <span className="pw-wrap">
      <input type={show ? 'text' : 'password'} value={value} onChange={(e) => onChange(e.target.value)} autoComplete={autoComplete} required minLength={8} />
      <button type="button" className="pw-toggle" onClick={() => setShow((v) => !v)} aria-label={show ? 'Hide password' : 'Show password'}>{show ? 'Hide' : 'Show'}</button>
    </span>
  );
}

function EmailForm({ mode, onForgot }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const signup = mode === 'signup';

  const submit = async (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError('That email address doesn’t look right.'); return; }
    if (signup && password.length < 8) { setError('Use a password with at least 8 characters.'); return; }
    if (!password) { setError('Enter your password.'); return; }
    setBusy(true); setError('');
    try {
      if (signup) await signUpWithEmail({ name, email, password });
      else await signInWithEmail({ email, password });
    } catch (err) { setError(err.message); setBusy(false); }
  };

  return (
    <form className="auth-form" onSubmit={submit} noValidate>
      {signup && (
        <label className="fb-field"><span>Your name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" maxLength={60} />
        </label>
      )}
      <label className="fb-field"><span>Email</span>
        <input type="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
      </label>
      <label className="fb-field"><span>Password {signup && <em>(at least 8 characters)</em>}</span>
        <PasswordInput value={password} onChange={setPassword} autoComplete={signup ? 'new-password' : 'current-password'} />
      </label>
      {error && <p className="fb-error" role="alert">{error}</p>}
      <button type="submit" className="btn primary auth-submit" disabled={busy}>{busy ? 'Please wait…' : signup ? 'Create account' : 'Sign in'}</button>
      {!signup && <button type="button" className="link small auth-forgot" onClick={onForgot}>Forgot your password?</button>}
    </form>
  );
}

function ResetForm({ onBack }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle');
  const [error, setError] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError('That email address doesn’t look right.'); return; }
    setState('busy'); setError('');
    try { await resetPassword(email); setState('sent'); } catch (err) { setError(err.message); setState('idle'); }
  };
  if (state === 'sent') {
    return (
      <div className="auth-form">
        <p className="auth-note">If an account uses <b>{email.trim()}</b>, a reset link is on its way. Check your inbox and spam folder.</p>
        <button type="button" className="btn ghost" onClick={onBack}>Back to sign in</button>
      </div>
    );
  }
  return (
    <form className="auth-form" onSubmit={submit} noValidate>
      <label className="fb-field"><span>Email</span>
        <input type="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" autoFocus />
      </label>
      {error && <p className="fb-error" role="alert">{error}</p>}
      <button type="submit" className="btn primary auth-submit" disabled={state === 'busy'}>{state === 'busy' ? 'Sending…' : 'Send reset link'}</button>
      <button type="button" className="link small" onClick={onBack}>← Back to sign in</button>
    </form>
  );
}

const COUNTRIES = [
  ['+91', 'India'], ['+1', 'USA / Canada'], ['+44', 'UK'], ['+971', 'UAE'], ['+65', 'Singapore'],
  ['+61', 'Australia'], ['+49', 'Germany'], ['+977', 'Nepal'], ['+880', 'Bangladesh'], ['+94', 'Sri Lanka'],
];
const RESEND_AFTER = 30;

function PhoneForm({ onBack }) {
  const [cc, setCc] = useState('+91');
  const [number, setNumber] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('number'); // number | code
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [wait, setWait] = useState(0);
  const codeRef = useRef(null);

  // Each visit to the phone form gets a fresh security check; a stale one
  // (left from an earlier sign-in on this page) would make sending hang.
  useEffect(() => { resetPhoneFlow(); return () => resetPhoneFlow(); }, []);

  useEffect(() => {
    if (wait <= 0) return undefined;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  const full = `${cc}${number.replace(/\D/g, '').replace(/^0+/, '')}`;

  const send = async (e) => {
    e?.preventDefault();
    const digits = number.replace(/\D/g, '').replace(/^0+/, '');
    if (digits.length < 6 || digits.length > 12) { setError('Enter your phone number without the country code, for example 98765 43210.'); return; }
    setBusy(true); setError('');
    if (step === 'code') resetPhoneFlow(); // resend: fresh security check
    try {
      await sendPhoneCode(full, 'recaptcha-box');
      setStep('code'); setWait(RESEND_AFTER); setCode('');
      requestAnimationFrame(() => codeRef.current?.focus());
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  };

  const verify = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(code.trim())) { setError('Enter the 6-digit code from the SMS.'); return; }
    setBusy(true); setError('');
    try { await confirmPhoneCode(code); } catch (err) { setError(err.message); setBusy(false); }
  };

  return (
    <div>
      {step === 'code' ? (
      <form className="auth-form" onSubmit={verify} noValidate>
        <p className="auth-note">We sent a 6-digit code to <b>{full}</b>.{USE_EMULATORS && ' (Emulator: the code is printed in the emulator log.)'}</p>
        <label className="fb-field"><span>Code from the SMS</span>
          <input ref={codeRef} className="otp" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" pattern="\d{6}" maxLength={6} />
        </label>
        {error && <p className="fb-error" role="alert">{error}</p>}
        <button type="submit" className="btn primary auth-submit" disabled={busy}>{busy ? 'Checking…' : 'Verify and sign in'}</button>
        <div className="row">
          <button type="button" className="link small" onClick={() => { resetPhoneFlow(); setStep('number'); setError(''); }}>Change number</button>
          <button type="button" className="link small" onClick={send} disabled={wait > 0 || busy}>{wait > 0 ? `Resend code in ${wait}s` : 'Resend code'}</button>
        </div>
      </form>
      ) : (
    <form className="auth-form" onSubmit={send} noValidate>
      <div className="fb-field"><span id="phone-label">Phone number</span>
        <div className="phone-row">
          <select value={cc} onChange={(e) => setCc(e.target.value)} aria-label="Country code">
            {COUNTRIES.map(([c, n]) => <option key={c} value={c}>{c} {n}</option>)}
          </select>
          <input type="tel" inputMode="tel" autoComplete="tel-national" value={number} onChange={(e) => setNumber(e.target.value)} aria-labelledby="phone-label" placeholder="98765 43210" />
        </div>
      </div>
      <p className="small muted">We’ll text you a one-time code. Standard SMS rates may apply.</p>
      {error && <p className="fb-error" role="alert">{error}</p>}
      <button type="submit" className="btn primary auth-submit" disabled={busy}>{busy ? 'Sending code…' : 'Send code'}</button>
      <button type="button" className="link small" onClick={onBack}>← Other ways to sign in</button>
    </form>
      )}
      {/* Invisible reCAPTCHA lives here for both steps, so "Resend" still works. */}
      <div id="recaptcha-box" />
    </div>
  );
}

// ─── Signed in ─────────────────────────────────────────────────────────────
const PROVIDER_NAMES = { 'google.com': 'Google', password: 'Email', phone: 'Phone' };

function syncLabel(acct) {
  switch (acct.sync) {
    case 'syncing': return 'Syncing your progress…';
    case 'saving': return 'Saving…';
    case 'saved': return `All progress saved to your account${acct.syncedAt ? ` · ${new Date(acct.syncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}`;
    case 'offline': return navigator.onLine === false
      ? 'You’re offline. Changes are kept here and saved when you reconnect.'
      : 'Can’t reach Skilly’s servers. Changes are kept here and saved once they’re back.';
    case 'error': return `Couldn’t save just now. ${acct.error || ''} We’ll retry on your next change.`;
    default: return 'Connecting…';
  }
}

function Profile({ acct }) {
  const { user } = acct;
  const state = useStore((s) => s);
  const stats = summary(state);
  const lastReport = state.reports.at(-1);
  const confirm = useConfirm();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const saveName = async (e) => {
    e.preventDefault();
    try { await updateName(name); setEditing(false); setMsg('Name updated.'); } catch (err) { setError(err.message); }
  };

  const doSignOut = async () => {
    const unsaved = acct.sync !== 'saved';
    const clear = await confirm({
      title: 'Remove your progress from this device?',
      body: unsaved
        ? 'Some recent changes haven’t reached your account yet (you may be offline). If you remove them from this device, they’ll be lost. Keep them here and sign in again later to save them.'
        : 'Recommended on shared or public computers. Everything stays safe in your account either way.',
      ok: 'Sign out and remove', cancel: 'Sign out, keep it here', danger: unsaved,
    });
    await signOut({ clearDevice: clear });
    navigate('/');
  };

  const doDelete = async () => {
    const ok = await confirm({
      title: 'Delete your account?',
      body: 'This permanently deletes your account and all progress saved to it: reports, roadmaps and career paths. It can’t be undone.',
      ok: 'Delete my account', cancel: 'Keep my account', danger: true,
    });
    if (!ok) return;
    try { await deleteAccount(); navigate('/'); } catch (err) { setError(err.message); }
  };

  const since = user.createdAt ? new Date(user.createdAt).toLocaleDateString([], { day: 'numeric', month: 'long', year: 'numeric' }) : null;

  return (
    <>
      <section className="panel slab profile-head">
        <Avatar user={user} size={72} />
        <div className="profile-id">
          {editing ? (
            <form className="row" onSubmit={saveName}>
              <input className="name-input" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} aria-label="Your name" autoFocus />
              <button type="submit" className="btn primary sm">Save</button>
              <button type="button" className="btn ghost sm" onClick={() => { setEditing(false); setName(user.name); }}>Cancel</button>
            </form>
          ) : (
            <h1>{user.name || 'Add your name'} <button type="button" className="link small" onClick={() => setEditing(true)}>Edit</button></h1>
          )}
          <p className="muted">{[user.email, user.phone].filter(Boolean).join(' · ')}</p>
          <p className="small muted">
            Signed in with {user.providers.map((p) => PROVIDER_NAMES[p] || p).join(', ') || 'email'}{since && ` · Member since ${since}`}
          </p>
          <p className={`sync-line ${acct.sync}`} role="status">{syncLabel(acct)}</p>
          {msg && <p className="small" role="status">{msg}</p>}
        </div>
      </section>

      {user.email && !user.emailVerified && user.providers.includes('password') && (
        <section className="panel slab auth-note row">
          <span>Please confirm your email address so you can always recover your account.</span>
          <button type="button" className="btn ghost sm" onClick={async () => { try { await resendVerification(); setMsg('Confirmation email sent.'); } catch (err) { setError(err.message); } }}>Resend email</button>
        </section>
      )}

      <section className="panel slab">
        <h2>Your progress</h2>
        <div className="profile-stats">
          <Stat n={stats.tests} label={stats.tests === 1 ? 'test taken' : 'tests taken'} />
          <Stat n={stats.accuracy === null ? '–' : `${stats.accuracy}%`} label="overall accuracy" />
          <Stat n={stats.roadmaps} label={stats.roadmaps === 1 ? 'roadmap' : 'roadmaps'} />
          <Stat n={stats.tasksDone} label="tasks done" />
          <Stat n={stats.pathsStarted} label="career paths started" />
          <Stat n={stats.stepsDone} label="path steps done" />
          <Stat n={stats.weeksDone} label="study weeks done" />
          <Stat n={stats.solved} label="coding problems solved" />
          <Stat n={streakInfo(state.activity).current} label="day streak 🔥" />
        </div>
        <div className="row">
          {Object.keys(state.plans).length > 0 && <a className="btn primary sm" href="#/plan">Open my roadmap</a>}
          {lastReport && <a className="btn ghost sm" href={`#/report/${lastReport.id}`}>Last report</a>}
          <a className="btn ghost sm" href="#/paths">Career paths</a>
          {hasProgress(progressCard(state)) && <ShareButton kind="progress" label="Share my progress" className="btn ghost sm" getCard={() => progressCard(state)} />}
          {!lastReport && <a className="btn ghost sm" href="#/">Take a test</a>}
        </div>
      </section>

      {error && <p className="fb-error" role="alert">{error}</p>}

      <section className="panel slab account-actions">
        <h2>Account</h2>
        <div className="row">
          <button type="button" className="btn ghost" onClick={doSignOut}>Sign out</button>
        </div>
        <details className="danger-zone">
          <summary>Delete account</summary>
          <p className="small muted">Deletes your account and everything saved to it. For your safety, this only works within 5 minutes of signing in, so sign out and back in first if it’s been longer.</p>
          <button type="button" className="btn danger sm" onClick={doDelete}>Delete my account</button>
        </details>
      </section>
    </>
  );
}

function Stat({ n, label }) {
  return <div className="pstat"><strong>{n}</strong><span>{label}</span></div>;
}
