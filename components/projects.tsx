"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

        const cleanups: Array<() => void> = [];

        // Section label — gentle fade-up as it scrolls into view.
        const label = section.querySelector<HTMLElement>("[data-section-label]");
        if (label) {
          gsap.from(label, {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: label, start: "top 90%" },
          });
        }

        const rows = gsap.utils.toArray<HTMLElement>("[data-project-row]", section);

        rows.forEach((row, i) => {
          const isOdd = i % 2 !== 0;
          const thumb = row.querySelector<HTMLElement>("[data-thumb]");
          const thumbInner = row.querySelector<HTMLElement>("[data-thumb-inner]");
          const thumbFloat = row.querySelector<HTMLElement>("[data-thumb-float]");
          const glow = row.querySelector<HTMLElement>("[data-glow]");
          const title = row.querySelector<HTMLElement>("[data-title]");
          const desc = row.querySelector<HTMLElement>("[data-desc]");
          const badges = gsap.utils.toArray<HTMLElement>("[data-badge]", row);
          if (!thumb || !thumbInner || !thumbFloat || !title) return;

          // Initial hidden states (only applied when motion is allowed).
          gsap.set(thumb, {
            transformPerspective: 1000,
            transformOrigin: "center",
            clipPath: isOdd
              ? "inset(0% 0% 0% 100%)" // odd: wipe right -> left
              : "inset(0% 100% 0% 0%)", // even: wipe left -> right
          });
          gsap.set(thumbInner, { scale: 1.25 });
          gsap.set(title, { yPercent: 115 });
          gsap.set([desc, ...badges], { opacity: 0, y: 28 });

          // Reveal timeline — fires once when the row enters the viewport.
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: row,
              start: "top 78%",
              toggleActions: "play none none none",
            },
          });

          tl.to(thumb, {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.1,
            ease: "power4.inOut",
          })
            .to(thumbInner, { scale: 1, duration: 1.3, ease: "power3.out" }, "<")
            .to(title, { yPercent: 0, duration: 0.9, ease: "power4.out" }, "-=0.85")
            .to(
              desc,
              { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
              "-=0.5"
            )
            .to(
              badges,
              {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.08,
                ease: "power3.out",
              },
              "-=0.4"
            );

          // Subtle parallax — the icon drifts as the row scrolls past.
          gsap.to(thumbFloat, {
            yPercent: -12,
            ease: "none",
            scrollTrigger: {
              trigger: row,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });

          // Desktop-only: cursor-driven 3D tilt + following brand glow.
          if (isDesktop) {
            const rotX = gsap.quickTo(thumb, "rotationX", {
              duration: 0.5,
              ease: "power3.out",
            });
            const rotY = gsap.quickTo(thumb, "rotationY", {
              duration: 0.5,
              ease: "power3.out",
            });
            const glowX = glow
              ? gsap.quickTo(glow, "xPercent", { duration: 0.5, ease: "power3.out" })
              : null;
            const glowY = glow
              ? gsap.quickTo(glow, "yPercent", { duration: 0.5, ease: "power3.out" })
              : null;

            const onMove = (e: MouseEvent) => {
              const r = thumb.getBoundingClientRect();
              const px = (e.clientX - r.left) / r.width - 0.5; // -0.5 .. 0.5
              const py = (e.clientY - r.top) / r.height - 0.5;
              rotY(px * 12);
              rotX(-py * 12);
              glowX?.(px * 55);
              glowY?.(py * 55);
            };
            const onEnter = () => {
              gsap.to(thumb, { scale: 1.02, duration: 0.4, ease: "power3.out" });
              if (glow) gsap.to(glow, { autoAlpha: 1, duration: 0.4 });
            };
            const onLeave = () => {
              rotX(0);
              rotY(0);
              gsap.to(thumb, { scale: 1, duration: 0.6, ease: "power3.out" });
              if (glow) gsap.to(glow, { autoAlpha: 0, duration: 0.5 });
            };

            thumb.addEventListener("mousemove", onMove);
            thumb.addEventListener("mouseenter", onEnter);
            thumb.addEventListener("mouseleave", onLeave);
            cleanups.push(() => {
              thumb.removeEventListener("mousemove", onMove);
              thumb.removeEventListener("mouseenter", onEnter);
              thumb.removeEventListener("mouseleave", onLeave);
            });
          }
        });

        // Fonts change row heights — recompute trigger positions once loaded.
        document.fonts.ready.then(() => ScrollTrigger.refresh());

        return () => {
          cleanups.forEach((fn) => fn());
        };
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="w-full px-6 py-24 md:px-25"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        {/* Section Header */}
        <h2
          data-section-label
          className="font-(family-name:--font-bricolage) text-sm font-medium uppercase tracking-widest text-gray-text"
        >
          Selected Work
        </h2>

        {/* Project List */}
        <div className="flex flex-col gap-16">
          {projects.map((project, index) => {
            const isOdd = index % 2 !== 0;

            return (
              <div
                key={project.title}
                data-project-row
                style={{ perspective: "1200px" }}
                className={`flex flex-col gap-8 md:flex-row md:items-center md:gap-16 ${
                  isOdd ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Thumbnail */}
                <div
                  data-thumb
                  className="group relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-white-15 bg-[#1a1a1d] will-change-transform md:w-1/2"
                >
                  <div
                    data-thumb-inner
                    className="h-full w-full will-change-transform"
                  >
                    <div
                      data-thumb-float
                      aria-hidden="true"
                      className="flex h-full w-full items-center justify-center text-gray-text"
                    >
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

                  {/* Cursor-following brand glow (desktop hover) */}
                  <div
                    data-glow
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-0"
                    style={{
                      background:
                        "radial-gradient(220px circle at center, rgba(255,80,41,0.28), transparent 65%)",
                    }}
                  />
                </div>

                {/* Content */}
                <div className="flex w-full flex-col gap-4 md:w-1/2">
                  <div className="overflow-hidden py-1">
                    <h3
                      data-title
                      className="font-(family-name:--font-bricolage) text-3xl font-semibold text-white"
                    >
                      {project.title}
                    </h3>
                  </div>
                  <p
                    data-desc
                    className="text-base leading-relaxed text-gray-text"
                  >
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.badges.map((badge) => (
                      <span
                        key={badge}
                        data-badge
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
