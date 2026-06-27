#!/usr/bin/env node
// Generate sitemap.xml with hreflang alternates for EN/ZH pairs and robots.txt.
// Run `node scripts/gen-sitemap.mjs` to write files, or pass `--check` in CI
// to fail if they are out of date.

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join, relative, sep } from "node:path";

const ROOT = process.cwd();
const SITE = "https://chengsh96.github.io";
const IGNORE_DIRS = new Set([".git", ".claude", "node_modules", "scripts"]);
const CHECK = process.argv.includes("--check");

function walk(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!IGNORE_DIRS.has(entry.name)) walk(join(dir, entry.name), files);
    } else if (entry.name.endsWith(".html")) {
      files.push(join(dir, entry.name));
    }
  }
  return files;
}

function urlFor(rel) {
  if (basename(rel) === "index.html") return `${SITE}/${rel.slice(0, -"index.html".length)}`;
  return `${SITE}/${rel}`;
}

const pages = walk(ROOT).map((p) => relative(ROOT, p).split(sep).join("/")).sort();

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
  .map((rel) => [`  <url>`, `    <loc>${urlFor(rel)}</loc>`, ...alternatesFor(rel), `  </url>`].join("\n"))
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
    try {
      current = readFileSync(join(ROOT, name), "utf8");
    } catch {
      current = "";
    }
    if (current.replace(/\r\n/g, "\n") !== content) {
      stale++;
      console.error(`${name} is out of date - run npm run gen:sitemap`);
    }
  }
  if (stale) process.exit(1);
  console.log("sitemap.xml and robots.txt are up to date.");
} else {
  for (const [name, content] of outputs) {
    writeFileSync(join(ROOT, name), content);
    console.log("wrote", name);
  }
}
