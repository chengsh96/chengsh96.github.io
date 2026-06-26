#!/usr/bin/env node
// Syntax-checks every JS file under assets/ using `node --check`.
// No bundler/test framework on this site, so this is the JS safety net.

import { readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walk(p, acc);
    else if (entry.name.endsWith(".js")) acc.push(p);
  }
  return acc;
}

const files = walk(join(ROOT, "assets"));
let failed = 0;

for (const file of files) {
  const rel = relative(ROOT, file).split(sep).join("/");
  try {
    execFileSync(process.execPath, ["--check", file], { stdio: "pipe" });
    console.log("  ✓ " + rel);
  } catch (err) {
    failed++;
    console.error("  ✗ " + rel);
    console.error(String(err.stderr || err.message));
  }
}

console.log(`\nChecked ${files.length} JS file(s).`);
if (failed) {
  console.error(`${failed} file(s) failed syntax check.`);
  process.exit(1);
}
console.log("All JS files pass syntax check. ✓");
