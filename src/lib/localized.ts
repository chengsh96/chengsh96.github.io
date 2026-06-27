import posix from "node:path/posix";
import type { Locale } from "../content/schema.js";
import { navItems, routeById } from "../content/routes.js";

export const SITE = "https://chengsh96.github.io";

// "Root path" = output file path relative to the site root, e.g. "index.html",
// "projects/shiftos.html", "zh/index.html". This is the unit the nav/lang/SEO
// helpers operate on so hrefs resolve correctly regardless of page depth.

// Map a registry path ("/", "/projects/", "/zh/projects/") to its root path.
export function routePathToRootPath(path: string): string {
  let p = path.replace(/^\//, "");
  if (p === "" || p.endsWith("/")) p += "index.html";
  return p;
}

export function routeRootPath(routeId: string, locale: Locale): string {
  const route = routeById(routeId);
  if (!route) throw new Error(`Unknown route id: ${routeId}`);
  return routePathToRootPath(route.paths[locale]);
}

export function homeRootPath(locale: Locale): string {
  return routeRootPath("home", locale);
}

// Relative href from one page to another (both root paths).
export function relHref(fromRootPath: string, toRootPath: string): string {
  const fromDir = posix.dirname(fromRootPath);
  const rel = posix.relative(fromDir, toRootPath);
  return rel === "" ? posix.basename(toRootPath) : rel;
}

// The paired-language root path for the language switcher.
export function pairedRootPath(currentRootPath: string): string {
  return currentRootPath.startsWith("zh/")
    ? currentRootPath.slice(3)
    : `zh/${currentRootPath}`;
}

export function pairedHref(currentRootPath: string): string {
  return relHref(currentRootPath, pairedRootPath(currentRootPath));
}

export type NavLink = { href: string; label: string };

// Build the header menu for a page, with hrefs resolved relative to that page.
export function buildNav(locale: Locale, currentRootPath: string): NavLink[] {
  const home = homeRootPath(locale);
  return [...navItems]
    .sort((a, b) => a.order - b.order)
    .map((item) => {
      const label = item.label[locale];
      if (item.target.kind === "anchor") {
        const anchor = `#${item.target.anchor}`;
        // On the homepage itself, anchors are pure fragments.
        const href = currentRootPath === home ? anchor : relHref(currentRootPath, home) + anchor;
        return { href, label };
      }
      return { href: relHref(currentRootPath, routeRootPath(item.target.routeId, locale)), label };
    });
}

// Absolute canonical/og URL for a page (index.html -> directory URL).
export function absoluteUrl(rootPath: string): string {
  if (posix.basename(rootPath) === "index.html") {
    return `${SITE}/${rootPath.slice(0, -"index.html".length)}`;
  }
  return `${SITE}/${rootPath}`;
}

// hreflang alternates: en + zh absolute URLs for the same page.
export function alternates(currentRootPath: string): { en: string; zh: string } {
  const en = currentRootPath.startsWith("zh/") ? currentRootPath.slice(3) : currentRootPath;
  const zh = `zh/${en}`;
  return { en: absoluteUrl(en), zh: absoluteUrl(zh) };
}
