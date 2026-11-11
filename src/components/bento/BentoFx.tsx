"use client";

import { useEffect } from "react";

/**
 * Bento card behaviour:
 *  - scales each illustration stage to fit its card (--fit)
 *  - mouse: spotlight position (--mx/--my) and tilt (--px/--py, -1…1)
 *  - touch screens (no hover): a card plays its animation while it's mostly
 *    in view (.is-active), e.g. when centred in the mobile carousel
 */
export function BentoFx() {
  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>(".bento-card"));
    if (!cards.length) return;

    const fit = () => {
      for (const card of cards) {
        const art = card.querySelector<HTMLElement>(".bento-art");
        const stage = card.querySelector<HTMLElement>(".stage-fit");
        if (!art || !stage || !stage.offsetWidth) continue;
        const s = Math.min(1, art.clientWidth / stage.offsetWidth, art.clientHeight / stage.offsetHeight);
        stage.style.setProperty("--fit", Math.max(0.3, s).toFixed(3));
      }
    };
    const ro = new ResizeObserver(fit);
    cards.forEach((c) => {
      const art = c.querySelector(".bento-art");
      if (art) ro.observe(art);
    });
    fit();
    document.fonts?.ready.then(fit);

    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const cleanups: (() => void)[] = [() => ro.disconnect()];

    if (canHover) {
      const onMove = (e: PointerEvent) => {
        const el = e.currentTarget as HTMLElement;
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        el.style.setProperty("--mx", `${x}px`);
        el.style.setProperty("--my", `${y}px`);
        el.style.setProperty("--px", ((x / r.width) * 2 - 1).toFixed(3));
        el.style.setProperty("--py", ((y / r.height) * 2 - 1).toFixed(3));
      };
      const onLeave = (e: PointerEvent) => {
        const el = e.currentTarget as HTMLElement;
        el.style.setProperty("--px", "0");
        el.style.setProperty("--py", "0");
      };
      cards.forEach((c) => {
        c.addEventListener("pointermove", onMove);
        c.addEventListener("pointerleave", onLeave);
      });
      cleanups.push(() =>
        cards.forEach((c) => {
          c.removeEventListener("pointermove", onMove);
          c.removeEventListener("pointerleave", onLeave);
        }),
      );
    } else {
      const io = new IntersectionObserver(
        (entries) => entries.forEach((en) => en.target.classList.toggle("is-active", en.intersectionRatio >= 0.7)),
        { threshold: [0, 0.4, 0.7, 0.9, 1] },
      );
      cards.forEach((c) => io.observe(c));
      cleanups.push(() => io.disconnect());
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
