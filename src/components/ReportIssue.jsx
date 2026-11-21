import { useEffect, useRef, useState } from 'react';
import { trackEvent } from '../lib/analytics.js';

// "Report a problem" for one question. Sends to Netlify Forms (form name
// "question-report", declared in index.html), so no sign-in is needed.
const ISSUES = [
  ['wrong-answer', 'The marked answer is wrong'],
  ['unclear', 'The question is unclear'],
  ['typo', 'Typo or formatting problem'],
  ['other', 'Something else'],
];
const isLocal = () => /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);

export function ReportIssue({ question }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="link small report-q" onClick={() => setOpen(true)} aria-haspopup="dialog">⚑ Report a problem</button>
      {open && <IssueDialog q={question} onClose={() => setOpen(false)} />}
    </>
  );
}

function IssueDialog({ q, onClose }) {
  const ref = useRef(null);
  const [issue, setIssue] = useState('wrong-answer');
  const [note, setNote] = useState('');
  const [state, setState] = useState('idle'); // idle | sending | sent | preview | error
  useEffect(() => { ref.current?.showModal?.(); }, []);
  const close = () => { ref.current?.close?.(); onClose(); };

  const submit = async (e) => {
    e.preventDefault();
    if (issue === 'other' && !note.trim()) { setState('need-note'); return; }
    if (isLocal()) { setState('preview'); return; }
    setState('sending');
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ 'form-name': 'question-report', question: q.id, language: q.language, issue, note: note.trim().slice(0, 1500), 'bot-field': '' }).toString(),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState('sent');
      trackEvent('question-report');
    } catch { setState('error'); }
  };

  return (
    <dialog ref={ref} className="dialog glass fb-dialog" aria-labelledby="ri-title" onCancel={(e) => { e.preventDefault(); close(); }}>
      {state === 'sent' || state === 'preview' ? (
        <div className="fb-done">
          <h2 id="ri-title">Thanks for flagging it</h2>
          <p>{state === 'preview' ? 'Local preview: nothing was sent.' : `A reviewer will check question ${q.id}.`}</p>
          <div className="row end"><button type="button" className="btn primary" onClick={close} autoFocus>Close</button></div>
        </div>
      ) : (
        <form onSubmit={submit} noValidate>
          <h2 id="ri-title">Report a problem</h2>
          <p className="muted small">Question {q.id}: {q.prompt}</p>
          <fieldset className="ri-issues">
            <legend className="small">What’s wrong?</legend>
            {ISSUES.map(([k, l]) => (
              <label key={k} className={`seg-opt${issue === k ? ' on' : ''}`}>
                <input type="radio" name="issue" value={k} checked={issue === k} onChange={() => setIssue(k)} />
                <strong>{l}</strong>
              </label>
            ))}
          </fieldset>
          <label className="fb-field"><span>Details {issue === 'other' ? '' : <em>(optional)</em>}</span>
            <textarea rows={3} maxLength={1500} value={note} onChange={(e) => setNote(e.target.value)} placeholder="E.g. I ran the code and it prints 4, not 3." />
          </label>
          {state === 'need-note' && <p className="fb-error" role="alert">Please describe the problem.</p>}
          {state === 'error' && <p className="fb-error" role="alert">It didn’t send. Check your connection and try again.</p>}
          <div className="row end">
            <button type="button" className="btn ghost" onClick={close}>Cancel</button>
            <button type="submit" className="btn primary" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Send report'}</button>
          </div>
        </form>
      )}
    </dialog>
  );
}
