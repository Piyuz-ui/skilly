import { useState } from 'react';
import { usePwa, promptInstall } from '../lib/pwa.js';

const KEY = 'skilly:install-dismissed';
const HIDE_MS = 14 * 864e5;
const dismissedRecently = () => { try { return Date.now() - Number(localStorage.getItem(KEY) || 0) < HIDE_MS; } catch { return false; } };

// "Install Skilly" card on the home page. Chrome/Edge/Android get a real
// Install button; iPhone Safari gets the Add to Home Screen steps.
export function InstallCard() {
  const pwa = usePwa();
  const [hidden, setHidden] = useState(dismissedRecently);
  if (hidden || pwa.installed || (!pwa.canPrompt && !pwa.ios)) return null;
  const dismiss = () => { try { localStorage.setItem(KEY, String(Date.now())); } catch { /* ignore */ } setHidden(true); };
  return (
    <section className="slab panel install-card" aria-label="Install Skilly">
      <p><strong>📲 Install Skilly.</strong>{' '}
        {pwa.canPrompt
          ? 'Open it from your home screen like an app. It starts instantly and your notes and roadmaps work offline.'
          : <>Tap <b>Share</b> <span aria-hidden="true">(□↑)</span>, then <b>Add to Home Screen</b>. It opens like an app and works offline.</>}
      </p>
      <div className="row">
        {pwa.canPrompt && <button type="button" className="btn primary sm" onClick={() => promptInstall()}>Install</button>}
        <button type="button" className="btn ghost sm" onClick={dismiss}>Not now</button>
      </div>
    </section>
  );
}

// Footer link: only where installing is possible.
export function InstallLink() {
  const pwa = usePwa();
  const [tip, setTip] = useState(false);
  if (pwa.installed || (!pwa.canPrompt && !pwa.ios)) return null;
  return (
    <li>
      <button type="button" onClick={() => (pwa.canPrompt ? promptInstall() : setTip((t) => !t))} aria-expanded={pwa.canPrompt ? undefined : tip}>Install the app</button>
      {tip && <p className="small muted">Tap Share, then Add to Home Screen.</p>}
    </li>
  );
}

// Small notice while the device is offline.
export function OfflineNotice() {
  const { online } = usePwa();
  if (online) return null;
  return <p className="offline-pill" role="status">You’re offline. Saved pages still work.</p>;
}
