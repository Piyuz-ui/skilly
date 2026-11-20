import { useState } from 'react';
import { useStore } from '../lib/store.js';
import { ensureBeginnerPlan, chooseAudience } from '../lib/actions.js';
import { navigate } from '../lib/hooks.js';
import { BEGINNER_PROFILES, BEGINNER_GOALS } from '../lib/roadmap.js';
import { LANGUAGE_BY_ID } from '../data/questions/index.js';
import { LANGUAGE_IDS } from '../lib/engine.js';

// Beginner step 1: choose the language to learn first. No test, no score.
export function BeginnerPick() {
  const plans = useStore((s) => s.plans);
  const [goal, setGoal] = useState(null);
  const suggested = goal ? BEGINNER_GOALS.find((g) => g.label === goal)?.lang : null;

  const start = (lang) => {
    chooseAudience('beginner');
    ensureBeginnerPlan(lang);
    navigate('/plan');
  };

  return (
    <main className="page wrap" id="main">
      <p className="step">Beginner · step 1 of 1 · no test needed</p>
      <section className="slab panel">
        <h1>Which language do you want to learn first?</h1>
        <p className="muted">Pick one and you get a four-week starter path straight away, with courses, weekly tasks and optional quizzes. You can switch later. Your progress in each language is kept.</p>

        <fieldset className="goal-pick">
          <legend>Not sure? What do you want to build?</legend>
          <div className="chip-list" role="radiogroup" aria-label="Your goal">
            {BEGINNER_GOALS.map((g) => (
              <button key={g.label} type="button" role="radio" aria-checked={goal === g.label} className={`chip goal${goal === g.label ? ' on' : ''}`} onClick={() => setGoal(goal === g.label ? null : g.label)}>{g.label}</button>
            ))}
          </div>
          {suggested && (
            <p className="suggest" role="status">
              For <b>{goal}</b>, start with <b>{LANGUAGE_BY_ID[suggested].label}</b>. <button type="button" className="btn primary sm" onClick={() => start(suggested)}>Start with {LANGUAGE_BY_ID[suggested].label} →</button>
            </p>
          )}
        </fieldset>

        <ul className="lang-pick" role="list">
          {LANGUAGE_IDS.map((id) => {
            const started = !!plans[`beginner-${id}`];
            return (
              <li key={id}>
                <button type="button" className={`lp-card fx-glow${suggested === id ? ' suggested' : ''}`} onClick={() => start(id)}>
                  <span className="lp-name">{LANGUAGE_BY_ID[id].label}</span>
                  <span className="lp-for">{BEGINNER_PROFILES[id].goodFor}</span>
                  {started && <span className="lp-badge">In progress</span>}
                  {suggested === id && <span className="lp-badge rec">Recommended</span>}
                </button>
              </li>
            );
          })}
        </ul>
        <div className="row between">
          <button type="button" className="btn ghost" onClick={() => navigate('/')}>← Change path</button>
          <a className="link" href="#/paths">Or browse whole career paths</a>
        </div>
      </section>
    </main>
  );
}
