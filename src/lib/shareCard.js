// Shareable progress cards: builds the card data from saved progress and
// draws it onto a <canvas> as a PNG-ready image. Two formats:
//   wide   1200×630  (LinkedIn, X, link previews)
//   square 1080×1080 (WhatsApp, Instagram)
// Everything stays on the device: the image is made in the browser.
import { levelSummary } from './engine.js';
import { LANGUAGE_BY_ID } from '../data/questions/index.js';
import { PATHS } from '../data/paths.js';
import { PROBLEMS } from '../data/codeProblems.js';
import { streakInfo } from './streak.js';

export const FORMATS = {
  wide: { w: 1200, h: 630, label: 'Wide · LinkedIn / X' },
  square: { w: 1080, h: 1080, label: 'Square · WhatsApp / Instagram' },
};

const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : '');
export { siteUrl, siteHost } from './platform.js';
import { siteUrl, siteHost } from './platform.js';

// ─── Card data ─────────────────────────────────────────────────────────────
export function reportCard(report) {
  const level = levelSummary(report);
  const langs = report.languages.map((l) => LANGUAGE_BY_ID[l]?.label || l);
  return {
    kind: 'report',
    eyebrow: 'Skill test result',
    langs,
    difficulty: cap(report.difficulty),
    correct: report.correct,
    total: report.total,
    accuracy: Math.round(report.accuracy),
    headline: level.headline,
    scope: `${report.total} ${cap(report.difficulty)} questions · ${langs.join(', ')}`,
    date: new Date(report.submittedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }),
  };
}

export function progressCard(state) {
  const st = streakInfo(state.activity);
  const reports = state.reports || [];
  const correct = reports.reduce((n, r) => n + (r.correct || 0), 0);
  const total = reports.reduce((n, r) => n + (r.total || 0), 0);
  const solved = Object.keys(state.code || {}).filter((id) => PROBLEMS.some((p) => p.id === id)).length;
  let weeks = 0;
  let top = null;
  for (const p of PATHS) {
    const prog = state.paths?.[p.id];
    if (!prog) continue;
    const w = Object.values(prog.weeks || {}).filter(Boolean).length;
    const steps = p.steps.filter((s) => prog.done?.[s.id]).length;
    weeks += w;
    const score = steps * 10 + w;
    if (score > 0 && (!top || score > top.score)) top = { title: p.title, icon: p.icon, steps, total: p.steps.length, score };
  }
  return {
    kind: 'progress',
    eyebrow: 'My learning progress',
    streak: st.current,
    best: st.best,
    solved,
    problems: PROBLEMS.length,
    tests: reports.length,
    accuracy: total ? Math.round((correct / total) * 100) : null,
    weeks,
    top,
    date: new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }),
  };
}

export function hasProgress(card) {
  return card.streak > 0 || card.solved > 0 || card.tests > 0 || card.weeks > 0 || !!card.top;
}

export function caption(card) {
  const url = siteUrl();
  if (card.kind === 'report') {
    const article = /^[AEIOU]/i.test(card.difficulty) ? 'an' : 'a';
    return `I took ${article} ${card.difficulty} ${card.langs.join(' + ')} skill test on Skilly: ${card.correct}/${card.total} correct (${card.accuracy}%). ${card.headline}. Find out where you stand: ${url}`;
  }
  const bits = [];
  if (card.streak) bits.push(`🔥 ${card.streak}-day learning streak`);
  if (card.solved) bits.push(`💻 ${card.solved} coding problem${card.solved === 1 ? '' : 's'} solved`);
  if (card.tests) bits.push(`📝 ${card.tests} skill test${card.tests === 1 ? '' : 's'}`);
  if (card.weeks) bits.push(`📚 ${card.weeks} study week${card.weeks === 1 ? '' : 's'} done`);
  if (card.top) bits.push(`${card.top.title}: ${card.top.steps}/${card.top.total} steps`);
  return `My progress on Skilly: ${bits.join(' · ') || 'just getting started'}. Practise what’s next: ${url}`;
}

// ─── Drawing ───────────────────────────────────────────────────────────────
const C = {
  bg1: '#140b18', bg2: '#2b1832', plum: '#3b2442', violet: '#8a64b8', lav: '#cdb9ec', pink: '#ec8ea4',
  text: '#f5f0f9', muted: '#b3a6c0', line: 'rgba(255,255,255,0.14)', ok: '#86d9ae', warn: '#f3cd7f', orange: '#f3a55b',
};
const DISPLAY = "'Fredoka', 'Nunito', system-ui, sans-serif";
const BODY = "'Manrope', system-ui, -apple-system, 'Segoe UI', sans-serif";

