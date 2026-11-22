import { Component, Suspense, lazy, useEffect } from 'react';
import { useRoute, navigate } from './lib/hooks.js';
import { trackPage } from './lib/analytics.js';
import { Feedback, openFeedback } from './components/Feedback.jsx';
import { useStore } from './lib/store.js';
import { resetToSelector, discardAttempt, chooseAudience } from './lib/actions.js';
import { PATHS } from './data/paths.js';
import { LANGUAGES, QUESTION_TOTAL, loadQuestions } from './data/questions/index.js';
import { ConfirmProvider, useConfirm } from './components/Confirm.jsx';
import { Home } from './components/Home.jsx';
import { JellyLogo } from './components/JellyLogo.jsx';
import { Avatar } from './components/Avatar.jsx';
import { InstallLink, OfflineNotice } from './components/Install.jsx';
import { useAccount, resumeIfSignedIn } from './lib/account.js';
import { accountsEnabled } from './lib/firebase.js';

// Reconnect to the account on load, but only if someone signed in here before.
resumeIfSignedIn();

// Every page except Home loads on demand, so the first visit downloads only
// what the home page needs. Pages that show questions also wait for the
// question bank. Each loader is shared by lazy() and prefetch().
const withQuestions = (load) => () => Promise.all([loadQuestions(), load()]).then(([, m]) => m);
const pages = {
  survey: withQuestions(() => import('./components/Survey.jsx')),
  test: withQuestions(() => import('./components/Test.jsx')),
  report: withQuestions(() => import('./components/Report.jsx')),
  plan: withQuestions(() => import('./components/Plan.jsx')),
  paths: () => import('./components/Paths.jsx'),
  beginner: withQuestions(() => import('./components/BeginnerPick.jsx')),
  account: () => import('./components/Account.jsx'),
  code: () => import('./components/Code.jsx'),
  review: withQuestions(() => import('./components/Review.jsx')),
  revise: withQuestions(() => import('./components/Revise.jsx')),
};
// After a new version is published, an open tab may ask for page files that
// no longer exist: reload once to pick up the new version. If that already
// happened (or the device is offline), PageError below shows a message.
function reloadOnce() {
  try {
    if (navigator.onLine === false) return false;
    const last = Number(sessionStorage.getItem('skilly:reloaded') || 0);
    if (Date.now() - last < 10_000) return false;
    sessionStorage.setItem('skilly:reloaded', String(Date.now()));
  } catch { return false; }
  location.reload();
  return true;
}
const lazyPage = (load, name) => lazy(() => load()
  .then((m) => ({ default: m[name] }))
  .catch((e) => { if (reloadOnce()) return new Promise(() => {}); throw e; }));
const Survey = lazyPage(pages.survey, 'Survey');
const Setup = lazyPage(pages.survey, 'Setup');
const Test = lazyPage(pages.test, 'Test');
const Report = lazyPage(pages.report, 'Report');
const Plan = lazyPage(pages.plan, 'Plan');
const PathsIndex = lazyPage(pages.paths, 'PathsIndex');
const PathViewer = lazyPage(pages.paths, 'PathViewer');
const BeginnerPick = lazyPage(pages.beginner, 'BeginnerPick');
const Account = lazyPage(pages.account, 'Account');
const CodeIndex = lazyPage(pages.code, 'CodeIndex');
const CodeProblem = lazyPage(pages.code, 'CodeProblem');
const Review = lazyPage(pages.review, 'Review');
const Revise = lazyPage(pages.revise, 'Revise');

// Once the home page is up and the browser is idle, fetch the common pages
// in the background so later clicks open instantly. Skipped on Data Saver.
function prefetchPages() {
  if (navigator.connection?.saveData) return;
  // Wait a moment so the home page's own downloads (like the 3D scene) go first.
  setTimeout(() => {
    const idle = window.requestIdleCallback || ((f) => setTimeout(f, 300));
    idle(() => ['survey', 'paths', 'plan', 'beginner', 'code', 'report', 'test', 'revise'].forEach((k) => pages[k]().catch(() => {})), { timeout: 4000 });
  }, 2500);
}

