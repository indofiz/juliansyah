import gsap from "gsap";
import { STEP_IDS, type StepId } from "./stepScenes";

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
  /**
   * 0 = the earth, 1 = How I work's step picture (`icons`) where the globe
   * would be. Scrubbed with the other values, so a picture can only show
   * where the keyframes allow it, never over the hero or contact.
   */
  pictures: number;
};

export const sceneState: SceneValues & { intro: number; icons: Record<StepId, number>; iconTarget: StepId | null } = {
  x: 0,
  y: 0,
  scale: 1,
  globeSpin: 0,
  shapeSpin: 0,
  morph: 0,
  sink: 0,
  opacity: 1,
  pictures: 0,
  /** 0 → 1 on page load: particles fly in and assemble the globe. */
  intro: 0,
  /**
   * How I work: which step picture the globe turns into, as shares (0–1, at
   * most 1 in total; the globe gets the rest), times `pictures`. Outside
   * SceneValues, so the scroll scenes never overwrite it; set it with
   * showStepIcon. Discover until the step track says otherwise.
   */
  icons: { discover: 1, design: 0, build: 0, launch: 0 },
  /** The picture `icons` is heading to (null = none, the globe). */
  iconTarget: "discover",
};

/**
 * Picks the step picture, from whatever it shows now (straight from one
 * picture to the next, never through the ones in between), or none with
 * `null`. Whether it shows at all is `pictures`.
 */
export function showStepIcon(id: StepId | null, { instant = false } = {}) {
  sceneState.iconTarget = id;
  const to = Object.fromEntries(STEP_IDS.map((k) => [k, k === id ? 1 : 0]));
  gsap.to(sceneState.icons, { ...to, duration: instant ? 0 : 1.1, ease: "power2.inOut", overwrite: true });
}
