import { useEffect, useRef, useState } from 'react';
import { useStore } from '../lib/store.js';
import { setLanguages, setSetup, startTest, discardAttempt } from '../lib/actions.js';
import { navigate } from '../lib/hooks.js';
import { LANGUAGES } from '../data/questions/index.js';
import { LANGUAGE_IDS, QUESTION_COUNT, DURATIONS, allowedDifficulties } from '../lib/engine.js';
import { useConfirm } from './Confirm.jsx';

const ORDERED = LANGUAGE_IDS.map((id) => LANGUAGES.find((l) => l.id === id));
const DIFF_COPY = {
  easy: 'Fundamentals and short code reading.',
  medium: 'Apply concepts, diagnose bugs, trace behaviour.',
  hard: 'Edge cases, trade-offs and deeper reasoning.',
};
const cap = (s) => s[0].toUpperCase() + s.slice(1);

function useAssessmentGuard() {
  const audience = useStore((s) => s.audience);
  useEffect(() => {
    if (audience === 'beginner') navigate('/beginner', { replace: true });
    else if (!audience) navigate('/', { replace: true });
  }, [audience]);
  return audience === 'professional' || audience === 'student';
}

export function Survey({ needNotice }) {
  const ok = useAssessmentGuard();
  const saved = useStore((s) => s.survey.languages);
  const audience = useStore((s) => s.audience);
  const [selected, setSelected] = useState(saved);
  const [error, setError] = useState(needNotice ? 'Pick at least one language before setting up your test.' : '');
  const errRef = useRef(null);

  useEffect(() => { if (error) errRef.current?.focus(); }, [error]);
  if (!ok) return null;

  const toggle = (id) => {
    const next = selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id];
    setSelected(next);
    setLanguages(next);
    if (next.length) setError('');
  };
  const cont = () => {
    if (!selected.length) { setError('Select at least one language to continue.'); return; }
    navigate('/setup');
  };

  return (
    <main className="page wrap narrow" id="main">
      <p className="step">Step 1 of 2 · {cap(audience)} path</p>
      <form className="slab panel" onSubmit={(e) => { e.preventDefault(); cont(); }} noValidate>
        <fieldset aria-describedby="lang-help lang-err">
          <legend><h1>Which languages do you already use?</h1></legend>
          <p id="lang-help" className="muted">Choose one or more. Your test will only include the languages you pick.</p>
          <div className="lang-grid">
            {ORDERED.map((l) => {
              const on = selected.includes(l.id);
              return (
                <label key={l.id} className={`check-tile${on ? ' on' : ''}`}>
                  <input type="checkbox" checked={on} onChange={() => toggle(l.id)} />
                  <span className="tick" aria-hidden="true">{on ? '✓' : ''}</span>
                  <span>{l.label}</span>
                </label>
              );
            })}
          </div>
          <p id="lang-err" className="error" role="alert" tabIndex={-1} ref={errRef}>{error}</p>
        </fieldset>
        <div className="row between">
          <button type="button" className="btn ghost" onClick={() => navigate('/')}>← Change path</button>
          <button type="submit" className="btn primary" aria-disabled={!selected.length}>Continue</button>
        </div>
      </form>
    </main>
  );
}

export function Setup() {
  const ok = useAssessmentGuard();
  const s = useStore();
  const confirm = useConfirm();
  const [error, setError] = useState('');
  const { audience, survey, attempt } = s;
  const allowed = allowedDifficulties(audience);

  useEffect(() => {
    if (ok && !survey.languages.length) navigate('/survey?need=1', { replace: true });
  }, [ok, survey.languages.length]);
  // Defensive: never keep a difficulty this path can't use.
  useEffect(() => {
    if (ok && survey.difficulty && !allowed.includes(survey.difficulty)) setSetup({ difficulty: null });
  }, [ok, survey.difficulty, allowed]);

  if (!ok || !survey.languages.length) return null;

  const names = survey.languages.map((id) => LANGUAGES.find((l) => l.id === id)?.label).join(', ');
  const ready = survey.duration && allowed.includes(survey.difficulty);

  const start = async () => {
    if (attempt) {
      const yes = await confirm({ title: 'Replace your test in progress?', body: 'Starting a new test discards the unfinished one. Completed reports stay saved.', ok: 'Discard and start new', danger: true });
      if (!yes) return;
      discardAttempt();
    }
    const res = startTest();
    if (res.error) { setError(res.error); return; }
    navigate('/test');
  };

  return (
    <main className="page wrap narrow" id="main">
      <p className="step">Step 2 of 2 · {cap(audience)} path</p>
      <div className="slab panel">
        <h1>Set up your test</h1>
        <fieldset className="choice-group">
          <legend>Duration</legend>
          <div className="seg">
            {DURATIONS.map((d) => (
              <label key={d} className={`seg-opt${survey.duration === d ? ' on' : ''}`}>
                <input type="radio" name="duration" checked={survey.duration === d} onChange={() => setSetup({ duration: d })} />
                <strong>{d} min</strong><span>{QUESTION_COUNT[d]} questions</span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="choice-group">
          <legend>Difficulty</legend>
          {audience === 'student' && <p className="muted small">The Student path offers Easy and Medium.</p>}
          <div className="seg">
            {allowed.map((d) => (
              <label key={d} className={`seg-opt${survey.difficulty === d ? ' on' : ''}`}>
                <input type="radio" name="difficulty" checked={survey.difficulty === d} onChange={() => setSetup({ difficulty: d })} />
                <strong>{cap(d)}</strong><span>{DIFF_COPY[d]}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <section className="summary" aria-live="polite" aria-label="Test summary">
          <h2>Summary</h2>
          <dl>
            <div><dt>Languages</dt><dd>{names} <button type="button" className="link small" onClick={() => navigate('/survey')}>Edit</button></dd></div>
            <div><dt>Difficulty</dt><dd>{survey.difficulty && allowed.includes(survey.difficulty) ? cap(survey.difficulty) : '—'}</dd></div>
            <div><dt>Duration</dt><dd>{survey.duration ? `${survey.duration} minutes` : '—'}</dd></div>
            <div><dt>Questions</dt><dd>{survey.duration ? `${QUESTION_COUNT[survey.duration]} questions` : '—'}</dd></div>
          </dl>
          <p className="muted small">The clock starts only when you press Start test. You can move between questions and review before submitting. The test submits automatically when time runs out.</p>
        </section>
        {error && <p className="error" role="alert">{error}</p>}
        <div className="row between">
          <button type="button" className="btn ghost" onClick={() => navigate('/survey')}>← Languages</button>
          {attempt
            ? <span className="row"><button type="button" className="btn ghost" onClick={() => navigate('/test')}>Resume current test</button><button type="button" className="btn primary" disabled={!ready} onClick={start}>Start new test</button></span>
            : <button type="button" className="btn primary" disabled={!ready} onClick={start}>Start test</button>}
        </div>
      </div>
    </main>
  );
}
