// Turns an assessment report (or the Beginner path) into a weekly plan.
import { QUESTIONS, LANGUAGE_BY_ID, topicLabel } from '../data/questions/index.js';
import { breakdown, shuffle, allowedDifficulties } from './engine.js';

const DIFF_ORDER = ['easy', 'medium', 'hard'];
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const topicIndex = (lang, key) => LANGUAGE_BY_ID[lang].topics.findIndex((t) => t.key === key);
const topicMeta = (lang, key) => LANGUAGE_BY_ID[lang].topics.find((t) => t.key === key);
const tLabel = (lang, key) => `${LANGUAGE_BY_ID[lang].label} · ${topicLabel(lang, key)}`;

function courseQuery(lang, key) {
  const m = topicMeta(lang, key);
  return { roadmap: LANGUAGE_BY_ID[lang].roadmap, keywords: m.keywords, practice: tLabel(lang, key), language: lang, topic: key };
}

// Picks quiz questions for the given topics, preferring unseen questions at the
// preferred difficulty and falling back to easier ones.
function pickQuiz(topics, difficulty, exclude = new Set(), count = 3, rand = Math.random) {
  const ladder = [difficulty, ...DIFF_ORDER.slice(0, DIFF_ORDER.indexOf(difficulty)).reverse(), ...DIFF_ORDER.slice(DIFF_ORDER.indexOf(difficulty) + 1)];
  const chosen = [];
  const take = (pred, n = count) => {
    const limit = Math.min(count, chosen.length + n);
    for (const d of ladder) {
      const pool = shuffle(QUESTIONS.filter((q) => q.difficulty === d && pred(q) && !exclude.has(q.id) && !chosen.includes(q.id)), rand);
      while (pool.length && chosen.length < limit) chosen.push(pool.shift().id);
      if (chosen.length >= limit) return;
    }
  };
  // Give every topic a fair share first, then top up.
  const share = Math.max(1, Math.floor(count / Math.max(1, topics.length)));
  for (const t of topics) take((q) => q.language === t.language && q.topic === t.topic, share);
  take((q) => topics.some((t) => q.language === t.language && q.topic === t.topic));
  const langs = [...new Set(topics.map((t) => t.language))];
  take((q) => langs.includes(q.language));
  return { questionIds: chosen, orders: Object.fromEntries(chosen.map((id) => [id, shuffle([0, 1, 2, 3], rand)])) };
}

// Within each language, re-sort its slots so prerequisites (earlier topics) come first.
function prereqOrder(list) {
  const out = [...list];
  const byLang = {};
  out.forEach((c, i) => (byLang[c.language] ??= []).push(i));
  for (const idxs of Object.values(byLang)) {
    const sorted = idxs.map((i) => out[i]).sort((a, b) => topicIndex(a.language, a.topic) - topicIndex(b.language, b.topic));
    idxs.forEach((slot, k) => { out[slot] = sorted[k]; });
  }
  return out;
}

const chunk = (arr, n) => arr.reduce((acc, x, i) => (i % n ? acc[acc.length - 1].push(x) : acc.push([x]), acc), []);

