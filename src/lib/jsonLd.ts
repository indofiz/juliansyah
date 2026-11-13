import { site, socials } from "@/content/site";
import type { Project } from "@/content/types";

/** schema.org Person for the homepage. */
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.url,
    email: `mailto:${site.email}`,
    jobTitle: site.role,
    address: { "@type": "PostalAddress", addressLocality: site.city, addressRegion: site.region, addressCountry: "ID" },
    sameAs: socials.filter((s) => /^https?:/.test(s.href)).map((s) => s.href),
    knowsAbout: ["Flutter", "Dart", "React", "Next.js", "TypeScript", "UI/UX design", "Figma", "Design systems"],
  };
}

/** schema.org CreativeWork for a case study page. */
export function caseStudyJsonLd(p: Project) {
  const url = `${site.url}/work/${p.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: p.name,
    headline: p.title,
    description: p.summary,
    url,
    image: `${url}/opengraph-image`,
    dateCreated: p.year,
    keywords: p.platforms.join(", "),
    creator: { "@type": "Person", name: site.name, url: site.url },
    sourceOrganization: { "@type": "Organization", name: p.client },
  };
}

/** Serialises JSON-LD for a <script> tag, escaping "<" so content can't close the tag. */
export const jsonLdHtml = (data: object) => ({ __html: JSON.stringify(data).replace(/</g, "\\u003c") });
