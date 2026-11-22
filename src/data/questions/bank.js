// The full question bank (1,000+ questions). Loaded on demand by
// loadQuestions() in index.js, so the home page doesn't download it.
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
import { MORE } from './more/index.js';
import { LANGUAGE_ORDER, DIFFICULTIES, PREFIX } from './meta.js';

const MODULES = { python, java, cpp, javascript, typescript, csharp, sql, go, kotlin, rust, swift, php, ruby, dart };

export function buildQuestions() {
  const out = [];
  for (const lang of LANGUAGE_ORDER) {
    const mod = MODULES[lang];
    for (const d of DIFFICULTIES) {
      [...mod[d], ...(MORE[lang]?.[d] || [])].forEach(([topic, prompt, code, options, explanation], i) => {
        out.push({
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
  return out;
}
