import type { Locale } from "../content/schema.js";
import { homeContent, links } from "../content/site.js";
import { featuredProjects } from "../content/projects.js";
import { news } from "../content/news.js";
import { experience } from "../content/experience.js";
import { education } from "../content/education.js";
import {
  homeRootPath,
  projectRootPath,
  relHref,
  routeRootPath,
} from "../lib/localized.js";
import { asset, esc, escUrl } from "./html.js";

// Render the homepage <main>…</main> for a locale. Every visible string comes
// from the content model via [locale]; structure mirrors the original markup.
export function renderHome(locale: Locale): string {
  const root = homeRootPath(locale);
  const c = homeContent;
  const projectsHref = relHref(root, routeRootPath("projects", locale));
  const a = (p: string) => asset(p, root);

  const hero = `
<!-- Hero with ShiftOS video -->
<section class="hero">
<div class="heroGrid">
<div class="heroLeft reveal">
  <span class="kicker">${esc(c.hero.kicker[locale])}</span>
  <h1>${c.hero.name[locale]}</h1>
  <p class="heroRole">${esc(c.hero.rolePrefix[locale])}<span class="roleTyped" id="roleTyped"></span><span class="roleCursor" aria-hidden="true">|</span></p>
  <p class="sub heroLead">
    ${c.hero.lead[locale]}
  </p>
  <div class="ctaRow">
    <a class="btn btnPrimary" href="${escUrl(projectsHref)}">${esc(c.hero.cta.viewProjects[locale])}</a>
    <a class="btn" href="${escUrl(links.linkedin)}" target="_blank" rel="noopener">${esc(c.hero.cta.linkedin[locale])}</a>
    <a class="btn" href="${escUrl(links.scholar)}" target="_blank" rel="noopener">${esc(c.hero.cta.scholar[locale])}</a>
  </div>
  <div class="heroByline">
    <img width="500" height="500" class="avatarSm" src="${a("assets/img/profile.jpg")}" alt="${esc(c.hero.avatarAlt[locale])}"/>
    <span>${esc(c.hero.byline[locale])}</span>
  </div>
</div>

<div class="heroRight reveal">
  <figure class="heroVideo">
    <video width="426" height="240" autoplay muted loop playsinline preload="metadata"
      poster="${a("assets/video/shiftos_demo_poster.jpg")}"
      aria-label="${esc(c.hero.videoAria[locale])}">
      <source src="${a("assets/video/shiftos_demo.webm")}" type="video/webm"/>
      <source src="${a("assets/video/shiftos_demo.mp4")}" type="video/mp4"/>
    </video>
    <figcaption>${c.hero.videoCaption[locale]}</figcaption>
  </figure>
</div>
</div>
</section>`;

  const stats = c.recognition.stats
    .map((s) => {
      const badge = s.badge ? `\n    <div class="statBadge">${esc(s.badge[locale])}</div>` : "";
      const inner = `\n    <div class="statNum statText">${esc(s.num)}</div>${badge}\n    <div class="statLabel">${esc(s.label[locale])}</div>\n  `;
      if (s.ref.kind === "none") return `  <div class="${s.classes}">${inner}</div>`;
      const href =
        s.ref.kind === "project"
          ? relHref(root, projectRootPath(s.ref.slug, locale))
          : s.ref.url;
      const extern = s.ref.kind === "external" ? ' target="_blank" rel="noopener"' : "";
      return `  <a class="${s.classes}" href="${escUrl(href)}"${extern}>${inner}</a>`;
    })
    .join("\n");

  const recognition = `
<!-- Stat card row -->
<section class="section statRow reveal" aria-label="${esc(c.recognition.sectionAria[locale])}">
<div class="statRowHead">
  <h3 class="statRowTitle">${esc(c.recognition.title[locale])}</h3>
  <p class="statRowSub">${esc(c.recognition.subtitle[locale])}</p>
</div>
<div class="statGrid">
${stats}
</div>
</section>`;

  const about = `
<section class="section reveal" id="about">
<div class="sectionHead">
<h2>${esc(c.about.heading[locale])}</h2>
<div class="small">${esc(c.about.small[locale])}</div>
</div>
<div class="aboutText">
${c.about.paragraphs.map((p) => `<p class="projDesc">${p[locale]}</p>`).join("\n")}
</div>
</section>`;

  const newsItems = news
    .map(
      (n) => `      <li data-tag="${n.tag}">
        <span class="newsTag newsTag-${n.tag}">${esc(n.tagLabel[locale])}</span>
        <span class="newsDate">${esc(n.date[locale])}</span>
        <span class="newsText">
          ${n.text[locale]}
        </span>
      </li>`,
    )
    .join("\n\n");

  const newsSection = `
<!-- News timeline -->
<section class="section reveal" id="news">
  <div class="sectionHead">
    <h2>${esc(c.newsSection.heading[locale])}</h2>
    <div class="small">${esc(c.newsSection.small[locale])}</div>
  </div>

  <div class="card">
    <ul class="newsList">

${newsItems}

    </ul>

    <div class="newsControls">
      <button class="btn newsToggle" id="newsToggleBtn" type="button" aria-expanded="false">
        ${esc(c.newsSection.showMore[locale])}
      </button>
    </div>
  </div>
</section>`;

  const chips = c.projectsSection.filters
    .map((f, i) => {
      const active = i === 0;
      return `  <button class="filterChip${active ? " is-active" : ""}" data-filter="${f.key}" role="tab" aria-selected="${active ? "true" : "false"}">${esc(f.label[locale])}</button>`;
    })
    .join("\n");

  const cards = featuredProjects()
    .map((p) => {
      const href = relHref(root, projectRootPath(p.slug, locale));
      const bullets = p.highlights.map((h) => `<li>${esc(h[locale])}</li>`).join("\n");
      return `<a class="card proj reveal" href="${escUrl(href)}" data-tags="${p.tags.join(" ")}">
<div class="projMedia"><img loading="lazy" width="${p.imageDims.w}" height="${p.imageDims.h}" alt="${esc(p.alt[locale])}" src="${a(p.image)}"/></div>
<div class="projTop">
<p class="projTitle">${esc(p.title[locale])}</p>
<span class="tag">${esc(p.category[locale])}</span>
</div>
<p class="projOutcome">${esc(p.outcome ? p.outcome[locale] : "")}</p>
<p class="projDesc">${esc(p.summary[locale])}</p>
<ul class="projList">
${bullets}
</ul>
</a>`;
    })
    .join("\n");

  const projectsSection = `
<!-- Featured projects -->
<section class="section" id="projects">
<div class="sectionHead reveal">
<h2>${esc(c.projectsSection.heading[locale])}</h2>
<div class="small">${esc(c.projectsSection.small[locale])}</div>
</div>
<div class="filterRow reveal" role="tablist" aria-label="${esc(c.projectsSection.filterAria[locale])}">
${chips}
</div>
<div class="grid">
${cards}
</div>
<div class="linkRow reveal u-mt-18">
  <a class="btn" href="${escUrl(projectsHref)}">${esc(c.projectsSection.allProjectsCta[locale])}</a>
</div>
</section>`;

  const stepEngineering = `
<!-- The Hidden Engineering in a Step -->
<section class="section reveal" id="step-engineering">
  <div class="sectionHead">
    <h2>${esc(c.stepEngineering.heading[locale])}</h2>
    <div class="small">${esc(c.stepEngineering.small[locale])}</div>
  </div>
  <p class="stepEngIntro"></p>
  <div class="controlLoop" aria-label="${esc(c.stepEngineering.controlLoopAria[locale])}"></div>
  <div class="stepTimeline" role="tablist" aria-label="${esc(c.stepEngineering.timelineAria[locale])}"></div>
  <div class="timelineProgress" aria-hidden="true"><div class="timelineProgressFill"></div></div>
  <div class="signalWaves" aria-hidden="true"></div>
  <div class="stepDetail card" role="tabpanel" aria-live="polite">
    <div id="seHuman"></div>
    <div id="seSenses"></div>
    <div id="seCtrl"></div>
  </div>
  <div class="factGrid"></div>
  <p class="stepRef"></p>
</section>`;

  const orgCards = experience
    .map((org) => {
      const roles = org.roles
        .map(
          (r) => `<p class="small"><strong>${esc(r.role[locale])}</strong>${esc(r.dates[locale])}</p>
<ul class="projList">
${r.bullets.map((b) => `<li>${esc(b[locale])}</li>`).join("\n")}
</ul>`,
        )
        .join("\n<hr/>\n");
      return `<div class="card">
<h3>${esc(org.org[locale])}</h3>
${roles}
</div>`;
    })
    .join("\n");

  const experienceSection = `
<section class="section reveal" id="experience">
<div class="sectionHead">
<h2>${esc(c.experienceSection.heading[locale])}</h2>
<div class="small">${esc(c.experienceSection.small[locale])}</div>
</div>
<div class="split">
${orgCards}
</div>
</section>`;

  const educationSection = `
<section class="section reveal" id="education">
  <div class="sectionHead">
    <h2>${esc(c.educationSection.heading[locale])}</h2>
    <div class="small">${esc(c.educationSection.small[locale])}</div>
  </div>
  <div class="card">
    <ul class="projList">
${education.map((e) => `      <li>${e.degree[locale]}</li>`).join("\n")}
    </ul>
  </div>
</section>`;

  const contactSection = `
<section class="section reveal" id="contact">
<div class="sectionHead">
<h2>${esc(c.contactSection.heading[locale])}</h2>
<div class="small">${esc(c.contactSection.small[locale])}</div>
</div>
<div class="contactGrid">
  <a class="contactItem" href="mailto:${escUrl(links.email)}">
    <div class="contactIcon">@</div>
    <div class="contactDetails">
      <span class="contactLabel">${esc(c.contactSection.emailLabel[locale])}</span>
      <span class="contactUrl">${esc(links.email)}</span>
    </div>
  </a>
  <a class="contactItem" href="${escUrl(links.linkedin)}" target="_blank" rel="noopener">
    <div class="contactIcon">in</div>
    <div class="contactDetails">
      <span class="contactLabel">${esc(c.contactSection.linkedinLabel[locale])}</span>
      <span class="contactUrl">${esc(links.linkedinDisplay)}</span>
    </div>
  </a>
</div>
<div class="footer">© <span id="y"></span> ${esc(c.footerName[locale])}</div>
</section>`;

  return `<main class="container">
${hero}
${recognition}
${about}
${newsSection}
${projectsSection}
${stepEngineering}
${experienceSection}
${educationSection}
${contactSection}
</main>`;
}
