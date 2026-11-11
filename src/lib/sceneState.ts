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

export const sceneState: SceneValues & { intro: number } = {
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
};
