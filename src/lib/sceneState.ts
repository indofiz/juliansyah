import gsap from "gsap";
import { STEP_IDS, type StepId } from "./stepIcons";

/**
 * One plain object shared by the DOM (GSAP ScrollTrigger writes to it) and
 * the WebGL scene (useFrame reads from it every frame). Keeping it outside
 * React state means scrolling never triggers a React re-render.
 */
export type SceneValues = {
  /** Horizontal offset as a fraction of half the viewport width (-1 … 1). */
  x: number;
  /** Vertical offset as a fraction of half the viewport height (-1 … 1). */
  y: number;
  /** Overall scale of the particle object. */
  scale: number;
  /** Globe rotation around Y, in radians. Increase it to spin westward. */
  globeSpin: number;
  /** Rotation of the morph-target shape around Y, in radians. */
  shapeSpin: number;
  /** 0 = globe, 1 = scattered cloud, 2 = shape (model). */
  morph: number;
  /** 0 = floating, 1 = particles collapsed onto a glowing floor. */
  sink: number;
  /** Global particle opacity. */
  opacity: number;
};

export const sceneState: SceneValues & { intro: number; icons: Record<StepId, number> } = {
  x: 0,
  y: 0,
  scale: 1,
  globeSpin: 0,
  shapeSpin: 0,
  morph: 0,
  sink: 0,
  opacity: 1,
  /** 0 → 1 on page load: particles fly in and assemble the globe. */
  intro: 0,
  /**
   * How I work: how much of each step's icon the globe shows (0–1, at most
   * 1 in total; the globe gets the rest). Outside SceneValues, so the scroll
   * scenes never overwrite it; set it with showStepIcon.
   */
  icons: { discover: 0, design: 0, build: 0, launch: 0 },
};

/**
 * Turns the globe into a step's icon, from whatever it shows now (straight
 * from one icon to the next, never through the ones in between), or back
 * into the globe with `null`.
 */
export function showStepIcon(id: StepId | null, { instant = false } = {}) {
  const to = Object.fromEntries(STEP_IDS.map((k) => [k, k === id ? 1 : 0]));
  gsap.to(sceneState.icons, { ...to, duration: instant ? 0 : 1.1, ease: "power2.inOut", overwrite: true });
}
