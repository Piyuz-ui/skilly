import { useEffect, useMemo, useState } from 'react';
import { QUESTIONS, LANGUAGES, DIFFICULTIES, topicLabel } from '../data/questions/index.js';
import { useAccount, startAccounts } from '../lib/account.js';
import { accountsEnabled } from '../lib/firebase.js';
import { isReviewer, loadReviewsByPrefix, saveReview, reviewState, isMachineChecked } from '../lib/reviews.js';
import { CodeBlock } from './CodeBlock.jsx';

const PREFIX = { python: 'py', java: 'java', cpp: 'cpp', javascript: 'js', typescript: 'ts', csharp: 'cs', sql: 'sql', go: 'go', kotlin: 'kt', rust: 'rs', swift: 'swift', php: 'php', ruby: 'rb', dart: 'dart' };
const STATE_LABEL = { none: 'Not reviewed', approved: 'Approved', 'needs-fix': 'Needs fix', stale: 'Changed since review' };
const cap = (s) => s[0].toUpperCase() + s.slice(1);

// Teacher review page: approved reviewers check each question and mark it
// Approved or Needs fix. Only accounts listed in Firestore reviewers/{uid}
// can save (enforced by firestore.rules).
export function Review() {
  const acct = useAccount();
  const [role, setRole] = useState('checking'); // checking | reviewer | not-reviewer
  useEffect(() => { if (accountsEnabled) startAccounts().catch(() => {}); }, []);
  useEffect(() => {
    if (acct.status !== 'signedIn') return;
    let alive = true;
    setRole('checking');
    isReviewer(acct.user.uid).then((ok) => { if (alive) setRole(ok ? 'reviewer' : 'not-reviewer'); });
    return () => { alive = false; };
  }, [acct.status, acct.user?.uid]);

  let body;
  if (!accountsEnabled) body = <p className="muted">Reviews need accounts, which are not switched on for this site.</p>;
  else if (acct.status === 'signedOut') body = <><p>Sign in with the account the Skilly team added as a reviewer.</p><a className="btn primary" href="#/account">Sign in</a></>;
  else if (acct.status !== 'signedIn' || role === 'checking') body = <p className="muted">Checking your reviewer access…</p>;
  else if (role === 'not-reviewer') body = <NotReviewer user={acct.user} />;
  else body = null;

  return (
    <main id="main" tabIndex={-1} className="page wrap review-page">
      <header className="page-head">
        <p className="eyebrow">Question bank</p>
        <h1>Teacher review</h1>
        <p className="muted">Check each question’s wording, marked answer and explanation. Approved questions show a “Teacher-reviewed” badge to students. If a question is edited later, it needs a fresh review.</p>
      </header>
      {body ? <section className="slab panel">{body}</section> : <Reviewer user={acct.user} />}
    </main>
  );
}

function NotReviewer({ user }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { try { await navigator.clipboard.writeText(user.uid); setCopied(true); } catch { setCopied(false); } };
  return (
    <>
      <h2>You’re not a reviewer yet</h2>
      <p>Send this reviewer ID to the Skilly team so they can add you:</p>
      <p className="row"><code className="uid">{user.uid}</code><button type="button" className="btn ghost sm" onClick={copy}>{copied ? 'Copied' : 'Copy'}</button></p>
      <p className="muted small">Signed in as {user.name || user.email || user.phone}.</p>
    </>
  );
}

