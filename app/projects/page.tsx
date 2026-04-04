import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected projects by Juliansyah — e-commerce platforms, SaaS dashboards, mobile apps, and more built across React, Next.js, and Node.js.",
  alternates: { canonical: "/projects" },
  openGraph: { title: "Projects | Juliansyah", description: "A portfolio of selected web development projects." },
};

const projects = [
  {
    title: "E-Commerce Platform",
    description:
      "A full-featured online store built from the ground up with cart management, secure checkout flow, and Stripe payment integration. Designed with a focus on performance and seamless mobile experience.",
    year: "2024",
    role: "Full-Stack Developer",
    badges: ["Next.js", "TypeScript", "Stripe", "PostgreSQL", "Prisma"],
    link: "#",
  },
  {
    title: "Task Management App",
    description:
      "Real-time collaborative workspace for teams to organize, track, and manage projects. Features drag-and-drop kanban boards, live updates, and role-based access control.",
    year: "2024",
    role: "Frontend Developer",
    badges: ["React", "TypeScript", "Firebase", "Tailwind CSS"],
    link: "#",
  },
  {
    title: "Analytics Dashboard",
    description:
      "Interactive data visualization platform that transforms complex datasets into actionable business insights. Includes customizable widgets, date range filtering, and CSV export.",
    year: "2023",
    role: "UI/UX & Frontend",
    badges: ["D3.js", "Node.js", "Express", "MongoDB"],
    link: "#",
  },
  {
    title: "Mobile Banking App",
    description:
      "Secure and intuitive mobile banking experience with biometric authentication, peer-to-peer transfers, bill payments, and a spending analytics engine.",
    year: "2023",
    role: "Full-Stack Developer",
    badges: ["React Native", "Node.js", "AWS", "PostgreSQL"],
    link: "#",
  },
  {
    title: "AI Content Generator",
    description:
      "Web application that leverages large language models to help marketers generate high-quality blog posts, ad copy, and social media content at scale.",
    year: "2023",
    role: "Full-Stack Developer",
    badges: ["Next.js", "OpenAI API", "Prisma", "Tailwind CSS"],
    link: "#",
  },
  {
    title: "Real Estate Listing Platform",
    description:
      "Property search and listing platform with interactive maps, advanced filters, saved searches, and a CMS for agents to manage their listings with ease.",
    year: "2022",
    role: "Full-Stack Developer",
    badges: ["Next.js", "Google Maps API", "PostgreSQL", "Cloudinary"],
    link: "#",
  },
];

export default function ProjectsPage() {
  return (
    <main id="main-content" className="min-h-screen">
      <Navbar />

      <section className="w-full px-6 py-20 md:px-25">
        <div className="mx-auto max-w-5xl">

          {/* Page Header */}
          <div className="flex flex-col gap-4 pb-16 border-b border-white-15">
            <span className="font-(family-name:--font-bricolage) text-sm font-medium uppercase tracking-widest text-gray-text">
              All Work
            </span>
            <h1 className="font-(family-name:--font-bricolage) text-5xl font-semibold leading-tight text-white md:text-6xl">
              Selected{" "}
              <span className="font-(family-name:--font-instrument) italic text-brand">
                Projects
              </span>
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-gray-text">
              A collection of projects I&apos;ve built across various domains — from
              product startups to freelance work. Each one taught me something new.
            </p>
          </div>

          {/* Project List */}
          <div className="flex flex-col divide-y divide-white-15">
            {projects.map((project, index) => (
              <div
                key={project.title}
                className="group flex flex-col gap-4 py-10 md:flex-row md:items-start md:gap-16"
              >
                {/* Number + Year */}
                <div className="flex shrink-0 flex-row items-center gap-4 md:w-24 md:flex-col md:items-start md:gap-1">
                  <span className="font-(family-name:--font-bricolage) text-4xl font-semibold text-dark-gray">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-xs text-gray-text">{project.year}</span>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="font-(family-name:--font-bricolage) text-2xl font-semibold text-white transition-colors group-hover:text-brand">
                      {project.title}
                    </h2>
                    <a
                      href={project.link}
                      className="mt-1 shrink-0 text-gray-text transition-colors hover:text-white"
                      aria-label={`View ${project.title}`}
                    >
                      <ArrowUpRight size={20} />
                    </a>
                  </div>
                  <span className="text-xs font-medium uppercase tracking-widest text-brand">
                    {project.role}
                  </span>
                  <p className="text-base leading-relaxed text-gray-text">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.badges.map((badge) => (
                      <span
                        key={badge}
                        className="rounded-full border border-white-15 px-3 py-1 text-xs font-medium text-gray-text"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </main>
  );
}
