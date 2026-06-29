import type { Locale } from "../content/schema.js";
import { homeContent, links } from "../content/site.js";
import { featuredProjects } from "../content/projects.js";
import { news } from "../content/news.js";
import { experience } from "../content/experience.js";
import { education } from "../content/education.js";
import { journey } from "../content/journey.js";
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

  const cm = c.hero.cockpit.metrics;
  const readoutRows = (
    [
      ["phase", cm.gaitPhase],
      ["intent", cm.intent],
      ["terrain", cm.terrain],
      ["mode", cm.mode],
      ["latency", cm.latency],
    ] as const
  )
    .map(
      ([k, label]) => `      <div class="cockpitRow">
        <span class="cockpitLabel">${esc(label[locale])}</span>
        <span class="cockpitValue" data-metric="${k}">—</span>
      </div>`,
    )
    .join("\n");

  const hero = `
<!-- Hero: split-screen control cockpit -->
<section class="hero" data-parallax-scene>
<div class="heroBg" aria-hidden="true" data-parallax></div>
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

<div class="heroRight reveal reveal-right">
  <div class="cockpit" data-tilt>
    <div class="cockpitHead">
      <span class="cockpitLive"><span class="cockpitLiveDot" aria-hidden="true"></span>${esc(c.hero.cockpit.live[locale])}</span>
      <span class="cockpitTitle">${esc(c.hero.cockpit.title[locale])}</span>
    </div>
    <figure class="cockpitFeed">
      <video width="426" height="240" autoplay muted loop playsinline preload="metadata"
        poster="${a("assets/video/shiftos_demo_poster.jpg")}"
        aria-label="${esc(c.hero.videoAria[locale])}">
        <source src="${a("assets/video/shiftos_demo.webm")}" type="video/webm"/>
        <source src="${a("assets/video/shiftos_demo.mp4")}" type="video/mp4"/>
      </video>
      <span class="cockpitScan" aria-hidden="true"></span>
      <figcaption class="cockpitFeedCap">${c.hero.videoCaption[locale]}</figcaption>
    </figure>
    <div class="cockpitWave" aria-hidden="true">
      <svg viewBox="0 0 300 40" preserveAspectRatio="none"><path d="M0,20 C20,20 28,6 40,6 C52,6 60,34 76,34 C92,34 98,12 112,12 C126,12 134,28 150,28 C166,28 172,10 188,10 C204,10 212,32 228,32 C244,32 252,16 268,16 C282,16 290,20 300,20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
    </div>
    <div class="cockpitReadout">
${readoutRows}
    </div>
    <p class="cockpitCaption">${esc(c.hero.cockpit.caption[locale])}</p>
  </div>
</div>
</div>
</section>`;

  const stats = c.recognition.stats
    .map((s, i) => {
      const badge = s.badge ? `\n    <div class="statBadge">${esc(s.badge[locale])}</div>` : "";
      const inner = `\n    <span class="statGhost" aria-hidden="true">${esc(s.num)}</span>\n    <div class="statNum statText">${esc(s.num)}</div>${badge}\n    <div class="statLabel">${esc(s.label[locale])}</div>\n  `;
      const cls = `${s.classes} statTile reveal`;
      const d = ` style="--d:${i * 90}ms"`;
      if (s.ref.kind === "none") return `  <div class="${cls}"${d}>${inner}</div>`;
      const href =
        s.ref.kind === "project"
          ? relHref(root, projectRootPath(s.ref.slug, locale))
          : s.ref.url;
      const extern = s.ref.kind === "external" ? ' target="_blank" rel="noopener"' : "";
      return `  <a class="${cls}" href="${escUrl(href)}"${extern}${d}>${inner}</a>`;
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
    .map((p, i) => {
      const href = relHref(root, projectRootPath(p.slug, locale));
      const bullets = p.highlights.map((h) => `<li>${esc(h[locale])}</li>`).join("\n");
      const outcome = p.outcome ? `<p class="csOutcome">${esc(p.outcome[locale])}</p>` : "";
      return `<a class="caseStudy proj reveal" style="--d:${i * 80}ms" href="${escUrl(href)}" data-tags="${p.tags.join(" ")}">
  <div class="csVisual">
    <img loading="lazy" width="${p.imageDims.w}" height="${p.imageDims.h}" alt="${esc(p.alt[locale])}" src="${a(p.image)}"/>
    <span class="csIndex" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>
    <span class="csTagFloat">${esc(p.category[locale])}</span>
  </div>
  <div class="csText">
    ${outcome}
    <h3 class="csTitle">${esc(p.title[locale])}</h3>
    <p class="csDesc">${esc(p.summary[locale])}</p>
    <ul class="csList">
${bullets}
    </ul>
    <span class="csArrow" aria-hidden="true">${esc(c.projectsSection.caseStudyCta[locale])} →</span>
  </div>
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
<div class="caseStudies">
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
  <div class="seCenter">
    <div class="seStage" aria-hidden="true"></div>
    <div class="stepDetail card" role="tabpanel" aria-live="polite">
      <div id="seHuman"></div>
      <div id="seSenses"></div>
      <div id="seCtrl"></div>
    </div>
  </div>
  <div class="signalWaves" aria-hidden="true"></div>
  <div class="factGrid"></div>
  <p class="stepRef"></p>
</section>`;

  const orgCards = experience
    .map((org, i) => {
      const roles = org.roles
        .map(
          (r) => `<p class="small"><strong>${esc(r.role[locale])}</strong>${esc(r.dates[locale])}</p>
<ul class="projList">
${r.bullets.map((b) => `<li>${esc(b[locale])}</li>`).join("\n")}
</ul>`,
        )
        .join("\n<hr/>\n");
      return `<div class="card expCard reveal" style="--d:${i * 120}ms">
<h3>${esc(org.org[locale])}</h3>
${roles}
</div>`;
    })
    .join("\n");

  const tlNodes = journey
    .map((n, i) => {
      const kindLabel =
        n.kind === "research" ? c.journeySection.researchLabel[locale] : c.journeySection.industryLabel[locale];
      const current = i === journey.length - 1 ? " tl-current" : "";
      return `  <div class="tlNode tl-${n.kind}${current} reveal" style="--d:${i * 100}ms">
    <div class="tlDot" aria-hidden="true"></div>
    <div class="tlYear">${esc(n.year)}</div>
    <div class="tlCard">
      <div class="tlKind">${esc(kindLabel)}</div>
      <div class="tlTitle">${esc(n.title[locale])}</div>
      <div class="tlOrg">${esc(n.org[locale])}</div>
      <div class="tlDetail">${esc(n.detail[locale])}</div>
    </div>
  </div>`;
    })
    .join("\n");

  const journeySection = `
<!-- Research-to-product timeline -->
<section class="section reveal" id="journey">
<div class="sectionHead">
<h2>${esc(c.journeySection.heading[locale])}</h2>
<div class="small">${esc(c.journeySection.small[locale])}</div>
</div>
<div class="timelineWrap reveal">
  <div class="timelineTrack" data-timeline>
    <div class="timelineLine" aria-hidden="true"></div>
${tlNodes}
  </div>
</div>
</section>`;

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
${journeySection}
${experienceSection}
${educationSection}
${contactSection}
</main>`;
}
