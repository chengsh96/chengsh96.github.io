#!/usr/bin/env node
// SEO / social-meta completeness check.
//
// Every page must have the tags that make it shareable and indexable:
//   - a non-empty <title> and meta description
//   - og:title, og:description, og:url
//   - a canonical link
//   - a viewport meta
//   - exactly one <h1>
//
// canonical and og:url are also checked for the *correct value* (derived from
// the file's path) so a copy-pasted page can't silently point search engines
// and share cards at the wrong URL.

import { readdirSync, readFileSync } from "node:fs";
import { join, relative, sep, basename } from "node:path";

const ROOT = process.cwd();
const SITE = "https://chengsh96.github.io";
const IGN = new Set([".git", ".claude", "node_modules", "scripts"]);

function walk(d, a = []) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    if (e.isDirectory()) { if (!IGN.has(e.name)) walk(join(d, e.name), a); }
    else if (e.name.endsWith(".html")) a.push(join(d, e.name));
  }
  return a;
}

function canonicalFor(rel) {
  if (basename(rel) === "index.html") return `${SITE}/${rel.slice(0, -"index.html".length)}`;
  return `${SITE}/${rel}`;
}

const attr = (txt, re) => (txt.match(re) || [, null])[1];

const pages = walk(ROOT).map((p) => relative(ROOT, p).split(sep).join("/"));
const errors = [];

for (const rel of pages) {
  const txt = readFileSync(join(ROOT, rel), "utf8");
  const fail = (m) => errors.push(`${rel}: ${m}`);

  const title = attr(txt, /<title>([\s\S]*?)<\/title>/);
  if (!title || !title.trim()) fail("missing/empty <title>");

  const desc = attr(txt, /<meta[^>]+name="description"[^>]+content="([^"]*)"/);
  if (!desc || !desc.trim()) fail("missing/empty meta description");

  if (!attr(txt, /property="og:title"[^>]*content="([^"]*)"/)) fail("missing og:title");
  if (!attr(txt, /property="og:description"[^>]*content="([^"]*)"/)) fail("missing og:description");
  if (!/name="viewport"/.test(txt)) fail("missing viewport meta");

  const h1Count = (txt.match(/<h1[\s>]/g) || []).length;
  if (h1Count === 0) fail("no <h1>");
  else if (h1Count > 1) fail(`${h1Count} <h1> elements (expected exactly 1)`);

  const expected = canonicalFor(rel);
  const canonical = attr(txt, /rel="canonical"[^>]*href="([^"]*)"/);
  if (!canonical) fail("missing canonical link");
  else if (canonical !== expected) fail(`canonical is "${canonical}", expected "${expected}"`);

  const ogUrl = attr(txt, /property="og:url"[^>]*content="([^"]*)"/);
  if (!ogUrl) fail("missing og:url");
  else if (ogUrl !== expected) fail(`og:url is "${ogUrl}", expected "${expected}"`);
}

console.log(`Checked SEO meta on ${pages.length} page(s).`);
if (errors.length) {
  console.error(`\n${errors.length} SEO issue(s):`);
  for (const e of errors) console.error("  ✗ " + e);
  process.exit(1);
}
console.log("All pages have complete, correct SEO/social meta. ✓");
