import { defaultLocale, localHref, type Locale } from "@/lib/locales";
import { content, type Content } from "./site";
import { id } from "./site.id";

/** The content in one language, plus which language it is. */
export type LocalContent = Content & { locale: Locale };

/** English line → translated line, per language other than English. */
const dictionaries: Partial<Record<Locale, Record<string, string>>> = { id };

/** Strings under these keys are identifiers or categories, never words to translate. */
const keep = new Set(["slug", "id", "icon", "kind", "frame", "tail", "platforms", "src", "mask", "glare", "poster", "webm", "mp4", "captions", "device"]);

/**
 * A copy of `value` with every string that has a dictionary entry swapped,
 * and every `href` to a page of this site moved into the language's URLs.
 */
function translate<T>(value: T, dict: Record<string, string>, locale: Locale, key = ""): T {
  if (typeof value === "string") {
    if (key === "href") return localHref(value, locale) as T;
    return (keep.has(key) ? value : (dict[value] ?? value)) as T;
  }
  if (Array.isArray(value)) return value.map((v) => translate(v, dict, locale, key)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, translate(v, dict, locale, k)])) as T;
  }
  return value;
}

const cache = new Map<Locale, LocalContent>();

/** The whole site's content in `locale`. Built once per language. */
export function contentFor(locale: Locale): LocalContent {
  let c = cache.get(locale);
  if (!c) {
    c = { ...(locale === defaultLocale ? content : translate(content, dictionaries[locale] ?? {}, locale)), locale };
    cache.set(locale, c);
  }
  return c;
}

/**
 * The few strings client components need (ContentProvider), so the rest of
 * the content never ships to the browser.
 */
export const clientContent = (t: LocalContent) => ({
  locale: t.locale,
  nav: t.nav,
  email: t.site.email,
  contact: { copy: t.contact.copy, mail: t.contact.mail },
  screens: { pause: t.work.labels.pauseScreens, play: t.work.labels.playScreens },
  playground: { labels: t.playground.labels },
  video: t.ui.video,
});

export type ClientContent = ReturnType<typeof clientContent>;
