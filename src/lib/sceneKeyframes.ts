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
/** The portrait scattered into a faded cloud (after about). */
const scattered = { x: 0, y: 0.25, scale: 0.85, globeSpin: 4.8, shapeSpin: 0.3, morph: 1, sink: 0, opacity: 0, mobile: { y: 0.5 } };

export const sceneKeyframes: Record<string, SceneKeyframe> = {
  // Big globe rising from the bottom of the hero, behind the dashboard preview.
  hero: { x: 0, y: -0.8, scale: 1.12, globeSpin: -0.45, shapeSpin: -0.25, morph: 0, sink: 0, opacity: 1, mobile: { y: -0.26 } },

  // Pinned intro: during the first screen of scroll the globe rises from the
  // bottom to the centre while the headline and dashboard part ways, then the
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

  // Design → code is DOM only.
  "design-to-code": hidden,

  // About: a cloud gathers on the glowing floor, then rises into the portrait
  // (your face with the VR headset) in the empty middle column, framed by
  // three cards a side. On phones it sits between the title and the cards.
  about: {
    via: { y: -0.15, scale: 1, morph: 1, sink: 0.85, opacity: 0.85 },
    x: 0,
    y: -0.3,
    scale: 0.72,
    globeSpin: 4.8,
    shapeSpin: 0, // portrait faces the camera as photographed
    morph: 2,
    sink: 0,
    opacity: 1,
    mobile: { y: 0.13, scale: 1 },
  },

  // The portrait breaks apart where it formed and fades as the playground
  // arrives; the quotes stay on a clean background.
  playground: scattered,
  testimonials: scattered,

  // Contact bookends the page: the globe re-forms below the fold and rises
  // behind the frosted contact panel, as it did behind the hero.
  contact: {
    via: { y: -1.3, scale: 1.05, morph: 0.4, opacity: 0.25 },
    x: 0,
    y: -0.78,
    scale: 1.05,
    globeSpin: 5.6,
    shapeSpin: 0,
    morph: 0,
    sink: 0,
    opacity: 1,
    mobile: { y: -0.5, scale: 1 },
  },

  // The globe drifts up and fades as the footer comes in.
  footer: hidden,
};

export const sectionOrder = Object.keys(sceneKeyframes);