// If a page's code can't be downloaded (offline, or a new version replaced
// it), show a way out instead of a blank screen.
class PageError extends Component {
  constructor(props) { super(props); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidUpdate(prev) { if (prev.page !== this.props.page && this.state.failed) this.setState({ failed: false }); }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main id="main" tabIndex={-1} className="page wrap narrow">
        <section className="slab panel">
          <h1>This page didn’t load</h1>
          <p>{navigator.onLine === false ? 'You’re offline, and this page isn’t saved on this device yet. Connect to the internet and try again.' : 'Something went wrong while loading it. Trying again usually fixes it.'}</p>
          <div className="row"><button type="button" className="btn primary" onClick={() => location.reload()}>Try again</button><a className="btn ghost" href="#/">Home</a></div>
        </section>
      </main>
    );
  }
}

function PageLoading() {
  return <main id="main" tabIndex={-1} className="page wrap page-loading" aria-busy="true"><span className="sr-only">Loading…</span></main>;
}

function Header({ route }) {
  const attempt = useStore((s) => s.attempt);
  const hasPlan = useStore((s) => Object.keys(s.plans).length > 0);
  const lastReport = useStore((s) => s.reports.at(-1));
  const confirm = useConfirm();
  const onTest = route === 'test';
  const acct = useAccount();
  const signedIn = acct.status === 'signedIn';

  const changePath = async () => {
    if (attempt) {
      const ok = await confirm({
        title: 'Leave your test and change path?',
        body: `Your ${attempt.questionIds.length}-question test in progress and its answers will be discarded. Completed reports and roadmaps stay saved.`,
        ok: 'Discard test', cancel: 'Keep my test', danger: true,
      });
      if (!ok) return;
    }
    resetToSelector();
    navigate('/');
    requestAnimationFrame(() => document.getElementById('who')?.scrollIntoView({ block: 'start' }));
  };

  return (
    <header className={`site-header${onTest ? ' quiet' : ''}`}>
      <a href="#/" className="brand" aria-label="Skilly home"><JellyLogo small /></a>
      <nav aria-label="Main">
        <ul role="list">
          {!onTest && <li><a className="nav-link" href="#/paths"><span className="nav-long">Career </span>paths</a></li>}
          {!onTest && <li className="nav-hide-sm"><a className={`nav-link${route === 'code' ? ' on' : ''}`} href="#/code">Code</a></li>}
          <li><button type="button" className="nav-link" onClick={changePath}><span className="nav-long">Change path</span><span className="nav-short" aria-hidden="true">Switch</span></button></li>
           {lastReport && !onTest && <li className="nav-hide-sm"><a className="nav-link" href={`#/report/${lastReport.id}`}>Last report</a></li>}
          {hasPlan && !onTest && <li><a className="nav-link" href="#/plan"><span className="nav-long">My </span>roadmap</a></li>}
          {accountsEnabled && !onTest && (
            <li>
              <a className={`nav-link account-link${route === 'account' ? ' on' : ''}`} href="#/account" aria-label={signedIn ? `Your account (${acct.user.name || 'profile'})` : 'Sign in'}>
                <Avatar user={signedIn ? acct.user : null} size={30} />
                {!signedIn && <span className="nav-long">Sign in</span>}
              </a>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

function Routes() {
  const { parts, query } = useRoute();
  const page = parts[0] || '';
  useEffect(() => { if (page !== '') window.scrollTo(0, 0); }, [page, parts[1]]);
  useEffect(() => { trackPage(parts); }, [page, parts[1]]);
  useEffect(() => { if (document.readyState === 'complete') prefetchPages(); else window.addEventListener('load', prefetchPages, { once: true }); }, []);
  let el;
  switch (page) {
    case '': el = <Home />; break;
    case 'survey': el = <Survey needNotice={query.get('need') === '1'} key={query.toString()} />; break;
    case 'setup': el = <Setup />; break;
    case 'test': el = <Test />; break;
    case 'report': el = <Report id={parts[1]} />; break;
    case 'plan': el = <Plan />; break;
    case 'beginner': el = <BeginnerPick />; break;
    case 'account': el = <Account />; break;
    case 'code': el = parts[1] ? <CodeProblem key={parts[1]} id={parts[1]} /> : <CodeIndex />; break;
    case 'review': el = <Review />; break;
    case 'revise': el = <Revise />; break;
    case 'paths': el = parts[1] ? <PathViewer key={parts[1]} id={parts[1]} /> : <PathsIndex />; break;
    default: el = <Home />;
  }
  return (
    <div className={`app route-${page || 'home'}`}>
      <a className="skip" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }}>Skip to content</a>
      <Aurora quiet={page === 'test'} />
      {page !== 'test' && <div className="spotlight" aria-hidden="true" />}
      <Header route={page} />
      <PageError page={page}><Suspense fallback={<PageLoading />}>{el}</Suspense></PageError>
      <OfflineNotice />
      <Footer quiet={page === 'test'} />
      <Feedback hidden={page === 'test'} />
    </div>
  );
}

function Footer({ quiet }) {
  const confirm = useConfirm();
  const attempt = useStore((s) => s.attempt);
  const go = async (to, audience) => {
    if (attempt && audience) {
      const ok = await confirm({ title: 'Leave your test?', body: 'Your test in progress will be discarded. Completed reports and roadmaps stay saved.', ok: 'Discard test', cancel: 'Keep my test', danger: true });
      if (!ok) return;
      discardAttempt();
    }
    if (audience) chooseAudience(audience);
    navigate(to);
  };
  const featured = ['data-analyst', 'web-developer', 'ai-engineer', 'devops', 'cybersecurity', 'embedded-iot', 'vlsi', 'mechanical'];
  return (
    <footer className={`site-footer${quiet ? ' quiet' : ''}`}>
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <JellyLogo small />
            <p>Find out where you stand, then practise what’s next: honest skill tests, weekly roadmaps and whole career paths for every engineering branch.</p>
            <div className="footer-stats">
              <span>{LANGUAGES.length} languages</span><span>{QUESTION_TOTAL.toLocaleString('en-IN')} questions</span><span>{PATHS.length} career paths</span>
            </div>
          </div>
          <nav className="footer-col" aria-label="Start">
            <h2>Start</h2>
            <ul role="list">
              <li><button type="button" onClick={() => go('/survey', 'professional')}>Professional assessment</button></li>
              <li><button type="button" onClick={() => go('/survey', 'student')}>Student assessment</button></li>
              <li><button type="button" onClick={() => go('/beginner', 'beginner')}>Beginner: pick a language</button></li>
              <li><a href="#/plan">My roadmap</a></li>
              <li><a href="#/code">Coding practice</a></li>
              <li><a href="#/revise">Fix my mistakes</a></li>
            </ul>
          </nav>
          <nav className="footer-col" aria-label="Career paths">
            <h2>Career paths</h2>
            <ul role="list">
              {featured.map((id) => { const p = PATHS.find((x) => x.id === id); return <li key={id}><a href={`#/paths/${id}`}>{p.title}</a></li>; })}
              <li><a href="#/paths">All {PATHS.length} paths →</a></li>
            </ul>
          </nav>
          <div className="footer-col">
            <h2>Free learning</h2>
            <ul role="list">
              <li><a href="https://roadmap.sh" target="_blank" rel="noreferrer">roadmap.sh</a></li>
              <li><a href="https://nptel.ac.in/" target="_blank" rel="noreferrer">NPTEL</a></li>
              <li><a href="https://swayam.gov.in/" target="_blank" rel="noreferrer">SWAYAM</a></li>
              <li><a href="https://ocw.mit.edu/" target="_blank" rel="noreferrer">MIT OpenCourseWare</a></li>
              <li><a href="https://www.freecodecamp.org/learn/" target="_blank" rel="noreferrer">freeCodeCamp</a></li>
            </ul>
            <h2 className="footer-sub">Help us improve</h2>
            <ul role="list">
              <li><button type="button" onClick={openFeedback}>Send feedback</button></li>
              <li><a href="#/review">Teacher review</a></li>
              <InstallLink />
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Skilly · Built on the SkillBridge idea (AARAMBHATHON Round 1). Your answers and progress stay in this browser unless you sign in, which saves them to your account. We receive anonymous visit counts, the feedback you choose to send and, when you sign in, your name and email.</p>
          <button type="button" className="btn ghost sm" onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}>Back to top ↑</button>
        </div>
      </div>
    </footer>
  );
}

function Aurora({ quiet }) {
  return (
    <div className={`aurora${quiet ? ' quiet' : ''}`} aria-hidden="true">
      <div className="ribbon r1" />
      <div className="ribbon r2" />
      <div className="ribbon r3" />
    </div>
  );
}

export default function App() {
  return <ConfirmProvider><Routes /></ConfirmProvider>;
}
