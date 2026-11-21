// Pure functions for moving progress between this device and an account.
// No Firebase imports here, so they can be unit-tested in Node
// (scripts/test-sync.mjs).
//
// What is synced: journey choice, survey, reports, roadmaps (with ticked tasks
// and quiz results) and career-path progress. A test that is still running is
// NOT synced: it stays on the device where it was started.

export const SYNC_SCHEMA = 1;
const MAX_REPORTS = 20;
// Firestore documents max out at 1 MiB; stay well under it.
export const MAX_BYTES = 800_000;

// The part of the store that belongs to the account.
export function syncable(state) {
  return {
    version: state.version,
    audience: state.audience,
    survey: state.survey,
    reports: state.reports,
    plans: state.plans,
    activePlanId: state.activePlanId,
    paths: state.paths,
    code: state.code,
    activity: state.activity,
  };
}

// Solved problems and active days only ever grow, so both merges are unions.
function mergeCode(a = {}, b = {}) {
  const out = { ...b };
  for (const [id, c] of Object.entries(a)) {
    const prev = out[id] || {};
    const m = { ...prev };
    for (const [lang, t] of Object.entries(c)) m[lang] = prev[lang] ? Math.min(prev[lang], t) : t;
    out[id] = m;
  }
  return out;
}
const mergeDays = (a = [], b = []) => [...new Set([...a, ...b])].sort().slice(-400);

// Put the synced part back into a full store state, keeping the device's
// running test.
export function withSynced(state, synced) {
  return { ...state, ...synced, attempt: state.attempt };
}

const byTime = (r) => r.submittedAt || 0;

function mergeReports(a = [], b = []) {
  const map = new Map();
  for (const r of [...b, ...a]) if (r && r.id) map.set(r.id, r);
  return [...map.values()].sort((x, y) => byTime(x) - byTime(y)).slice(-MAX_REPORTS);
}

function orTrue(a = {}, b = {}) {
  const out = { ...b };
  for (const [k, v] of Object.entries(a)) out[k] = Boolean(v) || Boolean(b[k]);
  return out;
}

// Keeps a submitted quiz over an unsubmitted one; between two submitted
// quizzes, keeps the better score.
function pickQuiz(a, b) {
  if (!a) return b;
  if (!b) return a;
  if (a.submitted && !b.submitted) return a;
  if (b.submitted && !a.submitted) return b;
  if (a.submitted && b.submitted) return (b.score ?? 0) > (a.score ?? 0) ? b : a;
  return { ...b, ...a, answers: { ...b.answers, ...a.answers } };
}

function mergePlan(a, b) {
  if (!a) return b;
  if (!b) return a;
  const progress = { ...b.progress };
  for (const [weekId, pa] of Object.entries(a.progress || {})) {
    const pb = progress[weekId] || {};
    progress[weekId] = { ...pb, ...pa, tasks: orTrue(pa.tasks, pb.tasks), quiz: pickQuiz(pa.quiz, pb.quiz) };
    if (!progress[weekId].quiz) delete progress[weekId].quiz;
  }
  return { ...a, progress };
}

function mergePath(a, b) {
  if (!a) return b;
  if (!b) return a;
  return {
    done: orTrue(a.done, b.done),
    ratings: { ...b.ratings, ...a.ratings },
    hours: a.hours ?? b.hours,
    weeks: orTrue(a.weeks, b.weeks),
  };
}

function mergeMap(a = {}, b = {}, fn) {
  const out = {};
  for (const id of new Set([...Object.keys(b), ...Object.keys(a)])) out[id] = fn(a[id], b[id]);
  return out;
}

const emptySurvey = (s) => !s || (!s.languages?.length && !s.duration && !s.difficulty);

// First sign-in on a device (or two devices that both changed while
// offline): keep everything from both sides. Nothing done on either side is
// lost: ticked tasks and finished steps stay ticked, every report is kept,
// and the better quiz result wins. `local` wins ties on settings.
export function mergeGenerous(local, remote) {
  if (!remote) return local;
  const merged = {
    version: local.version,
    audience: local.audience || remote.audience || null,
    survey: emptySurvey(local.survey) ? (remote.survey || local.survey) : local.survey,
    reports: mergeReports(local.reports, remote.reports),
    plans: mergeMap(local.plans, remote.plans, mergePlan),
    paths: mergeMap(local.paths, remote.paths, mergePath),
    activePlanId: local.activePlanId || remote.activePlanId || null,
    code: mergeCode(local.code, remote.code),
    activity: mergeDays(local.activity, remote.activity),
  };
  if (merged.activePlanId && !merged.plans[merged.activePlanId]) merged.activePlanId = null;
  return merged;
}

// Another signed-in device saved newer progress while this one had no
// unsaved changes: take the account's version, but keep anything that only
// exists on this device (for example a report made while offline).
export function applyRemote(local, remote) {
  if (!remote) return local;
  const plans = { ...remote.plans };
  for (const [id, p] of Object.entries(local.plans || {})) if (!plans[id]) plans[id] = p;
  const paths = { ...remote.paths };
  for (const [id, p] of Object.entries(local.paths || {})) if (!paths[id]) paths[id] = p;
  const merged = {
    version: local.version,
    audience: remote.audience ?? local.audience,
    survey: remote.survey ?? local.survey,
    reports: mergeReports(remote.reports, local.reports),
    plans,
    paths,
    activePlanId: remote.activePlanId ?? local.activePlanId,
    code: mergeCode(local.code, remote.code),
    activity: mergeDays(local.activity, remote.activity),
  };
  if (merged.activePlanId && !merged.plans[merged.activePlanId]) merged.activePlanId = null;
  return merged;
}

// If the data grows past the size limit, drop the oldest test reports and the
// roadmaps that were made from them (never beginner plans or path progress).
export function fitToLimit(synced) {
  let s = synced;
  let json = JSON.stringify(s);
  while (json.length > MAX_BYTES && s.reports.length > 1) {
    const [oldest, ...rest] = s.reports;
    const plans = { ...s.plans };
    for (const [id, p] of Object.entries(plans)) if (id === oldest.id || p.reportId === oldest.id) delete plans[id];
    s = { ...s, reports: rest, plans, activePlanId: plans[s.activePlanId] ? s.activePlanId : null };
    json = JSON.stringify(s);
  }
  return { synced: s, json };
}

// Small numbers for the profile page.
export function summary(state) {
  const reports = state.reports || [];
  const correct = reports.reduce((n, r) => n + (r.correct ?? 0), 0);
  const total = reports.reduce((n, r) => n + (r.total ?? 0), 0);
  const plans = Object.values(state.plans || {});
  let tasks = 0;
  for (const p of plans) for (const w of Object.values(p.progress || {})) tasks += Object.values(w.tasks || {}).filter(Boolean).length;
  const paths = Object.values(state.paths || {});
  const steps = paths.reduce((n, p) => n + Object.values(p.done || {}).filter(Boolean).length, 0);
  const weeks = paths.reduce((n, p) => n + Object.values(p.weeks || {}).filter(Boolean).length, 0);
  return {
    tests: reports.length,
    accuracy: total ? Math.round((correct / total) * 100) : null,
    roadmaps: plans.length,
    tasksDone: tasks,
    pathsStarted: paths.filter((p) => Object.keys(p.done || {}).length || Object.keys(p.ratings || {}).length || Object.keys(p.weeks || {}).length).length,
    stepsDone: steps,
    weeksDone: weeks,
    solved: Object.keys(state.code || {}).length,
  };
}
