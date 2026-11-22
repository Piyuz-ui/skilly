// Validates the question bank: counts, unique IDs, 4 distinct options, known topics.
import { QUESTIONS, LANGUAGES, DIFFICULTIES, QUESTION_TOTAL, loadQuestions } from '../src/data/questions/index.js';

await loadQuestions();

let errors = 0;
const fail = (m) => { errors++; console.error('✗', m); };
const ids = new Set();
for (const q of QUESTIONS) {
  if (ids.has(q.id)) fail(`duplicate id ${q.id}`);
  ids.add(q.id);
  if (q.options.length !== 4) fail(`${q.id} has ${q.options.length} options`);
  if (new Set(q.options).size !== 4) fail(`${q.id} has duplicate options`);
  if (!q.prompt || !q.explanation) fail(`${q.id} missing prompt/explanation`);
  const lang = LANGUAGES.find((l) => l.id === q.language);
  if (!lang.topics.some((t) => t.key === q.topic)) fail(`${q.id} unknown topic ${q.topic}`);
}
for (const l of LANGUAGES) {
  const row = DIFFICULTIES.map((d) => {
    const n = QUESTIONS.filter((q) => q.language === l.id && q.difficulty === d).length;
    if (n < 16) fail(`${l.id}/${d} has only ${n} questions`);
    return `${d}:${n}`;
  });
  console.log(l.label.padEnd(11), row.join('  '));
}
if (QUESTIONS.length !== QUESTION_TOTAL) fail(`QUESTION_TOTAL in src/data/questions/index.js is ${QUESTION_TOTAL}; set it to ${QUESTIONS.length}`);
console.log(`${QUESTIONS.length} questions, ${errors} problems`);
process.exit(errors ? 1 : 0);
