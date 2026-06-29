import type { Locale } from "../content/schema.js";
import { chrome } from "../content/site.js";
import {
  SITE,
  absoluteUrl,
  alternates,
  buildNav,
  pairedHref,
} from "../lib/localized.js";
import { asset, esc, escUrl } from "./html.js";

const CSS_VERSION = "v=13";
const FONTS =
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800;900&family=Instrument+Serif:ital@0;1&display=swap";

const htmlLang: Record<Locale, string> = { en: "en", zh: "zh-CN" };

export type HeadMeta = {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string; // site-root-relative path
};

function renderHead(locale: Locale, rootPath: string, meta: HeadMeta): string {
  const canonical = absoluteUrl(rootPath);
  const ogImageUrl = `${SITE}/${meta.ogImage}`;
  const alt = alternates(rootPath);
  return [
    "<head>",
    '<meta charset="utf-8"/>',
    '<meta content="width=device-width,initial-scale=1" name="viewport"/>',
    `<title>${esc(meta.title)}</title>`,
    '<meta property="og:type" content="website"/>',
    `<link rel="canonical" href="${escUrl(canonical)}"/>`,
    "<!-- Social meta -->",
    `<meta name="description" content="${esc(meta.description)}"/>`,
    `<meta property="og:title" content="${esc(meta.ogTitle)}"/>`,
    `<meta property="og:description" content="${esc(meta.ogDescription)}"/>`,
    `<meta property="og:url" content="${escUrl(canonical)}"/>`,
    `<meta property="og:image" content="${escUrl(ogImageUrl)}"/>`,
    '<meta name="twitter:card" content="summary_large_image"/>',
    `<meta name="twitter:image" content="${escUrl(ogImageUrl)}"/>`,
    "<!-- hreflang alternates -->",
    `<link rel="alternate" hreflang="en" href="${escUrl(alt.en)}"/>`,
    `<link rel="alternate" hreflang="zh-CN" href="${escUrl(alt.zh)}"/>`,
    `<link rel="alternate" hreflang="x-default" href="${escUrl(alt.en)}"/>`,
    "<!-- Google Fonts -->",
    '<link rel="preconnect" href="https://fonts.googleapis.com"/>',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>',
    `<link href="${escUrl(FONTS)}" rel="stylesheet"/>`,
    `<link href="${asset("assets/site.css", rootPath)}?${CSS_VERSION}" rel="stylesheet"/>`,
    "</head>",
  ].join("\n");
}

function navList(locale: Locale, rootPath: string): string {
  return buildNav(locale, rootPath)
    .map((l) => `<a href="${escUrl(l.href)}">${esc(l.label)}</a>`)
    .join("\n");
}

function renderHeader(locale: Locale, rootPath: string): string {
  const links = navList(locale, rootPath);
  const langHref = pairedHref(rootPath);
  return [
    '<header class="nav">',
    '<div class="navInner">',
    '<div class="brand">',
    '<span class="dot"></span>',
    `<span>${esc(chrome.brand[locale])}</span>`,
    "</div>",
    '<nav class="navLinks">',
    links,
    "</nav>",
    `<button class="themeBtn" type="button" data-theme-toggle aria-label="${esc(chrome.themeBtn.aria[locale])}">${esc(chrome.themeBtn.text[locale])}</button>`,
    `<button class="langBtn" type="button" data-lang-toggle data-lang-href="${escUrl(langHref)}" aria-label="${esc(chrome.langBtn.aria[locale])}">${esc(chrome.langBtn.text[locale])}</button>`,
    `<button aria-label="${esc(chrome.menuBtn.aria[locale])}" class="navBtn" data-navbtn="">${esc(chrome.menuBtn.text[locale])}</button>`,
    "</div>",
    '<div class="mobileMenu" data-mobilemenu="">',
    links,
    "</div>",
    "</header>",
  ].join("\n");
}

export type PageOptions = {
  locale: Locale;
  rootPath: string;
  meta: HeadMeta;
  main: string; // inner HTML of <main> (or full <main>...</main>)
  scripts: string[]; // site-root-relative script paths
  inlineScripts?: string[];
};

export function renderPage(opts: PageOptions): string {
  const { locale, rootPath, meta, main, scripts, inlineScripts = [] } = opts;
  const scriptTags = [
    ...scripts.map((s) => `<script src="${asset(s, rootPath)}"></script>`),
    ...inlineScripts.map((s) => `<script>${s}</script>`),
  ].join("\n");
  return [
    "<!DOCTYPE html>",
    `<html lang="${htmlLang[locale]}">`,
    renderHead(locale, rootPath, meta),
    "<body>",
    renderHeader(locale, rootPath),
    main,
    scriptTags,
    "</body>",
    "</html>",
    "",
  ].join("\n");
}
