import type { LocalContent } from "@/content/locale";
import type { Project } from "@/content/types";
import { defaultLocale, localHref } from "@/lib/locales";

/** schema.org Person for the homepage. */
export function personJsonLd({ site, socials, locale }: LocalContent) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: locale === defaultLocale ? site.url : site.url + localHref("/", locale),
    email: `mailto:${site.email}`,
    jobTitle: site.role,
    description: site.description,
    address: { "@type": "PostalAddress", addressLocality: site.city, addressRegion: site.region, addressCountry: "ID" },
    sameAs: socials.filter((s) => /^https?:/.test(s.href)).map((s) => s.href),
    knowsAbout: ["Flutter", "Dart", "React", "Next.js", "TypeScript", "UI/UX design", "Figma", "Design systems"],
  };
}

/** schema.org CreativeWork for a case study page. */
export function caseStudyJsonLd(p: Project, { site, locale }: LocalContent) {
  const url = site.url + localHref(`/work/${p.slug}`, locale);
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: p.name,
    headline: p.title,
    description: p.summary,
    inLanguage: locale,
    url,
    image: `${url}/opengraph-image`,
    dateCreated: p.year,
    keywords: p.platforms.join(", "),
    creator: { "@type": "Person", name: site.name, url: site.url },
    sourceOrganization: { "@type": "Organization", name: p.client },
    // The live app itself. No aggregateRating: Google's review-snippet rules
    // don't allow ratings taken from another site (the stores).
    ...(p.stores && {
      about: {
        "@type": "MobileApplication",
        name: p.stores.name,
        operatingSystem: [p.stores.googlePlay && "Android", p.stores.appStore && "iOS"].filter(Boolean).join(", "),
        applicationCategory: "BusinessApplication",
        sameAs: [p.stores.appStore, p.stores.googlePlay].filter(Boolean),
      },
    }),
  };
}

/** Serialises JSON-LD for a <script> tag, escaping "<" so content can't close the tag. */
export const jsonLdHtml = (data: object) => ({ __html: JSON.stringify(data).replace(/</g, "\\u003c") });
