// Shared bilingual content model. Every user-visible string is a LocalizedString
// (both en and zh required); structural/metadata fields (id, slug, url, image,
// dates, tags) are intentionally NOT localized. See check-content-parity.ts for
// the rules these types are validated against at build time.

export type Locale = "en" | "zh";

export type LocalizedString = {
  en: string;
  zh: string;
};

// Same shape as LocalizedString, but the value may contain inline HTML
// (e.g. <a>, <strong>, <em>). Kept as a distinct type to document intent.
export type LocalizedRichText = {
  en: string;
  zh: string;
};

export type LocalizedArray<T> = {
  en: T[];
  zh: T[];
};

// ---------------------------------------------------------------------------
// Routes & navigation
// ---------------------------------------------------------------------------

// A real, addressable page (used for SEO + sitemap). Project detail pages are
// derived from projects.ts rather than listed here.
export type Route = {
  id: string;
  paths: { en: string; zh: string };
  title: LocalizedString;
  description: LocalizedString;
  // og:title / og:description default to title / description when omitted.
  ogTitle?: LocalizedString;
  ogDescription?: LocalizedString;
  ogImage: string; // site-root-relative path, e.g. "assets/img/profile.jpg"
};

// A header-menu entry. `target` is either an in-page anchor on the homepage
// (e.g. "#about") or the id of a Route ("home", "projects"). The nav builder
// resolves these to correct relative hrefs per page and locale.
export type NavItem = {
  id: string;
  order: number;
  label: LocalizedString;
  target: { kind: "anchor"; anchor: string } | { kind: "route"; routeId: string };
};

// ---------------------------------------------------------------------------
// Project detail bodies (typed blocks)
// ---------------------------------------------------------------------------

export type MediaItem = {
  image: string; // path relative to site root, e.g. "assets/img/projects/x.jpg"
  w: number;
  h: number;
  alt: LocalizedString;
  caption?: LocalizedRichText;
};

export type Block =
  | { kind: "paragraph"; text: LocalizedRichText }
  | { kind: "heading"; text: LocalizedString }
  | { kind: "list"; items: LocalizedRichText[] }
  | { kind: "linkRow"; links: { href: string; label: LocalizedString }[] }
  | { kind: "mediaGrid"; items: MediaItem[] }
  | { kind: "hr" }
  // Escape hatch for bespoke layouts (e.g. shiftos). Still bilingual, so the
  // parity checker enforces both languages exist and are non-empty.
  | { kind: "raw"; html: LocalizedRichText };

// ---------------------------------------------------------------------------
// Content collections
// ---------------------------------------------------------------------------

export type Project = {
  id: string;
  slug: string; // filename stem; output is projects/<slug>.html (URL preservation)
  category: LocalizedString; // "Industry" / "Research"
  tags: string[]; // internal filter tags, shared across locales
  image: string; // homepage card image, site-root-relative
  imageDims: { w: number; h: number };
  alt: LocalizedString; // card image alt text
  listOrder: number; // order on the projects listing page
  featuredOrder?: number; // position in homepage Featured grid; absent = not featured
  ogImage?: string; // detail-page social image; defaults to image
  title: LocalizedString;
  summary: LocalizedString;
  // Listing-page card overrides — some projects show different title/summary on
  // the listing vs the homepage in the live site. Default to title/summary.
  listTitle?: LocalizedString;
  listSummary?: LocalizedString;
  outcome?: LocalizedString; // short result line on the homepage card
  highlights: LocalizedString[]; // homepage card bullet list
  body: Block[]; // detail page content (Phase 3)
};

export type NewsItem = {
  id: string;
  date: LocalizedString; // localized because format differs ("April 2026" / "2026年4月")
  tag: "launch" | "milestone" | "publication" | "award";
  tagLabel: LocalizedString;
  text: LocalizedRichText;
};

export type ExperienceRole = {
  id: string;
  dates: LocalizedString;
  role: LocalizedString;
  bullets: LocalizedString[];
};

export type ExperienceOrg = {
  id: string;
  org: LocalizedString;
  roles: ExperienceRole[];
};

export type EducationItem = {
  id: string;
  url?: string;
  degree: LocalizedRichText; // contains <strong> and an optional affiliation link
};
