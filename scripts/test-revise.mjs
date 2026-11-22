// Checks the "Fix my mistakes" rules (src/lib/revise.js) and how the pile
// is saved and synced. Run: node scripts/test-revise.mjs
import assert from 'node:assert/strict';
import { addMistakes, grade, dueIds, upcomingIds, reviewStats, seedFromReports, sanitizeReview, mergeReview, addDays, MASTERED, MAX_REVIEW } from '../src/lib/revise.js';
import { mergeGenerous, applyRemote, syncable } from '../src/lib/sync.js';
import { dayKey } from '../src/lib/streak.js';

let n = 0;
const check = (name, fn) => { fn(); n++; console.log('✓', name); };
const at = (key, h = 12) => new Date(`${key}T${String(h).padStart(2, '0')}:00:00`).getTime();
const D = '2026-11-22';
const items = [
  { id: 'py-easy-01', status: 'correct' },
  { id: 'py-easy-02', status: 'incorrect' },
  { id: 'js-medium-10', status: 'unanswered' },
];

check('missed and unanswered questions join the pile, due today', () => {
  const r = addMistakes({}, items, at(D));
  assert.deepEqual(Object.keys(r).sort(), ['js-medium-10', 'py-easy-02']);
  assert.equal(r['py-easy-02'].due, D);
  assert.equal(r['py-easy-02'].box, 0);
  assert.equal(r['py-easy-02'].wrong, 1);
});

check('a test with no mistakes leaves the pile unchanged', () => {
  const r = { 'py-easy-02': { box: 2, due: D, at: 1, wrong: 1 } };
  assert.equal(addMistakes(r, [{ id: 'py-easy-01', status: 'correct' }], at(D)), r);
});

check('missing a question again resets it and counts the miss', () => {
  const r0 = { 'py-easy-02': { box: 3, due: '2026-12-01', at: 1, wrong: 1 } };
  const r = addMistakes(r0, items, at(D));
  assert.deepEqual(r['py-easy-02'], { box: 0, due: D, at: at(D), wrong: 2 });
});

check('right answers come back after 1, 3, 7, then 14 days, then mastered', () => {
  let r = addMistakes({}, [{ id: 'py-easy-02', status: 'incorrect' }], at(D));
  const dues = [];
  let day = D;
  for (let i = 0; i < 5; i++) {
    r = grade(r, 'py-easy-02', true, at(day));
    dues.push(r['py-easy-02'].box >= MASTERED ? 'mastered' : r['py-easy-02'].due);
    day = r['py-easy-02'].due;
  }
  assert.deepEqual(dues, [addDays(D, 1), addDays(addDays(D, 1), 3), addDays(addDays(addDays(D, 1), 3), 7), addDays(addDays(addDays(addDays(D, 1), 3), 7), 14), 'mastered']);
});

check('a wrong answer sends it back to the start, due tomorrow', () => {
  const r = grade({ 'py-easy-02': { box: 3, due: D, at: 1, wrong: 1 } }, 'py-easy-02', false, at(D));
  assert.deepEqual(r['py-easy-02'], { box: 0, due: '2026-11-23', at: at(D), wrong: 2 });
});

check('grading an unknown question changes nothing', () => {
  const r = { 'py-easy-02': { box: 0, due: D, at: 1, wrong: 1 } };
  assert.equal(grade(r, 'py-easy-99', true, at(D)), r);
});

check('due list: only due and not mastered, oldest first, at most 5', () => {
  const r = {};
  for (let i = 1; i <= 8; i++) r[`py-easy-0${i}`] = { box: i % 3, due: addDays(D, -i), at: i, wrong: 1 };
  r['py-hard-01'] = { box: 0, due: addDays(D, 2), at: 1, wrong: 1 }; // not due yet
  r['py-hard-02'] = { box: MASTERED, due: D, at: 1, wrong: 1 }; // mastered
  const ids = dueIds(r, D);
  assert.equal(ids.length, 5);
  assert.equal(ids[0], 'py-easy-08');
  assert.ok(!ids.includes('py-hard-01') && !ids.includes('py-hard-02'));
  assert.deepEqual(dueIds(r, D, { exists: (id) => id !== 'py-easy-08' })[0], 'py-easy-07');
});

check('extra practice puts due questions first, never mastered ones', () => {
  const r = {
    'py-easy-01': { box: 1, due: addDays(D, 5), at: 1, wrong: 1 },
    'py-easy-02': { box: 0, due: D, at: 1, wrong: 1 },
    'py-easy-03': { box: MASTERED, due: D, at: 1, wrong: 1 },
  };
  assert.deepEqual(upcomingIds(r), ['py-easy-02', 'py-easy-01']);
});

