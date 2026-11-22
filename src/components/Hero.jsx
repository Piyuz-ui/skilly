import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../lib/hooks.js';
import { LOGOS, svgDataUrl } from '../lib/logos.js';
import { JellyLogo } from './JellyLogo.jsx';

// Decorative WebGL bubbles; falls back to a static CSS glass illustration.
function BubbleLayer() {
  const canvasRef = useRef(null);
  const reduced = useReducedMotion();
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    let scene = null; let disposed = false; let io = null; let ro = null;
    let visible = true;
    const sync = () => { if (!scene) return; if (visible && !document.hidden) scene.start(); else scene.stop(); };
    const onVis = () => sync();

    // The 3D scene (three.js, ~120 kB) is decoration: start it only after the
    // page has loaded and the browser is idle, and use the light CSS version
    // on Data Saver or 2G connections.
    const conn = navigator.connection;
    if (conn?.saveData || /(^|-)2g$/.test(conn?.effectiveType || '')) { setFallback(true); return undefined; }
    const whenIdle = () => new Promise((res) => {
      const go = () => (window.requestIdleCallback ? requestIdleCallback(() => res(), { timeout: 1200 }) : setTimeout(res, 200));
      if (document.readyState === 'complete') go(); else window.addEventListener('load', go, { once: true });
    });

    whenIdle().then(() => (disposed ? null : import('./bubbleScene.js'))).then((mod) => {
      if (disposed || !mod) return;
      const { createBubbleScene, webglAvailable } = mod;
      if (!webglAvailable() || new URLSearchParams(location.search).has('nowebgl')) { setFallback(true); return; }
      try {
        scene = createBubbleScene(canvasRef.current, { reducedMotion: reduced, mobile: window.innerWidth < 700 });
      } catch { setFallback(true); return; }
      if (import.meta.env.DEV) window.__skillyScene = scene;
      io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); });
      io.observe(canvasRef.current);
      ro = new ResizeObserver(() => scene?.resize());
      ro.observe(canvasRef.current);
      document.addEventListener('visibilitychange', onVis);
      sync();
    }).catch(() => setFallback(true));

    return () => {
      disposed = true;
      io?.disconnect(); ro?.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      scene?.dispose();
    };
  }, [reduced]);

  if (fallback) {
    // [logo, x%, y%, size, mobile x%, mobile y%] — mobile null = hidden on phones
    const spots = [
      ['github', 9, 42, 120, 13, 13], ['javascript', 25, 14, 74, 88, 11], ['vscode', 20, 70, 96, null, null],
      ['python', 80, 18, 116, 86, 84], ['react', 88, 58, 90, 14, 84], ['gfg', 68, 76, 78, null, null],
      ['typescript', 6, 14, 64, null, null], ['docker', 94, 30, 70, null, null], ['rust', 36, 88, 58, null, null],
      ['kotlin', 93, 86, 62, null, null], ['git', 4, 86, 56, null, null], ['java', 60, 10, 54, null, null],
    ];
    return (
      <div className="css-bubbles" aria-hidden="true">
        {spots.map(([k, x, y, s, mx, my]) => (
          <div key={k} className={`css-bubble${mx === null ? ' desk-only' : ''}`} style={{ '--x': `${x}%`, '--y': `${y}%`, '--mx': `${mx}%`, '--my': `${my}%`, '--s': `${s}px` }}>
            <img src={svgDataUrl(LOGOS[k].svg)} alt="" />
            <span>{LOGOS[k].label}</span>
          </div>
        ))}
      </div>
    );
  }
  // key forces a fresh canvas (and WebGL context) if the motion preference changes
  return <canvas key={String(reduced)} ref={canvasRef} className="bubble-canvas" aria-hidden="true" tabIndex={-1} />;
}

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <BubbleLayer />
      <div className="hero-inner">
        <p className="eyebrow">Skill assessment · Learning paths</p>
        <JellyLogo id="hero-title" />
        <p className="hero-tag">Find out where you stand. Practise what’s next.</p>
        <p className="hero-hint" aria-hidden="true">psst — pop a bubble</p>
      </div>
    </section>
  );
}
