// Privacy-friendly usage counts: which pages are viewed and how far people get
// through each journey. Nothing personal is sent: no answers, scores, names or
// emails, and no cookies. Off when GOATCOUNTER_CODE is empty, on localhost, or
// when the browser asks not to be tracked (Do Not Track / Global Privacy Control).
import { GOATCOUNTER_CODE } from '../config.js';

// The full list of events Skilly can send (page views are counted by route,
// for example /paths/vlsi). Keeping it here makes it easy to
// see (and tell users) exactly what is counted.
export const EVENTS = {
  audience: 'Chose a journey',          // audience-professional / -student / -beginner
  testStart: 'Started a test',
  testSubmit: 'Finished a test',        // test-submit-manual / -timeout
  beginnerPlan: 'Started a beginner plan', // beginner-plan-<language>
  demoLearner: 'Loaded the demo learner',
  feedback: 'Sent feedback',
};

const isLocal = () => /^(localhost|127\.0\.0\.1|\[::1\]|.*\.local)$/.test(location.hostname);
const optedOut = () => navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.globalPrivacyControl === true;

export const analyticsEnabled = () => Boolean(GOATCOUNTER_CODE) && !isLocal() && !optedOut();

let loading = null;
const queue = [];

function load() {
  if (loading) return loading;
  // Count manually: GoatCounter's auto-count would miss hash-route changes.
  window.goatcounter = { no_onload: true, allow_local: false };
  loading = new Promise((resolve) => {
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://gc.zgo.at/count.js';
    s.dataset.goatcounter = `https://${GOATCOUNTER_CODE}.goatcounter.com/count`;
    s.onload = () => { queue.splice(0).forEach((f) => f()); resolve(true); };
    s.onerror = () => resolve(false); // blocked by an ad blocker: fine, stay silent
    document.head.appendChild(s);
  });
  return loading;
}

function send(payload) {
  if (!analyticsEnabled()) return;
  const go = () => { try { window.goatcounter?.count?.(payload); } catch { /* never break the app */ } };
  if (window.goatcounter?.count) go(); else { queue.push(go); load(); }
}

// Page views use the route only, never ids: /report/abc123 is counted as /report.
export function trackPage(parts) {
  const path = '/' + (parts[0] === 'paths' && parts[1] ? `paths/${parts[1]}` : (parts[0] || ''));
  send({ path, title: document.title });
}

export function trackEvent(name) {
  send({ path: name, title: name, event: true });
}
