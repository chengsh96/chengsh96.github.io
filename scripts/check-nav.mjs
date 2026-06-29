#!/usr/bin/env node
// Navigation consistency checker.
//
// The header nav is duplicated as desktop .navLinks and mobile .mobileMenu
// across every page. This verifies:
// 1. Every page has both menus.
// 2. Desktop and mobile menus are identical on each page.
// 3. Each page matches its language homepage after resolving relative hrefs.

import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { posix } from "node:path";

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

const toPosix = (p) => p.split(sep).join("/");

function resolveDest(pageRel, href) {
  const [rawPath, frag] = href.split("#");
  const pageDir = posix.dirname(pageRel);
  let destPath;
  if (rawPath === "") {
    destPath = pageRel;
  } else if (rawPath.startsWith("/")) {
    destPath = posix.normalize(rawPath.slice(1));
  } else {
    destPath = posix.normalize(posix.join(pageDir, rawPath));
  }
  return frag ? `${destPath}#${frag}` : destPath;
}

function extractNav(html, containerRe) {
  const m = html.match(containerRe);
  if (!m) return null;
  const items = [];
  for (const a of m[1].matchAll(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)) {
    items.push({ label: a[2].replace(/\s+/g, " ").trim(), href: a[1].trim() });
  }
  return items;
}

const DESKTOP_RE = /<nav class="navLinks">([\s\S]*?)<\/nav>/;
const MOBILE_RE = /<div class="mobileMenu"[^>]*>([\s\S]*?)<\/div>/;

const pages = walk(ROOT).map((abs) => toPosix(relative(ROOT, abs)));
const errors = [];
const parsed = new Map();

for (const page of pages) {
  const html = readFileSync(join(ROOT, page), "utf8");
  const desktopRaw = extractNav(html, DESKTOP_RE);
  const mobileRaw = extractNav(html, MOBILE_RE);

  if (!desktopRaw) errors.push(`${page}: no desktop nav (.navLinks) found`);
  if (!mobileRaw) errors.push(`${page}: no mobile nav (.mobileMenu) found`);
  if (!desktopRaw || !mobileRaw) continue;

  const resolve = (items) =>
    items.map((i) => ({ label: i.label, dest: resolveDest(page, i.href) }));

  parsed.set(page, { desktop: resolve(desktopRaw), mobile: resolve(mobileRaw) });
}

const homepageFor = (page) => (page.startsWith("zh/") ? "zh/index.html" : "index.html");

function diffSeq(actual, expected) {
  if (actual.length !== expected.length) return `item count ${actual.length} vs expected ${expected.length}`;
  for (let i = 0; i < actual.length; i++) {
    if (actual[i].label !== expected[i].label) {
      return `item ${i + 1} label "${actual[i].label}" vs expected "${expected[i].label}"`;
    }
    if (actual[i].dest !== expected[i].dest) {
      return `item ${i + 1} "${actual[i].label}" -> ${actual[i].dest} vs expected ${expected[i].dest}`;
    }
  }
  return null;
}

for (const [page, nav] of parsed) {
  const parity = diffSeq(nav.desktop, nav.mobile);
  if (parity) errors.push(`${page}: desktop/mobile menus differ - ${parity}`);

  const home = parsed.get(homepageFor(page));
  if (!home) {
    errors.push(`${page}: cannot find canonical homepage ${homepageFor(page)}`);
    continue;
  }
  if (page === homepageFor(page)) continue;

  const drift = diffSeq(nav.desktop, home.desktop);
  if (drift) errors.push(`${page}: nav differs from ${homepageFor(page)} - ${drift}`);
}

console.log(`Checked nav on ${parsed.size} page(s).`);
if (errors.length) {
  console.error(`\n${errors.length} nav issue(s):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log("All nav menus are consistent.");
