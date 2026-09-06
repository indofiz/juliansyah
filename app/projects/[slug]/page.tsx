import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/navbar";
import ProjectDetail from "@/components/project-detail";
import { detailedSlugs, getProjectBySlug } from "@/lib/projects";

const BASE_URL = "https://juliansyah.dev";

// Only the slugs that have a detail page are valid; everything else 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return detailedSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project || !project.detail) {
    return { title: "Project not found" };
  }

  const { detail } = project;
  const url = `${BASE_URL}/projects/${project.slug}`;
  const description = detail.overview[0] ?? project.description;
  const image = project.thumbnail ?? "/og-image.png";

  return {
    title: project.title,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "website",
      url,
      title: `${project.title} | Juliansyah`,
      description,
      images: [
        { url: image, width: 1200, height: 630, alt: `${project.title} — ${detail.tagline}` },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | Juliansyah`,
      description,
      images: [image],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project || !project.detail) {
    notFound();
  }

  const { detail } = project;
  const downloadUrl = detail.storeLinks?.playStore || detail.storeLinks?.appStore || undefined;

  const softwareLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    description: detail.overview[0] ?? project.description,
    applicationCategory: "BusinessApplication",
    operatingSystem: detail.platforms.join(", "),
    offers: { "@type": "Offer", price: "0", priceCurrency: "IDR" },
    author: { "@type": "Person", name: "Juliansyah", url: BASE_URL },
    creator: { "@type": "Person", name: "Juliansyah", url: BASE_URL },
    ...(downloadUrl ? { downloadUrl } : {}),
    ...(project.thumbnail ? { image: `${BASE_URL}${project.thumbnail}` } : {}),
    url: `${BASE_URL}/projects/${project.slug}`,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Projects", item: `${BASE_URL}/projects` },
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: `${BASE_URL}/projects/${project.slug}`,
      },
    ],
  };

  return (
    <main id="main-content" className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Navbar />
      <ProjectDetail project={project} />
    </main>
  );
}
