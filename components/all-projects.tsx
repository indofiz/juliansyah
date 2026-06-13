"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowUpRight } from "lucide-react";

type Category = "Frontend" | "UI/UX" | "Mobile";

type Project = {
  title: string;
  description: string;
  year: string;
  role: string;
  category: Category;
  badges: string[];
  link: string;
};

const projects: Project[] = [
  {
    title: "E-Commerce Platform",
    description:
      "A full storefront with cart, checkout, and Stripe payments — built for speed and a seamless mobile experience, on a component system designed to scale.",
    year: "2024",
    role: "Frontend Engineer",
    category: "Frontend",
    badges: ["Next.js", "TypeScript", "Tailwind", "Stripe", "Zustand"],
    link: "#",
  },
  {
    title: "Task Management App",
    description:
      "Real-time collaborative workspace with drag-and-drop kanban boards, live updates, and a snappy, keyboard-friendly interface.",
    year: "2024",
    role: "Frontend Engineer",
    category: "Frontend",
    badges: ["React", "TypeScript", "Tailwind", "dnd-kit", "Zustand"],
    link: "#",
  },
  {
    title: "Analytics Dashboard",
    description:
      "Designed and built a data-viz platform that turns complex datasets into clear, actionable insight — custom widgets, date filtering, and CSV export.",
    year: "2023",
    role: "UI/UX & Frontend",
    category: "UI/UX",
    badges: ["Figma", "Design System", "React", "Recharts"],
    link: "#",
  },
  {
    title: "Mobile Banking App",
    description:
      "A secure, intuitive banking experience with biometric auth, peer-to-peer transfers, and spending analytics — one Flutter codebase, native feel on iOS & Android.",
    year: "2023",
    role: "Mobile Developer · Flutter",
    category: "Mobile",
    badges: ["Flutter", "Dart", "Riverpod", "Biometrics"],
    link: "#",
  },
  {
    title: "AI Content Generator",
    description:
      "A polished interface for an LLM writing tool — streaming responses, prompt presets, and an editor that stays fast under heavy load.",
    year: "2023",
    role: "Frontend Engineer",
    category: "Frontend",
    badges: ["Next.js", "TypeScript", "Streaming UI", "Tailwind"],
    link: "#",
  },
  {
    title: "Real Estate Platform",
    description:
      "Property search with interactive maps, advanced filters, and saved searches — designed end-to-end, from wireframes to shipped UI.",
    year: "2022",
    role: "UI/UX & Frontend",
    category: "UI/UX",
    badges: ["Figma", "Next.js", "Mapbox", "Design System"],
    link: "#",
  },
  {
    title: "Habit & Fitness Tracker",
    description:
      "A cross-platform habit and workout tracker with delightful micro-animations, progress charts, and an offline-first local store.",
    year: "2022",
    role: "Mobile Developer · Flutter",
    category: "Mobile",
    badges: ["Flutter", "Dart", "Animations", "Local DB"],
    link: "#",
  },
];

const CATEGORIES = ["All", "Frontend", "UI/UX", "Mobile"] as const;
type Filter = (typeof CATEGORIES)[number];

const countFor = (cat: Filter) =>
  cat === "All" ? projects.length : projects.filter((p) => p.category === cat).length;