export async function ensureFonts() {
  if (!document.fonts?.load) return;
  try {
    await Promise.race([
      Promise.all([
        document.fonts.load(`600 64px ${DISPLAY}`), document.fonts.load(`700 32px ${BODY}`), document.fonts.load(`500 24px ${BODY}`),
      ]),
      new Promise((r) => setTimeout(r, 2500)), // never block sharing on slow font loads
    ]);
  } catch { /* fall back to system fonts */ }
}

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Shrinks the font until the text fits maxWidth.
function fit(ctx, text, maxWidth, size, weight, family, min = 14) {
  let s = size;
  do { ctx.font = `${weight} ${s}px ${family}`; s -= 2; } while (ctx.measureText(text).width > maxWidth && s > min);
  return text;
}

// Word-wraps into at most `lines` lines, adding an ellipsis if needed.
function wrap(ctx, text, maxWidth, lines) {
  const words = String(text).split(/\s+/);
  const out = [];
  let cur = '';
  for (const w of words) {
    const t = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(t).width <= maxWidth) cur = t;
    else { out.push(cur); cur = w; }
  }
  if (cur) out.push(cur);
  if (out.length > lines) {
    const kept = out.slice(0, lines);
    let last = kept[lines - 1];
    while (ctx.measureText(`${last}…`).width > maxWidth && last.length) last = last.slice(0, -1);
    kept[lines - 1] = `${last.trimEnd()}…`;
    return kept;
  }
  return out;
}

function background(ctx, w, h, sq) {
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, C.bg2); g.addColorStop(0.55, C.bg1); g.addColorStop(1, '#0a060d');
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  const glow = (x, y, r, color) => {
    const rg = ctx.createRadialGradient(x, y, 0, x, y, r);
    rg.addColorStop(0, color); rg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = rg; ctx.fillRect(0, 0, w, h);
  };
  glow(w * 0.85, h * 0.1, h * 0.75, 'rgba(138,100,184,0.45)');
  glow(w * 0.1, h * 0.95, h * 0.6, 'rgba(236,142,164,0.22)');
  // Glass bubbles, echoing the site.
  // Small and placed in empty space only, so they never sit behind text.
  const spots = sq
    ? [[w * 0.9, h * 0.2, h * 0.035], [w * 0.95, h * 0.27, h * 0.015]]
    : [[w * 0.53, h * 0.13, h * 0.045], [w * 0.585, h * 0.2, h * 0.02]];
  for (const [x, y, r] of spots) {
    const bg = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.05, x, y, r);
    bg.addColorStop(0, 'rgba(255,255,255,0.35)'); bg.addColorStop(0.35, 'rgba(205,185,236,0.12)'); bg.addColorStop(1, 'rgba(205,185,236,0.03)');
    ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 1.5; ctx.stroke();
  }
}

function brand(ctx, x, y, size) {
  ctx.font = `600 ${size}px ${DISPLAY}`;
  ctx.fillStyle = C.text; ctx.textBaseline = 'alphabetic';
  ctx.fillText('Skilly', x, y);
  const wdt = ctx.measureText('Skilly').width;
  ctx.fillStyle = C.pink; ctx.beginPath(); ctx.ellipse(x + wdt - size * 0.12, y + size * 0.14, size * 0.1, size * 0.06, 0, 0, Math.PI * 2); ctx.fill();
}

function ring(ctx, cx, cy, r, pct, label, sub) {
  ctx.lineWidth = r * 0.16;
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
  const g = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
  g.addColorStop(0, C.lav); g.addColorStop(1, C.pink);
  ctx.strokeStyle = g; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * Math.max(0.001, pct)) / 100); ctx.stroke();
  ctx.lineCap = 'butt';
  ctx.textAlign = 'center';
  ctx.fillStyle = C.text; ctx.font = `600 ${r * 0.56}px ${DISPLAY}`; ctx.fillText(label, cx, cy + r * 0.12);
  ctx.fillStyle = C.muted; ctx.font = `600 ${r * 0.2}px ${BODY}`; ctx.fillText(sub, cx, cy + r * 0.42);
  ctx.textAlign = 'left';
}

