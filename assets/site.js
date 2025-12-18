// Mobile menu
const btn = document.querySelector("[data-navbtn]");
const menu = document.querySelector("[data-mobilemenu]");
if (btn && menu) {
  btn.addEventListener("click", () => menu.classList.toggle("open"));
}

// Scroll reveal
const els = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) e.target.classList.add("show");
  }
}, { threshold: 0.12 });
els.forEach(el => io.observe(el));

// ===========================
// Recent News: show first 3 items, expand/collapse
// ===========================
// ===========================
// Recent News: show first 3 items, expand/collapse
// ===========================
document.addEventListener("DOMContentLoaded", () => {
  const list = document.querySelector(".newsList");
  const btn = document.getElementById("newsToggleBtn");
  if (!list || !btn) return;

  const items = Array.from(list.querySelectorAll("li"));
  const DEFAULT_VISIBLE = 3;

  if (items.length <= DEFAULT_VISIBLE) {
    btn.style.display = "none";
    return;
  }

  let expanded = false;

  function apply() {
    items.forEach((li, idx) => {
      li.style.display = (!expanded && idx >= DEFAULT_VISIBLE)
        ? "none"
        : "";
    });
    btn.textContent = expanded ? ((window.location.pathname.includes("/zh/")) ? "收起" : "Show less") : ((window.location.pathname.includes("/zh/")) ? "展开" : "Show more");
    btn.setAttribute("aria-expanded", expanded ? "true" : "false");
  }

  btn.addEventListener("click", () => {
    expanded = !expanded;
    apply();
  });

  apply();
});


// ===========================
// Simple Lightbox (project figures)
// Click any figure image on a project page to view it larger.
// ===========================

function ensureLightbox() {
  let overlay = document.querySelector(".lightboxOverlay");
  if (overlay) return overlay;

  overlay = document.createElement("div");
  overlay.className = "lightboxOverlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Image preview");

  overlay.innerHTML = `
    <button class="lightboxClose" type="button" aria-label="Close">×</button>
    <div class="lightboxContent" role="document">
      <img class="lightboxImg" alt="" />
      <div class="lightboxCaption" aria-live="polite"></div>
    </div>
  `;

  document.body.appendChild(overlay);

  const closeBtn = overlay.querySelector(".lightboxClose");
  const content = overlay.querySelector(".lightboxContent");

  function close() {
    overlay.classList.remove("open");
    document.documentElement.classList.remove("noScroll");
    document.body.classList.remove("noScroll");
    const img = overlay.querySelector(".lightboxImg");
    img.src = "";
  }

  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    // Click outside the content closes
    if (!content.contains(e.target)) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("open")) close();
  });

  // expose close for internal use
  overlay._close = close;
  return overlay;
}

function openLightboxFromImage(imgEl) {
  const overlay = ensureLightbox();
  const lbImg = overlay.querySelector(".lightboxImg");
  const caption = overlay.querySelector(".lightboxCaption");

  const src = imgEl.getAttribute("data-full") || imgEl.currentSrc || imgEl.src;
  const alt = imgEl.getAttribute("alt") || "";

  lbImg.src = src;
  lbImg.alt = alt;
  caption.textContent = alt;

  overlay.classList.add("open");
  document.documentElement.classList.add("noScroll");
  document.body.classList.add("noScroll");
}

// Attach lightbox behavior to project-page figures.
// We scope it to common project media containers to avoid unexpected behavior elsewhere.
const lightboxTargets = document.querySelectorAll(
  ".mediaGrid img, .mediaFigure img, .mediaItem img, .heroImg, .heroMedia img"
);

if (lightboxTargets.length) {
  lightboxTargets.forEach((img) => {
    img.classList.add("lightboxTrigger");
    img.addEventListener("click", () => openLightboxFromImage(img));
  });
}


