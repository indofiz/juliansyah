"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Code2, PenTool, Smartphone, ArrowUpRight } from "lucide-react";

const disciplines = [
  {
    icon: Code2,
    title: "Frontend Engineering",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "GSAP", "Framer Motion"],
  },
  {
    icon: PenTool,
    title: "UI / UX Design",
    items: ["Figma", "Design Systems", "Prototyping", "Wireframing", "User Flows", "Accessibility"],
  },
  {
    icon: Smartphone,
    title: "Mobile · Flutter",
    items: ["Flutter", "Dart", "Riverpod", "Provider", "Animations", "Dio / REST"],
  },
];

const tools = ["Git", "GitHub", "VS Code", "Figma", "Postman", "Vercel", "Linux", "Notion"];

const facts = [
  { label: "Based in", value: "Bangka Belitung, Indonesia" },
  { label: "Focus", value: "Frontend · UI/UX · Flutter" },
  { label: "Experience", value: "3+ Years" },
  { label: "Available for", value: "Freelance & Full-time" },
];

const experience = [
  {
    company: "Acme Studio",
    role: "Frontend Engineer",
    period: "2023 — Present",
    description:
      "Lead frontend for a SaaS product used by 10,000+ businesses. Built the component library from scratch, cut bundle size by 40%, and mentored two junior developers.",
  },
  {
    company: "Bravo Digital",
    role: "UI/UX & Frontend Developer",
    period: "2022 — 2023",
    description:
      "Designed and built responsive interfaces across fintech, e-commerce, and healthcare — translating Figma into pixel-perfect, accessible React components.",
  },
  {
    company: "Freelance",
    role: "Frontend & Flutter Developer",
    period: "2021 — 2022",
    description:
      "Delivered web and Flutter mobile apps end-to-end for small businesses and startups — scoping, design, build, and delivery, solo.",
  },
];

