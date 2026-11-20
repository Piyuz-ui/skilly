import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { PATHS, PATH_BY_ID, SKILLS, CATEGORIES } from '../data/paths.js';
import { LANGUAGE_BY_ID } from '../data/questions/index.js';
import { useStore } from '../lib/store.js';
import { toggleStepDone, setRating, setHours, loadDemo, testLanguage } from '../lib/actions.js';
import { buildRows, readiness, buildSchedule } from '../lib/gap.js';
import { navigate, useReducedMotion } from '../lib/hooks.js';

const pathHours = (p) => Object.entries(p.targets).reduce((s, [id, [t]]) => s + t * SKILLS[id].hours, 0);

// ─── Index ─────────────────────────────────────────────────────────────────
export function PathCards({ compact = false, list = PATHS, exclude = null }) {
  const progress = useStore((s) => s.paths);
  const items = exclude ? list.filter((p) => p.id !== exclude) : list;
  return (
    <ul className={`path-grid${compact ? ' compact' : ''}`} role="list">
      {items.map((p, i) => {
        const done = Object.values(progress[p.id]?.done || {}).filter(Boolean).length;
        return (
          <li key={p.id} className="reveal" style={{ '--i': i, '--accent': p.accent }}>
            <a href={`#/paths/${p.id}`} className="slab path-card fx-tilt">
              <span className="pc-glow" aria-hidden="true" />
              <span className="pc-top"><span className="pc-icon" aria-hidden="true">{p.icon}</span>{p.branch && <span className="pc-branch">{p.branch}</span>}</span>
              <span className="pc-title">{p.title}</span>
              <span className="pc-sum">{p.summary}</span>
              <span className="pc-meta">{p.steps.length} steps · ~{pathHours(p)} h from zero{p.source === 'skillbridge' ? ' · SkillBridge role' : ''}</span>
              <span className="pc-bar" aria-hidden="true"><span style={{ width: `${(done / p.steps.length) * 100}%` }} /></span>
              <span className="sr-only">{done} of {p.steps.length} steps complete</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export function PathsIndex() {
  const [cat, setCat] = useState('all');
  const [q, setQ] = useState('');
  const needle = q.trim().toLowerCase();
  const list = PATHS.filter((p) => (cat === 'all' || p.category === cat)
    && (!needle || [p.title, p.summary, p.branch || '', ...p.steps.flatMap((s) => [s.title, ...s.chips])].join(' ').toLowerCase().includes(needle)));
  return (
    <main className="page wrap" id="main">
      <header className="page-head">
        <p className="step">Career paths · {PATHS.length} courses</p>
        <h1>Whole courses, step by step</h1>
        <p className="muted">Software, data and every core engineering branch. Each path is a full roadmap with what to learn, free courses, a project per step and a skill-gap planner that tells you what to study first and how long it will take.</p>
      </header>
      <div className="path-filters">
        <div className="chip-list" role="radiogroup" aria-label="Category">
          {CATEGORIES.map((c) => {
            const n = c.id === 'all' ? PATHS.length : PATHS.filter((p) => p.category === c.id).length;
            return <button key={c.id} type="button" role="radio" aria-checked={cat === c.id} className={`chip goal${cat === c.id ? ' on' : ''}`} onClick={() => setCat(c.id)}>{c.label} <span className="muted">{n}</span></button>;
          })}
        </div>
        <label className="search">
          <span className="sr-only">Search paths</span>
          <input id="path-search" type="search" placeholder="Search: VLSI, Kubernetes, CAD, ROS…" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
      </div>
      <p className="muted small" role="status">{list.length} {list.length === 1 ? 'path' : 'paths'}</p>
      {list.length ? <PathCards list={list} key={cat + needle} /> : (
        <div className="slab panel"><p>No paths match “{q}”. Try a broader word, or <button type="button" className="link" onClick={() => { setQ(''); setCat('all'); }}>show all paths</button>.</p></div>
      )}
    </main>
  );
}

// ─── Winding node map ──────────────────────────────────────────────────────
function NodeMap({ path, sel, onSelect, done }) {
  const wrap = useRef(null);
  const nodes = useRef([]);
  const [d, setD] = useState('');
  const [box, setBox] = useState({ w: 0, h: 0 });
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const measure = () => {
      const el = wrap.current; if (!el) return;
      const r = el.getBoundingClientRect();
      const pts = nodes.current.filter(Boolean).map((n) => {
        const b = n.getBoundingClientRect();
        return [b.left - r.left + b.width / 2, b.top - r.top + b.height / 2];
      });
      let path = '';
      pts.forEach(([x, y], i) => {
        if (!i) { path = `M ${x} ${y}`; return; }
        const [px, py] = pts[i - 1];
        const my = (py + y) / 2;
        path += ` C ${px} ${my}, ${x} ${my}, ${x} ${y}`;
      });
      setD(path); setBox({ w: r.width, h: r.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap.current);
    return () => ro.disconnect();
  }, [path.id]);

  const onKey = (e, i) => {
    const map = { ArrowDown: i + 1, ArrowRight: i + 1, ArrowUp: i - 1, ArrowLeft: i - 1, Home: 0, End: path.steps.length - 1 };
    if (e.key in map) {
      e.preventDefault();
      const n = Math.max(0, Math.min(path.steps.length - 1, map[e.key]));
      onSelect(n); nodes.current[n]?.focus();
    }
  };

  return (
    <div className="nodemap" ref={wrap}>
      <svg className="nodemap-line" width={box.w} height={box.h} aria-hidden="true">
        <defs>
          <linearGradient id="ln" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--accent)" stopOpacity="0.9" />
            <stop offset="1" stopColor="#cdb9ec" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <path d={d} className="ln-base" />
        <path d={d} className={`ln-draw${reduced ? '' : ' animate'}`} stroke="url(#ln)" pathLength="1" key={d.length} />
      </svg>
      <ol className="nodes" role="tablist" aria-label={`${path.title} steps`} aria-orientation="vertical">
        {path.steps.map((st, i) => (
          <li key={st.id} className={`node-row ${i % 2 ? 'right' : 'left'}`} role="presentation">
            <button
              ref={(el) => (nodes.current[i] = el)} type="button" role="tab" id={`node-${st.id}`}
              aria-selected={i === sel} aria-controls="step-panel" tabIndex={i === sel ? 0 : -1}
              className={`node${i === sel ? ' sel' : ''}${done[st.id] ? ' done' : ''}${st.capstone ? ' cap' : ''}`}
              onClick={() => onSelect(i)} onKeyDown={(e) => onKey(e, i)}
              style={{ '--d': `${i * 70}ms` }}
            >
              <span className="node-num" aria-hidden="true">{done[st.id] ? '✓' : st.capstone ? '★' : i + 1}</span>
              <span className="node-text"><b>{st.capstone ? 'Finale' : `Step ${i + 1}`}</b>{st.title}</span>
            </button>
            {i === sel && (
              <ul className="branches" aria-hidden="true">
                {st.chips.slice(0, 4).map((c, k) => <li key={c} style={{ '--k': k }}>{c}</li>)}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

// ─── Step detail ───────────────────────────────────────────────────────────
const KIND_ORDER = ['Free course', 'Interactive', 'Official docs', 'Book', 'Video', 'Roadmap'];

function StepPanel({ path, step, index, isDone }) {
  const [testLang, setTestLang] = useState(step.lang);
  const groups = KIND_ORDER.map((k) => [k, step.resources.filter((r) => r.kind === k)]).filter(([, rs]) => rs.length);
  const startTest = () => { testLanguage(testLang); navigate('/setup'); };
  return (
    <section className="slab panel step-panel" id="step-panel" role="tabpanel" aria-labelledby={`node-${step.id}`} key={step.id}>
      <p className="step">{step.capstone ? 'Finale' : `Step ${index + 1} of ${path.steps.length}`}{step.skill ? ` · ${SKILLS[step.skill].name}` : ''}</p>
      <h2>{step.title}</h2>
      <p className="overview">{step.overview}</p>
      <ul className="chip-list" role="list" aria-label="What you’ll learn">
        {step.chips.map((c) => <li key={c} className="chip static skill-chip">{c}</li>)}
      </ul>
      <div className="res-groups">
        {groups.map(([kind, rs]) => (
          <div key={kind} className="res-group">
            <h3>{kind}</h3>
            <ul role="list">
              {rs.map((r) => (
                <li key={r.url}><a className="res-link fx-glow" href={r.url} target="_blank" rel="noreferrer"><span>{r.title}</span><span aria-hidden="true">↗</span></a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="project-box">
        <h3>🛠 Mini-project</h3>
        <p>{step.project}</p>
      </div>
      <div className="row">
        <button type="button" className={`btn ${isDone ? 'ghost' : 'primary'}`} onClick={() => toggleStepDone(path.id, step.id)} aria-pressed={!!isDone}>
          {isDone ? '✓ Completed — undo' : 'Mark step complete'}
        </button>
        {step.lang && (
          <span className="row test-row">
            {step.langOptions && (
              <label className="select-wrap">
                <span className="sr-only">Language to test</span>
                <select value={testLang} onChange={(e) => setTestLang(e.target.value)}>
                  {step.langOptions.map((l) => <option key={l} value={l}>{LANGUAGE_BY_ID[l]?.label || l}</option>)}
                </select>
              </label>
            )}
            <button type="button" className="btn ghost" onClick={startTest}>Test my {LANGUAGE_BY_ID[testLang]?.label} level →</button>
          </span>
        )}
      </div>
    </section>
  );
}

// ─── SkillBridge gap planner ───────────────────────────────────────────────
function Planner({ path }) {
  const prog = useStore((s) => s.paths[path.id]) || { ratings: {}, hours: 6, done: {} };
  const rows = useMemo(() => buildRows(path, prog.ratings), [path, prog.ratings]);
  const ready = readiness(rows);
  const plan = useMemo(() => buildSchedule(rows, prog.hours), [rows, prog.hours]);
  const maxWeek = Math.max(1, plan.weeks);

  return (
    <section className="slab panel planner" aria-labelledby="planner-h">
      <div className="planner-head">
        <div>
          <p className="step">Skill-gap planner · SkillBridge method</p>
          <h2 id="planner-h">How ready are you for {path.title}?</h2>
          <p className="muted small">Rate yourself 0–5 on each skill. Priority = gap × weight; prerequisites with a gap come first. {path.source === 'skillbridge'
            ? 'Weights are the share of 10 sampled job posts naming the skill (synthetic samples from the SkillBridge prototype).'
            : 'This path has no job-post sample, so skills are weighted equally.'}</p>
        </div>
        <div className="ready-ring" style={{ '--v': ready }} role="img" aria-label={`Readiness ${ready} percent`}>
          <span><b>{ready}%</b>ready</span>
        </div>
      </div>

      <div className="rate-grid">
        {rows.slice().sort((a, b) => a.name.localeCompare(b.name)).map((r) => (
          <label key={r.id} className="rate">
            <span className="rate-name">{r.name}<em>target {r.target}</em></span>
            <input type="range" min="0" max="5" step="1" value={prog.ratings[r.id] ?? 0}
              onChange={(e) => setRating(path.id, r.id, Number(e.target.value))}
              style={{ '--fill': `${((prog.ratings[r.id] ?? 0) / 5) * 100}%`, '--tgt': `${(r.target / 5) * 100}%` }}
              aria-valuetext={`level ${prog.ratings[r.id] ?? 0} of 5, target ${r.target}`} />
            <span className="rate-val" aria-hidden="true">{prog.ratings[r.id] ?? 0}</span>
          </label>
        ))}
      </div>

      <div className="row between hours-row">
        <label className="hours">
          <span>Weekly study time: <b>{prog.hours} h</b></span>
          <input type="range" min="2" max="30" value={prog.hours} onChange={(e) => setHours(path.id, Number(e.target.value))} style={{ '--fill': `${((prog.hours - 2) / 28) * 100}%` }} />
        </label>
        {path.demo && <button type="button" className="btn ghost" onClick={() => loadDemo(path.id, path.demo)}>Load the demo learner</button>}
      </div>

      <h3>Your gap report</h3>
      <ol className="gap-list">
        {rows.map((r) => (
          <li key={r.id} className={`gap ${r.priority.replace(' ', '-').toLowerCase()}`}>
            <span className="gap-rank">{r.rank}</span>
            <div>
              <p className="gap-title"><b>{r.name}</b> <span className={`prio ${r.priority.replace(' ', '-').toLowerCase()}`}>{r.priority}</span> <span className="muted small">score {r.score.toFixed(1)}</span></p>
              <p className="small muted">{r.reason}</p>
            </div>
          </li>
        ))}
      </ol>

      {plan.blocks.length > 0 ? (
        <>
          <h3>Week-by-week plan · {plan.totalHours} h ≈ {plan.weeks} weeks at {prog.hours} h/week</h3>
          <div className="gantt" role="list">
            {plan.blocks.map((b) => (
              <div key={b.id} className="g-row" role="listitem">
                <span className="g-name">{b.name} <em>{b.fromLevel}→{b.toLevel}</em></span>
                <span className="g-track">
                  <span className={`g-bar ${b.priority.toLowerCase()}`} style={{ left: `${((b.startWeek - 1) / maxWeek) * 100}%`, width: `${((b.endWeek - b.startWeek + 1) / maxWeek) * 100}%` }}>
                    W{b.startWeek}{b.endWeek > b.startWeek ? `–${b.endWeek}` : ''} · {b.hours} h
                  </span>
                </span>
              </div>
            ))}
          </div>
        </>
      ) : <p className="quiz-score">🎉 You already meet every target for this role.</p>}
      <p className="muted small">Levels are self-estimates, not certified results. Skilly supports preparation; it does not guarantee interviews or jobs.</p>
    </section>
  );
}

// ─── Viewer ────────────────────────────────────────────────────────────────
export function PathViewer({ id }) {
  const path = PATH_BY_ID[id];
  const done = useStore((s) => s.paths[id]?.done) || {};
  const [sel, setSel] = useState(0);
  useEffect(() => setSel(0), [id]);
  if (!path) {
    return <main className="page wrap narrow" id="main"><div className="slab panel"><h1>Path not found</h1><a className="btn primary" href="#/paths">All career paths</a></div></main>;
  }
  const doneCount = path.steps.filter((s) => done[s.id]).length;
  return (
    <main className="page wrap path-view" id="main" style={{ '--accent': path.accent }}>
      <header className="page-head row between wrap-row">
        <div>
          <p className="step"><a href="#/paths">Career paths</a> · {CATEGORIES.find((c) => c.id === path.category)?.label}{path.branch ? ` · ${path.branch}` : ''} · {path.source === 'skillbridge' ? 'SkillBridge role' : 'Skilly path'}</p>
          <h1><span aria-hidden="true">{path.icon}</span> {path.title}</h1>
          <p className="muted">{path.summary} {path.steps.length} steps · click any node to explore.</p>
        </div>
        <div className="path-progress" aria-label={`${doneCount} of ${path.steps.length} steps complete`}>
          <b>{doneCount}/{path.steps.length}</b><span>steps done</span>
          <span className="pc-bar"><span style={{ width: `${(doneCount / path.steps.length) * 100}%` }} /></span>
        </div>
      </header>

      <div className="path-layout">
        <aside className="step-list slab" aria-label="Steps">
          <ol>
            {path.steps.map((st, i) => (
              <li key={st.id}>
                <button type="button" className={`sl-item${i === sel ? ' sel' : ''}${done[st.id] ? ' done' : ''}`} onClick={() => setSel(i)} aria-current={i === sel ? 'step' : undefined}>
                  <span className="sl-num">{done[st.id] ? '✓' : i + 1}</span>{st.title}
                </button>
              </li>
            ))}
          </ol>
        </aside>
        <div className="map-col">
          <NodeMap path={path} sel={sel} onSelect={setSel} done={done} />
        </div>
        <div className="detail-col">
          <StepPanel key={path.steps[sel].id} path={path} step={path.steps[sel]} index={sel} isDone={!!done[path.steps[sel].id]} />
          <div className="row between">
            <button type="button" className="btn ghost" disabled={sel === 0} onClick={() => setSel(sel - 1)}>← Previous step</button>
            <button type="button" className="btn ghost" disabled={sel === path.steps.length - 1} onClick={() => setSel(sel + 1)}>Next step →</button>
          </div>
        </div>
      </div>

      <Planner path={path} />

      <section aria-labelledby="more-paths" className="more-paths">
        <h2 id="more-paths">More {CATEGORIES.find((c) => c.id === path.category)?.label.toLowerCase()} paths</h2>
        <PathCards compact list={PATHS.filter((p) => p.category === path.category)} exclude={path.id} />
        <p><a className="link" href="#/paths">See all {PATHS.length} career paths →</a></p>
      </section>
    </main>
  );
}
