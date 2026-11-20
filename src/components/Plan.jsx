import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../lib/store.js';
import { ensureBeginnerPlan, setActivePlan, toggleTask, quizAnswer, quizSubmit, quizRetake, prepareReassess, chooseAudience } from '../lib/actions.js';
import { navigate, useReducedMotion } from '../lib/hooks.js';
import { weekProgress, currentWeekIndex } from '../lib/roadmap.js';
import { LANGUAGE_IDS } from '../lib/engine.js';
import { useCatalog, matchCourses, builtinActivities, hasCourseRepo } from '../lib/courses.js';
import { QUESTION_BY_ID, LANGUAGE_BY_ID, topicLabel } from '../data/questions/index.js';
import { CodeBlock } from './CodeBlock.jsx';

const LETTERS = ['A', 'B', 'C', 'D'];
const KIND = { practice: 'Practice', foundation: 'Foundation', extension: 'Extension', reassess: 'Reassess', starter: 'Starter', project: 'Project' };

export function Plan() {
  const s = useStore();
  const { plans, activePlanId, audience, reports } = s;

  useEffect(() => {
    if (activePlanId && plans[activePlanId]) return;
    if (audience === 'beginner') navigate('/beginner', { replace: true });
    else {
      const latest = Object.values(plans).sort((a, b) => b.createdAt - a.createdAt)[0];
      if (latest) setActivePlan(latest.id);
    }
  }, [activePlanId, plans, audience]);

  const plan = plans[activePlanId];
  if (!plan) {
    return (
      <main className="page wrap narrow" id="main">
        <div className="slab panel">
          <h1>No roadmap yet</h1>
          <p className="muted">Take an assessment to get a roadmap built from your results, or choose Beginner to start the starter path straight away.</p>
          <button type="button" className="btn primary" onClick={() => navigate('/')}>Choose a path</button>
        </div>
      </main>
    );
  }
  return <PlanView key={plan.id} plan={plan} plans={plans} reports={reports} />;
}

function PlanView({ plan, plans, reports }) {
  const reduced = useReducedMotion();
  const current = currentWeekIndex(plan);
  const [sel, setSel] = useState(current);
  const tabRefs = useRef([]);
  const panelHead = useRef(null);
  const week = plan.weeks[sel] || plan.weeks[0];
  const catalog = useCatalog();
  const report = plan.reportId ? reports.find((r) => r.id === plan.reportId) : null;
  const isBeginner = plan.source === 'beginner';

  const select = (i, { focusTab = false, focusPanel = false } = {}) => {
    const n = Math.max(0, Math.min(plan.weeks.length - 1, i));
    setSel(n);
    const t = tabRefs.current[n]; // every tab is always rendered, so focus can move now
    if (focusTab) t?.focus({ preventScroll: true });
    t?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
    if (focusPanel) setTimeout(() => { panelHead.current?.focus({ preventScroll: true }); panelHead.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }); }, 30);
  };
  useEffect(() => { tabRefs.current[sel]?.scrollIntoView({ block: 'nearest', inline: 'center' }); }, []); // eslint-disable-line

  const onKey = (e) => {
    const map = { ArrowRight: sel + 1, ArrowLeft: sel - 1, Home: 0, End: plan.weeks.length - 1 };
    if (e.key in map) { e.preventDefault(); select(map[e.key], { focusTab: true }); }
  };

  const otherPlans = Object.values(plans).sort((a, b) => b.createdAt - a.createdAt);
  const allCourses = useMemo(() => collectCourses(plan, catalog), [plan, catalog]);
  const complete = plan.weeks.filter((w) => weekProgress(plan, w).complete).length;

  return (
    <main className="page wrap" id="main">
      <header className="page-head row between wrap-row">
        <div>
          <p className="step">{isBeginner ? 'Beginner · starter path' : `Roadmap from your ${report ? report.difficulty : ''} assessment`}</p>
          <h1>{isBeginner ? 'Here’s what you can practise this week' : plan.title}</h1>
          <p className="muted small">{complete} of {plan.weeks.length} milestones complete{report ? ` · built from ${report.correct}/${report.total} marks` : ''}</p>
        </div>
        <div className="row">
          {isBeginner && (
            <label className="select-wrap">
              <span className="small muted">Learning language </span>
              <select id="beginner-lang" value={plan.language} onChange={(e) => ensureBeginnerPlan(e.target.value)}>
                {LANGUAGE_IDS.map((l) => <option key={l} value={l}>{LANGUAGE_BY_ID[l].label}</option>)}
              </select>
            </label>
          )}
          {otherPlans.length > 1 && (
            <label className="select-wrap">
              <span className="sr-only">Switch roadmap</span>
              <select value={plan.id} onChange={(e) => setActivePlan(e.target.value)}>
                {otherPlans.map((p) => <option key={p.id} value={p.id}>{p.title}{p.source === 'report' ? ` · ${new Date(p.createdAt).toLocaleDateString()}` : ''}</option>)}
              </select>
            </label>
          )}
          {report && <button type="button" className="btn ghost" onClick={() => navigate(`/report/${report.id}`)}>View report</button>}
        </div>
      </header>

      {isBeginner && (
        <section className="slab panel start-card">
          <div>
            <h2>Start with week one: {plan.weeks[0].title}</h2>
            <p className="muted">{plan.weeks[0].goal} No profile, survey or score needed. Quizzes are optional.</p>
          </div>
          <button type="button" className="btn primary" onClick={() => select(0, { focusPanel: true })}>Start week one →</button>
        </section>
      )}

      <section className="roadmap" aria-label="Weekly roadmap">
        <button type="button" className="track-nav prev" onClick={() => select(sel - 1, { focusTab: false })} disabled={sel === 0} aria-label="Previous week">‹</button>
        <ol className="track" role="tablist" aria-label="Weeks" onKeyDown={onKey}>
          {plan.weeks.map((w, i) => {
            const p = weekProgress(plan, w);
            const frac = p.totalTasks ? p.doneTasks / p.totalTasks : 0;
            return (
              <li key={w.id} role="presentation" className="milestone">
                <button ref={(el) => (tabRefs.current[i] = el)} type="button" role="tab" id={`tab-${w.id}`} aria-controls={`panel-${w.id}`}
                  aria-selected={i === sel} tabIndex={i === sel ? 0 : -1}
                  className={`mbubble${i === current && !p.complete ? ' pulse' : ''}${p.complete ? ' done' : ''}${i === sel ? ' sel' : ''}`}
                  onClick={() => select(i)}>
                  <span className="ring" style={{ '--p': frac }} aria-hidden="true" />
                  <span className="mnum">{p.complete ? '✓' : `W${i + 1}`}</span>
                </button>
                <span className="mlabel" aria-hidden="true"><b>Week {i + 1}</b>{w.title}</span>
                <span className="sr-only">{w.title}{p.complete ? ', complete' : i === current ? ', current week' : ''}</span>
              </li>
            );
          })}
        </ol>
        <button type="button" className="track-nav next" onClick={() => select(sel + 1)} disabled={sel === plan.weeks.length - 1} aria-label="Next week">›</button>
      </section>

      <WeekPanel plan={plan} week={week} index={sel} catalog={catalog} headRef={panelHead} report={report} />

      <section className="courses-all" aria-labelledby="crs">
        <h2 id="crs">Recommended courses</h2>
        <CourseSourceNote catalog={catalog} />
        <div className="course-grid">
          {allCourses.map((c) => <CourseCard key={c.id} course={c} />)}
        </div>
      </section>
    </main>
  );
}

