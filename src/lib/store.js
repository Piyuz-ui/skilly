// Tiny synchronous store persisted to localStorage.
// Updates are applied synchronously, so a second click (e.g. double submit)
// always sees the state produced by the first.
import { useSyncExternalStore } from 'react';
import { QUESTION_BY_ID, isQuestionId, onQuestionsLoaded } from '../data/questions/index.js';
import { sanitizeReview, seedFromReports } from './revise.js';

const KEY = 'skilly:v1';
const VERSION = 1;

export const DEFAULT_STATE = Object.freeze({
  version: VERSION,
  audience: null, // 'professional' | 'student' | 'beginner'
  survey: { languages: [], duration: null, difficulty: null },
  attempt: null,
  reports: [], // newest last
  plans: {}, // id -> plan
  activePlanId: null,
  paths: {}, // pathId -> { done: {stepId: true}, ratings: {skillId: 0-5}, hours: number, weeks: {'stepId:weekIndex': true} }
  code: {}, // problemId -> { js?: solvedAtMs, py?: solvedAtMs }
  activity: [], // ['YYYY-MM-DD', …] days with real study activity (for streaks)
  review: {}, // questionId -> { box, due, at, wrong }: missed questions for daily review (lib/revise.js)
});

const AUDIENCES = ['professional', 'student', 'beginner'];

// Defensive load: anything malformed or from another version is dropped.
export function sanitize(raw) {
  const s = structuredClone(DEFAULT_STATE);
  if (!raw || typeof raw !== 'object' || raw.version !== VERSION) return s;
  if (AUDIENCES.includes(raw.audience)) s.audience = raw.audience;
  if (raw.survey && typeof raw.survey === 'object') {
    const langs = Array.isArray(raw.survey.languages) ? raw.survey.languages.filter((l) => typeof l === 'string') : [];
    s.survey = {
      languages: langs,
      duration: [10, 15, 20].includes(raw.survey.duration) ? raw.survey.duration : null,
      difficulty: ['easy', 'medium', 'hard'].includes(raw.survey.difficulty) ? raw.survey.difficulty : null,
    };
  }
  const a = raw.attempt;
  if (a && a.status === 'active' && Array.isArray(a.questionIds) && a.questionIds.length
      && a.questionIds.every(isQuestionId) && typeof a.deadline === 'number'
      && a.optionOrders && a.questionIds.every((id) => Array.isArray(a.optionOrders[id]) && a.optionOrders[id].length === 4)) {
    s.attempt = { ...a, answers: a.answers && typeof a.answers === 'object' ? a.answers : {}, current: Number.isInteger(a.current) ? a.current : 0 };
  }
  if (Array.isArray(raw.reports)) {
    s.reports = raw.reports.filter((r) => r && r.id && Array.isArray(r.items) && r.items.every((it) => isQuestionId(it.id)));
  }
  if (raw.plans && typeof raw.plans === 'object') {
    for (const [id, p] of Object.entries(raw.plans)) {
      if (p && Array.isArray(p.weeks) && p.weeks.length) s.plans[id] = p;
    }
  }
  if (raw.activePlanId && s.plans[raw.activePlanId]) s.activePlanId = raw.activePlanId;
  if (raw.paths && typeof raw.paths === 'object') {
    for (const [id, p] of Object.entries(raw.paths)) {
      if (!p || typeof p !== 'object') continue;
      const ratings = {};
      for (const [k, v] of Object.entries(p.ratings || {})) if (Number.isInteger(v) && v >= 0 && v <= 5) ratings[k] = v;
      const weeks = {};
      for (const [k, v] of Object.entries(p.weeks || {})) if (v === true && /^[\w-]+:\d+$/.test(k)) weeks[k] = true;
      s.paths[id] = {
        done: p.done && typeof p.done === 'object' ? p.done : {},
        ratings,
        hours: Number.isInteger(p.hours) && p.hours >= 1 && p.hours <= 40 ? p.hours : 6,
        weeks,
      };
    }
  }
  if (raw.code && typeof raw.code === 'object') {
    for (const [id, c] of Object.entries(raw.code)) {
      if (!c || typeof c !== 'object' || !/^[a-z0-9-]+$/.test(id)) continue;
      const entry = {};
      for (const lang of ['js', 'py']) if (Number.isFinite(c[lang])) entry[lang] = c[lang];
      if (Object.keys(entry).length) s.code[id] = entry;
    }
  }
  if (Array.isArray(raw.activity)) {
    s.activity = [...new Set(raw.activity.filter((d) => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)))].sort().slice(-400);
  }
  // Data saved before the review pile existed: start it from past mistakes.
  s.review = raw.review && typeof raw.review === 'object' ? sanitizeReview(raw.review) : seedFromReports(s.reports);
  return s;
}

function load() {
  try {
    const txt = localStorage.getItem(KEY);
    return sanitize(txt ? JSON.parse(txt) : null);
  } catch {
    return structuredClone(DEFAULT_STATE);
  }
}

let state = load();
const listeners = new Set();

export const store = {
  get: () => state,
  set(updater) {
    const next = typeof updater === 'function' ? updater(state) : updater;
    if (next === state) return state;
    state = next;
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage unavailable: keep in memory */ }
    listeners.forEach((l) => l());
    return state;
  },
  reset() { store.set(structuredClone(DEFAULT_STATE)); },
  subscribe(l) { listeners.add(l); return () => listeners.delete(l); },
};

// Saved data is first checked against the id format (the question bank loads
// later, on demand). Once the bank is in, drop anything that names a question
// that doesn't exist, which only happens if the saved data was tampered with.
onQuestionsLoaded(() => {
  const s = state;
  const attemptOk = !s.attempt || s.attempt.questionIds.every((id) => QUESTION_BY_ID[id]);
  const reports = s.reports.filter((r) => r.items.every((it) => QUESTION_BY_ID[it.id]));
  if (attemptOk && reports.length === s.reports.length) return;
  store.set({ ...s, attempt: attemptOk ? s.attempt : null, reports });
});

// Keep tabs in sync.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key !== KEY) return;
    try { state = sanitize(e.newValue ? JSON.parse(e.newValue) : null); listeners.forEach((l) => l()); } catch { /* ignore */ }
  });
}

export function useStore(selector = (s) => s) {
  return useSyncExternalStore(store.subscribe, () => selector(state));
}
