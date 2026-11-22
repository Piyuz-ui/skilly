// Question bank entry point.
//
// Language details (LANGUAGES, topics) are always available. The questions
// themselves (QUESTIONS, QUESTION_BY_ID) start empty and are filled in by
// loadQuestions(), which downloads bank.js the first time a page needs them.
// Pages that use questions are loaded through App.jsx, which waits for
// loadQuestions() first, so their code can read QUESTIONS synchronously.
import { META, LANGUAGE_ORDER, DIFFICULTIES, PREFIX } from './meta.js';

export { DIFFICULTIES, PREFIX };
export const LANGUAGES = LANGUAGE_ORDER.map((id) => META[id]);
export const LANGUAGE_BY_ID = Object.fromEntries(LANGUAGES.map((l) => [l.id, l]));

// Shown on the home page before the bank loads. scripts/check-questions.mjs
// fails if this drifts from the real count.
export const QUESTION_TOTAL = 1008;

// Filled in place, so modules that imported them see the data once loaded.
export const QUESTIONS = [];
export const QUESTION_BY_ID = {};

const listeners = new Set();
let loading = null;
export const questionsLoaded = () => QUESTIONS.length > 0;
export function onQuestionsLoaded(fn) {
  if (questionsLoaded()) fn(); else listeners.add(fn);
}
export function loadQuestions() {
  loading ??= import('./bank.js').then(({ buildQuestions }) => {
    if (!questionsLoaded()) {
      for (const q of buildQuestions()) { QUESTIONS.push(q); QUESTION_BY_ID[q.id] = q; }
      for (const fn of listeners) { try { fn(); } catch { /* keep going */ } }
      listeners.clear();
    }
    return QUESTIONS;
  }).catch((e) => { loading = null; throw e; });
  return loading;
}

// Question ids look like py-easy-01. Used to check saved data before the
// bank has loaded.
const ID_RE = new RegExp(`^(${Object.values(PREFIX).join('|')})-(easy|medium|hard)-\\d{2,}$`);
export const isQuestionId = (id) => (questionsLoaded() ? Boolean(QUESTION_BY_ID[id]) : typeof id === 'string' && ID_RE.test(id));

export function topicLabel(language, key) {
  const t = LANGUAGE_BY_ID[language]?.topics.find((x) => x.key === key);
  return t ? t.label : key;
}
