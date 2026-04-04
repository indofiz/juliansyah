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

    const isDesktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (isDesktop) window.addEventListener("mousemove", handleMouseMove);

    return () => {
      ctx.revert();
      marqueeTweenRef.current?.kill();
      if (isDesktop) window.removeEventListener("mousemove", handleMouseMove);
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
      <div className="relative flex flex-col items-center gap-7 px-6 pt-16 pb-28.75 md:px-25">
        {/* Profile Image */}
        <div ref={imageWrapRef} className="group relative h-40 w-40">
          {/* Hobby icons — pop up on hover, overlapping image corners */}
          {/* Orange bg — bottom layer */}
          <div className="absolute inset-0 z-10 rounded-full transition-transform duration-500 ease-out group-hover:scale-110" style={{ background: "linear-gradient(to bottom right, #FF5029, #A7280B)" }} />

          {/* Top Left — Ideas */}
          <div className="absolute -top-4 -left-4 z-20 hidden md:block opacity-0 scale-50 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:scale-100">
            <Image src="/what-i-like/bulb 1.png" alt="Ideas" width={72} height={72} />
          </div>
          {/* Top Right — Coding */}
          <div className="absolute -top-4 -right-4 z-20 hidden md:block opacity-0 scale-50 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:scale-100 delay-75">
            <Image src="/what-i-like/laptop 1.png" alt="Coding" width={72} height={72} />
          </div>
          {/* Bottom Left — Design */}
          <div className="absolute -bottom-1 -left-4 z-20 hidden md:block opacity-0 scale-50 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:scale-100 delay-150">
            <Image src="/what-i-like/push-pins 1.png" alt="Design" width={72} height={72} />
          </div>
          {/* Bottom Right — Collaboration */}
          <div className="absolute -bottom-1 -right-4 z-20 hidden md:block opacity-0 scale-50 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:scale-100 delay-225">
            <Image src="/what-i-like/discussion 1.png" alt="Collaboration" width={72} height={72} />
          </div>

          {/* Character image — top layer */}
          <div className="absolute inset-0 z-30 overflow-hidden rounded-full transition-transform duration-500 ease-out group-hover:scale-110">
            <Image
              src="/image-transparent.png"
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
          className="font-(family-name:--font-bricolage) text-lg md:text-2xl font-normal text-white text-center"
        >
          Hi, I&apos;m Juliansyah.
        </p>

        {/* Main Heading */}
        <h1
          ref={headingRef}
          className="heading-gradient max-w-4xl text-center leading-[1.1]"
        >
          <span className="font-(family-name:--font-bricolage) text-[clamp(2rem,5vw,75px)] font-normal not-italic">
            I Build What{" "}
          </span>
          <span className="font-(family-name:--font-instrument) text-[clamp(2rem,5vw,75px)] italic">
            Designers Dream{" "}
          </span>
          <span className="font-(family-name:--font-bricolage) text-[clamp(2rem,5vw,75px)] font-normal not-italic">
            and{" "}
          </span>
          <span className="font-(family-name:--font-instrument) text-[clamp(2rem,5vw,75px)] italic">
            Engineers Ship
          </span>
        </h1>

        {/* Status / Subtitle */}
        <p
          data-hero-animate
          className="max-w-178 text-center font-(family-name:--font-bricolage) text-base md:text-2xl font-bold text-brand"
        >
          Frontend Engineer with a Design Edge
        </p>

        {/* Description */}
        <p
          data-hero-animate
          className="max-w-178 text-center font-[Helvetica,Arial,sans-serif] text-sm md:text-lg leading-normal text-gray-text"
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
                className="flex items-center gap-10 pr-10"
              >
                {(
                  [
                    { src: "/logos/linknet.png",                    name: "Linknet",                   type: "wide"   },
                    { src: "/logos/uswah_salam.png",                name: "Uswah",                     type: "wide"   },
                    { src: "/logos/mabes_tni.png",                  name: "Mabes TNI",                 type: "square" },
                    { src: "/logos/malinau.png",                    name: "Kabupaten Malinau",         type: "square" },
                    { src: "/logos/nizamia.png",                    name: "Nizamia Andalusia",         type: "square" },
                    { src: "/logos/pangkalpinang.png",              name: "Kota Pangkalpinang",        type: "square" },
                    { src: "/logos/thi.png",                        name: "THI",                       type: "square" },
                    { src: "/logos/yayasan_pendidikan_alazhar.png", name: "Yayasan Al Azhar",          type: "square" },
                  ] as { src: string; name: string; type: "square" | "wide" }[]
                ).map((logo) => (
                  <div
                    key={`${setIndex}-${logo.name}`}
                    className={`flex shrink-0 items-center justify-center ${
                      logo.type === "wide" ? "h-12 w-28" : "h-12 w-12"
                    }`}
                    title={logo.name}
                  >
                    <Image
                      src={logo.src}
                      alt={logo.name}
                      width={logo.type === "wide" ? 100 : 40}
                      height={40}
                      className="h-full w-full object-contain grayscale opacity-70 transition-[filter,opacity] duration-300 ease-out hover:grayscale-0 hover:opacity-100"
                    />
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
