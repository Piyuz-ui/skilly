// Skilly service worker. Built into dist/sw.js by the plugin in
// vite.config.js, which fills in VERSION and PRECACHE.
//
// - The app (page, code, styles, questions, notes) is saved on install, so
//   Skilly opens instantly on repeat visits and works offline.
// - The page itself is always fetched fresh when online (with a short
//   timeout), so visitors get new versions straight away.
// - Hashed files in /assets/ never change, so they're served from the cache.
// - Firebase, analytics, forms and anything else go straight to the network.
const VERSION = '__VERSION__';
const PRECACHE = __PRECACHE__;
const APP_CACHE = `skilly-app-${VERSION}`;
const RUNTIME_CACHE = 'skilly-runtime';
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];
const MAX_RUNTIME = 80;
const PAGE_TIMEOUT_MS = 3500;

const scoped = (path) => new URL(path, self.registration.scope).href;
const SHELL = scoped('./');

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(APP_CACHE);
    // cache: 'reload' skips the browser's HTTP cache so the shell matches this version.
    await cache.addAll(PRECACHE.map((p) => new Request(scoped(p), { cache: 'reload' })));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith('skilly-app-') && key !== APP_CACHE) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (req.mode === 'navigate' && url.origin === self.location.origin) {
    if (url.pathname.startsWith('/.netlify/')) return;
    event.respondWith(page(req));
    return;
  }
  if (url.origin === self.location.origin) {
    if (url.pathname.includes('/assets/')) { event.respondWith(cacheFirst(req)); return; }
    if (url.pathname.endsWith('/sw.js')) return;
    event.respondWith(staleWhileRevalidate(req));
    return;
  }
  if (FONT_HOSTS.includes(url.hostname)) event.respondWith(staleWhileRevalidate(req));
});

// The page: network first (so updates arrive at once), the saved copy when
// offline or when the network is too slow.
async function page(req) {
  const cache = await caches.open(APP_CACHE);
  const fresh = fetch(req).then((res) => {
    if (res.ok) cache.put(SHELL, res.clone());
    return res;
  });
  fresh.catch(() => {}); // handled below; avoid an unhandled rejection when the timeout wins
  const timeout = new Promise((resolve) => setTimeout(resolve, PAGE_TIMEOUT_MS));
  try {
    const res = await Promise.race([fresh, timeout]);
    if (res) return res;
  } catch { /* offline: fall through */ }
  const saved = await cache.match(SHELL);
  if (saved) return saved;
  return fresh; // no saved copy yet: wait for the network after all
}

async function cacheFirst(req) {
  const hit = await caches.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok) {
    const cache = await caches.open(RUNTIME_CACHE);
    await cache.put(req, res.clone());
    trim(cache);
  }
  return res;
}

async function staleWhileRevalidate(req) {
  const cache = await caches.open(RUNTIME_CACHE);
  const hit = await caches.match(req);
  const fresh = fetch(req).then((res) => {
    if (res.ok || res.type === 'opaque') { cache.put(req, res.clone()); trim(cache); }
    return res;
  }).catch(() => hit || Response.error());
  return hit || fresh;
}

async function trim(cache) {
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - MAX_RUNTIME; i++) await cache.delete(keys[i]);
}
