// Three.js glass-bubble layer for the hero. Decorative (aria-hidden).
// • Every bubble carries a technology mark; six start composed on screen and
//   the rest spawn just outside both edges, drift inward on curved paths
//   around a reserved central zone, exit and are recycled.
// • Bubbles lean away from the pointer, the camera parallaxes slightly, and
//   clicking a bubble in empty hero space pops it with a particle burst.
// • Reduced motion: a single static frame, no interaction.
import * as THREE from 'three';
import { LOGOS, HERO_LOGOS, DRIFT_LOGOS, svgDataUrl } from '../lib/logos.js';

const VERT = /* glsl */`
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

// Lightweight glass: fresnel rim, fake environment reflection, two speculars,
// thin-film tint and a slightly darker, lensed interior.
const FRAG = /* glsl */`
  uniform float uCore;
  uniform float uTime;
  uniform float uFade;
  uniform vec3 uTint;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vec3 N = normalize(vN);
    vec3 V = normalize(-vV);
    float ndv = max(dot(N, V), 0.0);
    float fres = pow(1.0 - ndv, 2.4);
    vec3 R = reflect(-V, N);
    float sky = smoothstep(-0.35, 0.95, R.y);
    vec3 env = mix(vec3(0.07, 0.03, 0.10), vec3(0.78, 0.66, 0.95), sky);
    env += vec3(0.95, 0.55, 0.75) * smoothstep(0.6, 1.0, -R.x) * 0.15;
    float spec = pow(max(dot(R, normalize(vec3(-0.45, 0.72, 0.55))), 0.0), 70.0);
    float soft = pow(max(dot(R, normalize(vec3(-0.35, 0.55, 0.75))), 0.0), 9.0) * 0.18;
    float low = pow(max(dot(R, normalize(vec3(0.5, -0.6, 0.6))), 0.0), 14.0) * 0.22;
    vec3 body = mix(vec3(0.16, 0.07, 0.19), vec3(0.46, 0.28, 0.50), 0.5 + 0.5 * N.y);
    body = mix(body, uTint, 0.12);
    vec3 film = 0.5 + 0.5 * cos(6.2831 * (fres * 0.9 + uTime * 0.02 + vec3(0.0, 0.33, 0.67)));
    vec3 col = body * 0.6 + env * fres * 0.95 + film * fres * 0.12
             + vec3(1.0) * spec * 1.4 + vec3(1.0, 0.95, 1.0) * soft + vec3(0.85, 0.75, 1.0) * low;
    col += mix(vec3(0.86, 0.72, 1.0), uTint, 0.35) * pow(fres, 5.0) * 0.7;
    float alpha = clamp(uCore + fres * 0.75 + spec + soft, 0.0, 1.0) * uFade;
    gl_FragColor = vec4(col, alpha);
  }
