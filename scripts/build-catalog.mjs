// Builds src/data/catalog.json from the GitHub repo configured in src/config.js.
// The repo layout (roadmap.sh): roadmaps/<roadmap>/content/<slug>@<id>.md
// Each topic file starts with "# Title" and lists resources as
//   - [@type@Resource title](https://url)
// Titles and URLs are preserved exactly; nothing is invented.
import { writeFile } from 'node:fs/promises';
import { COURSE_REPO, COURSE_BRANCH, CATALOG_ROADMAPS } from '../src/config.js';

const out = new URL('../src/data/catalog.json', import.meta.url);

if (!COURSE_REPO) {
  await writeFile(out, JSON.stringify({ source: null, generatedAt: new Date().toISOString(), topics: [] }, null, 0));
  console.log('COURSE_REPO is empty — wrote an empty catalog.');
  process.exit(0);
}

const [, owner, repo] = new URL(COURSE_REPO).pathname.split('/');
const headers = { 'User-Agent': 'skilly-catalog-builder', Accept: 'application/vnd.github+json' };
const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${COURSE_BRANCH}?recursive=1`, { headers });
if (!treeRes.ok) throw new Error(`GitHub tree request failed: ${treeRes.status}`);
const tree = await treeRes.json();

const files = tree.tree
  .map((t) => t.path)
  .filter((p) => /^roadmaps\/[^/]+\/content\/[^/]+\.md$/.test(p))
  .filter((p) => CATALOG_ROADMAPS.includes(p.split('/')[1]));

const RES = /^\s*-\s*\[@([a-z]+)@([^\]]+)\]\((https?:\/\/[^)\s]+)\)/;

async function load(path) {
  const raw = `https://raw.githubusercontent.com/${owner}/${repo}/${COURSE_BRANCH}/${path}`;
  const res = await fetch(raw, { headers: { 'User-Agent': headers['User-Agent'] } });
  if (!res.ok) return null;
  const text = await res.text();
  const lines = text.split('\n');
  const title = (lines.find((l) => l.startsWith('# ')) || '').slice(2).trim();
  const resources = lines.map((l) => l.match(RES)).filter(Boolean)
    .map(([, type, t, url]) => ({ type, title: t.trim(), url }));
  if (!title || !resources.length) return null;
  const roadmap = path.split('/')[1];
  const file = path.split('/').pop();
  const slug = file.replace(/@.*$/, '').replace(/\.md$/, '');
  return {
    id: `${roadmap}/${slug || file}`,
    roadmap,
    slug,
    title,
    roadmapUrl: `https://roadmap.sh/${roadmap.replace(/-beginner$/, '')}${roadmap.endsWith('-beginner') ? `?r=${roadmap}` : ''}`,
    sourceUrl: `${COURSE_REPO}/blob/${COURSE_BRANCH}/${path}`,
    resources,
  };
}

const topics = [];
const queue = [...files];
await Promise.all(Array.from({ length: 12 }, async () => {
  while (queue.length) {
    const t = await load(queue.shift());
    if (t) topics.push(t);
  }
}));
topics.sort((a, b) => a.id.localeCompare(b.id));

await writeFile(out, JSON.stringify({ source: COURSE_REPO, branch: COURSE_BRANCH, generatedAt: new Date().toISOString(), topics }));
const byRoadmap = {};
topics.forEach((t) => { byRoadmap[t.roadmap] = (byRoadmap[t.roadmap] || 0) + 1; });
console.log(`Wrote ${topics.length} topics from ${files.length} files`, byRoadmap);