export function buildPlanFromReport(report, rand = Math.random) {
  const { topics } = breakdown(report);
  const seen = new Set(report.items.map((i) => i.id));
  const langNames = report.languages.map((l) => LANGUAGE_BY_ID[l].label).join(', ');
  const D = cap(report.difficulty);
  const weeks = [];

  const candidates = [];
  for (const t of topics) {
    const missed = t.incorrect + t.unanswered;
    if (missed === 0) continue;
    const detail = `${t.correct} of ${t.total} correct${t.incorrect ? `, ${t.incorrect} incorrect` : ''}${t.unanswered ? `, ${t.unanswered} unanswered` : ''}`;
    if (missed >= 2) {
      candidates.push({ ...t, priority: 0, evidence: 'repeated', why: `${tLabel(t.language, t.topic)} — ${detail}. Repeated misses make this a priority.` });
    } else if (t.total === 1) {
      candidates.push({ ...t, priority: 1, evidence: 'thin', why: `${tLabel(t.language, t.topic)} — ${detail}. Only one question covered this, so it needs more practice to assess.` });
    } else {
      candidates.push({ ...t, priority: 1, evidence: 'single', why: `${tLabel(t.language, t.topic)} — ${detail}. One slip: a light practice pass should be enough.` });
    }
  }
  candidates.sort((a, b) => a.priority - b.priority || (b.incorrect + b.unanswered) - (a.incorrect + a.unanswered));
  const ordered = prereqOrder(candidates).slice(0, 10);

  const everythingBlank = report.unanswered === report.total;
  const everythingRight = report.correct === report.total;

  if (everythingBlank) {
    // Foundation review: the first topics of each language, then reassess.
    const base = report.languages.flatMap((l) => LANGUAGE_BY_ID[l].topics.slice(0, 3).map((t) => ({ language: l, topic: t.key })));
    chunk(base, 2).slice(0, 4).forEach((group, i) => {
      weeks.push(makeWeek({
        kind: 'foundation', index: i, group, difficulty: 'easy', exclude: seen, rand,
        title: `Foundations: ${group.map((g) => topicLabel(g.language, g.topic)).join(' + ')}`,
        goal: `Rebuild the basics of ${group.map((g) => tLabel(g.language, g.topic)).join(' and ')}.`,
        why: 'No answers were submitted, so we can’t see your level yet. A short foundation review gives you a fair starting point before reassessing.',
      }));
    });
    weeks.push(reassessWeek(weeks.length, report, report.difficulty, `After the foundation weeks, retake ${D} so we have real evidence of your level.`, rand, seen));
  } else if (everythingRight) {
    const next = DIFF_ORDER[DIFF_ORDER.indexOf(report.difficulty) + 1];
    const nextAllowed = next && allowedDifficulties(report.audience).includes(next);
    const tested = new Set(topics.map((t) => `${t.language}:${t.topic}`));
    const untested = report.languages.flatMap((l) => LANGUAGE_BY_ID[l].topics.filter((t) => !tested.has(`${l}:${t.key}`)).map((t) => ({ language: l, topic: t.key })));
    const extDiff = nextAllowed ? next : report.difficulty;
    chunk(untested.length ? untested : topics.map((t) => ({ language: t.language, topic: t.topic })), 2).slice(0, 3).forEach((group, i) => {
      weeks.push(makeWeek({
        kind: 'extension', index: i, group, difficulty: extDiff, exclude: seen, rand,
        title: `Extension: ${group.map((g) => topicLabel(g.language, g.topic)).join(' + ')}`,
        goal: `Stretch into ${group.map((g) => tLabel(g.language, g.topic)).join(' and ')}${nextAllowed ? ` at ${cap(next)} level` : ''}.`,
        why: untested.length
          ? `You got every ${D} question right. These topics weren’t covered by your test, so they’re the next frontier.`
          : `You got every ${D} question right. These are deeper drills on the same topics.`,
      }));
    });
    if (nextAllowed) weeks.push(reassessWeek(weeks.length, report, next, `Every ${D} answer was correct — try ${cap(next)} next.`, rand, seen));
  } else {
    chunk(ordered, 2).slice(0, 5).forEach((group, i) => {
      const hasRepeated = group.some((g) => g.evidence === 'repeated');
      weeks.push(makeWeek({
        kind: 'practice', index: i, group, difficulty: report.difficulty, exclude: seen, rand,
        title: group.map((g) => topicLabel(g.language, g.topic)).join(' + '),
        goal: `${hasRepeated ? 'Close the gap in' : 'Firm up'} ${group.map((g) => tLabel(g.language, g.topic)).join(' and ')}.`,
        why: group.map((g) => g.why).join(' '),
        missed: Object.fromEntries(group.map((g) => [`${g.language}:${g.topic}`, g.incorrect + g.unanswered])),
      }));
    });
    weeks.push(reassessWeek(weeks.length, report, report.difficulty, `Check your progress with a fresh ${D} set in ${langNames}.`, rand, seen));
  }

  return {
    id: report.id,
    source: 'report',
    reportId: report.id,
    audience: report.audience,
    title: `${langNames} · ${D}`,
    createdAt: report.submittedAt,
    weeks,
    progress: {},
  };
}

function makeWeek({ kind, index, group, difficulty, exclude, rand, title, goal, why, missed = {} }) {
  const tasks = [];
  for (const g of group) {
    const L = LANGUAGE_BY_ID[g.language].label;
    const label = topicLabel(g.language, g.topic);
    tasks.push(`Read the roadmap.sh topic matched to ${label} below and work through one linked resource.`);
    tasks.push(`Write 3 short ${L} snippets that exercise ${label}. Predict each output before you run it.`);
    const m = missed[`${g.language}:${g.topic}`];
    if (m) tasks.push(`Reopen the ${m} ${label} question${m > 1 ? 's' : ''} you missed in your report and explain the correct answer in your own words.`);
  }
  tasks.push('Take this week’s quiz and review each explanation.');
  return {
    id: `w${index + 1}`,
    kind,
    title,
    goal,
    why,
    topics: group.map((g) => ({ language: g.language, topic: g.topic })),
    courseQueries: group.map((g) => courseQuery(g.language, g.topic)),
    tasks,
    quiz: pickQuiz(group, difficulty, exclude, 3, rand),
    quizOptional: false,
  };
}

