import { useState } from 'react';

// Small avatar used in the header and on the profile.
export function Avatar({ user, size = 36 }) {
  const [broken, setBroken] = useState(false);
  const initial = (user?.name || user?.email || user?.phone || '?').replace(/^\+/, '').trim().charAt(0).toUpperCase();
  return (
    <span className="avatar" style={{ width: size, height: size, fontSize: size * 0.42 }} aria-hidden="true">
      {user?.photo && !broken
        ? <img src={user.photo} alt="" referrerPolicy="no-referrer" onError={() => setBroken(true)} />
        : user ? initial : <PersonIcon />}
    </span>
  );
}

const PersonIcon = () => (
  <svg viewBox="0 0 24 24" width="58%" height="58%" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>
);
