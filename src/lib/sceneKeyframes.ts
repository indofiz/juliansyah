import type { SceneValues } from "./sceneState";

export type SceneKeyframe = SceneValues & {
  /**
   * Optional in-between state(s). With one, it's reached halfway through the
   * transition; with several, they're spread evenly across it.
   */
  via?: Partial<SceneValues> | Partial<SceneValues>[];
  /**
   * Run this transition over a custom scroll range instead of "while the
   * section scrolls in". `endVh` is the length in screens.
   */
  scroll?: { trigger: string; start?: string; endVh?: number };
  /** Overrides used on screens ≤ 900px wide, where the layout stacks. */
  mobile?: Partial<SceneValues>;
};

/**
 * The whole scroll choreography lives here.
 *
 * Each key is the `id` of a <section> on the page, in scroll order. The values
 * are what the particles look like once that section reaches the top of the
 * viewport; between sections the values blend as you scroll.
 *
 * Note: the hero glass bars (.hero-bars in sections.css) are positioned to
 * match the hero values below. If you move the hero globe, update --cy / --r.
 */
const hidden = { x: 0, y: 0.6, scale: 0.7, globeSpin: 4.8, shapeSpin: 0.6, morph: 0, sink: 0, opacity: 0 };

export const sceneKeyframes: Record<string, SceneKeyframe> = {
  // Big globe rising from the bottom of the hero, behind the dashboard frame.
  hero: { x: 0, y: -0.8, scale: 1.12, globeSpin: -0.45, shapeSpin: -0.25, morph: 0, sink: 0, opacity: 1, mobile: { y: -0.26 } },

  // Pinned intro (desktop): during the first screen of scroll the globe rises
  // from the bottom to the centre while the headline and dashboard part ways.
  about: {
    scroll: { trigger: "#hero", start: "top top", endVh: 1 },
    x: 0,
    y: 0,
    scale: 0.95,
    globeSpin: 0.15,
    shapeSpin: -0.25,
    morph: 0,
    sink: 0,
    opacity: 1,
    mobile: { y: -0.1, scale: 1 },
  },

  // As the intro releases: the globe swells and drops, dissolves onto the
  // glowing floor, then the cloud rises into the shape.
  services: {
    via: [
      { y: -0.35, scale: 1.25, globeSpin: 0.5 },
      { y: -0.05, scale: 1, morph: 1, sink: 0.85 },
    ],
    x: 0,
    y: -0.26,
    scale: 0.72,
    globeSpin: 0.4,
    shapeSpin: 0, // portrait faces the camera as photographed
    morph: 2,
    sink: 0,
    opacity: 1,
    mobile: { scale: 1, y: 0.3 },
  },

  // Shape breaks apart and fades while the table scrolls in.
  work: { x: 0, y: 0.1, scale: 0.9, globeSpin: 0.4, shapeSpin: 0.15, morph: 1, sink: 0, opacity: 0 },

  // Invisible: quietly re-forms as a globe below the fold.
  pricing: { x: 0, y: -1.3, scale: 0.95, globeSpin: 3.2, shapeSpin: 0.7, morph: 0, sink: 0, opacity: 0 },

  // Globe peeks out under the estimator panel...
  estimator: { x: 0, y: -1.15, scale: 0.95, globeSpin: 3.6, shapeSpin: 0.7, morph: 0, sink: 0, opacity: 0.9 },

  // ...and rises into the centre of the steps section.
  process: { x: 0, y: 0.02, scale: 0.86, globeSpin: 4.35, shapeSpin: 0.7, morph: 0, sink: 0, opacity: 1, mobile: { y: 0.12, scale: 0.95 } },

  // The rest of the page is DOM-only; the globe drifts up and fades out.
  spotlight: hidden,
  assistant: hidden,
  featured: hidden,
  capabilities: hidden,
  portal: hidden,
  cta: hidden,
  footer: hidden,
};

export const sectionOrder = Object.keys(sceneKeyframes);
