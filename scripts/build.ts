#!/usr/bin/env node
// Static generator: renders the shared content model to HTML for both locales,
// writing files in place. `--check` regenerates and diffs against the committed
// HTML (CI gate: fails if HTML was hand-edited or a locale drifted).
//
// Pages migrated to the content model so far: homepage (EN + ZH).
// Later phases register the projects listing and project detail pages here.

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { locales } from "../src/lib/i18n.js";
import type { Locale } from "../src/content/schema.js";
import { routeById } from "../src/content/routes.js";
import { homeRootPath } from "../src/lib/localized.js";
import { renderPage, type HeadMeta } from "../src/render/layout.js";
import { renderHome } from "../src/render/home.js";

const ROOT = process.cwd();
const CHECK = process.argv.includes("--check");

type Page = { rootPath: string; html: string };

function homeMeta(locale: Locale): HeadMeta {
  const route = routeById("home")!;
  return {
    title: route.title[locale],
    description: route.description[locale],
    ogTitle: (route.ogTitle ?? route.title)[locale],
    ogDescription: (route.ogDescription ?? route.description)[locale],
    ogImage: route.ogImage,
  };
}

function buildPages(): Page[] {
  const pages: Page[] = [];
  for (const locale of locales) {
    const rootPath = homeRootPath(locale);
    pages.push({
      rootPath,
      html: renderPage({
        locale,
        rootPath,
        meta: homeMeta(locale),
        main: renderHome(locale),
        scripts: ["assets/site.js", "assets/widgets/step-engineering.js"],
        inlineScripts: ['document.getElementById("y").textContent = new Date().getFullYear();'],
      }),
    });
  }
  return pages;
}

const normalize = (s: string) => s.replace(/^﻿/, "").replace(/\r\n/g, "\n");

const pages = buildPages();

if (CHECK) {
  let stale = 0;
  for (const page of pages) {
    let current = "";
    try {
      current = readFileSync(join(ROOT, page.rootPath), "utf8");
    } catch {
      /* missing file counts as stale */
    }
    if (normalize(current) !== normalize(page.html)) {
      stale++;
      console.error(`✗ ${page.rootPath} is out of date — run \`npm run build\``);
    }
  }
  if (stale) process.exit(1);
  console.log(`build:check — ${pages.length} page(s) match the content model. ✓`);
} else {
  for (const page of pages) {
    writeFileSync(join(ROOT, page.rootPath), page.html);
    console.log("wrote", page.rootPath);
  }
}
