// Test engine: attempt construction, timing and scoring.
import { QUESTIONS, QUESTION_BY_ID, LANGUAGE_BY_ID, topicLabel } from '../data/questions/index.js';

export const DURATIONS = [10, 15, 20];
export const QUESTION_COUNT = { 10: 8, 15: 12, 20: 16 };
export const LANGUAGE_IDS = ['python', 'java', 'cpp', 'javascript', 'typescript', 'csharp', 'sql', 'go', 'kotlin', 'rust', 'swift', 'php', 'ruby', 'dart'];

export function allowedDifficulties(audience) {
  if (audience === 'professional') return ['easy', 'medium', 'hard'];
  if (audience === 'student') return ['easy', 'medium'];
  return [];
}

export function shuffle(arr, rand = Math.random) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function validateSetup({ audience, languages, difficulty, duration }) {
  if (!['professional', 'student'].includes(audience)) return 'Choose Professional or Student to take an assessment.';
  if (!languages?.length) return 'Select at least one language first.';
  if (languages.some((l) => !LANGUAGE_IDS.includes(l))) return 'Unknown language selected.';
  if (!allowedDifficulties(audience).includes(difficulty)) return `${difficulty ? difficulty[0].toUpperCase() + difficulty.slice(1) : 'That difficulty'} is not available for this path.`;
  if (!QUESTION_COUNT[duration]) return 'Choose a duration.';
  return null;
}

// Every selected language is represented; the rest is distributed round-robin
// (as evenly as each language's pool allows). No duplicate IDs.
export function buildAttempt(setup, { now = Date.now(), rand = Math.random } = {}) {
  const err = validateSetup(setup);
  if (err) throw new Error(err);
  const { audience, languages, difficulty, duration } = setup;
  const total = QUESTION_COUNT[duration];
  const pools = Object.fromEntries(languages.map((l) => [
    l, shuffle(QUESTIONS.filter((q) => q.language === l && q.difficulty === difficulty), rand),
  ]));
  const order = shuffle(languages, rand);
  const picked = [];
  let progressed = true;
  while (picked.length < total && progressed) {
    progressed = false;
    for (const l of order) {
      if (picked.length >= total) break;
      const q = pools[l].shift();
      if (q) { picked.push(q.id); progressed = true; }
    }
  }
  const questionIds = shuffle(picked, rand);
  const optionOrders = Object.fromEntries(questionIds.map((id) => [id, shuffle([0, 1, 2, 3], rand)]));
  return {
    id: `a${now.toString(36)}${Math.floor(rand() * 1e6).toString(36)}`,
    audience, languages: [...languages], difficulty, duration,
    questionIds, optionOrders,
    answers: {}, // questionId -> source option index
    current: 0,
    startedAt: now,
    deadline: now + duration * 60_000,
    status: 'active',
  };
}

export function remainingMs(attempt, now = Date.now()) {
  return Math.max(0, attempt.deadline - now);
}

// Pure scoring from a submitted attempt.
export function scoreAttempt(attempt, { submittedAt = Date.now(), reason = 'manual' } = {}) {
  const items = attempt.questionIds.map((id) => {
    const q = QUESTION_BY_ID[id];
    const chosen = attempt.answers[id];
    const answered = Number.isInteger(chosen);
    const status = !answered ? 'unanswered' : chosen === q.correct ? 'correct' : 'incorrect';
    return { id, language: q.language, topic: q.topic, chosen: answered ? chosen : null, status, order: attempt.optionOrders[id] };
  });
  const total = items.length;
  const correct = items.filter((i) => i.status === 'correct').length;
  const incorrect = items.filter((i) => i.status === 'incorrect').length;
  const unanswered = total - correct - incorrect;
  return {
    id: attempt.id, // report id === attempt id → idempotent
    audience: attempt.audience,
    languages: attempt.languages,
    difficulty: attempt.difficulty,
    duration: attempt.duration,
    startedAt: attempt.startedAt,
    submittedAt,
    reason, // 'manual' | 'timeout'
    total, correct, incorrect, unanswered,
    marks: correct,
    accuracy: total ? Math.round((correct / total) * 1000) / 10 : 0,
    items,
  };
}

// Groups items by language and by language+topic with counts.
export function breakdown(report) {
  const byLang = {};
  const byTopic = {};
  for (const it of report.items) {
    const L = (byLang[it.language] ??= { language: it.language, label: LANGUAGE_BY_ID[it.language].label, total: 0, correct: 0, incorrect: 0, unanswered: 0 });
    const tk = `${it.language}:${it.topic}`;
    const T = (byTopic[tk] ??= { key: tk, language: it.language, topic: it.topic, label: topicLabel(it.language, it.topic), total: 0, correct: 0, incorrect: 0, unanswered: 0 });
    for (const g of [L, T]) { g.total++; g[it.status]++; }
  }
  const topicOrder = (t) => LANGUAGE_BY_ID[t.language].topics.findIndex((x) => x.key === t.topic);
  return {
    languages: Object.values(byLang),
    topics: Object.values(byTopic).sort((a, b) => a.language.localeCompare(b.language) || topicOrder(a) - topicOrder(b)),
  };
}

const NEXT = { easy: 'medium', medium: 'hard', hard: null };
const cap = (s) => s[0].toUpperCase() + s.slice(1);

// "What level am I at?" — scoped to the evidence in this attempt.
export function levelSummary(report) {
  const { total, correct, unanswered, difficulty, audience } = report;
  const d = cap(difficulty);
  const pct = total ? (correct / total) * 100 : 0;
  const scope = `Based on ${total} ${d} questions in ${report.languages.map((l) => LANGUAGE_BY_ID[l].label).join(', ')}`;
  const next = NEXT[difficulty];
  const nextAllowed = next && allowedDifficulties(audience).includes(next);
  if (unanswered === total) {
    return { headline: 'Not enough evidence yet', body: `${scope}, no questions were answered, so this attempt can’t tell us your level. Start with a foundation review, then reassess at ${d}.`, next: 'reassess' };
  }
  if (pct >= 85) {
    return {
      headline: `Strong at ${d} level`,
      body: `${scope}, you answered ${correct} of ${total} correctly. ${nextAllowed ? `You’re ready to try ${cap(next)}.` : difficulty === 'hard' ? 'Keep sharpening with extension work on the topics below.' : 'Medium is the highest level on the Student path, so the next step is extension practice.'}`,
      next: nextAllowed ? next : 'extend',
    };
  }
  if (pct >= 60) {
    return { headline: `Solid at ${d}, with gaps`, body: `${scope}, you answered ${correct} of ${total} correctly. Close the gaps highlighted below before moving up a level.`, next: 'practice' };
  }
  if (pct >= 35) {
    return { headline: `Developing at ${d}`, body: `${scope}, you answered ${correct} of ${total} correctly. Some topics need focused practice. This reflects ${d} questions only, not your overall ability.`, next: 'practice' };
  }
  return {
    headline: `Early days at ${d}`,
    body: `${scope}, you answered ${correct} of ${total} correctly. ${difficulty !== 'easy' ? 'Try Easy to establish a baseline, and ' : ''}work through the foundation weeks in your roadmap.`,
    next: difficulty !== 'easy' ? 'easier' : 'practice',
  };
}
