import { getContent } from "@/content";
import { flagshipProject } from "@/lib/projects";
import { SectionHeader } from "../ui/primitives";
import { FlagshipCard, ProjectCard } from "../work/ProjectCard";

/** Selected work: the flagship you can try, then the rest. Each opens /work/<slug>. */
export async function Work() {
  const { projects, work } = await getContent();
  const flagship = flagshipProject(projects);
  const rest = projects.filter((p) => p !== flagship);

  return (
    <section id="work" className="section work" aria-labelledby="work-title">
      <div className="container">
        <SectionHeader id="work-title" badge={work.badge} badgeIcon="star" title={work.title} text={work.text} />
        <div className="work-grid">
          <FlagshipCard p={flagship} />
          <div className="work-list">
            {rest.map((p) => (
              <ProjectCard key={p.slug} p={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
