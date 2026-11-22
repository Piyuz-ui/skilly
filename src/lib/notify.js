// Tells the Skilly team when someone creates an account or signs in.
// Posts to the Netlify form "account-event" (declared in index.html); Netlify
// emails each submission to the team. Never throws and never blocks sign-in.
// Restored sessions (page reloads) are not reported, only real sign-ins.
const isLocal = () => /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);

// Only the last 4 digits of a phone number are sent.
export const maskPhone = (p) => (p ? `…${String(p).replace(/\D/g, '').slice(-4)}` : '');

function device() {
  const ua = navigator.userAgent;
  const os = /iPhone|iPad|iPod/.test(ua) ? 'iOS' : /Android/.test(ua) ? 'Android' : /Mac OS X/.test(ua) ? 'macOS' : /Windows/.test(ua) ? 'Windows' : /Linux/.test(ua) ? 'Linux' : 'Other';
  const browser = /Edg\//.test(ua) ? 'Edge' : /Chrome\//.test(ua) ? 'Chrome' : /Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'Other';
  return `${browser} on ${os}, ${window.innerWidth}px wide`;
}

// kind: 'new-account' | 'sign-in'; method: 'email' | 'google' | 'phone'
export function notifyAccountEvent(kind, method, user) {
  if (!user || isLocal()) return;
  const fields = {
    'form-name': 'account-event',
    event: kind === 'new-account' ? 'New account' : 'Sign-in',
    method,
    name: (user.displayName || '').slice(0, 80),
    email: user.email || '',
    phone: maskPhone(user.phoneNumber),
    uid: user.uid,
    device: device(),
    'bot-field': '',
  };
  fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(fields).toString(),
    keepalive: true,
  }).catch(() => {});
}
