// Where Skilly is running: the website, or the Skilly app (Tauri), which
// loads the same pages from inside the app instead of from the web.
export const SITE_URL = 'https://skilly-bq5c.netlify.app';

export const IN_APP = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

// A developer's own computer (vite dev/preview). Never true inside the app,
// even though the app's pages also use a "localhost" address.
export const isLocalDev = () => !IN_APP && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);

// The public address of the site, for links in share cards and calendar invites.
export const siteUrl = () => (IN_APP ? SITE_URL : `${location.origin}${location.pathname}`.replace(/\/$/, ''));
export const siteHost = () => (IN_APP ? new URL(SITE_URL).host : location.host);

// Sends a Netlify form. On the website the form is posted to the site itself.
// In the app it goes to the website; the browser can't read the reply from
// there, so a sent request counts as delivered.
export async function postForm(fields) {
  const body = new URLSearchParams(fields).toString();
  const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
  if (IN_APP) {
    await fetch(`${SITE_URL}/`, { method: 'POST', mode: 'no-cors', headers, body });
    return;
  }
  const res = await fetch('/', { method: 'POST', headers, body, keepalive: true });
  if (!res.ok) throw new Error(String(res.status));
}

// In the app, links to other websites open in the normal browser.
export function openLinksInBrowser() {
  if (!IN_APP) return;
  document.addEventListener('click', (e) => {
    const a = e.target.closest?.('a[href]');
    if (!a || e.defaultPrevented) return;
    const href = a.getAttribute('href');
    if (!/^(https?:|mailto:|tel:)/i.test(href)) return;
    e.preventDefault();
    import('@tauri-apps/plugin-opener').then(({ openUrl }) => openUrl(href)).catch(() => {});
  }, true);
}
