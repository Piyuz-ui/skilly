// Port of the SkillBridge gap engine (core/engine.py + core/roadmap.py).
// Rule-based and explainable: score = gap × weight; prerequisites with a gap
// are scheduled first; readiness = weighted share of required levels met.
import { SKILLS } from '../data/paths.js';

export const HIGH_PRIORITY = 1.5;

export function readiness(rows) {
  const need = rows.reduce((s, r) => s + r.weight * r.target, 0);
  const have = rows.reduce((s, r) => s + r.weight * Math.min(r.current, r.target), 0);
  return need ? Math.round((100 * have) / need) : 0;
}

const priority = (score) => (score >= HIGH_PRIORITY ? 'HIGH' : score > 0 ? 'MEDIUM' : 'ON TRACK');

export function buildRows(path, levels) {
  const rows = Object.entries(path.targets).map(([id, [target, weight]]) => {
    const current = levels[id] ?? 0;
    const gap = Math.max(0, target - current);
    const score = Math.round(gap * weight * 100) / 100;
    const name = SKILLS[id].name;
    const evidence = path.source === 'skillbridge'
      ? `named in ${Math.round(weight * 10)} of 10 sampled job posts (weight ${weight.toFixed(1)})`
      : `weight ${weight.toFixed(1)}`;
    const reason = gap === 0
      ? `${name} already meets the level this role needs (${current} of ${target}).`
      : `${name} is ${gap} ${gap === 1 ? 'level' : 'levels'} below target and is ${evidence}: ${gap} × ${weight.toFixed(1)} = ${score.toFixed(1)}.`;
    return { id, name, current, target, gap, weight, score, priority: priority(score), reason };
  });
  return rank(rows);
}

export function rank(rows) {
  const byScore = [...rows].sort((a, b) => b.score - a.score || b.weight - a.weight || a.name.localeCompare(b.name));
  const byId = Object.fromEntries(byScore.map((r) => [r.id, r]));
  const ordered = []; const placed = new Set();
  const place = (row, pulledBy = null) => {
    if (placed.has(row.id)) return;
    placed.add(row.id);
    for (const pre of SKILLS[row.id].pre) {
      const p = byId[pre];
      if (p && p.gap > 0 && row.gap > 0) place(p, row.name);
    }
    if (pulledBy) row = { ...row, reason: `${row.reason} Scheduled before ${pulledBy}, which depends on it.` };
    ordered.push(row);
  };
  byScore.forEach((r) => place(r));
  return ordered.map((r, i) => ({ ...r, rank: i + 1 }));
}

export function buildSchedule(rows, hoursPerWeek) {
  let used = 0;
  const blocks = [];
  for (const r of rows) {
    if (r.gap === 0) continue;
    const hours = r.gap * SKILLS[r.id].hours;
    const startWeek = Math.floor(used / hoursPerWeek) + 1;
    used += hours;
    blocks.push({ id: r.id, name: r.name, fromLevel: r.current, toLevel: r.target, hours, startWeek, endWeek: Math.ceil(used / hoursPerWeek), priority: r.priority });
  }
  return { hoursPerWeek, totalHours: used, weeks: used ? Math.ceil(used / hoursPerWeek) : 0, blocks };
}
