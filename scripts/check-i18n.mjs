#!/usr/bin/env node
// Bilingual structure check.
//
// 1. Page-set parity: every English page has a matching zh/ mirror and every
//    zh/ page has an English original.
// 2. lang attribute: zh/ pages declare a Chinese lang (zh*), all others "en".

import { readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = process.cwd();
const IGNORE_DIRS = new Set([".git", ".claude", "node_modules", "scripts", "src"]);

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

const pages = walk(ROOT).map((p) => relative(ROOT, p).split(sep).join("/"));
const pageSet = new Set(pages);
const errors = [];

for (const rel of pages) {
  if (rel.startsWith("zh/")) {
    const en = rel.slice(3);
    if (!pageSet.has(en)) errors.push(`${rel}: no English original at ${en}`);
  } else {
    const zh = `zh/${rel}`;
    if (!pageSet.has(zh)) errors.push(`${rel}: no Chinese mirror at ${zh}`);
  }
}

for (const rel of pages) {
  const m = readFileSync(join(ROOT, rel), "utf8").match(/<html[^>]*\blang="([^"]*)"/);
  const lang = m ? m[1] : null;
  const expectZh = rel.startsWith("zh/");
  if (!lang) errors.push(`${rel}: <html> has no lang attribute`);
  else if (expectZh && !/^zh\b/i.test(lang)) errors.push(`${rel}: lang="${lang}" but expected a zh* value`);
  else if (!expectZh && lang.toLowerCase() !== "en") errors.push(`${rel}: lang="${lang}" but expected "en"`);
}

console.log(`Checked bilingual structure across ${pages.length} page(s).`);
if (errors.length) {
  console.error(`\n${errors.length} i18n issue(s):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log("EN/ZH page sets mirror and lang attributes are correct.");
