"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { sceneState } from "@/lib/sceneState";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * DOM scroll effects (the particle globe is handled by ScrollScenes):
 *  - intro            pinned hero → proof scene, see Intro.tsx
 *  - [data-reveal]    fade up once when it enters the viewport
 *  - hero bars        frosted panels: in on load, out once you scroll, back in at the top
 *  - [data-steps]     How I work: the track fills, the current step lights up
 *                     and its picture draws itself in on the globe's lens,
 *                     which shows only while the globe under it is formed
 *  - [data-cta]       contact panel: corner glow slides to the bottom
 */
export function ScrollFx() {
  useGSAP(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ---- Intro: pinned hero → proof (all screen sizes) -----------------------
    // The intro wrapper is 300vh with a sticky 100vh stage, so this timeline
    // spans two screens of scroll: 1 timeline unit = 1 screen. With reduced
    // motion nothing pins (reduced-motion.css) and this is skipped.
    if (!reduce) {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom bottom", scrub: 0.8 },
      });
      // Screen 1: headline up, dashboard down (globe rises via ScrollScenes).
      tl.to(".hero-gradient", { opacity: 0, duration: 0.8 }, 0)
        .to(".hero-copy", { y: () => -window.innerHeight * 0.55, opacity: 0, duration: 0.75, ease: "power1.in" }, 0)
        .to(".hero-frame-wrap", { y: () => window.innerHeight * 0.8, duration: 0.9, ease: "power2.in" }, 0)
        // Screen 2: track-record copy, buttons and rows fade in around the
        // centred globe. autoAlpha also sets visibility, so the buttons can't
        // be clicked or tabbed to while they're invisible.
        .fromTo(".proof-copy .sh > *, .proof-actions", { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.07, ease: "power2.out" }, 0.95)
        .fromTo(".proof-row", { autoAlpha: 0, x: 30 }, { autoAlpha: 1, x: 0, duration: 0.28, stagger: 0.09, ease: "power2.out" }, 1.05)
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

    // ---- How I work: steps and the pictures on the globe ---------------------
    // The track fills, the current step lights up and its picture shows on
    // the globe's lens. Desktop: the track is pinned ([data-steps-pin], a
    // tall track with a sticky stage), so this spans the pinned scroll while
    // the globe holds still. Phones and reduced motion: nothing pins; it runs
    // while the list scrolls past. With reduced motion every step stays lit
    // and the track full (reduced-motion.css); only the picture swaps, still.
    document.querySelectorAll<HTMLElement>("[data-steps]").forEach((list) => {
      const section = list.closest("section");
      const fill = list.querySelector<HTMLElement>(".steps-fill");
      const steps = gsap.utils.toArray<HTMLElement>(".step", list);
      const arts = section ? gsap.utils.toArray<HTMLElement>("[data-step-art]", section) : [];
      const lens = section?.querySelector<HTMLElement>(".process-lens");
      const pin = list.closest<HTMLElement>("[data-steps-pin]");
      let current = 0;

      // A picture draws itself in each time it's shown (.played, CSS) and
      // resets once it has faded out, ready to draw in again.
      const play = (art?: HTMLElement) => {
        if (!art || reduce) return;
        art.classList.remove("played");
        void art.offsetWidth; // restarts the CSS animations
        art.classList.add("played");
      };
      arts.forEach((a) =>
        a.addEventListener("transitionend", (e) => {
          if (e.target === a && !a.classList.contains("on")) a.classList.remove("played");
        }),
      );

      const update = (progress: number) => {
        if (fill && !reduce) fill.style.height = `${Math.max(8, progress * 100)}%`;
        const i = Math.min(steps.length - 1, Math.floor(progress * steps.length));
        if (i === current) return;
        current = i;
        steps.forEach((s, k) => s.classList.toggle("on", k === i));
        arts.forEach((a, k) => a.classList.toggle("on", k === i));
        play(arts[i]);
      };
      gsap.matchMedia().add({ desktop: "(min-width: 901px)", mobile: "(max-width: 900px)" }, (ctx) => {
        const pinned = Boolean(ctx.conditions?.desktop && pin && !reduce);
        ScrollTrigger.create({
          trigger: pinned ? pin : list,
          start: pinned ? "top top" : "top 75%",
          end: pinned ? "bottom bottom" : "bottom 45%",
          onUpdate: (self) => update(self.progress),
          onRefresh: (self) => update(self.progress),
        });
      });

      // The lens fades in as the globe forms under it and out as it
      // dissolves, so it never floats over an empty background, and the lit
      // step's picture draws itself in as the lens appears. Without WebGL
      // there's no globe to follow: the lens just stays. All of this, and
      // the pictures' animations (.is-near), only run near the section.
      if (!section || !lens) return;
      let shown = false;
      const syncLens = () => {
        const formed = document.documentElement.classList.contains("no-webgl")
          ? 1
          : sceneState.opacity * (1 - gsap.utils.clamp(0, 1, sceneState.morph / 0.5));
        lens.style.opacity = formed.toFixed(3);
        if (formed > 0.5 !== shown) {
          shown = !shown;
          if (shown) play(arts[current]);
        }
      };
      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          section.classList.toggle("is-near", self.isActive);
          if (self.isActive) gsap.ticker.add(syncLens);
          else gsap.ticker.remove(syncLens);
        },
      });
    });

    if (reduce) {
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

    document.querySelectorAll<HTMLElement>("[data-cta]").forEach((panel) => {
      const st = { trigger: panel, start: "top 85%", end: "center 45%", scrub: true };
      gsap.to(panel.querySelector(".cta-glow-corner"), { opacity: 0, ease: "none", scrollTrigger: st });
      gsap.to(panel.querySelector(".cta-glow-bottom"), { opacity: 1, ease: "none", scrollTrigger: st });
    });

    // Layout can shift once fonts load; re-measure trigger positions.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  });

  return null;
}
