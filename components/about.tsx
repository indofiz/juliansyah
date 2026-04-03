import Image from "next/image";

const skills = [
  { category: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
  { category: "Backend", items: ["Node.js", "PostgreSQL", "Prisma", "REST API"] },
  { category: "Tools", items: ["Git", "Docker", "Figma", "VS Code"] },
];

export default function About() {
  return (
    <section id="about" className="w-full px-6 py-24 md:px-25">
      <div className="mx-auto flex max-w-5xl flex-col gap-16">

        {/* Header */}
        <h2 className="font-(family-name:--font-bricolage) text-sm font-medium uppercase tracking-widest text-gray-text">
          About Me
        </h2>

        {/* Content row */}
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:gap-20">

          {/* Image */}
          <div className="shrink-0 mx-auto md:mx-0">
            <div className="h-64 w-64 overflow-hidden rounded-2xl border border-white-15">
              <Image
                src="/image-me.png"
                alt="Juliansyah"
                width={256}
                height={256}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Text */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h3 className="font-(family-name:--font-bricolage) text-4xl font-semibold text-white">
                I build digital products — web, mobile, desktop, UI & UX.
              </h3>
              <p className="text-base leading-relaxed text-gray-text">
                I&apos;m a full-stack developer with a passion for building clean,
                performant, and user-friendly web applications. I enjoy working
                across the entire stack — from crafting pixel-perfect UIs to
                designing scalable backend systems.
              </p>
              <p className="text-base leading-relaxed text-gray-text">
                When I&apos;m not coding, I&apos;m exploring new technologies,
                contributing to open-source, or experimenting with design tools
                to sharpen my eye for detail.
              </p>
            </div>

            {/* Skills */}
            <div className="flex flex-col gap-4">
              {skills.map(({ category, items }) => (
                <div key={category} className="flex flex-col gap-2">
                  <span className="text-xs font-medium uppercase tracking-widest text-brand">
                    {category}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white-15 px-3 py-1 text-xs font-medium text-gray-text"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
