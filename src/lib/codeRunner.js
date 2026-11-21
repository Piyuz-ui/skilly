// Runs a learner's code against test cases inside a Web Worker, so infinite
// loops or crashes can never freeze the page. JavaScript runs directly in the
// worker; Python runs with Pyodide (CPython compiled to WebAssembly), which is
// downloaded once from jsDelivr the first time someone runs Python.
//
// runCode({ lang, code, fn, tests }) resolves to
//   { status: 'ok', results: [{ pass, got, error }], logs }
//   { status: 'error', message, logs }     (syntax error, missing function…)
//   { status: 'timeout' }                  (took longer than TIME_LIMIT_MS)
import { deepEqual } from './codeCompare.js';

export const TIME_LIMIT_MS = 5000;
export const PY_LOAD_LIMIT_MS = 60000;
const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.27.2/full/';
const MAX_LOG_LINES = 50;

const JS_WORKER = `
const show = (v) => { try { return v === undefined ? 'undefined' : JSON.stringify(v); } catch { return String(v); } };
self.onmessage = (e) => {
  const { code, fn, tests } = e.data;
  const logs = [];
  const log = (...a) => { if (logs.length < ${MAX_LOG_LINES}) logs.push(a.map((x) => typeof x === 'string' ? x : show(x)).join(' ')); };
  self.console = { log, info: log, warn: log, error: log, debug: log };
  let f;
  try {
    f = new Function(code + '\\n;return typeof ' + fn + " === 'function' ? " + fn + ' : undefined;')();
  } catch (err) {
    self.postMessage({ status: 'error', message: (err && err.name ? err.name + ': ' : '') + (err && err.message || String(err)), logs });
    return;
  }
  if (typeof f !== 'function') {
    self.postMessage({ status: 'error', message: 'Define a function named ' + fn + '.', logs });
    return;
  }
  const results = tests.map((t) => {
    try {
      const got = f(...JSON.parse(JSON.stringify(t.args)));
      // NaN/Infinity would silently become null in JSON; mark them so they never pass.
      const json = got === undefined ? null : JSON.stringify(got, (k, v) => (typeof v === 'number' && !Number.isFinite(v) ? '\\u0000' + v : v));
      return { json, undef: got === undefined, got: show(got) };
    } catch (err) {
      return { error: (err && err.name ? err.name + ': ' : '') + (err && err.message || String(err)) };
    }
  });
  self.postMessage({ status: 'ok', results, logs });
};
`;

const PY_WORKER = `
importScripts('${PYODIDE_URL}pyodide.js');
let ready = null;
const HARNESS = \`
import json, sys, io

def __skilly_norm(v):
    if isinstance(v, tuple):
        v = list(v)
    if isinstance(v, list):
        return [__skilly_norm(x) for x in v]
    return v

def __skilly_run(src, name, tests_json):
    buf = io.StringIO()
    old = sys.stdout
    sys.stdout = buf
    try:
        ns = {}
        try:
            exec(compile(src, 'solution.py', 'exec'), ns)
        except SyntaxError as e:
            return json.dumps({'error': f'SyntaxError on line {e.lineno}: {e.msg}', 'logs': buf.getvalue()})
        except Exception as e:
            return json.dumps({'error': f'{type(e).__name__}: {e}', 'logs': buf.getvalue()})
        f = ns.get(name)
        if not callable(f):
            return json.dumps({'error': f'Define a function named {name}.', 'logs': buf.getvalue()})
        out = []
        for t in json.loads(tests_json):
            try:
                got = __skilly_norm(f(*t['args']))
                try:
                    out.append({'json': json.dumps(got, allow_nan=False), 'got': repr(got)})
                except ValueError:
                    out.append({'error': 'Returned NaN or infinity, which is never a valid answer here.', 'got': repr(got)})
                except TypeError:
                    out.append({'error': f'Returned a {type(got).__name__}; return a number, string, bool, None or list.', 'got': repr(got)})
            except Exception as e:
                out.append({'error': f'{type(e).__name__}: {e}'})
        return json.dumps({'results': out, 'logs': buf.getvalue()})
    finally:
        sys.stdout = old
\`;
self.onmessage = async (e) => {
  try {
    if (!ready) ready = loadPyodide({ indexURL: '${PYODIDE_URL}' }).then((py) => { py.runPython(HARNESS); return py; });
    const py = await ready;
    self.postMessage({ status: 'started' });
    const run = py.globals.get('__skilly_run');
    const res = JSON.parse(run(e.data.code, e.data.fn, JSON.stringify(e.data.tests)));
    run.destroy();
    const logs = (res.logs || '').split('\\n').filter(Boolean).slice(0, ${MAX_LOG_LINES});
    if (res.error) self.postMessage({ status: 'error', message: res.error, logs });
    else self.postMessage({ status: 'ok', results: res.results, logs });
  } catch (err) {
    self.postMessage({ status: 'loadError', message: String(err && err.message || err) });
  }
};
`;

const workers = {};
function getWorker(lang) {
  if (!workers[lang]) {
    const url = URL.createObjectURL(new Blob([lang === 'py' ? PY_WORKER : JS_WORKER], { type: 'text/javascript' }));
    workers[lang] = new Worker(url);
  }
  return workers[lang];
}
function killWorker(lang) {
  workers[lang]?.terminate();
  delete workers[lang];
}

export const pythonLoaded = () => Boolean(workers.py && workers.py.__ready);

// onStage('loading-python' | 'running') lets the UI show progress.
export function runCode({ lang, code, fn, tests }, onStage = () => {}) {
  return new Promise((resolve) => {
    const w = getWorker(lang);
    let timer = null;
    const startClock = () => {
      onStage('running');
      clearTimeout(timer);
      timer = setTimeout(() => {
        killWorker(lang); // a stuck loop can only be stopped by ending the worker
        resolve({ status: 'timeout' });
      }, TIME_LIMIT_MS);
    };
    const done = (r) => { clearTimeout(timer); w.onmessage = null; w.onerror = null; resolve(r); };
    w.onmessage = (e) => {
      const d = e.data;
      if (d.status === 'started') { w.__ready = true; startClock(); return; }
      if (d.status === 'loadError') { killWorker(lang); done({ status: 'error', message: `Couldn’t load Python (${d.message}). Check your connection and try again.`, logs: [] }); return; }
      if (d.status !== 'ok') { done(d); return; }
      const results = d.results.map((r, i) => {
        if (r.error) return { pass: false, error: r.error, got: r.got };
        const value = r.undef ? undefined : JSON.parse(r.json);
        return { pass: !r.undef && deepEqual(value, tests[i].expect), got: r.got };
      });
      done({ status: 'ok', results, logs: d.logs || [] });
    };
    w.onerror = (e) => { e.preventDefault?.(); killWorker(lang); done({ status: 'error', message: e.message || 'The code runner crashed.', logs: [] }); };
    if (lang === 'py' && !w.__ready) {
      onStage('loading-python');
      timer = setTimeout(() => {
        killWorker(lang);
        resolve({ status: 'error', message: 'Python is taking too long to download. Check your connection and press Run again.', logs: [] });
      }, PY_LOAD_LIMIT_MS);
    } else startClock();
    w.postMessage({ code, fn, tests });
  });
}
