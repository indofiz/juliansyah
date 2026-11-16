"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { sceneState, showStepIcon } from "@/lib/sceneState";
import type { StepId } from "@/lib/stepScenes";
import { gateSteps } from "@/lib/stepGate";
import { PHONE_PIN } from "@/lib/sceneKeyframes";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Snap for a pinned step track of `n` equal bands: from where the scroll
 * would come to rest (`value`, 0–1) to the middle of a step, moving on in
 * the scroll's direction once it's 30% of the way to the next step.
 */
const snapStep = (n: number) => (value: number, self?: ScrollTrigger) => {
  const at = value * n - 0.5; // 0 … n-1 at the steps' middles
  const step = self && self.direction < 0 ? Math.ceil(at - 0.7) : Math.floor(at + 0.7);
  return (Math.min(n - 1, Math.max(0, step)) + 0.5) / n;
};

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
    // its picture (lib/stepScenes.ts). Desktop, and phones tall enough
    // (PHONE_PIN): the track is pinned ([data-steps-pin], a tall track with a
    // sticky stage), so this spans the pinned scroll while the picture holds
    // still; after Launch the rocket stays, to dissolve into About's
    // portrait. Shorter phones and reduced motion: nothing pins; it runs
    // while the list scrolls past. With reduced motion every step stays lit
    // and the track full (reduced-motion.css); the pictures swap at once.
    //
    // This only picks WHICH picture: the lit step's (Discover above the
    // track), but Discover on unpinned phones (their steps show their own
    // icons). WHETHER a picture shows instead of the earth is `pictures` in
    // lib/sceneKeyframes.ts, scrubbed with the rest of the scene: it turns on
    // while the particles are still faded out from Work, so the section
    // never shows the earth, and off once About's portrait has broken up, so
    // contact and the hero always get the earth. The picture follows the
    // track's own progress on every change (jumps and refreshes included),
    // so it never waits on another trigger. Without WebGL the lit step's
    // picture shows as an image where the globe would be ([data-step-icon]).
    document.querySelectorAll<HTMLElement>("[data-steps]").forEach((list) => {
      const section = list.closest<HTMLElement>("section") ?? list;
      const fill = list.querySelector<HTMLElement>(".steps-fill");
      const steps = gsap.utils.toArray<HTMLElement>(".step", list);
      const ids = steps.map((s) => s.dataset.step as StepId);
      const fallbacks = gsap.utils.toArray<HTMLElement>("[data-step-icon]", section);
      const pin = list.closest<HTMLElement>("[data-steps-pin]");
      let current = 0;

      // Compared with the scene's own target, so a picture picked elsewhere
      // (the dev keys in ParticleMorph) is put right on the next change.
      const showIcon = (id: StepId) => {
        if (id !== sceneState.iconTarget) showStepIcon(id, { instant: reduce });
      };

      gsap.matchMedia().add({ desktop: "(min-width: 901px)", phonePin: PHONE_PIN }, (ctx) => {
        const desktop = Boolean(ctx.conditions?.desktop);
        const phonePinned = !desktop && Boolean(ctx.conditions?.phonePin);
        const pinned = (desktop || phonePinned) && Boolean(pin) && !reduce;

        const update = (self: ScrollTrigger) => {
          // Height of the fill on desktop, width on pinned phones (CSS).
          if (fill && !reduce) fill.style.setProperty("--fill", `${Math.max(8, self.progress * 100)}%`);
          const i = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
          if (i !== current) {
            current = i;
            steps.forEach((s, k) => s.classList.toggle("on", k === i));
            fallbacks.forEach((a, k) => a.classList.toggle("on", k === i));
          }
          showIcon(desktop || pinned ? ids[current] : ids[0]);
        };

        const track = ScrollTrigger.create({
          trigger: pinned ? pin : list,
          start: pinned ? "top top" : "top 75%",
          end: pinned ? "bottom bottom" : "bottom 45%",
          onUpdate: update,
          onRefresh: update,
          // Pinned phones: touch scrolls natively, and when a swipe ends the
          // page settles on a step's middle: the next one in the swipe's
          // direction once it has gone 30% of the way there, else back. So
          // a swipe that enters the section stops on the first step (from
          // About, the last), and a nudge doesn't skip one.
          snap: phonePinned && pinned ? { snapTo: snapStep(ids.length), duration: { min: 0.2, max: 0.6 }, delay: 0.1, ease: "power1.inOut" } : undefined,
        });
        update(track);
        // Pinned: one wheel gesture per step, each held until its picture has
        // formed, however fast you scroll (lib/stepGate.ts). Wheel only, so
        // on phones it's for narrow desktop windows; touch passes through.
        const ungate = pinned ? gateSteps(track, ids) : undefined;
        // Back to Discover when the layout changes.
        return () => {
          ungate?.();
          showIcon(ids[0]);
        };
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