check('stats count due, learning, mastered and the next date', () => {
  const r = {
    a1: null,
    'py-easy-01': { box: 1, due: addDays(D, 3), at: 1, wrong: 1 },
    'py-easy-02': { box: 0, due: D, at: 1, wrong: 1 },
    'py-easy-03': { box: MASTERED, due: D, at: 1, wrong: 1 },
  };
  delete r.a1;
  assert.deepEqual(reviewStats(r, D), { due: 1, learning: 2, mastered: 1, next: addDays(D, 3) });
});

check('older saved data starts its pile from past test reports', () => {
  const reports = [
    { id: 'r1', submittedAt: at('2026-11-01'), items },
    { id: 'r2', submittedAt: at('2026-11-10'), items: [{ id: 'py-easy-02', status: 'incorrect' }] },
  ];
  const r = seedFromReports(reports);
  assert.deepEqual(Object.keys(r).sort(), ['js-medium-10', 'py-easy-02']);
  assert.equal(r['py-easy-02'].wrong, 2);
  assert.equal(r['py-easy-02'].due, '2026-11-10');
  assert.ok(dueIds(r, D).length === 2, 'seeded mistakes are due straight away');
});

check('saved piles are cleaned', () => {
  const r = sanitizeReview({
    'py-easy-01': { box: 2, due: D, at: 5, wrong: 3 },
    'bad id': { box: 0, due: D, at: 1 },
    'py-easy-02': { box: 9, due: D, at: 1 },
    'py-easy-03': { box: 1, due: 'tomorrow', at: 1 },
    'py-easy-04': { box: 1, due: D, at: 'x' },
    'py-easy-05': { box: 1, due: D, at: 7 },
  });
  assert.deepEqual(r, { 'py-easy-01': { box: 2, due: D, at: 5, wrong: 3 }, 'py-easy-05': { box: 1, due: D, at: 7, wrong: 0 } });
  assert.deepEqual(sanitizeReview(null), {});
});

check('the pile stays under its size limit, dropping mastered ones first', () => {
  const r = {};
  for (let i = 0; i < MAX_REVIEW + 10; i++) r[`py-easy-${String(i).padStart(3, '0')}`] = { box: i < 20 ? MASTERED : 0, due: D, at: 1000 + i, wrong: 1 };
  const out = sanitizeReview(r);
  assert.equal(Object.keys(out).length, MAX_REVIEW);
  assert.equal(Object.values(out).filter((x) => x.box === MASTERED).length, 10);
});

check('two devices: each question keeps whichever was answered last', () => {
  const a = { 'py-easy-01': { box: 2, due: '2026-11-25', at: 200, wrong: 1 }, 'py-easy-02': { box: 0, due: D, at: 50, wrong: 1 } };
  const b = { 'py-easy-01': { box: 0, due: '2026-11-23', at: 100, wrong: 2 }, 'py-easy-03': { box: 1, due: D, at: 10, wrong: 1 } };
  const m = mergeReview(a, b);
  assert.equal(m['py-easy-01'].at, 200);
  assert.ok(m['py-easy-02'] && m['py-easy-03']);
  assert.deepEqual(mergeReview(b, a), m);
});

check('the pile is synced with the account and merged both ways', () => {
  const base = { version: 1, audience: null, survey: {}, reports: [], plans: {}, activePlanId: null, paths: {}, code: {}, activity: [] };
  const local = { ...base, review: { 'py-easy-01': { box: 1, due: D, at: 300, wrong: 1 } } };
  const remote = { ...base, review: { 'py-easy-01': { box: 0, due: D, at: 100, wrong: 1 }, 'js-easy-02': { box: 0, due: D, at: 5, wrong: 1 } } };
  assert.ok('review' in syncable(local));
  for (const merged of [mergeGenerous(local, remote), applyRemote(local, remote)]) {
    assert.equal(merged.review['py-easy-01'].at, 300);
    assert.ok(merged.review['js-easy-02']);
  }
});

check('day keys move across months and years', () => {
  assert.equal(addDays('2026-12-31', 1), '2027-01-01');
  assert.equal(addDays('2026-03-01', -1), '2026-02-28');
  assert.equal(dayKey(new Date(at('2026-11-22', 23))), '2026-11-22');
});

console.log(`${n} review checks passed`);
