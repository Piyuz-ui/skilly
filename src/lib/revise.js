// "Fix my mistakes": daily spaced review of questions the learner got wrong.
// Pure functions (no React, no question data), so they can be unit-tested
// in Node (scripts/test-revise.mjs).
//
// state.review = { [questionId]: { box, due, at, wrong } }
//   box:   0–4 while learning; 5 = mastered (kept so devices agree on it)
//   due:   'YYYY-MM-DD' (local date) when it should come back
//   at:    ms timestamp of the last change (newest wins when syncing)
//   wrong: how many times it has been missed
import { dayKey } from './streak.js';

export const MASTERED = 5;
// Days until the next review after a correct answer, by the box it moves to.
export const INTERVALS = { 1: 1, 2: 3, 3: 7, 4: 14 };
export const SESSION_SIZE = 5;
export const MAX_REVIEW = 600;

const ID_RE = /^[a-z]+-(easy|medium|hard)-\d{2,}$/;
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

export function addDays(key, n) {
  const d = new Date(`${key}T12:00:00`);
  d.setDate(d.getDate() + n);
  return dayKey(d);
}

// Questions missed in a test go to the start of the pile, due today.
export function addMistakes(review = {}, items = [], now = Date.now()) {
  const today = dayKey(new Date(now));
  let out = review;
  for (const it of items) {
    if (!it || it.status === 'correct' || !ID_RE.test(it.id)) continue;
    const prev = review[it.id];
    if (out === review) out = { ...review };
    out[it.id] = { box: 0, due: today, at: now, wrong: (prev?.wrong || 0) + 1 };
  }
  return out === review ? review : trim(out);
}

// Record one answer in a review session.
export function grade(review = {}, id, correct, now = Date.now()) {
  const prev = review[id];
  if (!prev) return review;
  const today = dayKey(new Date(now));
  if (!correct) return { ...review, [id]: { box: 0, due: addDays(today, 1), at: now, wrong: (prev.wrong || 0) + 1 } };
  const box = Math.min(prev.box + 1, MASTERED);
  return { ...review, [id]: { box, due: box >= MASTERED ? prev.due : addDays(today, INTERVALS[box]), at: now, wrong: prev.wrong || 0 } };
}

const order = (review) => (a, b) => {
  const x = review[a], y = review[b];
  return x.due.localeCompare(y.due) || x.box - y.box || x.at - y.at || a.localeCompare(b);
};

// The questions due today (oldest first). `exists` filters out ids the
// question bank doesn't know.
export function dueIds(review = {}, today = dayKey(), { limit = SESSION_SIZE, exists = () => true } = {}) {
  return Object.keys(review)
    .filter((id) => review[id].box < MASTERED && review[id].due <= today && exists(id))
    .sort(order(review))
    .slice(0, limit);
}

// Extra practice when nothing is due: the next ones coming up.
export function upcomingIds(review = {}, { limit = SESSION_SIZE, exists = () => true } = {}) {
  return Object.keys(review)
    .filter((id) => review[id].box < MASTERED && exists(id))
    .sort(order(review))
    .slice(0, limit);
}

export function reviewStats(review = {}, today = dayKey()) {
  let due = 0, learning = 0, mastered = 0, next = null;
  for (const r of Object.values(review)) {
    if (r.box >= MASTERED) { mastered++; continue; }
    learning++;
    if (r.due <= today) due++;
    else if (!next || r.due < next) next = r.due;
  }
  return { due, learning, mastered, next };
}

// Older saved data has no review pile: build one from past test reports.
export function seedFromReports(reports = []) {
  let review = {};
  for (const r of reports) review = addMistakes(review, r.items, r.submittedAt || Date.now());
  return review;
}

// Cleans saved data. Anything malformed is dropped.
export function sanitizeReview(raw) {
  const out = {};
  if (!raw || typeof raw !== 'object') return out;
  for (const [id, r] of Object.entries(raw)) {
    if (!ID_RE.test(id) || !r || typeof r !== 'object') continue;
    if (!Number.isInteger(r.box) || r.box < 0 || r.box > MASTERED) continue;
    if (typeof r.due !== 'string' || !DAY_RE.test(r.due) || !Number.isFinite(r.at)) continue;
    out[id] = { box: r.box, due: r.due, at: r.at, wrong: Number.isInteger(r.wrong) && r.wrong >= 0 ? r.wrong : 0 };
  }
  return trim(out);
}

// Two devices: for each question keep whichever was changed last.
export function mergeReview(a = {}, b = {}) {
  const out = { ...b };
  for (const [id, r] of Object.entries(a)) if (!out[id] || r.at >= out[id].at) out[id] = r;
  return trim(out);
}

// Keep the pile bounded: drop the oldest mastered entries first, then the oldest.
function trim(review) {
  const ids = Object.keys(review);
  if (ids.length <= MAX_REVIEW) return review;
  const drop = ids.sort((a, b) => (review[b].box >= MASTERED) - (review[a].box >= MASTERED) || review[a].at - review[b].at)
    .slice(0, ids.length - MAX_REVIEW);
  const out = { ...review };
  for (const id of drop) delete out[id];
  return out;
}
