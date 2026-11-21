// Streak and activity rules (src/lib/streak.js). Run: node scripts/test-streak.mjs
import { dayKey, addDay, streakInfo } from '../src/lib/streak.js';
import { mergeGenerous, applyRemote } from '../src/lib/sync.js';
import { sanitize } from '../src/lib/store.js';

let passed = 0;
const check = (name, ok) => { if (!ok) { console.error('✗', name); process.exit(1); } console.log('✓', name); passed++; };
const at = (s) => new Date(`${s}T10:00:00`);

check('day keys use the local calendar date', dayKey(at('2026-03-05')) === '2026-03-05');
check('adding the same day twice keeps one entry', addDay(addDay([], '2026-01-01'), '2026-01-01').length === 1);
check('addDay returns the same array when nothing changes', (() => { const a = ['2026-01-01']; return addDay(a, '2026-01-01') === a; })());

const now = at('2026-11-21');
check('no activity → streak 0', streakInfo([], now).current === 0);
check('only today → streak 1', streakInfo(['2026-11-21'], now).current === 1);
check('three days ending today → 3', streakInfo(['2026-11-19', '2026-11-20', '2026-11-21'], now).current === 3);
check('ending yesterday still counts (not lost before you study today)', streakInfo(['2026-11-19', '2026-11-20'], now).current === 2);
check('a gap of one full day breaks the streak', streakInfo(['2026-11-18', '2026-11-19'], now).current === 0);
check('streak crosses a month boundary', streakInfo(['2026-10-30', '2026-10-31', '2026-11-01'], at('2026-11-01')).current === 3);
check('streak crosses a year boundary', streakInfo(['2025-12-31', '2026-01-01'], at('2026-01-01')).current === 2);
check('best streak finds the longest past run', streakInfo(['2026-01-01', '2026-01-02', '2026-01-03', '2026-01-04', '2026-02-10'], now).best === 4);
check('best is never below current', streakInfo(['2026-11-20', '2026-11-21'], now).best >= 2);
const wk = streakInfo(['2026-11-16', '2026-11-21'], now).week; // Sat 21 Nov 2026; Monday is 16th
check('week view starts on Monday and marks active days', wk[0].key === '2026-11-16' && wk[0].active && wk[5].today && wk[5].active && !wk[1].active);
check('days after today are marked future', wk[6].future === true && wk[5].future === false);

const merged = mergeGenerous({ activity: ['2026-11-01'], code: { 'two-sum': { js: 200 } } }, { activity: ['2026-11-02'], code: { 'two-sum': { js: 100, py: 300 }, fizzbuzz: { py: 5 } } });
check('active days from two devices are combined', merged.activity.join() === '2026-11-01,2026-11-02');
check('solved problems from two devices are combined, earliest time kept', merged.code['two-sum'].js === 100 && merged.code['two-sum'].py === 300 && merged.code.fizzbuzz.py === 5);
const live = applyRemote({ activity: ['2026-11-05'], code: { 'sum-list': { js: 1 } }, plans: {}, paths: {}, reports: [] }, { activity: ['2026-11-04'], code: {}, plans: {}, paths: {}, reports: [] });
check('a live update never removes solves or active days', live.activity.length === 2 && live.code['sum-list'].js === 1);

const clean = sanitize({ version: 1, activity: ['2026-11-01', 'nope', '2026-11-01', 5], code: { 'two-sum': { js: 1, py: 'x' }, 'Bad Id!': { js: 1 }, empty: {} } });
check('saved activity is cleaned (dates only, no duplicates)', clean.activity.join() === '2026-11-01');
check('saved solves are cleaned (valid ids and timestamps only)', clean.code['two-sum'].js === 1 && !('py' in clean.code['two-sum']) && !clean.code['Bad Id!'] && !clean.code.empty);

console.log(`${passed} streak checks passed`);
