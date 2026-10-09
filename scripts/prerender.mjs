// Build step (runs after `vite build` and the SSR build, see package.json):
// renders every page to static HTML and writes it into dist/, so search
// engines and link scrapers that don't run JavaScript get real content and
// per-page title/description/preview tags. Netlify serves /work from
// work.html, /back-pocket/font-saver from back-pocket/font-saver.html, etc.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
const SITE = "https://theshortpant.com";

const { render, PAGES } = await import(pathToFileURL(resolve(root, "dist-ssr/entry-server.js")).href);
const template = readFileSync(resolve(dist, "index.html"), "utf8");

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Swaps one tag's value in the template, failing loudly if the tag has gone
// missing from index.html (so a renamed tag can't silently ship stale meta).
function swap(html, pattern, replacement, label) {
  if (!pattern.test(html)) throw new Error(`prerender: ${label} not found in index.html`);
  return html.replace(pattern, replacement);
}
const meta = (html, attr, key, value) =>
  swap(html, new RegExp(`<meta ${attr}="${key}" content="[^"]*" />`), `<meta ${attr}="${key}" content="${esc(value)}" />`, key);

for (const page of PAGES) {
  const url = SITE + (page.path === "/" ? "/" : page.path);
  const ogTitle = page.ogTitle ?? page.title;
  let html = template;

  html = swap(html, /<title>[^<]*<\/title>/, `<title>${esc(page.title)}</title>`, "<title>");
  html = meta(html, "name", "description", page.description);
  html = swap(html, /<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`, "canonical");
  html = meta(html, "property", "og:url", url);
  html = meta(html, "property", "og:title", ogTitle);
  html = meta(html, "property", "og:description", page.description);
  html = meta(html, "name", "twitter:title", ogTitle);
  html = meta(html, "name", "twitter:description", page.description);
  if (page.image) {
    // A page's own image (its Back Pocket card) replaces the default share
    // card; its pixel size differs, so drop the default's size/alt tags.
    html = meta(html, "property", "og:image", SITE + page.image);
    html = meta(html, "name", "twitter:image", SITE + page.image);
    html = html.replace(/\s*<meta property="og:image:(width|height|alt)" content="[^"]*" \/>/g, "");
  }

  html = swap(html, /<div id="root"><\/div>/, `<div id="root" data-prerendered>${render(page.path)}</div>`, "#root");

  const out = resolve(dist, page.file);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  console.log(`prerendered ${page.path.padEnd(32)} → dist/${page.file}`);
}
