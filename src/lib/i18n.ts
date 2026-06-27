import type { Locale } from "../content/schema.js";

export const locales = ["en", "zh"] as const;

export function isLocale(value: string): value is Locale {
  return value === "en" || value === "zh";
}

export function otherLocale(locale: Locale): Locale {
  return locale === "en" ? "zh" : "en";
}

// Pull the value for a locale out of any { en, zh } object.
export function localize<T>(value: { en: T; zh: T }, locale: Locale): T {
  return value[locale];
}
