import type { MetadataRoute } from "next";
import { contentFor } from "@/content/locale";
import { defaultLocale, languageAlternates, locales } from "@/lib/locales";
import { publishedProjects } from "@/lib/projects";

// A fixed date: `new Date()` would make the sitemap dynamic under Cache Components.
const LAST_MODIFIED = "2026-11-16";

/** Every page in every language, each listing its other-language versions. */
export default function sitemap(): MetadataRoute.Sitemap {
  const { site, projects } = contentFor(defaultLocale);
  const abs = (path: string) => (path === "/" ? site.url : site.url + path);
  const page = (path: string, priority: number, changeFrequency: "monthly" | "yearly") => {
    const languages = Object.fromEntries(Object.entries(languageAlternates(path)).map(([k, v]) => [k, abs(v)]));
    return locales.map((l) => ({
      url: languages[l.id],
      lastModified: LAST_MODIFIED,
      changeFrequency,
      priority,
      alternates: { languages },
    }));
  };
  return [
    ...page("/", 1, "monthly"),
    // Placeholder (dummy) projects are left out until they're real.
    ...publishedProjects(projects).flatMap((p) => page(`/work/${p.slug}`, 0.8, "yearly")),
  ];
}
