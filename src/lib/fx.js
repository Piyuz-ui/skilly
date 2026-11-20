// Global, delegated interaction effects (one listener each, no per-element setup):
// • .fx-tilt  — 3D tilt toward the pointer + a glass sheen that follows it
// • .fx-glow  — sheen only
// • .reveal   — fades/rises in when scrolled into view
// • pointer spotlight — a soft glow that trails the cursor across the page
// All motion is skipped under prefers-reduced-motion.
export function initFx() {
  if (typeof window === 'undefined' || window.__skillyFx) return;
  window.__skillyFx = true;
  const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia?.('(pointer: fine)').matches;

  let active = null;
  const reset = (el) => { el.style.removeProperty('--rx'); el.style.removeProperty('--ry'); el.classList.remove('fx-on'); };
  document.addEventListener('pointermove', (e) => {
    const el = e.target.closest?.('.fx-tilt, .fx-glow');
    if (active && active !== el) { reset(active); active = null; }
    if (el) {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width; const y = (e.clientY - r.top) / r.height;
      el.style.setProperty('--mx', `${x * 100}%`);
      el.style.setProperty('--my', `${y * 100}%`);
      el.classList.add('fx-on');
      if (el.classList.contains('fx-tilt') && fine && !reduced()) {
        el.style.setProperty('--rx', `${(0.5 - y) * 7}deg`);
        el.style.setProperty('--ry', `${(x - 0.5) * 9}deg`);
      }
      active = el;
    }
    if (fine && !reduced()) {
      document.documentElement.style.setProperty('--px', `${e.clientX}px`);
      document.documentElement.style.setProperty('--py', `${e.clientY}px`);
    }
  }, { passive: true });
  document.addEventListener('pointerleave', () => { if (active) reset(active); active = null; });

  // Scroll reveal for current and future .reveal elements.
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -8% 0px' }) : null;
  const inView = (el) => { const r = el.getBoundingClientRect(); return r.top < window.innerHeight && r.bottom > 0; };
  const watch = (el) => { if (!io || inView(el)) el.classList.add('in'); else io.observe(el); };
  const scan = (root) => root.querySelectorAll?.('.reveal:not(.in)').forEach(watch);
  // Safety net for fast jumps (anchor links, scrollTo): reveal everything at or above the fold.
  let lastCheck = 0;
  window.addEventListener('scroll', () => {
    const now = performance.now(); if (now - lastCheck < 120) return; lastCheck = now;
    document.querySelectorAll('.reveal:not(.in)').forEach((el) => { if (el.getBoundingClientRect().top < window.innerHeight) { el.classList.add('in'); io?.unobserve(el); } });
  }, { passive: true });
  scan(document);
  new MutationObserver((muts) => muts.forEach((m) => m.addedNodes.forEach((n) => { if (n.nodeType === 1) { if (n.matches('.reveal:not(.in)')) watch(n); scan(n); } })))
    .observe(document.body, { childList: true, subtree: true });
}