function chip(ctx, x, y, text, size, fill = 'rgba(255,255,255,0.08)', color = C.text) {
  ctx.font = `700 ${size}px ${BODY}`;
  const w = ctx.measureText(text).width + size * 1.3;
  const h = size * 1.9;
  ctx.fillStyle = fill; rr(ctx, x, y, w, h, h / 2); ctx.fill();
  ctx.strokeStyle = C.line; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.fillStyle = color; ctx.fillText(text, x + size * 0.65, y + h * 0.68);
  return w;
}

function footer(ctx, w, h, pad, name, size) {
  ctx.strokeStyle = C.line; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(pad, h - pad - size * 2.2); ctx.lineTo(w - pad, h - pad - size * 2.2); ctx.stroke();
  ctx.font = `700 ${size}px ${BODY}`; ctx.fillStyle = C.text;
  if (name) { fit(ctx, name, w * 0.45, size, 700, BODY); ctx.fillText(name, pad, h - pad - size * 0.3); }
  ctx.font = `600 ${size}px ${BODY}`; ctx.fillStyle = C.lav; ctx.textAlign = 'right';
  ctx.fillText(siteHost(), w - pad, h - pad - size * 0.3);
  ctx.textAlign = 'left';
}

export function drawCard(canvas, card, { format = 'wide', name = '' } = {}) {
  const { w, h } = FORMATS[format];
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  const sq = format === 'square';
  const pad = sq ? 72 : 64;
  background(ctx, w, h, sq);
  brand(ctx, pad, pad + (sq ? 52 : 44), sq ? 64 : 54);
  ctx.font = `800 ${sq ? 22 : 19}px ${BODY}`; ctx.fillStyle = C.lav;
  const eb = card.eyebrow.toUpperCase().split('').join(' ');
  ctx.textAlign = 'right'; ctx.fillText(eb, w - pad, pad + (sq ? 40 : 34)); ctx.textAlign = 'left';

  if (card.kind === 'report') drawReport(ctx, card, w, h, pad, sq);
  else drawProgress(ctx, card, w, h, pad, sq);
  footer(ctx, w, h, pad, name, sq ? 26 : 22);
  return canvas;
}

function drawReport(ctx, c, w, h, pad, sq) {
  const r = sq ? 170 : 132;
  const cx = sq ? w / 2 : w - pad - r - 30;
  const cy = sq ? 395 : 318;
  ring(ctx, cx, cy, r, c.accuracy, `${c.accuracy}%`, 'accuracy');

  let x = pad;
  let y = sq ? 630 : 190;
  const textW = sq ? w - pad * 2 : w - pad * 2 - r * 2 - 80;
  if (sq) ctx.textAlign = 'left';
  // Chips: languages + difficulty
  let cxp = x;
  for (const t of [...c.langs.slice(0, 3), c.difficulty]) {
    const cw = chip(ctx, cxp, y, t, sq ? 24 : 20, t === c.difficulty ? 'rgba(236,142,164,0.18)' : 'rgba(255,255,255,0.08)');
    cxp += cw + 10;
    if (cxp > x + textW - 80) break;
  }
  y += sq ? 120 : 108;
  ctx.fillStyle = C.text; ctx.font = `600 ${sq ? 96 : 92}px ${DISPLAY}`;
  ctx.fillText(`${c.correct}/${c.total}`, x, y);
  const sw = ctx.measureText(`${c.correct}/${c.total}`).width;
  ctx.font = `600 ${sq ? 30 : 26}px ${BODY}`; ctx.fillStyle = C.muted;
  ctx.fillText('correct', x + sw + 16, y - 8);
  y += sq ? 70 : 62;
  ctx.font = `600 ${sq ? 46 : 40}px ${DISPLAY}`; ctx.fillStyle = C.lav;
  for (const line of wrap(ctx, c.headline, textW, 2)) { ctx.fillText(line, x, y); y += sq ? 54 : 46; }
  ctx.font = `500 ${sq ? 26 : 22}px ${BODY}`; ctx.fillStyle = C.muted;
  for (const line of wrap(ctx, `Based on ${c.scope} · ${c.date}`, textW, 2)) { ctx.fillText(line, x, y + 4); y += sq ? 34 : 30; }
}

