#!/usr/bin/env node
// Syntax-check every JS file under assets/. No bundler/test framework is used
// for this static site, so this is the JavaScript safety net.

import { execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = process.cwd();

function walk(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walk(p, files);
    else if (entry.name.endsWith(".js")) files.push(p);
  }
  return files;
}

const files = walk(join(ROOT, "assets"));
let failed = 0;

for (const file of files) {
  const rel = relative(ROOT, file).split(sep).join("/");
  try {
    execFileSync(process.execPath, ["--check", file], { stdio: "pipe" });
    console.log(`  OK ${rel}`);
  } catch (err) {
    failed++;
    console.error(`  FAIL ${rel}`);
    console.error(String(err.stderr || err.message));
  }
}

console.log(`\nChecked ${files.length} JS file(s).`);
if (failed) {
  console.error(`${failed} file(s) failed syntax check.`);
  process.exit(1);
}
console.log("All JS files pass syntax check.");
