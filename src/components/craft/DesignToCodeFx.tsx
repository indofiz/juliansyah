"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Scrubs the design → code sequence. The track is tall and its stage is
 * sticky (CSS), so this only maps scroll progress to:
 *  - a crossfade between the five stage layers (hold, fade, hold, …)
 *  - the code lines appearing one by one during the code stage
 *  - the rail: fill height and the active step
 * The running card is `inert` until its stage is on screen, so keyboard
 * focus never lands on an invisible button. With reduced motion this does
 * nothing: the CSS lays the stages out as a static row.
 */
export function DesignToCodeFx() {
  useGSAP(() => {
    const section = document.getElementById("design-to-code");
    if (!section) return;
    const track = section.querySelector<HTMLElement>(".d2c-track");
    const rail = section.querySelector<HTMLElement>(".d2c-rail");
    const layers = gsap.utils.toArray<HTMLElement>(".d2c-layer", section);
    const steps = gsap.utils.toArray<HTMLElement>(".d2c-step", section);
    const codeLines = gsap.utils.toArray<HTMLElement>(".code-line", section);
    const running = section.querySelector<HTMLElement>('[data-stage="running"]');
    if (!track || layers.length < 2) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      running?.setAttribute("inert", "");
      let current = 0;
      const setActive = (i: number) => {
        if (i === current) return;
        current = i;
        layers.forEach((l, k) => l.classList.toggle("is-on", k === i));
        steps.forEach((s, k) => s.classList.toggle("is-on", k === i));
        running?.toggleAttribute("inert", layers[i] !== running);
      };

      // Runs as the scrubbed timeline advances (after smoothing), so the
      // rail and the active step always match what's on screen.
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        onUpdate: () => {
          rail?.style.setProperty("--p", tl.progress().toFixed(4));
          const t = tl.time();
          let i = 0;
          for (let k = 1; k < layers.length; k++) if (t >= tl.labels[`s${k}`] + 0.25) i = k;
          setActive(i);
        },
      });
      tl.to({}, { duration: 0.6 }); // hold on the sketch
      for (let i = 1; i < layers.length; i++) {
        const at = `s${i}`;
        tl.addLabel(at)
          .to(layers[i - 1], { opacity: 0, y: -18, scale: 0.98, duration: 0.5 }, at)
          .fromTo(layers[i], { opacity: 0, y: 18, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.5 }, at);
        if (layers[i].dataset.stage === "code" && codeLines.length) {
          tl.fromTo(codeLines, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.25, stagger: 0.035, ease: "power1.out" }, `${at}+=0.3`);
        }
        tl.to({}, { duration: 1 }); // hold
      }

      ScrollTrigger.create({ trigger: track, start: "top top", end: "bottom bottom", scrub: 0.6, animation: tl });

      return () => running?.removeAttribute("inert");
    });
  });

  return null;
}
