#!/usr/bin/env node
// Validates the shared content model so EN and ZH cannot drift apart.
// Run with: npm run content:check

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { routes, navItems } from "../src/content/routes.js";
import { chrome, homeContent } from "../src/content/site.js";
import { projects } from "../src/content/projects.js";
import { news } from "../src/content/news.js";
import { experience } from "../src/content/experience.js";
import { education } from "../src/content/education.js";
import { journey } from "../src/content/journey.js";

const ROOT = process.cwd();
const errors: string[] = [];
const fail = (msg: string) => errors.push(msg);

// A localized pair is a plain object whose only keys are exactly "en" and "zh".
function isLocalizedPair(v: unknown): v is { en: unknown; zh: unknown } {
  if (typeof v !== "object" || v === null || Array.isArray(v)) return false;
  const keys = Object.keys(v);
  return keys.length === 2 && keys.includes("en") && keys.includes("zh");
}

// Recursively assert every localized pair has non-empty en AND zh.
function checkLocalized(node: unknown, path: string): void {
  if (isLocalizedPair(node)) {
    for (const loc of ["en", "zh"] as const) {
      const val = (node as Record<string, unknown>)[loc];
      if (val === undefined || val === null) {
        fail(`${path}.${loc} is missing`);
      } else if (typeof val === "string") {
        if (val.trim() === "") fail(`${path}.${loc} is an empty string`);
      } else if (Array.isArray(val)) {
        val.forEach((el, i) => checkLocalized(el, `${path}.${loc}[${i}]`));
      } else {
        checkLocalized(val, `${path}.${loc}`);
      }
    }
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((el, i) => checkLocalized(el, `${path}[${i}]`));
  } else if (typeof node === "object" && node !== null) {
    for (const [k, v] of Object.entries(node)) checkLocalized(v, `${path}.${k}`);
  }
}

// Unique, non-empty ids within a collection.
function checkIds(items: { id?: string }[], name: string): void {
  const seen = new Set<string>();
  items.forEach((item, i) => {
    if (!item.id || item.id.trim() === "") fail(`${name}[${i}] is missing a stable id`);
    else if (seen.has(item.id)) fail(`${name}: duplicate id "${item.id}"`);
    else seen.add(item.id);
  });
}

// --- routes ---
checkLocalized(routes, "routes");
checkIds(routes, "routes");
for (const r of routes) {
  if (!r.paths?.en) fail(`route "${r.id}" is missing an English path`);
  if (!r.paths?.zh) fail(`route "${r.id}" is missing a Chinese path`);
  if (!r.title) fail(`route "${r.id}" is missing a localized title`);
  if (!r.description) fail(`route "${r.id}" is missing a localized description`);
  if (!r.ogImage || r.ogImage.trim() === "") fail(`route "${r.id}" is missing ogImage`);
}

// --- nav ---
checkLocalized(navItems.map((n) => n.label), "navItems.label");
checkIds(navItems, "navItems");
const routeIds = new Set(routes.map((r) => r.id));
for (const item of navItems) {
  if (!item.label?.en || !item.label?.zh) fail(`nav item "${item.id}" is missing a localized label`);
  if (item.target.kind === "route" && !routeIds.has(item.target.routeId)) {
    fail(`nav item "${item.id}" targets unregistered route "${item.target.routeId}"`);
  }
}

// --- collections ---
checkIds(projects, "projects");
checkIds(news, "news");
checkIds(experience, "experience");
checkIds(education, "education");
checkIds(journey, "journey");

checkLocalized(projects, "projects");
checkLocalized(news, "news");
checkLocalized(experience, "experience");
checkLocalized(education, "education");
checkLocalized(journey, "journey");

// --- homepage content (site.ts) ---
checkLocalized(homeContent, "homeContent");
checkLocalized(chrome, "chrome");

for (const p of projects) {
  if (!p.slug || p.slug.trim() === "") fail(`project "${p.id}" is missing a slug`);
  if (!p.title) fail(`project "${p.id}" is missing a localized title`);
  if (!p.summary) fail(`project "${p.id}" is missing a localized summary`);
  if (!p.alt) fail(`project "${p.id}" is missing localized alt text`);
  // Detail body must exist (non-empty) for BOTH locales so they cannot drift.
  for (const loc of ["en", "zh"] as const) {
    const file = join(ROOT, "src/content/detail", `${p.slug}.${loc}.html`);
    let body = "";
    try { body = readFileSync(file, "utf8"); } catch { /* missing */ }
    if (body.trim() === "") fail(`project "${p.id}" detail body missing/empty: src/content/detail/${p.slug}.${loc}.html`);
  }
}

const counts = `routes=${routes.length} nav=${navItems.length} projects=${projects.length} news=${news.length} experience=${experience.length} education=${education.length}`;
console.log(`Content parity check (${counts}).`);
if (errors.length) {
  console.error(`\n${errors.length} content issue(s):`);
  for (const e of errors) console.error("  ✗ " + e);
  process.exit(1);
}
console.log("All localized content has both languages and is internally consistent. ✓");
