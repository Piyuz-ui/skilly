import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../lib/store.js';
import { answerReview } from '../lib/actions.js';
import { QUESTION_BY_ID, LANGUAGE_BY_ID, topicLabel } from '../data/questions/index.js';
import { dueIds, upcomingIds, reviewStats, MASTERED, SESSION_SIZE } from '../lib/revise.js';
import { dayKey } from '../lib/streak.js';
import { trackEvent } from '../lib/analytics.js';
import { CodeBlock } from './CodeBlock.jsx';

const LETTERS = ['A', 'B', 'C', 'D'];
const exists = (id) => Boolean(QUESTION_BY_ID[id]);
const shuffled = (n) => {
  const a = [...Array(n).keys()];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};
const niceDay = (key) => {
  const today = dayKey();
  const tomorrow = dayKey(new Date(Date.now() + 864e5));
  if (key === today) return 'today';
  if (key === tomorrow) return 'tomorrow';
  return new Date(`${key}T12:00:00`).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' });
};

// "Fix my mistakes": a short daily quiz made from questions the learner
// missed in tests. Right answers come back after longer and longer gaps;
// wrong ones come back tomorrow. See lib/revise.js.
export function Revise() {
  const review = useStore((s) => s.review);
  const today = dayKey();
  const stats = useMemo(() => reviewStats(review, today), [review, today]);
  // The session's questions are fixed when it starts, so grading an answer
  // doesn't reshuffle what's on screen.
  const [session, setSession] = useState(() => {
    const ids = dueIds(review, today, { exists });
    return ids.length ? { ids, extra: false, n: 0 } : null;
  });

  // "Review more" takes only what's due; "Practise anyway" takes the next
  // ones coming up.
  const start = (extra) => setSession((prev) => ({
    ids: extra ? upcomingIds(review, { exists }) : dueIds(review, dayKey(), { exists }),
    extra,
    n: (prev?.n || 0) + 1,
  }));

  return (
    <main id="main" tabIndex={-1} className="page wrap revise-page">
      <header className="page-head">
        <p className="eyebrow">Daily review</p>
        <h1>Fix my mistakes</h1>
        <p className="muted">Questions you missed in tests come back here. Get one right and it returns after a longer gap: 1, 3, 7, then 14 days. Get it right five times in a row and it’s mastered. Get it wrong and you’ll see it again tomorrow.</p>
      </header>
      {session && session.ids.length
        ? <Session key={session.n} ids={session.ids} extra={session.extra} onMore={() => start(false)} onExtra={() => start(true)} stats={stats} />
        : <Empty stats={stats} onExtra={() => start(true)} />}
    </main>
  );
}

function Empty({ stats, onExtra }) {
  if (!stats.learning && !stats.mastered) {
    return (
      <section className="slab panel revise-empty">
        <h2>Nothing to review yet</h2>
        <p>Take a test. Any question you miss lands here, ready for a quick daily review.</p>
        <a className="btn primary" href="#/">Take a test</a>
      </section>
    );
  }
  return (
    <section className="slab panel revise-empty">
      <h2>{stats.learning ? 'All done for today 🎉' : 'Every mistake mastered 🏆'}</h2>
      <Stats stats={stats} />
      {stats.next && <p className="muted">Next review: {niceDay(stats.next)}.</p>}
      <div className="row">
        {stats.learning > 0 && <button type="button" className="btn ghost" onClick={onExtra}>Practise anyway</button>}
        <a className="btn ghost" href="#/">Take another test</a>
      </div>
    </section>
  );
}

function Stats({ stats }) {
  return (
    <div className="stat-row">
      <div className="stat"><b>{stats.due}</b><span>Due today</span></div>
      <div className="stat"><b>{stats.learning}</b><span>Still learning</span></div>
      <div className="stat"><b>{stats.mastered}</b><span>Mastered</span></div>
    </div>
  );
}

