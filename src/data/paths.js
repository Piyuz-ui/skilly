// Career paths ("whole courses"): step-by-step roadmaps with overviews, skill
// chips, free resources, a mini-project per step and a SkillBridge-style
// skill-gap planner.
//
// Sources
// • Data Analyst, Web Developer and ML Engineer come from the SkillBridge
//   prototype (AARAMBHATHON Round 1): its role targets, skill hours per level,
//   prerequisites, free resource links and mini-projects. Skill weights are
//   SkillBridge's: the share of the role's 10 sampled job posts that name the
//   skill. Those posts are SYNTHETIC samples, so weights are illustrative.
// • AI Engineer, Backend Developer, App Developer and DSA & Interviews are
//   Skilly additions. Their hours and targets are Skilly estimates and their
//   skills are weighted equally (no job-post sample).
// Every URL below was checked to load (HTTP 200) when this file was written.

import { ENG_SKILLS, ENG_PATHS } from './paths-engineering.js';

const R = (title, url, kind) => ({ title, url, kind });
const RM = (slug, name) => R(`roadmap.sh: ${name} roadmap`, `https://roadmap.sh/${slug}`, 'Roadmap');

// Planner skills: hours of study per level, prerequisites.
const BASE_SKILLS = {
  // SkillBridge skills (hours and prerequisites from skills.json)
  sql: { name: 'SQL', hours: 6, pre: [] },
  excel: { name: 'Excel', hours: 4, pre: [] },
  python: { name: 'Python', hours: 8, pre: [] },
  powerbi: { name: 'Power BI', hours: 5, pre: [] },
  statistics: { name: 'Statistics', hours: 6, pre: [] },
  html_css: { name: 'HTML & CSS', hours: 5, pre: [] },
  javascript: { name: 'JavaScript', hours: 8, pre: ['html_css'] },
  react: { name: 'React', hours: 7, pre: ['javascript'] },
  git: { name: 'Git', hours: 3, pre: [] },
  ml: { name: 'Machine Learning', hours: 10, pre: ['python', 'statistics'] },
  apis: { name: 'REST APIs', hours: 4, pre: [] },
  // Skilly estimates
  deep_learning: { name: 'Deep Learning', hours: 10, pre: ['ml'] },
  llm: { name: 'LLMs & Prompting', hours: 6, pre: ['python'] },
  rag_agents: { name: 'RAG & Agents', hours: 8, pre: ['llm'] },
  mlops: { name: 'MLOps & Deployment', hours: 6, pre: ['git'] },
  backend_lang: { name: 'Backend language', hours: 8, pre: [] },
  security: { name: 'Auth & Security', hours: 4, pre: ['apis'] },
  docker: { name: 'Docker', hours: 4, pre: [] },
  testing_ci: { name: 'Testing & CI', hours: 4, pre: ['git'] },
  system_design: { name: 'System Design', hours: 6, pre: ['apis', 'sql'] },
  mobile_lang: { name: 'Kotlin / Swift / Dart', hours: 8, pre: [] },
  mobile_ui: { name: 'Mobile UI', hours: 7, pre: ['mobile_lang'] },
  app_data: { name: 'State & local data', hours: 5, pre: ['mobile_ui'] },
  publishing: { name: 'Publishing apps', hours: 3, pre: [] },
  dsa_lang: { name: 'Interview language', hours: 6, pre: [] },
  complexity: { name: 'Big-O analysis', hours: 3, pre: [] },
  linear_ds: { name: 'Arrays, lists & hashing', hours: 6, pre: ['complexity'] },
  trees_graphs: { name: 'Trees & graphs', hours: 8, pre: ['linear_ds'] },
  dp: { name: 'Dynamic programming', hours: 8, pre: ['linear_ds'] },
  interviews: { name: 'Mock interviews', hours: 4, pre: [] },
};

