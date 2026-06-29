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
// Recent News: show first N items, expand/collapse
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
    if (overlay._lastFocused && document.contains(overlay._lastFocused)) {
      overlay._lastFocused.focus();
    }
  }

  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    // Click outside the content closes
    if (!content.contains(e.target)) close();
  });
  document.addEventListener("keydown", (e) => {
    if (!overlay.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key !== "Tab") return;

    const focusable = Array.from(overlay.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )).filter(el => !el.disabled && el.offsetParent !== null);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  // expose close for internal use
  overlay._close = close;
  return overlay;
}

function openLightboxFromImage(imgEl) {
  const overlay = ensureLightbox();
  const lbImg = overlay.querySelector(".lightboxImg");
  const caption = overlay.querySelector(".lightboxCaption");
  const closeBtn = overlay.querySelector(".lightboxClose");

  const src = imgEl.getAttribute("data-full") || imgEl.currentSrc || imgEl.src;
  const alt = imgEl.getAttribute("alt") || "";

  lbImg.src = src;
  lbImg.alt = alt;
  caption.textContent = alt;

  overlay._lastFocused = document.activeElement;
  overlay.classList.add("open");
  document.documentElement.classList.add("noScroll");
  document.body.classList.add("noScroll");
  closeBtn.focus();
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
    btn.textContent = isZhNow ? "English" : "\u4e2d\u6587";
    btn.setAttribute("aria-label", isZhNow ? "Switch to English" : "Switch to Chinese");
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
    // Prefer the build-time paired href from the route registry when present
    // (generated pages); fall back to runtime path mapping for any page without it.
    const explicit = btn.getAttribute("data-lang-href");
    if (explicit) {
      window.location.href = explicit + window.location.search;
      return;
    }
    const { prefix, isZh, rest } = parsePath();
    const nextIsZh = !isZh;

    const target = buildTarget(prefix, nextIsZh, rest);
    window.location.href = target + window.location.search;
  });

  // The generated page language is authoritative; URL parsing is only a fallback.
  const pageIsZh = (document.documentElement.lang || "").toLowerCase().startsWith("zh");
  const { isZh } = parsePath();
  setBtnLabel(pageIsZh || isZh);
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
        c.setAttribute('aria-pressed', active ? 'true' : 'false');
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
    ? ['控制工程师', '机器人研究者', '可穿戴机器人工程师', '人体运动研究者']
    : ['Control Engineer', 'Robotics Researcher', 'Wearable Robotics Engineer', 'Human Locomotion Researcher'];

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


// ===========================
// Scroll progress bar + sticky-nav shadow
// ===========================
(function initScrollChrome(){
  const bar = document.querySelector('.scrollProgress');
  const nav = document.querySelector('.nav');
  if (!bar && !nav) return;
  let ticking = false;
  function update(){
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const p = max > 0 ? Math.min(1, h.scrollTop / max) : 0;
    if (bar) bar.style.transform = 'scaleX(' + p + ')';
    if (nav) nav.classList.toggle('scrolled', h.scrollTop > 8);
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking){ requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
})();


// ===========================
// Drag-to-scroll for the research -> product timeline
// ===========================
(function initTimelineDrag(){
  const track = document.querySelector('[data-timeline]');
  if (!track) return;
  let down = false, startX = 0, startScroll = 0, moved = false;
  track.addEventListener('pointerdown', (e) => {
    down = true; moved = false; startX = e.clientX; startScroll = track.scrollLeft;
    track.classList.add('dragging');
    track.setPointerCapture && track.setPointerCapture(e.pointerId);
  });
  track.addEventListener('pointermove', (e) => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 4) moved = true;
    track.scrollLeft = startScroll - dx;
  });
  function end(){ down = false; track.classList.remove('dragging'); }
  track.addEventListener('pointerup', end);
  track.addEventListener('pointercancel', end);
  // Suppress accidental click navigation after a drag
  track.addEventListener('click', (e) => { if (moved) e.preventDefault(); }, true);
})();


