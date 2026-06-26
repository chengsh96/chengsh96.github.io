#!/usr/bin/env node
// Navigation consistency checker.
//
// The site's header nav is a fixed menu duplicated (a) twice per page
// (desktop `.navLinks` + `.mobileMenu`) and (b) across every page, with hrefs
// that differ only by the page's depth (../ prefixes). This verifies:
//
//   1. Every page has both a desktop and a mobile nav.
//   2. On each page, desktop and mobile menus are identical.
//   3. Each page's nav matches its language's homepage — same labels, same
//      order, and same *resolved* destination (so "About" always lands on the
//      homepage's #about section, even though the href is written ../index.html
//      #about on sub-pages). Catches renamed/missing/reordered items and links
//      pointing at the wrong section.
//
// Destinations are normalized to site-root-relative paths, which makes the
// comparison independent of where the page lives in the tree.

import { readdirSync, readFileSync } from "node:fs";
import { join, dirname, relative, sep } from "node:path";
import { posix } from "node:path";

const ROOT = process.cwd();
const IGNORE_DIRS = new Set([".git", ".claude", "node_modules", "scripts"]);

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      walk(join(dir, entry.name), acc);
    } else if (entry.name.endsWith(".html")) {
      acc.push(join(dir, entry.name));
    }
  }
  return acc;
}

const toPosix = (p) => p.split(sep).join("/");

// Resolve an href written on `pageRel` (root-relative posix path) to a
// site-root-relative destination string "path#frag".
function resolveDest(pageRel, href) {
  const [rawPath, frag] = href.split("#");
  const pageDir = posix.dirname(pageRel);
  let destPath;
  if (rawPath === "") {
    destPath = pageRel; // pure same-page anchor -> the page itself
  } else if (rawPath.startsWith("/")) {
    destPath = posix.normalize(rawPath.slice(1));
  } else {
    destPath = posix.normalize(posix.join(pageDir, rawPath));
  }
  return frag ? `${destPath}#${frag}` : destPath;
}

// Extract an ordered [{label, href}] list from a named nav container.
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

// Parse every page into a resolved nav signature.
const parsed = new Map(); // pageRel -> { desktop:[{label,dest}], mobile:[...] }
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

// Homepage of the language a page belongs to (pages under zh/ -> zh/index.html).
const homepageFor = (page) => (page.startsWith("zh/") ? "zh/index.html" : "index.html");

function diffSeq(a, b) {
  if (a.length !== b.length) return `item count ${a.length} vs expected ${b.length}`;
  for (let i = 0; i < a.length; i++) {
    if (a[i].label !== b[i].label)
      return `item ${i + 1} label "${a[i].label}" vs expected "${b[i].label}"`;
    if (a[i].dest !== b[i].dest)
      return `item ${i + 1} "${a[i].label}" -> ${a[i].dest} vs expected ${b[i].dest}`;
  }
  return null;
}

for (const [page, nav] of parsed) {
  // 2. desktop vs mobile parity on the same page
  const parity = diffSeq(nav.desktop, nav.mobile);
  if (parity) errors.push(`${page}: desktop/mobile menus differ — ${parity}`);

  // 3. match the language homepage's canonical nav
  const home = parsed.get(homepageFor(page));
  if (!home) {
    errors.push(`${page}: cannot find canonical homepage ${homepageFor(page)}`);
    continue;
  }
  if (page === homepageFor(page)) continue; // homepage is the reference
  const drift = diffSeq(nav.desktop, home.desktop);
  if (drift) errors.push(`${page}: nav differs from ${homepageFor(page)} — ${drift}`);
}

console.log(`Checked nav on ${parsed.size} page(s).`);
if (errors.length) {
  console.error(`\n${errors.length} nav issue(s):`);
  for (const e of errors) console.error("  ✗ " + e);
  process.exit(1);
}
console.log("All nav menus are consistent. ✓");
