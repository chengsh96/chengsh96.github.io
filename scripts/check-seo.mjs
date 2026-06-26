#!/usr/bin/env node
// SEO / social-meta completeness check.
//
// Every page must have the tags that make it shareable and indexable:
//   - a non-empty <title> and meta description
//   - og:title, og:description, og:url, og:image
//   - twitter:card, twitter:image
//   - a canonical link
//   - a viewport meta
//   - exactly one <h1>
//
// canonical and og:url are also checked for the correct value derived from
// the file path, so a copied page cannot silently point search engines and
// share cards at the wrong URL.

import { readdirSync, readFileSync } from "node:fs";
import { basename, join, relative, sep } from "node:path";

const ROOT = process.cwd();
const SITE = "https://chengsh96.github.io";
const IGNORE_DIRS = new Set([".git", ".claude", "node_modules", "scripts"]);

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

function canonicalFor(rel) {
  if (basename(rel) === "index.html") return `${SITE}/${rel.slice(0, -"index.html".length)}`;
  return `${SITE}/${rel}`;
}

function attr(txt, re) {
  return (txt.match(re) || [, null])[1];
}

function isAbsoluteUrl(value) {
  return /^https?:\/\//.test(value);
}

const pages = walk(ROOT).map((p) => relative(ROOT, p).split(sep).join("/"));
const errors = [];

for (const rel of pages) {
  const txt = readFileSync(join(ROOT, rel), "utf8");
  const fail = (message) => errors.push(`${rel}: ${message}`);

  const title = attr(txt, /<title>([\s\S]*?)<\/title>/);
  if (!title || !title.trim()) fail("missing/empty <title>");

  const desc = attr(txt, /<meta[^>]+name="description"[^>]+content="([^"]*)"/);
  if (!desc || !desc.trim()) fail("missing/empty meta description");

  if (!attr(txt, /property="og:title"[^>]*content="([^"]*)"/)) fail("missing og:title");
  if (!attr(txt, /property="og:description"[^>]*content="([^"]*)"/)) fail("missing og:description");

  const ogImage = attr(txt, /property="og:image"[^>]*content="([^"]*)"/);
  if (!ogImage) fail("missing og:image");
  else if (!isAbsoluteUrl(ogImage)) fail(`og:image is not absolute: "${ogImage}"`);

  if (!attr(txt, /name="twitter:card"[^>]*content="([^"]*)"/)) fail("missing twitter:card");
  const twitterImage = attr(txt, /name="twitter:image"[^>]*content="([^"]*)"/);
  if (!twitterImage) fail("missing twitter:image");
  else if (!isAbsoluteUrl(twitterImage)) fail(`twitter:image is not absolute: "${twitterImage}"`);

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
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log("All pages have complete, correct SEO/social meta.");
