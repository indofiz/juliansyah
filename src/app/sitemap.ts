import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { publishedProjects } from "@/lib/projects";

// A fixed date: `new Date()` would make the sitemap dynamic under Cache Components.
const LAST_MODIFIED = "2026-11-11";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, lastModified: LAST_MODIFIED, changeFrequency: "monthly", priority: 1 },
    // Placeholder (dummy) projects are left out until they're real.
    ...publishedProjects().map((p) => ({
      url: `${site.url}/work/${p.slug}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
