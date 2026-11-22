import { useEffect, useRef, useState } from 'react';
import { store } from '../lib/store.js';
import { trackEvent } from '../lib/analytics.js';
import { IN_APP, isLocalDev, postForm } from '../lib/platform.js';

// Feedback goes to Netlify Forms: the hidden <form name="feedback"> in
// index.html lets Netlify detect the form at deploy time, and this component
// posts to it. Submissions appear under Forms in the Netlify dashboard.
const FORM_NAME = 'feedback';
const RATINGS = [
  { v: 1, label: 'Not useful' },
  { v: 2, label: 'A little' },
  { v: 3, label: 'Okay' },
  { v: 4, label: 'Useful' },
  { v: 5, label: 'Very useful' },
];
const MAX = 2000;

export const openFeedback = () => window.dispatchEvent(new Event('skilly:feedback'));


export function Feedback({ hidden }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | preview | error
  const [error, setError] = useState('');
  const dialogRef = useRef(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener('skilly:feedback', onOpen);
    return () => window.removeEventListener('skilly:feedback', onOpen);
  }, []);

  useEffect(() => {
    const d = dialogRef.current;
    if (open && d && !d.open) d.showModal?.();
  }, [open]);

  const close = () => {
    dialogRef.current?.close?.();
    setOpen(false);
    if (status === 'sent' || status === 'preview') {
      setRating(0); setMessage(''); setEmail(''); setStatus('idle');
    }
    setError('');
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!rating && !message.trim()) { setError('Pick a rating or write a few words first.'); return; }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError('That email address doesn’t look right. Leave it empty if you’d rather not share one.'); return; }
    setError('');
    const fields = {
      'form-name': FORM_NAME,
      rating: rating ? String(rating) : '',
      message: message.trim().slice(0, MAX),
      email: email.trim(),
      page: (location.hash || '#/').split('?')[0].replace(/\/report\/[^/]+/, '/report'),
      journey: store.get().audience || 'none',
      device: `${window.matchMedia('(pointer: coarse)').matches ? 'touch' : 'mouse'}${IN_APP ? ' · app' : ''}`,
      'bot-field': '',
    };
    if (isLocalDev()) { setStatus('preview'); return; }
    setStatus('sending');
    try {
      await postForm(fields);
      setStatus('sent');
      trackEvent('feedback-sent');
    } catch {
      setStatus('error');
      setError('It didn’t send. Check your connection and try again.');
    }
  };

  const done = status === 'sent' || status === 'preview';

  return (
    <>
      {!hidden && (
        <button type="button" className="fb-fab" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-label="Send feedback">
          <span aria-hidden="true">💬</span><span className="fb-label" aria-hidden="true">Feedback</span>
        </button>
      )}
      {open && (
        <dialog ref={dialogRef} className="dialog glass fb-dialog" aria-labelledby="fb-title" onCancel={(e) => { e.preventDefault(); close(); }}>
          {done ? (
            <div className="fb-done">
              <h2 id="fb-title">Thank you!</h2>
              {status === 'preview'
                ? <p>This is a local preview, so nothing was sent. On the live site this goes straight to the Skilly team.</p>
                : <p>We read every message. {email ? 'If you asked something, we’ll reply by email.' : ''}</p>}
              <div className="row end"><button type="button" className="btn primary" onClick={close} autoFocus>Close</button></div>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <h2 id="fb-title">Help us make Skilly better</h2>
              <fieldset className="fb-rating">
                <legend>How useful is Skilly for you?</legend>
                <div className="fb-scale">
                  {RATINGS.map((r) => (
                    <label key={r.v} className={`fb-opt${rating === r.v ? ' on' : ''}`}>
                      <input type="radio" name="rating" value={r.v} checked={rating === r.v} onChange={() => setRating(r.v)} />
                      <span className="fb-num">{r.v}</span>
                      <span className="fb-lbl">{r.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <label className="fb-field">
                <span>What should we fix, add or change?</span>
                <textarea rows={4} maxLength={MAX} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="For example: the SQL questions were too easy, or I wanted a Hindi version." />
              </label>
              <label className="fb-field">
                <span>Email <em>(optional, only if you want a reply)</em></span>
                <input type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>
              <p className="small muted">We also receive which page you were on and your journey (for example Student). Never your answers or scores.</p>
              {error && <p className="fb-error" role="alert">{error}</p>}
              <div className="row end">
                <button type="button" className="btn ghost" onClick={close}>Cancel</button>
                <button type="submit" className="btn primary" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send feedback'}</button>
              </div>
            </form>
          )}
        </dialog>
      )}
    </>
  );
}
