// Logic checks for the engine, scoring and roadmap builder (no browser needed).
import assert from 'node:assert/strict';
import { buildAttempt, scoreAttempt, validateSetup, levelSummary, breakdown, QUESTION_COUNT, LANGUAGE_IDS } from '../src/lib/engine.js';
import { buildRows, readiness, buildSchedule } from '../src/lib/gap.js';
import { PATHS, PATH_BY_ID, SKILLS } from '../src/data/paths.js';
import { buildPlanFromReport, buildBeginnerPlan } from '../src/lib/roadmap.js';
import { QUESTION_BY_ID } from '../src/data/questions/index.js';

let n = 0;
const test = (name, fn) => { fn(); n++; console.log('✓', name); };

test('student cannot take Hard', () => {
  assert.match(validateSetup({ audience: 'student', languages: ['sql'], difficulty: 'hard', duration: 10 }), /not available/);
  assert.throws(() => buildAttempt({ audience: 'student', languages: ['sql'], difficulty: 'hard', duration: 10 }));
});
test('empty survey is rejected', () => {
  assert.match(validateSetup({ audience: 'professional', languages: [], difficulty: 'easy', duration: 10 }), /at least one/);
});
for (const duration of [10, 15, 20]) {
  test(`single language ${duration} min → ${QUESTION_COUNT[duration]} unique questions`, () => {
    for (const lang of LANGUAGE_IDS) {
      for (const difficulty of ['easy', 'medium', 'hard']) {
        const a = buildAttempt({ audience: 'professional', languages: [lang], difficulty, duration });
        assert.equal(a.questionIds.length, QUESTION_COUNT[duration]);
        assert.equal(new Set(a.questionIds).size, a.questionIds.length);
        assert.ok(a.questionIds.every((id) => QUESTION_BY_ID[id].language === lang && QUESTION_BY_ID[id].difficulty === difficulty));
      }
    }
  });
}
test('two languages split evenly (Python + Java, Hard, 10 min)', () => {
  const a = buildAttempt({ audience: 'professional', languages: ['python', 'java'], difficulty: 'hard', duration: 10 });
  const py = a.questionIds.filter((id) => id.startsWith('py-')).length;
  assert.equal(py, 4);
  assert.equal(a.questionIds.length - py, 4);
});
test('every selected language is represented (8 langs, 10 min)', () => {
  const langs = LANGUAGE_IDS.slice(0, 8);
  const a = buildAttempt({ audience: 'professional', languages: langs, difficulty: 'easy', duration: 10 });
  assert.deepEqual(new Set(a.questionIds.map((id) => QUESTION_BY_ID[id].language)), new Set(langs));
});
test('9 correct, 2 incorrect, 1 blank of 12 → 9/12 marks, 75% accuracy', () => {
  const a = buildAttempt({ audience: 'student', languages: ['python'], difficulty: 'medium', duration: 15 });
  a.questionIds.forEach((id, i) => { if (i < 9) a.answers[id] = 0; else if (i < 11) a.answers[id] = 1; });
  const r = scoreAttempt(a);
  assert.deepEqual([r.total, r.correct, r.incorrect, r.unanswered, r.marks, r.accuracy], [12, 9, 2, 1, 9, 75]);
  const b = breakdown(r);
  assert.equal(b.languages[0].total, 12);
  assert.equal(b.topics.reduce((s, t) => s + t.total, 0), 12);
  const plan = buildPlanFromReport(r);
  assert.ok(plan.weeks.length >= 2);
  assert.equal(plan.weeks.at(-1).kind, 'reassess');
  assert.ok(plan.weeks.every((w) => w.quiz.questionIds.length === 3));
});
test('all correct → strong verdict + extension weeks + next difficulty', () => {
  const a = buildAttempt({ audience: 'student', languages: ['sql'], difficulty: 'easy', duration: 10 });
  a.questionIds.forEach((id) => { a.answers[id] = 0; });
  const r = scoreAttempt(a);
  assert.equal(r.accuracy, 100);
  assert.equal(levelSummary(r).next, 'medium');
  const plan = buildPlanFromReport(r);
  assert.ok(plan.weeks.some((w) => w.kind === 'extension'));
  assert.equal(plan.weeks.at(-1).reassess.difficulty, 'medium');
});
test('student all correct at Medium does not suggest Hard', () => {
  const a = buildAttempt({ audience: 'student', languages: ['go'], difficulty: 'medium', duration: 10 });
  a.questionIds.forEach((id) => { a.answers[id] = 0; });
  const r = scoreAttempt(a);
  assert.equal(levelSummary(r).next, 'extend');
  assert.ok(!buildPlanFromReport(r).weeks.some((w) => w.reassess?.difficulty === 'hard'));
});
test('all blank → no-evidence verdict + foundation weeks', () => {
  const a = buildAttempt({ audience: 'professional', languages: ['go'], difficulty: 'hard', duration: 10 });
  const r = scoreAttempt(a, { reason: 'timeout' });
  assert.equal(r.unanswered, 8);
  assert.equal(r.accuracy, 0);
  assert.equal(levelSummary(r).next, 'reassess');
  const plan = buildPlanFromReport(r);
  assert.ok(plan.weeks.slice(0, -1).every((w) => w.kind === 'foundation'));
  assert.equal(plan.weeks.at(-1).kind, 'reassess');
});
test('one missed Hard question is a practice suggestion, not a sweeping claim', () => {
  const a = buildAttempt({ audience: 'professional', languages: ['python'], difficulty: 'hard', duration: 10 });
  a.questionIds.forEach((id, i) => { a.answers[id] = i === 0 ? 2 : 0; });
  const r = scoreAttempt(a);
  const s = levelSummary(r);
  assert.match(s.headline, /Strong at Hard/);
  const plan = buildPlanFromReport(r);
  assert.equal(plan.weeks[0].kind, 'practice');
});
test('report id equals attempt id (idempotent submit)', () => {
  const a = buildAttempt({ audience: 'professional', languages: ['cpp'], difficulty: 'easy', duration: 10 });
  assert.equal(scoreAttempt(a).id, a.id);
});
test('beginner plan works for all 14 languages', () => {
  for (const lang of LANGUAGE_IDS) {
    const p = buildBeginnerPlan(lang);
    assert.equal(p.language, lang);
    assert.equal(p.weeks.length, 4);
    if (lang !== 'sql') assert.deepEqual(p.weeks.map((w) => w.title), ['Programming basics', 'Variables & conditions', 'Loops & functions', 'A small project']);
    assert.ok(p.weeks.every((w) => w.quizOptional && w.quiz.questionIds.length === 3), lang);
    assert.ok(p.weeks.every((w) => w.quiz.questionIds.every((id) => QUESTION_BY_ID[id].language === lang)), `${lang} quiz mixes languages`);
    assert.ok(p.weeks[0].links.length > 0 && p.weeks[0].tasks.length > 0);
  }
});
test('14-language attempt covers every language (20 min)', () => {
  const a = buildAttempt({ audience: 'professional', languages: LANGUAGE_IDS, difficulty: 'medium', duration: 20 });
  assert.equal(new Set(a.questionIds.map((id) => QUESTION_BY_ID[id].language)).size, 14);
});
test('SkillBridge demo learner: readiness 43%, SQL ranked first (3 × 0.9 = 2.7)', () => {
  const p = PATH_BY_ID['data-analyst'];
  const rows = buildRows(p, p.demo.ratings);
  assert.equal(readiness(rows), 43);
  assert.equal(rows[0].id, 'sql');
  assert.equal(rows[0].score, 2.7);
  const plan = buildSchedule(rows, 6);
  assert.deepEqual([plan.totalHours, plan.weeks], [61, 11]);
});
test('prerequisites with a gap are scheduled first (HTML & CSS before JavaScript)', () => {
  const rows = buildRows(PATH_BY_ID['web-developer'], {});
  assert.ok(rows.findIndex((r) => r.id === 'html_css') < rows.findIndex((r) => r.id === 'javascript'));
});
test('every path is well-formed', () => {
  for (const p of PATHS) {
    for (const id of Object.keys(p.targets)) assert.ok(SKILLS[id], `${p.id}: unknown skill ${id}`);
    for (const s of p.steps) {
      assert.ok(s.overview && s.chips.length && s.resources.length && s.project, `${p.id}/${s.id} incomplete`);
      if (s.lang) assert.ok(LANGUAGE_IDS.includes(s.lang), `${p.id}/${s.id} bad lang`);
      for (const l of s.langOptions || []) assert.ok(LANGUAGE_IDS.includes(l), `${p.id}/${s.id} bad option ${l}`);
    }
  }
});
console.log(`${n} checks passed`);
