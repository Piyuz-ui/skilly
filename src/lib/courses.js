// Course recommendations from the cached GitHub catalog (src/data/catalog.json).
// The catalog is lazy-loaded so the landing page never waits on it.
import { useEffect, useState } from 'react';
import { COURSE_REPO } from '../config.js';

let catalogPromise = null;
let catalogCache = null;

export function loadCatalog() {
  if (catalogCache) return Promise.resolve(catalogCache);
  catalogPromise ??= import('../data/catalog.json')
    .then((m) => (catalogCache = m.default))
    .catch(() => (catalogCache = { source: null, topics: [] }));
  return catalogPromise;
}

export function useCatalog() {
  const [cat, setCat] = useState(catalogCache);
  useEffect(() => { if (!cat) loadCatalog().then(setCat); }, [cat]);
  return cat;
}

export const hasCourseRepo = () => Boolean(COURSE_REPO);

// Score a catalog topic against keywords: exact slug > prefix > word prefix.
// Earlier keywords weigh more.
function score(slug, keywords) {
  const words = slug.split('-');
  let best = 0;
  keywords.forEach((kw, i) => {
    const w = keywords.length - i;
    if (slug === kw) best = Math.max(best, 100 + w);
    else if (slug.startsWith(kw)) best = Math.max(best, 60 + w);
    else if (words.some((x) => x.startsWith(kw))) best = Math.max(best, 30 + w);
  });
  return best;
}

export function matchCourses(catalog, query, limit = 2) {
  if (!catalog?.topics?.length || !query) return [];
  return catalog.topics
    .filter((t) => t.roadmap === query.roadmap)
    .map((t) => ({ t, s: score(t.slug, query.keywords) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || a.t.title.localeCompare(b.t.title))
    .slice(0, limit)
    .map(({ t }) => ({ ...t, practice: query.practice }));
}

// Clearly-labelled built-in activities used when no course repo is configured.
export function builtinActivities(query) {
  if (!query) return [];
  return [
    { id: `builtin:${query.practice}:drill`, builtin: true, title: `Skilly drill: ${query.practice}`, practice: query.practice, description: 'Write five tiny programs for this topic, predict each output, then run them and note any surprises.' },
    { id: `builtin:${query.practice}:explain`, builtin: true, title: `Skilly explain-back: ${query.practice}`, practice: query.practice, description: 'Explain the topic out loud or in writing as if teaching a friend. Rewrite any part you get stuck on.' },
  ];
}
