#!/usr/bin/env node
// Static generator: renders the shared content model to HTML for both locales,
// writing files in place. `--check` regenerates and diffs against the committed
// HTML (CI gate: fails if HTML was hand-edited or a locale drifted).
//
// Pages: homepage, projects listing, and every project detail page. Detail page
// bodies are verbatim bilingual snapshots under src/content/detail/; everything
// else is rendered from the typed content model.

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { locales } from "../src/lib/i18n.js";
import type { Locale } from "../src/content/schema.js";
import { routeById } from "../src/content/routes.js";
import { projects } from "../src/content/projects.js";
import { homeRootPath, projectRootPath, routeRootPath } from "../src/lib/localized.js";
import { renderPage, type HeadMeta } from "../src/render/layout.js";
import { renderHome } from "../src/render/home.js";
import { renderProjectsIndex } from "../src/render/projects-index.js";

const ROOT = process.cwd();
const CHECK = process.argv.includes("--check");

type Page = { rootPath: string; html: string };

function routeMeta(routeId: string, locale: Locale): HeadMeta {
  const route = routeById(routeId)!;
  return {
    title: route.title[locale],
    description: route.description[locale],
    ogTitle: (route.ogTitle ?? route.title)[locale],
    ogDescription: (route.ogDescription ?? route.description)[locale],
    ogImage: route.ogImage,
  };
}

function detailBody(slug: string, locale: Locale): string {
  return readFileSync(join(ROOT, "src/content/detail", `${slug}.${locale}.html`), "utf8").replace(/\s+$/, "");
}

function buildPages(): Page[] {
  const pages: Page[] = [];
  for (const locale of locales) {
    // Homepage
    const homePath = homeRootPath(locale);
    pages.push({
      rootPath: homePath,
      html: renderPage({
        locale,
        rootPath: homePath,
        meta: routeMeta("home", locale),
        main: renderHome(locale),
        bodyClass: "page-home",
        scripts: ["assets/site.js", "assets/widgets/step-engineering.js"],
        inlineScripts: ['document.getElementById("y").textContent = new Date().getFullYear();'],
      }),
    });

    // Projects listing
    const listPath = routeRootPath("projects", locale);
    pages.push({
      rootPath: listPath,
      html: renderPage({
        locale,
        rootPath: listPath,
        meta: routeMeta("projects", locale),
        main: renderProjectsIndex(locale),
        scripts: ["assets/site.js"],
      }),
    });

    // Project detail pages (verbatim bilingual body + generated head/nav/scripts)
    for (const project of projects) {
      const detailPath = projectRootPath(project.slug, locale);
      const seo = project.detail.seo;
      pages.push({
        rootPath: detailPath,
        html: renderPage({
          locale,
          rootPath: detailPath,
          meta: {
            title: seo.title[locale],
            description: seo.description[locale],
            ogTitle: seo.title[locale],
            ogDescription: seo.description[locale],
            ogImage: project.detail.ogImage,
          },
          main: `<main class="container">\n${detailBody(project.slug, locale)}\n</main>`,
          scripts: ["assets/site.js"],
        }),
      });
    }
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
  }
  console.log(`build — wrote ${pages.length} page(s).`);
}
