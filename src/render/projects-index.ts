import type { Locale } from "../content/schema.js";
import { projectsPage } from "../content/site.js";
import { listedProjects } from "../content/projects.js";
import {
  homeRootPath,
  projectRootPath,
  relHref,
  routeRootPath,
} from "../lib/localized.js";
import { asset, esc, escUrl } from "./html.js";

// Render the projects listing <main> for a locale. Cards use the listing-page
// title/summary overrides when present, else the canonical title/summary.
export function renderProjectsIndex(locale: Locale): string {
  const root = routeRootPath("projects", locale);
  const cards = listedProjects()
    .map((p, i) => {
      const href = relHref(root, projectRootPath(p.slug, locale));
      const title = (p.listTitle ?? p.title)[locale];
      const summary = (p.listSummary ?? p.summary)[locale];
      const lazy = i === 0 ? "" : 'loading="lazy" ';
      return `<a class="card proj reveal" href="${escUrl(href)}"><div class="projMedia"><img ${lazy}width="${p.imageDims.w}" height="${p.imageDims.h}" alt="${esc(p.alt[locale])}" src="${asset(p.image, root)}"/></div>
<div class="projTop"><p class="projTitle">${esc(title)}</p><span class="tag">${esc(p.category[locale])}</span></div>
<p class="projDesc">${esc(summary)}</p>
</a>`;
    })
    .join("\n");

  const homeHref = relHref(root, homeRootPath(locale));

  return `<main class="container">
<section class="section reveal">
<div class="sectionHead">
<h1>${esc(projectsPage.heading[locale])}</h1>
<div class="small">${esc(projectsPage.small[locale])}</div>
</div>
<div class="grid">
${cards}
</div>
</section>
<div class="footer">${esc(projectsPage.backText[locale])}<a href="${escUrl(homeHref)}">${esc(projectsPage.homeLabel[locale])}</a></div>
</main>`;
}
