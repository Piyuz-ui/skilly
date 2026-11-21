// Every career-path step must have complete study notes. Run: node scripts/check-notes.mjs
import { PATHS } from '../src/data/paths.js';
import { PATH_FILE } from '../src/data/notes/index.js';

const files = {};
for (const f of new Set(Object.values(PATH_FILE))) files[f] = (await import(`../src/data/notes/${f}.js`)).default;

const errors = [];
let steps = 0, weeks = 0, words = 0;
const count = (s) => { words += String(s).split(/\s+/).filter(Boolean).length; };
for (const p of PATHS) {
  const file = PATH_FILE[p.id];
  if (!file) { errors.push(`${p.id}: no notes file mapped`); continue; }
  const notes = files[file][p.id];
  if (!notes) { errors.push(`${p.id}: missing in ${file}.js`); continue; }
  const ids = new Set(p.steps.map((s) => s.id));
  for (const id of Object.keys(notes)) if (!ids.has(id)) errors.push(`${p.id}.${id}: notes for a step that does not exist`);
  for (const s of p.steps) {
    const n = notes[s.id];
    const at = `${p.id}.${s.id}`;
    if (!n) { errors.push(`${at}: no notes`); continue; }
    steps++;
    if (!Array.isArray(n.w) || !n.w.length) errors.push(`${at}: no weeks`);
    for (const [i, w] of (n.w || []).entries()) {
      weeks++;
      if (!Array.isArray(w) || typeof w[0] !== 'string' || !w[0]) errors.push(`${at} week ${i + 1}: missing title`);
      if (!Array.isArray(w[1]) || w[1].length < 2) errors.push(`${at} week ${i + 1}: needs 2+ learn items`);
      if (!Array.isArray(w[2]) || w[2].length < 1) errors.push(`${at} week ${i + 1}: needs a build/do item`);
      [w[0], ...(w[1] || []), ...(w[2] || [])].forEach(count);
    }
    if (!Array.isArray(n.k) || n.k.length < 3 || n.k.some((x) => !Array.isArray(x) || x.length !== 2 || !x[0] || !x[1])) errors.push(`${at}: needs 3+ [term, explanation] concepts`);
    if (!Array.isArray(n.m) || n.m.length < 2) errors.push(`${at}: needs 2+ common mistakes`);
    if (!Array.isArray(n.q) || n.q.length < 2) errors.push(`${at}: needs 2+ self-check questions`);
    (n.k || []).flat().forEach(count); (n.m || []).forEach(count); (n.q || []).forEach(count);
  }
}
if (errors.length) { console.error(errors.map((e) => '✗ ' + e).join('\n')); process.exit(1); }
console.log(`✓ notes complete: ${PATHS.length} paths, ${steps} steps, ${weeks} weeks, ~${words.toLocaleString('en')} words`);
