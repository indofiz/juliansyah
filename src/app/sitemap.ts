import type { MetadataRoute } from "next";
import { site } from "@/content/site";

// A fixed date: `new Date()` would make the sitemap dynamic under Cache Components.
const LAST_MODIFIED = "2026-11-10";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: site.url, lastModified: LAST_MODIFIED, changeFrequency: "monthly", priority: 1 }];
}
