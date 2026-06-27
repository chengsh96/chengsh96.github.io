import type { Locale, Project } from "../content/schema.js";
import { projectDetail } from "../content/site.js";
import { homeRootPath, projectRootPath, relHref, routeRootPath } from "../lib/localized.js";
import { esc, escUrl } from "./html.js";
import { renderBlocks } from "./blocks.js";

// Render a project detail page <main> for a locale.
export function renderProjectDetail(project: Project, locale: Locale): string {
  const root = projectRootPath(project.slug, locale);
  const h1 = (project.detailTitle ?? project.title)[locale];
  const backHref = relHref(root, routeRootPath("projects", locale));
  const featuredHref = relHref(root, homeRootPath(locale)) + "#projects";
  const affil = project.affil ? `\n<p class="affil">${project.affil[locale]}</p>` : "";

  return `<main class="container">
<section class="section reveal">
<div class="sectionHead">
<h1>${esc(h1)}</h1>
<div class="small">${esc(project.category[locale])}</div>
</div>
<div class="card">
${renderBlocks(project.body, locale, root)}
</div>${affil}
<!-- Footer nav -->
<div class="linkRow u-mt-18">
<a class="btn" href="${escUrl(backHref)}">${esc(projectDetail.backToProjects[locale])}</a>
<a class="btn" href="${escUrl(featuredHref)}">${esc(projectDetail.featuredProjects[locale])}</a>
</div>
</section>
</main>`;
}
