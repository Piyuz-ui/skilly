// Study notes for career-path steps. Format per step:
//   w: weeks → [title, [learn…], [build/do…]]
//   k: key concepts → [term, one-line explanation]
//   m: common mistakes
//   q: self-check questions
// Software paths, part A: Web, Backend, App, DSA.

export default {
  'web-developer': {
    html: {
      w: [
        ['Structure with semantic HTML', ['Document skeleton: doctype, head, body, meta viewport', 'Semantic tags: header, nav, main, section, article, footer', 'Forms: label + input pairs, button types, required/validation attributes', 'Links, images with alt text, lists and tables (only for tabular data)'], ['Rebuild a simple article page using only semantic tags', 'Make a contact form that works with keyboard only']],
        ['Layout and styling with CSS', ['Box model: content, padding, border, margin; box-sizing: border-box', 'Flexbox for one-direction layouts, Grid for two-dimensional layouts', 'Responsive design: relative units, media queries, mobile-first', 'Cascade and specificity; custom properties (CSS variables)'], ['Build a responsive landing page that works at 360 px and 1440 px', 'Create a colour theme with CSS variables']],
      ],
      k: [['Semantic HTML', 'Tags that describe meaning (nav, main) so browsers, search engines and screen readers understand the page.'], ['Box model', 'Every element is a box: content + padding + border + margin.'], ['Flexbox vs Grid', 'Flexbox arranges items in a row or column; Grid places items in rows and columns at once.'], ['Media query', 'A CSS rule that applies only at certain screen sizes, e.g. @media (min-width: 768px).']],
      m: ['Using div for everything instead of semantic tags', 'Fixed pixel widths that break on phones', 'Images without alt text and inputs without labels'],
      q: ['When would you choose Grid over Flexbox?', 'What does box-sizing: border-box change?', 'Why should every form input have a label?'],
    },
    js: {
      w: [
        ['Language core', ['Variables (let/const), types, equality (=== vs ==)', 'Functions, arrow functions, scope and closures', 'Arrays and objects; map, filter, reduce', 'Destructuring, spread, template literals'], ['Solve 10 small problems on arrays and strings', 'Write a function that groups an array of objects by a key']],
        ['JavaScript in the browser', ['DOM: querySelector, events, adding/removing elements', 'Asynchronous code: callbacks, Promises, async/await', 'fetch() to call an API and handle errors', 'The event loop: why long tasks freeze the page'], ['Build a to-do list that saves to localStorage', 'Fetch data from a public API and render it with loading and error states']],
      ],
      k: [['Closure', 'A function that remembers variables from where it was created.'], ['Promise', 'An object for a value that arrives later; await pauses until it settles.'], ['Event loop', 'JS runs one task at a time; async callbacks wait in a queue.'], ['Strict equality', '=== compares value and type, avoiding surprising conversions.']],
      m: ['Forgetting to await a Promise, then using undefined data', 'Mutating arrays/objects when a copy was intended', 'Not handling fetch errors or non-200 responses'],
      q: ['What does [10, 1, 2].sort() return and why?', 'What is the difference between map and forEach?', 'How do you run three fetches in parallel and wait for all?'],
    },
    git: {
      w: [
        ['Everyday Git', ['Repository, working tree, staging area, commit', 'git status, add, commit, log, diff', 'Writing clear commit messages', '.gitignore for build output and secrets'], ['Put a past project under Git with 5+ meaningful commits', 'Push it to a new GitHub repository']],
        ['Branches and collaboration', ['Branches: create, switch, merge', 'Resolving merge conflicts', 'Pull requests and code review on GitHub', 'GitHub Pages or Netlify for deploying a static site'], ['Make a feature branch, open a PR, merge it', 'Deliberately cause and resolve a merge conflict']],
      ],
      k: [['Commit', 'A saved snapshot of your project with a message.'], ['Branch', 'A movable pointer to a line of commits, for working in isolation.'], ['Merge conflict', 'Two branches changed the same lines; you choose the final version.'], ['Pull request', 'A request to merge a branch, used for review and discussion.']],
      m: ['Committing secrets like API keys or .env files', 'One huge commit with “update” as the message', 'Working directly on main for every change'],
      q: ['What is the staging area for?', 'How do you undo the last commit but keep the changes?', 'What belongs in .gitignore?'],
    },
    react: {
      w: [
        ['Components and state', ['JSX and components as functions', 'Props down, events up', 'useState for local state; lists with keys', 'Conditional rendering'], ['Rebuild your to-do app in React', 'Split it into at least 4 components']],
        ['Effects, data and routing', ['useEffect for side effects and cleanup', 'Fetching data with loading/error states', 'Lifting state up and context for shared state', 'Client-side routing basics'], ['Build a two-page app (list + detail) with routing', 'Add a search box that filters fetched data']],
      ],
      k: [['Component', 'A function that returns UI for some inputs (props).'], ['State', 'Data that changes over time and triggers a re-render.'], ['Key', 'A stable id that helps React track list items between renders.'], ['Effect', 'Code that syncs a component with something outside React (API, timer).']],
      m: ['Using array index as key in lists that reorder', 'Fetching in useEffect without a dependency array, causing loops', 'Mutating state directly instead of setting a new value'],
      q: ['Why must state updates create new objects/arrays?', 'When does a useEffect cleanup run?', 'What problem does context solve?'],
    },
    apis: {
      w: [
        ['Consuming REST APIs', ['HTTP methods: GET, POST, PUT/PATCH, DELETE', 'Status codes: 2xx, 4xx, 5xx and what each means', 'JSON request/response bodies and headers', 'Authentication with API keys and tokens'], ['Call a public API with search and pagination', 'Show friendly messages for 404 and 500 errors']],
        ['Building a small API', ['Routes and handlers in Node/Express (or similar)', 'Validating input and returning proper status codes', 'CORS: why browsers block cross-origin calls', 'Storing data in a simple database'], ['Build a CRUD API for notes and connect your React app to it', 'Document the endpoints in a README']],
      ],
      k: [['REST', 'An API style where URLs name resources and HTTP methods act on them.'], ['Status code', 'A 3-digit number saying how the request went (200 OK, 404 Not Found).'], ['Idempotent', 'Calling it twice has the same effect as once (GET, PUT, DELETE).'], ['CORS', 'Browser rule that a server must allow requests from other origins.']],
      m: ['Returning 200 for errors', 'Putting secret keys in frontend code', 'No input validation on POST bodies'],
      q: ['PUT vs PATCH: what is the difference?', 'Which status code fits “not logged in”, and which fits “not allowed”?', 'Why does CORS exist?'],
    },
    capstone: {
      w: [
        ['Plan and build', ['Pick one real problem and define 3 core features', 'Sketch pages, then build the smallest working version', 'Use Git with a branch per feature'], ['Ship a working first version to Netlify or Vercel', 'Write a README with screenshots']],
        ['Polish and present', ['Accessibility pass: labels, contrast, keyboard', 'Performance: image sizes, lazy loading', 'Testing the main flows manually on a phone'], ['Get 3 people to try it and fix what confused them', 'Add it to your portfolio and LinkedIn']],
      ],
      k: [['MVP', 'The smallest version that solves the core problem.'], ['Deployment', 'Putting your app on a public URL.'], ['Portfolio', 'Proof of skill: live link + code + short write-up.'], ['User feedback', 'Watching real users is the fastest way to find problems.']],
      m: ['Starting too big and never finishing', 'No README or live link', 'Ignoring mobile layout'],
      q: ['What are the 3 core features of your project?', 'How would a recruiter run it in under a minute?', 'What would you build next and why?'],
    },
  },

  backend: {
    lang: {
      w: [
        ['Language fundamentals', ['Pick one: Java, Go, Python or Node (TypeScript)', 'Types, functions, error handling, modules/packages', 'Collections: lists, maps, sets', 'Reading and writing files, environment variables'], ['Solve 15 small exercises in your chosen language', 'Write a CLI tool that reads a CSV and prints totals']],
        ['Writing a web server', ['HTTP basics: request, response, headers, status', 'Your framework: Spring Boot, net/http/Gin, FastAPI/Django, Express', 'Structuring code: handlers, services, data access', 'Logging and configuration'], ['Build a “hello” server with 3 routes and JSON responses', 'Add structured logging and a config file']],
      ],
      k: [['Runtime', 'The program that executes your code (JVM, Node, Python interpreter).'], ['Framework', 'Ready-made structure for routing, config and middleware.'], ['Environment variable', 'Config passed from outside the code, e.g. DATABASE_URL.'], ['Error handling', 'Turning failures into clear responses instead of crashes.']],
      m: ['Switching languages every week', 'Hard-coding config and passwords', 'Swallowing errors silently'],
      q: ['Why read secrets from environment variables?', 'What does middleware do?', 'How does your language handle errors: exceptions or returned values?'],
    },
    sql: {
      w: [
        ['Relational basics', ['Tables, rows, primary and foreign keys', 'SELECT, WHERE, ORDER BY, LIMIT', 'JOINs: inner and left', 'GROUP BY with COUNT/SUM/AVG and HAVING'], ['Design a schema for a small shop (users, products, orders)', 'Write 15 queries against it']],
        ['Using a database from code', ['Indexes and why they speed up reads', 'Transactions and ACID', 'Parameterised queries vs string building', 'Migrations to change schema safely'], ['Connect your server to PostgreSQL', 'Add a migration and an index; compare query time']],
      ],
      k: [['Primary key', 'A column that uniquely identifies each row.'], ['JOIN', 'Combines rows from two tables using a related column.'], ['Index', 'A lookup structure that makes searches fast but writes slightly slower.'], ['Transaction', 'A group of statements that succeed or fail together.']],
      m: ['Building SQL by string concatenation (SQL injection)', 'Missing indexes on columns used in WHERE/JOIN', 'Using NULL comparisons with = instead of IS NULL'],
      q: ['LEFT JOIN vs INNER JOIN: which rows differ?', 'WHERE vs HAVING: when does each filter?', 'What does the A in ACID guarantee?'],
    },
    apis: {
      w: [
        ['Designing REST endpoints', ['Resource naming: /users/42/orders', 'Correct methods and status codes', 'Pagination, filtering and sorting', 'Consistent error format'], ['Design 8 endpoints for your shop on paper first', 'Implement them with validation']],
        ['API quality', ['Versioning (/v1)', 'OpenAPI/Swagger documentation', 'Rate limiting basics', 'Idempotency for retries'], ['Generate API docs and test every endpoint with a REST client', 'Add pagination to the list endpoints']],
      ],
      k: [['Resource', 'A thing your API exposes, named by a noun URL.'], ['Pagination', 'Returning data in pages to keep responses small.'], ['OpenAPI', 'A standard file describing your endpoints, used to generate docs.'], ['Rate limit', 'A cap on requests per client to protect the server.']],
      m: ['Verbs in URLs like /getUsers', 'Returning huge unpaginated lists', 'Inconsistent error shapes between endpoints'],
      q: ['How would you paginate a list of 1 million orders?', 'Which status code for a successful create?', 'Why version an API?'],
    },
    security: {
      w: [
        ['Authentication', ['Password hashing with bcrypt/argon2 (never store plain text)', 'Sessions vs tokens (JWT)', 'OAuth / “Sign in with Google” at a high level', 'Secure cookies: HttpOnly, Secure, SameSite'], ['Add sign-up and login with hashed passwords', 'Protect routes so only logged-in users can access them']],
        ['Common attacks', ['OWASP Top 10 overview', 'SQL injection, XSS, CSRF and how to prevent them', 'Authorization: checking the user may access this resource', 'HTTPS and secret management'], ['Try to break your own app with an injection and an IDOR attempt', 'Fix what you find and write it up']],
      ],
      k: [['Hashing', 'One-way scrambling of passwords so leaks do not reveal them.'], ['Authentication vs authorization', 'Who you are vs what you are allowed to do.'], ['JWT', 'A signed token carrying user claims; the server verifies the signature.'], ['IDOR', 'Accessing another user’s data by changing an id in the URL.']],
      m: ['Checking login but not ownership of the resource', 'Long-lived tokens with no way to revoke', 'Logging passwords or tokens'],
      q: ['Why use bcrypt instead of SHA-256 for passwords?', 'How does a parameterised query stop SQL injection?', 'What does the HttpOnly cookie flag prevent?'],
    },
    docker: {
      w: [
        ['Containers', ['Images vs containers', 'Writing a Dockerfile; layers and caching', 'Ports, volumes and environment variables', 'docker compose for app + database'], ['Containerise your API and run it with Postgres via compose', 'Shrink the image with a multi-stage build']],
        ['Deploying', ['Pushing images to a registry', 'Deploying to a platform (Render, Fly.io, Railway or a VM)', 'Health checks and restarts', 'Reading logs in production'], ['Deploy your API to a public URL', 'Add a /health endpoint and check it']],
      ],
      k: [['Image', 'A read-only template with your app and its dependencies.'], ['Container', 'A running instance of an image, isolated from others.'], ['Volume', 'Storage that survives container restarts.'], ['Compose', 'A file that starts several containers together.']],
      m: ['Baking secrets into the image', 'Huge images from copying node_modules or build junk', 'Storing database data inside the container without a volume'],
      q: ['Why does layer order in a Dockerfile matter?', 'What happens to data in a container without a volume?', 'Image vs container: explain in one line each.'],
    },
    testing: {
      w: [
        ['Automated tests', ['Unit vs integration vs end-to-end tests', 'Arrange–Act–Assert', 'Testing with a real test database', 'Mocks: when they help and when they hide bugs'], ['Write 10 unit tests and 3 API integration tests', 'Measure coverage and test one failure path per endpoint']],
        ['Continuous integration', ['CI runs tests on every push', 'GitHub Actions workflow basics', 'Linting and formatting checks', 'Blocking merges when tests fail'], ['Add a GitHub Actions workflow that runs your tests', 'Make a PR that fails CI, then fix it']],
      ],
      k: [['Unit test', 'Checks one small piece in isolation.'], ['Integration test', 'Checks pieces working together, e.g. API + database.'], ['CI', 'Automatically building and testing every change.'], ['Flaky test', 'A test that sometimes fails without code changes.']],
      m: ['Only testing the happy path', 'Mocking so much the test proves nothing', 'Ignoring flaky tests instead of fixing them'],
      q: ['What should an integration test for “create order” check?', 'Why run tests in CI and not only locally?', 'When is a mock a bad idea?'],
    },
    design: {
      w: [
        ['Building blocks', ['Load balancers, caches (Redis), queues', 'Vertical vs horizontal scaling', 'Database replication and sharding basics', 'CAP theorem at a high level'], ['Draw the architecture of a URL shortener', 'Estimate requests per second and storage']],
        ['Interview practice', ['A framework: requirements → estimates → API → data → scale', 'Trade-offs: consistency vs availability, cost vs speed', 'Designing a chat app, a news feed, a rate limiter', 'Explaining bottlenecks and fixes'], ['Do 3 timed 45-minute design sessions with a friend', 'Write a one-page design doc for your own project']],
      ],
      k: [['Cache', 'Fast storage for frequently read data.'], ['Load balancer', 'Spreads requests across several servers.'], ['Message queue', 'Lets services hand off work asynchronously.'], ['Sharding', 'Splitting data across databases by a key.']],
      m: ['Jumping to tools before clarifying requirements', 'No back-of-envelope numbers', 'Ignoring failure cases'],
      q: ['Where would you put a cache in a URL shortener?', 'What breaks first when traffic grows 10×?', 'When do you need a queue?'],
    },
  },

  'app-developer': {
    lang: {
      w: [
        ['Pick your stack', ['Kotlin (Android), Swift (iOS) or Dart (Flutter, both)', 'Variables, null safety, classes, data classes/structs', 'Collections and lambdas', 'Async: coroutines, async/await or Futures'], ['Solve 15 exercises in your chosen language', 'Install the SDK and run the sample app on an emulator']],
        ['Language for apps', ['Immutability and value types', 'Error handling in async code', 'Packages/dependencies (Gradle, SwiftPM, pub)', 'Reading the official style guide'], ['Write a small model layer (e.g. Expense) with unit tests', 'Parse a JSON file into model objects']],
      ],
      k: [['Null safety', 'The compiler forces you to handle missing values.'], ['Coroutine/async', 'Run slow work without freezing the UI.'], ['Package manager', 'Adds and versions libraries for you.'], ['Emulator', 'A virtual phone on your computer for testing.']],
      m: ['Learning two platforms at once', 'Blocking the main thread with network calls', 'Force-unwrapping nulls (!!, !)'],
      q: ['Why must network calls run off the main thread?', 'What does your language do with a null value by default?', 'Native vs Flutter: one trade-off each.'],
    },
    ui: {
      w: [
        ['Declarative UI', ['Jetpack Compose, SwiftUI or Flutter widgets', 'Layouts: rows, columns, stacks, lists', 'Modifiers/styling and theming', 'Previews and hot reload'], ['Rebuild 3 screens of an app you use', 'Make a reusable button and card component']],
        ['Navigation and UX', ['Navigation between screens and passing data', 'Forms and input validation', 'Platform guidelines: Material Design / Human Interface Guidelines', 'Accessibility: font scaling, contrast, labels'], ['Build a 3-screen expense app UI', 'Test it with large text and dark mode']],
      ],
      k: [['Declarative UI', 'You describe what the screen looks like for the current state.'], ['Recomposition/rebuild', 'The UI redraws when state changes.'], ['Navigation stack', 'Screens pushed and popped like a stack.'], ['Design guidelines', 'Platform rules that make apps feel native.']],
      m: ['Hard-coded sizes that break on small phones', 'Ignoring dark mode and large fonts', 'Deep nesting instead of small components'],
      q: ['How do you pass data to the next screen?', 'What triggers a UI rebuild?', 'Name two accessibility checks for a form.'],
    },
    data: {
      w: [
        ['State management', ['Local vs shared state', 'ViewModel / ObservableObject / Provider/Riverpod/BLoC', 'Unidirectional data flow', 'Surviving rotation and process death'], ['Move your expense app logic into a ViewModel', 'Keep state across screen rotation']],
        ['Saving data', ['Key–value storage for settings', 'Local database: Room, Core Data/SwiftData, Hive/sqflite', 'Repository pattern', 'Simple migrations'], ['Save expenses in a local database', 'Add a settings screen stored in key–value storage']],
      ],
      k: [['ViewModel', 'Holds screen state and logic outside the UI.'], ['Single source of truth', 'One place owns each piece of data.'], ['Repository', 'Hides where data comes from (DB, network).'], ['Migration', 'Updating the database schema without losing data.']],
      m: ['Business logic inside UI code', 'Two places owning the same data', 'Breaking user data on schema change'],
      q: ['Where should “total spent this month” be calculated?', 'What happens to state on rotation?', 'Why use a repository?'],
    },
    apis: {
      w: [
        ['Networking', ['HTTP client: Retrofit/Ktor, URLSession, http/dio', 'JSON parsing into models', 'Loading, error and empty states', 'Timeouts and retries'], ['Show data from a public API in a list', 'Handle offline mode with a friendly message']],
        ['Offline-first', ['Caching responses in the local database', 'Syncing when back online', 'Images: loading and caching', 'Secure storage for tokens'], ['Cache API results and show them offline', 'Store a token in secure storage']],
      ],
      k: [['Serialization', 'Turning JSON into objects and back.'], ['Offline-first', 'The app works from local data and syncs later.'], ['Secure storage', 'Keychain/Keystore for secrets.'], ['Exponential backoff', 'Waiting longer between each retry.']],
      m: ['No error state: blank screen on failure', 'Storing tokens in plain preferences', 'Loading full-size images in lists'],
      q: ['What should the user see when offline?', 'Where do you store an auth token?', 'How do you avoid repeated downloads of the same image?'],
    },
    git: {
      w: [
        ['Git for app projects', ['Commits, branches, PRs', '.gitignore for build folders and keystores', 'Tagging releases', 'Semantic versioning'], ['Put your app on GitHub with a clean history', 'Tag v0.1.0']],
        ['Teamwork', ['Code review etiquette', 'Feature flags at a high level', 'CI building the app on each push', 'Issue tracking'], ['Add a CI workflow that builds and runs unit tests', 'Review a friend’s PR']],
      ],
      k: [['Tag', 'A named pointer to a release commit.'], ['SemVer', 'MAJOR.MINOR.PATCH version numbers.'], ['Code review', 'Another developer checks changes before merging.'], ['CI build', 'Proves the app compiles on a clean machine.']],
      m: ['Committing signing keys', 'Huge PRs nobody can review', 'No version tags'],
      q: ['What goes in an Android/iOS .gitignore?', 'When do you bump the MAJOR version?', 'What makes a PR easy to review?'],
    },
    publish: {
      w: [
        ['Preparing a release', ['App icons, splash screen, store screenshots', 'Release builds and signing', 'Privacy policy and data safety form', 'Crash reporting'], ['Create a signed release build', 'Write a store listing and privacy policy']],
        ['Shipping', ['Internal/closed testing tracks (Play Console, TestFlight)', 'Store review rules', 'Analytics and crash monitoring', 'Release notes and updates'], ['Publish to a closed test with 5 friends', 'Fix the top crash or complaint and ship an update']],
      ],
      k: [['Signing', 'Proves the app comes from you; lose the key and you cannot update.'], ['Test track', 'A limited release before going public.'], ['Store review', 'Platform checks before an app goes live.'], ['Crash reporting', 'Automatic reports of crashes from real users.']],
      m: ['Losing the signing key', 'No privacy policy', 'Skipping testing on real devices'],
      q: ['Why back up your signing key?', 'What does the store data-safety form ask?', 'How will you know if users crash?'],
    },
  },

  dsa: {
    lang: {
      w: [
        ['Language for interviews', ['Pick one: C++, Java or Python', 'Fast input/output', 'Standard containers: vector/ArrayList/list, map/HashMap/dict, set', 'Sorting with custom comparators'], ['Solve 20 easy problems in your language', 'Make a personal cheat-sheet of container operations']],
        ['Writing clean solutions', ['Edge cases: empty, single element, duplicates, negatives', 'Dry-running code by hand', 'Naming and small helper functions', 'Talking while coding'], ['Re-solve 5 problems explaining aloud', 'List edge cases before coding each problem']],
      ],
      k: [['STL/Collections', 'Built-in data structures you should know cold.'], ['Comparator', 'Defines custom sort order.'], ['Edge case', 'Unusual input that breaks naive code.'], ['Dry run', 'Tracing code by hand with a small input.']],
      m: ['Switching languages before interviews', 'Not knowing container time complexities', 'Coding before understanding the problem'],
      q: ['What is the time of a hash map lookup on average?', 'How do you sort pairs by second value?', 'List 4 edge cases for “find the maximum in an array”.'],
    },
    bigo: {
      w: [
        ['Measuring cost', ['Big-O: worst-case growth', 'O(1), O(log n), O(n), O(n log n), O(n²)', 'Space complexity', 'Amortised cost (dynamic arrays)'], ['Find the complexity of 15 code snippets', 'Explain why binary search is O(log n)']],
        ['Choosing approaches', ['Brute force first, then optimise', 'Input size → allowed complexity (n = 10⁵ → aim for O(n log n))', 'Recursion and the call stack', 'Recurrences for divide and conquer'], ['Solve 10 problems with brute force and an optimised version', 'Time both on large input']],
      ],
      k: [['Big-O', 'How running time grows as input grows.'], ['Logarithmic', 'Halving the work each step.'], ['Amortised', 'Average cost per operation over many operations.'], ['Space complexity', 'Extra memory an algorithm needs.']],
      m: ['Ignoring nested loops hidden in library calls', 'Forgetting recursion stack space', 'Optimising before having a correct solution'],
      q: ['What is the complexity of sorting then scanning?', 'Why is appending to a dynamic array O(1) amortised?', 'n = 10⁵: is O(n²) acceptable?'],
    },
    linear: {
      w: [
        ['Arrays and strings', ['Two pointers', 'Sliding window', 'Prefix sums', 'Sorting-based tricks'], ['Solve 15 two-pointer and sliding-window problems', 'Write the sliding-window template from memory']],
        ['Hashing, stacks, queues, lists', ['Hash maps for counting and lookups', 'Stack for matching brackets and monotonic stack', 'Queue/deque', 'Linked lists: reverse, cycle detection'], ['Solve 15 hashing and stack problems', 'Reverse a linked list iteratively and recursively']],
      ],
      k: [['Two pointers', 'Move two indices toward/along the array to avoid nested loops.'], ['Sliding window', 'Maintain a range and update it in O(1) per step.'], ['Prefix sum', 'Precompute sums to answer range sums in O(1).'], ['Monotonic stack', 'A stack kept sorted to find next greater/smaller elements.']],
      m: ['Off-by-one errors in windows', 'Using a list where a set/map is needed', 'Losing the head pointer in linked lists'],
      q: ['How do you find a pair summing to k in O(n)?', 'Longest substring without repeats: which pattern?', 'How do you detect a cycle in a linked list?'],
    },
    trees: {
      w: [
        ['Trees', ['Binary tree traversals: pre/in/post/level order', 'Binary search trees', 'Recursion on trees: height, diameter, LCA', 'Heaps and priority queues'], ['Solve 15 tree problems', 'Implement level order with a queue']],
        ['Graphs', ['Adjacency list representation', 'BFS (shortest path in unweighted graphs) and DFS', 'Topological sort, cycle detection', 'Dijkstra and union-find (DSU)'], ['Solve 15 graph problems including grids', 'Implement Dijkstra with a priority queue']],
      ],
      k: [['BST', 'Left subtree smaller, right subtree larger.'], ['BFS', 'Explores level by level; finds shortest paths in unweighted graphs.'], ['Topological sort', 'Orders tasks so prerequisites come first.'], ['Union-find', 'Tracks connected groups with near-constant merges.']],
      m: ['Forgetting visited sets in graphs', 'Using DFS for shortest path in unweighted graphs', 'Not handling disconnected components'],
      q: ['Which traversal gives sorted order in a BST?', 'When does Dijkstra fail?', 'How do you count islands in a grid?'],
    },
    dp: {
      w: [
        ['DP foundations', ['Overlapping subproblems and optimal substructure', 'Memoisation (top-down) vs tabulation (bottom-up)', 'Defining state and transition', '1-D DP: climbing stairs, house robber'], ['Solve 10 1-D DP problems', 'Write state + transition before coding each']],
        ['Classic patterns', ['Knapsack (0/1 and unbounded)', 'Grid DP and paths', 'LIS, LCS, edit distance', 'Space optimisation'], ['Solve 15 2-D DP problems', 'Convert 3 memoised solutions to tabulation']],
      ],
      k: [['State', 'The smallest set of values that describes a subproblem.'], ['Transition', 'How a state is computed from smaller states.'], ['Memoisation', 'Caching results of recursive calls.'], ['Tabulation', 'Filling a table from base cases upward.']],
      m: ['Jumping to code without defining the state', 'Wrong base cases', 'Using DP when greedy works'],
      q: ['What is the state for 0/1 knapsack?', 'How does LCS recurrence work?', 'When can you reduce a 2-D table to 1-D?'],
    },
    mock: {
      w: [
        ['Interview routine', ['A 45-minute structure: clarify → examples → approach → code → test', 'Explaining trade-offs aloud', 'Behavioural answers with STAR', 'Company-specific question lists'], ['Do 4 timed mock interviews with friends', 'Record one and review it']],
        ['Final preparation', ['Revise your notes and mistakes log', 'Mixed-topic timed sets', 'Resume walk-through and project deep-dives', 'Questions to ask the interviewer'], ['Do 2 full mock interview loops', 'Fix the 3 weakest topics from your mistakes log']],
      ],
      k: [['Clarifying questions', 'Confirm input limits and edge cases before coding.'], ['STAR', 'Situation, Task, Action, Result: a structure for behavioural answers.'], ['Mistakes log', 'A list of errors you made and what you learnt.'], ['Thinking aloud', 'Interviewers grade your reasoning, not only the answer.']],
      m: ['Silent coding', 'Not testing the code with an example', 'Memorising answers instead of patterns'],
      q: ['What do you say in the first 2 minutes of a problem?', 'Tell a STAR story about a bug you fixed.', 'Which 3 topics are weakest for you right now?'],
    },
  },
};
