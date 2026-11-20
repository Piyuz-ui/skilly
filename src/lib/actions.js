// State transitions. All go through store.set so they persist immediately.
import { store } from './store.js';
import { buildAttempt, scoreAttempt, validateSetup } from './engine.js';
import { buildPlanFromReport, buildBeginnerPlan } from './roadmap.js';
import { trackEvent } from './analytics.js';

export function chooseAudience(audience) {
  if (audience && audience !== store.get().audience) trackEvent(`audience-${audience}`);
  store.set((s) => ({
    ...s,
    audience,
    // Students can't keep a Hard selection from a Professional session.
    survey: { ...s.survey, difficulty: audience === 'student' && s.survey.difficulty === 'hard' ? null : s.survey.difficulty },
  }));
}

export function resetToSelector() {
  store.set((s) => ({ ...s, audience: null, attempt: null }));
}

export function discardAttempt() {
  store.set((s) => ({ ...s, attempt: null }));
}

export function setLanguages(languages) {
  store.set((s) => ({ ...s, survey: { ...s.survey, languages } }));
}

export function setSetup(patch) {
  store.set((s) => ({ ...s, survey: { ...s.survey, ...patch } }));
}

export function startTest() {
  const s = store.get();
  const setup = { audience: s.audience, ...s.survey };
  const err = validateSetup(setup);
  if (err) return { error: err };
  if (s.attempt?.status === 'active') return { attempt: s.attempt };
  const attempt = buildAttempt(setup);
  store.set((st) => ({ ...st, attempt }));
  trackEvent('test-start');
  return { attempt };
}

export function answer(questionId, sourceIndex) {
  store.set((s) => (s.attempt?.status === 'active'
    ? { ...s, attempt: { ...s.attempt, answers: { ...s.attempt.answers, [questionId]: sourceIndex } } }
    : s));
}

export function clearAnswer(questionId) {
  store.set((s) => {
    if (s.attempt?.status !== 'active') return s;
    const answers = { ...s.attempt.answers };
    delete answers[questionId];
    return { ...s, attempt: { ...s.attempt, answers } };
  });
}

export function goToQuestion(index) {
  store.set((s) => (s.attempt ? { ...s, attempt: { ...s.attempt, current: index } } : s));
}

// Idempotent: the first call scores and clears the attempt; later calls
// (double click, timer firing at the same moment) find no active attempt and
// return the already-saved report id.
export function submitAttempt(reason = 'manual') {
  let reportId = null;
  let scored = false;
  store.set((s) => {
    const a = s.attempt;
    if (!a || a.status !== 'active') { reportId = s.reports.at(-1)?.id ?? null; return s; }
    if (s.reports.some((r) => r.id === a.id)) { reportId = a.id; return { ...s, attempt: null }; }
    const report = scoreAttempt(a, { reason, submittedAt: Math.min(Date.now(), a.deadline) });
    const plan = buildPlanFromReport(report);
    reportId = report.id;
    scored = true;
    return {
      ...s,
      attempt: null,
      reports: [...s.reports, report].slice(-20),
      plans: { ...s.plans, [plan.id]: plan },
      activePlanId: plan.id,
    };
  });
  if (scored) trackEvent(`test-submit-${reason === 'timeout' ? 'timeout' : 'manual'}`);
  return reportId;
}

export function ensureBeginnerPlan(language = 'python') {
  const id = `beginner-${language}`;
  if (!store.get().plans[id]) trackEvent(`beginner-plan-${language}`);
  store.set((s) => {
    if (s.plans[id]) return s.activePlanId === id ? s : { ...s, activePlanId: id };
    return { ...s, plans: { ...s.plans, [id]: buildBeginnerPlan(language) }, activePlanId: id };
  });
  return id;
}

export function setActivePlan(id) {
  store.set((s) => (s.plans[id] ? { ...s, activePlanId: id } : s));
}

function updateWeek(planId, weekId, fn) {
  store.set((s) => {
    const plan = s.plans[planId];
    if (!plan) return s;
    const prev = plan.progress?.[weekId] || {};
    return { ...s, plans: { ...s.plans, [planId]: { ...plan, progress: { ...plan.progress, [weekId]: fn(prev) } } } };
  });
}

export function toggleTask(planId, weekId, index) {
  updateWeek(planId, weekId, (p) => ({ ...p, tasks: { ...p.tasks, [index]: !p.tasks?.[index] } }));
}

export function quizAnswer(planId, weekId, qid, sourceIndex) {
  updateWeek(planId, weekId, (p) => (p.quiz?.submitted ? p : { ...p, quiz: { ...p.quiz, answers: { ...p.quiz?.answers, [qid]: sourceIndex } } }));
}

export function quizSubmit(planId, weekId, questions) {
  updateWeek(planId, weekId, (p) => {
    if (p.quiz?.submitted) return p;
    const answers = p.quiz?.answers || {};
    const score = questions.filter((q) => answers[q.id] === q.correct).length;
    return { ...p, quiz: { answers, submitted: true, score, total: questions.length } };
  });
}

export function quizRetake(planId, weekId) {
  updateWeek(planId, weekId, (p) => ({ ...p, quiz: { answers: {}, submitted: false, score: null } }));
}

export function prepareReassess({ languages, difficulty }) {
  store.set((s) => ({ ...s, survey: { ...s.survey, languages, difficulty } }));
}

// ─── Career paths ─────────────────────────────────────────────────────────
function updatePath(pathId, fn) {
  store.set((s) => {
    const prev = s.paths?.[pathId] || { done: {}, ratings: {}, hours: 6 };
    return { ...s, paths: { ...s.paths, [pathId]: fn(prev) } };
  });
}
export function toggleStepDone(pathId, stepId) {
  updatePath(pathId, (p) => ({ ...p, done: { ...p.done, [stepId]: !p.done[stepId] } }));
}
export function setRating(pathId, skillId, level) {
  updatePath(pathId, (p) => ({ ...p, ratings: { ...p.ratings, [skillId]: level } }));
}
export function setHours(pathId, hours) {
  updatePath(pathId, (p) => ({ ...p, hours }));
}
export function loadDemo(pathId, demo) {
  trackEvent('demo-learner');
  updatePath(pathId, (p) => ({ ...p, ratings: { ...demo.ratings }, hours: demo.hours }));
}
// "Test this step": jump into the assessment flow with the step's language.
export function testLanguage(language) {
  store.set((s) => ({
    ...s,
    audience: s.audience === 'student' || s.audience === 'professional' ? s.audience : 'professional',
    survey: { ...s.survey, languages: [language] },
  }));
}
