import { useEffect, useRef, useState } from 'react';
import { useConfirm } from './Confirm.jsx';
import { PROBLEMS, PROBLEM_BY_ID, CODE_LANGS, starterCode, pyRepr } from '../data/codeProblems.js';
import { runCode, TIME_LIMIT_MS } from '../lib/codeRunner.js';
import { markSolved, recordActivity } from '../lib/actions.js';
import { useStore } from '../lib/store.js';
import { navigate } from '../lib/hooks.js';

const LANG_KEY = 'skilly:codeLang';
const draftKey = (id, lang) => `skilly:code:${id}:${lang}`;
const ls = {
  get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* storage full or blocked */ } },
  del: (k) => { try { localStorage.removeItem(k); } catch { /* ignore */ } },
};
const LANG_LABEL = Object.fromEntries(CODE_LANGS.map((l) => [l.id, l.label]));
const fmt = (v, lang) => (lang === 'py' ? pyRepr(v) : JSON.stringify(v));

function useLang() {
  const [lang, setLangState] = useState(() => (ls.get(LANG_KEY) === 'js' ? 'js' : 'py'));
  const setLang = (l) => { setLangState(l); ls.set(LANG_KEY, l); };
  return [lang, setLang];
}

function LangToggle({ lang, setLang }) {
  return (
    <div className="lang-toggle" role="radiogroup" aria-label="Programming language">
      {CODE_LANGS.map((l) => (
        <button key={l.id} type="button" role="radio" aria-checked={lang === l.id} className={lang === l.id ? 'on' : ''} onClick={() => setLang(l.id)}>{l.label}</button>
      ))}
    </div>
  );
}

