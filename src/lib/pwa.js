// Installable app + offline support.
// - Registers the service worker (dist/sw.js) once the page has loaded.
// - Keeps the browser's "install" prompt so our own button can show it.
// - Tracks online/offline for a small notice.
import { useSyncExternalStore } from 'react';
import { trackEvent } from './analytics.js';
import { IN_APP } from './platform.js';

let deferred = null; // the beforeinstallprompt event (Chrome, Edge, Android)
let installed = false;
let online = typeof navigator === 'undefined' ? true : navigator.onLine !== false;
const subs = new Set();
const emit = () => subs.forEach((f) => f());
let snapshot = null;
const snap = () => {
  const s = { canPrompt: Boolean(deferred), installed: installed || isStandalone(), online, ios: isIosSafari() };
  if (!snapshot || Object.keys(s).some((k) => s[k] !== snapshot[k])) snapshot = s;
  return snapshot;
};

export function isStandalone() {
  if (IN_APP) return true; // already an app
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

// iPhone/iPad Safari has no install prompt: people use Share → Add to Home Screen.
function isIosSafari() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  const ios = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  return ios && /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
}

export function initPwa() {
  if (typeof window === 'undefined') return;
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferred = e; emit(); });
  window.addEventListener('appinstalled', () => { installed = true; deferred = null; trackEvent('app-installed'); emit(); });
  window.addEventListener('online', () => { online = true; emit(); });
  window.addEventListener('offline', () => { online = false; emit(); });

  // The app ships its files inside it, so it needs no service worker.
  if (IN_APP || !import.meta.env.PROD || !('serviceWorker' in navigator)) return;
  const register = () => navigator.serviceWorker.register('./sw.js').catch(() => {});
  if (document.readyState === 'complete') setTimeout(register, 1000);
  else window.addEventListener('load', () => setTimeout(register, 1000), { once: true });
}

// Shows the browser's install dialog. Resolves true if the person accepted.
export async function promptInstall() {
  if (!deferred) return false;
  const e = deferred;
  deferred = null;
  emit();
  e.prompt();
  const { outcome } = await e.userChoice.catch(() => ({ outcome: 'dismissed' }));
  trackEvent(`install-prompt-${outcome}`);
  return outcome === 'accepted';
}

export const usePwa = () => useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f); }, snap, snap);
