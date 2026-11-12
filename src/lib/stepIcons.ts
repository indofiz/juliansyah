import type { ProcessStep } from "@/content/types";

/**
 * The How I work step pictures, drawn once and used three times:
 *  - the particle globe turns into the lit step's picture (particleShapes.ts
 *    `artShape` draws them on canvases and lays a dot grid over them)
 *  - StepIcon.tsx draws the step's icon (the picture's hero) beside each
 *    step on phones, and the whole picture without WebGL
 *
 * A picture is a few figures placed in a 100 × 125 box (the 1.9 × 2.4 world
 * units the globe's column has room for), each on a depth layer: back cards,
 * a middle layer, the hero in front and small accents in front of that. The
 * particles put each layer at its own depth, so the layers slide against
 * each other as the picture sways, and cut a small gap into the layers
 * behind everything in front, so objects don't merge.
 *
 * A figure is a few SVG paths in its own 100×100 box. A part is filled
 * (holes via the even-odd rule) or, with `stroke`, drawn as a line of that
 * width with round ends. `shade` is its brightness (0–1), or [lit, dark]
 * for light from the top left. Later parts paint over earlier ones.
 *
 * Keep them bold: the hero as big as it can be, the rest dimmer and behind
 * or around it, no detail smaller than ~6% of the box. Particles show big
 * shapes well and fine detail poorly. A path exported from Figma works as a
 * part.
 */

export type StepId = ProcessStep["id"];

/** The order of the pictures in the particle shader (aStep1…aStep4, uStepW). */
export const STEP_IDS = ["discover", "design", "build", "launch"] as const satisfies readonly StepId[];

/**
 * Small loops the shader plays on a part: hover (bobs up and down),
 * twinkle, blink, flicker (a flame: flickers and moves with the hover) and
 * flow (dots stream along the picture's `flow` direction and fade).
 */
export type Motion = "hover" | "twinkle" | "blink" | "flicker" | "flow";
export const MOTION_CODE: Record<Motion, number> = { hover: 1, twinkle: 2, blink: 3, flicker: 4, flow: 5 };

/** Depth layers, back to front. */
export type Layer = "back" | "middle" | "front" | "accent";
export const LAYERS = ["back", "middle", "front", "accent"] as const satisfies readonly Layer[];

export type IconPart = {
  d: string;
  stroke?: number;
  shade?: number | [lit: number, dark: number];
  /** Overrides the placement's layer (a line the pencil just drew). */
  layer?: Layer;
  /** Overrides the placement's motion. */
  motion?: Motion;
};

/** A drawing in its own 100×100 box; `rotate` (degrees) and `scale` turn and size it around the centre. */
export type Figure = { parts: IconPart[]; rotate?: number; scale?: number };

/** A figure in a picture: its box's centre at x, y, `size` units wide, `shade` times as bright. */
export type Placement = { figure: Figure; x: number; y: number; size: number; layer: Layer; motion?: Motion; shade?: number };

export type StepArt = {
  /** The hero: the step's icon, also shown on its own beside the step on phones. */
  icon: Placement;
  /** Everything else. */
  scene: Placement[];
  /** Direction of the "flow" motion, in the box's coordinates (y down). */
  flow?: [number, number];
};

export const ART_W = 100;
export const ART_H = 125;

// ---- Figures ---------------------------------------------------------------

/** Magnifying glass: a thick ring, a handle and a glint on the glass. */
const magnifier: Figure = {
  parts: [
    { d: "M14 40 A26 26 0 1 0 66 40 A26 26 0 1 0 14 40 Z", stroke: 13, shade: [1, 0.75] },
    { d: "M60 60 L86 86", stroke: 15, shade: [0.85, 0.6] },
    { d: "M23.3 37 A17 17 0 0 1 30.3 26.1", stroke: 4.5 },
  ],
};

/** Pencil, drawn upright, turned to write toward the bottom left. Three facets catch the light. */
const pencil: Figure = {
  rotate: 45,
  parts: [
    { d: "M37 14 V4 Q37 -2 43 -2 H57 Q63 -2 63 4 V14 Z", shade: 0.7 }, // eraser
    { d: "M37 19 H45.7 V76 H37 Z", shade: 1 },
    { d: "M45.7 19 H54.3 V76 H45.7 Z", shade: 0.8 },
    { d: "M54.3 19 H63 V76 H54.3 Z", shade: 0.6 },
    { d: "M37 76 H63 L50 102 Z", shade: 0.5 }, // sharpened wood
    { d: "M45.5 93 H54.5 L50 102 Z", shade: 1 }, // lead
  ],
};

/** </> with thick strokes. */
const code: Figure = {
  parts: [
    { d: "M26 27 L6 50 L26 73", stroke: 12, shade: [1, 0.8] },
    { d: "M74 27 L94 50 L74 73", stroke: 12, shade: [1, 0.8] },
    { d: "M57 14 L43 86", stroke: 12, shade: 0.8 },
  ],
};

