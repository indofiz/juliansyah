const projects = [
  {
    title: "E-Commerce Platform",
    description:
      "A full-featured online store with cart, checkout, and payment integration built for seamless shopping experiences.",
    badges: ["Full-Stack", "Next.js", "Stripe", "PostgreSQL"],
  },
  {
    title: "Task Management App",
    description:
      "Real-time collaborative workspace for teams to organize, track, and manage projects efficiently.",
    badges: ["Frontend", "React", "TypeScript", "Firebase"],
  },
  {
    title: "Analytics Dashboard",
    description:
      "Interactive data visualization platform that transforms complex datasets into actionable business insights.",
    badges: ["UI/UX", "D3.js", "Node.js", "Freelance"],
  },
  {
    title: "Mobile Banking App",
    description:
      "Secure and intuitive mobile banking experience with biometric auth, transfers, and spending analytics.",
    badges: ["Full-Stack", "React Native", "Fintech", "AWS"],
  },
];

export default function Projects() {
  return (
    <section id="projects" className="w-full px-6 py-24 md:px-25">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        {/* Section Header */}
        <h2 className="font-(family-name:--font-bricolage) text-sm font-medium uppercase tracking-widest text-gray-text">
          Selected Work
        </h2>

        {/* Project List */}
        <div className="flex flex-col gap-16">
          {projects.map((project, index) => {
            const isOdd = index % 2 !== 0;

            return (
              <div
                key={project.title}
                className={`flex flex-col gap-8 md:flex-row md:items-center md:gap-16 ${
                  isOdd ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Thumbnail */}
                <div className="aspect-[16/10] w-full overflow-hidden rounded-xl border border-white-15 bg-[#1a1a1d] md:w-1/2">
                  <div className="flex h-full w-full items-center justify-center text-gray-text">
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                </div>

                {/* Content */}
                <div className="flex w-full flex-col gap-4 md:w-1/2">
                  <h3 className="font-(family-name:--font-bricolage) text-3xl font-semibold text-white">
                    {project.title}
                  </h3>
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
