import type { SceneValues } from "./sceneState";

export type SceneScroll = { trigger: string; start?: string; endVh?: number; endTrigger?: string; end?: string };

/** An in-between state; `mobile` overrides it on screens ≤ 900px wide. */
export type SceneVia = Partial<SceneValues> & { mobile?: Partial<SceneValues> };

export type SceneKeyframe = SceneValues & {
  /**
   * Optional in-between state(s). With one, it's reached halfway through the
   * transition; with several, they're spread evenly across it.
   */
  via?: SceneVia | SceneVia[];
  /**
   * Run this transition over a custom scroll range instead of "while the
   * section scrolls in". It ends `endVh` screens after the start, or where
   * `end` ("top top" by default) is reached on `endTrigger`.
   */
  scroll?: SceneScroll;
  /** A different scroll range on screens ≤ 900px wide. */
  mobileScroll?: SceneScroll;
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

  // How I work: the particles re-form out of sight, straight into Discover's
  // picture (never the earth), and rise with the section into the right-hand
  // column (desktop) or under the title (phones), then hold there while the
  // stage is pinned, as each step's picture (ScrollFx, lib/stepScenes.ts).
  // Its centre stays a fixed distance below the section's top (half a
  // screen; 57.5% on phones, y -0.15) as the section scrolls in: each third
  // of the transition is a third of a screen, so y moves 0.67 per via. The
  // no-WebGL picture and the phones' globe space in Process.tsx follow the
  // globe's centre and size: if you change x, y or scale here, update
  // --globe-x / --globe-r / --globe-cy on .process (sections.css, mobile.css).
  process: {
    via: [
      { x: 0.64, y: -1.33, scale: 0.75, globeSpin: 3.2, shapeSpin: 0.7, morph: 0, opacity: 0, mobile: { x: 0, y: -1.48, scale: 1.05 } },
      { y: -0.67, globeSpin: 3.6, opacity: 0.9, mobile: { y: -0.82 } },
    ],
    x: 0.64,
    y: 0,
    scale: 0.75,
    globeSpin: 4.35,
    shapeSpin: 0.7,
    morph: 0,
    sink: 0,
    opacity: 1,
    mobile: { x: 0, y: -0.15, scale: 1.05 },
  },

  // About: the globe glides to the centre as it dissolves onto the glowing
  // floor, then the cloud rises into the portrait (your face with the VR
  // headset) in the empty middle column, framed by three cards a side. On
  // phones it sits between the title and the cards; there nothing pins in
  // How I work, so the globe starts to dissolve (and dims) as soon as the
  // steps scroll up over it.
  about: {
    via: { x: 0, y: -0.15, scale: 1, morph: 1, sink: 0.85, opacity: 0.85, mobile: { opacity: 0.4 } },
    mobileScroll: { trigger: "#process", start: "top top", endTrigger: "#about" },
    x: 0,
    y: -0.3,
    scale: 0.72,
    globeSpin: 4.8,
    shapeSpin: 0, // portrait faces the camera as photographed
    morph: 2,
    sink: 0,
    opacity: 1,
    mobile: { y: 0.18, scale: 1 },
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
