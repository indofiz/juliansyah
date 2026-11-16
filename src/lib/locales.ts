/**
 * The site's languages. English is the default and has no URL prefix;
 * Indonesian lives under /id (src/proxy.ts). Each name is written in its own
 * language, so it reads right whichever version you're on.
 *
 * Kept import-free so src/proxy.ts can use it.
 */
export const locales = [
  { id: "en", label: "English", short: "EN", og: "en_US", date: "en-GB" },
  { id: "id", label: "Bahasa Indonesia", short: "ID", og: "id_ID", date: "id-ID" },
] as const;

export type Locale = (typeof locales)[number]["id"];

export const defaultLocale: Locale = "en";

/** The cookie that remembers a visitor's choice (set by LanguagePicker, read by the proxy). */
export const localeCookie = "lang";

export const isLocale = (value: string | undefined): value is Locale => locales.some((l) => l.id === value);

export const localeInfo = (locale: Locale) => locales.find((l) => l.id === locale) ?? locales[0];

/**
 * A page path in the given language: "/", "/#work" and "/work/x" become
 * "/id", "/id#work" and "/id/work/x" in Indonesian. External links, mailto:
 * and files (anything with an extension, e.g. an .apk) stay as they are.
 */
export function localHref(href: string, locale: Locale): string {
  if (locale === defaultLocale || !href.startsWith("/") || href.startsWith("//")) return href;
  const path = href.split(/[?#]/)[0];
  if (/\.[a-z0-9]+$/i.test(path)) return href;
  if (path === "/") return `/${locale}${href.slice(1)}`;
  return `/${locale}${href}`;
}

/** A language's home page: "/" for English, "/id" for Indonesian. */
export const localeHome = (locale: Locale) => localHref("/", locale);

/** hreflang alternates for a page path ("/" or "/work/<slug>"): one per language, English as x-default. */
export const languageAlternates = (path: string): Record<string, string> => ({
  ...Object.fromEntries(locales.map((l) => [l.id, localHref(path, l.id)])),
  "x-default": path,
});
