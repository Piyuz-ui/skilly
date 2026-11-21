import { useStore } from '../lib/store.js';
import { breakdown, levelSummary } from '../lib/engine.js';
import { setActivePlan, prepareReassess, chooseAudience } from '../lib/actions.js';
import { navigate } from '../lib/hooks.js';
import { QUESTION_BY_ID, LANGUAGE_BY_ID, topicLabel } from '../data/questions/index.js';
import { CodeBlock } from './CodeBlock.jsx';
import { useEffect, useState } from 'react';
import { fetchReviews, reviewState, isMachineChecked } from '../lib/reviews.js';
import { ReportIssue } from './ReportIssue.jsx';
import { ShareButton } from './ShareCard.jsx';
import { reportCard } from '../lib/shareCard.js';

const LETTERS = ['A', 'B', 'C', 'D'];
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
const STATUS = { correct: 'Correct', incorrect: 'Incorrect', unanswered: 'Not answered' };

export function Report({ id }) {
  const report = useStore((s) => s.reports.find((r) => r.id === id));
  const hasPlan = useStore((s) => !!s.plans[id]);
  // Teacher reviews for the questions in this report (light public read).
  const [reviews, setReviews] = useState({});
  useEffect(() => {
    let alive = true;
    if (report) fetchReviews(report.items.map((it) => it.id)).then((r) => { if (alive) setReviews(r); });
    return () => { alive = false; };
  }, [report?.id]);
  if (!report) {
    return (
      <main className="page wrap narrow" id="main">
        <div className="slab panel"><h1>Report not found</h1><p className="muted">It may have been cleared from this browser.</p>
          <button type="button" className="btn primary" onClick={() => navigate('/')}>Back to start</button></div>
      </main>
    );
  }
  const { languages, topics } = breakdown(report);
  const level = levelSummary(report);
  const date = new Date(report.submittedAt).toLocaleString();

  const openPlan = () => { setActivePlan(report.id); navigate('/plan'); };
  const retake = (difficulty) => {
    chooseAudience(report.audience);
    prepareReassess({ languages: report.languages, difficulty });
    navigate('/setup');
  };

  return (
    <main className="page wrap" id="main">
      <header className="page-head">
        <p className="step">Assessment report · {cap(report.audience)} · {cap(report.difficulty)} · {report.duration} min</p>
        <h1>Your results</h1>
        <p className="muted small">{report.languages.map((l) => LANGUAGE_BY_ID[l].label).join(', ')} · submitted {date}{report.reason === 'timeout' ? ' · auto-submitted when time ran out' : ''}</p>
      </header>

      <section className="stats" aria-label="Score summary">
        <div className="stat big slab"><b>{report.marks}/{report.total}</b><span>Marks</span></div>
        <div className="stat big slab"><b>{report.accuracy}%</b><span>Accuracy: {report.correct} correct ÷ {report.total} questions</span></div>
        <div className="stat slab"><b>{report.correct}</b><span>Correct</span></div>
        <div className="stat slab"><b>{report.incorrect}</b><span>Incorrect</span></div>
        <div className="stat slab"><b>{report.unanswered}</b><span>Unanswered</span></div>
        <div className="stat slab"><b>{report.total}</b><span>Total questions</span></div>
      </section>

      <section className="slab panel level" aria-labelledby="lvl">
        <p className="eyebrow-sm">What level am I at?</p>
        <h2 id="lvl">{level.headline}</h2>
        <p>{level.body}</p>
        <div className="row">
          {hasPlan && <button type="button" className="btn primary" onClick={openPlan}>Open my roadmap →</button>}
          {['medium', 'hard'].includes(level.next) && <button type="button" className="btn ghost" onClick={() => retake(level.next)}>Try {cap(level.next)}</button>}
          {level.next === 'easier' && <button type="button" className="btn ghost" onClick={() => retake('easy')}>Take an Easy baseline</button>}
          {level.next === 'reassess' && <button type="button" className="btn ghost" onClick={() => retake(report.difficulty)}>Reassess</button>}
          {report.unanswered < report.total && <ShareButton kind="report" label="Share result" getCard={() => reportCard(report)} />}
        </div>
      </section>

      <section className="grid-2">
        <div className="slab panel">
          <h2>By language</h2>
          <ul className="bars" role="list">
            {languages.map((l) => (
              <li key={l.language}>
                <div className="bar-label"><span>{l.label}</span><span>{l.correct} of {l.total} correct · {pct(l.correct, l.total)}%</span></div>
                <div className="bar" aria-hidden="true"><span className="ok" style={{ width: `${pct(l.correct, l.total)}%` }} /><span className="bad" style={{ width: `${pct(l.incorrect, l.total)}%` }} /></div>
                <div className="muted small">{l.incorrect} incorrect · {l.unanswered} unanswered</div>
              </li>
            ))}
          </ul>
        </div>
        <div className="slab panel">
          <h2>By topic</h2>
          <ul className="topic-list" role="list">
            {topics.map((t) => (
              <li key={t.key} className={t.correct === t.total ? 'good' : t.incorrect + t.unanswered >= 2 ? 'weak' : ''}>
                <span>{LANGUAGE_BY_ID[t.language].label} · {t.label}</span>
                <span className="nums">
                  {t.correct} of {t.total} correct
                  {t.incorrect ? ` · ${t.incorrect} incorrect` : ''}{t.unanswered ? ` · ${t.unanswered} unanswered` : ''}
                  {t.total === 1 && <em className="thin"> · 1 question — needs more evidence</em>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="slab panel" aria-labelledby="rev">
        <h2 id="rev">Answer review</h2>
        <p className="muted small">Options are shown in the order you saw them.</p>
        <div className="review-list">
          {report.items.map((it, i) => {
            const q = QUESTION_BY_ID[it.id];
            const pos = (src) => LETTERS[it.order.indexOf(src)];
            return (
              <details key={it.id} className={`review ${it.status}`}>
                <summary>
                  <span className={`badge ${it.status}`}>{STATUS[it.status]}</span>
                  <span className="rv-q">Q{i + 1}. {q.prompt}</span>
                  <span className="muted small">{LANGUAGE_BY_ID[q.language].label} · {topicLabel(q.language, q.topic)}</span>
                </summary>
                <div className="rv-body">
                  {q.code && <CodeBlock code={q.code} language={q.language} />}
                  <ol className="rv-opts" type="A">
                    {it.order.map((src) => (
                      <li key={src} className={`${src === q.correct ? 'is-correct' : ''}${src === it.chosen && src !== q.correct ? ' is-wrong' : ''}`}>
                        {q.options[src]}
                        {src === q.correct && <span className="tag">Correct answer</span>}
                        {src === it.chosen && <span className="tag">Your answer</span>}
                      </li>
                    ))}
                  </ol>
                  <p><strong>Your answer:</strong> {it.chosen === null ? 'Not answered' : `${pos(it.chosen)}. ${q.options[it.chosen]}`}</p>
                  <p><strong>Correct answer:</strong> {pos(q.correct)}. {q.options[q.correct]}</p>
                  <p className="explain">{q.explanation}</p>
                  <div className="row rv-trust">
                    {reviewState(q, reviews[q.id]) === 'approved' && <span className="chip static trust-chip">✓ Teacher-reviewed</span>}
                    {isMachineChecked(q.id) && <span className="chip static trust-chip" title="We ran this code and the marked answer matched the real output.">✓ Answer checked by running the code</span>}
                    <ReportIssue question={q} />
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      </section>

      <div className="row center">
        {hasPlan && <button type="button" className="btn primary" onClick={openPlan}>Open my roadmap →</button>}
        <button type="button" className="btn ghost" onClick={() => retake(report.difficulty)}>Take another test</button>
      </div>
    </main>
  );
}
