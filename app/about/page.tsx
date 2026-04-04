import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Juliansyah — a full-stack developer based in Jakarta with 3+ years of experience building fast, design-driven web products.",
  alternates: { canonical: "/about" },
  openGraph: { title: "About | Juliansyah", description: "Full-stack developer based in Jakarta, Indonesia." },
};

const skills = [
  { category: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "GSAP", "Framer Motion"] },
  { category: "Backend", items: ["Node.js", "Express", "PostgreSQL", "Prisma", "REST API", "GraphQL"] },
  { category: "Tools", items: ["Git", "Docker", "Figma", "VS Code", "Postman", "Linux"] },
];

const experience = [
  {
    company: "Acme Studio",
    role: "Full-Stack Developer",
    period: "2023 — Present",
    description:
      "Leading front-end development for a SaaS product used by over 10,000 businesses. Architected a component library from scratch, reduced bundle size by 40%, and mentored two junior developers.",
  },
  {
    company: "Bravo Digital",
    role: "Frontend Developer",
    period: "2022 — 2023",
    description:
      "Built responsive interfaces for client projects across fintech, e-commerce, and healthcare verticals. Collaborated closely with designers to translate Figma mockups into pixel-perfect React components.",
  },
  {
    company: "Freelance",
    role: "Web Developer",
    period: "2021 — 2022",
    description:
      "Delivered end-to-end web solutions for small businesses and startups — from landing pages to full-stack applications. Managed client communication, scoping, and delivery independently.",
  },
];

export default function AboutPage() {
  return (
    <main id="main-content" className="min-h-screen">
      <Navbar />

      <section className="w-full px-6 py-20 md:px-25">
        <div className="mx-auto max-w-5xl flex flex-col gap-20">

          {/* Page Header */}
          <div className="flex flex-col gap-4 border-b border-white-15 pb-16">
            <span className="font-(family-name:--font-bricolage) text-sm font-medium uppercase tracking-widest text-gray-text">
              About Me
            </span>
            <h1 className="font-(family-name:--font-bricolage) text-5xl font-semibold leading-tight text-white md:text-6xl">
              I build{" "}
              <span className="font-(family-name:--font-instrument) italic text-brand">
                digital products.
              </span>
            </h1>
          </div>

          {/* Intro */}
          <div className="flex flex-col gap-12 md:flex-row md:items-start md:gap-20">
            {/* Image */}
            <div className="shrink-0 mx-auto md:mx-0">
              <div className="h-72 w-72 overflow-hidden rounded-2xl border border-white-15">
                <Image
                  src="/image-me.png"
                  alt="Juliansyah"
                  width={288}
                  height={288}
                  sizes="(max-width: 768px) 288px, 288px"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="flex flex-col gap-6">
              <p className="text-base leading-relaxed text-gray-text">
                Hey, I&apos;m Juliansyah — a full-stack developer based in Jakarta, Indonesia.
                I&apos;ve been building for the web for over three years, working across the full
                stack from crafting pixel-perfect UIs to designing scalable backend systems.
              </p>
              <p className="text-base leading-relaxed text-gray-text">
                I care deeply about the details — clean code, thoughtful design, and experiences
                that feel fast and intuitive. I&apos;m comfortable working independently or as
                part of a team, and I thrive in environments where craft and velocity go hand in hand.
              </p>
              <p className="text-base leading-relaxed text-gray-text">
                When I&apos;m not coding, you&apos;ll find me reading about systems design, lifting
                weights, running, or obsessing over a new side project idea.
              </p>

              {/* Fun facts */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                {[
                  { label: "Based in", value: "Jakarta, Indonesia" },
                  { label: "Available for", value: "Freelance & Full-time" },
                  { label: "Experience", value: "3+ Years" },
                  { label: "Timezone", value: "GMT+7 (WIB)" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col gap-1">
                    <span className="text-xs font-medium uppercase tracking-widest text-gray-text">
                      {label}
                    </span>
                    <span className="text-sm text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="flex flex-col gap-8">
            <h2 className="font-(family-name:--font-bricolage) text-sm font-medium uppercase tracking-widest text-gray-text">
              Skills & Tools
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {skills.map(({ category, items }) => (
                <div key={category} className="flex flex-col gap-3 rounded-xl border border-white-15 p-6">
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

          {/* Experience */}
          <div className="flex flex-col gap-8">
            <h2 className="font-(family-name:--font-bricolage) text-sm font-medium uppercase tracking-widest text-gray-text">
              Experience
            </h2>
            <div className="flex flex-col divide-y divide-white-15">
              {experience.map(({ company, role, period, description }) => (
                <div key={company} className="flex flex-col gap-3 py-8 md:flex-row md:gap-16">
                  <div className="shrink-0 md:w-48">
                    <span className="text-xs text-gray-text">{period}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-(family-name:--font-bricolage) text-xl font-semibold text-white">
                      {role}
                      <span className="ml-2 text-brand">@ {company}</span>
                    </h3>
                    <p className="text-base leading-relaxed text-gray-text">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
