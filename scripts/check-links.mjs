#!/usr/bin/env node
// Zero-dependency link checker for the static site.
// Verifies every local href/src/poster resolves to a file on disk, and every
// same-site #fragment points at an element id that exists. External links are
// intentionally not fetched because common hosts can make CI flaky.

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, normalize, relative, resolve, sep } from "node:path";

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

const idCache = new Map();
function idsOf(file) {
  if (idCache.has(file)) return idCache.get(file);
  const ids = new Set();
  if (existsSync(file) && statSync(file).isFile()) {
    const txt = readFileSync(file, "utf8");
    for (const m of txt.matchAll(/\bid="([^"]+)"/g)) ids.add(m[1]);
    for (const m of txt.matchAll(/<a[^>]*\bname="([^"]+)"/g)) ids.add(m[1]);
  }
  idCache.set(file, ids);
  return ids;
}

const htmlFiles = walk(ROOT);
let checked = 0;
const errors = [];

for (const file of htmlFiles) {
  const baseDir = dirname(file);
  const txt = readFileSync(file, "utf8");
  const rel = relative(ROOT, file).split(sep).join("/");

  for (const m of txt.matchAll(/(?:href|src|poster)="([^"]+)"/g)) {
    const url = m[1].trim();
    if (!url) continue;
    if (/^(https?:|mailto:|tel:|data:|javascript:|\/\/)/i.test(url)) continue;

    const [pathPart, frag] = url.split("#");

    if (pathPart === "") {
      if (frag && frag !== "top" && !idsOf(file).has(frag)) {
        errors.push(`${rel} -> "${url}" (no element with id="${frag}")`);
      }
      checked++;
      continue;
    }

    const clean = pathPart.split("?")[0];
    const target = clean.startsWith("/")
      ? normalize(join(ROOT, clean))
      : normalize(resolve(baseDir, clean));
    checked++;

    if (!existsSync(target)) {
      errors.push(`${rel} -> "${url}" (missing file: ${relative(ROOT, target).split(sep).join("/")})`);
      continue;
    }

    if (frag && frag !== "top" && target.endsWith(".html") && !idsOf(target).has(frag)) {
      errors.push(`${rel} -> "${url}" (no id="${frag}" in ${relative(ROOT, target).split(sep).join("/")})`);
    }
  }
}

console.log(`Checked ${checked} local references across ${htmlFiles.length} HTML files.`);
if (errors.length) {
  console.error(`\n${errors.length} broken reference(s):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log("All local links and anchors resolve.");
