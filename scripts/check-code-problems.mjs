// Proves every coding problem's tests are correct: each reference solution
// (JavaScript in Node, Python via python3) must pass all of its tests, using
// the same comparison rules as the in-browser runner.
// Run: node scripts/check-code-problems.mjs
import { execFileSync } from 'node:child_process';
import { PROBLEMS, starterCode } from '../src/data/codeProblems.js';
import { deepEqual } from '../src/lib/codeCompare.js';

let failed = 0;
const fail = (m) => { console.error('✗', m); failed++; };
const ids = new Set();

for (const p of PROBLEMS) {
  if (ids.has(p.id)) fail(`${p.id}: duplicate id`); ids.add(p.id);
  if (!p.tests?.length || p.tests.length < 3) fail(`${p.id}: needs 3+ tests`);
  if (!(p.shown >= 1 && p.shown < p.tests.length)) fail(`${p.id}: must show some tests and hide at least one`);
  for (const lang of ['js', 'py']) if (!starterCode(p, lang).includes(p.fn[lang])) fail(`${p.id}: ${lang} starter missing function name`);
  // JavaScript
  const f = new Function(`${p.solution.js}\nreturn ${p.fn.js};`)();
  p.tests.forEach((t, i) => {
    const got = f(...structuredClone(t.args));
    if (!deepEqual(got, t.expect)) fail(`${p.id} js test ${i + 1}: expected ${JSON.stringify(t.expect)}, got ${JSON.stringify(got)}`);
  });
}

// Python: one process runs every solution with the runner's comparison rules.
const harness = `
import json, sys
def norm(v):
    if isinstance(v, tuple): v = list(v)
    if isinstance(v, list): return [norm(x) for x in v]
    return v
data = json.load(sys.stdin)
bad = []
for p in data:
    ns = {}
    exec(p["src"], ns)
    f = ns[p["fn"]]
    for i, t in enumerate(p["tests"]):
        got = norm(f(*t["args"]))
        if got != t["expect"] or type(got) is bool and type(t["expect"]) is not bool:
            bad.append(f'{p["id"]} py test {i+1}: expected {t["expect"]!r}, got {got!r}')
print(json.dumps(bad))
`;
const out = execFileSync('python3', ['-I', '-c', harness], {
  input: JSON.stringify(PROBLEMS.map((p) => ({ id: p.id, src: p.solution.py, fn: p.fn.py, tests: p.tests }))),
});
for (const m of JSON.parse(out.toString())) fail(m);

if (failed) process.exit(1);
console.log(`✓ ${PROBLEMS.length} coding problems: every test verified in JavaScript and Python (${PROBLEMS.reduce((n, p) => n + p.tests.length, 0)} tests each)`);
