import { caseStudyLabels, projects, site } from "@/content/site";
import { getProject } from "@/lib/projects";
import { ogCard, ogSize } from "@/lib/ogImage";

export const alt = "Case study";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  return ogCard({
    eyebrow: `${site.name} · ${caseStudyLabels.ogEyebrow}`,
    title: p?.title ?? site.name,
    footer: p ? `${p.name} · ${p.platforms.join(" · ")} · ${p.year}` : site.url,
  });
}
