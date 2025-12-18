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
(function initNewsToggle(){
  const list = document.querySelector(".newsList");
  const btn = document.getElementById("newsToggleBtn");
  if (!list || !btn) return;

  const items = Array.from(list.querySelectorAll("li"));
  const DEFAULT_VISIBLE = 3;

  if (items.length <= DEFAULT_VISIBLE) {
    // Nothing to collapse
    btn.style.display = "none";
    return;
  }

  let expanded = false;

  function apply(){
    items.forEach((li, idx) => {
      const hide = (!expanded && idx >= DEFAULT_VISIBLE);
      li.classList.toggle("newsHidden", hide);
    });
    btn.textContent = expanded ? "Show less" : "Show more";
    btn.setAttribute("aria-expanded", String(expanded));
  }

  btn.addEventListener("click", () => {
    expanded = !expanded;
    apply();
  });

  apply();
})();

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