export default function AllProjects() {
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<Filter>("All");

  const filtered =
    filter === "All" ? projects : projects.filter((p) => p.category === filter);

  // Header — one-time entrance.
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from("[data-ph-eyebrow]", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power3.out",
      })
        .from(
          "[data-ph-title]",
          { yPercent: 115, duration: 0.9, ease: "power4.out" },
          "-=0.3"
        )
        .from(
          "[data-ph-sub]",
          { opacity: 0, y: 24, duration: 0.7, ease: "power3.out" },
          "-=0.55"
        )
        .from(
          "[data-ph-filter]",
          {
            opacity: 0,
            y: 16,
            duration: 0.5,
            stagger: 0.06,
            ease: "power3.out",
          },
          "-=0.4"
        );
    }, header);

    return () => ctx.revert();
  }, []);

  // Rows — animate in on mount and whenever the filter changes;
  // bind cursor-following brand glow on desktop.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDesktop = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
    const rows = gsap.utils.toArray<HTMLElement>("[data-proj-row]", list);

    let tween: gsap.core.Tween | undefined;
    if (!reduce && rows.length) {
      tween = gsap.fromTo(
        rows,
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.07,
          ease: "power3.out",
          clearProps: "opacity,transform",
        }
      );
    }

    const cleanups: Array<() => void> = [];
    if (isDesktop && !reduce) {
      rows.forEach((row) => {
        const glow = row.querySelector<HTMLElement>("[data-glow]");
        if (!glow) return;
        const glowX = gsap.quickTo(glow, "xPercent", {
          duration: 0.5,
          ease: "power3.out",
        });
        const glowY = gsap.quickTo(glow, "yPercent", {
          duration: 0.5,
          ease: "power3.out",
        });
        const onMove = (e: MouseEvent) => {
          const r = row.getBoundingClientRect();
          glowX(((e.clientX - r.left) / r.width - 0.5) * 40);
          glowY(((e.clientY - r.top) / r.height - 0.5) * 40);
        };
        const onEnter = () => gsap.to(glow, { autoAlpha: 1, duration: 0.4 });
        const onLeave = () => gsap.to(glow, { autoAlpha: 0, duration: 0.45 });
        row.addEventListener("mousemove", onMove);
        row.addEventListener("mouseenter", onEnter);
        row.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          row.removeEventListener("mousemove", onMove);
          row.removeEventListener("mouseenter", onEnter);
          row.removeEventListener("mouseleave", onLeave);
        });
      });
    }

    return () => {
      tween?.kill();
      cleanups.forEach((fn) => fn());
    };
  }, [filter]);

  return (
    <section className="relative w-full overflow-hidden px-6 py-20 md:px-25">
      {/* Ambient brand glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full opacity-40 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,80,41,0.18), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-5xl">
        {/* Page Header */}
        <div
          ref={headerRef}
          className="flex flex-col gap-5 border-b border-white-15 pb-12"
        >
          <span
            data-ph-eyebrow
            className="font-(family-name:--font-bricolage) text-sm font-medium uppercase tracking-widest text-gray-text"
          >
            All Work
          </span>
          <div className="overflow-hidden pb-1">
            <h1
              data-ph-title
              className="font-(family-name:--font-bricolage) text-5xl font-semibold leading-tight text-white md:text-6xl"
            >
              Selected{" "}
              <span className="font-(family-name:--font-instrument) italic text-brand">
                Projects
              </span>
            </h1>
          </div>
          <p
            data-ph-sub
            className="max-w-xl text-base leading-relaxed text-gray-text"
          >
            Frontend, UI/UX, and Flutter work — from product startups to
            freelance builds. Each one sharpened how I design and ship
            interfaces.
          </p>

          {/* Filters */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => {
              const active = filter === cat;
              return (
                <button
                  key={cat}
                  data-ph-filter
                  type="button"
                  onClick={() => setFilter(cat)}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-widest transition-colors ${
                    active
                      ? "border-brand bg-brand text-white"
                      : "border-white-15 text-gray-text hover:border-brand/40 hover:text-white"
                  }`}
                >
                  {cat}
                  <span
                    className={active ? "text-white/70" : "text-gray-text/60"}
                  >
                    {countFor(cat)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Project List */}
        <div ref={listRef} className="flex flex-col">
          {filtered.map((project, index) => {
            const external = project.link.startsWith("http");
            return (
              <div
                key={project.title}
                data-proj-row
                className="group relative overflow-hidden border-b border-white-15"
              >
                {/* Cursor-following brand glow */}
                <div
                  data-glow
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0"
                  style={{
                    background:
                      "radial-gradient(420px circle at center, rgba(255,80,41,0.10), transparent 60%)",
                  }}
                />
                {/* Left accent bar */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-full w-0.5 origin-top scale-y-0 bg-brand transition-transform duration-500 ease-out group-hover:scale-y-100"
                />

                <a
                  href={project.link}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  aria-label={
                    external
                      ? `View ${project.title} (opens in new tab)`
                      : `View ${project.title}`
                  }
                  className="relative z-10 flex flex-col gap-4 px-3 py-10 transition-[padding] duration-500 md:flex-row md:items-start md:gap-12 md:group-hover:px-6"
                >
                  {/* Index + Year */}
                  <div className="flex shrink-0 flex-row items-center gap-4 md:w-24 md:flex-col md:items-start md:gap-1">
                    <span className="font-(family-name:--font-bricolage) text-4xl font-semibold text-dark-gray transition-colors duration-300 group-hover:text-brand">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-xs text-gray-text">{project.year}</span>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col gap-4">
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="font-(family-name:--font-bricolage) text-2xl font-semibold text-white transition-colors duration-300 group-hover:text-brand md:text-3xl">
                        {project.title}
                      </h2>
                      <ArrowUpRight
                        size={22}
                        className="mt-1 shrink-0 text-gray-text transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand"
                      />
                    </div>
                    <span className="text-xs font-medium uppercase tracking-widest text-brand">
                      {project.role}
                    </span>
                    <p className="max-w-2xl text-base leading-relaxed text-gray-text">
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
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