// ===========================
// Hero cockpit: animated telemetry readouts
// ===========================
(function initCockpit(){
  const root = document.querySelector('.cockpitReadout');
  if (!root) return;
  const zh = window.location.pathname.includes('/zh/');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const V = zh ? {
    phase:   ['脚跟触地','负重期','站立中期','蹬地期','摆动期'],
    intent:  ['行走','上楼梯','坡道','站立'],
    terrain: ['平地','斜坡','楼梯','平地'],
    mode:    ['自适应','平衡感知','助力']
  } : {
    phase:   ['Heel Strike','Loading','Mid-Stance','Push-Off','Swing'],
    intent:  ['Walk','Stair ascent','Ramp','Stand'],
    terrain: ['Flat','Incline','Stairs','Flat'],
    mode:    ['Adaptive','Balance-aware','Assist']
  };
  const node = (k) => root.querySelector('.cockpitValue[data-metric="' + k + '"]');
  const n = { phase:node('phase'), intent:node('intent'), terrain:node('terrain'), mode:node('mode'), latency:node('latency') };
  function set(el, val){
    if (!el || el.textContent === val) return;
    el.textContent = val;
    el.classList.remove('flip'); void el.offsetWidth; el.classList.add('flip');
  }
  let i = 0;
  function tick(){
    set(n.phase,   V.phase[i % V.phase.length]);
    set(n.intent,  V.intent[i % V.intent.length]);
    set(n.terrain, V.terrain[i % V.terrain.length]);
    set(n.mode,    V.mode[(i >> 1) % V.mode.length]);
    set(n.latency, (6 + Math.random() * 3).toFixed(1) + ' ms');
    i++;
  }
  tick();
  if (!reduce) setInterval(tick, 1700);
})();


// ===========================
// Hero mouse parallax + cockpit tilt
// ===========================
(function initHeroParallax(){
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip on touch
  const scene = document.querySelector('[data-parallax-scene]');
  if (!scene) return;
  const bg = scene.querySelector('[data-parallax]');
  const tilt = scene.querySelector('[data-tilt]');
  let raf = 0, tx = 0, ty = 0;
  function apply(){
    raf = 0;
    if (bg) bg.style.transform = 'translate(' + (tx * 16) + 'px,' + (ty * 16) + 'px)';
    if (tilt) tilt.style.transform = 'rotateX(' + (-ty * 3.5) + 'deg) rotateY(' + (tx * 4.5) + 'deg)';
  }
  scene.addEventListener('pointermove', (e) => {
    const r = scene.getBoundingClientRect();
    tx = (e.clientX - r.left) / r.width - 0.5;
    ty = (e.clientY - r.top) / r.height - 0.5;
    if (!raf) raf = requestAnimationFrame(apply);
  });
  scene.addEventListener('pointerleave', () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(apply); });
})();


// ===========================
// Homepage left section rail
// ===========================
(function initHomeSectionNav(){
  const links = Array.from(document.querySelectorAll('.homeSectionNav a[data-section-link]'));
  const sections = links
    .map((link) => document.getElementById(link.dataset.sectionLink || ''))
    .filter(Boolean);
  if (!links.length || !sections.length) return;

  const activate = (id) => {
    links.forEach((link) => {
      const active = link.dataset.sectionLink === id;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };

  let ticking = false;
  const update = () => {
    const marker = window.scrollY + Math.min(window.innerHeight * 0.24, 220);
    let current = sections[0].id;
    sections.forEach((section) => {
      if (section.offsetTop <= marker) current = section.id;
    });
    const snapshot = sections.find((section) => section.id === 'snapshot');
    if (snapshot && current === snapshot.id && window.scrollY < snapshot.offsetTop - 80) {
      current = sections[0].id;
    }
    activate(current);
    ticking = false;
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  update();
})();
