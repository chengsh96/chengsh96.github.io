// Apply persisted theme immediately — runs on every page before paint
// Default is light; dark only if user has explicitly chosen it.
(function(){
  if (localStorage.getItem('theme') === 'dark')
    document.documentElement.setAttribute('data-theme', 'dark');
})();

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
  const DEFAULT_VISIBLE = 4;

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
// Language toggle (EN / 简体中文) via separate /zh/ pages
// - Default: EN
// - Persist choice in localStorage under key "lang"
// - Switches between /zh/<path> and /<path>
// Supports:
//   A) GitHub USER pages:    https://<user>.github.io/...
//   B) GitHub PROJECT pages: https://<user>.github.io/<repo>/...
//   C) Local dev server:     http://127.0.0.1:5500/<repo>/...
// ===========================
(function initLanguageTogglePath() {
  const btn = document.querySelector("[data-lang-toggle]");
  if (!btn) return;

  const isLocal =
    location.hostname === "127.0.0.1" ||
    location.hostname === "localhost";

  // For your USER pages site, these are "real" top-level folders/files.
  // If the first segment matches one of these, it is NOT a repo prefix.
  const TOP_LEVEL = new Set(["projects", "assets", "zh", "index.html", "README.md"]);

  function parsePath() {
    const parts = window.location.pathname.split("/").filter(Boolean);

    let prefix = "";
    let isZh = false;
    let restParts = [];

    // Chinese page patterns:
    // 1) USER pages:    /zh/<rest>
    // 2) PROJECT/local: /<prefix>/zh/<rest>
    if (parts.length > 0 && parts[0] === "zh") {
      isZh = true;
      prefix = "";
      restParts = parts.slice(1);
      return { prefix, isZh, rest: restParts.join("/") };
    }
    if (parts.length > 1 && parts[1] === "zh") {
      isZh = true;
      prefix = "/" + parts[0];
      restParts = parts.slice(2);
      return { prefix, isZh, rest: restParts.join("/") };
    }

    // English page patterns:
    // - Local dev often looks like /<repo-folder>/<rest>  (must keep prefix)
    // - GitHub USER pages looks like /<rest>              (no prefix)
    // - GitHub PROJECT pages looks like /<repo>/<rest>    (has prefix)
    isZh = false;

    if (isLocal) {
      // Local: treat first segment as prefix (repo folder)
      prefix = parts.length > 0 ? "/" + parts[0] : "";
      restParts = parts.slice(1);
    } else {
      // GitHub Pages:
      // Only treat first segment as prefix if it doesn't look like your normal top-level
      // and it doesn't look like a file (contains ".")
      if (
        parts.length > 0 &&
        !TOP_LEVEL.has(parts[0]) &&
        !parts[0].includes(".")
      ) {
        prefix = "/" + parts[0];
        restParts = parts.slice(1);
      } else {
        prefix = "";
        restParts = parts;
      }
    }

    return { prefix, isZh, rest: restParts.join("/") };
  }

  function setBtnLabel(isZhNow) {
    btn.textContent = isZhNow ? "EN" : "中文";
  }

  function normalizePath(path) {
    return path.replace(/\/+/g, "/");
  }

  function buildTarget(prefix, targetIsZh, rest) {
    let r = rest || "";
    if (!r || r.endsWith("/")) r += "index.html";
    if (r === "") r = "index.html";

    // Safety: avoid accidental duplication
    if (r === "index.html/index.html") r = "index.html";

    const p = prefix || "";
    if (targetIsZh) return normalizePath(p + "/zh/" + r);
    return normalizePath(p + "/" + r);
  }

  btn.addEventListener("click", () => {
    const { prefix, isZh, rest } = parsePath();
    const nextIsZh = !isZh;

    localStorage.setItem("lang", nextIsZh ? "zh" : "en");

    const target = buildTarget(prefix, nextIsZh, rest);
    window.location.href = target + window.location.search;
  });

  // URL is authoritative for language — no auto-redirect.
  // The toggle button label reflects the current page's language.
  const { isZh } = parsePath();
  setBtnLabel(isZh);
})();


// P0-3: Stat counter — animates numeric stats once they enter view
(function initStatCounters(){
  const stats = document.querySelectorAll('.statNum[data-count-to]');
  if (!stats.length) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const animate = (el) => {
    const target = parseInt(el.dataset.countTo, 10);
    const suffix = el.dataset.suffix || '';
    if (reduce){ el.textContent = target.toLocaleString() + suffix; return; }
    const dur = 1400, start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased).toLocaleString() + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting){ animate(e.target); obs.unobserve(e.target); }
    });
  }, { threshold: 0.4 });
  stats.forEach(s => obs.observe(s));
})();


// P1-2: Project filter chips
(function initProjectFilter(){
  const chips = document.querySelectorAll('.filterChip');
  const cards = document.querySelectorAll('.proj[data-tags]');
  if (!chips.length || !cards.length) return;

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const filter = chip.dataset.filter;
      chips.forEach(c => {
        const active = c === chip;
        c.classList.toggle('is-active', active);
        c.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      cards.forEach(card => {
        const tags = (card.dataset.tags || '').split(/\s+/);
        const match = filter === 'all' || tags.includes(filter);
        card.classList.toggle('is-hidden', !match);
      });
    });
  });
})();


// Typewriter role animation in hero
(function initTypewriter(){
  const el = document.getElementById('roleTyped');
  if (!el) return;

  const isZh = window.location.pathname.includes('/zh/');
  const roles = isZh
    ? ['机器人工程师', '控制工程师', '研究科学家', '传感融合工程师', '可穿戴机器人开发者', '人体运动调试员']
    : ['Robotics Engineer', 'Control Engineer', 'Research Scientist', 'Sensor Fusion Engineer', 'Wearable Robotics Builder', 'Human-Motion Debugger'];

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    el.textContent = roles[0]; return;
  }

  let r = 0, c = 0, deleting = false;
  const PAUSE = 2200, TYPE = 75, DEL = 38;

  function tick(){
    const word = roles[r];
    if (!deleting){
      el.textContent = word.slice(0, ++c);
      if (c === word.length){ deleting = true; setTimeout(tick, PAUSE); return; }
    } else {
      el.textContent = word.slice(0, --c);
      if (c === 0){ deleting = false; r = (r + 1) % roles.length; setTimeout(tick, 300); return; }
    }
    setTimeout(tick, deleting ? DEL : TYPE);
  }
  tick();
})();


// P3-1: Dark mode toggle — works on every page; auto-injects button if absent
(function initThemeToggle(){
  const root = document.documentElement;

  function sync(btn){
    const dark = root.getAttribute('data-theme') === 'dark';
    const zh = window.location.pathname.includes('/zh/');
    btn.textContent = dark ? (zh ? '浅色' : 'Light') : (zh ? '深色' : 'Dark');
    btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  }

  function wire(btn){
    sync(btn);
    btn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      sync(btn);
    });
  }

  // If button already in markup, wire it immediately
  const existing = document.querySelector('[data-theme-toggle]');
  if (existing) { wire(existing); return; }

  // Otherwise inject before the lang button so all pages get the toggle
  document.addEventListener('DOMContentLoaded', () => {
    const langBtn = document.querySelector('[data-lang-toggle]');
    if (!langBtn) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('data-theme-toggle', '');
    btn.className = 'themeBtn';
    langBtn.parentNode.insertBefore(btn, langBtn);
    wire(btn);
  });
})();