// ─── Problem list ──────────────────────────────────────────────────────────
export function CodeIndex() {
  const [lang, setLang] = useLang();
  const solved = useStore((s) => s.code) || {};
  const [level, setLevel] = useState('all');
  const list = PROBLEMS.filter((p) => level === 'all' || p.level === level);
  const doneCount = PROBLEMS.filter((p) => solved[p.id]?.[lang]).length;
  return (
    <main id="main" tabIndex={-1} className="page wrap code-page">
      <header className="page-head row between wrap-row">
        <div>
          <p className="eyebrow">Coding practice</p>
          <h1>Write code. Run it. Get checked.</h1>
          <p className="muted">{PROBLEMS.length} placement-style problems. Your code runs safely in your browser against example and hidden tests. Python downloads once (about 10 MB) the first time you run it.</p>
        </div>
        <div className="path-progress" aria-label={`${doneCount} of ${PROBLEMS.length} solved in ${LANG_LABEL[lang]}`}>
          <b>{doneCount}/{PROBLEMS.length}</b><span>solved in {LANG_LABEL[lang]}</span>
          <span className="pc-bar"><span style={{ width: `${(doneCount / PROBLEMS.length) * 100}%` }} /></span>
        </div>
      </header>
      <div className="row code-filters">
        <LangToggle lang={lang} setLang={setLang} />
        <div className="lang-toggle" role="radiogroup" aria-label="Difficulty">
          {['all', 'easy', 'medium'].map((l) => (
            <button key={l} type="button" role="radio" aria-checked={level === l} className={level === l ? 'on' : ''} onClick={() => setLevel(l)}>{l === 'all' ? 'All' : l[0].toUpperCase() + l.slice(1)}</button>
          ))}
        </div>
      </div>
      <ol className="problem-list" role="list">
        {list.map((p) => {
          const num = PROBLEMS.indexOf(p) + 1;
          const s = solved[p.id] || {};
          return (
            <li key={p.id}>
              <a className={`problem-row slab${s[lang] ? ' solved' : ''}`} href={`#/code/${p.id}`}>
                <span className="pr-num">{s[lang] ? '✓' : num}</span>
                <span className="pr-main"><b>{p.title}</b><span className="muted small">{p.topic}</span></span>
                <span className={`pr-level ${p.level}`}>{p.level}</span>
                <span className="pr-langs" aria-label="Solved in">
                  {CODE_LANGS.map((l) => <span key={l.id} className={s[l.id] ? 'on' : ''} title={`${l.label}: ${s[l.id] ? 'solved' : 'not solved'}`}>{l.id === 'py' ? 'Py' : 'JS'}</span>)}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </main>
  );
}

// ─── One problem ───────────────────────────────────────────────────────────
export function CodeProblem({ id }) {
  const problem = PROBLEM_BY_ID[id];
  const [lang, setLang] = useLang();
  if (!problem) {
    return <main id="main" className="page wrap narrow"><div className="slab panel"><h1>Problem not found</h1><a className="btn primary" href="#/code">All problems</a></div></main>;
  }
  return <ProblemView key={`${id}:${lang}`} problem={problem} lang={lang} setLang={setLang} />;
}

function ProblemView({ problem, lang, setLang }) {
  const fn = problem.fn[lang];
  const solvedAt = useStore((s) => s.code?.[problem.id]?.[lang]);
  const [code, setCode] = useState(() => ls.get(draftKey(problem.id, lang)) ?? starterCode(problem, lang));
  const [stage, setStage] = useState('idle'); // idle | loading-python | running
  const [result, setResult] = useState(null);
  const [fails, setFails] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const confirm = useConfirm();
  const resultRef = useRef(null);
  const index = PROBLEMS.indexOf(problem);
  const next = PROBLEMS[index + 1];
  const busy = stage !== 'idle';

  // Save the draft as the learner types (per problem and language).
  useEffect(() => {
    const t = setTimeout(() => ls.set(draftKey(problem.id, lang), code), 300);
    return () => clearTimeout(t);
  }, [code, problem.id, lang]);

  const run = async () => {
    if (busy) return;
    setResult(null);
    setStage('running');
    const r = await runCode({ lang, code, fn, tests: problem.tests }, setStage);
    setStage('idle');
    setResult(r);
    const allPass = r.status === 'ok' && r.results.every((x) => x.pass);
    if (allPass) markSolved(problem.id, lang);
    else { setFails((n) => n + 1); recordActivity(); }
    requestAnimationFrame(() => resultRef.current?.focus());
  };

  const reset = async () => {
    if (code !== starterCode(problem, lang)) {
      const ok = await confirm({ title: 'Reset your code?', body: 'Your current code for this problem will be replaced with the starter template.', ok: 'Reset code', cancel: 'Keep my code', danger: true });
      if (!ok) return;
    }
    setCode(starterCode(problem, lang));
    ls.del(draftKey(problem.id, lang));
    setResult(null);
  };

  // Editor keys: Tab indents, Enter keeps indentation, Ctrl/⌘+Enter runs.
  const onKeyDown = (e) => {
    const ta = e.currentTarget;
    const unit = lang === 'py' ? '    ' : '  ';
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); run(); return; }
    if (e.key === 'Tab' && !e.altKey) {
      if (e.shiftKey) return; // leave Shift+Tab for keyboard navigation
      e.preventDefault();
      const { selectionStart: a, selectionEnd: b, value } = ta;
      const next = value.slice(0, a) + unit + value.slice(b);
      setCode(next);
      requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = a + unit.length; });
      return;
    }
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
      const { selectionStart: a, selectionEnd: b, value } = ta;
      const lineStart = value.lastIndexOf('\n', a - 1) + 1;
      const line = value.slice(lineStart, a);
      let indent = line.match(/^[ \t]*/)[0];
      const trimmed = line.trimEnd();
      if ((lang === 'py' && trimmed.endsWith(':')) || (lang === 'js' && /[{[(]$/.test(trimmed))) indent += unit;
      e.preventDefault();
      const next = value.slice(0, a) + '\n' + indent + value.slice(b);
      setCode(next);
      requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = a + 1 + indent.length; });
    }
  };

  const allPass = result?.status === 'ok' && result.results.every((x) => x.pass);
  const passCount = result?.status === 'ok' ? result.results.filter((x) => x.pass).length : 0;
  const canSeeSolution = Boolean(solvedAt) || fails >= 3;

  return (
    <main id="main" tabIndex={-1} className="page wrap code-page">
      <p className="step"><a href="#/code">Coding practice</a> · Problem {index + 1} of {PROBLEMS.length} · {problem.topic}</p>
      <div className="code-layout">
        <section className="slab panel problem-card" aria-labelledby="prob-title">
          <div className="row between wrap-row">
            <h1 id="prob-title">{problem.title}</h1>
            <span className={`pr-level ${problem.level}`}>{problem.level}</span>
          </div>
          {solvedAt && <p className="solved-note">✓ Solved in {LANG_LABEL[lang]}</p>}
          <p className="prompt">{problem.prompt}</p>
          <h2 className="h-small">Examples</h2>
          <ul className="examples" role="list">
            {problem.tests.slice(0, problem.shown).map((t, i) => (
              <li key={i}><code>{fn}({t.args.map((a) => fmt(a, lang)).join(', ')})</code> <span aria-hidden="true">→</span><span className="sr-only">returns</span> <code>{fmt(t.expect, lang)}</code></li>
            ))}
          </ul>
          <p className="muted small">Plus {problem.tests.length - problem.shown} hidden tests. Write a function named <code>{fn}</code> that returns the answer (don’t print it). Time limit: {TIME_LIMIT_MS / 1000} s.</p>
        </section>

        <section className="slab panel editor-card" aria-label="Code editor">
          <div className="row between wrap-row editor-bar">
            <LangToggle lang={lang} setLang={setLang} />
            <span className="muted small kbd-hint">Ctrl/⌘ + Enter to run</span>
          </div>
          <label htmlFor="code-editor" className="sr-only">{LANG_LABEL[lang]} code for {problem.title}</label>
          <textarea
            id="code-editor" className="code-editor" value={code}
            onChange={(e) => setCode(e.target.value)} onKeyDown={onKeyDown}
            spellCheck={false} autoCapitalize="off" autoCorrect="off" autoComplete="off"
            rows={Math.min(22, Math.max(10, code.split('\n').length + 2))}
          />
          <div className="row editor-actions">
            <button type="button" className="btn primary" onClick={run} disabled={busy}>
              {stage === 'loading-python' ? 'Loading Python…' : stage === 'running' ? 'Running…' : '▶ Run tests'}
            </button>
            <button type="button" className="btn ghost" onClick={reset} disabled={busy}>Reset</button>
            {canSeeSolution && <button type="button" className="btn ghost" onClick={() => setShowSolution((v) => !v)} aria-expanded={showSolution}>{showSolution ? 'Hide solution' : 'Show a solution'}</button>}
          </div>
          {stage === 'loading-python' && <p className="muted small" role="status">Downloading Python for your browser. This happens once and takes a few seconds.</p>}

          <div ref={resultRef} tabIndex={-1} className="results" aria-live="polite">
            {result?.status === 'timeout' && <p className="res-banner bad">⏱ Time limit exceeded ({TIME_LIMIT_MS / 1000} s). Check for an infinite loop or a very slow approach.</p>}
            {result?.status === 'error' && <><p className="res-banner bad">✗ {result.message}</p>{!!result.logs?.length && <Logs logs={result.logs} />}</>}
            {result?.status === 'ok' && (
              <>
                <p className={`res-banner ${allPass ? 'good' : 'bad'}`}>
                  {allPass ? `🎉 All ${result.results.length} tests passed!` : `${passCount} of ${result.results.length} tests passed.`}
                </p>
                <ol className="test-results" role="list">
                  {result.results.map((r, i) => {
                    const t = problem.tests[i];
                    const shown = i < problem.shown;
                    return (
                      <li key={i} className={r.pass ? 'pass' : 'fail'}>
                        <span className="tr-mark" aria-hidden="true">{r.pass ? '✓' : '✗'}</span>
                        <div className="tr-body">
                          <b>{shown ? `Example ${i + 1}` : `Hidden test ${i + 1 - problem.shown}`}: {r.pass ? 'passed' : 'failed'}</b>
                          {shown && <span className="small"><code>{fn}({t.args.map((a) => fmt(a, lang)).join(', ')})</code></span>}
                          {!r.pass && shown && <span className="small">Expected <code>{fmt(t.expect, lang)}</code>{r.got !== undefined && <>, got <code>{r.got}</code></>}</span>}
                          {!r.pass && !shown && !r.error && <span className="small muted">Hidden input. Think about edge cases: empty input, one item, duplicates, negatives.</span>}
                          {r.error && <span className="small err">{r.error}</span>}
                        </div>
                      </li>
                    );
                  })}
                </ol>
                {!!result.logs?.length && <Logs logs={result.logs} />}
                {allPass && next && <a className="btn primary" href={`#/code/${next.id}`}>Next problem: {next.title} →</a>}
                {allPass && !next && <a className="btn primary" href="#/code">🏆 Back to all problems</a>}
              </>
            )}
          </div>

          {showSolution && canSeeSolution && (
            <div className="solution">
              <h2 className="h-small">One possible solution</h2>
              <pre><code>{problem.solution[lang]}</code></pre>
              <p className="muted small">Type it out yourself rather than copying: you’ll remember it much better.</p>
            </div>
          )}
        </section>
      </div>
      <div className="row between code-nav">
        {index > 0 ? <a className="btn ghost" href={`#/code/${PROBLEMS[index - 1].id}`}>← Previous</a> : <span />}
        {next ? <a className="btn ghost" href={`#/code/${next.id}`}>Next →</a> : <button type="button" className="btn ghost" onClick={() => navigate('/code')}>All problems</button>}
      </div>
    </main>
  );
}

function Logs({ logs }) {
  return (
    <details className="logs" open>
      <summary>Printed output ({logs.length} line{logs.length === 1 ? '' : 's'})</summary>
      <pre>{logs.join('\n')}</pre>
    </details>
  );
}
