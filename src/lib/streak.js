// Daily activity and streaks. A day counts when the learner does something
// real: finishes a test, ticks a task or study week, completes a step,
// submits a quiz, or solves a coding problem.
export const MAX_DAYS = 400;

const pad = (n) => String(n).padStart(2, '0');
// Local calendar date, e.g. '2026-11-21' (not UTC, so late-night study counts for today).
export function dayKey(d = new Date()) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function shift(d, days) { const x = new Date(d); x.setDate(x.getDate() + days); return x; }

export function addDay(activity = [], key = dayKey()) {
  if (activity.includes(key)) return activity;
  return [...activity, key].sort().slice(-MAX_DAYS);
}

// current: consecutive days ending today (or yesterday, so a streak is not
// lost before the learner has had a chance to study today).
export function streakInfo(activity = [], now = new Date()) {
  const set = new Set(activity);
  const today = dayKey(now);
  const activeToday = set.has(today);
  let current = 0;
  let d = activeToday ? now : shift(now, -1);
  while (set.has(dayKey(d))) { current++; d = shift(d, -1); }
  // Longest run in the stored history.
  let best = 0, run = 0, prev = null;
  for (const k of [...set].sort()) {
    const day = new Date(`${k}T12:00:00`);
    run = prev && dayKey(shift(prev, 1)) === k ? run + 1 : 1;
    best = Math.max(best, run);
    prev = day;
  }
  // Monday-first view of the current week.
  const mondayOffset = (now.getDay() + 6) % 7;
  const monday = shift(now, -mondayOffset);
  const week = ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((label, i) => {
    const day = shift(monday, i);
    const key = dayKey(day);
    return { key, label, active: set.has(key), today: key === today, future: key > today };
  });
  return { current, best: Math.max(best, current), activeToday, week, total: set.size };
}
