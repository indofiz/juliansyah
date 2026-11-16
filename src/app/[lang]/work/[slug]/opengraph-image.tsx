import { contentFor } from "@/content/locale";
import { defaultLocale, isLocale } from "@/lib/locales";
import { getProject } from "@/lib/projects";
import { ogCard, ogSize } from "@/lib/ogImage";

export const alt = "Case study";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return contentFor(defaultLocale).projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const { site, projects, caseStudyLabels } = contentFor(isLocale(lang) ? lang : defaultLocale);
  const p = getProject(projects, slug);
  return ogCard({
    eyebrow: `${site.name} · ${caseStudyLabels.ogEyebrow}`,
    title: p?.title ?? site.name,
    footer: p ? `${p.name} · ${p.platforms.join(" · ")} · ${p.year}` : site.url,
  });
}
