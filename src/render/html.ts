import { relHref } from "../lib/localized.js";

// Escape text/attribute content. Safe for both element text and double-quoted
// attribute values.
export function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Escape only ampersands in an already-formed URL for use in an href/src
// attribute (e.g. query strings with &). Leaves the rest intact.
export function escUrl(url: string): string {
  return url.replace(/&(?!amp;)/g, "&amp;");
}

// Resolve a site-root-relative asset path to one relative to the current page.
export function asset(rootRelPath: string, currentRootPath: string): string {
  return relHref(currentRootPath, rootRelPath);
}

export const indent = (s: string, pad: string): string =>
  s
    .split("\n")
    .map((line) => (line ? pad + line : line))
    .join("\n");
