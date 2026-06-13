"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Code2, PenTool, Smartphone } from "lucide-react";

const pillars = [
  {
    icon: Code2,
    title: "Frontend Engineering",
    description:
      "Production-ready interfaces in React & Next.js — pixel-perfect, accessible, and fast.",
    tags: ["React", "Next.js", "TypeScript", "Tailwind", "GSAP"],
  },
  {
    icon: PenTool,
    title: "UI / UX Design",
    description:
      "I design the screens before I build them — wireframes, design systems, and interactive prototypes.",
    tags: ["Figma", "Design Systems", "Prototyping", "Wireframing"],
  },
  {
    icon: Smartphone,
    title: "Mobile · Flutter",
    description:
      "Cross-platform apps from a single Dart codebase that feel native on iOS and Android.",
    tags: ["Flutter", "Dart", "iOS & Android", "Animations"],
  },
];

export default function About() {
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
        // Reduced-motion users keep the static, fully-visible layout.
        if (!motionOK) return;

        const q = gsap.utils.selector(section);
        const cleanups: Array<() => void> = [];

        // Section label
        gsap.from(q("[data-about-label]"), {
          opacity: 0,
          y: 20,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 80%" },
        });

        // Intro — photo reveal + masked heading + staggered bio.
        const photo = q("[data-about-photo]")[0];
        const photoInner = q("[data-about-photo-inner]")[0];
        const heading = q("[data-about-heading]")[0];
        const bios = q("[data-about-bio]");

        if (photo && photoInner && heading) {
          gsap.set(photo, { clipPath: "inset(0% 0% 100% 0%)" });
          gsap.set(photoInner, { scale: 1.25 });
          gsap.set(heading, { yPercent: 115 });
          gsap.set(bios, { opacity: 0, y: 24 });

          const tl = gsap.timeline({
            scrollTrigger: { trigger: photo, start: "top 78%" },
          });
          tl.to(photo, {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1,
            ease: "power4.inOut",
          })
            .to(photoInner, { scale: 1, duration: 1.2, ease: "power3.out" }, "<")
            .to(heading, { yPercent: 0, duration: 0.9, ease: "power4.out" }, "-=0.7")
            .to(
              bios,
              {
                opacity: 1,
                y: 0,
                duration: 0.7,
                stagger: 0.12,
                ease: "power3.out",
              },
              "-=0.55"
            );
        }

        // Pillar cards — staggered rise on scroll.
        const cards = gsap.utils.toArray<HTMLElement>("[data-pillar]", section);
        gsap.set(cards, { opacity: 0, y: 48 });
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: q("[data-pillar-grid]")[0], start: "top 82%" },
        });

        // Desktop-only: cursor-following brand glow on each pillar card.
        if (isDesktop) {
          cards.forEach((card) => {
            const glow = card.querySelector<HTMLElement>("[data-glow]");
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
              const r = card.getBoundingClientRect();
              glowX(((e.clientX - r.left) / r.width - 0.5) * 60);
              glowY(((e.clientY - r.top) / r.height - 0.5) * 60);
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
      id="about"
      className="relative w-full overflow-hidden px-6 py-24 md:px-25"
    >
      {/* Ambient brand glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full opacity-50 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,80,41,0.18), transparent 70%)",
        }}
      />

      <div className="relative mx-auto flex max-w-5xl flex-col gap-16">
        {/* Header */}
        <h2
          data-about-label
          className="font-(family-name:--font-bricolage) text-sm font-medium uppercase tracking-widest text-gray-text"
        >
          About Me
        </h2>

        {/* Intro row */}
        <div className="flex flex-col gap-12 md:flex-row md:items-center md:gap-16">
          {/* Photo */}
          <div className="mx-auto shrink-0 md:mx-0">
            <div className="relative">
              {/* Soft brand frame glow */}
              <div
                aria-hidden="true"
                className="absolute -inset-3 rounded-[2rem] opacity-60 blur-2xl"
                style={{
                  background:
                    "linear-gradient(to bottom right, rgba(255,80,41,0.35), transparent 70%)",
                }}
              />
              <div
                data-about-photo
                className="relative h-64 w-64 overflow-hidden rounded-2xl border border-white-15 will-change-transform"
              >
                <div
                  data-about-photo-inner
                  className="h-full w-full will-change-transform"
                >
                  <Image
                    src="/image-me.png"
                    alt="Juliansyah"
                    width={256}
                    height={256}
                    sizes="256px"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Focus caption */}
            <div className="mt-5 flex items-center justify-center gap-2 md:justify-start">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
              </span>
              <span className="text-xs font-medium uppercase tracking-widest text-gray-text">
                Frontend · UI/UX · Flutter
              </span>
            </div>
          </div>

          {/* Text */}
          <div className="flex flex-col gap-5">
            <div className="overflow-hidden pb-1">
              <h3
                data-about-heading
                className="font-(family-name:--font-bricolage) text-3xl font-semibold leading-tight text-white md:text-4xl"
              >
                I design and build the interfaces people{" "}
                <span className="font-(family-name:--font-instrument) italic text-brand">
                  actually touch
                </span>
                .
              </h3>
            </div>
            <p
              data-about-bio
              className="text-base leading-relaxed text-gray-text"
            >
              I&apos;m a frontend engineer and UI/UX designer who ships for the
              web with React &amp; Next.js — and for mobile with Flutter. I care
              about the details most people only feel: timing, spacing, motion,
              and the small moments that make a product feel considered.
            </p>
            <p
              data-about-bio
              className="text-base leading-relaxed text-gray-text"
            >
              Designing and coding the same screens means less hand-off friction,
              faster iteration, and interfaces that ship looking exactly the way
              they were imagined.
            </p>
          </div>
        </div>

        {/* Pillars */}
        <div
          data-pillar-grid
          className="grid grid-cols-1 gap-5 md:grid-cols-3"
        >
          {pillars.map(({ icon: Icon, title, description, tags }) => (
            <article
              key={title}
              data-pillar
              className="group relative overflow-hidden rounded-2xl border border-white-15 bg-white/[0.02] p-6 transition-colors duration-300 hover:border-brand/40"
            >
              {/* Cursor-following brand glow */}
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

                <h4 className="font-(family-name:--font-bricolage) text-lg font-semibold text-white">
                  {title}
                </h4>
                <p className="text-sm leading-relaxed text-gray-text">
                  {description}
                </p>

                <div className="mt-1 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white-15 px-2.5 py-1 text-[11px] font-medium text-gray-text"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