export default function AboutPage() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add(
      {
        motionOK: "(prefers-reduced-motion: no-preference)",
        isDesktop: "(hover: hover) and (pointer: fine)",
      },
      (ctx) => {
        const { motionOK, isDesktop } = ctx.conditions as {
          motionOK: boolean;
          isDesktop: boolean;
        };
        if (!motionOK) return;

        const q = gsap.utils.selector(section);
        const cleanups: Array<() => void> = [];

        // Header
        gsap.from(q("[data-a-eyebrow]"), {
          opacity: 0,
          y: 20,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 85%" },
        });
        const title = q("[data-a-title]")[0];
        if (title) {
          gsap.set(title, { yPercent: 115 });
          gsap.to(title, {
            yPercent: 0,
            duration: 0.9,
            ease: "power4.out",
            scrollTrigger: { trigger: title, start: "top 90%" },
          });
        }
        gsap.from(q("[data-a-sub]"), {
          opacity: 0,
          y: 20,
          duration: 0.7,
          ease: "power3.out",
          delay: 0.1,
          scrollTrigger: { trigger: section, start: "top 85%" },
        });

        // Intro — photo reveal + bio + facts
        const photo = q("[data-a-photo]")[0];
        const photoInner = q("[data-a-photo-inner]")[0];
        if (photo && photoInner) {
          gsap.set(photo, { clipPath: "inset(0% 0% 100% 0%)" });
          gsap.set(photoInner, { scale: 1.25 });
          const tl = gsap.timeline({
            scrollTrigger: { trigger: photo, start: "top 82%" },
          });
          tl.to(photo, {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1,
            ease: "power4.inOut",
          }).to(photoInner, { scale: 1, duration: 1.2, ease: "power3.out" }, "<");
        }
        gsap.from(q("[data-a-bio]"), {
          opacity: 0,
          y: 24,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: q("[data-a-bio]")[0], start: "top 85%" },
        });
        gsap.from(q("[data-a-fact]"), {
          opacity: 0,
          y: 20,
          duration: 0.5,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: q("[data-a-facts]")[0], start: "top 90%" },
        });

        // Skills — discipline cards + tools
        const cards = gsap.utils.toArray<HTMLElement>("[data-a-card]", section);
        gsap.from(cards, {
          opacity: 0,
          y: 44,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: q("[data-a-cards]")[0], start: "top 82%" },
        });
        gsap.from(q("[data-a-tool]"), {
          opacity: 0,
          y: 14,
          duration: 0.4,
          stagger: 0.04,
          ease: "power3.out",
          scrollTrigger: { trigger: q("[data-a-tools]")[0], start: "top 90%" },
        });

        // Experience timeline — growing line + staggered items
        const line = q("[data-a-line]")[0];
        if (line) {
          gsap.set(line, { scaleY: 0, transformOrigin: "top" });
          gsap.to(line, {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: q("[data-a-timeline]")[0],
              start: "top 70%",
              end: "bottom 85%",
              scrub: true,
            },
          });
        }
        gsap.from(q("[data-a-exp]"), {
          opacity: 0,
          y: 30,
          duration: 0.6,
          stagger: 0.18,
          ease: "power3.out",
          scrollTrigger: { trigger: q("[data-a-timeline]")[0], start: "top 78%" },
        });

        // Closing CTA
        gsap.from(q("[data-a-cta]"), {
          opacity: 0,
          y: 24,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: q("[data-a-cta]")[0], start: "top 90%" },
        });

        // Desktop: cursor-following brand glow on discipline cards
        if (isDesktop) {
          cards.forEach((card) => {
            const glow = card.querySelector<HTMLElement>("[data-glow]");
            if (!glow) return;
            const gx = gsap.quickTo(glow, "xPercent", { duration: 0.5, ease: "power3.out" });
            const gy = gsap.quickTo(glow, "yPercent", { duration: 0.5, ease: "power3.out" });
            const onMove = (e: MouseEvent) => {
              const r = card.getBoundingClientRect();
              gx(((e.clientX - r.left) / r.width - 0.5) * 60);
              gy(((e.clientY - r.top) / r.height - 0.5) * 60);
            };
            const onEnter = () => gsap.to(glow, { autoAlpha: 1, duration: 0.4 });
            const onLeave = () => gsap.to(glow, { autoAlpha: 0, duration: 0.45 });
            card.addEventListener("mousemove", onMove);
            card.addEventListener("mouseenter", onEnter);
            card.addEventListener("mouseleave", onLeave);
            cleanups.push(() => {
              card.removeEventListener("mousemove", onMove);
              card.removeEventListener("mouseenter", onEnter);
              card.removeEventListener("mouseleave", onLeave);
            });
          });
        }

        document.fonts.ready.then(() => ScrollTrigger.refresh());
        return () => cleanups.forEach((fn) => fn());
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden px-6 py-20 md:px-25"
    >
      {/* Ambient brand glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full opacity-40 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,80,41,0.16), transparent 70%)",
        }}
      />

      <div className="relative mx-auto flex max-w-5xl flex-col gap-20">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-white-15 pb-14">
          <span
            data-a-eyebrow
            className="font-(family-name:--font-bricolage) text-sm font-medium uppercase tracking-widest text-gray-text"
          >
            About Me
          </span>
          <div className="overflow-hidden pb-1">
            <h1
              data-a-title
              className="font-(family-name:--font-bricolage) text-5xl font-semibold leading-tight text-white md:text-6xl"
            >
              I design &amp; build{" "}
              <span className="font-(family-name:--font-instrument) italic text-brand">
                digital products.
              </span>
            </h1>
          </div>
          <p
            data-a-sub
            className="max-w-xl text-base leading-relaxed text-gray-text"
          >
            Frontend engineer and UI/UX designer crafting web &amp; Flutter
            experiences from Bangka Belitung, Indonesia.
          </p>
        </div>

        {/* Intro */}
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:gap-20">
          {/* Photo */}
          <div className="mx-auto shrink-0 md:mx-0">
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute -inset-3 rounded-[2rem] opacity-60 blur-2xl"
                style={{
                  background:
                    "linear-gradient(to bottom right, rgba(255,80,41,0.35), transparent 70%)",
                }}
              />
              <div
                data-a-photo
                className="relative h-72 w-72 overflow-hidden rounded-2xl border border-white-15 will-change-transform"
              >
                <div
                  data-a-photo-inner
                  className="h-full w-full will-change-transform"
                >
                  <Image
                    src="/image-me.png"
                    alt="Juliansyah"
                    width={288}
                    height={288}
                    sizes="288px"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-center gap-2 md:justify-start">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              <span className="text-xs font-medium uppercase tracking-widest text-gray-text">
                Open to opportunities
              </span>
            </div>
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-6">
            <p
              data-a-bio
              className="text-base leading-relaxed text-gray-text"
            >
              Hey, I&apos;m Juliansyah — a frontend engineer and UI/UX designer
              based in Bangka Belitung, Indonesia. For 3+ years I&apos;ve been designing
              and building for the web with React &amp; Next.js, and for mobile
              with Flutter.
            </p>
            <p
              data-a-bio
              className="text-base leading-relaxed text-gray-text"
            >
              I care deeply about the details — clean code, considered design,
              and interfaces that feel fast and intuitive. Because I design and
              build the same screens, there&apos;s less hand-off friction and the
              result ships looking exactly as imagined.
            </p>
            <p
              data-a-bio
              className="text-base leading-relaxed text-gray-text"
            >
              When I&apos;m not shipping, you&apos;ll find me sharpening my design
              eye in Figma, lifting weights, running, or prototyping a new
              side-project idea.
            </p>

            {/* Facts */}
            <div data-a-facts className="grid grid-cols-2 gap-4 pt-2">
              {facts.map(({ label, value }) => (
                <div
                  key={label}
                  data-a-fact
                  className="flex flex-col gap-1 rounded-xl border border-white-15 p-4"
                >
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
            What I Do
          </h2>
          <div data-a-cards className="grid gap-5 md:grid-cols-3">
            {disciplines.map(({ icon: Icon, title, items }) => (
              <article
                key={title}
                data-a-card
                className="group relative overflow-hidden rounded-2xl border border-white-15 bg-white/[0.02] p-6 transition-colors duration-300 hover:border-brand/40"
              >
                <div
                  data-glow
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0"
                  style={{
                    background:
                      "radial-gradient(200px circle at center, rgba(255,80,41,0.16), transparent 65%)",
                  }}
                />
                <div className="relative flex flex-col gap-4">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl border border-brand/30 text-brand transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background:
                        "linear-gradient(to bottom right, rgba(255,80,41,0.15), transparent)",
                    }}
                  >
                    <Icon size={22} strokeWidth={1.75} />
                  </div>
                  <h3 className="font-(family-name:--font-bricolage) text-lg font-semibold text-white">
                    {title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white-15 px-2.5 py-1 text-[11px] font-medium text-gray-text"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Tools */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-medium uppercase tracking-widest text-gray-text">
              Workflow &amp; Tools
            </span>
            <div data-a-tools className="flex flex-wrap gap-2">
              {tools.map((tool) => (
                <span
                  key={tool}
                  data-a-tool
                  className="rounded-full border border-white-15 px-3 py-1 text-xs font-medium text-gray-text"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Experience */}
        <div className="flex flex-col gap-8">
          <h2 className="font-(family-name:--font-bricolage) text-sm font-medium uppercase tracking-widest text-gray-text">
            Experience
          </h2>
          <div data-a-timeline className="relative flex flex-col gap-12">
            {/* Timeline line */}
            <span
              data-a-line
              aria-hidden="true"
              className="absolute left-[7px] top-1 bottom-1 w-0.5"
              style={{
                background:
                  "linear-gradient(to bottom, #ff5029, rgba(255,80,41,0.3), transparent)",
              }}
            />
            {experience.map(({ company, role, period, description }) => (
              <div key={company} data-a-exp className="relative pl-8">
                <span
                  aria-hidden="true"
                  className="absolute left-[2px] top-1.5 h-3 w-3 rounded-full bg-brand ring-4 ring-[#0f1013]"
                />
                <div className="flex flex-col gap-2">
                  <span className="text-xs uppercase tracking-widest text-gray-text">
                    {period}
                  </span>
                  <h3 className="font-(family-name:--font-bricolage) text-xl font-semibold text-white">
                    {role}
                    <span className="ml-2 font-normal text-brand">@ {company}</span>
                  </h3>
                  <p className="max-w-2xl text-base leading-relaxed text-gray-text">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Closing CTA */}
        <div
          data-a-cta
          className="flex flex-col items-start gap-6 rounded-2xl border border-white-15 bg-white/[0.02] p-8 md:flex-row md:items-center md:justify-between md:p-10"
        >
          <div className="flex flex-col gap-2">
            <h2 className="font-(family-name:--font-bricolage) text-2xl font-semibold text-white md:text-3xl">
              Have a project in mind?
            </h2>
            <p className="text-base leading-relaxed text-gray-text">
              Let&apos;s build something worth shipping.
            </p>
          </div>
          <Link
            href="/contact"
            className="group inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-[#060703] transition-shadow hover:shadow-[0_0_40px_-8px_rgba(255,80,41,0.6)]"
          >
            Let&apos;s work together
            <ArrowUpRight
              size={18}
              strokeWidth={2}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