function reassessWeek(index, report, difficulty, why, rand, exclude) {
  const langs = report.languages;
  const topics = langs.map((l) => ({ language: l, topic: LANGUAGE_BY_ID[l].topics[0].key }));
  return {
    id: `w${index + 1}`,
    kind: 'reassess',
    title: `Reassess at ${cap(difficulty)}`,
    goal: `Take a new ${cap(difficulty)} assessment in ${langs.map((l) => LANGUAGE_BY_ID[l].label).join(', ')} and compare it with this report.`,
    why,
    topics: [],
    courseQueries: [],
    tasks: [
      'Skim your notes from the previous weeks.',
      `Start a fresh ${cap(difficulty)} assessment from the button on this milestone.`,
      'Compare the new report’s topic breakdown with this one.',
    ],
    quiz: pickQuiz(topics, difficulty, exclude, 3, rand),
    quizOptional: true,
    reassess: { languages: langs, difficulty },
  };
}

// ─── Beginner path ────────────────────────────────────────────────────────
// Per-language starter profile: how to run a first program, where to start
// reading, what it is good for, and which bank topics each of the 4 weeks uses.
const L_ = (title, url) => ({ title, url });
export const BEGINNER_PROFILES = {
  python: { goodFor: 'Data, AI, automation and a gentle first language', setup: 'Install Python 3 from python.org (or open an online Python editor) and run print("Hello, Skilly").', links: [L_('The Python Tutorial (official)', 'https://docs.python.org/3/tutorial/'), L_('CS50’s Introduction to Programming with Python', 'https://cs50.harvard.edu/python/'), L_('Kaggle Learn: Python', 'https://www.kaggle.com/learn/python')], weeks: [['basics', 'strings'], ['basics', 'control'], ['control', 'functions'], ['collections', 'functions']] },
  javascript: { goodFor: 'Websites and anything that runs in a browser', setup: 'Open your browser’s DevTools console (F12) and run console.log("Hello, Skilly").', links: [L_('The Modern JavaScript Tutorial', 'https://javascript.info/'), L_('MDN JavaScript Guide', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide'), L_('freeCodeCamp', 'https://www.freecodecamp.org/learn/')], weeks: [['basics', 'coercion'], ['basics', 'control'], ['control', 'functions'], ['arrays', 'functions']] },
  java: { goodFor: 'Android, enterprise backends and placement interviews', setup: 'Install a JDK (for example Temurin 21), then compile and run a HelloWorld class that calls System.out.println("Hello, Skilly").', links: [L_('Learn Java (dev.java)', 'https://dev.java/learn/'), L_('NPTEL courses', 'https://nptel.ac.in/')], weeks: [['basics', 'strings'], ['basics', 'control'], ['control', 'oop'], ['collections', 'oop']] },
  cpp: { goodFor: 'DSA and competitive programming, games and embedded systems', setup: 'Install a compiler (g++, clang or Visual Studio) and compile a program that prints Hello, Skilly with std::cout.', links: [L_('LearnCpp', 'https://www.learncpp.com/'), L_('CP-Algorithms', 'https://cp-algorithms.com/')], weeks: [['basics'], ['basics', 'control'], ['control', 'functions'], ['stl', 'functions']] },
  typescript: { goodFor: 'Large web apps with safer JavaScript', setup: 'Open the TypeScript Playground (typescriptlang.org/play) and log "Hello, Skilly" with console.log.', links: [L_('TypeScript Handbook', 'https://www.typescriptlang.org/docs/handbook/intro.html'), L_('The Modern JavaScript Tutorial', 'https://javascript.info/')], weeks: [['basics'], ['basics', 'narrowing'], ['functions', 'objects'], ['objects', 'generics']] },
  csharp: { goodFor: 'Windows apps, Unity games and .NET backends', setup: 'Install the .NET SDK, run dotnet new console, then print Hello, Skilly with Console.WriteLine.', links: [L_('C# documentation', 'https://learn.microsoft.com/en-us/dotnet/csharp/')], weeks: [['basics', 'strings'], ['basics', 'control'], ['control', 'oop'], ['collections', 'oop']] },
  sql: { goodFor: 'Working with data in any job, from analyst to backend', setup: 'Open SQLBolt (or install PostgreSQL) and run SELECT \'Hello, Skilly\';', links: [L_('SQLBolt interactive lessons', 'https://sqlbolt.com/'), L_('Kaggle Learn: Intro to SQL', 'https://www.kaggle.com/learn/intro-to-sql'), L_('PostgreSQL tutorial', 'https://www.postgresql.org/docs/current/tutorial.html')], weeks: [['select'], ['filtering'], ['aggregation'], ['joins', 'modification']],
    titles: ['Your first queries', 'Filtering rows', 'Counting & grouping', 'Joining tables (project)'],
    tasks: [
      ['Run SELECT * on a sample table and then pick only two columns.', 'Sort the results with ORDER BY, then limit them to 5 rows.', 'Read the matched SELECT topic below.'],
      ['Filter rows with WHERE, AND and OR.', 'Find rows where a column IS NULL.', 'Use LIKE to match names starting with a letter.'],
      ['Count rows per group with GROUP BY.', 'Keep only big groups with HAVING.', 'Compute an average and a maximum per group.'],
      ['Join two tables with INNER JOIN, then LEFT JOIN and compare.', 'Answer three questions about a small dataset you design yourself.', 'Write a short README explaining each query.'],
    ] },
  go: { goodFor: 'Cloud services, CLIs and fast backends', setup: 'Install Go from go.dev (or use the Go Playground) and run fmt.Println("Hello, Skilly").', links: [L_('A Tour of Go', 'https://go.dev/tour/')], weeks: [['basics'], ['basics', 'functions'], ['functions', 'errors'], ['slices', 'types']] },
  kotlin: { goodFor: 'Android apps and modern JVM backends', setup: 'Open the Kotlin Playground (play.kotlinlang.org) and run println("Hello, Skilly").', links: [L_('Kotlin: Get started', 'https://kotlinlang.org/docs/getting-started.html'), L_('Android Basics with Compose', 'https://developer.android.com/courses/android-basics-compose/course')], weeks: [['basics', 'nulls'], ['basics', 'control'], ['control', 'functions'], ['collections', 'classes']] },
  rust: { goodFor: 'Systems programming that is fast and memory-safe', setup: 'Install Rust with rustup, run cargo new hello, then cargo run.', links: [L_('The Rust Programming Language (book)', 'https://doc.rust-lang.org/book/')], weeks: [['basics'], ['basics', 'enums'], ['basics', 'ownership'], ['collections', 'traits']] },
  swift: { goodFor: 'iPhone, iPad and Mac apps', setup: 'Open a Playground in Xcode (or the Swift Playgrounds app) and run print("Hello, Skilly").', links: [L_('The Swift Programming Language', 'https://docs.swift.org/latest/documentation/the-swift-programming-language/'), L_('SwiftUI tutorials', 'https://developer.apple.com/tutorials/swiftui')], weeks: [['basics', 'optionals'], ['basics', 'control'], ['control', 'collections'], ['collections', 'types']] },
  php: { goodFor: 'Server-side websites and WordPress', setup: 'Install PHP (or use an online sandbox) and run <?php echo "Hello, Skilly";', links: [L_('PHP manual: Getting started', 'https://www.php.net/manual/en/getting-started.php')], weeks: [['basics', 'strings'], ['basics'], ['functions', 'arrays'], ['arrays', 'oop']] },
  ruby: { goodFor: 'Readable scripting and Rails web apps', setup: 'Install Ruby (or use an online sandbox) and run puts "Hello, Skilly".', links: [L_('Ruby in Twenty Minutes', 'https://www.ruby-lang.org/en/documentation/quickstart/')], weeks: [['basics', 'strings'], ['basics', 'control'], ['control', 'blocks'], ['collections', 'oop']] },
  dart: { goodFor: 'Flutter apps for Android and iOS from one codebase', setup: 'Open DartPad (dartpad.dev) and run print(\'Hello, Skilly\');', links: [L_('Dart language tour', 'https://dart.dev/language'), L_('Flutter: Install & get started', 'https://docs.flutter.dev/install')], weeks: [['basics', 'nulls'], ['basics'], ['functions'], ['collections', 'classes']] },
};

// "Not sure?" — goals mapped to a sensible first language.
export const BEGINNER_GOALS = [
  { label: 'Websites', lang: 'javascript' },
  { label: 'Data & AI', lang: 'python' },
  { label: 'Android apps', lang: 'kotlin' },
  { label: 'iPhone apps', lang: 'swift' },
  { label: 'Cross-platform apps', lang: 'dart' },
  { label: 'Games', lang: 'csharp' },
  { label: 'Placement interviews (DSA)', lang: 'cpp' },
  { label: 'Backend & cloud', lang: 'go' },
  { label: 'Working with data', lang: 'sql' },
];

export function buildBeginnerPlan(language = 'python', rand = Math.random) {
  const prof = BEGINNER_PROFILES[language] || BEGINNER_PROFILES.python;
  if (!BEGINNER_PROFILES[language]) language = 'python';
  const L = LANGUAGE_BY_ID[language].label;
  const generic = [
    {
      title: 'Programming basics',
      goal: `Run your first ${L} program and understand values, types and text.`,
      tasks: [prof.setup, 'Store your name and age in variables and print a sentence that uses both.', 'Try three operations on text: change the case, measure the length and join two strings.', `Read one of the “Start here” resources for ${L} below.`],
    },
    {
      title: 'Variables & conditions',
      goal: 'Make decisions in code with comparisons and if/else.',
      tasks: ['Write a program that says whether a number is positive, negative or zero.', 'Print a different message for ages under 13, under 18 and adults.', `Explain to yourself the difference between assignment and the equality operator in ${L}.`, 'Read the matched conditions topic below.'],
    },
    {
      title: 'Loops & functions',
      goal: 'Repeat work with loops and package logic into reusable functions.',
      tasks: ['Print the numbers 1–10, then only the even ones.', 'Write a function that takes a list of numbers and returns their total.', 'Write a function that takes a parameter and call it with two different arguments.', 'Read the matched functions topic below.'],
    },
    {
      title: 'A small project',
      goal: 'Combine everything into a tiny project you can show someone.',
      tasks: ['Build a number-guessing game or a to-do list that stores items in a collection.', 'Split your project into at least two functions.', 'Put the project in a Git repository (see the Git & GitHub beginner resources below).', 'Share it with a friend, or write a short README describing what it does.'],
    },
  ];
  const weeks = generic.map((w, i) => {
    const valid = prof.weeks[i].filter((t) => LANGUAGE_BY_ID[language].topics.some((x) => x.key === t));
    const group = (valid.length ? valid : [LANGUAGE_BY_ID[language].topics[0].key]).map((t) => ({ language, topic: t }));
    const courseQueries = group.map((g) => courseQuery(g.language, g.topic));
    if (i === 3) courseQueries.push({ roadmap: 'git-github-beginner', keywords: ['learn-the-basics', 'basic-git-usage'], practice: 'Git & GitHub basics', language, topic: null });
    const tasks = prof.tasks ? [...(i === 0 ? [prof.setup] : []), ...prof.tasks[i]] : w.tasks;
    return {
      id: `w${i + 1}`,
      kind: i === 3 ? 'project' : 'starter',
      title: prof.titles?.[i] || w.title,
      goal: prof.titles ? `${prof.titles[i]} in ${L}.` : w.goal,
      why: i === 0 ? `You chose ${L}. Good for: ${prof.goodFor}. No profile or score needed.` : `Builds on week ${i}.`,
      topics: group,
      courseQueries,
      links: i === 0 ? prof.links : [],
      tasks,
      quiz: pickQuiz(group, 'easy', new Set(), 3, rand),
      quizOptional: true,
    };
  });
  return { id: `beginner-${language}`, source: 'beginner', audience: 'beginner', language, title: `${L} starter path`, createdAt: Date.now(), weeks, progress: {} };
}

// ─── Progress helpers ─────────────────────────────────────────────────────
export function weekProgress(plan, week) {
  const p = plan.progress?.[week.id] || {};
  const doneTasks = week.tasks.filter((_, i) => p.tasks?.[i]).length;
  const quizDone = !!p.quiz?.submitted;
  const complete = doneTasks === week.tasks.length && (quizDone || week.quizOptional || !week.quiz.questionIds.length);
  return { doneTasks, totalTasks: week.tasks.length, quizDone, quizScore: p.quiz?.score ?? null, complete };
}

export function currentWeekIndex(plan) {
  const i = plan.weeks.findIndex((w) => !weekProgress(plan, w).complete);
  return i === -1 ? plan.weeks.length - 1 : i;
}
