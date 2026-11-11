"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * DOM scroll effects (the particle globe is handled by ScrollScenes):
 *  - intro            pinned hero → stats scene, see Intro.tsx
 *  - [data-reveal]    fade up once when it enters the viewport
 *  - [data-light]     brightens progressively while scrolling (table rows)
 *  - hero bars        frosted panels: in on load, out once you scroll, back in at the top
 *  - [data-steps]     progress track fills and the current step lights up
 *  - [data-cta]       corner glow slides to the bottom, particle bars rise
 */
export function ScrollFx() {
  useGSAP(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ---- Intro: pinned hero → stats (all screen sizes) ----------------------
    // The intro section is 300vh with a sticky 100vh stage, so this timeline
    // spans two screens of scroll: 1 timeline unit = 1 screen.
    {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom bottom", scrub: 0.8 },
      });
      // Screen 1: headline up, dashboard down (globe rises via ScrollScenes).
      tl.to(".hero-gradient", { opacity: 0, duration: 0.8 }, 0)
        .to(".hero-copy", { y: () => -window.innerHeight * 0.55, opacity: 0, duration: 0.75, ease: "power1.in" }, 0)
        .to(".hero-frame-wrap", { y: () => window.innerHeight * 0.8, duration: 0.9, ease: "power2.in" }, 0)
        // Screen 2: stats copy and rows fade in around the centred globe.
        .fromTo(
          ".stats-copy .sh > *, .stats-copy .btn-row",
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.3, stagger: 0.07, ease: "power2.out" },
          0.95,
        )
        .fromTo(
          ".stat-row",
          { opacity: 0, x: 30 },
          { opacity: 1, x: 0, duration: 0.28, stagger: 0.09, ease: "power2.out" },
          1.05,
        )
        // Hold before the stage releases.
        .to({}, { duration: 0.35 }, 1.65);
    }

    // ---- Hero glass bars ------------------------------------------------------
    // Not tied to scroll position: they fade in on load, fade out as soon as
    // you start scrolling, and fade back in when you return to the very top.
    const bars = gsap.utils.toArray<HTMLElement>(".hero-bar");
    if (bars.length) {
      const showBars = (delay = 0) =>
        gsap.to(bars, {
          autoAlpha: 1,
          y: 0,
          duration: reduce ? 0 : 0.9,
          delay,
          ease: "power2.out",
          stagger: reduce ? 0 : { each: 0.08, from: "center" },
          overwrite: true,
        });
      const hideBars = () =>
        gsap.to(bars, {
          autoAlpha: 0,
          y: reduce ? 0 : "-1.5rem",
          duration: reduce ? 0 : 0.45,
          ease: "power2.in",
          stagger: reduce ? 0 : { each: 0.05, from: "edges" },
          overwrite: true,
        });
      gsap.set(bars, { autoAlpha: 0, y: "1.5rem" });
      const atTop = ScrollTrigger.create({
        start: 0,
        end: () => Math.max(24, window.innerHeight * 0.04),
        onLeave: hideBars,
        onEnterBack: () => showBars(),
      });
      // Landing at the top: show once the globe has started assembling.
      if (window.scrollY <= atTop.end) showBars(0.5);
    }

    if (reduce) {
      gsap.set("[data-light]", { opacity: 1 });
      gsap.set(".cta-glow-bottom", { opacity: 1 });
      return;
    }

    gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 40,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
    });

    gsap.utils.toArray<HTMLElement>("[data-light]").forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0.16 },
        { opacity: 1, ease: "none", scrollTrigger: { trigger: el, start: "top 82%", end: "top 58%", scrub: true } },
      );
    });

    document.querySelectorAll<HTMLElement>("[data-steps]").forEach((list) => {
      const fill = list.querySelector<HTMLElement>(".steps-fill");
      const steps = Array.from(list.querySelectorAll<HTMLElement>(".step"));
      ScrollTrigger.create({
        trigger: list,
        start: "top 75%",
        end: "bottom 45%",
        scrub: true,
        onUpdate: (self) => {
          if (fill) fill.style.height = `${Math.max(8, self.progress * 100)}%`;
          const current = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
          steps.forEach((s, i) => s.classList.toggle("on", i === current));
        },
      });
    });

    document.querySelectorAll<HTMLElement>("[data-cta]").forEach((panel) => {
      const st = { trigger: panel, start: "top 85%", end: "center 45%", scrub: true };
      gsap.to(panel.querySelector(".cta-glow-corner"), { opacity: 0, ease: "none", scrollTrigger: st });
      gsap.to(panel.querySelector(".cta-glow-bottom"), { opacity: 1, ease: "none", scrollTrigger: st });
      gsap.from(panel.querySelectorAll(".candle"), {
        y: 80,
        opacity: 0,
        duration: 1.3,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: panel, start: "top 65%" },
      });
    });

    // Layout can shift once fonts load; re-measure trigger positions.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  });

  return null;
}
