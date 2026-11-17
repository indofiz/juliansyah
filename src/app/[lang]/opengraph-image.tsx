import { contentFor } from "@/content/locale";
import { defaultLocale, isLocale, locales } from "@/lib/locales";
import { ogCard, ogSize } from "@/lib/ogImage";

// The alt text is fixed per file, so it's the English one in both languages.
const en = contentFor(defaultLocale);
export const alt = `${en.site.name}: ${en.hero.title}`;
export const size = ogSize;
export const contentType = "image/png";

// One image per language, made at build time.
export function generateStaticParams() {
  return locales.map((l) => ({ lang: l.id }));
}

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const { site, hero } = contentFor(isLocale(lang) ? lang : defaultLocale);
  return ogCard({ eyebrow: site.name, title: hero.title, footer: `${hero.roles} · ${site.location} (${site.utcOffset})` });
}
