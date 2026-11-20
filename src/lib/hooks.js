import { useEffect, useState, useSyncExternalStore } from 'react';

// ─── Hash router ───────────────────────────────────────────────────────────
const subscribeHash = (cb) => { window.addEventListener('hashchange', cb); return () => window.removeEventListener('hashchange', cb); };
export function useRoute() {
  const hash = useSyncExternalStore(subscribeHash, () => window.location.hash || '#/');
  const full = hash.replace(/^#/, '') || '/';
  const [path, qs = ''] = full.split('?');
  const parts = path.split('/').filter(Boolean);
  return { path, parts, query: new URLSearchParams(qs) };
}
export function navigate(to, { replace = false } = {}) {
  const h = `#${to}`;
  if (replace) history.replaceState(null, '', h);
  else if (window.location.hash !== h) window.location.hash = h;
  if (replace) window.dispatchEvent(new HashChangeEvent('hashchange'));
}

// ─── Motion preference ─────────────────────────────────────────────────────
export function useReducedMotion() {
  const q = '(prefers-reduced-motion: reduce)';
  const [r, setR] = useState(() => window.matchMedia?.(q).matches ?? false);
  useEffect(() => {
    const m = window.matchMedia?.(q);
    if (!m) return undefined;
    const on = () => setR(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return r;
}

// Re-render every `ms` while `active`, and immediately when the tab becomes visible.
export function useTick(active, ms = 250) {
  const [, set] = useState(0);
  useEffect(() => {
    if (!active) return undefined;
    const id = setInterval(() => set((n) => n + 1), ms);
    const vis = () => set((n) => n + 1);
    document.addEventListener('visibilitychange', vis);
    window.addEventListener('focus', vis);
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', vis); window.removeEventListener('focus', vis); };
  }, [active, ms]);
}
