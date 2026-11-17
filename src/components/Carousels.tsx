"use client";

import { useEffect } from "react";

/**
 * Drives the indicators of horizontal swipe carousels (mobile layouts).
 * Markup: a scroller with [data-carousel], followed by a sibling
 * [data-carousel-nav] that is either
 *   .carousel-bar   one <span> thumb: sized to the visible share, moved with scroll
 *   .carousel-dots  one <button> per slide; the current one gets .on
 * Dots are clickable and scroll to their slide. On desktop the scrollers are
 * normal grids and the indicators are hidden by CSS.
 */
export function Carousels() {
  useEffect(() => {
    const cleanups: (() => void)[] = [];
    document.querySelectorAll<HTMLElement>("[data-carousel]").forEach((scroller) => {
      const nav = scroller.nextElementSibling as HTMLElement | null;
      if (!nav?.hasAttribute("data-carousel-nav")) return;
      const dots = Array.from(nav.children) as HTMLElement[];

      const update = () => {
        const max = scroller.scrollWidth - scroller.clientWidth;
        const p = max > 0 ? scroller.scrollLeft / max : 0;
        nav.style.setProperty("--p", p.toFixed(4));
        nav.style.setProperty("--w", (scroller.clientWidth / Math.max(scroller.scrollWidth, 1)).toFixed(4));
        if (nav.classList.contains("carousel-dots")) {
          const i = Math.round(p * (dots.length - 1));
          dots.forEach((d, k) => d.classList.toggle("on", k === i));
        }
      };

      const onDot = (e: Event) => {
        const i = dots.indexOf(e.currentTarget as HTMLElement);
        const target = scroller.querySelectorAll<HTMLElement>("[data-slide]")[i];
        if (target) scroller.scrollTo({ left: target.offsetLeft - (scroller.clientWidth - target.clientWidth) / 2, behavior: "smooth" });
      };
      if (nav.classList.contains("carousel-dots")) dots.forEach((d) => d.addEventListener("click", onDot));

      scroller.addEventListener("scroll", update, { passive: true });
      window.addEventListener("resize", update);
      update();
      cleanups.push(() => {
        scroller.removeEventListener("scroll", update);
        window.removeEventListener("resize", update);
        dots.forEach((d) => d.removeEventListener("click", onDot));
      });
    });
    return () => cleanups.forEach((c) => c());
  }, []);

  return null;
}