const BASE_PATHS = [
  {
    id: 'data-analyst', category: 'data', title: 'Data Analyst', icon: '📊', source: 'skillbridge', accent: '#7fc8f8',
    summary: 'Turns raw data into answers the business can act on.',
    // target level (1–5) and weight per skill — SkillBridge roles.json + job-post weights
    targets: { sql: [4, 0.9], excel: [3, 0.8], python: [4, 0.7], powerbi: [3, 0.6], statistics: [3, 0.5] },
    demo: { ratings: { python: 2, sql: 1, excel: 3, statistics: 1, powerbi: 0 }, hours: 6 },
    steps: [
      {
        id: 'excel', title: 'Spreadsheets & Excel', skill: 'excel',
        overview: 'Formulas, cell references and tidy tables. PivotTables to summarise, lookups (VLOOKUP/XLOOKUP) to join data, and charts that answer one question each. Power Query for repeatable cleaning.',
        chips: ['Formulas & references', 'PivotTables', 'XLOOKUP', 'Charts', 'Power Query'],
        resources: [R('Microsoft Excel help and learning', 'https://support.microsoft.com/en-us/excel/', 'Official docs'), R('Excel Easy tutorials', 'https://www.excel-easy.com/', 'Free course')],
        project: 'Build a monthly sales summary with a PivotTable, one lookup and one chart.',
      },
      {
        id: 'sql', title: 'SQL & Databases', skill: 'sql', lang: 'sql',
        overview: 'SELECT, filtering and sorting, then joins across tables, GROUP BY with aggregates, subqueries and CTEs, and window functions for running totals and rankings. The most-requested skill in the sampled analyst posts.',
        chips: ['SELECT & WHERE', 'Joins', 'GROUP BY & HAVING', 'CTEs', 'Window functions'],
        resources: [R('SQLBolt interactive lessons', 'https://sqlbolt.com/', 'Interactive'), R('Kaggle Learn: Intro to SQL', 'https://www.kaggle.com/learn/intro-to-sql', 'Free course'), R('Kaggle Learn: Advanced SQL', 'https://www.kaggle.com/learn/advanced-sql', 'Free course'), RM('sql', 'SQL')],
        project: 'Answer five business questions on a public sales dataset using joins, GROUP BY and one window function.',
      },
      {
        id: 'python', title: 'Python for Analysis', skill: 'python', lang: 'python',
        overview: 'Core Python (types, loops, functions), then pandas for loading, cleaning, reshaping and joining data, NumPy for vectorised maths and Matplotlib for quick charts — all in a notebook.',
        chips: ['Python basics', 'pandas DataFrames', 'Cleaning & reshaping', 'NumPy', 'Matplotlib'],
        resources: [R('Kaggle Learn: Python', 'https://www.kaggle.com/learn/python', 'Free course'), R('Kaggle Learn: Pandas', 'https://www.kaggle.com/learn/pandas', 'Free course'), R('The Python Tutorial (official)', 'https://docs.python.org/3/tutorial/', 'Official docs'), R('pandas: Getting started', 'https://pandas.pydata.org/docs/getting_started/index.html', 'Official docs')],
        project: 'Clean a messy CSV with pandas and report three findings.',
      },
      {
        id: 'statistics', title: 'Statistics', skill: 'statistics',
        overview: 'Descriptive statistics (mean, median, spread), probability and distributions, sampling, confidence intervals and hypothesis tests — enough to run and explain an A/B test honestly.',
        chips: ['Descriptive stats', 'Distributions', 'Confidence intervals', 'Hypothesis tests', 'A/B testing'],
        resources: [R('Khan Academy: Statistics and probability', 'https://www.khanacademy.org/math/statistics-probability', 'Free course'), R('SWAYAM / NPTEL courses', 'https://swayam.gov.in/', 'Free course')],
        project: 'Run an A/B comparison on sample data and explain the result in plain language.',
      },
      {
        id: 'powerbi', title: 'Power BI Dashboards', skill: 'powerbi',
        overview: 'Import and model data, write DAX measures, and design an interactive report with slicers and KPI cards that a manager can read in one minute.',
        chips: ['Data model', 'DAX measures', 'Slicers', 'KPI cards', 'Publishing'],
        resources: [R('Microsoft Learn: Power BI training', 'https://learn.microsoft.com/en-us/training/powerplatform/power-bi', 'Official docs'), RM('power-bi', 'Power BI')],
        project: 'Publish a one-page dashboard with three visuals and one DAX measure.',
      },
      {
        id: 'capstone', title: 'Portfolio Capstone', capstone: true,
        overview: 'Combine every step: pull data with SQL, clean it in Python, test one hypothesis and present the story in a dashboard. Write a one-page README explaining the question, method and limits.',
        chips: ['End-to-end analysis', 'Storytelling', 'README & portfolio'],
        resources: [RM('data-analyst', 'Data Analyst'), R('CS50’s Introduction to Programming with Python', 'https://cs50.harvard.edu/python/', 'Free course')],
        project: 'Publish one end-to-end analysis on GitHub with the SQL, notebook and dashboard screenshots.',
      },
    ],
  },
  {
    id: 'web-developer', category: 'software', title: 'Web Developer', icon: '🌐', source: 'skillbridge', accent: '#f7df1e',
    summary: 'Builds the pages and interfaces people use in the browser.',
    targets: { html_css: [4, 0.9], javascript: [4, 1.0], react: [3, 0.7], git: [3, 0.6], apis: [3, 0.5] },
    steps: [
      {
        id: 'html', title: 'HTML & CSS', skill: 'html_css',
        overview: 'Semantic HTML that screen readers understand, the CSS box model, Flexbox and Grid for layout, and responsive design that works from phone to desktop.',
        chips: ['Semantic HTML', 'Box model', 'Flexbox', 'Grid', 'Responsive', 'Accessibility'],
        resources: [R('MDN: Learn web development', 'https://developer.mozilla.org/en-US/docs/Learn_web_development', 'Official docs'), R('freeCodeCamp: Responsive Web Design', 'https://www.freecodecamp.org/learn/', 'Free course'), R('web.dev: Learn CSS', 'https://web.dev/learn/css', 'Free course'), R('web.dev: Learn Accessibility', 'https://web.dev/learn/accessibility', 'Free course')],
        project: 'Rebuild a landing page from a screenshot, responsive down to phone width.',
      },
      {
        id: 'js', title: 'JavaScript', skill: 'javascript', lang: 'javascript',
        overview: 'Variables, functions and closures, arrays and objects, the DOM and events, then async code with promises, async/await and fetch.',
        chips: ['Functions & closures', 'Arrays & objects', 'DOM & events', 'Promises', 'fetch'],
        resources: [R('The Modern JavaScript Tutorial', 'https://javascript.info/', 'Free course'), R('MDN JavaScript Guide', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide', 'Official docs'), RM('javascript', 'JavaScript')],
        project: 'Build a to-do list that saves tasks and filters them without a framework.',
      },
      {
        id: 'git', title: 'Git & GitHub', skill: 'git',
        overview: 'Commits, branches, merges and resolving conflicts locally; pull requests and reviews on GitHub.',
        chips: ['Commits', 'Branches', 'Merge conflicts', 'Pull requests'],
        resources: [R('Pro Git book', 'https://git-scm.com/book/en/v2', 'Book'), R('Learn Git Branching', 'https://learngitbranching.js.org/', 'Interactive'), R('GitHub: Hello World', 'https://docs.github.com/en/get-started/using-github/hello-world', 'Official docs')],
        project: 'Publish a project on GitHub with a feature branch, a merge and a resolved conflict.',
      },
      {
        id: 'react', title: 'React', skill: 'react', lang: 'typescript',
        overview: 'Components and JSX, props and state, hooks (useState, useEffect), lists and forms, and splitting an app into reusable pieces. TypeScript adds safety as apps grow.',
        chips: ['Components & JSX', 'Props & state', 'Hooks', 'Forms', 'TypeScript'],
        resources: [R('React: Learn (official)', 'https://react.dev/learn', 'Official docs'), R('TypeScript Handbook', 'https://www.typescriptlang.org/docs/handbook/intro.html', 'Official docs'), RM('react', 'React')],
        project: 'Turn the to-do list into React components with state and props.',
      },
      {
        id: 'apis', title: 'REST APIs', skill: 'apis',
        overview: 'How HTTP works: methods, status codes, headers and JSON. Call APIs from the browser, then build a small one yourself.',
        chips: ['HTTP methods', 'Status codes', 'JSON', 'CORS', 'Building endpoints'],
        resources: [R('MDN: An overview of HTTP', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview', 'Official docs'), R('Flask quickstart', 'https://flask.palletsprojects.com/en/stable/quickstart/', 'Official docs'), R('Express: Hello world', 'https://expressjs.com/en/starter/hello-world/', 'Official docs'), RM('api-design', 'API Design')],
        project: 'Build a small API with three endpoints and call it from a web page.',
      },
      {
        id: 'capstone', title: 'Portfolio Capstone', capstone: true,
        overview: 'Ship a full small product: a React front end talking to your own API, deployed, with a README and a short demo video.',
        chips: ['Full-stack app', 'Deployment', 'README & demo'],
        resources: [RM('frontend', 'Frontend'), RM('full-stack', 'Full Stack'), R('CS50x', 'https://cs50.harvard.edu/x/', 'Free course')],
        project: 'Deploy a React + API app and link it from your GitHub profile.',
      },
    ],
  },
  {
    id: 'ml-engineer', category: 'data', title: 'ML Engineer', icon: '🤖', source: 'skillbridge', accent: '#c8a2ff',
    summary: 'Trains, evaluates and ships machine learning models.',
    targets: { python: [4, 1.0], ml: [4, 0.9], statistics: [4, 0.6], sql: [3, 0.5], git: [3, 0.5] },
    steps: [
      {
        id: 'python', title: 'Python & NumPy', skill: 'python', lang: 'python',
        overview: 'Fluent Python — functions, classes, comprehensions, generators — plus NumPy arrays and pandas for preparing data.',
        chips: ['Python OOP', 'Generators', 'NumPy', 'pandas'],
        resources: [R('Kaggle Learn: Python', 'https://www.kaggle.com/learn/python', 'Free course'), R('NumPy: Learn', 'https://numpy.org/learn/', 'Official docs'), R('The Python Tutorial (official)', 'https://docs.python.org/3/tutorial/', 'Official docs')],
        project: 'Clean a messy CSV with pandas and report three findings.',
      },
      {
        id: 'stats', title: 'Statistics & Probability', skill: 'statistics',
        overview: 'Distributions, expectation and variance, sampling, hypothesis tests, correlation and regression — the maths behind evaluating any model.',
        chips: ['Probability', 'Distributions', 'Hypothesis tests', 'Regression'],
        resources: [R('Khan Academy: Statistics and probability', 'https://www.khanacademy.org/math/statistics-probability', 'Free course'), R('SWAYAM / NPTEL courses', 'https://swayam.gov.in/', 'Free course')],
        project: 'Run an A/B comparison on sample data and explain the result in plain language.',
      },
      {
        id: 'sql', title: 'SQL for Data', skill: 'sql', lang: 'sql',
        overview: 'Pull training data yourself: joins, aggregates and window functions over real tables.',
        chips: ['Joins', 'Aggregates', 'Window functions'],
        resources: [R('Kaggle Learn: Intro to SQL', 'https://www.kaggle.com/learn/intro-to-sql', 'Free course'), R('SQLBolt interactive lessons', 'https://sqlbolt.com/', 'Interactive')],
        project: 'Build a feature table for a model with one SQL query.',
      },
      {
        id: 'ml', title: 'Machine Learning', skill: 'ml',
        overview: 'Supervised learning (linear and logistic regression, trees, ensembles), validation and overfitting, metrics like precision, recall and ROC-AUC, and unsupervised clustering — with scikit-learn.',
        chips: ['Regression', 'Trees & ensembles', 'Cross-validation', 'Precision / recall', 'Clustering'],
        resources: [R('Google Machine Learning Crash Course', 'https://developers.google.com/machine-learning/crash-course', 'Free course'), R('Kaggle Learn: Intro to Machine Learning', 'https://www.kaggle.com/learn/intro-to-machine-learning', 'Free course'), R('scikit-learn user guide', 'https://scikit-learn.org/stable/user_guide.html', 'Official docs'), RM('machine-learning', 'Machine Learning')],
        project: 'Train and evaluate a classifier on a public dataset; report precision, recall and one mistake analysis.',
      },
      {
        id: 'git', title: 'Git & Reproducibility', skill: 'git',
        overview: 'Version your code and experiments so results can be reproduced: branches, pull requests and tracked runs.',
        chips: ['Git workflow', 'Pull requests', 'Experiment tracking'],
        resources: [R('Pro Git book', 'https://git-scm.com/book/en/v2', 'Book'), R('MLflow documentation', 'https://mlflow.org/docs/latest/index.html', 'Official docs')],
        project: 'Publish a project on GitHub with a feature branch, a merge and a resolved conflict.',
      },
      {
        id: 'capstone', title: 'Ship a Model', capstone: true,
        overview: 'Wrap a trained model in an API, containerise it and write down how it was evaluated and where it fails.',
        chips: ['Model API', 'Docker', 'Model card'],
        resources: [R('FastAPI tutorial', 'https://fastapi.tiangolo.com/tutorial/', 'Official docs'), R('Docker: Get started', 'https://docs.docker.com/learn/', 'Official docs'), RM('mlops', 'MLOps')],
        project: 'Serve your classifier from a Docker container with a /predict endpoint.',
      },
    ],
  },
  {
    id: 'ai-engineer', category: 'data', title: 'AI Engineer (to Agentic AI)', icon: '🧠', source: 'skilly', accent: '#ec8ea4',
    summary: 'From Python and ML foundations to LLM apps, RAG and AI agents.',
    targets: { python: [4, 1], statistics: [3, 1], ml: [3, 1], deep_learning: [3, 1], llm: [4, 1], rag_agents: [4, 1], mlops: [3, 1] },
    steps: [
      {
        id: 'python', title: 'Python Programming', skill: 'python', lang: 'python',
        overview: 'Syntax, data types, OOP, file handling and exceptions; NumPy, pandas and Matplotlib for data work.',
        chips: ['Python OOP', 'Exceptions', 'NumPy & pandas', 'Matplotlib'],
        resources: [R('CS50’s Introduction to Programming with Python', 'https://cs50.harvard.edu/python/', 'Free course'), R('Kaggle Learn: Python', 'https://www.kaggle.com/learn/python', 'Free course'), R('Matplotlib tutorials', 'https://matplotlib.org/stable/tutorials/index.html', 'Official docs')],
        project: 'Analyse a public dataset in a notebook and chart three insights.',
      },
      {
        id: 'sql', title: 'SQL & Data', skill: 'sql', lang: 'sql',
        overview: 'Query relational data with joins, aggregates and window functions; know when a document store fits better.',
        chips: ['Joins', 'Window functions', 'NoSQL basics'],
        resources: [R('SQLBolt interactive lessons', 'https://sqlbolt.com/', 'Interactive'), R('PostgreSQL tutorial', 'https://www.postgresql.org/docs/current/tutorial.html', 'Official docs')],
        project: 'Design a small schema and answer five questions with SQL.',
      },
      {
        id: 'stats', title: 'Statistics & EDA', skill: 'statistics',
        overview: 'Descriptive and inferential statistics, distributions, and exploratory data analysis with feature engineering.',
        chips: ['Descriptive stats', 'Hypothesis tests', 'EDA', 'Feature engineering'],
        resources: [R('Khan Academy: Statistics and probability', 'https://www.khanacademy.org/math/statistics-probability', 'Free course')],
        project: 'Write an EDA report on a dataset, including missing-value handling.',
      },
      {
        id: 'ml', title: 'Machine Learning', skill: 'ml',
        overview: 'Regression, classification, ensembles, regularisation, evaluation metrics and clustering.',
        chips: ['Supervised learning', 'XGBoost & ensembles', 'Regularisation', 'Metrics'],
        resources: [R('Google Machine Learning Crash Course', 'https://developers.google.com/machine-learning/crash-course', 'Free course'), R('scikit-learn user guide', 'https://scikit-learn.org/stable/user_guide.html', 'Official docs')],
        project: 'Compare three models on one dataset and justify your pick.',
      },
      {
        id: 'dl', title: 'Deep Learning', skill: 'deep_learning',
        overview: 'Neural networks and backpropagation, optimisers, CNNs for images, sequence models, and the attention mechanism behind Transformers — in PyTorch or TensorFlow.',
        chips: ['Backpropagation', 'CNNs', 'Attention', 'Transformers', 'PyTorch'],
        resources: [R('Practical Deep Learning (fast.ai)', 'https://course.fast.ai/', 'Free course'), R('PyTorch tutorials', 'https://docs.pytorch.org/tutorials/', 'Official docs'), R('Kaggle Learn: Intro to Deep Learning', 'https://www.kaggle.com/learn/intro-to-deep-learning', 'Free course'), R('Stanford CS231n notes', 'https://cs231n.github.io/', 'Free course'), R('Stanford CS224n (NLP)', 'https://web.stanford.edu/class/cs224n/', 'Free course')],
        project: 'Fine-tune a pretrained image model on a small dataset of your own.',
      },
      {
        id: 'llm', title: 'LLMs & Prompting', skill: 'llm',
        overview: 'How large language models work, tokens and context windows, prompt-engineering techniques, structured outputs, and calling model APIs from code.',
        chips: ['Tokens & context', 'Prompt design', 'Structured output', 'Model APIs'],
        resources: [R('Hugging Face LLM Course', 'https://huggingface.co/learn/llm-course/chapter1/1', 'Free course'), R('Claude prompt engineering guide', 'https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview', 'Official docs'), R('DeepLearning.AI courses', 'https://www.deeplearning.ai/courses', 'Free course'), RM('prompt-engineering', 'Prompt Engineering')],
        project: 'Build a CLI that turns messy notes into structured JSON with an LLM.',
      },
      {
        id: 'rag', title: 'RAG & AI Agents', skill: 'rag_agents',
        overview: 'Embeddings and vector search, retrieval-augmented generation, tool use, and agent loops that plan, act and check their own work — with evaluation so you know it works.',
        chips: ['Embeddings', 'Vector search', 'RAG', 'Tool use', 'Agent loops', 'Evals'],
        resources: [R('LangChain docs', 'https://docs.langchain.com/oss/python/langchain/overview', 'Official docs'), RM('ai-agents', 'AI Agents'), RM('ai-engineer', 'AI Engineer')],
        project: 'Build a RAG assistant over your course notes that cites its sources.',
      },
      {
        id: 'mlops', title: 'MLOps & Deployment', skill: 'mlops',
        overview: 'Docker, CI/CD with GitHub Actions, experiment tracking with MLflow, serving with FastAPI, and monitoring in production.',
        chips: ['Docker', 'GitHub Actions', 'MLflow', 'FastAPI', 'Monitoring'],
        resources: [R('Docker: Get started', 'https://docs.docker.com/learn/', 'Official docs'), R('GitHub Actions docs', 'https://docs.github.com/en/actions', 'Official docs'), R('MLflow documentation', 'https://mlflow.org/docs/latest/index.html', 'Official docs'), RM('mlops', 'MLOps')],
        project: 'Deploy your RAG assistant with CI that runs a small eval on every push.',
      },
    ],
  },
  {
    id: 'backend', category: 'software', title: 'Backend Developer', icon: '🗄️', source: 'skilly', accent: '#86d9ae',
    summary: 'Designs APIs, databases and services that stay up under load.',
    targets: { backend_lang: [4, 1], sql: [4, 1], apis: [4, 1], security: [3, 1], docker: [3, 1], testing_ci: [3, 1], git: [3, 1], system_design: [3, 1] },
    steps: [
      {
        id: 'lang', title: 'Pick a Backend Language', skill: 'backend_lang', lang: 'java', langOptions: ['java', 'go', 'python', 'javascript', 'csharp', 'kotlin', 'rust', 'php'],
        overview: 'Go deep on one language — Java, Go, Python, Node.js, C# or Kotlin: types, collections, error handling, concurrency basics and the standard library.',
        chips: ['Types & collections', 'Error handling', 'Concurrency', 'Standard library'],
        resources: [R('Learn Java (dev.java)', 'https://dev.java/learn/', 'Official docs'), R('A Tour of Go', 'https://go.dev/tour/', 'Interactive'), R('Node.js: Introduction', 'https://nodejs.org/learn/getting-started/introduction-to-nodejs', 'Official docs'), R('C# documentation', 'https://learn.microsoft.com/en-us/dotnet/csharp/', 'Official docs')],
        project: 'Write a CLI that parses a log file and prints the top 10 errors.',
      },
      {
        id: 'sql', title: 'Databases & SQL', skill: 'sql', lang: 'sql',
        overview: 'Relational modelling, keys and normalisation, joins, indexes and transactions; when to reach for Redis or a document store.',
        chips: ['Schema design', 'Indexes', 'Transactions', 'Redis'],
        resources: [R('PostgreSQL tutorial', 'https://www.postgresql.org/docs/current/tutorial.html', 'Official docs'), R('Redis docs', 'https://redis.io/docs/latest/develop/', 'Official docs'), RM('sql', 'SQL')],
        project: 'Design a schema for a library app and index the three hottest queries.',
      },
      {
        id: 'apis', title: 'REST APIs', skill: 'apis',
        overview: 'Resource design, HTTP semantics, pagination, validation and versioning.',
        chips: ['Resource design', 'Status codes', 'Pagination', 'Validation'],
        resources: [R('MDN: An overview of HTTP', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview', 'Official docs'), R('REST API tutorial', 'https://restfulapi.net/', 'Free course'), R('FastAPI tutorial', 'https://fastapi.tiangolo.com/tutorial/', 'Official docs'), RM('api-design', 'API Design')],
        project: 'Build a CRUD API for the library app with pagination and validation.',
      },
      {
        id: 'security', title: 'Auth & Security', skill: 'security',
        overview: 'Password hashing, sessions vs tokens, JWT, OAuth basics and the OWASP Top 10.',
        chips: ['Hashing', 'JWT', 'OAuth', 'OWASP Top 10'],
        resources: [R('OWASP Top Ten', 'https://owasp.org/projects/top-ten', 'Official docs'), R('Introduction to JWT', 'https://www.jwt.io/introduction', 'Official docs')],
        project: 'Add sign-up, login and role-based access to your API.',
      },
      {
        id: 'docker', title: 'Docker & Deployment', skill: 'docker',
        overview: 'Images, containers, volumes and Compose; deploying to a cloud host; a first look at Kubernetes.',
        chips: ['Dockerfile', 'Compose', 'Cloud deploy', 'Kubernetes basics'],
        resources: [R('Docker: Get started', 'https://docs.docker.com/learn/', 'Official docs'), R('Kubernetes basics', 'https://kubernetes.io/docs/tutorials/kubernetes-basics/', 'Official docs'), RM('docker', 'Docker')],
        project: 'Run the API and its database together with Docker Compose.',
      },
      {
        id: 'testing', title: 'Testing & CI', skill: 'testing_ci',
        overview: 'Unit and integration tests, test databases, and a CI pipeline that runs on every pull request.',
        chips: ['Unit tests', 'Integration tests', 'GitHub Actions'],
        resources: [R('GitHub Actions docs', 'https://docs.github.com/en/actions', 'Official docs'), R('Pro Git book', 'https://git-scm.com/book/en/v2', 'Book')],
        project: 'Reach 80% test coverage and block merges when CI fails.',
      },
      {
        id: 'design', title: 'System Design', skill: 'system_design',
        overview: 'Caching, queues, load balancing, replication and sharding; reasoning about trade-offs out loud.',
        chips: ['Caching', 'Queues', 'Load balancing', 'Scaling databases'],
        resources: [R('System Design Primer', 'https://github.com/donnemartin/system-design-primer', 'Book'), RM('system-design', 'System Design'), RM('backend', 'Backend')],
        project: 'Write a one-page design for a URL shortener serving 1,000 requests per second.',
      },
    ],
  },
  {
    id: 'app-developer', category: 'software', title: 'App Developer', icon: '📱', source: 'skilly', accent: '#ffb36b',
    summary: 'Builds native and cross-platform mobile apps for Android and iOS.',
    targets: { mobile_lang: [4, 1], mobile_ui: [4, 1], app_data: [3, 1], apis: [3, 1], git: [3, 1], publishing: [2, 1] },
    steps: [
      {
        id: 'lang', title: 'Kotlin, Swift or Dart', skill: 'mobile_lang', lang: 'kotlin', langOptions: ['kotlin', 'swift', 'dart'],
        overview: 'Kotlin for Android, Swift for iOS, or Dart for Flutter on both. Null safety, classes, collections and async code.',
        chips: ['Null safety', 'Classes & data types', 'Collections', 'Async / coroutines'],
        resources: [R('Kotlin: Get started', 'https://kotlinlang.org/docs/getting-started.html', 'Official docs'), R('The Swift Programming Language', 'https://docs.swift.org/latest/documentation/the-swift-programming-language/', 'Book'), R('Dart language tour', 'https://dart.dev/language', 'Official docs')],
        project: 'Write a tip-calculator in the console before touching any UI.',
      },
      {
        id: 'ui', title: 'Mobile UI', skill: 'mobile_ui',
        overview: 'Declarative UI with Jetpack Compose, SwiftUI or Flutter widgets: layout, lists, navigation and theming.',
        chips: ['Layouts', 'Lists', 'Navigation', 'Theming'],
        resources: [R('Android Basics with Compose', 'https://developer.android.com/courses/android-basics-compose/course', 'Free course'), R('SwiftUI tutorials', 'https://developer.apple.com/tutorials/swiftui', 'Official docs'), R('Flutter: Install & get started', 'https://docs.flutter.dev/install', 'Official docs'), RM('android', 'Android')],
        project: 'Build a two-screen app with a list and a detail view.',
      },
      {
        id: 'data', title: 'State & Local Data', skill: 'app_data',
        overview: 'Managing state, persisting data on the device, and handling the app lifecycle.',
        chips: ['State management', 'Local storage', 'Lifecycle'],
        resources: [RM('ios', 'iOS'), RM('flutter', 'Flutter')],
        project: 'Make the list app save and restore its data between launches.',
      },
      {
        id: 'apis', title: 'Networking & APIs', skill: 'apis',
        overview: 'Calling REST APIs, parsing JSON, loading and error states, and caching.',
        chips: ['HTTP clients', 'JSON parsing', 'Loading states', 'Caching'],
        resources: [R('MDN: An overview of HTTP', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview', 'Official docs')],
        project: 'Show live data from a public API with pull-to-refresh.',
      },
      {
        id: 'git', title: 'Git & Collaboration', skill: 'git',
        overview: 'Branches, pull requests and code review for app projects.',
        chips: ['Branches', 'Pull requests', 'Code review'],
        resources: [R('Learn Git Branching', 'https://learngitbranching.js.org/', 'Interactive')],
        project: 'Ship one feature through a pull request with a reviewer.',
      },
      {
        id: 'publish', title: 'Publishing', skill: 'publishing',
        overview: 'App icons, screenshots, signing, store listings and the review guidelines that most often cause rejections.',
        chips: ['Signing', 'Store listing', 'Review guidelines'],
        resources: [R('App Store Review Guidelines', 'https://developer.apple.com/app-store/review/guidelines/', 'Official docs')],
        project: 'Prepare a complete store listing for your app, even if you don’t submit it.',
      },
    ],
  },
  {
    id: 'dsa', category: 'software', title: 'DSA & Coding Interviews', icon: '🧩', source: 'skilly', accent: '#9fb4ff',
    summary: 'Data structures, algorithms and the problem-solving habits interviews test.',
    targets: { dsa_lang: [4, 1], complexity: [4, 1], linear_ds: [4, 1], trees_graphs: [3, 1], dp: [3, 1], interviews: [3, 1] },
    steps: [
      {
        id: 'lang', title: 'Your Interview Language', skill: 'dsa_lang', lang: 'cpp', langOptions: ['cpp', 'java', 'python', 'javascript', 'go'],
        overview: 'Pick C++, Java or Python and master its collections, sorting, strings and I/O.',
        chips: ['Collections', 'Sorting', 'Strings', 'Fast I/O'],
        resources: [R('LearnCpp', 'https://www.learncpp.com/', 'Free course'), R('Learn Java (dev.java)', 'https://dev.java/learn/', 'Official docs'), R('The Python Tutorial (official)', 'https://docs.python.org/3/tutorial/', 'Official docs')],
        project: 'Solve 10 easy problems in your chosen language.',
      },
      {
        id: 'bigo', title: 'Complexity (Big-O)', skill: 'complexity',
        overview: 'Time and space complexity, best/average/worst cases, and recognising common growth rates.',
        chips: ['Big-O', 'Space complexity', 'Amortised cost'],
        resources: [R('Big-O cheat sheet', 'https://www.bigocheatsheet.com/', 'Official docs'), R('MIT 6.006 Introduction to Algorithms', 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/', 'Free course')],
        project: 'Annotate 10 solved problems with their time and space complexity.',
      },
      {
        id: 'linear', title: 'Arrays, Lists & Hashing', skill: 'linear_ds',
        overview: 'Two pointers, sliding window, prefix sums, hash maps, stacks, queues and linked lists.',
        chips: ['Two pointers', 'Sliding window', 'Hash maps', 'Stacks & queues', 'Linked lists'],
        resources: [R('NeetCode roadmap', 'https://neetcode.io/roadmap', 'Free course'), R('VisuAlgo', 'https://visualgo.net/en', 'Interactive'), R('GeeksforGeeks DSA tutorial', 'https://www.geeksforgeeks.org/dsa/dsa-tutorial-learn-data-structures-and-algorithms/', 'Free course')],
        project: 'Solve 25 problems across these patterns and note the trick for each.',
      },
      {
        id: 'trees', title: 'Trees & Graphs', skill: 'trees_graphs',
        overview: 'Binary trees, BSTs, heaps, tries, BFS/DFS, topological sort and shortest paths.',
        chips: ['Tree traversals', 'Heaps', 'BFS / DFS', 'Topological sort', 'Dijkstra'],
        resources: [R('CP-Algorithms', 'https://cp-algorithms.com/', 'Book'), R('VisuAlgo', 'https://visualgo.net/en', 'Interactive'), RM('datastructures-and-algorithms', 'Data Structures & Algorithms')],
        project: 'Implement BFS, DFS and Dijkstra from scratch and test them.',
      },
      {
        id: 'dp', title: 'Dynamic Programming', skill: 'dp',
        overview: 'Recursion with memoisation, tabulation, and the classic 1-D and 2-D DP patterns.',
        chips: ['Memoisation', 'Tabulation', 'Knapsack', 'LIS / LCS'],
        resources: [R('NeetCode roadmap', 'https://neetcode.io/roadmap', 'Free course'), R('CP-Algorithms', 'https://cp-algorithms.com/', 'Book')],
        project: 'Solve 15 DP problems and write the recurrence before coding each.',
      },
      {
        id: 'mock', title: 'Mock Interviews', skill: 'interviews',
        overview: 'Talking through your approach, testing edge cases out loud and managing time in a 45-minute interview.',
        chips: ['Think aloud', 'Edge cases', 'Time management'],
        resources: [R('NeetCode roadmap', 'https://neetcode.io/roadmap', 'Free course')],
        project: 'Do three timed mock interviews with a friend and swap feedback.',
      },
    ],
  },
];

export const SKILLS = { ...BASE_SKILLS, ...ENG_SKILLS };
export const PATHS = [...BASE_PATHS, ...ENG_PATHS];
export const CATEGORIES = [
  { id: 'all', label: 'All paths' },
  { id: 'software', label: 'Software & web' },
  { id: 'data', label: 'Data & AI' },
  { id: 'core', label: 'Core engineering' },
];
export const PATH_BY_ID = Object.fromEntries(PATHS.map((p) => [p.id, p]));
