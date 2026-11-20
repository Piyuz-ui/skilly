# Skilly

An animated skill-assessment and learning website built with React, Vite and Three.js.
It asks one question first, “Which best describes you?”, and takes each learner
from there to “Here’s what I can practise this week”. It also has **career paths**:
step-by-step course roadmaps with a SkillBridge-style skill-gap planner.

| Path | Survey | Assessment | Destination |
|---|---|---|---|
| Professional | Languages (required) | Easy / Medium / Hard · 10, 15 or 20 min | Report, weak-topic roadmap, courses |
| Student | Languages (required) | Easy / Medium · 10, 15 or 20 min | Report, horizontal roadmap, courses, weekly tasks and quizzes |
| Beginner | Pick the language to learn (any of 14), or get a recommendation from your goal | — | Starter courses, horizontal roadmap, weekly tasks, optional quizzes |

## Run it

Requires Node 18 or later.

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:5173.

To build and preview the production version:

```bash
npm run build
```

```bash
npm run preview
```

The built site in `dist/` is static, so you can host it anywhere. It uses hash routing and relative asset paths.

Run every check (all 672 questions, plus the 18 logic checks):

```bash
npm test
```

## Deploying

`netlify.toml` holds the Netlify settings. With the GitHub repo connected to Netlify, every push to `main` runs `npm test`, builds the site and publishes `dist/`. If a check fails, the deploy stops and the live site stays on the last good version.

## Presentation

`presentation/` holds the pitch deck and handouts as editable HTML:

- `deck/`: the 17 slides (`slides/*.html`). Each slide's speaker notes are in its `<aside>`.
- `handouts/`: the judges' Q&A and the 5-minute final-round script.
- `pdf/`: the generated PDFs.

After editing any of them, rebuild all the PDFs (needs Google Chrome):

```bash
npm run pdfs
```

## Where things live

| What | Where |
|---|---|
| **Question bank** (672 questions: 14 languages × 3 levels × 16) | `src/data/questions/<language>.js`, combined in `src/data/questions/index.js` |
| **Career paths** (23 roadmaps across software, data and core engineering) | `src/data/paths.js` (software & SkillBridge roles) and `src/data/paths-engineering.js` (DevOps, security, games, UI/UX, blockchain, data engineering, maths, ECE, EEE, Mechanical, Civil, Chemical, Robotics, Aerospace, Biotech) |
| Beginner language picker and per-language starter profiles | `src/components/BeginnerPick.jsx`, `BEGINNER_PROFILES` in `src/lib/roadmap.js` |
| SkillBridge gap engine (readiness, gap × weight ranking, week packing) | `src/lib/gap.js` |
| Path viewer, node map and planner UI | `src/components/Paths.jsx` |
| Pointer tilt, glass sheen, spotlight and scroll reveal | `src/lib/fx.js` |
| **Course source config**, the one place to change it | `src/config.js` (`COURSE_REPO`, `COURSE_BRANCH`, `CATALOG_ROADMAPS`) |
| **Cached course catalog** (871 roadmap.sh topics with their linked resources) | `src/data/catalog.json` |
| Catalog builder | `scripts/build-catalog.mjs` (`npm run catalog`) |
| Test engine: attempt building, timing, scoring, level summary | `src/lib/engine.js` |
| Roadmap builder: report → weeks, plus the Beginner path | `src/lib/roadmap.js` |
| Course matching and built-in fallback activities | `src/lib/courses.js` |
| Persistence (localStorage, versioned and validated on load) | `src/lib/store.js` |
| Three.js glass bubbles | `src/components/bubbleScene.js` |
| Jelly wordmark (scroll-velocity spring) | `src/components/JellyLogo.jsx` |

### Languages

Python, Java, C++, JavaScript, TypeScript, C#, SQL, Go, Kotlin, Rust, Swift, PHP, Ruby and Dart.

### Career paths and SkillBridge

The career paths are modelled on step-by-step roadmap viewers. Each step has an overview,
skill chips, free resources grouped by type, a mini-project, a "Mark step complete" toggle
and a "Test my level" button that opens the assessment for that language.