function Reviewer({ user }) {
  const [lang, setLang] = useState(LANGUAGES[0].id);
  const [level, setLevel] = useState('easy');
  const [filter, setFilter] = useState('todo');
  const [reviews, setReviews] = useState(null); // null = loading
  const [error, setError] = useState('');
  const prefix = `${PREFIX[lang]}-${level}-`;

  useEffect(() => {
    let alive = true;
    setReviews(null); setError('');
    loadReviewsByPrefix(prefix).then((r) => { if (alive) setReviews(r); }).catch(() => { if (alive) { setReviews({}); setError('Couldn’t load reviews. Check your connection.'); } });
    return () => { alive = false; };
  }, [prefix]);

  const questions = useMemo(() => QUESTIONS.filter((q) => q.language === lang && q.difficulty === level), [lang, level]);
  const counts = useMemo(() => {
    const c = { approved: 0, 'needs-fix': 0, none: 0, stale: 0 };
    for (const q of questions) c[reviewState(q, reviews?.[q.id])]++;
    return c;
  }, [questions, reviews]);
  const shown = questions.filter((q) => {
    const st = reviewState(q, reviews?.[q.id]);
    return filter === 'all' || (filter === 'todo' ? st === 'none' || st === 'stale' : st === filter);
  });

  const onSaved = (id, r) => setReviews((prev) => ({ ...prev, [id]: r }));

  return (
    <>
      <section className="slab panel review-controls">
        <div className="row">
          <label className="select-wrap"><span className="small">Language</span>
            <select value={lang} onChange={(e) => setLang(e.target.value)}>{LANGUAGES.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}</select>
          </label>
          <div className="lang-toggle" role="radiogroup" aria-label="Level">
            {DIFFICULTIES.map((d) => <button key={d} type="button" role="radio" aria-checked={level === d} className={level === d ? 'on' : ''} onClick={() => setLevel(d)}>{cap(d)}</button>)}
          </div>
          <div className="lang-toggle" role="radiogroup" aria-label="Show">
            {[['todo', 'To review'], ['needs-fix', 'Needs fix'], ['approved', 'Approved'], ['all', 'All']].map(([k, l]) => <button key={k} type="button" role="radio" aria-checked={filter === k} className={filter === k ? 'on' : ''} onClick={() => setFilter(k)}>{l}</button>)}
          </div>
        </div>
        <p className="small review-progress" role="status">
          {reviews === null ? 'Loading…' : `${counts.approved} approved · ${counts['needs-fix']} need fixes · ${counts.none + counts.stale} to review · ${questions.length} in this set`}
        </p>
        <span className="pc-bar"><span style={{ width: `${(counts.approved / questions.length) * 100}%` }} /></span>
        {error && <p className="fb-error" role="alert">{error}</p>}
      </section>

      {reviews !== null && shown.length === 0 && <p className="muted center-row">Nothing here. Try another filter.</p>}
      <ol className="review-qs" role="list">
        {reviews !== null && shown.map((q) => <ReviewItem key={q.id} q={q} review={reviews[q.id]} user={user} onSaved={onSaved} />)}
      </ol>
    </>
  );
}

function ReviewItem({ q, review, user, onSaved }) {
  const state = reviewState(q, review);
  const [note, setNote] = useState(state === 'needs-fix' ? review?.note || '' : '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const save = async (status) => {
    if (status === 'needs-fix' && !note.trim()) { setError('Add a short note saying what to fix.'); return; }
    setBusy(true); setError('');
    try { onSaved(q.id, await saveReview(q, { status, note, uid: user.uid, name: user.name || user.email || 'Reviewer' })); }
    catch { setError('Couldn’t save. Are you still signed in as a reviewer?'); }
    finally { setBusy(false); }
  };

  return (
    <li className={`slab review-q ${state}`}>
      <div className="row between rq-head">
        <span className="small muted">{q.id} · {topicLabel(q.language, q.topic)}</span>
        <span className="row rq-chips">
          {isMachineChecked(q.id) && <span className="chip static mc-chip" title="The marked answer matched the real output when the code was run">✓ Run-checked</span>}
          <span className={`chip static st-chip ${state}`}>{STATE_LABEL[state]}</span>
        </span>
      </div>
      <p className="rq-prompt">{q.prompt}</p>
      {q.code && <CodeBlock code={q.code} language={q.language} />}
      <ol className="rv-opts" type="A">
        {q.options.map((o, i) => <li key={i} className={i === q.correct ? 'is-correct' : ''}>{o}{i === q.correct && <span className="tag">Marked correct</span>}</li>)}
      </ol>
      <p className="explain">{q.explanation}</p>
      {review && state !== 'none' && <p className="small muted">Last review: {STATE_LABEL[review.status] || review.status} by {review.byName}{review.note ? ` · “${review.note}”` : ''}</p>}
      <label className="fb-field"><span className="small">Note (required for “Needs fix”)</span>
        <textarea rows={2} maxLength={900} value={note} onChange={(e) => setNote(e.target.value)} placeholder="E.g. option C is also correct in Java 21; or the explanation should mention …" />
      </label>
      {error && <p className="fb-error" role="alert">{error}</p>}
      <div className="row">
        <button type="button" className="btn primary sm" disabled={busy} onClick={() => save('approved')}>✓ Approve</button>
        <button type="button" className="btn ghost sm" disabled={busy} onClick={() => save('needs-fix')}>✗ Needs fix</button>
      </div>
    </li>
  );
}
