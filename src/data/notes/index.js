// Loads study notes on demand, one file per group of paths, so the notes
// (tens of thousands of words) never slow down the first page load.
const FILES = {
  'software-a': () => import('./software-a.js'),
  'software-b': () => import('./software-b.js'),
  data: () => import('./data.js'),
  'core-a': () => import('./core-a.js'),
  'core-b': () => import('./core-b.js'),
};

export const PATH_FILE = {
  'web-developer': 'software-a', backend: 'software-a', 'app-developer': 'software-a', dsa: 'software-a',
  devops: 'software-b', cybersecurity: 'software-b', 'game-dev': 'software-b', 'ui-ux': 'software-b', blockchain: 'software-b',
  'data-analyst': 'data', 'ml-engineer': 'data', 'ai-engineer': 'data', 'data-engineer': 'data',
  'eng-maths': 'core-a', 'embedded-iot': 'core-a', vlsi: 'core-a', electrical: 'core-a', mechanical: 'core-a',
  civil: 'core-b', chemical: 'core-b', robotics: 'core-b', aerospace: 'core-b', biotech: 'core-b',
};

const cache = {};

// Resolves to { [stepId]: notes } for one path, or null if it has none.
export async function loadNotes(pathId) {
  const file = PATH_FILE[pathId];
  if (!file) return null;
  cache[file] ||= FILES[file]().then((m) => m.default);
  const all = await cache[file];
  return all[pathId] || null;
}

// Numbers every week across a whole path: step 1 is weeks 1–2, step 2 is
// weeks 3–4, and so on. Returns { [stepId]: firstWeekNumber } and the total.
export function weekNumbers(path, notes) {
  const start = {};
  let n = 1;
  for (const s of path.steps) {
    start[s.id] = n;
    n += notes?.[s.id]?.w?.length || 0;
  }
  return { start, total: n - 1 };
}
