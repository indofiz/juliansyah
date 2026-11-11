"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { sceneState, type SceneValues } from "@/lib/sceneState";
import { sceneKeyframes, sectionOrder } from "@/lib/sceneKeyframes";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function values(id: string, mobile: boolean): SceneValues {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { via, scroll, mobile: mobileOverrides, ...rest } = sceneKeyframes[id];
  return mobile ? { ...rest, ...mobileOverrides } : rest;
}

/**
 * Turns the keyframes in sceneKeyframes.ts into scroll-scrubbed timelines.
 *
 * For each pair of neighbouring sections A → B, one timeline blends
 * sceneState from A's values to B's (through any `via` states) while section
 * B scrolls from the bottom of the viewport to the top, or over B's custom
 * `scroll` range. `scrub` ties progress to the scrollbar, so it
 * plays forwards and backwards. Timelines rebuild when crossing 900px.
 */
export function ScrollScenes() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add({ mobile: "(max-width: 900px)", desktop: "(min-width: 901px)" }, (ctx) => {
      const mobile = Boolean(ctx.conditions?.mobile);
      Object.assign(sceneState, values(sectionOrder[0], mobile));

      for (let i = 1; i < sectionOrder.length; i++) {
        const id = sectionOrder[i];
        const kf = sceneKeyframes[id];
        if (!document.getElementById(id)) {
          console.warn(`[ScrollScenes] No element with id="${id}" found on the page.`);
          continue;
        }

        const custom = kf.scroll;
        const scrollTrigger: ScrollTrigger.Vars = custom
          ? {
              trigger: custom.trigger,
              start: custom.start ?? "top top",
              end: () => `+=${window.innerHeight * (custom.endVh ?? 1)}`,
              scrub: 1,
              invalidateOnRefresh: true,
            }
          : { trigger: `#${id}`, start: "top bottom", end: "top top", scrub: 1 };

        // from → via… → to, each via merged on top of the previous state.
        const from = values(sectionOrder[i - 1], mobile);
        const vias = kf.via ? (Array.isArray(kf.via) ? kf.via : [kf.via]) : [];
        const states: SceneValues[] = [from];
        vias.forEach((v) => states.push({ ...states[states.length - 1], ...v }));
        states.push(values(id, mobile));

        const step = 1 / (states.length - 1);
        const ease = states.length > 2 ? "sine.inOut" : "power1.inOut";
        const tl = gsap.timeline({ scrollTrigger });
        tl.fromTo(sceneState, { ...states[0] }, { ...states[1], duration: step, ease, immediateRender: false });
        for (let k = 2; k < states.length; k++) {
          tl.to(sceneState, { ...states[k], duration: step, ease });
        }
      }
    });
  });

  return null;
}
