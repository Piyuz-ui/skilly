import { useEffect } from 'react';
import { useRoute, navigate } from './lib/hooks.js';
import { trackPage } from './lib/analytics.js';
import { Feedback, openFeedback } from './components/Feedback.jsx';
import { useStore } from './lib/store.js';
import { resetToSelector, discardAttempt, chooseAudience } from './lib/actions.js';
import { PATHS } from './data/paths.js';
import { LANGUAGES, QUESTIONS } from './data/questions/index.js';
import { ConfirmProvider, useConfirm } from './components/Confirm.jsx';
import { Home } from './components/Home.jsx';
import { Survey, Setup } from './components/Survey.jsx';
import { Test } from './components/Test.jsx';
import { Report } from './components/Report.jsx';
import { Plan } from './components/Plan.jsx';
import { JellyLogo } from './components/JellyLogo.jsx';
import { PathsIndex, PathViewer } from './components/Paths.jsx';
import { BeginnerPick } from './components/BeginnerPick.jsx';
import { Account, Avatar } from './components/Account.jsx';
import { useAccount, resumeIfSignedIn } from './lib/account.js';
import { accountsEnabled } from './lib/firebase.js';

// Reconnect to the account on load, but only if someone signed in here before.
resumeIfSignedIn();

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
    case 'paths': el = parts[1] ? <PathViewer key={parts[1]} id={parts[1]} /> : <PathsIndex />; break;
    default: el = <Home />;
  }
  return (
    <div className={`app route-${page || 'home'}`}>
      <a className="skip" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }}>Skip to content</a>
      <Aurora quiet={page === 'test'} />
      {page !== 'test' && <div className="spotlight" aria-hidden="true" />}
      <Header route={page} />
      {el}
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
              <span>{LANGUAGES.length} languages</span><span>{QUESTIONS.length} questions</span><span>{PATHS.length} career paths</span>
            </div>
          </div>
          <nav className="footer-col" aria-label="Start">
            <h2>Start</h2>
            <ul role="list">
              <li><button type="button" onClick={() => go('/survey', 'professional')}>Professional assessment</button></li>
              <li><button type="button" onClick={() => go('/survey', 'student')}>Student assessment</button></li>
              <li><button type="button" onClick={() => go('/beginner', 'beginner')}>Beginner: pick a language</button></li>
              <li><a href="#/plan">My roadmap</a></li>
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
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Skilly · Built on the SkillBridge idea (AARAMBHATHON Round 1). Your answers and progress stay in this browser. We only receive anonymous visit counts and the feedback you choose to send.</p>
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
