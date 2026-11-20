import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../lib/hooks.js';

// DOM wordmark (sharp + accessible) with a damped-spring jelly response to
// scroll velocity. Down-scroll squashes, up-scroll stretches lightly; the
// distortion is capped and the spring settles fully to identity.
const K = 210;      // stiffness
const C = 15;       // damping (under-damped → a little wobble)
const CAP = 0.11;   // max deformation

export function JellyLogo({ id, small = false }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || small) { if (el) el.style.transform = ''; return undefined; }
    let x = 0; let v = 0; let raf = 0; let last = 0;
    let lastY = window.scrollY; let lastT = performance.now();

    const apply = () => {
      const sx = 1 + x * 0.55;
      const sy = 1 - x;
      el.style.transform = `rotate(${(x * 26).toFixed(3)}deg) scale(${sx.toFixed(4)}, ${sy.toFixed(4)})`;
    };
    const step = (t) => {
      const dt = Math.min(0.032, (t - (last || t)) / 1000) || 0.016;
      last = t;
      const a = -K * x - C * v;
      v += a * dt;
      x += v * dt;
      if (x > CAP) { x = CAP; v = Math.min(v, 0); }
      if (x < -CAP) { x = -CAP; v = Math.max(v, 0); }
      if (Math.abs(x) < 0.0004 && Math.abs(v) < 0.004) {
        x = 0; v = 0; el.style.transform = ''; raf = 0; last = 0; return;
      }
      apply();
      raf = requestAnimationFrame(step);
    };
    const onScroll = () => {
      const now = performance.now();
      const dy = window.scrollY - lastY;
      const dtm = Math.min(50, Math.max(8, now - lastT)); // first event after idle: assume a fresh gesture
      lastY = window.scrollY; lastT = now;
      const vel = dy / dtm; // px per ms
      const impulse = Math.max(-1.6, Math.min(1.6, vel * 0.9));
      v += impulse * (impulse > 0 ? 1 : 0.55); // up-scroll is lighter
      if (!raf) raf = requestAnimationFrame(step);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); el.style.transform = ''; };
  }, [reduced, small]);

  const Tag = small ? 'span' : 'h1';
  return (
    <Tag id={id} className={small ? 'wordmark wordmark--small' : 'wordmark'}>
      <span ref={ref} className="wordmark-jelly">
        Skilly
        <svg className="wordmark-drip" viewBox="0 0 60 26" aria-hidden="true" focusable="false">
          <path d="M4 6c10 4 30 5 50-2 3-1 5 2 3 5-6 9-21 16-34 15C11 23 3 16 2 10 1 7 2 5 4 6z" />
        </svg>
      </span>
    </Tag>
  );
}