function CourseSourceNote({ catalog }) {
  if (!hasCourseRepo() || !catalog?.source) {
    return <p className="muted small">No course repository is configured (see <code>src/config.js</code>), so these are Skilly’s built-in practice activities, not GitHub courses.</p>;
  }
  return (
    <p className="muted small">
      Matched from roadmap.sh’s open-source catalog (<a href={catalog.source} target="_blank" rel="noreferrer">{catalog.source.replace('https://', '')}</a>), cached {new Date(catalog.generatedAt).toLocaleDateString()}. Titles and links are the originals.
    </p>
  );
}

function coursesFor(query, catalog) {
  const matched = hasCourseRepo() ? matchCourses(catalog, query, 2) : [];
  return matched.length ? matched : builtinActivities(query).slice(0, 1);
}

function collectCourses(plan, catalog, weeks = plan.weeks) {
  const seen = new Map();
  for (const w of weeks) {
    for (const q of w.courseQueries) {
      for (const c of coursesFor(q, catalog)) {
        const prev = seen.get(c.id);
        if (prev) { if (!prev.practices.includes(q.practice)) prev.practices.push(q.practice); }
        else seen.set(c.id, { ...c, practices: [q.practice] });
      }
    }
  }
  return [...seen.values()];
}

function CourseCard({ course, compact = false }) {
  const practices = course.practices || [course.practice];
  if (course.builtin) {
    return (
      <article className="course slab">
        <p className="course-src">Built-in Skilly activity</p>
        <h3>{course.title}</h3>
        <p className="muted small">{course.description}</p>
        <p className="helps">Helps you practise: {practices.join(', ')}</p>
      </article>
    );
  }
  return (
    <article className="course slab">
      <p className="course-src">roadmap.sh · {course.roadmap}</p>
      <h3>{course.title}</h3>
      <p className="helps">Helps you practise: {practices.join(', ')}</p>
      <ul className="res" role="list">
        {course.resources.slice(0, compact ? 2 : 3).map((r) => (
          <li key={r.url}><span className="rtype">{r.type}</span><a href={r.url} target="_blank" rel="noreferrer">{r.title}</a></li>
        ))}
      </ul>
      <p className="small course-links">
        <a href={course.roadmapUrl} target="_blank" rel="noreferrer">Open the roadmap</a> · <a href={course.sourceUrl} target="_blank" rel="noreferrer">Topic on GitHub</a>
      </p>
    </article>
  );
}

