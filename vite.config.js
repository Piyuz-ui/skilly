import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Files from public/ the app shell needs offline.
const PUBLIC_FILES = ['site.webmanifest', 'favicon.ico', 'favicon-32.png', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png'];
// Big files only some visitors need: cached the first time they're used instead.
const SKIP = /(catalog|index\.esm|bubbleScene)-/;

// Writes dist/sw.js (from src/pwa/sw-template.js) with the list of files to
// save for offline use. The version changes whenever any file changes.
function serviceWorker() {
  return {
    name: 'skilly-service-worker',
    apply: 'build',
    generateBundle(_, bundle) {
      const files = Object.values(bundle)
        .map((f) => f.fileName)
        .filter((f) => f !== 'index.html' && /\.(js|css)$/.test(f) && !SKIP.test(f))
        .sort();
      const precache = ['./', ...files.map((f) => `./${f}`), ...PUBLIC_FILES.map((f) => `./${f}`)];
      const hash = createHash('sha256');
      for (const f of Object.values(bundle)) hash.update(f.fileName).update(f.type === 'chunk' ? f.code : String(f.source));
      const source = readFileSync(new URL('./src/pwa/sw-template.js', import.meta.url), 'utf8')
        .replace("'__VERSION__'", JSON.stringify(hash.digest('hex').slice(0, 12)))
        .replace('__PRECACHE__', JSON.stringify(precache, null, 2));
      this.emitFile({ type: 'asset', fileName: 'sw.js', source });
    },
  };
}

export default defineConfig({
  plugins: [react(), serviceWorker()],
  base: './',
  build: { chunkSizeWarningLimit: 1000 },
});
