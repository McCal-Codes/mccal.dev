/**
 * Post-build step, run by `npm run build`.
 *
 * GitHub Pages has no rewrite mechanism, so deep links need real files. Emits
 * one `<route>/index.html` per known route, plus `404.html` as the catch-all.
 *
 * Also injects the CSP, which is not committed into `index.html` because
 * `script-src 'self'` would break `vite dev` and its inline HMR script.
 *
 * The route list is hardcoded, then verified against the content files. The
 * regexes only check, never generate, so a format change fails the build.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const serverEntry = join(root, 'dist-server', 'entry-server.js');

const SITE_URL = 'https://mccal.dev';

const STATIC_ROUTES = ['/', '/notes', '/roadmap', '/about'];

/** Projects with a case study. These get a pre-rendered page. */
const CASE_STUDY_SLUGS = ['terranova', 'abridgd', 'folio'];

/** Every project in the index, including those without a case study. */
const ALL_SLUGS = ['terranova', 'abridgd', 'folio'];

/**
 * `frame-ancestors`, `report-uri`/`report-to` and `sandbox` are ignored in a
 * meta policy, so they are omitted rather than written and silently dropped.
 */
const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "form-action 'self'",
  "img-src 'self' data:",
  "font-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self'",
  "connect-src 'self'",
  "manifest-src 'self'",
  'upgrade-insecure-requests',
].join('; ');

function fail(message) {
  console.error(`emit-route-pages: ${message}`);
  process.exit(1);
}

/** The canonical host lives in two places. Neither may drift. */
function assertSiteUrl() {
  const source = readFileSync(join(root, 'src/content/site.ts'), 'utf8');
  if (!source.includes(`url: '${SITE_URL}'`)) {
    fail(`src/content/site.ts does not declare url: '${SITE_URL}'.`);
  }
}

/**
 * Anchored at four spaces: nested empty arrays (`callouts: []`) sit deeper and
 * must not be mistaken for a project without a case study.
 */
function assertSlugs() {
  const source = readFileSync(join(root, 'src/content/projects.ts'), 'utf8');

  const found = [...source.matchAll(/^ {4}slug: '([^']+)',$/gm)].map((m) => m[1]);
  if (found.length === 0) {
    fail('parsed no slugs from src/content/projects.ts -- the format changed.');
  }

  const missing = found.filter((s) => !ALL_SLUGS.includes(s));
  const stale = ALL_SLUGS.filter((s) => !found.includes(s));
  if (missing.length || stale.length) {
    fail(
      `slug drift in src/content/projects.ts.` +
        (missing.length ? ` Not in ALL_SLUGS: ${missing.join(', ')}.` : '') +
        (stale.length ? ` In ALL_SLUGS but not the file: ${stale.join(', ')}.` : '') +
        ' Update ALL_SLUGS and CASE_STUDY_SLUGS in scripts/emit-route-pages.js.',
    );
  }

  // An empty `sections` redirects to '/' (ProjectPage.tsx), so it is not a page.
  const blocks = source.split(/^ {2}\{$/m).slice(1);
  const derived = [];
  for (const block of blocks) {
    const slug = block.match(/^ {4}slug: '([^']+)',$/m)?.[1];
    if (!slug) continue;
    if (!/^ {4}sections: \[\],$/m.test(block)) derived.push(slug);
  }

  const added = derived.filter((s) => !CASE_STUDY_SLUGS.includes(s));
  const removed = CASE_STUDY_SLUGS.filter((s) => !derived.includes(s));
  if (added.length || removed.length) {
    fail(
      'case-study drift in src/content/projects.ts.' +
        (added.length ? ` Now has sections, not pre-rendered: ${added.join(', ')}.` : '') +
        (removed.length ? ` Listed but has no sections: ${removed.join(', ')}.` : '') +
        ' Update CASE_STUDY_SLUGS in scripts/emit-route-pages.js.',
    );
  }
}

/** Trailing-slash form. GitHub Pages 301s `/notes` to `/notes/`. */
function href(route) {
  return route === '/' ? `${SITE_URL}/` : `${SITE_URL}${route}/`;
}

/** A meta CSP only governs what is parsed after it, so it goes in first. */
function injectHead(html) {
  const anchor = '<meta charset="UTF-8" />';
  if (!html.includes(anchor)) fail(`dist/index.html has no ${anchor} to anchor the CSP to.`);

  const tags = [
    `<meta http-equiv="Content-Security-Policy" content="${CSP}" />`,
    '<meta name="referrer" content="strict-origin-when-cross-origin" />',
  ].join('\n    ');

  return html.replace(anchor, `${anchor}\n    ${tags}`);
}

/** Points canonical and og:url at this specific route rather than the site root. */
function setCanonical(html, url) {
  const withOg = html.replace(
    /<meta property="og:url" content="[^"]*" \/>/,
    `<meta property="og:url" content="${url}" />`,
  );
  return withOg.replace('</head>', `  <link rel="canonical" href="${url}" />\n  </head>`);
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Puts the pre-rendered markup in the root and the page's own title in the head. */
function withContent(html, { html: markup, title, description }) {
  const root = '<div id="root"></div>';
  if (!html.includes(root)) fail(`dist/index.html has no empty ${root} to render into.`);

  const t = escapeHtml(title);
  const d = escapeHtml(description);
  return html
    .replace(root, `<div id="root">${markup}</div>`)
    .replace(/<title>[^<]*<\/title>/, `<title>${t}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${d}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${t}$2`)
    .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${d}$2`);
}

function write(relativePath, contents) {
  const target = join(dist, relativePath);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, contents);
  console.log(`  dist/${relativePath}`);
}

assertSiteUrl();
assertSlugs();

if (!existsSync(join(dist, 'index.html'))) {
  fail('dist/index.html is missing -- run vite build first.');
}

if (!existsSync(serverEntry)) {
  fail('dist-server/entry-server.js is missing -- run vite build --ssr first.');
}

const { render } = await import(pathToFileURL(serverEntry).href);
const shell = injectHead(readFileSync(join(dist, 'index.html'), 'utf8'));
const routes = [...STATIC_ROUTES, ...CASE_STUDY_SLUGS.map((slug) => `/projects/${slug}`)];

console.log('emit-route-pages: writing');
for (const route of routes) {
  const path = route === '/' ? 'index.html' : `${route.slice(1)}/index.html`;
  const rendered = await render(route);
  write(path, setCanonical(withContent(shell, rendered), href(route)));
}

// Catch-all, served under a real HTTP 404. No canonical: it is not a page.
write('404.html', shell);

const urls = routes
  .map((route) => `  <url>\n    <loc>${href(route)}</loc>\n  </url>`)
  .join('\n');
write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);
