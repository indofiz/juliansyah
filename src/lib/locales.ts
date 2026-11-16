/**
 * The site's languages. English is the default and has no URL prefix;
 * Indonesian lives under /id. Each name is written in its own language, so
 * it reads right whichever version you're on.
 *
 * Kept import-free so src/proxy.ts can use it.
 */
export const locales = [
  { id: "en", label: "English", short: "EN" },
  { id: "id", label: "Bahasa Indonesia", short: "ID" },
] as const;

export type Locale = (typeof locales)[number]["id"];

export const defaultLocale: Locale = "en";

/** A language's home page: "/" for English, "/id" for Indonesian. */
export const localeHome = (locale: Locale) => (locale === defaultLocale ? "/" : `/${locale}`);
