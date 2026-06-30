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

  const philosophySteps = c.stepEngineering.loopSteps
    .map(
      (step, i) => `<article class="philosophyStep">
  <span class="philosophyIndex">${String(i + 1).padStart(2, "0")}</span>
  <h3>${esc(step.title[locale])}</h3>
  <p>${esc(step.text[locale])}</p>
</article>`,
    )
    .join("\n");

  const fallbackPhases = [
    { en: "Heel Strike", zh: "脚跟触地" },
    { en: "Loading", zh: "负重期" },
    { en: "Mid-Stance", zh: "站立中期" },
    { en: "Push-Off", zh: "蹬地期" },
    { en: "Swing", zh: "摆动期" },
    { en: "Next Heel Strike", zh: "下次脚跟触地" },
  ] as const;
  const fallbackDetail = {
    human: { en: "Human", zh: "人体动作" },
    senses: { en: "Robot senses", zh: "机器人感知" },
    ctrl: { en: "Controller asks", zh: "控制器决策" },
    footPitch: { en: "Foot Pitch", zh: "脚部俯仰角" },
    vgrf: { en: "vGRF", zh: "垂直地反力" },
    humanText: {
      en: "The foot contacts the ground. Body weight begins transferring onto the leading leg.",
      zh: "脚接触地面，体重开始向前腿转移。",
    },
    sensesText: {
      en: "Impact timing, rapid force rise, foot orientation, and angular velocity from the IMU.",
      zh: "冲击时序、力的快速上升、脚部朝向以及 IMU 角速度。",
    },
    ctrlText: {
      en: '"Has stance begun? Is this a normal step, a sudden stop, or an uneven surface?"',
      zh: '"是否进入支撑相？这是正常步伐、突然停止，还是不平整地面？"',
    },
  };

  const stepEngineering = `
<!-- Technical philosophy / Hidden Engineering Behind a Step -->
<section class="section reveal" id="step-engineering">
  <div class="sectionHead">
    <h2>${esc(c.stepEngineering.heading[locale])}</h2>
    <div class="small">${esc(c.stepEngineering.small[locale])}</div>
  </div>
  <div class="homeCard stepEngineeringPanel">
    <p class="stepEngIntro">${esc(c.stepEngineering.intro[locale])}</p>
    <div class="controlLoop fallbackLoop" aria-label="${esc(c.stepEngineering.controlLoopAria[locale])}">
${philosophySteps}
    </div>
    <div class="stepTimeline fallbackTimeline" role="tablist" aria-label="${esc(c.stepEngineering.timelineAria[locale])}">
${fallbackPhases.map((p, i) => `      <button class="sePhase" type="button" role="tab" aria-selected="${i === 0 ? "true" : "false"}">${esc(p[locale])}</button>`).join("\n")}
    </div>
    <div class="timelineProgress" aria-hidden="true"><div class="timelineProgressFill" style="width: 16.6667%"></div></div>
    <div class="seCenter">
      <div class="seVisualRow">
      <div class="seStage" aria-hidden="true"></div>
      <div class="signalWaves" aria-hidden="true">
        <div class="fallbackSignals">
          <div class="homeCard fallbackSignal"><strong>${esc(fallbackDetail.footPitch[locale])}</strong><span>deg</span></div>
          <div class="homeCard fallbackSignal"><strong>${esc(fallbackDetail.vgrf[locale])}</strong><span>%BW</span></div>
        </div>
      </div>
      </div>
      <div class="stepDetail homeCard" role="tabpanel" aria-live="polite">
        <div id="seHuman"><h4>${esc(fallbackDetail.human[locale])}</h4><p>${esc(fallbackDetail.humanText[locale])}</p></div>
        <div id="seSenses"><h4>${esc(fallbackDetail.senses[locale])}</h4><p>${esc(fallbackDetail.sensesText[locale])}</p></div>
        <div id="seCtrl"><h4>${esc(fallbackDetail.ctrl[locale])}</h4><p><em>${esc(fallbackDetail.ctrlText[locale])}</em></p></div>
      </div>
    </div>
    <div class="factGrid"></div>
    <p class="stepRef"></p>
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
