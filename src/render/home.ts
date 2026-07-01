import type { Locale, Project } from "../content/schema.js";
import { homeContent, links } from "../content/site.js";
import { projectBySlug } from "../content/projects.js";
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

function mustProject(slug: string): Project {
  const project = projectBySlug(slug);
  if (!project) throw new Error(`Unknown homepage project slug: ${slug}`);
  return project;
}

// Render the homepage <main>…</main> for a locale. Every visible string comes
// from the content model via [locale]; structure mirrors the generated site.
export function renderHome(locale: Locale): string {
  const root = homeRootPath(locale);
  const c = homeContent;
  const projectsHref = relHref(root, routeRootPath("projects", locale));
  const a = (p: string) => asset(p, root);


  const bylineText = c.hero.byline
    .map((p) => `<span>${esc(p[locale])}</span>`)
    .join('<span class="coverBylineSep" aria-hidden="true">|</span>');

  const cover = `
<!-- Cover intro (full-page two-column hero; recedes on a short sticky scroll) -->
<section class="coverTrack" id="cover">
<div class="coverSticky">
<div class="coverScene">
  <div class="coverLeft">
    <h1 class="coverName">${c.hero.name[locale]}</h1>
    <p class="coverRole">${esc(c.hero.rolePrefix[locale])}<span class="roleTyped" id="roleTyped"></span><span class="roleCursor" aria-hidden="true">|</span></p>
    <p class="coverLead">${c.hero.lead[locale]}</p>
    <figure class="coverVideo">
      <video width="426" height="240" autoplay muted loop playsinline preload="metadata"
        poster="${a("assets/video/shiftos_demo_poster.jpg")}"
        aria-label="${esc(c.hero.videoAria[locale])}">
        <source src="${a("assets/video/shiftos_demo.mp4")}" type="video/mp4"/>
        <source src="${a("assets/video/shiftos_demo.webm")}" type="video/webm"/>
      </video>
      <figcaption>${c.hero.videoCaption[locale]}</figcaption>
    </figure>
    <div class="coverCtas">
      <a class="btn btnPrimary" href="${escUrl(projectsHref)}">${esc(c.hero.cta.viewProjects[locale])}</a>
      <a class="btn" href="${escUrl(links.linkedin)}" target="_blank" rel="noopener">${esc(c.hero.cta.linkedin[locale])}</a>
      <a class="btn" href="${escUrl(links.scholar)}" target="_blank" rel="noopener">${esc(c.hero.cta.scholar[locale])}</a>
    </div>
  </div>
  <div class="coverRight">
    <div class="coverVisual">
      <div class="coverPortraitFrame">
        <img class="coverPortrait" src="${a("assets/img/profile.jpg")}" width="560" height="560" alt="${esc(c.hero.avatarAlt[locale])}"/>
      </div>
      <div class="coverInfoStack">
        <div class="coverByline">
          <img class="avatarSm" src="${a("assets/img/profile.jpg")}" width="36" height="36" loading="lazy" alt="${esc(c.hero.avatarAlt[locale])}"/>
          <span class="coverBylineText">${bylineText}</span>
        </div>
        <span class="kicker coverKicker">${esc(c.hero.kicker[locale])}</span>
      </div>
    </div>
  </div>
</div>
</div>
</section>`;

  const miniStats = c.recognition.miniStats
    .map(
      (stat, i) => `    <article class="homeCard miniStatCard reveal" style="--d:${i * 55}ms">
      <div class="miniStatValue">${esc(stat.value)}</div>
      <p>${esc(stat.label[locale])}</p>
    </article>`,
    )
    .join("\n");

  const proofHref = (tone: string): string => {
    if (tone === "deployment") return relHref(root, projectRootPath("shiftos", locale));
    if (tone === "award") return relHref(root, projectRootPath("tnsre2024", locale));
    return relHref(root, projectRootPath("icf", locale));
  };

  const proofCards = c.recognition.proofCards
    .map(
      (card, i) => `    <a class="homeCard glanceProofCard glanceProof-${esc(card.tone)} reveal" style="--d:${i * 70}ms" href="${escUrl(proofHref(card.tone))}">
      <h3>${esc(card.title[locale])}</h3>
      <div class="glanceProofMeta">${esc(card.meta[locale])}</div>
      <p>${esc(card.body[locale])}</p>
      <div class="chipRow">
${card.chips.map((chip) => `        <span class="chip">${esc(chip[locale])}</span>`).join("\n")}
      </div>
    </a>`,
    )
    .join("\n");

  const recognition = `
<!-- Credibility Snapshot -->
<section class="section statRow atAGlance reveal" id="snapshot" aria-label="${esc(c.recognition.sectionAria[locale])}">
<div class="sectionHead statRowHead">
  <div>
    <h2>${esc(c.recognition.title[locale])}</h2>
  </div>
</div>
<div class="homeCard glancePanel">
  <div class="miniStatGrid miniStatRow" aria-label="${esc(c.recognition.subtitle[locale])}">
${miniStats}
  </div>
  <div class="glanceProofGrid">
${proofCards}
  </div>
</div>
</section>`;

  const aboutPrinciples = c.about.principles
    .map(
      (p, i) => `    <li class="aboutPrinciple">
      <span class="aboutPrincipleNum" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>
      <div class="aboutPrincipleBody">
        <h3>${esc(p.title[locale])}</h3>
        <p>${esc(p.text[locale])}</p>
      </div>
    </li>`,
    )
    .join("\n");

  const about = `
<section class="section reveal" id="about">
<div class="sectionHead">
<h2>${esc(c.about.heading[locale])}</h2>
<div class="small">${esc(c.about.small[locale])}</div>
</div>
<div class="homeCard aboutPanel">
  <div class="aboutStatement">
    <p class="aboutStatementText">${c.about.statement[locale]}</p>
  </div>
  <div class="aboutDivider" aria-hidden="true"></div>
  <div class="aboutBody">
    <div class="aboutText">
      <p class="aboutLead">${c.about.lead[locale]}</p>
${c.about.paragraphs.map((p) => `      <p class="projDesc">${p[locale]}</p>`).join("\n")}
    </div>
    <ol class="aboutPrinciples" aria-label="${esc(c.about.small[locale])}">
${aboutPrinciples}
    </ol>
  </div>
</div>
</section>`;

  const publicationBySlug = new Map(c.publicationsSection.items.map((pub) => [pub.slug, pub]));

  const workCards = c.featuredWork.cards
    .map((card, i) => {
      const p = mustProject(card.slug);
      const href = relHref(root, projectRootPath(p.slug, locale));
      const pub = publicationBySlug.get(card.slug);
      const cardClass = `homeCard workCard selectedWorkCard reveal${i === 0 ? " workCardLarge" : ""}`;
      const metaExtras: string[] = [];
      if (card.slug === "tnsre2024" && p.outcome?.en) metaExtras.push(esc(p.outcome[locale]));
      if ("badge" in card && card.badge?.en) metaExtras.push(esc(card.badge[locale]));
      const publicationMeta = pub
        ? `<div class="workPublication">${esc(pub.venue)}${metaExtras.length ? ` · ${metaExtras.join(" · ")}` : ""}</div>`
        : "";
      const media = `  <div class="workCardMedia">
    <img loading="lazy" width="${p.imageDims.w}" height="${p.imageDims.h}" src="${a(p.image)}" alt="${esc(p.alt[locale])}"/>
  </div>
`;
      return `<article class="${cardClass}" style="--d:${i * 80}ms">
${media}  <div class="workCardBody">
    <span class="workMeta">${esc(p.category[locale])}</span>
    <h3><a href="${escUrl(href)}">${esc(p.title[locale])}</a></h3>
    ${publicationMeta}
    <p class="workSummary">${esc(pub?.contribution[locale] ?? p.summary[locale])}</p>
    <p class="workRole"><strong>${esc(c.featuredWork.roleLabel[locale])}:</strong> ${esc(card.role[locale])}</p>
    <div class="chipRow">
${card.keywords.map((k) => `      <span class="chip">${esc(k[locale])}</span>`).join("\n")}
    </div>
  </div>
</article>`;
    })
    .join("\n");

  const featuredWorkSection = `
<!-- Selected work and publications -->
<section class="section reveal" id="projects">
<span class="anchorAlias" id="publications" aria-hidden="true"></span>
<div class="sectionHead">
<h2>${esc(c.featuredWork.heading[locale])}</h2>
</div>
<div class="workGrid selectedWorkGrid">
${workCards}
</div>
<div class="linkRow reveal u-mt-18 selectedWorkActions">
  <a class="btn" href="${escUrl(projectsHref)}">${esc(c.projectsSection.allProjectsCta[locale])}</a>
  <a class="btn" href="${escUrl(links.scholar)}" target="_blank" rel="noopener">${esc(c.publicationsSection.scholarLabel[locale])}</a>
</div>
</section>`;

  const orgCards = experience
    .flatMap((org) =>
      org.roles.map((role) => ({
        org,
        role,
      })),
    )
    .map(({ org, role }, i) => {
      const bullets = role.bullets.slice(0, 3).map((b) => `<li>${esc(b[locale])}</li>`).join("\n");
      return `<article class="timelineItem reveal" style="--d:${i * 90}ms">
  <div class="timelineDot" aria-hidden="true"></div>
  <div class="homeCard timelineCard">
    <div class="timelineMeta">${esc(role.dates[locale])}</div>
    <h3>${esc(org.org[locale])}</h3>
    <p class="timelineRole">${esc(role.role[locale])}</p>
    <ul class="projList">
${bullets}
    </ul>
  </div>
</article>`;
    })
    .join("\n");

  const experienceSection = `
<section class="section reveal" id="experience">
<div class="sectionHead">
<h2>${esc(c.experienceSection.heading[locale])}</h2>
<div class="small">${esc(c.experienceSection.small[locale])}</div>
</div>
<div class="experienceTimeline">
${orgCards}
</div>
</section>`;

  const se = c.stepEngineering;

  // Heading with the accent word wrapped in a highlighted span (matches preview).
  const headingHtml = (() => {
    const full = se.heading[locale];
    const accent = se.headingAccent[locale];
    const at = full.indexOf(accent);
    if (at < 0) return esc(full);
    return (
      esc(full.slice(0, at)) +
      `<span class="gdTitleAccent">${esc(accent)}</span>` +
      esc(full.slice(at + accent.length))
    );
  })();

  // Inline icons (kept tiny + theme-tinted via currentColor).
  const ICON = {
    hand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M8 11V5.5a1.5 1.5 0 0 1 3 0V11"/><path d="M11 11V4.5a1.5 1.5 0 0 1 3 0V11"/><path d="M14 11V6.5a1.5 1.5 0 0 1 3 0V13"/><path d="M8 11v-.5a1.5 1.5 0 0 0-3 0V14c0 3.5 2.5 6 6 6h1.5a5 5 0 0 0 5-5"/></svg>',
    understand:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"><path d="M11.7 5.4c-1.1-1.2-3-1.5-4.5-.5-1.5 1-2 3-1.2 4.6-1.3.8-1.9 2.5-1.4 4 .5 1.6 2 2.6 3.6 2.5.3 1.7 1.7 3 3.5 3z"/><path d="M12.3 5.4c1.1-1.2 3-1.5 4.5-.5 1.5 1 2 3 1.2 4.6 1.3.8 1.9 2.5 1.4 4-.5 1.6-2 2.6-3.6 2.5-.3 1.7-1.7 3-3.5 3z"/><path d="M12 5.2v13.6"/><path d="M8.3 8.3c1.2-.5 2.4-.1 3.1.9"/><path d="M15.7 8.3c-1.2-.5-2.4-.1-3.1.9"/><path d="M7.8 12.3c1.2.1 2.2.7 2.7 1.7"/><path d="M16.2 12.3c-1.2.1-2.2.7-2.7 1.7"/></svg>',
    evaluate:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M5 7h14M5 12h14M5 17h14"/><circle cx="9" cy="7" r="2" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="2" fill="currentColor" stroke="none"/><circle cx="8" cy="17" r="2" fill="currentColor" stroke="none"/></svg>',
    safety:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z"/><path d="M9 12l2 2 4-4"/></svg>',
    decide:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L4.5 13H11l-1 9 8.5-11H12z"/></svg>',
    human:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4.2" r="2"/><path d="M12 6.5v5.2"/><path d="M12 8.5l-4 2.2"/><path d="M12.1 11.5l3.7 2.3"/><path d="M12 11.7l-2.9 7.1"/><path d="M14.7 14.1l2.2 5.7"/><path d="M8.2 20h3.2"/><path d="M15.8 20h3"/></svg>',
    senses:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="2"/><path d="M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7"/><path d="M6 6a8 8 0 0 0 0 12M18 6a8 8 0 0 1 0 12"/></svg>',
    asks:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L4.5 13H11l-1 9 8.5-11H12z"/></svg>',
    bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.2 1 2.5h6c0-1.3.3-1.8 1-2.5A6 6 0 0 0 12 3z"/></svg>',
    chevronDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
    chevronRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
  };

  const thinkTones = ["#4d9fff", "#a78bfa", "#2dd4bf", "#f5a623"];
  const thinkingCards = se.thinkingTitles
    .map((t, i) => {
      const icon = [ICON.understand, ICON.evaluate, ICON.safety, ICON.decide][i];
      const emphasis = i === 3 ? " gdThinkPrimary" : "";
      // A down-chevron connects the reasoning steps into the final decision.
      const chevron = i === 3 ? `      <div class="gdThinkChevron" aria-hidden="true">${ICON.chevronDown}</div>\n` : "";
      return `${chevron}      <div class="gdThink${emphasis}" style="--gd-tone:${thinkTones[i]}">
        <span class="gdThinkIcon" aria-hidden="true">${icon}</span>
        <div class="gdThinkBody">
          <span class="gdThinkTitle">${esc(t[locale])}</span>
          <p class="gdThinkText" data-think="${i}"></p>
        </div>
      </div>`;
    })
    .join("\n");

  const glanceCards = [
    { key: "human", label: se.humanLabel, icon: ICON.human, tone: "#4d9fff" },
    { key: "senses", label: se.sensesLabel, icon: ICON.senses, tone: "#a78bfa" },
    { key: "asks", label: se.asksLabel, icon: ICON.asks, tone: "#2dd4bf" },
  ]
    .map(
      (g, i) => `${i > 0 ? `      <div class="gdGlanceSep" aria-hidden="true">${ICON.chevronRight}</div>\n` : ""}      <article class="gdGlanceCard" style="--gd-tone:${g.tone}">
        <span class="gdGlanceIcon" aria-hidden="true">${g.icon}</span>
        <span class="gdGlanceTitle">${esc(g.label[locale])}</span>
        <p class="gdGlanceText" data-glance="${g.key}"></p>
      </article>`,
    )
    .join("\n");

  const stepEngineering = `
<!-- Hidden Engineering — interactive gait-cycle control dashboard -->
<section class="section reveal gaitSection" id="step-engineering">
  <div class="homeCard gaitDash" data-gait-dash aria-label="${esc(se.controlLoopAria[locale])}">
    <div class="gdHeader">
      <div class="gdHeaderText">
        <h2 class="gdTitle">${headingHtml}</h2>
        <p class="gdHook">
${se.hook.map((line) => `          <span>${esc(line[locale])}</span>`).join("\n")}
        </p>
      </div>
      <p class="gdHelper">
        <span class="gdHelperIcon" aria-hidden="true">${ICON.hand}</span>
        <span>${esc(se.small[locale])}</span>
      </p>
    </div>

    <div class="gdCockpit">
      <div class="gdCycle">
        <div class="gdCycleLabel">
          <span class="gdEyebrow">${esc(se.cycleLabel[locale])}</span>
          <span class="gdCycleSub">${esc(se.cycleSub[locale])}</span>
        </div>
        <div class="gdTimeline" role="tablist" aria-label="${esc(se.timelineAria[locale])}" data-gd-timeline></div>
      </div>

      <div class="gdGrid">
        <div class="gdStage" data-gd-stage role="img"></div>

        <div class="gdPanel gdThinkingPanel">
          <div class="gdPanelHead"><span class="gdEyebrow">${esc(se.thinkingLabel[locale])}</span></div>
          <div class="gdThinkList" aria-live="polite">
${thinkingCards}
          </div>
        </div>

        <div class="gdPanel gdSignalsPanel">
          <div class="gdPanelHead">
            <span class="gdEyebrow">${esc(se.signalsLabel[locale])}</span>
            <span class="gdPill"><span class="gdPillDot" aria-hidden="true"></span>${esc(se.realtimeLabel[locale])}</span>
          </div>
          <div class="gdSignalList" data-gd-signals aria-hidden="true"></div>
        </div>
      </div>

      <div class="gdSummary">
        <div class="gdGlance">
          <span class="gdEyebrow">${esc(se.glanceLabel[locale])}</span>
          <div class="gdGlanceGrid">
${glanceCards}
          </div>
        </div>
        <aside class="gdTakeaway" aria-live="polite">
          <span class="gdTakeawayLabel"><span class="gdTakeawayIcon" aria-hidden="true">${ICON.bulb}</span>${esc(se.takeawayLabel[locale])}</span>
          <p class="gdTakeawayText" data-takeaway></p>
        </aside>
      </div>
    </div>

    <p class="gdFoot">${esc(se.ref[locale])} <a href="#projects">${esc(se.seeProjects[locale])} →</a></p>
  </div>
</section>`;

  const newsItems = news
    .map(
      (n, i) => `      <li class="homeCard reveal" style="--d:${i * 45}ms" data-tag="${n.tag}">
        <span class="newsTag newsTag-${n.tag}">${esc(n.tagLabel[locale])}</span>
        <span class="newsDate">${esc(n.date[locale])}</span>
        <span class="newsText">
          ${n.text[locale]}
        </span>
      </li>`,
    )
    .join("\n\n");

  const newsSection = `
<!-- Recent updates -->
<section class="section reveal" id="news">
  <div class="sectionHead">
    <h2>${esc(c.newsSection.heading[locale])}</h2>
    <div class="small">${esc(c.newsSection.small[locale])}</div>
  </div>

  <div class="updatesCard">
    <ul class="newsList compactNewsList">

${newsItems}

    </ul>
    <div class="newsControls">
      <button class="btn newsToggle" id="newsToggleBtn" type="button" aria-expanded="false">${esc(c.newsSection.showMore[locale])}</button>
    </div>
  </div>
</section>`;

  const awardItems = c.educationSection.awards
    .map((award) => `<li>${esc(award[locale])}</li>`)
    .join("\n");

  const educationSection = `
<section class="section reveal" id="education">
  <div class="sectionHead">
    <h2>${esc(c.educationSection.heading[locale])}</h2>
    <div class="small">${esc(c.educationSection.small[locale])}</div>
  </div>
  <div class="educationGrid">
    <article class="homeCard educationCard">
      <h3>${esc(c.educationSection.heading[locale])}</h3>
      <ul class="projList">
${education.map((e) => `        <li>${e.degree[locale]}</li>`).join("\n")}
      </ul>
    </article>
    <article class="homeCard educationCard">
      <h3>${esc(c.educationSection.awardsTitle[locale])}</h3>
      <ul class="projList">
${awardItems}
      </ul>
    </article>
  </div>
</section>`;

  const contactSection = `
<section class="section reveal" id="contact">
<div class="sectionHead">
<h2>${esc(c.contactSection.heading[locale])}</h2>
<div class="small">${esc(c.contactSection.small[locale])}</div>
</div>
<div class="homeCard contactPanel">
<p class="contactIntro">${esc(c.contactSection.intro[locale])}</p>
<div class="contactGrid">
  <a class="contactItem" href="mailto:${escUrl(links.email)}">
    <div class="contactIcon">@</div>
    <div class="contactDetails">
      <span class="contactLabel">${esc(c.contactSection.emailLabel[locale])}</span>
      <span class="contactUrl">${esc(links.email)}</span>
    </div>
  </a>
  <a class="contactItem" href="${escUrl(links.scholar)}" target="_blank" rel="noopener">
    <div class="contactIcon">G</div>
    <div class="contactDetails">
      <span class="contactLabel">${esc(c.contactSection.scholarLabel[locale])}</span>
      <span class="contactUrl">scholar.google.com</span>
    </div>
  </a>
  <a class="contactItem" href="${escUrl(links.linkedin)}" target="_blank" rel="noopener">
    <div class="contactIcon">in</div>
    <div class="contactDetails">
      <span class="contactLabel">${esc(c.contactSection.linkedinLabel[locale])}</span>
      <span class="contactUrl">${esc(links.linkedinDisplay)}</span>
    </div>
  </a>
  <a class="contactItem" href="${escUrl(projectsHref)}">
    <div class="contactIcon">↗</div>
    <div class="contactDetails">
      <span class="contactLabel">${esc(c.contactSection.projectsLabel[locale])}</span>
      <span class="contactUrl">${esc(c.projectsSection.heading[locale])}</span>
    </div>
  </a>
</div>
</div>
<div class="footer">© <span id="y"></span> ${esc(c.footerName[locale])}</div>
</section>`;

  return `${cover}
<main class="container homeMain coverMain">
${recognition}
${about}
${featuredWorkSection}
${experienceSection}
${stepEngineering}
${newsSection}
${educationSection}
${contactSection}
</main>`;
}
