import { projects } from "@/content/site";
import type { Project } from "@/content/types";

export const getProject = (slug: string): Project | undefined => projects.find((p) => p.slug === slug);

/** The project after this one, wrapping around, for the "Next project" link. */
export function nextProject(slug: string): Project {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}

/** The big card on the homepage: the first flagship, else the first project. */
export const flagshipProject = (): Project => projects.find((p) => p.flagship) ?? projects[0];

/** Real (non-dummy) projects: the only ones in the sitemap and search results. */
export const publishedProjects = (): Project[] => projects.filter((p) => !p.dummy);
