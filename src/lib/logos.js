// Simplified, recognisable marks used inside the hero bubbles (decorative only).
const svg = (body, vb = '0 0 100 100') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="256" height="256">${body}</svg>`;

export const LOGOS = {
  github: {
    label: 'GitHub',
    svg: svg('<path fill="#efe6f8" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>', '0 0 16 16'),
  },
  javascript: {
    label: 'JavaScript',
    svg: svg('<rect x="8" y="8" width="84" height="84" rx="10" fill="#F7DF1E"/><text x="86" y="84" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="40" fill="#1a1a1a">JS</text>'),
  },
  python: {
    label: 'Python',
    svg: svg('<g><path fill="#3a74b4" d="M49 6c-21 0-20 9-20 9v10h21v3H20S6 26 6 48s12 21 12 21h8V58s0-12 12-12h21s11 0 11-11V17S72 6 49 6z"/><circle cx="38" cy="15" r="3.6" fill="#fff"/><g transform="rotate(180 50 50)"><path fill="#ffd43b" d="M49 6c-21 0-20 9-20 9v10h21v3H20S6 26 6 48s12 21 12 21h8V58s0-12 12-12h21s11 0 11-11V17S72 6 49 6z"/><circle cx="38" cy="15" r="3.6" fill="#fff"/></g></g>'),
  },
  react: {
    label: 'React',
    svg: svg('<g fill="none" stroke="#61DAFB" stroke-width="5"><ellipse cx="50" cy="50" rx="42" ry="16"/><ellipse cx="50" cy="50" rx="42" ry="16" transform="rotate(60 50 50)"/><ellipse cx="50" cy="50" rx="42" ry="16" transform="rotate(120 50 50)"/></g><circle cx="50" cy="50" r="8" fill="#61DAFB"/>'),
  },
  vscode: {
    label: 'VS Code',
    svg: svg('<path fill="#0078d4" fill-rule="evenodd" d="M72 6 92 16v68L72 94 34 58 16 72 8 68V32l8-4 18 14L72 6zm0 26L46 50l26 18V32zM16 40v20l10-10-10-10z"/><path fill="#3aa0f0" d="M72 6 92 16v34H72z" opacity=".55"/>'),
  },
  gfg: {
    label: 'GeeksforGeeks',
    svg: svg('<g font-family="Arial Black, Arial, Helvetica, sans-serif" font-weight="900" font-size="54" fill="#2f8d46"><text x="49" y="69">G</text><g transform="translate(100 0) scale(-1 1)"><text x="49" y="69">G</text></g></g>'),
  },
  typescript: {
    label: 'TypeScript',
    svg: svg('<rect x="8" y="8" width="84" height="84" rx="10" fill="#3178C6"/><text x="86" y="84" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="40" fill="#fff">TS</text>'),
  },
  cpp: {
    label: 'C++',
    svg: svg('<path fill="#00599C" d="M50 4 90 27v46L50 96 10 73V27z"/><path fill="#004482" d="M50 96 90 73V27L50 50z"/><text x="50" y="62" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="30" fill="#fff">C++</text>'),
  },
  java: {
    label: 'Java',
    svg: svg('<g fill="none" stroke="#e76f00" stroke-width="5" stroke-linecap="round"><path d="M44 10c-10 10 10 14 0 26M58 14c-8 8 8 11 0 22"/></g><path fill="#5382a1" d="M22 46h50v14c0 16-11 26-25 26S22 76 22 60z"/><path fill="none" stroke="#5382a1" stroke-width="6" d="M72 52c12 0 12 16 0 16"/><ellipse cx="47" cy="92" rx="32" ry="5" fill="#5382a1"/>'),
  },
  go: {
    label: 'Go',
    svg: svg('<text x="50" y="66" text-anchor="middle" font-family="Arial Black, Arial, Helvetica, sans-serif" font-style="italic" font-weight="900" font-size="46" fill="#00ADD8">GO</text><g stroke="#00ADD8" stroke-width="4" stroke-linecap="round"><path d="M6 40h14M2 50h16M8 60h10"/></g>'),
  },
  rust: {
    label: 'Rust',
    svg: svg('<circle cx="50" cy="50" r="38" fill="none" stroke="#f0e2d0" stroke-width="12" stroke-dasharray="7 5"/><circle cx="50" cy="50" r="30" fill="#f0e2d0"/><text x="50" y="65" text-anchor="middle" font-family="Arial Black, Arial, Helvetica, sans-serif" font-weight="900" font-size="40" fill="#1b1015">R</text>'),
  },
  kotlin: {
    label: 'Kotlin',
    svg: svg('<defs><linearGradient id="k" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#E44857"/><stop offset=".5" stop-color="#C711E1"/><stop offset="1" stop-color="#7F52FF"/></linearGradient></defs><path fill="url(#k)" d="M12 12h76L50 50l38 38H12z"/>'),
  },
  swift: {
    label: 'Swift',
    svg: svg('<rect x="8" y="8" width="84" height="84" rx="20" fill="#F05138"/><path fill="#fff" d="M74 64c4-12-2-28-18-40 8 9 12 20 9 29C52 44 36 34 26 26c8 10 16 18 22 24-9-5-19-11-26-17 6 10 15 20 26 28-10 4-22 3-30-3 10 13 30 18 46 9 4 0 8 2 10 6 2-4 2-7 0-9z"/>'),
  },
  php: {
    label: 'PHP',
    svg: svg('<ellipse cx="50" cy="50" rx="46" ry="26" fill="#777BB4"/><text x="50" y="61" text-anchor="middle" font-family="Arial Black, Arial, Helvetica, sans-serif" font-style="italic" font-weight="900" font-size="30" fill="#fff">php</text>'),
  },
  ruby: {
    label: 'Ruby',
    svg: svg('<path fill="#CC342D" d="M28 18h44l18 22-40 46L10 40z"/><path fill="#E8564B" d="M28 18 50 40 72 18zM10 40h80L50 86z" opacity=".65"/><path fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2" d="M10 40h80M28 18l22 22 22-22M50 40v46"/>'),
  },
  dart: {
    label: 'Dart',
    svg: svg('<path fill="#0175C2" d="M28 12 12 28v44l16 16h44l16-16-44-60z"/><path fill="#13B9FD" d="M28 12h38l22 22v38L28 12z"/>'),
  },
  docker: {
    label: 'Docker',
    svg: svg('<g fill="#2496ED"><path d="M8 52h76c6-6 10-6 14-4-2 4-6 6-10 6-6 18-24 28-46 28C20 82 10 70 8 52z"/><g><rect x="18" y="40" width="10" height="9"/><rect x="30" y="40" width="10" height="9"/><rect x="42" y="40" width="10" height="9"/><rect x="54" y="40" width="10" height="9"/><rect x="30" y="29" width="10" height="9"/><rect x="42" y="29" width="10" height="9"/><rect x="54" y="29" width="10" height="9"/><rect x="42" y="18" width="10" height="9"/></g></g>'),
  },
  git: {
    label: 'Git',
    svg: svg('<rect x="18" y="18" width="64" height="64" rx="10" fill="#F05032" transform="rotate(45 50 50)"/><g stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none"><path d="M38 28 50 40v26M50 40l14 14"/></g><g fill="#fff"><circle cx="50" cy="40" r="6"/><circle cx="50" cy="68" r="6"/><circle cx="64" cy="54" r="6"/></g>'),
  },
  node: {
    label: 'Node.js',
    svg: svg('<path fill="#5FA04E" d="M50 6 88 28v44L50 94 12 72V28z"/><text x="50" y="60" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="26" fill="#fff">node</text>'),
  },
  sql: {
    label: 'SQL',
    svg: svg('<g fill="#cdb9ec"><ellipse cx="50" cy="22" rx="32" ry="11"/><path d="M18 22v56c0 6 14 11 32 11s32-5 32-11V22c0 6-14 11-32 11S18 28 18 22z" opacity=".75"/></g><text x="50" y="68" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="22" fill="#2a1534">SQL</text>'),
  },
  html: {
    label: 'HTML5',
    svg: svg('<path fill="#E34F26" d="M14 8h72l-7 76-29 8-29-8z"/><path fill="#EF652A" d="M50 14v72l23-6 6-66z"/><text x="50" y="66" text-anchor="middle" font-family="Arial Black, Arial, Helvetica, sans-serif" font-weight="900" font-size="40" fill="#fff">5</text>'),
  },
  css: {
    label: 'CSS',
    svg: svg('<path fill="#1572B6" d="M14 8h72l-7 76-29 8-29-8z"/><path fill="#33A9DC" d="M50 14v72l23-6 6-66z"/><text x="50" y="66" text-anchor="middle" font-family="Arial Black, Arial, Helvetica, sans-serif" font-weight="900" font-size="40" fill="#fff">3</text>'),
  },
};

// Composed on screen at first paint; the rest drift in from the sides.
export const HERO_LOGOS = ['github', 'javascript', 'vscode', 'python', 'react', 'gfg'];
export const DRIFT_LOGOS = ['typescript', 'cpp', 'java', 'go', 'rust', 'kotlin', 'swift', 'php', 'ruby', 'dart', 'docker', 'git', 'node', 'sql', 'html', 'css'];

export const svgDataUrl = (s) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(s)}`;
