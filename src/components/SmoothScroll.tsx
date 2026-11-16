"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { runScrollGate, setLenis } from "@/lib/scrollGate";

/**
 * Lenis gives the buttery inertial scroll; GSAP's ticker drives it so Lenis
 * and ScrollTrigger always agree on the scroll position.
 */
export function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // virtualScroll lets a section gate the wheel (lib/scrollGate.ts; How I
    // work's one-step-per-gesture on desktop). No gate: scrolls as usual.
    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, virtualScroll: runScrollGate });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
