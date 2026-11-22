import { PATHS, SKILLS } from '../data/paths.js';
import { useStore } from '../lib/store.js';

// Grid of career-path cards, used on the home page and the paths pages.
const pathHours = (p) => Object.entries(p.targets).reduce((s, [id, [t]]) => s + t * SKILLS[id].hours, 0);

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
