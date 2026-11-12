import type { ProcessStep } from "@/content/types";

/**
 * The How I work step icons, drawn once and used twice:
 *  - the particle globe turns into the lit step's icon (particleShapes.ts
 *    `iconShape` draws the paths on a canvas and lays a dot grid over them)
 *  - StepIcon.tsx draws the same paths as SVG (phones, and without WebGL)
 *
 * Each icon is a few SVG paths in a 100×100 box. A part is filled (holes via
 * the even-odd rule) or, with `stroke`, drawn as a line of that width with
 * round ends. `shade` (0–1) is its brightness: later parts paint over
 * earlier ones. `rotate` (degrees, clockwise) and `scale` turn and size the
 * whole icon around the box's centre; the result has to stay inside the box.
 *
 * Keep them bold: one silhouette, no line thinner than ~12% of the icon's
 * height, no small parts. Particles show big shapes well and fine detail
 * poorly. A path exported from Figma (100×100 frame) works as a part.
 */

export type IconPart = { d: string; shade?: number; stroke?: number };
export type IconDef = { parts: IconPart[]; rotate?: number; scale?: number };
export type StepId = ProcessStep["id"];

/** The order of the icons in the particle shader (aStep1…aStep4, uStepW). */
export const STEP_IDS = ["discover", "design", "build", "launch"] as const satisfies readonly StepId[];

export const STEP_ICONS: Record<StepId, IconDef> = {
  // Magnifying glass: a thick ring and a handle.
  discover: {
    parts: [
      { d: "M14 40 A26 26 0 1 0 66 40 A26 26 0 1 0 14 40 Z", stroke: 13 },
      { d: "M60 60 L86 86", stroke: 15, shade: 0.8 },
    ],
  },

  // Pencil, drawn upright (eraser on top, tip at the bottom), then turned so
  // it writes toward the bottom left. Three facets catch the top-left light.
  design: {
    rotate: 45,
    parts: [
      { d: "M37 14 V4 Q37 -2 43 -2 H57 Q63 -2 63 4 V14 Z", shade: 0.7 }, // eraser
      { d: "M37 19 H45.7 V76 H37 Z", shade: 1 }, // facets, lit to shaded
      { d: "M45.7 19 H54.3 V76 H45.7 Z", shade: 0.8 },
      { d: "M54.3 19 H63 V76 H54.3 Z", shade: 0.6 },
      { d: "M37 76 H63 L50 102 Z", shade: 0.5 }, // sharpened wood
      { d: "M45.5 93 H54.5 L50 102 Z", shade: 1 }, // lead
    ],
  },

  // </> with thick strokes.
  build: {
    parts: [
      { d: "M26 27 L6 50 L26 73", stroke: 12 },
      { d: "M74 27 L94 50 L74 73", stroke: 12 },
      { d: "M57 14 L43 86", stroke: 12, shade: 0.8 },
    ],
  },

  // Rocket as one flat silhouette (round window as a hole), fins and a
  // flame, drawn pointing up, then turned to fly toward the top right.
  launch: {
    rotate: 45,
    scale: 0.86,
    parts: [
      {
        d: "M50 2 C61 9 66 22 66 38 V70 H34 V38 C34 22 39 9 50 2 Z M58.5 36 A8.5 8.5 0 1 0 41.5 36 A8.5 8.5 0 1 0 58.5 36 Z",
        shade: 0.9,
      },
      { d: "M34 46 L18 62 V80 L34 70 Z", shade: 0.65 },
      { d: "M66 46 L82 62 V80 L66 70 Z", shade: 0.65 },
      { d: "M40 75 H60 C60 86 55 93 50 98 C45 93 40 86 40 75 Z", shade: 1 },
    ],
  },
};

/** The SVG/canvas transform for an icon's `rotate` and `scale`, around the box's centre. */
export function iconTransform({ rotate = 0, scale = 1 }: IconDef) {
  return rotate || scale !== 1 ? `translate(50 50) rotate(${rotate}) scale(${scale}) translate(-50 -50)` : undefined;
}