function Session({ ids, extra, onMore, onExtra, stats }) {
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState({}); // id -> true | false
  const headingRef = useRef(null);
  const done = index >= ids.length;
  const right = Object.values(results).filter(Boolean).length;

  useEffect(() => { headingRef.current?.focus({ preventScroll: true }); }, [index]);
  useEffect(() => { if (done) trackEvent(extra ? 'revise-extra-done' : 'revise-done'); }, [done, extra]);

  if (done) {
    const missed = ids.length - right;
    return (
      <section className="slab panel revise-done" aria-labelledby="rv-done">
        <h2 id="rv-done" ref={headingRef} tabIndex={-1}>{right === ids.length ? 'All correct!' : `${right} of ${ids.length} right`}</h2>
        <p>{missed ? `The ${missed === 1 ? 'one you missed comes' : `${missed} you missed come`} back tomorrow.` : 'Each one moves up a step and comes back after a longer gap.'}</p>
        <Stats stats={stats} />
        <div className="row">
          {stats.due > 0 && <button type="button" className="btn primary" onClick={onMore}>Review {Math.min(stats.due, SESSION_SIZE)} more</button>}
          {!stats.due && stats.learning > 0 && <button type="button" className="btn ghost" onClick={onExtra}>Practise anyway</button>}
          <a className="btn ghost" href="#/">Back home</a>
        </div>
      </section>
    );
  }

  const id = ids[index];
  return (
    <>
      <div className="revise-progress" aria-hidden="true">
        {ids.map((x, i) => <span key={x} className={i < index ? (results[x] ? 'ok' : 'bad') : i === index ? 'now' : ''} />)}
      </div>
      <Card key={id} id={id} n={index + 1} total={ids.length} headingRef={headingRef}
        onAnswer={(ok) => { setResults((r) => ({ ...r, [id]: ok })); answerReview(id, ok); }}
        onNext={() => setIndex((i) => i + 1)} last={index === ids.length - 1} />
    </>
  );
}

function Card({ id, n, total, headingRef, onAnswer, onNext, last }) {
  const q = QUESTION_BY_ID[id];
  const entry = useStore((s) => s.review[id]);
  const order = useMemo(() => shuffled(q.options.length), [id]);
  const [chosen, setChosen] = useState(null);
  const answered = chosen !== null;
  const ok = chosen === q.correct;
  const nextRef = useRef(null);

  const pick = (src) => {
    if (answered) return;
    setChosen(src);
    onAnswer(src === q.correct);
  };
  useEffect(() => { if (answered) nextRef.current?.focus({ preventScroll: true }); }, [answered]);

  return (
    <section className="slab panel quiet revise-card" aria-labelledby={`rq-${id}`}>
      <p className="muted small">Question {n} of {total} · {LANGUAGE_BY_ID[q.language].label} · {topicLabel(q.language, q.topic)}{entry && entry.wrong > 1 ? ` · missed ${entry.wrong} times` : ''}</p>
      <fieldset disabled={answered}>
        <legend><h2 id={`rq-${id}`} className="q-prompt" ref={headingRef} tabIndex={-1}>{q.prompt}</h2></legend>
        {q.code && <CodeBlock code={q.code} language={q.language} />}
        <div className="options">
          {order.map((src, pos) => {
            const cls = !answered ? '' : src === q.correct ? ' right' : src === chosen ? ' wrong' : '';
            return (
              <label key={src} className={`option${cls}${chosen === src ? ' on' : ''}`}>
                <input type="radio" name={`rv-${id}`} checked={chosen === src} onChange={() => pick(src)} />
                <span className="letter" aria-hidden="true">{LETTERS[pos]}</span>
                <span className="opt-text">{q.options[src]}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
      {answered && (
        <div className="revise-feedback" role="status">
          <p className={ok ? 'ok-text' : 'bad-text'}><strong>{ok ? 'Correct.' : `Not quite. The answer is ${LETTERS[order.indexOf(q.correct)]}.`}</strong> {ok ? nextGap(entry) : 'It comes back tomorrow.'}</p>
          <p className="explain">{q.explanation}</p>
          <div className="row end">
            <button type="button" ref={nextRef} className="btn primary" onClick={onNext}>{last ? 'Finish' : 'Next question →'}</button>
          </div>
        </div>
      )}
    </section>
  );
}

function nextGap(entry) {
  if (!entry) return '';
  if (entry.box >= MASTERED) return 'Mastered, so it leaves your review pile.';
  const days = Math.round((new Date(`${entry.due}T12:00:00`) - new Date(`${dayKey()}T12:00:00`)) / 864e5);
  return `See you again in ${days} day${days === 1 ? '' : 's'}.`;
}
