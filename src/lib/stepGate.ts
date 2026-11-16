import type { ScrollTrigger } from "gsap/ScrollTrigger";
import { setScrollGate } from "./scrollGate";
import { sceneState } from "./sceneState";
import type { StepId } from "./stepScenes";

/** Glide from one step to the next, in seconds. */
const GLIDE = 0.5;
/**
 * A new gesture is wheel input after this much rest (ms), or a fresh push
 * during a trackpad's coasting tail: a delta SURGE times the one before
 * (coasting only ever slows down).
 */
const QUIET = 150;
const SURGE = 1.4;
/** The next step can start once the picture is this far formed (sceneState.icons, 0–1): clearly visible, not finished. */
const FORMED = 0.6;
/** Never wait on a picture longer than this (ms) after a glide starts. */
const MAX_WAIT = 3000;

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * How I work on desktop: one wheel gesture, one step. A flick from Work
 * stops at the first step (from About, the last); inside, each gesture
 * glides to the next step, and further wheel input is swallowed until the
 * glide has landed, the step's picture is mostly formed and a new gesture
 * starts (the wheel rested, or a fresh push while a trackpad coasts).
 * Scrolling on past the first or last step leaves normally. Only the wheel
 * is gated: keyboard, scrollbar, links and touch scroll as usual.
 *
 * `track` is the steps' ScrollTrigger: step i is lit over the i-th of
 * `ids.length` equal bands of its range, and its stop is the band's middle.
 * Returns the cleanup that removes the gate.
 */
export function gateSteps(track: ScrollTrigger, ids: StepId[]): () => void {
  let glideEnd = 0; // performance.now() when the current glide lands
  let glideStart = 0;
  let lastWheel = 0;
  let lastDelta = 0;
  let target: StepId | null = null;

  const stops = () => ids.map((_, i) => track.start + ((i + 0.5) / ids.length) * (track.end - track.start));

  setScrollGate((data, lenis) => {
    const { event, deltaY } = data;
    if (event.type !== "wheel" || event.ctrlKey || !deltaY) return true;

    const now = performance.now();
    const size = Math.abs(deltaY);
    const fresh = now - lastWheel > QUIET || size > lastDelta * SURGE;
    lastWheel = now;
    lastDelta = size;

    const s = stops();
    const first = s[0];
    const last = s[s.length - 1];
    const pos = lenis.targetScroll;
    const down = deltaY > 0;
    const inside = pos >= first - 1 && pos <= last + 1;
    const entering = down ? pos < first - 1 && pos + deltaY >= first : pos > last + 1 && pos + deltaY <= last;
    if (!inside && !entering) return true;

    const gliding = now < glideEnd;
    const forming = target !== null && sceneState.icons[target] < FORMED && now - glideStart < MAX_WAIT;
    // Coming in from Work or About carries straight on to the first stop;
    // inside, a new gesture waits for the last one to finish.
    const busy = entering ? gliding : gliding || forming || !fresh;

    let goal: number | undefined;
    if (!busy) {
      goal = entering ? (down ? first : last) : down ? s.find((p) => p > pos + 1) : s.findLast((p) => p < pos - 1);
      // Past the first or last step: leave the section as usual.
      if (goal === undefined) return true;
    }

    if (event.cancelable) event.preventDefault();
    if (goal !== undefined) {
      target = ids[s.indexOf(goal)];
      glideStart = now;
      glideEnd = now + GLIDE * 1000 + 50;
      lenis.scrollTo(goal, { duration: GLIDE, easing: easeInOutCubic, lock: true });
    }
    return false;
  });

  return () => setScrollGate(null);
}
