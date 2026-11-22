// Runs every "What does this print?"-style question with the real language
// and checks that the marked answer (option 0) matches the actual output.
// Languages are checked only if their toolchain is installed on this machine;
// the rest are reported as "needs a teacher".
//
//   node scripts/verify-questions.mjs           report + write the verified list
//   node scripts/verify-questions.mjs --strict  also exit 1 on any mismatch (CI)
//
// Writes src/data/questions/verified.json: ids whose answer was confirmed by
// running the code. The site shows those with a "checked by running" badge.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { QUESTIONS, loadQuestions } from '../src/data/questions/index.js';

await loadQuestions();

const STRICT = process.argv.includes('--strict');
const PRINT_PROMPT = /^(what (does|will) this( \w+)? (print|output|log)|what is (printed|logged|the output)|what gets printed|in what order are .* printed)/i;
// Python single-expression questions can be checked by evaluating them.
const EXPR_PROMPT = /^what is the value of (the|this) expression/i;
const ERROR_ANSWER = /\b(error|exception|throws?|panic|crash|does not compile|compile error|won.t compile)\b/i;

const has = (cmd, args = ['--version']) => { try { execFileSync(cmd, args, { stdio: 'ignore' }); return true; } catch { return false; } };
const dir = mkdtempSync(join(tmpdir(), 'skilly-verify-'));

const RUNNERS = {
  python: has('python3') && ((code) => run('python3', ['-I', file('a.py', code)])),
  javascript: has('node') && ((code) => run('node', [file('a.js', code)])),
  typescript: has('node') && ((code) => run('node', ['--no-warnings', file('a.ts', code)])),
  ruby: has('ruby') && ((code) => run('ruby', [file('a.rb', code)])),
  swift: has('swift') && ((code) => run('swift', [file('a.swift', code)], 60000)),
  cpp: has('clang++') && ((code) => {
    const src = /\bint\s+main\s*\(/.test(code)
      ? code
      : `#include <iostream>\n#include <string>\n#include <vector>\n#include <map>\n#include <algorithm>\nusing namespace std;\nint main() {\n${code}\nreturn 0;\n}`;
    const header = /#include/.test(src) ? '' : '#include <iostream>\n#include <string>\n#include <vector>\nusing namespace std;\n';
    const c = spawnSync('clang++', ['-std=c++17', '-w', '-o', join(dir, 'a.out'), file('a.cpp', header + src)], { encoding: 'utf8', timeout: 30000 });
    if (c.status !== 0) return { compileError: true, err: c.stderr };
    return run(join(dir, 'a.out'), []);
  }),
};

function file(name, code) { const p = join(dir, name); writeFileSync(p, code); return p; }
function run(cmd, args, timeout = 15000) {
  const r = spawnSync(cmd, args, { encoding: 'utf8', timeout });
  return { ok: r.status === 0 && !r.error, out: r.stdout || '', err: r.stderr || '' };
}
const norm = (s) => String(s).replace(/\s+/g, ' ').trim();
// Answers sometimes put each printed line on its own line, sometimes use spaces or commas.
// Also accept answers written in words: "6 then 0", "Hi, followed by a newline".
const variants = (a) => {
  const plain = a.replace(/,?\s*followed by a newline/gi, '').replace(/,?\s+then\s+/gi, ' ').replace(/,\s*then\s*/gi, ' ');
  return [a, a.replace(/,\s*/g, ' '), a.replace(/^['"]|['"]$/g, ''), plain, plain.replace(/,\s*/g, ' ')].map(norm);
};

const result = { verified: [], mismatch: [], skipped: 0, noToolchain: {} };
for (const q of QUESTIONS) {
  const isExpr = q.language === 'python' && q.code && EXPR_PROMPT.test(q.prompt) && !q.code.includes('\n');
  if (!q.code || (!PRINT_PROMPT.test(q.prompt) && !isExpr)) { result.skipped++; continue; }
  const runner = RUNNERS[q.language];
  if (!runner) { result.noToolchain[q.language] = (result.noToolchain[q.language] || 0) + 1; continue; }
  const answer = q.options[0];
  const r = runner(isExpr ? `print(repr(${q.code}))` : q.code);
  if (r.compileError) { result.notSnippet = (result.notSnippet || 0) + 1; continue; } // partial code: teacher review
  if (ERROR_ANSWER.test(answer)) {
    if (!r.ok) result.verified.push(q.id);
    else result.mismatch.push({ id: q.id, why: 'answer says it errors, but it ran', got: norm(r.out) });
    continue;
  }
  const got = norm(r.out);
  if (r.ok && variants(answer).includes(got)) result.verified.push(q.id);
  else result.mismatch.push({ id: q.id, why: r.ok ? 'output differs' : 'program failed', expected: norm(answer), got: got || norm(r.err).slice(0, 120) });
}
rmSync(dir, { recursive: true, force: true });

writeFileSync(new URL('../src/data/questions/verified.json', import.meta.url), JSON.stringify(result.verified.sort(), null, 0) + '\n');
console.log(`✓ ${result.verified.length} questions confirmed by running the code`);
if (result.notSnippet) console.log(`· ${result.notSnippet} code fragment(s) can't run on their own (teacher review only)`);
if (Object.keys(result.noToolchain).length) console.log(`· not runnable on this machine (teacher review only): ${Object.entries(result.noToolchain).map(([l, n]) => `${l} ${n}`).join(', ')}`);
for (const m of result.mismatch) console.log(`✗ ${m.id}: ${m.why}${m.expected !== undefined ? ` · marked "${m.expected}" · actual "${m.got}"` : m.got ? ` · actual "${m.got}"` : ''}${m.detail ? ` · ${m.detail}` : ''}`);
if (STRICT && result.mismatch.length) process.exit(1);
