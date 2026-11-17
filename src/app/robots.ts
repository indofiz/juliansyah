import type { MetadataRoute } from "next";
import { contentFor } from "@/content/locale";
import { defaultLocale } from "@/lib/locales";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${contentFor(defaultLocale).site.url}/sitemap.xml`,
  };
}
