import type Lenis from "lenis";
import type { VirtualScrollData } from "lenis";

/**
 * A gate sees each wheel or touch event before Lenis scrolls the page. It
 * returns false to keep Lenis from scrolling; then, if the browser shouldn't
 * scroll natively either, it calls `data.event.preventDefault()` itself
 * (Lenis doesn't when its `virtualScroll` option returns false).
 */
export type ScrollGate = (data: VirtualScrollData, lenis: Lenis) => boolean;

let lenis: Lenis | null = null;
let gate: ScrollGate | null = null;

/** SmoothScroll registers its Lenis here (null when it's destroyed). */
export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

/** One gate at a time; pass null to remove it. */
export function setScrollGate(next: ScrollGate | null) {
  gate = next;
}

/** Lenis's `virtualScroll` option: no gate (or no Lenis) means scroll as usual. */
export function runScrollGate(data: VirtualScrollData): boolean {
  return gate && lenis ? gate(data, lenis) : true;
}
