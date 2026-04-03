"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const glow = glowRef.current;
    const marquee = marqueeRef.current;
    if (!section || !glow || !marquee) return;

    const ctx = gsap.context(() => {
      // Hero entrance animations — staggered slide-up
      gsap.from("[data-hero-animate]", {
        y: 150,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.1,
      });

      // Marquee — infinite horizontal scroll
      gsap.to(marquee, {
        xPercent: -50,
        duration: 20,
        ease: "none",
        repeat: -1,
      });
    }, section);

    // Mesh gradient cursor tracking (horizontal only)
    const xTo = gsap.quickTo(glow, "x", {
      duration: 0.8,
      ease: "power3.out",
    });

    const handleMouseMove = (e: MouseEvent) => {
      // Map cursor X to -100..100 range
      const normalized = (e.clientX / window.innerWidth - 0.5) * 2;
      xTo(normalized * 100);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      ctx.revert();
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
        <div data-hero-animate>
          <div className="h-40 w-40 overflow-hidden rounded-full transition-transform duration-500 ease-out hover:scale-120">
            <Image
              src="/image.png"
              alt="Juliansyah"
              width={200}
              height={200}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        </div>

        {/* Greeting */}
        <h3
          data-hero-animate
          className="font-(family-name:--font-bricolage) text-2xl font-normal text-white text-center"
        >
          Hello, I&apos;m Juliansyah
        </h3>

        {/* Main Heading */}
        <h1
          data-hero-animate
          className="heading-gradient max-w-4xl text-center leading-[1.1]"
        >
          <span className="font-(family-name:--font-bricolage) text-[clamp(3rem,5vw,75px)] font-normal not-italic">
            Interfaces That{" "}
          </span>
          <span className="font-(family-name:--font-instrument) text-[clamp(3rem,5vw,75px)] italic">
            Look Good{" "}
          </span>
          <span className="font-(family-name:--font-bricolage) text-[clamp(3rem,5vw,75px)] font-normal not-italic">
            and{" "}
          </span>
          <span className="font-(family-name:--font-instrument) text-[clamp(3rem,5vw,75px)] italic">
            Work Better
          </span>
        </h1>

        {/* Status / Subtitle */}
        <p
          data-hero-animate
          className="max-w-178 text-center font-(family-name:--font-bricolage) text-2xl font-bold text-brand"
        >
          Front-End Developer &amp; UI/UX Designer
        </p>

        {/* Description */}
        <p
          data-hero-animate
          className="max-w-178 text-center font-[Helvetica,Arial,sans-serif] text-lg leading-normal text-gray-text"
        >
          I&apos;m a T-shaped developer who goes deep in Front-End engineering
          and UI/UX design — bridging the gap between how things look and how
          they work. I turn complex problems into interfaces people actually
          enjoy using.
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
          <div ref={marqueeRef} className="flex h-full w-max items-center gap-30">
            {[...Array(2)].map((_, setIndex) => (
              <div key={setIndex} className="flex items-center gap-30">
                {[
                  "Next.js",
                  "React",
                  "TypeScript",
                  "Tailwind CSS",
                  "Node.js",
                  "PostgreSQL",
                ].map((tech) => (
                  <span
                    key={`${setIndex}-${tech}`}
                    className="whitespace-nowrap text-sm font-medium uppercase tracking-widest text-gray-text"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