`;

const TINTS = { javascript: '#f7df1e', python: '#3a74b4', react: '#61dafb', gfg: '#2f8d46', vscode: '#0078d4', typescript: '#3178c6', cpp: '#00599c', java: '#e76f00', go: '#00add8', rust: '#ce422b', kotlin: '#7f52ff', swift: '#f05138', php: '#777bb4', ruby: '#cc342d', dart: '#13b9fd', docker: '#2496ed', git: '#f05032', node: '#5fa04e', sql: '#cdb9ec', html: '#e34f26', css: '#1572b6', github: '#cdb9ec' };

function svgTexture(svgText, onReady) {
  const img = new Image();
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  img.onload = () => {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 256, 256);
    ctx.drawImage(img, 28, 28, 200, 200);
    tex.needsUpdate = true;
    onReady?.();
  };
  img.src = svgDataUrl(svgText);
  return tex;
}

function labelTexture(text) {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 96;
  const ctx = c.getContext('2d');
  ctx.font = '500 44px "Manrope", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(240, 232, 250, 0.82)';
  ctx.fillText(text, 256, 48);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Composed first-paint layout (normalised screen coords) for the hero logos.
const INITIAL = {
  github: { nx: -0.70, ny: 0.05, r: 1.0, dir: 1 },
  javascript: { nx: -0.42, ny: 0.55, r: 0.62, dir: 1 },
  vscode: { nx: -0.52, ny: -0.45, r: 0.8, dir: 1 },
  python: { nx: 0.66, ny: 0.48, r: 0.95, dir: -1 },
  react: { nx: 0.80, ny: -0.22, r: 0.75, dir: -1 },
  gfg: { nx: 0.40, ny: -0.58, r: 0.66, dir: -1 },
};

const PARTICLES = 26;

export function createBubbleScene(canvas, { reducedMotion = false, mobile = false, host = canvas.parentElement } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.z = 14;
  const tanHalf = Math.tan(THREE.MathUtils.degToRad(35 / 2));

  const sphereGeo = new THREE.SphereGeometry(1, 48, 32);
  const planeGeo = new THREE.PlaneGeometry(1, 1);
  const disposables = [sphereGeo, planeGeo];
  const bubbles = [];
  const bursts = [];
  let aspect = 1;
  let short = false; // phone held sideways: little height, text spans more width
  let sizeScale = 1;
  let time = 0;
  const pointer = { x: 0, y: 0, active: false, sx: 0, sy: 0 };

  const halfH = (z) => (camera.position.z - z) * tanHalf;
  const halfW = (z) => halfH(z) * aspect;
  const rand = (a, b) => a + Math.random() * (b - a);

  function makeBubble(logoKey) {
    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: false,
      uniforms: { uCore: { value: 0.2 }, uTime: { value: 0 }, uFade: { value: 1 }, uTint: { value: new THREE.Color(TINTS[logoKey] || '#cdb9ec') } },
    });
    const group = new THREE.Group();
    const sphere = new THREE.Mesh(sphereGeo, mat);
    sphere.renderOrder = 2;
    group.add(sphere);
    const logoTex = svgTexture(LOGOS[logoKey].svg, () => { if (reducedMotion) render(); });
    const logoMat = new THREE.MeshBasicMaterial({ map: logoTex, transparent: true, depthWrite: false, opacity: 0.94 });
    const logo = new THREE.Mesh(planeGeo, logoMat);
    logo.renderOrder = 1;
    logo.scale.setScalar(1.05);
    group.add(logo);
    const lblTex = labelTexture(LOGOS[logoKey].label);
    const lblMat = new THREE.MeshBasicMaterial({ map: lblTex, transparent: true, depthWrite: false });
    const lbl = new THREE.Mesh(planeGeo, lblMat);
    lbl.scale.set(2.5, 0.47, 1);
    lbl.position.y = -1.38;
    lbl.renderOrder = 3;
    lbl.visible = !mobile;
    group.add(lbl);
    disposables.push(mat, logoTex, logoMat, lblTex, lblMat);
    scene.add(group);
    const b = { group, sphere, logoMat, lblMat, logoKey, x: 0, y: 0, z: 0, r: 1, dir: 1, speed: 0.3, baseY: 0, amp: 0.4, freq: 0.3, phase: 0, ox: 0, oy: 0, pop: -1, wob: 0 };
    sphere.userData.bubble = b;
    bubbles.push(b);
    return b;
  }

  function setFade(b, f) {
    b.sphere.material.uniforms.uFade.value = f;
    b.logoMat.opacity = 0.94 * f;
    b.lblMat.opacity = f;
  }

  function spawn(b, { initial = null, offset = 0 } = {}) {
    b.z = initial ? rand(-0.5, 0.8) : rand(-3.2, 1.2);
    b.r = (initial?.r ?? rand(0.4, 0.85)) * sizeScale;
    b.dir = initial?.dir ?? (Math.random() < 0.5 ? 1 : -1);
    b.speed = rand(0.18, 0.4) * (mobile ? 0.8 : 1);
    const hw = halfW(b.z); const hh = halfH(b.z);
    b.baseY = initial ? initial.ny * hh : (Math.random() < 0.5 ? -1 : 1) * rand(0.25, 0.85) * hh;
    b.amp = rand(0.15, 0.45) * hh * 0.35;
    b.freq = rand(0.15, 0.35);
    b.phase = rand(0, Math.PI * 2);
    b.x = initial ? initial.nx * hw : -b.dir * (hw + b.r * 1.6 + offset);
    b.ox = 0; b.oy = 0; b.pop = -1; b.wob = 0;
    b.group.scale.setScalar(b.r);
    setFade(b, 1);
  }

  // Keeps bubbles out of an elliptical zone around the wordmark.
  function place(b) {
    const hw = halfW(b.z); const hh = halfH(b.z);
    let y = b.baseY + Math.sin(time * b.freq + b.phase) * b.amp + Math.sin(b.x / hw * 1.6 + b.phase) * b.amp * 0.6;
    const nx = b.x / hw;
    const rx = mobile ? 1.4 : short ? 0.82 : aspect > 1.7 ? 0.5 : 0.66; const ry = short ? 1.1 : 0.6;
    if (Math.abs(nx) < rx) {
      const s = Math.sign(b.baseY) || 1;
      const minY = (ry * Math.sqrt(1 - (nx / rx) ** 2)) * hh + b.r * 1.15;
      y = s * Math.max(y * s, minY);
    }
    b.y = y;
    b.group.position.set(b.x + b.ox, b.y + b.oy, b.z);
  }

  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    aspect = w / h;
    short = h < 480;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    sizeScale = Math.min(1, Math.max(mobile ? 0.8 : 0.5, halfW(0) / 7));
    bubbles.forEach((b) => b.group.scale.setScalar(b.r));
    if (reducedMotion) { bubbles.forEach(place); render(); }
  }

  // Build: hero logos composed; drift logos staggered just off both edges.
  resize();
  HERO_LOGOS.forEach((k) => spawn(makeBubble(k), { initial: INITIAL[k] }));
  const drift = mobile ? DRIFT_LOGOS.slice(0, 8) : DRIFT_LOGOS;
  drift.forEach((k, i) => {
    const b = makeBubble(k);
    spawn(b, { offset: (i % 8) * 1.4 });
    if (i < (mobile ? 2 : 4)) b.x = (i % 2 ? 1 : -1) * halfW(b.z) * rand(0.78, 0.96); // a few already visible
  });
  if (reducedMotion) bubbles.forEach((b) => { if (Math.abs(b.x) > halfW(b.z)) b.group.visible = false; });
  bubbles.forEach(place);

  // ── Particle bursts ──
  const dotTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const g = c.getContext('2d'); const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, 'rgba(255,255,255,1)'); grd.addColorStop(0.4, 'rgba(230,200,255,0.6)'); grd.addColorStop(1, 'rgba(230,200,255,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
    const t = new THREE.CanvasTexture(c); disposables.push(t); return t;
  })();
  function burst(b) {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(PARTICLES * 3);
    const vel = [];
    for (let i = 0; i < PARTICLES; i++) {
      const a = Math.random() * Math.PI * 2; const e = rand(-0.6, 0.6); const sp = rand(1.2, 3.2) * b.r;
      pos[i * 3] = b.group.position.x; pos[i * 3 + 1] = b.group.position.y; pos[i * 3 + 2] = b.z;
      vel.push(Math.cos(a) * sp, Math.sin(a) * sp, e * sp);
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ map: dotTex, size: 0.32 * b.r + 0.12, transparent: true, depthWrite: false, color: new THREE.Color(TINTS[b.logoKey]).lerp(new THREE.Color('#ffffff'), 0.45), blending: THREE.AdditiveBlending });
    const pts = new THREE.Points(geo, mat);
    pts.renderOrder = 4;
    scene.add(pts);
    bursts.push({ pts, geo, mat, vel, t: 0 });
  }

  function render() { renderer.render(scene, camera); }

  // ── Pointer: repel, hover cursor, click-to-pop ──
  let pops = 0;
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const toNdc = (e) => {
    const r = canvas.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1, r];
  };
  const hit = (x, y) => {
    ndc.set(x, y); ray.setFromCamera(ndc, camera);
    const found = ray.intersectObjects(bubbles.filter((b) => b.pop < 0 && b.group.visible).map((b) => b.sphere), false)[0];
    return found?.object.userData.bubble || null;
  };
  const interactive = (t) => t.closest?.('a, button, input, select, label, textarea, h1, p');
  const onMove = (e) => {
    const [x, y, r] = toNdc(e);
    pointer.active = e.clientY >= r.top && e.clientY <= r.bottom; pointer.x = x; pointer.y = y;
    if (pointer.active && !interactive(e.target)) host.style.cursor = hit(x, y) ? 'pointer' : '';
  };
  const onLeave = () => { pointer.active = false; host.style.cursor = ''; };
  const onDown = (e) => {
    if (interactive(e.target)) return;
    const [x, y] = toNdc(e);
    const b = hit(x, y);
    if (b) { b.pop = 0; pops++; burst(b); }
  };
  if (!reducedMotion) {
    host.addEventListener('pointermove', onMove, { passive: true });
    host.addEventListener('pointerleave', onLeave);
    host.addEventListener('pointerdown', onDown);
  }

  let raf = 0; let last = 0; let running = false;
  function frame(t) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (t - (last || t)) / 1000);
    last = t;
    time += dt;
    // smoothed pointer → gentle camera parallax
    pointer.sx += ((pointer.active ? pointer.x : 0) - pointer.sx) * Math.min(1, dt * 3);
    pointer.sy += ((pointer.active ? pointer.y : 0) - pointer.sy) * Math.min(1, dt * 3);
    camera.position.x = pointer.sx * 0.35;
    camera.position.y = pointer.sy * 0.22;
    camera.lookAt(0, 0, 0);
    for (const b of bubbles) {
      b.x += b.dir * b.speed * dt;
      b.sphere.material.uniforms.uTime.value = time;
      // lean away from the pointer, with a little jelly wobble
      let tx = 0; let ty = 0;
      if (pointer.active && b.pop < 0) {
        const px = pointer.x * halfW(b.z); const py = pointer.y * halfH(b.z);
        const dx = b.x + b.ox - px; const dy = b.y + b.oy - py;
        const d = Math.hypot(dx, dy) || 0.001; const R = b.r * 2.4 + 0.8;
        if (d < R) { const f = (1 - d / R) * 0.5 * b.r; tx = (dx / d) * f; ty = (dy / d) * f; b.wob = Math.min(1, b.wob + dt * 2); }
      }
      b.ox += (tx - b.ox) * Math.min(1, dt * 5);
      b.oy += (ty - b.oy) * Math.min(1, dt * 5);
      b.wob = Math.max(0, b.wob - dt * 0.8);
      if (b.pop >= 0) {
        b.pop += dt / 0.32;
        const p = Math.min(1, b.pop);
        b.group.scale.setScalar(b.r * (1 + p * 0.45));
        setFade(b, 1 - p);
        if (p >= 1) spawn(b, { offset: rand(0, 2) });
      } else {
        const w = 1 + Math.sin(time * 9 + b.phase) * 0.035 * b.wob;
        b.group.scale.set(b.r * w, b.r / w, b.r);
      }
      const hw = halfW(b.z);
      if ((b.dir > 0 && b.x > hw + b.r * 1.6) || (b.dir < 0 && b.x < -hw - b.r * 1.6)) spawn(b);
      place(b);
    }
    for (let i = bursts.length - 1; i >= 0; i--) {
      const s = bursts[i]; s.t += dt;
      const a = s.geo.attributes.position.array;
      for (let k = 0; k < PARTICLES; k++) {
        a[k * 3] += s.vel[k * 3] * dt; a[k * 3 + 1] += s.vel[k * 3 + 1] * dt - 0.6 * s.t * dt; a[k * 3 + 2] += s.vel[k * 3 + 2] * dt;
        s.vel[k * 3] *= 0.96; s.vel[k * 3 + 1] *= 0.96;
      }
      s.geo.attributes.position.needsUpdate = true;
      s.mat.opacity = Math.max(0, 1 - s.t / 0.9);
      if (s.t > 0.9) { scene.remove(s.pts); s.geo.dispose(); s.mat.dispose(); bursts.splice(i, 1); }
    }
    render();
  }

  return {
    // dev/test aid: projected screen positions of visible bubbles + pop count
    debug() {
      const r = canvas.getBoundingClientRect(); const v = new THREE.Vector3();
      camera.updateMatrixWorld(); scene.updateMatrixWorld();
      return {
        pops,
        bubbles: bubbles.filter((b) => b.group.visible && b.pop < 0).map((b) => {
          v.copy(b.group.position).project(camera);
          return { logo: b.logoKey, x: r.left + ((v.x + 1) / 2) * r.width, y: r.top + ((1 - v.y) / 2) * r.height };
        }).filter((p) => p.x > r.left && p.x < r.right && p.y > r.top && p.y < r.bottom),
      };
    },
    start() {
      if (reducedMotion) { render(); return; }
      if (running) return;
      running = true; last = 0; raf = requestAnimationFrame(frame);
    },
    stop() { running = false; cancelAnimationFrame(raf); },
    resize,
    dispose() {
      cancelAnimationFrame(raf);
      running = false;
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      host.removeEventListener('pointerdown', onDown);
      host.style.cursor = '';
      bursts.forEach((s) => { s.geo.dispose(); s.mat.dispose(); });
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.forceContextLoss?.();
    },
  };
}

export function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch { return false; }
}
