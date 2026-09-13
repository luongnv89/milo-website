import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { render } from '../.vite-ssr/entry-server.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const html = render();

const indexPath = join(root, 'dist/index.html');
const index = readFileSync(indexPath, 'utf8');
const placeholder = '<div id="root"></div>';

if (!index.includes(placeholder)) {
  console.error(`prerender: ${placeholder} not found in dist/index.html`);
  process.exit(1);
}

writeFileSync(indexPath, index.replace(placeholder, `<div id="root">${html}</div>`));
rmSync(join(root, '.vite-ssr'), { recursive: true, force: true });

console.log(`prerender: injected ${Buffer.byteLength(html)} bytes of HTML into dist/index.html`);
