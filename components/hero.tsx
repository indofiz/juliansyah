"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const marqueeTweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const glow = glowRef.current;
    const imageWrap = imageWrapRef.current;
    const heading = headingRef.current;
    if (!section || !glow || !imageWrap || !heading) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // 1. Image — scale bounce entrance
      tl.from(imageWrap, {
        scale: 0.5,
        opacity: 0,
        duration: 1,
        ease: "back.out(1.7)",
      })
      // 2. H1 — each word phrase slides up individually
      .from(heading.children, {
        y: 50,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
      }, "-=0.4")
      // 3. Remaining elements — greeting, subtitle, description, marquee
      .from("[data-hero-animate]", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
      }, "-=0.3");


    }, section);

    // Mesh gradient cursor tracking (horizontal only)
    const xTo = gsap.quickTo(glow, "x", {
      duration: 0.8,
      ease: "power3.out",
    });

    const handleMouseMove = (e: MouseEvent) => {
      // Map cursor X to -100..100 range
      const normalized = (e.clientX / window.innerWidth - 0.5) * 2;
      xTo(normalized * 300);
    };

    // Marquee — measure one set's exact offsetWidth (includes trailing pr-12 gap).
    // Animating by exactly that distance means the repeat reset is pixel-perfect:
    // content at x=0 and x=-setWidth is visually identical → no jump, no gap.
    document.fonts.ready.then(() => {
      const marquee = marqueeRef.current;
      const set = setRef.current;
      if (!marquee || !set) return;
      const setWidth = set.offsetWidth;
      marqueeTweenRef.current = gsap.fromTo(
        marquee,
        { x: 0 },
        { x: -setWidth, duration: 22, ease: "none", repeat: -1 }
      );
    });

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      ctx.revert();
      marqueeTweenRef.current?.kill();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section ref={sectionRef} id="hero" className="relative w-full overflow-hidden">
      {/* Top gradient line */}
      <div
        className="absolute inset-x-0 top-0 z-20 pointer-events-none"
        style={{
          height: "1px",
          background:
            "linear-gradient(to right, transparent 15%, rgba(255,68,68,0.2) 40%, rgba(255,150,51,0.2) 60%, transparent 85%)",
        }}
      />

      {/* Mesh gradient glow — wider to allow horizontal movement */}
      <div
        ref={glowRef}
        className="hero-mesh-gradient absolute top-0 h-50 z-10 pointer-events-none"
        style={{ left: "-15%", width: "130%" }}
      />

      {/* Grid background */}
      <div className="grid-background grid-fade absolute inset-0 h-full w-full" />

      {/* Content */}
      <div className="relative flex flex-col items-center gap-7 px-6 pt-28 pb-28.75 md:px-25">
        {/* Profile Image */}
        <div ref={imageWrapRef} className="group relative h-40 w-40">
          {/* Hobby icons — pop up on hover, overlapping image corners */}
          {/* Top Left — Reading */}
          <div className="absolute -top-4 -left-4 z-20 flex h-13 w-13 items-center justify-center rounded-full border border-white/15 bg-black/50 text-2xl shadow-lg backdrop-blur-md ring-1 ring-white/5 opacity-100 scale-100 md:opacity-0 md:scale-50 transition-all duration-300 ease-out md:group-hover:opacity-100 md:group-hover:scale-100">
            📚
          </div>
          {/* Top Right — Gym */}
          <div className="absolute -top-4 -right-4 z-20 flex h-13 w-13 items-center justify-center rounded-full border border-white/15 bg-black/50 text-2xl shadow-lg backdrop-blur-md ring-1 ring-white/5 opacity-100 scale-100 md:opacity-0 md:scale-50 transition-all duration-300 ease-out md:group-hover:opacity-100 md:group-hover:scale-100 delay-75">
            🏋️
          </div>
          {/* Bottom Left — Running */}
          <div className="absolute -bottom-4 -left-4 z-20 flex h-13 w-13 items-center justify-center rounded-full border border-white/15 bg-black/50 text-2xl shadow-lg backdrop-blur-md ring-1 ring-white/5 opacity-100 scale-100 md:opacity-0 md:scale-50 transition-all duration-300 ease-out md:group-hover:opacity-100 md:group-hover:scale-100 delay-150">
            🏃
          </div>
          {/* Bottom Right — Coding & Design */}
          <div className="absolute -bottom-4 -right-4 z-20 flex h-13 w-13 items-center justify-center rounded-full border border-white/15 bg-black/50 text-2xl shadow-lg backdrop-blur-md ring-1 ring-white/5 opacity-100 scale-100 md:opacity-0 md:scale-50 transition-all duration-300 ease-out md:group-hover:opacity-100 md:group-hover:scale-100 delay-225">
            💻
          </div>

          <div className="h-40 w-40 overflow-hidden rounded-full transition-transform duration-500 ease-out group-hover:scale-110">
            <Image
              src="/image.png"
              alt="Juliansyah — Frontend Engineer"
              width={200}
              height={200}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        </div>

        {/* Greeting */}
        <p
          data-hero-animate
          className="font-(family-name:--font-bricolage) text-2xl font-normal text-white text-center"
        >
          Hi, I&apos;m Juliansyah.
        </p>

        {/* Main Heading */}
        <h1
          ref={headingRef}
          className="heading-gradient max-w-4xl text-center leading-[1.1]"
        >
          <span className="font-(family-name:--font-bricolage) text-[clamp(3rem,5vw,75px)] font-normal not-italic">
            I Build What{" "}
          </span>
          <span className="font-(family-name:--font-instrument) text-[clamp(3rem,5vw,75px)] italic">
            Designers Dream{" "}
          </span>
          <span className="font-(family-name:--font-bricolage) text-[clamp(3rem,5vw,75px)] font-normal not-italic">
            and{" "}
          </span>
          <span className="font-(family-name:--font-instrument) text-[clamp(3rem,5vw,75px)] italic">
            Engineers Ship
          </span>
        </h1>

        {/* Status / Subtitle */}
        <p
          data-hero-animate
          className="max-w-178 text-center font-(family-name:--font-bricolage) text-2xl font-bold text-brand"
        >
          Frontend Engineer with a Design Edge
        </p>

        {/* Description */}
        <p
          data-hero-animate
          className="max-w-178 text-center font-[Helvetica,Arial,sans-serif] text-lg leading-normal text-gray-text"
        >
          Most developers hand off to designers. I don&apos;t. I write
          production-ready frontend code and design the interfaces myself —
          which means less back-and-forth, faster delivery, and products that
          look intentional because they are.
        </p>

        {/* Marquee / Logo Strip */}
        <div
          data-hero-animate
          className="mt-8 h-23.25 w-full max-w-5xl overflow-hidden border-y border-white-15 py-2.5"
          style={{
            maskImage:
              "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12.5%, rgba(0,0,0,1) 87.5%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12.5%, rgba(0,0,0,1) 87.5%, rgba(0,0,0,0) 100%)",
          }}
        >
          <div ref={marqueeRef} className="flex h-full w-max items-center">
            {[...Array(2)].map((_, setIndex) => (
              <div
                key={setIndex}
                ref={setIndex === 0 ? setRef : undefined}
                className="flex items-center gap-12 pr-12"
              >
                {(
                  [
                    { name: "Next.js",      type: "wide"   },
                    { name: "React",        type: "square" },
                    { name: "TypeScript",   type: "square" },
                    { name: "Tailwind CSS", type: "wide"   },
                    { name: "Node.js",      type: "wide"   },
                    { name: "PostgreSQL",   type: "wide"   },
                    { name: "Docker",       type: "square" },
                    { name: "Figma",        type: "square" },
                  ] as { name: string; type: "square" | "wide" }[]
                ).map((logo) => (
                  <div
                    key={`${setIndex}-${logo.name}`}
                    className={`flex shrink-0 items-center justify-center rounded border border-dashed border-white/20 bg-white/3 ${
                      logo.type === "wide" ? "h-9 w-24" : "h-9 w-9"
                    }`}
                    title={logo.name}
                  >
                    <span className="select-none text-[10px] font-medium text-gray-text/60">
                      {logo.type === "wide" ? logo.name : logo.name.slice(0, 2)}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