function drawProgress(ctx, c, w, h, pad, sq) {
  // Streak hero
  let y = sq ? 300 : 190;
  const big = sq ? 160 : 120;
  ctx.font = `${sq ? 96 : 76}px ${BODY}`;
  ctx.fillText(c.streak > 0 ? '🔥' : '🌱', pad - 6, y + (sq ? 20 : 12));
  ctx.font = `600 ${big}px ${DISPLAY}`; ctx.fillStyle = C.text;
  const sx = pad + (sq ? 120 : 96);
  ctx.fillText(String(c.streak), sx, y + (sq ? 30 : 22));
  const nw = ctx.measureText(String(c.streak)).width;
  ctx.font = `700 ${sq ? 34 : 28}px ${BODY}`; ctx.fillStyle = C.text;
  ctx.fillText(`day streak`, sx + nw + 18, y - (sq ? 14 : 10));
  ctx.font = `500 ${sq ? 26 : 22}px ${BODY}`; ctx.fillStyle = C.muted;
  ctx.fillText(c.best > c.streak ? `Best: ${c.best} days` : c.streak ? 'Personal best!' : 'Starting today', sx + nw + 18, y + (sq ? 26 : 22));

  // Stat tiles
  const tiles = [
    [String(c.solved), `coding problem${c.solved === 1 ? '' : 's'} solved`, C.ok],
    [String(c.tests), `skill test${c.tests === 1 ? '' : 's'}${c.accuracy ? ` · ${c.accuracy}% acc.` : ''}`, C.lav],
    [String(c.weeks), `study week${c.weeks === 1 ? '' : 's'} done`, C.orange],
  ];
  const gap = 18;
  const cols = 3;
  const tw = (w - pad * 2 - gap * (cols - 1)) / cols;
  const th = sq ? 250 : 150;
  const ty = sq ? 440 : 268;
  tiles.forEach(([n, label, color], i) => {
    const tx = pad + i * (tw + gap);
    ctx.fillStyle = 'rgba(255,255,255,0.06)'; rr(ctx, tx, ty, tw, th, 22); ctx.fill();
    ctx.strokeStyle = C.line; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = color; ctx.fillRect(tx + 22, ty + 22, 36, 5);
    ctx.font = `600 ${sq ? 88 : 60}px ${DISPLAY}`; ctx.fillStyle = C.text;
    fit(ctx, n, tw - 44, sq ? 88 : 60, 600, DISPLAY);
    ctx.fillText(n, tx + 22, ty + (sq ? 140 : 88));
    ctx.font = `600 ${sq ? 25 : 18}px ${BODY}`; ctx.fillStyle = C.muted;
    wrap(ctx, label, tw - 44, 2).forEach((line, li) => ctx.fillText(line, tx + 22, ty + (sq ? 188 : 118) + li * (sq ? 31 : 22)));
  });

  // Top career path progress
  const py = ty + th + (sq ? 110 : 52);
  if (c.top) {
    ctx.font = `700 ${sq ? 30 : 24}px ${BODY}`; ctx.fillStyle = C.text;
    const label = `${c.top.title}`;
    fit(ctx, label, w - pad * 2 - 160, sq ? 30 : 24, 700, BODY);
    ctx.fillText(label, pad, py);
    ctx.textAlign = 'right'; ctx.fillStyle = C.lav; ctx.font = `700 ${sq ? 28 : 22}px ${BODY}`;
    ctx.fillText(`${c.top.steps}/${c.top.total} steps`, w - pad, py); ctx.textAlign = 'left';
    const by = py + (sq ? 22 : 16);
    const bw = w - pad * 2;
    const bh = sq ? 18 : 14;
    ctx.fillStyle = 'rgba(255,255,255,0.1)'; rr(ctx, pad, by, bw, bh, bh / 2); ctx.fill();
    const g = ctx.createLinearGradient(pad, 0, pad + bw, 0); g.addColorStop(0, C.lav); g.addColorStop(1, C.pink);
    ctx.fillStyle = g; rr(ctx, pad, by, Math.max(bh, (bw * c.top.steps) / c.top.total), bh, bh / 2); ctx.fill();
  } else {
    ctx.font = `500 ${sq ? 26 : 22}px ${BODY}`; ctx.fillStyle = C.muted;
    ctx.fillText(`${c.problems} coding problems and ${PATHS.length} career paths to explore · ${c.date}`, pad, py);
  }
}

export function canvasToBlob(canvas) {
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), 'image/png'));
}
