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
  // Big globe rising from the bottom of the hero, behind the work reel.
  hero: { x: 0, y: -0.8, scale: 1.12, globeSpin: -0.45, shapeSpin: -0.25, morph: 0, sink: 0, opacity: 1, mobile: { y: -0.26 } },

  // Pinned intro: during the first screen of scroll the globe rises from the
  // bottom to the centre while the headline and work reel part ways, then the
  // proof rows fade in around it.
  proof: {
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

  // The globe dissolves into a loose cloud and fades as the work cards
  // arrive, so the videos sit on a clean background.
  work: { x: 0, y: 0.1, scale: 0.9, globeSpin: 0.4, shapeSpin: 0.15, morph: 1, sink: 0, opacity: 0 },

  // Design → code is DOM only: the particles stay out of the way.
  "design-to-code": hidden,
  services: hidden,
  playground: hidden,

  // The rest of the page is DOM-only; the globe drifts up and fades out.
  assistant: hidden,
  featured: hidden,
  contact: hidden,
  footer: hidden,
};

export const sectionOrder = Object.keys(sceneKeyframes);
