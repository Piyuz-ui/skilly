import { Hero } from './Hero.jsx';
import { useStore } from '../lib/store.js';
import { chooseAudience, discardAttempt } from '../lib/actions.js';
import { navigate } from '../lib/hooks.js';
import { useConfirm } from './Confirm.jsx';
import { QUESTION_COUNT } from '../lib/engine.js';
import { PathCards } from './PathCards.jsx';
import { PATHS } from '../data/paths.js';
import { LANGUAGES } from '../data/questions/index.js';
import { ThisWeek } from './ThisWeek.jsx';
import { PROBLEMS } from '../data/codeProblems.js';

const CARDS = [
  {
    id: 'professional', title: 'Professional', icon: '⌘',
    lead: 'I work with code and want an honest read on my level.',
    steps: ['Languages survey', 'Easy, Medium or Hard test', 'Detailed report & weak-topic roadmap'],
  },
  {
    id: 'student', title: 'Student', icon: '◎',
    lead: 'I’m learning in a course or on my own and want structure.',
    steps: ['Languages survey', 'Easy or Medium test', 'Weekly roadmap, tasks & quizzes'],
  },
  {
    id: 'beginner', title: 'Beginner', icon: '◇',
    lead: 'I’m brand new to programming and want to start today.',
    steps: ['Pick a language — no test', 'Starter courses right away', 'Week-by-week starter path'],
  },
];

export function Home() {
  const audience = useStore((s) => s.audience);
  const attempt = useStore((s) => s.attempt);
  const confirm = useConfirm();

  async function pick(id) {
    if (attempt && attempt.audience !== id) {
      const ok = await confirm({
        title: 'Switch path and discard your test?',
        body: `You have a ${attempt.questionIds.length}-question test in progress as a ${attempt.audience}. Switching to ${id} discards it and its answers. Completed reports and roadmaps stay saved.`,
        ok: 'Discard test & switch', cancel: 'Keep my test', danger: true,
      });
      if (!ok) return;
      discardAttempt();
    }
    chooseAudience(id);
    if (id === 'beginner') navigate('/beginner');
    else if (store_hasActive(id, attempt)) navigate('/test');
    else navigate('/survey');
  }

  return (
    <>
      <Hero />
      <section className="audience" aria-labelledby="who">
        <div className="wrap">
          <ThisWeek />
          <h2 id="who" className="question">Which best describes you?</h2>
          {attempt && (
            <p className="resume glass-chip">
              Test in progress · {attempt.questionIds.length} questions ·{' '}
              <button type="button" className="link" onClick={() => navigate('/test')}>Resume</button>
            </p>
          )}
          <ul className="cards" role="list">
            {CARDS.map((c, i) => (
              <li key={c.id} style={{ '--i': i }}>
                <button type="button" className={`slab card fx-tilt${audience === c.id ? ' is-current' : ''}`} onClick={() => pick(c.id)} aria-describedby={`${c.id}-lead`}>
                  <span className="card-top"><span className="card-icon" aria-hidden="true">{c.icon}</span><span className="card-arrow" aria-hidden="true">↗</span></span>
                  <span className="card-title">{c.title}</span>
                  <span id={`${c.id}-lead`} className="card-lead">{c.lead}</span>
                  <span className="card-steps">{c.steps.join(' · ')}</span>
                  {audience === c.id && <span className="card-badge">Your current path</span>}
                </button>
              </li>
            ))}
          </ul>
          <p className="fine">{LANGUAGES.length} languages · Tests are {Object.entries(QUESTION_COUNT).map(([m, n]) => `${m} min · ${n} questions`).join(' / ')}. Progress is saved in this browser, and to your account if you sign in.</p>
        </div>
      </section>
      <section className="home-code" aria-labelledby="code-h">
        <div className="wrap">
          <a className="slab code-promo fx-tilt" href="#/code">
            <span className="cp-icon" aria-hidden="true">{'</>'}</span>
            <span className="cp-text">
              <span className="eyebrow-sm">Coding practice</span>
              <span id="code-h" className="cp-title">Write real code and get it checked</span>
              <span className="muted">{PROBLEMS.length} placement-style problems in Python or JavaScript. Runs in your browser against hidden tests.</span>
            </span>
            <span className="card-arrow" aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
      <section className="home-paths" aria-labelledby="paths-h">
        <div className="wrap">
          <p className="eyebrow-sm reveal">Career paths</p>
          <h2 id="paths-h" className="question reveal">Or explore a whole course.</h2>
          <p className="muted reveal">{PATHS.length} step-by-step roadmaps across software, data and core engineering, with free courses, projects and a skill-gap planner.</p>
          <PathCards list={['data-analyst', 'web-developer', 'ai-engineer', 'devops', 'embedded-iot', 'vlsi', 'mechanical', 'civil'].map((id) => PATHS.find((p) => p.id === id))} />
          <p className="center-row"><a className="btn ghost" href="#/paths">See all {PATHS.length} career paths →</a></p>
        </div>
      </section>
    </>
  );
}

function store_hasActive(id, attempt) {
  return attempt && attempt.audience === id && attempt.status === 'active';
}
