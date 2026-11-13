"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { showStepIcon } from "@/lib/sceneState";
import type { StepId } from "@/lib/stepScenes";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * DOM scroll effects (the particle globe's path is handled by ScrollScenes):
 *  - intro            pinned hero → proof scene, see Intro.tsx
 *  - [data-reveal]    fade up once when it enters the viewport
 *  - hero bars        frosted panels: in on load, out once you scroll, back in at the top
 *  - [data-steps]     How I work: the track fills, the current step lights up
 *                     and the globe turns into its picture
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
    // The track fills, the current step lights up and the globe turns into
    // its picture (lib/stepScenes.ts). Desktop: the track is pinned
    // ([data-steps-pin], a tall track with a sticky stage), so this spans the
    // pinned scroll while the picture holds still; after Launch the rocket
    // stays, to dissolve into About's portrait. Phones and reduced motion:
    // nothing pins; it runs while the list scrolls past. With reduced motion
    // every step stays lit and the track full (reduced-motion.css); the
    // pictures swap at once.
    //
    // The section never shows the earth: Discover is set as soon as the
    // section starts to come in (its top at the screen's bottom), while the
    // particles are still faded out from Work, so they assemble straight into
    // it. Above that point the globe comes back, still unseen, for the hero.
    // Phones hold Discover under the title (their steps show their own
    // icons). Without WebGL the lit step's picture shows as an image where
    // the globe would be ([data-step-icon]).
    document.querySelectorAll<HTMLElement>("[data-steps]").forEach((list) => {
      const section = list.closest<HTMLElement>("section") ?? list;
      const fill = list.querySelector<HTMLElement>(".steps-fill");
      const steps = gsap.utils.toArray<HTMLElement>(".step", list);
      const ids = steps.map((s) => s.dataset.step as StepId);
      const fallbacks = gsap.utils.toArray<HTMLElement>("[data-step-icon]", section);
      const pin = list.closest<HTMLElement>("[data-steps-pin]");
      let current = 0;
      let shown: StepId | null = null; // the picture on the globe (null = the globe)

      const showIcon = (id: StepId | null) => {
        if (id === shown) return;
        shown = id;
        showStepIcon(id, { instant: reduce });
      };

      gsap.matchMedia().add({ desktop: "(min-width: 901px)", mobile: "(max-width: 900px)" }, (ctx) => {
        const desktop = Boolean(ctx.conditions?.desktop);
        const pinned = desktop && Boolean(pin) && !reduce;
        let arrival: ScrollTrigger | null = null;
        let track: ScrollTrigger | null = null;

        const sync = () => {
          if (!arrival || !track) return;
          const y = arrival.scroll();
          showIcon(y < arrival.start ? null : desktop && y >= track.start ? ids[current] : ids[0]);
        };
        const update = (self: ScrollTrigger) => {
          if (fill && !reduce) fill.style.height = `${Math.max(8, self.progress * 100)}%`;
          const i = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
          if (i !== current) {
            current = i;
            steps.forEach((s, k) => s.classList.toggle("on", k === i));
            fallbacks.forEach((a, k) => a.classList.toggle("on", k === i));
          }
          sync();
        };

        arrival = ScrollTrigger.create({
          trigger: section,
          start: "top bottom",
          end: () => ScrollTrigger.maxScroll(window),
          onToggle: sync,
          onRefresh: sync,
        });
        track = ScrollTrigger.create({
          trigger: pinned ? pin : list,
          start: pinned ? "top top" : "top 75%",
          end: pinned ? "bottom bottom" : "bottom 45%",
          onUpdate: update,
          onRefresh: update,
        });
        sync();
        // Back to the globe when the layout changes.
        return () => showIcon(null);
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