**Data Analyst, Web Developer and ML Engineer** come from the SkillBridge prototype
(AARAMBHATHON Round 1): its role targets, skill hours per level, prerequisites, resource
links and mini-projects. Skill weights are SkillBridge's: the share of each role's 10
sampled job posts that name the skill. Those posts are **synthetic**, so the weights are
illustrative. **AI Engineer, Backend Developer, App Developer and DSA & Interviews** are
Skilly additions. Their hours and targets are estimates, and their skills are weighted equally.

The planner ports SkillBridge's rules exactly:
- readiness = weighted share of target levels already met;
- priority score = gap × weight;
- a prerequisite with a gap is scheduled before the skill that depends on it;
- hours (gap × hours per level) are packed into weeks at the learner's weekly time.

"Load the demo learner" on Data Analyst reproduces SkillBridge's demo: 43% readiness, with SQL ranked first at 3 × 0.9 = 2.7.
Every resource URL in `paths.js` was checked to load (HTTP 200) when it was added.

### Hero interactions

There are 22 glass bubbles, each with a technology mark. They lean away from the cursor
and wobble, the camera parallaxes slightly, and clicking a bubble in empty hero space pops
it with a particle burst. Under reduced motion all of this is off and the frame is static.

### Question format

Each row is `[topic, prompt, code | null, [correct, wrong, wrong, wrong], explanation]`.
Option 0 in the source is the correct answer. The engine shuffles option order once per
attempt and stores it, so refreshing or navigating shows exactly what the learner saw.
IDs come from each row's position (`py-hard-07`), so **only append rows**.
SQL questions use PostgreSQL and a shared schema that is shown with every SQL question.

### Courses (roadmap.sh)

The course source you gave was `https://roadmap.sh/`. Its content is open source at
`github.com/nilbuild/developer-roadmap` (the old `kamranahmedse/developer-roadmap` URL
redirects there). Each `roadmaps/<name>/content/<topic>.md` file has a title and a list of
real resources (`[@article@Title](url)`, `@course@`, `@video@`, `@official@`).
`npm run catalog` reads the repository tree and normalises those files into `catalog.json`,
keeping the original titles and URLs. The dashboard reads only that cached file and never
calls GitHub at runtime. roadmap.sh has no C#-only roadmap, so C# maps to the ASP.NET Core
roadmap.

To use a different repository, edit `src/config.js` and run `npm run catalog`. If its
layout differs from roadmap.sh's, adapt the parser in `scripts/build-catalog.mjs`. Set
`COURSE_REPO = ''` to run with no repository. The site then shows only activities labelled
“Built-in Skilly activity”, never presented as GitHub courses.

## Checks

```bash
npm run check:questions
```

This checks counts, unique IDs, four distinct options per question and known topics.

```bash
node scripts/test-logic.mjs
```

This checks the engine, scoring and roadmaps.

## What was verified

These checks were run during development:

- `npm run check:questions`: 8 languages × 3 levels × 16 questions, 0 problems.
- `node scripts/test-logic.mjs`: 18 checks pass. The original 14 are below; four more cover career paths:
  - The SkillBridge demo learner gets 43% readiness, SQL first at 2.7, and 61 h ≈ 11 weeks at 6 h/week.
  - HTML & CSS is scheduled before JavaScript.
  - A 14-language attempt covers every language.
  - Every path step is complete and points at valid languages.
  - Students cannot take Hard, and an empty survey is rejected.
  - Every language and level fills an 8-, 12- or 16-question attempt with no duplicates.
  - Python + Java splits 4/4.
  - 9 correct, 2 incorrect and 1 blank out of 12 gives 9/12 marks and 75% accuracy.
  - All correct produces extension weeks and a next-level step (Students are not pushed to Hard).
  - All blank produces foundation weeks and a reassessment.
  - A single missed Hard question yields a practice week rather than a sweeping verdict.
  - The report ID equals the attempt ID, so submitting is idempotent.
  - The Beginner path has 4 weeks with optional quizzes.
