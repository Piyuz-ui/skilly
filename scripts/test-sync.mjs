// Checks the account-sync merge rules (src/lib/sync.js). Run: node scripts/test-sync.mjs
import { mergeGenerous, applyRemote, fitToLimit, syncable, withSynced, summary, MAX_BYTES } from '../src/lib/sync.js';

let passed = 0;
const check = (name, ok) => { if (!ok) { console.error('✗', name); process.exit(1); } console.log('✓', name); passed++; };

const plan = (id, progress = {}) => ({ id, reportId: id, weeks: [{ id: 'w1', tasks: ['a', 'b', 'c'] }], progress });
const report = (id, t, extra = {}) => ({ id, submittedAt: t, correct: 3, total: 4, items: [], ...extra });
const base = { version: 1, audience: null, survey: { languages: [], duration: null, difficulty: null }, reports: [], plans: {}, activePlanId: null, paths: {} };

// Guest on this device + existing account data elsewhere.
const local = {
  ...base, audience: 'student', survey: { languages: ['python'], duration: 10, difficulty: 'easy' },
  reports: [report('r2', 200)],
  plans: { r2: plan('r2', { w1: { tasks: { 0: true } } }), shared: plan('shared', { w1: { tasks: { 0: true }, quiz: { submitted: true, score: 1, total: 3 } } }) },
  activePlanId: 'r2',
  paths: { 'data-analyst': { done: { s1: true }, ratings: { sql: 2 }, hours: 6 } },
};
const remote = {
  ...base, audience: 'professional',
  reports: [report('r1', 100), report('r2', 200)],
  plans: { r1: plan('r1'), shared: plan('shared', { w1: { tasks: { 1: true }, quiz: { submitted: true, score: 2, total: 3 } } }) },
  activePlanId: 'r1',
  paths: { 'data-analyst': { done: { s2: true }, ratings: { sql: 1, python: 3 }, hours: 10 }, vlsi: { done: { v1: true }, ratings: {}, hours: 6 } },
};

const g = mergeGenerous(local, remote);
check('first sign-in keeps reports from both sides, no duplicates, oldest first', g.reports.map((r) => r.id).join() === 'r1,r2');
check('first sign-in keeps roadmaps from both sides', ['r1', 'r2', 'shared'].every((id) => g.plans[id]));
check('ticked tasks on either device stay ticked', g.plans.shared.progress.w1.tasks[0] === true && g.plans.shared.progress.w1.tasks[1] === true);
check('the better quiz score wins', g.plans.shared.progress.w1.quiz.score === 2);
check('career-path steps from both sides are kept', g.paths['data-analyst'].done.s1 && g.paths['data-analyst'].done.s2 && g.paths.vlsi);
check('this device’s skill ratings win, the account fills the gaps', g.paths['data-analyst'].ratings.sql === 2 && g.paths['data-analyst'].ratings.python === 3);
check('this device’s journey and survey win when set', g.audience === 'student' && g.survey.languages[0] === 'python');
check('active roadmap stays this device’s', g.activePlanId === 'r2');
check('merging with an empty account keeps everything', JSON.stringify(mergeGenerous(local, null)) === JSON.stringify(local));

const emptyLocal = { ...base };
const g2 = mergeGenerous(emptyLocal, remote);
check('a fresh device takes the account’s settings', g2.audience === 'professional' && g2.activePlanId === 'r1');

// Live update from another device: the account's newer version wins,
// but things only this device has are kept.
const offline = { ...remote, reports: [...remote.reports, report('r3', 300)], plans: { ...remote.plans, r3: plan('r3') } };
const newer = { ...remote, plans: { ...remote.plans, shared: plan('shared', {}) } }; // other device un-ticked everything
const a = applyRemote(offline, newer);
check('live update: the other device’s un-ticks are respected', Object.keys(a.plans.shared.progress).length === 0);
check('live update: reports and roadmaps made only here are kept', a.reports.some((r) => r.id === 'r3') && a.plans.r3);

// A dangling active roadmap id is cleared.
check('active roadmap id that no longer exists is cleared', mergeGenerous({ ...base, activePlanId: 'gone' }, { ...base }).activePlanId === null);

// Size limit: oldest reports (and their roadmaps) are dropped first.
const big = 'x'.repeat(60_000);
const many = { ...base, reports: [], plans: {} };
for (let i = 0; i < 20; i++) { many.reports.push(report(`b${i}`, i, { pad: big })); many.plans[`b${i}`] = plan(`b${i}`); }
many.plans['beginner-python'] = { id: 'beginner-python', weeks: [{}], progress: {} };
many.activePlanId = 'b0';
const fit = fitToLimit(many);
check('oversized data is trimmed under the limit', fit.json.length <= MAX_BYTES);
check('trimming drops the oldest reports with their roadmaps, keeps beginner plans', !fit.synced.plans.b0 && fit.synced.plans.b19 && fit.synced.plans['beginner-python'] && fit.synced.activePlanId === null);

// The running test never leaves the device.
const full = { ...local, attempt: { id: 'live', status: 'active' } };
check('a test in progress is not synced', !('attempt' in syncable(full)));
check('applying synced data keeps this device’s running test', withSynced(full, remote).attempt.id === 'live');

const wk = mergeGenerous({ ...base, paths: { vlsi: { done: {}, ratings: {}, hours: 6, weeks: { 'logic:0': true } } } },
  { ...base, paths: { vlsi: { done: {}, ratings: {}, hours: 6, weeks: { 'hdl:1': true } } } });
check('ticked study weeks from both devices are kept', wk.paths.vlsi.weeks['logic:0'] && wk.paths.vlsi.weeks['hdl:1']);

const st = summary(g);
check('profile stats add up', st.tests === 2 && st.accuracy === 75 && st.roadmaps === 3 && st.tasksDone === 3 && st.pathsStarted === 2 && st.stepsDone === 3);

console.log(`${passed} sync checks passed`);