// ===========================
// Language toggle (EN / 简体中文)
// Default: EN. Persist in localStorage under key "lang".
// Elements with data-i18n="key" will be replaced.
// ===========================
(function initLanguageToggle() {
  const I18N = {
  "en": {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.news": "News",
    "nav.featured": "Featured Projects",
    "nav.experience": "Experience",
    "nav.education": "Education",
    "nav.contact": "Contact",
    "nav.all": "All Projects",
    "nav.menu": "Menu",
    "section.about": "About",
    "section.news": "Recent News",
    "section.projects": "Featured Projects",
    "section.experience": "Experience",
    "section.education": "Education",
    "section.contact": "Contact",
    "small.latest": "Latest updates",
    "small.degrees": "Degrees",
    "small.selected_roles": "Selected roles",
    "small.lets_connect": "Let’s connect",
    "small.research_to_deploy": "Research → deployment"
  },
  "zh": {
    "nav.home": "首页",
    "nav.about": "关于",
    "nav.news": "动态",
    "nav.featured": "精选项目",
    "nav.experience": "经历",
    "nav.education": "教育",
    "nav.contact": "联系",
    "nav.all": "全部项目",
    "nav.menu": "菜单",
    "section.about": "关于",
    "section.news": "最新动态",
    "section.projects": "精选项目",
    "section.experience": "经历",
    "section.education": "教育",
    "section.contact": "联系",
    "small.latest": "最新更新",
    "small.degrees": "学位",
    "small.selected_roles": "主要经历",
    "small.lets_connect": "欢迎联系",
    "small.research_to_deploy": "研究 → 落地"
  }
};
  const DEFAULT_LANG = "en";
  const btn = document.querySelector("[data-lang-toggle]");
  if (!btn) return;

  let lang = localStorage.getItem("lang") || DEFAULT_LANG;

  function apply() {
    const dict = I18N[lang] || I18N[DEFAULT_LANG];
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (dict && dict[key]) el.textContent = dict[key];
    });
    btn.textContent = (lang === "en") ? "中文" : "EN";
    document.documentElement.setAttribute("lang", (lang === "en") ? "en" : "zh-CN");
  }

  btn.addEventListener("click", () => {
    lang = (lang === "en") ? "zh" : "en";
    localStorage.setItem("lang", lang);
    apply();
  });

  apply();
})();


// ===========================
// Language toggle (EN / 简体中文) via separate /zh/ pages
// - Default: EN
// - Persist choice in localStorage under key "lang"
// - Switches between /zh/<path> and /<path>
// ===========================
(function initLanguageTogglePath(){
  const btn = document.querySelector("[data-lang-toggle]");
  if (!btn) return;

  // Support both user pages (/) and project pages (/<repo>/)
  function parsePath() {
    const parts = window.location.pathname.split("/").filter(Boolean);
    // Cases:
    // 1) /zh/...                => parts[0] === "zh"
    // 2) /<repo>/zh/...         => parts[1] === "zh"
    // 3) /<repo>/... or /...
    let prefix = "";
    let isZh = false;
    let restParts = [];

    if (parts.length > 0 && parts[0] === "zh") {
      isZh = true;
      prefix = "";
      restParts = parts.slice(1);
    } else if (parts.length > 1 && parts[1] === "zh") {
      isZh = true;
      prefix = "/" + parts[0];
      restParts = parts.slice(2);
    } else {
      isZh = false;
      // If this is a project page, treat first segment as repo prefix.
      // If it's a user page, prefix will just be "" (no repo segment).
      // Heuristic: if the site is a project page, your homepage is at /<repo>/.
      // We assume that if there is at least one segment and it's not a file like index.html,
      // it's a repo prefix.
      if (parts.length > 0) {
        prefix = "/" + parts[0];
        restParts = parts.slice(1);
      } else {
        prefix = "";
        restParts = [];
      }
    }

    return { prefix, isZh, rest: restParts.join("/") };
  }

  function setBtnLabel(isZh) {
    btn.textContent = isZh ? "EN" : "中文";
  }

  function buildTarget(prefix, isZh, rest) {
    // Keep default document when rest is empty
    if (!rest) rest = "index.html";
    if (isZh) {
      return prefix + "/" + rest;
    } else {
      return prefix + "/zh/" + rest;
    }
  }

  btn.addEventListener("click", () => {
    const { prefix, isZh, rest } = parsePath();
    localStorage.setItem("lang", isZh ? "en" : "zh");
    window.location.href = buildTarget(prefix, !isZh, rest) + window.location.search + window.location.hash;
  });

  const pref = localStorage.getItem("lang") || "en";
  const { prefix, isZh, rest } = parsePath();

  // Auto-redirect to preferred language version
  if (pref === "zh" && !isZh) {
    window.location.replace(buildTarget(prefix, false, rest) + window.location.search + window.location.hash);
    return;
  }
  if (pref === "en" && isZh) {
    window.location.replace(buildTarget(prefix, true, rest) + window.location.search + window.location.hash);
    return;
  }

  setBtnLabel(isZh);
})();