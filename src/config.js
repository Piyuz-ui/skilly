// ─── The single place to configure Skilly's course source ───────────────────
// COURSE_REPO is the GitHub repository whose catalog is normalised into
// src/data/catalog.json by `npm run catalog`. It is currently roadmap.sh's
// open-source repo (https://roadmap.sh → github.com/nilbuild/developer-roadmap).
// Each roadmap topic file there lists real articles, courses and videos.
//
// Set COURSE_REPO to '' to run without a repo: the dashboard then shows only
// the clearly labelled built-in practice activities.
export const COURSE_REPO = 'https://github.com/nilbuild/developer-roadmap';
export const COURSE_BRANCH = 'master';

// Roadmap folders (under /roadmaps) that are pulled into the catalog.
export const CATALOG_ROADMAPS = [
  'python', 'java', 'cpp', 'javascript', 'typescript', 'aspnet-core', 'sql', 'golang',
  'git-github-beginner', 'kotlin', 'rust', 'swift-ui', 'php', 'ruby', 'flutter',
];

// ─── Privacy-friendly analytics (GoatCounter) ───────────────────────────────
// Sign up free at https://www.goatcounter.com, pick a site code (for example
// "skilly"), and put it here. Leave it '' to turn analytics off completely.
// GoatCounter uses no cookies and stores no personal data. Skilly never sends
// test answers, scores or names: only which page was viewed and a short list
// of journey events (see src/lib/analytics.js).
export const GOATCOUNTER_CODE = 'skilly';