/** Rocket: one silhouette with a round window, fins and a flame; drawn upright, turned to fly up and right. */
const rocket: Figure = {
  rotate: 45,
  scale: 0.86,
  parts: [
    {
      d: "M50 2 C61 9 66 22 66 38 V70 H34 V38 C34 22 39 9 50 2 Z M58.5 36 A8.5 8.5 0 1 0 41.5 36 A8.5 8.5 0 1 0 58.5 36 Z",
      shade: [1, 0.7],
    },
    { d: "M34 46 L18 62 V80 L34 70 Z", shade: 0.65 },
    { d: "M66 46 L82 62 V80 L66 70 Z", shade: 0.65 },
    { d: "M40 75 H60 C60 86 55 93 50 98 C45 93 40 86 40 75 Z", shade: 1, motion: "flicker" },
  ],
};

/** The written scope: a sheet with a folded corner, a title and lines of text. */
const scope: Figure = {
  parts: [
    { d: "M24 4 H64 L82 22 V90 Q82 96 76 96 H24 Q18 96 18 90 V10 Q18 4 24 4 Z", shade: [0.42, 0.24] },
    { d: "M64 4 V16 Q64 22 70 22 H82 Z", shade: 0.62 },
    { d: "M30 19 H52", stroke: 8, shade: 0.85 },
    { d: "M30 40 H70", stroke: 6.5, shade: 0.62 },
    { d: "M30 53 H66", stroke: 6.5, shade: 0.62 },
    { d: "M30 66 H58", stroke: 6.5, shade: 0.62 },
    { d: "M30 79 H62", stroke: 6.5, shade: 0.62 },
  ],
};

/** A person: a round head over rounded shoulders. */
const user: Figure = {
  parts: [
    { d: "M50 10 A20 20 0 1 0 50 50 A20 20 0 1 0 50 10 Z", shade: [1, 0.75] },
    { d: "M14 92 C14 68 30 58 50 58 C70 58 86 68 86 92 Z", shade: [0.9, 0.6] },
  ],
};

/**
 * A phone with a wireframe on screen: header bar, an image placeholder
 * (mountain and sun cut out), two lines of text and a button the pencil has
 * just drawn (in front of the phone, on the middle layer).
 */
const phone: Figure = {
  parts: [
    { d: "M32 2 H68 Q78 2 78 12 V88 Q78 98 68 98 H32 Q22 98 22 88 V12 Q22 2 32 2 Z", stroke: 5, shade: [0.6, 0.36] },
    { d: "M30 10 H70 V19 H30 Z", shade: 0.6 },
    {
      d: "M30 25 H70 V50 H30 Z M33 47 L44 35 L53 44 L58 39 L67 47 Z M60 29.5 A3.5 3.5 0 1 0 60 36.5 A3.5 3.5 0 1 0 60 29.5 Z",
      shade: [0.5, 0.3],
    },
    { d: "M30 58 H70", stroke: 5, shade: 0.6 },
    { d: "M30 67 H56", stroke: 5, shade: 0.6 },
    { d: "M60 82 A6 6 0 0 1 54 88 H36 A6 6 0 0 1 36 76 H54 A6 6 0 0 1 60 82", stroke: 4.5, shade: 1, layer: "middle" },
  ],
};

/** A painter's palette: paint wells and a thumb notch (the design system's colours). */
const palette: Figure = {
  parts: [
    {
      d:
        "M50 6 C77 6 97 23 97 45 C97 60 87 67 76 64 C67 61 61 67 64 76 C67 86 60 94 47 94 C23 94 3 75 3 50 C3 25 23 6 50 6 Z" +
        " M38.5 31 A9.5 9.5 0 1 0 19.5 31 A9.5 9.5 0 1 0 38.5 31 Z M60.5 24 A9.5 9.5 0 1 0 41.5 24 A9.5 9.5 0 1 0 60.5 24 Z" +
        " M81.5 36 A9.5 9.5 0 1 0 62.5 36 A9.5 9.5 0 1 0 81.5 36 Z M32.5 58 A9.5 9.5 0 1 0 13.5 58 A9.5 9.5 0 1 0 32.5 58 Z",
      shade: [0.95, 0.6],
    },
  ],
};

/** A code editor: title bar with three dots, lines of code, a blinking caret. */
const editor: Figure = {
  parts: [
    { d: "M9 14 H91 Q98 14 98 21 V79 Q98 86 91 86 H9 Q2 86 2 79 V21 Q2 14 9 14 Z", shade: [0.45, 0.24] },
    { d: "M9 14 H91 Q98 14 98 21 V27 H2 V21 Q2 14 9 14 Z", shade: 0.5 },
    {
      d: "M10 20.5 A3 3 0 1 0 16 20.5 A3 3 0 1 0 10 20.5 Z M19 20.5 A3 3 0 1 0 25 20.5 A3 3 0 1 0 19 20.5 Z M28 20.5 A3 3 0 1 0 34 20.5 A3 3 0 1 0 28 20.5 Z",
      shade: 0.9,
    },
    { d: "M12 38 H30", stroke: 5.5, shade: 0.85 },
    { d: "M36 38 H58", stroke: 5.5, shade: 0.55 },
    { d: "M20 50 H44", stroke: 5.5, shade: 0.7 },
    { d: "M50 50 H74", stroke: 5.5, shade: 0.5 },
    { d: "M20 62 H62", stroke: 5.5, shade: 0.55 },
    { d: "M12 74 H34", stroke: 5.5, shade: 0.85 },
    { d: "M40 69 V79", stroke: 4, shade: 1, motion: "blink" },
  ],
};

