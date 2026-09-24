/**
 * Independent check that `dist` is publishable. Run by CI and before deploy.
 *
 * Paths are listed literally rather than imported from `emit-route-pages.js`:
 * a check that imports what it checks fails open when that thing breaks.
 */

import { readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist');

const REQUIRED = [
  'index.html',
  '404.html',
  'sitemap.xml',
  'robots.txt',
  'CNAME',
  'notes/index.html',
  'roadmap/index.html',
  'about/index.html',
  'projects/terranova/index.html',
  'projects/abridgd/index.html',
  'projects/folio/index.html',
];

/** These redirect to '/', so serving them as pages would mislead crawlers. */
const MUST_NOT_EXIST = [];

const problems = [];

for (const path of REQUIRED) {
  try {
    if (statSync(join(dist, path)).size === 0) problems.push(`dist/${path} is empty`);
  } catch {
    problems.push(`dist/${path} is missing`);
  }
}

for (const path of MUST_NOT_EXIST) {
  try {
    statSync(join(dist, path));
    problems.push(`dist/${path} should not be pre-rendered`);
  } catch {
    /* expected */
  }
}

/*
 * The custom domain lives in the Pages artifact, not only in the repository's
 * settings: a deploy whose artifact has no CNAME clears the custom domain, which
 * would point mccal.dev at nothing and leave the old host redirecting to it. So a
 * build that loses or changes this file fails here rather than in production.
 */
const DOMAIN = 'mccal.dev';
try {
  const cname = readFileSync(join(dist, 'CNAME'), 'utf8').trim();
  if (cname !== DOMAIN) problems.push(`dist/CNAME says "${cname}", expected "${DOMAIN}"`);
} catch {
  /* already reported as missing above */
}

// Route pages carry their content in the HTML, not just an empty app shell.
const RENDERED = {
  'index.html': 'Photojournalist &amp; Developer',
  'about/index.html': 'Photojournalist &amp; Developer',
  'projects/terranova/index.html': 'An offline design studio for Hytale World Generation V2.',
  'projects/abridgd/index.html': 'Where it stands',
  'projects/folio/index.html': 'Why I made this',
};
for (const [path, text] of Object.entries(RENDERED)) {
  try {
    const page = readFileSync(join(dist, path), 'utf8');
    if (page.includes('<div id="root"></div>')) problems.push(`dist/${path} was not pre-rendered`);
    else if (!page.includes(text)) problems.push(`dist/${path} is missing "${text}"`);
  } catch {
    /* already reported as missing above */
  }
}

// The 404 page renders on the client, so its root must stay empty.
try {
  if (!readFileSync(join(dist, '404.html'), 'utf8').includes('<div id="root"></div>')) {
    problems.push('dist/404.html should ship an empty root');
  }
} catch {
  /* already reported as missing above */
}

// The CSP is the site's only remaining security control. Check a route page.
try {
  const page = readFileSync(join(dist, 'notes/index.html'), 'utf8');
  if (!page.includes('http-equiv="Content-Security-Policy"')) {
    problems.push('dist/notes/index.html has no CSP meta tag');
  }
  if (!page.includes('rel="canonical" href="https://mccal-codes.github.io/notes/"')) {
    problems.push('dist/notes/index.html has no canonical, or it points elsewhere');
  }
  if (page.includes('vercel')) problems.push('dist/notes/index.html still references vercel');
} catch {
  /* already reported as missing above */
}

if (problems.length) {
  console.error('verify-dist: dist is not publishable');
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

console.log(`verify-dist: ok (${REQUIRED.length} required paths present)`);
