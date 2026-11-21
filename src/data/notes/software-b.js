// Software paths, part B: DevOps, Cybersecurity, Game dev, UI/UX, Blockchain.
// Format: see software-a.js.

export default {
  devops: {
    linux: {
      w: [
        ['Shell basics', ['Filesystem layout: /etc, /var, /home, /usr', 'Navigation and files: ls, cd, cp, mv, rm, find', 'Permissions: chmod, chown, users and groups', 'Pipes and redirection: |, >, >>, grep, wc, sort'], ['Practise daily in a Linux VM or WSL', 'Find the 10 largest files in a folder using one pipeline']],
        ['Running a server', ['Processes and signals: ps, top, kill', 'Services with systemd: start, enable, logs (journalctl)', 'Networking: ip, ss, curl, DNS basics', 'SSH keys and secure login'], ['Set up a VM, log in with an SSH key and disable password login', 'Run a web server as a systemd service']],
      ],
      k: [['Permission bits', 'rwx for owner, group and others (e.g. 755).'], ['Pipe', 'Sends one command’s output to another’s input.'], ['systemd service', 'A managed background program that can restart on failure.'], ['SSH key', 'A key pair for passwordless, secure login.']],
      m: ['Running everything as root', 'chmod 777 to “fix” permissions', 'Not reading logs before guessing'],
      q: ['What does chmod 640 mean?', 'How do you see why a service failed?', 'Which command shows open ports?'],
    },
    script: {
      w: [
        ['Automation scripts', ['Bash: variables, loops, exit codes, set -euo pipefail', 'Python or Go for anything bigger than ~50 lines', 'Reading files, JSON and environment variables', 'Calling HTTP APIs from scripts'], ['Write a backup script that zips a folder and keeps 7 copies', 'Write a script that checks if 5 URLs are up']],
        ['Reliable tooling', ['Command-line arguments and help text', 'Logging and clear error messages', 'Scheduling with cron', 'Testing small scripts'], ['Turn the URL checker into a CLI with flags', 'Schedule it with cron and log results']],
      ],
      k: [['Exit code', '0 means success; anything else signals failure.'], ['set -euo pipefail', 'Makes Bash stop on errors and unset variables.'], ['Idempotent script', 'Safe to run many times with the same result.'], ['Cron', 'Runs commands on a schedule.']],
      m: ['Ignoring exit codes', 'Hard-coding paths and secrets', 'Huge Bash scripts that should be Python/Go'],
      q: ['What does pipefail change?', 'When would you switch from Bash to Python?', 'How do you make a script idempotent?'],
    },
    docker: {
      w: [
        ['Containers', ['Images, containers, registries', 'Dockerfile instructions and layer caching', 'Volumes and networks', 'docker compose'], ['Containerise a small web app and its database', 'Cut image size with a multi-stage build and a slim base']],
        ['Container practice', ['Non-root users in containers', 'Health checks', 'Scanning images for vulnerabilities', 'Tagging and pushing to a registry'], ['Run the app as a non-root user with a health check', 'Push a tagged image to a registry']],
      ],
      k: [['Layer', 'Each Dockerfile step creates a cached layer.'], ['Multi-stage build', 'Build in one image, copy only output to a small final image.'], ['Registry', 'Stores and distributes images (Docker Hub, GHCR).'], ['Health check', 'A command that tells the runtime if the app is healthy.']],
      m: ['Using the latest tag in production', 'Secrets in images', 'Running as root'],
      q: ['Why copy package files before source code in a Dockerfile?', 'What problem does a multi-stage build solve?', 'How do containers on one compose network find each other?'],
    },
    ci: {
      w: [
        ['CI pipelines', ['Triggers: push, pull request, schedule', 'Jobs, steps, runners and caching', 'Running tests and linters', 'Build artifacts'], ['Create a GitHub Actions workflow that lints, tests and builds', 'Cache dependencies to speed it up']],
        ['Continuous delivery', ['Building and pushing images from CI', 'Environments and approvals', 'Secrets in CI', 'Deployment strategies: rolling, blue-green, canary'], ['Auto-deploy to a staging environment on merge', 'Add a manual approval for production']],
      ],
      k: [['CI', 'Every change is built and tested automatically.'], ['CD', 'Every passing change can be (or is) deployed automatically.'], ['Artifact', 'A build output saved for later steps.'], ['Canary release', 'Ship to a small share of users first.']],
      m: ['Secrets printed in logs', 'Slow pipelines nobody waits for', 'Deploying without a rollback plan'],
      q: ['Where do you store a deploy token for CI?', 'Blue-green vs canary: one difference.', 'How do you roll back a bad deploy?'],
    },
    cloud: {
      w: [
        ['Cloud fundamentals', ['Regions and availability zones', 'Compute: VMs, containers, serverless', 'Storage: object, block, managed databases', 'IAM: users, roles, least privilege'], ['Launch a VM and a storage bucket on AWS/Azure/GCP free tier', 'Create an IAM role with only the permissions needed']],
        ['Networking and cost', ['VPC, subnets, security groups/firewalls', 'Load balancers and DNS', 'Billing alerts and cost basics', 'Shared responsibility model'], ['Put two VMs behind a load balancer', 'Set a billing alert and tear everything down after']],
      ],
      k: [['Availability zone', 'Separate data centre in a region for fault tolerance.'], ['IAM', 'Controls who can do what in your cloud account.'], ['Least privilege', 'Give only the permissions needed.'], ['Security group', 'A virtual firewall for cloud resources.']],
      m: ['Leaving resources running and getting a bill', 'Using the root account daily', 'Opening ports to 0.0.0.0/0 unnecessarily'],
      q: ['Why spread servers across availability zones?', 'What is the shared responsibility model?', 'How do you avoid surprise cloud bills?'],
    },
    iac: {
      w: [
        ['Terraform basics', ['Providers, resources, variables, outputs', 'plan vs apply', 'State files and why they matter', 'Modules for reuse'], ['Recreate your VM + bucket setup in Terraform', 'Destroy and re-create it with one command']],
        ['IaC in teams', ['Remote state and locking', 'Workspaces/environments', 'Configuration management (Ansible) vs provisioning', 'Running Terraform in CI'], ['Store state remotely with locking', 'Run terraform plan on every pull request']],
      ],
      k: [['Infrastructure as Code', 'Describing infrastructure in versioned files.'], ['Plan', 'A preview of changes before applying.'], ['State', 'Terraform’s record of what it created.'], ['Drift', 'Real infrastructure differs from the code.']],
      m: ['Committing state files with secrets', 'Clicking changes in the console after using Terraform', 'Applying without reading the plan'],
      q: ['Why must Terraform state be locked?', 'What is drift and how do you detect it?', 'Terraform vs Ansible: main difference?'],
    },
    k8s: {
      w: [
        ['Core objects', ['Pods, Deployments, ReplicaSets', 'Services and Ingress', 'ConfigMaps and Secrets', 'kubectl get/describe/logs/apply'], ['Run a local cluster (kind or minikube) and deploy your app', 'Scale it to 3 replicas and kill a pod']],
        ['Running workloads well', ['Requests/limits and probes (liveness, readiness)', 'Rolling updates and rollbacks', 'Helm charts basics', 'Namespaces and RBAC'], ['Add probes and resource limits', 'Package the app as a Helm chart']],
      ],
      k: [['Pod', 'The smallest unit: one or more containers sharing a network.'], ['Deployment', 'Keeps a desired number of pod replicas running.'], ['Service', 'A stable address in front of changing pods.'], ['Readiness probe', 'Tells Kubernetes when a pod can receive traffic.']],
      m: ['No resource limits', 'Missing readiness probes causing errors during deploys', 'Learning Kubernetes before Docker'],
      q: ['What happens when a pod in a Deployment dies?', 'Liveness vs readiness probe?', 'How do you roll back a Deployment?'],
    },
    obs: {
      w: [
        ['Monitoring', ['Metrics, logs and traces', 'Prometheus and Grafana basics', 'The four golden signals: latency, traffic, errors, saturation', 'Structured logging'], ['Add a metrics endpoint to your app and graph it in Grafana', 'Ship logs to a central place']],
        ['Reliability', ['SLIs, SLOs and error budgets', 'Alerting on symptoms, not causes', 'Incident response and postmortems', 'Backups and restore drills'], ['Define one SLO and an alert for it', 'Write a blameless postmortem for a simulated outage']],
      ],
      k: [['SLO', 'A target for reliability, e.g. 99.9% of requests under 300 ms.'], ['Error budget', 'Allowed unreliability before slowing releases.'], ['Golden signals', 'Latency, traffic, errors, saturation.'], ['Postmortem', 'A blameless write-up of what went wrong and fixes.']],
      m: ['Alerting on everything (alert fatigue)', 'Never testing backups', 'Logs without request ids'],
      q: ['What is the difference between an SLI and an SLO?', 'Why alert on symptoms?', 'When did you last test a restore?'],
    },
  },

  cybersecurity: {
    net: {
      w: [
        ['How networks work', ['OSI and TCP/IP models', 'IP addressing, subnets and CIDR', 'TCP vs UDP; common ports (22, 53, 80, 443)', 'DNS, DHCP, ARP'], ['Calculate 10 subnets by hand', 'Capture your own traffic in Wireshark and identify DNS and HTTP']],
        ['Network security basics', ['Firewalls and NAT', 'TLS/HTTPS handshake at a high level', 'VPNs', 'Common attacks: scanning, spoofing, MITM'], ['Scan your own lab with nmap', 'Explain each open port you find']],
      ],
      k: [['Subnet', 'A slice of an IP network defined by a mask like /24.'], ['TCP handshake', 'SYN, SYN-ACK, ACK to open a connection.'], ['DNS', 'Translates names to IP addresses.'], ['TLS', 'Encrypts traffic and proves server identity.']],
      m: ['Memorising ports without understanding protocols', 'Scanning networks you do not own', 'Skipping subnetting practice'],
      q: ['How many hosts fit in a /26?', 'Why is DNS a common attack target?', 'TCP vs UDP: when is each used?'],
    },
    linux: {
      w: [
        ['Linux essentials', ['Shell navigation and files', 'Users, groups and permissions; sudo', 'Processes and services', 'Package management'], ['Use Linux daily in a VM', 'Create users with limited permissions']],
        ['Linux for security', ['Logs: /var/log, journalctl, auth logs', 'SUID files and privilege escalation basics', 'SSH hardening', 'Firewall with ufw/iptables'], ['Harden an SSH server and verify with a scan', 'Find all SUID binaries and explain risks']],
      ],
      k: [['sudo', 'Run a command as another user, usually root.'], ['SUID', 'A file that runs with its owner’s permissions.'], ['auth.log', 'Records logins and sudo use.'], ['Hardening', 'Reducing attack surface by removing or locking things down.']],
      m: ['Ignoring logs', 'Leaving default passwords', 'Disabling the firewall to fix problems'],
      q: ['Where do you look for failed SSH logins?', 'Why is SUID risky?', 'Name 3 SSH hardening steps.'],
    },
    py: {
      w: [
        ['Python for security tasks', ['Files, strings, regex', 'Sockets and HTTP requests', 'Parsing logs and JSON', 'Virtual environments'], ['Write a log parser that counts failed logins per IP', 'Write a simple port checker for your own lab']],
        ['Useful tools', ['Hashing with hashlib', 'Automating with subprocess', 'Working with APIs (e.g. threat intel lookups)', 'Writing small CLI tools'], ['Build a CLI that hashes files and compares against known hashes', 'Automate a daily report from logs']],
      ],
      k: [['Regex', 'Patterns for finding text like IPs in logs.'], ['Socket', 'A low-level network connection endpoint.'], ['Hash', 'Fingerprint of data; any change gives a new hash.'], ['Virtualenv', 'Isolated Python packages per project.']],
      m: ['Running untrusted scripts', 'Scanning targets without permission', 'Not handling network timeouts'],
      q: ['How do you extract IPs from a log with regex?', 'Why compare file hashes?', 'What is a safe target for practice scans?'],
    },
    web: {
      w: [
        ['How web apps break', ['HTTP, cookies and sessions', 'OWASP Top 10', 'SQL injection and XSS', 'Burp Suite or OWASP ZAP basics'], ['Do the PortSwigger Web Security Academy labs on SQLi and XSS', 'Intercept and modify a request in Burp']],
        ['More vulnerabilities', ['Broken access control and IDOR', 'CSRF and SSRF', 'Authentication flaws', 'Writing a clear vulnerability report'], ['Complete 10 more labs', 'Write a report: issue, impact, steps, fix']],
      ],
      k: [['SQL injection', 'Attacker input changes a database query.'], ['XSS', 'Attacker script runs in another user’s browser.'], ['CSRF', 'Tricks a logged-in browser into sending unwanted requests.'], ['Access control', 'Checks that a user may access a resource.']],
      m: ['Testing sites without written permission', 'Reports without reproduction steps', 'Only learning tools, not the underlying cause'],
      q: ['Stored vs reflected XSS?', 'How does SameSite help against CSRF?', 'What makes a good bug report?'],
    },
    ctf: {
      w: [
        ['Guided labs', ['TryHackMe or Hack The Box beginner paths', 'Enumeration first: ports, services, versions', 'Using notes to track every step', 'Privilege escalation basics'], ['Complete 5 beginner rooms/boxes', 'Keep a write-up for each']],
        ['CTF practice', ['CTF categories: web, crypto, forensics, reversing, pwn', 'Teamwork and time management', 'Reading others’ write-ups after solving', 'Building a personal methodology checklist'], ['Join one online CTF event (e.g. picoCTF)', 'Publish 2 write-ups on a blog or GitHub']],
      ],
      k: [['Enumeration', 'Collecting information before attacking.'], ['Privilege escalation', 'Gaining higher permissions after initial access.'], ['Write-up', 'A step-by-step explanation of how you solved a challenge.'], ['Methodology', 'A repeatable checklist for approaching targets.']],
      m: ['Jumping to exploits before enumeration', 'Copying walkthroughs without understanding', 'No notes'],
      q: ['What is your first step on a new box?', 'Name 3 Linux privilege-escalation checks.', 'What did your last write-up teach you?'],
    },
    blue: {
      w: [
        ['Detection', ['SIEM basics (e.g. Splunk, Elastic)', 'Log sources: endpoints, network, cloud', 'Writing detection rules', 'MITRE ATT&CK framework'], ['Ingest sample logs into a free SIEM and search them', 'Write a rule for brute-force login attempts']],
        ['Incident response', ['IR lifecycle: prepare, detect, contain, eradicate, recover, learn', 'Triage and severity', 'Basic forensics: timelines, memory and disk', 'Writing incident reports'], ['Work through a blue-team lab (e.g. on TryHackMe)', 'Write an incident report for it']],
      ],
      k: [['SIEM', 'Collects and searches security logs from many sources.'], ['MITRE ATT&CK', 'A catalogue of attacker techniques.'], ['False positive', 'An alert that is not a real attack.'], ['Containment', 'Stopping an incident from spreading.']],
      m: ['Too many noisy alerts', 'Destroying evidence while fixing', 'No documentation during incidents'],
      q: ['What logs would show a brute-force attack?', 'Containment vs eradication?', 'How do you reduce false positives?'],
    },
  },

  'game-dev': {
    design: {
      w: [
        ['What makes games fun', ['Core loop: the action players repeat', 'Goals, challenge and feedback', 'Game feel: responsiveness and juice', 'Paper prototyping'], ['Write a one-page design doc for a tiny game', 'Paper-prototype it and playtest with 2 people']],
        ['Scoping and playtesting', ['Scope small: one mechanic, one level', 'Playtesting and observing players', 'Difficulty curves', 'Game jams'], ['Join a game jam or set a 48-hour challenge', 'Write down 5 changes from playtests']],
      ],
      k: [['Core loop', 'The main repeated actions of a game.'], ['Game feel', 'How responsive and satisfying controls feel.'], ['Playtest', 'Watching others play to find problems.'], ['Scope', 'How much you try to build.']],
      m: ['Starting with a huge RPG', 'Never showing the game to others', 'Adding features before the core loop is fun'],
      q: ['What is the core loop of your favourite game?', 'What did your last playtest change?', 'How would you cut your idea to 2 weeks?'],
    },
    lang: {
      w: [
        ['Programming for games', ['C# for Unity or C++ for Unreal/custom engines', 'Classes, inheritance vs composition', 'Collections and loops', 'Memory: value vs reference types'], ['Write a text-based game in your language', 'Model an inventory with classes']],
        ['Game code patterns', ['Game loop: input → update → render', 'Delta time and frame-rate independence', 'State machines for characters', 'Events/observers'], ['Implement a state machine for an enemy (idle, chase, attack)', 'Make movement frame-rate independent']],
      ],
      k: [['Game loop', 'Repeats input, update and draw every frame.'], ['Delta time', 'Time since last frame; multiply movement by it.'], ['State machine', 'An object is in one state at a time with clear transitions.'], ['Composition', 'Building objects from parts instead of deep inheritance.']],
      m: ['Movement tied to frame rate', 'Giant god-classes', 'Learning C++ and Unreal on day one'],
      q: ['Why multiply speed by delta time?', 'Draw an enemy state machine.', 'Composition vs inheritance: one advantage.'],
    },
    engine: {
      w: [
        ['Engine basics', ['Unity, Unreal or Godot editor', 'Scenes, game objects/actors, components', 'Physics bodies and collisions', 'Input and cameras'], ['Make a small platformer level', 'Add collectibles and a score']],
        ['Finishing a game', ['UI: menus, HUD, pause', 'Audio and particles', 'Building for PC/web/mobile', 'Profiling performance'], ['Ship a complete 3–5 minute game to itch.io', 'Fix the slowest part found in the profiler']],
      ],
      k: [['Component', 'A reusable behaviour attached to an object.'], ['Prefab/Blueprint', 'A reusable template object.'], ['Collider', 'Shape used for collisions.'], ['Profiler', 'Shows where frame time goes.']],
      m: ['Never finishing and publishing', 'Physics in Update instead of FixedUpdate (Unity)', 'Ignoring performance until the end'],
      q: ['What is a prefab and why use it?', 'Where should physics code run in Unity?', 'How do you find a performance bottleneck?'],
    },
    math: {
      w: [
        ['Vectors and transforms', ['Vectors: add, scale, length, normalise', 'Dot product (angles, facing) and cross product', 'Coordinate spaces: local vs world', 'Rotations, Euler angles vs quaternions'], ['Make an enemy turn to face the player', 'Implement a field-of-view check with a dot product']],
        ['Motion and physics', ['Velocity, acceleration, gravity', 'Integration (Euler) and fixed time step', 'Collisions: AABB, circles, raycasts', 'Interpolation: lerp, easing'], ['Write your own simple physics for a bouncing ball', 'Add smooth camera follow with lerp']],
      ],
      k: [['Dot product', 'Measures how aligned two vectors are.'], ['Normalise', 'Make a vector length 1 while keeping direction.'], ['Quaternion', 'Rotation representation without gimbal lock.'], ['Lerp', 'Linear blend between two values.']],
      m: ['Not normalising direction vectors', 'Mixing local and world coordinates', 'Variable time step in physics'],
      q: ['How do you tell if an enemy is in front of the player?', 'Why use quaternions?', 'What does lerp(a, b, 0.5) return?'],
    },
    gfx: {
      w: [
        ['The graphics pipeline', ['Vertices, triangles, rasterisation', 'Vertex and fragment shaders', 'Textures and UVs', 'Model, view and projection matrices'], ['Draw a textured, rotating cube (OpenGL/WebGL or engine shaders)', 'Write a shader that changes colour over time']],
        ['Lighting and effects', ['Lighting: ambient, diffuse, specular', 'Normal maps', 'Post-processing basics', 'Draw calls and batching'], ['Implement simple Phong lighting', 'Measure draw calls and reduce them']],
      ],
      k: [['Shader', 'A small program that runs on the GPU.'], ['Rasterisation', 'Turning triangles into pixels.'], ['MVP matrix', 'Transforms vertices from model to screen space.'], ['Draw call', 'A request to the GPU to draw; too many slow games.']],
      m: ['Starting with complex engines instead of a triangle', 'Ignoring GPU cost', 'Wrong matrix multiplication order'],
      q: ['Vertex vs fragment shader: what does each do?', 'What do UV coordinates map?', 'How do you reduce draw calls?'],
    },
  },

  'ui-ux': {
    research: {
      w: [
        ['Understanding users', ['User interviews: open questions, no leading', 'Personas and jobs-to-be-done', 'Journey maps', 'Problem statements'], ['Interview 5 students about how they plan study time', 'Write 2 personas and a problem statement']],
        ['Testing ideas', ['Usability testing: tasks and think-aloud', 'Affinity mapping', 'Heuristic evaluation (Nielsen’s 10)', 'Turning findings into priorities'], ['Run a usability test on an existing app with 3 users', 'Write the top 5 issues ranked by severity']],
      ],
      k: [['Persona', 'A research-based summary of a user type.'], ['Journey map', 'Steps, feelings and pain points across an experience.'], ['Usability test', 'Watching users try real tasks.'], ['Heuristic', 'A rule of thumb for good interfaces.']],
      m: ['Asking “would you use this?”', 'Designing before talking to users', 'Testing with only friends who agree with you'],
      q: ['What is a leading question? Give an example.', 'How many users find most usability problems?', 'Name 3 Nielsen heuristics.'],
    },
    visual: {
      w: [
        ['Visual foundations', ['Typography: scale, line height, pairing', 'Colour: contrast, palettes, meaning', 'Spacing systems (4/8-point grid)', 'Hierarchy and alignment'], ['Redesign one cluttered screen using only spacing and type', 'Create a type scale and palette']],
        ['UI patterns', ['Components: buttons, inputs, cards, navigation', 'States: hover, focus, disabled, error, empty', 'Design systems and tokens', 'Responsive layouts'], ['Design a mini design system with 8 components', 'Design mobile and desktop versions of one screen']],
      ],
      k: [['Visual hierarchy', 'Size, weight and position guide the eye.'], ['Contrast ratio', 'Text needs at least 4.5:1 for readability (WCAG AA).'], ['Design token', 'A named value like colour-primary reused everywhere.'], ['Empty state', 'What a screen shows before there is data.']],
      m: ['Too many fonts and colours', 'Forgetting error and empty states', 'Low-contrast grey text'],
      q: ['What contrast ratio does body text need?', 'Why use an 8-point spacing grid?', 'List 5 states of a button.'],
    },
    figma: {
      w: [
        ['Figma skills', ['Frames, auto layout, constraints', 'Components, variants and instances', 'Styles and variables', 'Collaboration and comments'], ['Rebuild your design system with auto layout and variants', 'Build 3 screens from it']],
        ['Prototyping', ['Flows and interactions', 'Smart animate basics', 'Testing prototypes with users', 'Handoff: specs and dev mode'], ['Make a clickable prototype of a sign-up flow', 'Test it with 3 people and iterate']],
      ],
      k: [['Auto layout', 'Frames that resize with content like CSS flexbox.'], ['Variant', 'Different versions of a component in one set.'], ['Prototype', 'A clickable simulation of the product.'], ['Handoff', 'Giving developers specs and assets.']],
      m: ['Detached components everywhere', 'Pixel-perfect mockups before testing ideas', 'Messy layer names'],
      q: ['Why use variants instead of separate components?', 'What is auto layout like in CSS?', 'What do developers need from handoff?'],
    },
    a11y: {
      w: [
        ['Accessibility basics', ['WCAG principles: perceivable, operable, understandable, robust', 'Colour contrast and not relying on colour alone', 'Text alternatives', 'Keyboard and focus order'], ['Audit an app with a contrast checker and keyboard only', 'Fix 5 issues in your designs']],
        ['Inclusive design', ['Screen readers (VoiceOver/TalkBack) basics', 'Touch target sizes', 'Readable language and error messages', 'Designing for low bandwidth and older phones'], ['Use a screen reader on your prototype for 10 minutes', 'Write accessibility notes for developers']],
      ],
      k: [['WCAG', 'International guidelines for accessible web content.'], ['Focus order', 'The order elements receive keyboard focus.'], ['Touch target', 'Tap areas around 44–48 px for fingers.'], ['Alt text', 'Text describing an image for screen readers.']],
      m: ['Using colour alone for errors', 'Tiny tap targets', 'Placeholder text as the only label'],
      q: ['What are the four WCAG principles?', 'How big should touch targets be?', 'Why is placeholder-only labelling a problem?'],
    },
    build: {
      w: [
        ['From design to code', ['HTML/CSS basics for designers', 'Flexbox and Grid vs auto layout', 'Design tokens as CSS variables', 'Component thinking in React'], ['Build one of your screens in HTML/CSS', 'Match spacing and type from your design system']],
        ['Portfolio', ['Case study structure: problem, research, process, outcome', 'Showing decisions and trade-offs', 'Metrics and learning', 'Presenting your work'], ['Write 2 case studies', 'Publish a portfolio site']],
      ],
      k: [['Case study', 'A story of how you solved a design problem.'], ['Design–dev collaboration', 'Shared tokens and components reduce mismatch.'], ['Responsive build', 'One design adapting across screen sizes.'], ['Outcome', 'What changed because of your design.']],
      m: ['Portfolio of pretty screens without process', 'No real users in case studies', 'Designs impossible to build'],
      q: ['What sections should a case study have?', 'How do Figma auto layout and Flexbox relate?', 'What outcome can you show for your project?'],
    },
  },

  blockchain: {
    js: {
      w: [
        ['Modern JavaScript', ['ES modules, async/await, Promises', 'Objects, arrays, classes', 'Node.js and npm', 'TypeScript basics'], ['Build a CLI in Node that fetches data from an API', 'Convert it to TypeScript']],
        ['Frontend basics', ['React components and state', 'Handling forms and errors', 'Environment variables', 'Testing with a framework'], ['Build a React page that shows API data', 'Add tests for one function']],
      ],
      k: [['async/await', 'Readable asynchronous code.'], ['npm', 'Node’s package manager.'], ['TypeScript', 'JavaScript with types to catch mistakes early.'], ['Module', 'A file that exports and imports code.']],
      m: ['Skipping JS fundamentals to jump into Web3', 'Unhandled Promise rejections', 'Ignoring types'],
      q: ['How do you handle errors with await?', 'Why use TypeScript for smart-contract frontends?', 'What is package.json for?'],
    },
    chain: {
      w: [
        ['Blockchain basics', ['Hashes, blocks and chains', 'Public/private keys and signatures', 'Consensus: proof of work vs proof of stake', 'Transactions and fees (gas)'], ['Create a wallet on a testnet and send a test transaction', 'Inspect it on a block explorer']],
        ['Ethereum model', ['Accounts: externally owned vs contracts', 'EVM and state', 'Nonces and gas limits', 'Layer 2s at a high level'], ['Explain one transaction field by field', 'Compare fees on mainnet vs a layer 2 (read-only)']],
      ],
      k: [['Hash', 'A fixed-size fingerprint; changing data changes the hash.'], ['Private key', 'Proves ownership; never share it.'], ['Consensus', 'How nodes agree on the next block.'], ['Gas', 'The fee unit for computation on Ethereum.']],
      m: ['Using real money while learning', 'Sharing seed phrases', 'Confusing wallets with accounts'],
      q: ['Why can’t a block be changed later?', 'What is a nonce in a transaction?', 'Proof of work vs proof of stake?'],
    },
    sol: {
      w: [
        ['Solidity basics', ['Contracts, state variables, functions, visibility', 'Types, mappings, structs, events', 'msg.sender, msg.value, modifiers', 'Remix IDE'], ['Write and deploy a simple storage contract on a testnet', 'Write a basic token with balances']],
        ['Development workflow', ['Hardhat or Foundry projects', 'Writing tests for contracts', 'Deploy scripts and verification', 'Gas optimisation basics'], ['Test your token with 10 test cases', 'Deploy and verify it on a testnet']],
      ],
      k: [['Smart contract', 'Code deployed on a blockchain that runs exactly as written.'], ['Mapping', 'A key–value store in Solidity.'], ['Event', 'A log emitted for frontends to listen to.'], ['Modifier', 'Reusable checks before a function runs.']],
      m: ['No tests before deploying', 'Public functions that should be restricted', 'Expensive loops over unbounded arrays'],
      q: ['What does msg.sender contain?', 'Why emit events?', 'How do you restrict a function to the owner?'],
    },
    sec: {
      w: [
        ['Common vulnerabilities', ['Reentrancy and checks-effects-interactions', 'Integer issues and unchecked math', 'Access control bugs', 'Front-running'], ['Reproduce a reentrancy bug in a test and fix it', 'Use OpenZeppelin contracts instead of custom code']],
        ['Auditing practice', ['Reading audit reports', 'Static analysis tools (e.g. Slither)', 'Ethernaut or Damn Vulnerable DeFi challenges', 'Writing secure upgrade patterns'], ['Solve 5 Ethernaut levels', 'Run a static analyser on your contracts and fix findings']],
      ],
      k: [['Reentrancy', 'An external call re-enters your function before state is updated.'], ['Checks-effects-interactions', 'Update state before calling other contracts.'], ['Front-running', 'Someone sees your pending transaction and acts first.'], ['Audit', 'An expert review of contract security.']],
      m: ['Rolling your own token code', 'External calls before state updates', 'Trusting tx.origin for auth'],
      q: ['How does reentrancy work?', 'Why avoid tx.origin?', 'What does a static analyser catch?'],
    },
    dapp: {
      w: [
        ['Frontend + contract', ['Connecting a wallet (ethers.js/viem)', 'Reading and writing contract data', 'Listening to events', 'Handling network and errors'], ['Build a dApp that reads and updates your contract on a testnet', 'Show transaction status to the user']],
        ['Shipping', ['UX for transactions: pending, confirmed, failed', 'Indexing data (e.g. The Graph) at a high level', 'Security review of the frontend', 'Documentation and demo'], ['Deploy the frontend and write a README', 'Record a 2-minute demo video']],
      ],
      k: [['Wallet connection', 'The user approves your site to read their address.'], ['ABI', 'Describes contract functions so the frontend can call them.'], ['Provider', 'Connects your app to the blockchain.'], ['Confirmation', 'A transaction included in a block.']],
      m: ['No feedback while transactions are pending', 'Hard-coding mainnet addresses while testing', 'Asking for unnecessary wallet permissions'],
      q: ['What is an ABI?', 'How do you show a pending transaction?', 'Read vs write calls: which costs gas?'],
    },
  },
};
