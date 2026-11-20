// Question bank entry point. Each language file exports `meta`, `easy`, `medium`, `hard`.
// Rows are expanded here into full question objects with stable IDs.
import * as python from './python.js';
import * as java from './java.js';
import * as cpp from './cpp.js';
import * as javascript from './javascript.js';
import * as typescript from './typescript.js';
import * as csharp from './csharp.js';
import * as sql from './sql.js';
import * as go from './go.js';
import * as kotlin from './kotlin.js';
import * as rust from './rust.js';
import * as swift from './swift.js';
import * as php from './php.js';
import * as ruby from './ruby.js';
import * as dart from './dart.js';

const MODULES = [python, java, cpp, javascript, typescript, csharp, sql, go, kotlin, rust, swift, php, ruby, dart];
export const DIFFICULTIES = ['easy', 'medium', 'hard'];

const PREFIX = { python: 'py', java: 'java', cpp: 'cpp', javascript: 'js', typescript: 'ts', csharp: 'cs', sql: 'sql', go: 'go', kotlin: 'kt', rust: 'rs', swift: 'swift', php: 'php', ruby: 'rb', dart: 'dart' };

export const LANGUAGES = MODULES.map((m) => m.meta);
export const LANGUAGE_BY_ID = Object.fromEntries(LANGUAGES.map((l) => [l.id, l]));

export const QUESTIONS = [];
for (const mod of MODULES) {
  const lang = mod.meta.id;
  for (const d of DIFFICULTIES) {
    mod[d].forEach(([topic, prompt, code, options, explanation], i) => {
      QUESTIONS.push({
        id: `${PREFIX[lang]}-${d}-${String(i + 1).padStart(2, '0')}`,
        language: lang,
        topic,
        difficulty: d,
        prompt,
        code: code || null,
        options, // source order; options[correct] is the answer
        correct: 0,
        explanation,
      });
    });
  }
}

export const QUESTION_BY_ID = Object.fromEntries(QUESTIONS.map((q) => [q.id, q]));

export function topicLabel(language, key) {
  const t = LANGUAGE_BY_ID[language]?.topics.find((x) => x.key === key);
  return t ? t.label : key;
}