function WeekPanel({ plan, week, index, catalog, headRef, report }) {
  const p = plan.progress?.[week.id] || {};
  const prog = weekProgress(plan, week);
  const courses = collectCourses(plan, catalog, [week]);

  const reassess = () => {
    if (report) chooseAudience(report.audience);
    prepareReassess(week.reassess);
    navigate('/setup');
  };

  return (
    <section className="slab panel week" role="tabpanel" id={`panel-${week.id}`} aria-labelledby={`tab-${week.id}`}>
      <div className="week-head">
        <span className={`kind ${week.kind}`}>{KIND[week.kind]}</span>
        <h2 ref={headRef} tabIndex={-1}>Week {index + 1}: {week.title}</h2>
        <p className="goal">{week.goal}</p>
        <p className="why"><strong>Why this milestone:</strong> {week.why}</p>
        {week.topics.length > 0 && (
          <ul className="chip-list" role="list" aria-label="Topics to practise">
            {week.topics.map((t) => <li key={`${t.language}:${t.topic}`} className="chip static">{LANGUAGE_BY_ID[t.language].label} · {topicLabel(t.language, t.topic)}</li>)}
          </ul>
        )}
        {week.reassess && <button type="button" className="btn primary" onClick={reassess}>Start reassessment →</button>}
      </div>

      <div className="week-grid">
        <div>
          <h3>Tasks <span className="muted small">{prog.doneTasks}/{prog.totalTasks}</span></h3>
          <ul className="tasks" role="list">
            {week.tasks.map((t, i) => (
              <li key={i}>
                <label className={`task${p.tasks?.[i] ? ' done' : ''}`}>
                  <input type="checkbox" checked={!!p.tasks?.[i]} onChange={() => toggleTask(plan.id, week.id, i)} />
                  <span className="box" aria-hidden="true">{p.tasks?.[i] ? '✓' : ''}</span>
                  <span>{t}</span>
                </label>
              </li>
            ))}
          </ul>
          {week.links?.length > 0 && (
            <>
              <h3>Start here</h3>
              <ul className="start-links" role="list">
                {week.links.map((l) => <li key={l.url}><a className="res-link fx-glow" href={l.url} target="_blank" rel="noreferrer"><span>{l.title}</span><span aria-hidden="true">↗</span></a></li>)}
              </ul>
            </>
          )}
          {courses.length > 0 && (
            <>
              <h3>Courses for this week</h3>
              <div className="course-stack">{courses.map((c) => <CourseCard key={c.id} course={c} compact />)}</div>
            </>
          )}
        </div>
        <Quiz plan={plan} week={week} state={p.quiz} />
      </div>
    </section>
  );
}

function Quiz({ plan, week, state }) {
  const qs = week.quiz.questionIds.map((id) => QUESTION_BY_ID[id]).filter(Boolean);
  if (!qs.length) return null;
  const answers = state?.answers || {};
  const submitted = !!state?.submitted;
  const answeredCount = qs.filter((q) => Number.isInteger(answers[q.id])).length;
  return (
    <div className="quiz" aria-labelledby={`quiz-${week.id}`}>
      <h3 id={`quiz-${week.id}`}>Weekly quiz {week.quizOptional && <span className="muted small">(optional)</span>}</h3>
      {submitted && <p className="quiz-score" role="status">You scored {state.score} of {state.total}.</p>}
      {qs.map((q, qi) => {
        const order = week.quiz.orders[q.id] || [0, 1, 2, 3];
        const chosen = answers[q.id];
        return (
          <fieldset key={q.id} className="quiz-q">
            <legend><span className="muted small">{LANGUAGE_BY_ID[q.language].label} · {topicLabel(q.language, q.topic)}</span><br />{qi + 1}. {q.prompt}</legend>
            {q.code && <CodeBlock code={q.code} language={q.language} />}
            <div className="options small-opts">
              {order.map((src, pos) => {
                const cls = submitted ? (src === q.correct ? ' right' : src === chosen ? ' wrong' : '') : chosen === src ? ' on' : '';
                return (
                  <label key={src} className={`option${cls}`}>
                    <input type="radio" name={`quiz-${week.id}-${q.id}`} checked={chosen === src} disabled={submitted} onChange={() => quizAnswer(plan.id, week.id, q.id, src)} />
                    <span className="letter" aria-hidden="true">{LETTERS[pos]}</span>
                    <span className="opt-text">{q.options[src]}</span>
                    {submitted && src === q.correct && <span className="sr-only"> (correct answer)</span>}
                  </label>
                );
              })}
            </div>
            {submitted && <p className="explain small">{chosen === q.correct ? '✓ ' : chosen === undefined ? 'Not answered. ' : '✗ '}{q.explanation}</p>}
          </fieldset>
        );
      })}
      {submitted
        ? <button type="button" className="btn ghost" onClick={() => quizRetake(plan.id, week.id)}>Retake quiz</button>
        : <button type="button" className="btn primary" onClick={() => quizSubmit(plan.id, week.id, qs)}>Submit quiz{answeredCount < qs.length ? ` (${qs.length - answeredCount} unanswered)` : ''}</button>}
    </div>
  );
}