/** A check in a ring: the test build passed. */
const badge: Figure = {
  parts: [
    { d: "M50 8 A42 42 0 1 0 50 92 A42 42 0 1 0 50 8 Z", stroke: 14, shade: 0.9 },
    { d: "M30 52 L44 65 L70 37", stroke: 15, shade: 1 },
  ],
};

/** A puffy cloud with a flat bottom. */
const cloud: Figure = {
  parts: [{ d: "M12 90 H88 A12 12 0 0 0 86 66 A18 18 0 0 0 58 50 A22 22 0 0 0 20 62 A14 14 0 0 0 12 90 Z", shade: [0.55, 0.3] }],
};

/** The rocket's exhaust: a band widening from the flame down into the clouds (picture coordinates). */
const exhaust: Figure = {
  parts: [{ d: "M38.8 76.8 L33.2 71.2 L5.6 95.6 L18.4 108.4 Z", shade: [0.85, 0.45] }],
};

/** A four-point sparkle (also the stars). */
const sparkle: Figure = {
  parts: [{ d: "M50 0 C53 38 62 47 100 50 C62 53 53 62 50 100 C47 62 38 53 0 50 C38 47 47 38 50 0 Z" }],
};

const star = (x: number, y: number, size: number): Placement => ({ figure: sparkle, x, y, size, layer: "accent", motion: "twinkle" });

// ---- Pictures --------------------------------------------------------------

export const STEP_ART: Record<StepId, StepArt> = {
  // A magnifying glass over the written scope, a user in the lens.
  discover: {
    icon: { figure: magnifier, x: 60, y: 80, size: 84, layer: "front", motion: "hover" },
    scene: [
      { figure: scope, x: 36, y: 44, size: 74, layer: "back" },
      // Inside the lens (ring centre 51.6, 71.6; inner radius 16.4), clear
      // of the ring's gap and the glint.
      { figure: user, x: 51.6, y: 72, size: 25, layer: "middle" },
      star(84, 26, 14),
      star(92, 46, 8),
      star(15, 98, 11),
    ],
  },

  // A pencil that has just drawn a button on a phone's wireframe, and the
  // design system's palette.
  design: {
    // Its tip on the button's right end (46, 90).
    icon: { figure: pencil, x: 70.3, y: 65.7, size: 66, layer: "front", motion: "hover" },
    scene: [
      { figure: phone, x: 36, y: 58, size: 100, layer: "back" },
      { figure: palette, x: 84, y: 107, size: 32, layer: "accent" },
      star(92, 16, 11),
    ],
  },

  // </> in front of a code editor, and a passed test build.
  build: {
    icon: { figure: code, x: 56, y: 90, size: 70, layer: "front", motion: "hover" },
    scene: [
      { figure: editor, x: 46, y: 44, size: 92, layer: "back" },
      { figure: badge, x: 91, y: 11, size: 26, layer: "accent" },
    ],
  },

  // A rocket lifting off: its exhaust streams down into the clouds, stars around.
  launch: {
    icon: { figure: rocket, x: 60, y: 50, size: 86, layer: "front", motion: "hover" },
    scene: [
      { figure: cloud, x: 28, y: 98, size: 60, layer: "back" },
      { figure: cloud, x: 80, y: 112, size: 34, layer: "back", shade: 0.8 },
      { figure: exhaust, x: 50, y: 50, size: 100, layer: "middle", motion: "flow" },
      star(16, 22, 15),
      star(38, 12, 8),
      star(8, 52, 9),
      star(92, 84, 10),
    ],
    flow: [-1, 1],
  },
};

/** All of a picture's placements, back to front. */
export function artPlacements(art: StepArt) {
  return [art.icon, ...art.scene].sort((a, b) => LAYERS.indexOf(a.layer) - LAYERS.indexOf(b.layer));
}

/** A figure's own `rotate` and `scale`, around its box's centre (SVG transform). */
export function figureTransform({ rotate = 0, scale = 1 }: Figure) {
  return rotate || scale !== 1 ? `translate(50 50) rotate(${rotate}) scale(${scale}) translate(-50 -50)` : undefined;
}

/** A placement in the picture, then its figure's own turn and size (SVG transform). */
export function placementTransform({ figure, x, y, size }: Placement) {
  const own = figureTransform(figure);
  return `translate(${x - size / 2} ${y - size / 2}) scale(${size / 100})${own ? ` ${own}` : ""}`;
}

/** A part's brightness as one number (the middle of a gradient). */
export const flatShade = (shade: IconPart["shade"] = 1) => (Array.isArray(shade) ? (shade[0] + shade[1]) / 2 : shade);
