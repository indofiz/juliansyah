"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { sceneState, type SceneValues } from "@/lib/sceneState";
import { sceneKeyframes, sectionOrder } from "@/lib/sceneKeyframes";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * How quickly the scene catches up with the scroll, per second. It's the
 * pull of a ScrollTrigger `scrub: 1` (its expo ease starts at 10·ln 2 ≈ 6.9
 * per second): most of the way in a third of a second, settled within one.
 */
const FOLLOW_RATE = 10 * Math.LN2;

function values(id: string, mobile: boolean): SceneValues {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { via, scroll, mobileScroll, mobile: mobileOverrides, ...rest } = sceneKeyframes[id];
  return mobile ? { ...rest, ...mobileOverrides } : rest;
}

const keys = Object.keys(values(sectionOrder[0], false)) as (keyof SceneValues)[];
const same = (a: SceneValues, b: SceneValues) => keys.every((k) => a[k] === b[k]);

/** The change from one section's values to the next's. */
type Transition = {
  /** The states it blends through: from, vias…, to. */
  states: SceneValues[];
  ease: (t: number) => number;
  /** Only measures the scroll range (it has no animation). */
  trigger: ScrollTrigger;
  /** Reduced motion: straight from the first state to the last at `start`. */
  cut: boolean;
  /** The scroll range it runs over, after overlaps are settled. */
  start: number;
  end: number;
};

/**
 * Turns the keyframes in sceneKeyframes.ts into the scene's scroll
 * choreography, with one writer: nothing else sets these values.
 *
 * For each pair of neighbouring sections A → B, a transition blends A's
 * values into B's (through any `via` states) while section B scrolls from
 * the bottom of the viewport to the top, or over B's custom `scroll` range
 * (`mobileScroll` on phones). Each frame, one "scene scroll" value follows
 * the real scroll with a short lag (as `scrub: 1` did); the scene takes the
 * values of the transition it's in, or of the last one it passed. So a fast
 * fling plays the sections in page order, never two at once.
 *
 * The ranges are settled after every ScrollTrigger refresh: a transition
 * that changes nothing is dropped (two `scattered` sections), two that
 * overlap (a section shorter than the screen) meet in the middle of the
 * overlap, and none ends below the bottom of the page, so the last
 * section's values are reached there. It all rebuilds when crossing 900px.
 *
 * Reduced motion: no blending and no lag. The scene cuts to each section's
 * values when that section's top passes 55% of the screen (and back when
 * scrolling up).
 */
export function ScrollScenes() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add({ mobile: "(max-width: 900px)", desktop: "(min-width: 901px)", reduce: "(prefers-reduced-motion: reduce)" }, (ctx) => {
      const mobile = Boolean(ctx.conditions?.mobile);
      const reduce = Boolean(ctx.conditions?.reduce);
      Object.assign(sceneState, values(sectionOrder[0], mobile));

      const transitions: Transition[] = [];
      for (let i = 1; i < sectionOrder.length; i++) {
        const id = sectionOrder[i];
        const kf = sceneKeyframes[id];
        if (!document.getElementById(id)) {
          console.warn(`[ScrollScenes] No element with id="${id}" found on the page.`);
          continue;
        }

        // from → via… → to, each via merged on top of the previous state
        // (with its own mobile overrides on phones).
        const from = values(sectionOrder[i - 1], mobile);
        const states: SceneValues[] = [from];
        const vias = !reduce && kf.via ? (Array.isArray(kf.via) ? kf.via : [kf.via]) : [];
        vias.forEach(({ mobile: viaMobile, ...v }) => states.push({ ...states[states.length - 1], ...v, ...(mobile ? viaMobile : undefined) }));
        states.push(values(id, mobile));
        if (states.every((s) => same(s, from))) continue;

        const custom = (mobile && kf.mobileScroll) || kf.scroll;
        const range: ScrollTrigger.Vars = reduce
          ? { trigger: `#${id}`, start: "top 55%" }
          : custom
            ? {
                trigger: custom.trigger,
                start: custom.start ?? "top top",
                ...(custom.endTrigger
                  ? { endTrigger: custom.endTrigger, end: custom.end ?? "top top" }
                  : { end: () => `+=${window.innerHeight * (custom.endVh ?? 1)}` }),
                invalidateOnRefresh: true,
              }
            : { trigger: `#${id}`, start: "top bottom", end: "top top" };

        transitions.push({
          states,
          ease: gsap.parseEase(states.length > 2 ? "sine.inOut" : "power1.inOut"),
          trigger: ScrollTrigger.create(range),
          cut: reduce,
          start: 0,
          end: 0,
        });
      }
      if (!transitions.length) return;

      // Settle the ranges in page order (see above). `version` tells the
      // frame loop the ranges moved, so it applies them even when the
      // scroll hasn't.
      let version = 0;
      const settle = () => {
        const max = ScrollTrigger.maxScroll(window);
        let prev: Transition | undefined;
        for (const t of transitions) {
          t.end = Math.min(t.cut ? t.trigger.start : t.trigger.end, max);
          t.start = Math.min(t.trigger.start, t.end);
          if (prev && t.start < prev.end) {
            const middle = Math.max(prev.start, (t.start + prev.end) / 2);
            prev.end = middle;
            t.start = middle;
            t.end = Math.max(t.end, middle);
          }
          prev = t;
        }
        version++;
      };

      const apply = (y: number) => {
        let t = transitions[0];
        for (const next of transitions) if (next.start <= y) t = next;
        const p = y < t.start ? 0 : t.end > t.start ? Math.min(1, (y - t.start) / (t.end - t.start)) : 1;
        const n = t.states.length - 1;
        const k = Math.min(n - 1, Math.floor(p * n));
        const e = t.ease(p * n - k);
        const a = t.states[k];
        const b = t.states[k + 1];
        for (const key of keys) sceneState[key] = a[key] + (b[key] - a[key]) * e;
      };

      // Starts where the page is (a reload mid-page doesn't fly through the
      // sections above it).
      let sceneY = window.scrollY;
      let appliedY = NaN;
      let appliedVersion = -1;
      const tick = (_time: number, deltaMs: number) => {
        const target = window.scrollY;
        if (reduce) sceneY = target;
        else {
          sceneY += (target - sceneY) * (1 - Math.exp((-FOLLOW_RATE * deltaMs) / 1000));
          if (Math.abs(target - sceneY) < 0.5) sceneY = target;
        }
        if (sceneY === appliedY && version === appliedVersion) return;
        appliedY = sceneY;
        appliedVersion = version;
        apply(sceneY);
      };

      settle();
      ScrollTrigger.addEventListener("refresh", settle);
      gsap.ticker.add(tick);
      tick(0, 0);
      return () => {
        ScrollTrigger.removeEventListener("refresh", settle);
        gsap.ticker.remove(tick);
      };
    });
  });

  return null;
}
