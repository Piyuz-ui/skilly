import { useEffect, useRef, useState } from 'react';
import { useStore } from '../lib/store.js';
import { answer, clearAnswer, goToQuestion, submitAttempt } from '../lib/actions.js';
import { navigate, useTick } from '../lib/hooks.js';
import { remainingMs } from '../lib/engine.js';
import { QUESTION_BY_ID, LANGUAGE_BY_ID, topicLabel } from '../data/questions/index.js';
import { CodeBlock } from './CodeBlock.jsx';

const LETTERS = ['A', 'B', 'C', 'D'];
const fmt = (ms) => { const s = Math.ceil(ms / 1000); return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; };

export function Test() {
  const attempt = useStore((s) => s.attempt);
  const hasLangs = useStore((s) => s.survey.languages.length > 0);
  const audience = useStore((s) => s.audience);
  const submitting = useRef(false);
  const headingRef = useRef(null);
  const [announce, setAnnounce] = useState('');
  useTick(!!attempt, 250);

  // Guards: no attempt → back to setup (or survey if no languages chosen).
  useEffect(() => {
    if (attempt) return;
    if (submitting.current) return;
    if (audience === 'beginner') navigate('/beginner', { replace: true });
    else if (!hasLangs) navigate('/survey?need=1', { replace: true });
    else navigate('/setup', { replace: true });
  }, [attempt, hasLangs, audience]);

  const remaining = attempt ? remainingMs(attempt) : 0;

  const finish = (reason) => {
    if (submitting.current) return;
    submitting.current = true;
    const id = submitAttempt(reason);
    if (id) navigate(`/report/${id}`, { replace: true });
  };

  // Auto-submit at expiry (also right away if the deadline passed while away).
  useEffect(() => { if (attempt && remaining <= 0) finish('timeout'); });

  // Screen-reader time warnings.
  const lastWarn = useRef(null);
  useEffect(() => {
    if (!attempt) return;
    const mins = Math.ceil(remaining / 60000);
    if ((mins === 5 || mins === 1) && lastWarn.current !== mins && remaining > 0) {
      lastWarn.current = mins;
      setAnnounce(`${mins} minute${mins > 1 ? 's' : ''} remaining`);
    }
  });

  const cur = attempt?.current ?? 0;
  useEffect(() => { headingRef.current?.focus({ preventScroll: true }); }, [cur]);

  if (!attempt) return null;
  const total = attempt.questionIds.length;
  const answered = attempt.questionIds.filter((id) => Number.isInteger(attempt.answers[id])).length;
  const onReview = cur >= total;
  const low = remaining < 60_000;

  return (
    <main className="page wrap test" id="main">
      <div className="test-bar slab">
        <div className="test-meta">
          <span className="pill">{onReview ? 'Review' : LANGUAGE_BY_ID[QUESTION_BY_ID[attempt.questionIds[cur]].language].label}</span>
          <span>{onReview ? `${answered} of ${total} answered` : `Question ${cur + 1} of ${total}`}</span>
        </div>
        <div className={`timer${low ? ' low' : ''}`} role="timer" aria-label={`Time remaining ${fmt(remaining)}`}>{fmt(remaining)}</div>
        <div className="progress" role="progressbar" aria-label="Answered" aria-valuemin={0} aria-valuemax={total} aria-valuenow={answered}>
          <span style={{ width: `${(answered / total) * 100}%` }} />
        </div>
        <p className="sr-only" aria-live="assertive">{announce}</p>
      </div>

      <nav className="qnav" aria-label="Questions">
        {attempt.questionIds.map((id, i) => (
          <button key={id} type="button" className={`qdot${i === cur ? ' now' : ''}${Number.isInteger(attempt.answers[id]) ? ' done' : ''}`}
            aria-label={`Question ${i + 1}${Number.isInteger(attempt.answers[id]) ? ', answered' : ', unanswered'}`} aria-current={i === cur ? 'step' : undefined}
            onClick={() => goToQuestion(i)}>{i + 1}</button>
        ))}
        <button type="button" className={`qdot review${onReview ? ' now' : ''}`} onClick={() => goToQuestion(total)}>Review</button>
      </nav>

      {onReview ? (
        <section className="slab panel quiet" aria-labelledby="review-h">
          <h1 id="review-h" ref={headingRef} tabIndex={-1}>Review and submit</h1>
          <div className="stat-row">
            <div className="stat"><b>{answered}</b><span>Answered</span></div>
            <div className="stat"><b>{total - answered}</b><span>Unanswered</span></div>
            <div className="stat"><b>{fmt(remaining)}</b><span>Time left</span></div>
          </div>
          {total - answered > 0 && (
            <>
              <p className="muted">Unanswered questions count as 0 marks. Jump back to any of them:</p>
              <ul className="chip-list" role="list">
                {attempt.questionIds.map((id, i) => !Number.isInteger(attempt.answers[id]) && (
                  <li key={id}><button type="button" className="chip" onClick={() => goToQuestion(i)}>Question {i + 1}</button></li>
                ))}
              </ul>
            </>
          )}
          <div className="row between">
            <button type="button" className="btn ghost" onClick={() => goToQuestion(total - 1)}>← Back to questions</button>
            <button type="button" className="btn primary" onClick={() => finish('manual')}>Submit test</button>
          </div>
        </section>
      ) : (
        <Question key={attempt.questionIds[cur]} attempt={attempt} index={cur} headingRef={headingRef} />
      )}
    </main>
  );
}

function Question({ attempt, index, headingRef }) {
  const id = attempt.questionIds[index];
  const q = QUESTION_BY_ID[id];
  const order = attempt.optionOrders[id];
  const chosen = attempt.answers[id];
  const total = attempt.questionIds.length;
  const lang = LANGUAGE_BY_ID[q.language];
  return (
    <section className="slab panel quiet" aria-labelledby={`q-${id}`}>
      <p className="muted small">{lang.label} · {topicLabel(q.language, q.topic)}{lang.dialectNote ? ` · ${lang.dialectNote}` : ''}</p>
      <fieldset>
        <legend>
          <h1 id={`q-${id}`} className="q-prompt" ref={headingRef} tabIndex={-1}>{q.prompt}</h1>
        </legend>
        {q.code && <CodeBlock code={q.code} language={q.language} />}
        <div className="options">
          {order.map((src, pos) => (
            <label key={src} className={`option${chosen === src ? ' on' : ''}`}>
              <input type="radio" name={`ans-${id}`} checked={chosen === src} onChange={() => answer(id, src)} />
              <span className="letter" aria-hidden="true">{LETTERS[pos]}</span>
              <span className="opt-text">{q.options[src]}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="row between">
        <button type="button" className="btn ghost" disabled={index === 0} onClick={() => goToQuestion(index - 1)}>← Previous</button>
        {Number.isInteger(chosen) && <button type="button" className="link small" onClick={() => clearAnswer(id)}>Clear answer</button>}
        <button type="button" className="btn primary" onClick={() => goToQuestion(index + 1)}>{index === total - 1 ? 'Review and submit →' : 'Next →'}</button>
      </div>
    </section>
  );
}