- `npm run build` succeeds.
- In the browser:
  - **Professional:** Python + Java → Hard → 10 min. Answered 8 (reloaded after 3; answers, question order and timer survived). A double-clicked Submit produced one report. The report showed 6/8 and 75% with correct per-language and per-topic counts and explanations. The roadmap was generated.
  - **Student:** SQL. Hard is not offered, and a stale Hard selection is cleared. Medium, 15 min, 12 questions gave 9/12 and 75%. Ticked a task, submitted the weekly quiz (3/3) and reloaded; progress persisted.
  - **Beginner:** courses appear immediately with no survey or test. “Start week one” selects and focuses week 1. Ticked a task.
  - **Edge cases:**
    - Empty survey shows an error.
    - Deep links to `#/setup` and `#/test` with no languages redirect to the survey with a notice.
    - A deadline that passes while away auto-submits on return, as a timeout with all answers blank.
    - Changing path mid-test shows a confirmation. “Keep” keeps the test, “Discard” clears it and keeps the 3 earlier reports.
    - With `COURSE_REPO = ''`, only built-in activities are shown.
    - `?nowebgl` shows the CSS glass fallback.
    - At 375 px wide there is no horizontal scroll, the first path card is visible without scrolling, and the roadmap has a snap track with previous/next buttons.
    - Arrow, Home and End keys move between roadmap weeks.
  - **Motion:**
    - With animation frames stepped manually, the logo squashes to about 0.95 on scroll down, stretches more lightly to about 1.03 on scroll up, stays within the cap on a hard fling, and settles back to an untransformed state.
    - With `prefers-reduced-motion` forced through a `matchMedia` override, no animation frames are requested. The bubbles render once and stay still, and the logo does not distort.

These were not checked:

- A real OS-level reduced-motion setting. The CSS side (static aurora, no entrance animation) relies on the `prefers-reduced-motion` media query.
- Real touch-swipe gestures on a phone.
- Real browsers with WebGL disabled. The fallback was exercised through `?nowebgl`.

- **Career paths (second round), in the browser:**
  - The Data Analyst demo learner showed 43%. Raising SQL to 4 gave 65%. Changing 6 → 12 h/week cut the plan from 11 to 6 weeks.
  - Marking a step complete updated the path's progress on the home page.
  - App Developer → Dart → "Test my Dart level" opened setup with Dart preselected, and the test ran on Dart questions.
  - Node-map keyboard navigation (arrows, Home, End) works.
  - At 375 px wide: no horizontal scroll, and the step chips don't overlap the next node.
  - Bubble popping: a click on a bubble popped it, while clicks on the wordmark or empty space did not. The burst animation itself wasn't observed, because the test browser was hidden and rendered almost no frames.

- **Third round (Beginner fix, new paths, footer), as a tester:**
  - **Bug fixed:** Beginner went straight to a Python plan without asking which language. It now opens a picker with all 14 languages plus a “What do you want to build?” recommendation.
  - Picking C++ gave a C++-only plan: a C++ setup task, C++ starter links and C++ quizzes. Switching to Rust from the plan page kept the C++ progress. `test-logic` checks all 14 beginner plans.
  - The career-paths page has category filters (All 23, Software & web 9, Data & AI 4, Core engineering 10), a search box and an empty state. All 161 resource links were re-checked.
  - The footer has Start, Career paths and Free learning columns and a “Back to top” button. Its Start links ask before discarding a test in progress.
  - **Bugs found and fixed in this pass:**
    - A crash when moving from a long path's last step to a shorter path.
    - A stale “Test my level” language when changing steps.
    - Background light layers drawn over page text.
    - Lower-cased acronyms (“dsa”) in Beginner text.
    - Scroll-reveal cards staying hidden after a fast jump.
  - At 375 px, home, Beginner, paths, path detail, plan and survey have no horizontal scroll.

## Notes

- Progress is stored in this browser's `localStorage` only (key `skilly:v1`). Missing, outdated or malformed data is discarded on load.
- The bubble canvas is `aria-hidden`, ignores clicks, pauses when the hero is offscreen or the tab is hidden, caps pixel density (1.5× on phones, 2× otherwise) and disposes its GPU resources when the hero unmounts.
- The logos inside the bubbles are simplified versions of the GitHub, GeeksforGeeks, VS Code, Python, JavaScript and React marks, used decoratively. Those trademarks belong to their owners.
