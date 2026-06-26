#!/usr/bin/env node
// Generates sitemap.xml (with hreflang alternates for the EN/ZH pairs) and
// robots.txt. Run `node scripts/gen-sitemap.mjs` to (re)write them; run with
// `--check` in CI to fail if they are out of date with the current pages.

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative, sep, basename } from "node:path";

const ROOT = process.cwd();
const SITE = "https://chengsh96.github.io";
const IGN = new Set([".git", ".claude", "node_modules", "scripts"]);
const CHECK = process.argv.includes("--check");

function walk(d, a = []) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    if (e.isDirectory()) { if (!IGN.has(e.name)) walk(join(d, e.name), a); }
    else if (e.name.endsWith(".html")) a.push(join(d, e.name));
  }
  return a;
}

const urlFor = (rel) =>
  basename(rel) === "index.html"
    ? `${SITE}/${rel.slice(0, -"index.html".length)}`
    : `${SITE}/${rel}`;

const pages = walk(ROOT).map((p) => relative(ROOT, p).split(sep).join("/")).sort();

// Pair each EN page with its ZH mirror for hreflang alternates.
function alternatesFor(rel) {
  const en = rel.startsWith("zh/") ? rel.slice(3) : rel;
  const zh = `zh/${en}`;
  const links = [];
  if (pages.includes(en)) links.push(`    <xhtml:link rel="alternate" hreflang="en" href="${urlFor(en)}"/>`);
  if (pages.includes(zh)) links.push(`    <xhtml:link rel="alternate" hreflang="zh-CN" href="${urlFor(zh)}"/>`);
  if (pages.includes(en)) links.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${urlFor(en)}"/>`);
  return links;
}

const body = pages
  .map((rel) => {
    const alts = alternatesFor(rel);
    return [`  <url>`, `    <loc>${urlFor(rel)}</loc>`, ...alts, `  </url>`].join("\n");
  })
  .join("\n");

const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
  `${body}\n</urlset>\n`;

const robots = `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`;

const outputs = [["sitemap.xml", sitemap], ["robots.txt", robots]];

if (CHECK) {
  let stale = 0;
  for (const [name, content] of outputs) {
    let current = "";
    try { current = readFileSync(join(ROOT, name), "utf8"); } catch {}
    if (current.replace(/\r\n/g, "\n") !== content) {
      stale++;
      console.error(`✗ ${name} is out of date — run \`npm run gen:sitemap\``);
    }
  }
  if (stale) process.exit(1);
  console.log("sitemap.xml and robots.txt are up to date. ✓");
} else {
  for (const [name, content] of outputs) {
    writeFileSync(join(ROOT, name), content);
    console.log("wrote", name);
  }
}
