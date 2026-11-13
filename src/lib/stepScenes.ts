import type { ProcessStep } from "@/content/types";
import {
  box,
  circle2,
  cone,
  cut,
  cylinder,
  ellipsoid,
  extrude,
  gear2,
  hazePoints,
  place,
  placeParts,
  polygon2,
  revolve,
  sampleDots,
  smooth,
  smooth2,
  sphere,
  star2,
  stroke2,
  subtract,
  subtract2,
  torus,
  transformDir,
  transformPoint,
  v3,
  type Fit,
  type Material,
  type Part,
  type Shape,
  type Vec2,
  type Vec3,
} from "./sdf.ts";

/**
 * The How I work step pictures as small 3D scenes: a telescope (Discover),
 * a painter's palette and brush (Design), a code window with </> and a gear
 * (Build) and a rocket lifting off (Launch). Built from round shapes
 * (lib/sdf.ts), so they read as solid objects lit from the top left.
 *
 * The particle globe turns into the lit step's picture (ParticleMorph builds
 * them in a worker, stepArt.worker.ts); make-step-art.mjs renders them as
 * images for phones and for screens without WebGL.
 *
 * Units are world units, about the size they show at (the picture is
 * fitted into PICTURE_BOX, 1.8 × 2.4 globe radii). x right, y up, z toward the
 * camera. A part's `value` is its brightness (0–1); `tint` draws it in the
 * palette's light rim colour; `gloss` gives it a glowing highlight.
 *
 * Keep parts chunky: nothing thinner than ~0.09 across. Particles show big
 * round forms well and fine detail poorly.
 *
 * Node loads this file too (`node --experimental-strip-types`): only
 * relative `.ts` imports and `import type` from aliases.
 */

export type StepId = ProcessStep["id"];

/** The order of the pictures in the particle shader (aStep1…aStep4, uStepW). */
export const STEP_IDS = ["discover", "design", "build", "launch"] as const satisfies readonly StepId[];

/**
 * Small loops the particle shader plays on a part: hover (bobs up and
 * down), twinkle (a star: pulses and floats), dab (moves along `dab`, the
 * brush), flicker (a flame), flow (dots stream along `flow` and fade), spin
 * (turns around `spin`, the gear) and drift (the haze: each speck wanders
 * on its own and glimmers).
 */
export const MOTION = { hover: 1, twinkle: 2, dab: 3, flicker: 4, flow: 5, spin: 6, drift: 7 } as const;

export type StepScene = {
  parts: Part[];
  /** Direction of the "flow" motion (x, y). */
  flow?: Vec2;
  /** Direction of the "dab" motion (x, y). */
  dab?: Vec2;
  /** Axis the "spin" parts turn around. */
  spin?: { pivot: Vec3; axis: Vec3 };
};

const part = (shape: Shape, m: Material): Part => ({ shape, ...m });

/** A puffy five-point star (radius R) at c, tipped by rot. */
const star = (c: Vec3, R: number, rot: Vec3, m: Partial<Material> = {}): Part =>
  part(place(extrude(star2(R, 0.55), R * 0.34, R * 0.32), c, rot), { value: 0.95, tint: true, gloss: 0.5, motion: MOTION.twinkle, ...m });

// ---- Discover: a telescope on a tripod, two stars ----------------------------

function telescope(): StepScene {
  // The tube runs from its back end A (lower left, away from you) to its
  // front end B (upper right, turned toward you so the lens shows).
  const A: Vec3 = [-0.72, -0.08, -0.45];
  const B: Vec3 = [0.42, 0.55, 0.45];
  const d = v3.norm(v3.sub(B, A));
  const along = (p: Vec3, k: number) => v3.add(p, v3.scale(d, k));
  // The mount holds the tube on a pivot that points left and toward you.
  const M = v3.lerp(A, B, 0.6);
  const pivot = v3.norm([-d[2], 0, d[0]]);
  const ringAxis = v3.cross(pivot, [0, 1, 0]);
  const down = (k: number) => v3.add(M, [0, -k, 0]);
  const T = down(0.75); // top of the legs
  const feet: Vec3[] = [v3.add(T, [0.04, -1.0, 0.38]), v3.add(T, [-0.47, -0.88, -0.18]), v3.add(T, [0.52, -0.86, -0.2])];

  const ring = { value: 0.95, tint: true, gloss: 0.6 };
  const mount = { value: 0.88 };
  return {
    parts: [
      part(cylinder(A, B, 0.25, 0.03), { value: 0.62 }),
      // Front ring with the lens set into it.
      part(subtract(cylinder(along(B, -0.14), along(B, 0.1), 0.32, 0.07), cylinder(along(B, -0.02), along(B, 0.3), 0.235)), ring),
      part(cylinder(along(B, -0.1), along(B, 0.0), 0.236, 0.03), { value: 0.36, gloss: 1 }),
      // Back ring and eyepiece.
      part(cylinder(along(A, -0.1), along(A, 0.16), 0.3, 0.07), ring),
      part(cylinder(along(A, -0.24), along(A, -0.06), 0.12, 0.035), { value: 0.7 }),
      // The yoke under the tube, its pivot knobs, the post and the collar.
      part(cut(torus(M, ringAxis, 0.42, 0.085), M, [0, 1, 0]), mount),
      part(cylinder(v3.add(M, v3.scale(pivot, 0.34)), v3.add(M, v3.scale(pivot, 0.52)), 0.125, 0.05), mount),
      part(cylinder(v3.add(M, v3.scale(pivot, -0.34)), v3.add(M, v3.scale(pivot, -0.52)), 0.125, 0.05), mount),
      part(cylinder(down(0.46), down(0.66), 0.08, 0.02), { value: 0.72 }),
      part(cylinder(down(0.62), down(0.79), 0.19, 0.06), mount),
      // Tripod.
      ...feet.map((f) => part(cone(v3.add(T, [0, 0.02, 0]), f, 0.078, 0.064), { value: 0.6 })),
      ...feet.map((f) => part(cylinder(v3.add(f, [0, 0.05, 0]), v3.add(f, [0, -0.04, 0]), 0.09, 0.035), { value: 0.78 })),
      star([-0.55, 0.88, 0.25], 0.21, [-10, -18, 12]),
      star([0.82, -0.08, 0.3], 0.155, [8, 22, -14]),
    ],
  };
}

// ---- Design: a painter's palette and a brush --------------------------------

function paletteAndBrush(): StepScene {
  // The palette in its own plane (face toward +z), then tipped back.
  const outline = subtract2(
    subtract2(
      smooth2(0.35, circle2(0.6, [0, 0]), circle2(0.5, [-0.42, -0.2]), circle2(0.44, [0.42, -0.16]), circle2(0.42, [0.04, 0.36])),
      circle2(0.12, [0.42, 0.26]), // thumb hole
    ),
    circle2(0.22, [0.9, -0.12]), // notch
  );
  const T = 0.075; // half thickness
  const paint = (x: number, y: number, value: number) => part(ellipsoid(0.16, 0.16, 0.075, [x, y, T - 0.01]), { value, tint: true, gloss: 1 });
  const palette = placeParts(
    [
      part(extrude(outline, T, 0.07), { value: 0.55 }),
      paint(-0.06, 0.4, 1),
      paint(-0.52, 0.06, 0.74),
      paint(-0.34, -0.36, 0.84),
      paint(0.18, -0.16, 0.92),
    ],
    [-0.22, -0.28, 0],
    [-36, 8, -10],
  );

  // The brush, in front of the palette's right side, tip down.
  const P1: Vec3 = [0.45, 0.95, 0.3]; // top of the handle
  const P2: Vec3 = [0.7, 0.05, 0.45]; // handle meets the metal band
  const dir = v3.norm(v3.sub(P2, P1));
  const P3 = v3.add(P2, v3.scale(dir, 0.24)); // band meets the bristles
  const tip = v3.add(P3, v3.scale(dir, 0.36));
  return {
    parts: [
      ...palette,
      part(cone(P1, P2, 0.12, 0.1), { value: 0.75, motion: MOTION.dab }),
      part(cylinder(v3.add(P2, v3.scale(dir, -0.02)), P3, 0.124, 0.03), { value: 0.95, tint: true, gloss: 1, motion: MOTION.dab }),
      part(smooth(0.08, sphere(0.12, v3.add(P3, v3.scale(dir, 0.07))), cone(P3, tip, 0.12, 0.035)), { value: 0.32, motion: MOTION.dab }),
      part(sphere(0.06, tip), { value: 0.95, tint: true, gloss: 0.6, motion: MOTION.dab }),
    ],
    dab: [dir[0], dir[1]],
  };
}

// ---- Build: a code window, </> and a gear -----------------------------------

function codeAndGear(): StepScene {
  const tilt: Vec3 = [-6, 10, 0];
  const window = placeParts(
    [
      // The window: a thick rounded slab with a sunken screen under a title bar.
      part(subtract(box(0.8, 0.74, 0.1, 0.09), place(box(0.68, 0.56, 0.1, 0.05), [0, -0.08, 0.15])), { value: 0.4 }),
      part(place(box(0.665, 0.545, 0.012, 0.012), [0, -0.08, 0.06]), { value: 0.22 }),
      ...[-0.6, -0.44, -0.28].map((x) => part(ellipsoid(0.06, 0.06, 0.045, [x, 0.61, 0.09]), { value: 0.95, tint: true, gloss: 0.6 })),
    ],
    [0, 0, 0],
    tilt,
  );
  const r = 0.1;
  const code = placeParts(
    [
      part(extrude(stroke2([[-0.27, 0.28], [-0.53, 0], [-0.27, -0.28]], r), 0.09, 0.085), { value: 0.86, motion: MOTION.hover }),
      part(extrude(stroke2([[0.27, 0.28], [0.53, 0], [0.27, -0.28]], r), 0.09, 0.085), { value: 0.86, motion: MOTION.hover }),
      part(extrude(stroke2([[-0.07, -0.3], [0.07, 0.3]], r), 0.09, 0.085), { value: 1, tint: true, gloss: 0.5, motion: MOTION.hover }),
    ],
    [0.4, 0.1, 0.26],
    tilt,
  );
  const gearPos: Vec3 = [-0.62, -0.56, 0.4];
  const gearRot: Vec3 = [-4, 16, 0];
  const gear = placeParts(
    [
      part(extrude(gear2(0.3, 8, 0.12, 0.078, 0.035), 0.1, 0.075), { value: 0.95, light: 0.5, motion: MOTION.spin }),
      part(ellipsoid(0.15, 0.15, 0.075, [0, 0, 0.1]), { value: 1, tint: true, gloss: 1 }),
    ],
    gearPos,
    gearRot,
  );
  return {
    parts: [...window, ...code, ...gear],
    spin: { pivot: gearPos, axis: transformDir([0, 0, 1], gearRot) },
  };
}

// ---- Launch: a rocket lifting off, its trail in the clouds, stars ------------

function rocket(): StepScene {
  // The rocket upright (axis +y, window toward you), then tipped toward
  // you and turned to fly up and to the right.
  const right: Vec2[] = [[0.16, -0.5], [0.212, -0.3], [0.225, -0.05], [0.225, 0.14]];
  for (let k = 1; k <= 8; k++) {
    const t = k / 8;
    right.push([0.225 * Math.pow(Math.cos((t * Math.PI) / 2), 0.75), 0.14 + t * 0.58]);
  }
  const profile = polygon2([...right, ...right.slice(0, -1).reverse().map(([x, y]): Vec2 => [-x, y])]);
  const body = revolve(profile);
  const fin = extrude(polygon2([[0.14, -0.1], [0.44, -0.42], [0.46, -0.64], [0.14, -0.46]]), 0.032, 0.03);
  const accent = { value: 0.95, tint: true, gloss: 0.7 };
  const local: Part[] = [
    part(cut(body, [0, 0.5, 0], [0, 1, 0]), { value: 0.86, gloss: 0.35, motion: MOTION.hover }),
    part(cut(body, [0, 0.5, 0], [0, -1, 0]), { ...accent, motion: MOTION.hover }),
    part(torus([0, 0.16, 0], [0, 1, 0], 0.226, 0.036), { ...accent, motion: MOTION.hover }),
    part(torus([0, -0.06, 0.212], [0, 0, 1], 0.1, 0.034), { ...accent, motion: MOTION.hover }),
    part(ellipsoid(0.085, 0.085, 0.05, [0, -0.06, 0.205]), { value: 0.38, gloss: 1, motion: MOTION.hover }),
    ...[15, 165, 270].map((a) => part(place(fin, [0, 0, 0], [0, -a, 0]), { value: 0.64, motion: MOTION.hover })),
    part(cone([0, -0.46, 0], [0, -0.6, 0], 0.13, 0.16), { value: 0.5, motion: MOTION.hover }),
    part(smooth(0.07, sphere(0.12, [0, -0.7, 0]), cone([0, -0.7, 0], [0, -1.02, 0], 0.12, 0.025)), { value: 1, tint: true, motion: MOTION.flicker }),
  ];
  const pos: Vec3 = [0.3, 0.38, 0];
  const rot: Vec3 = [15, 0, -45];
  const tail = transformPoint([0, -0.98, 0], pos, rot);
  const cloud = smooth(
    0.14,
    sphere(0.24, [-0.8, -0.84, -0.05]),
    sphere(0.32, [-0.5, -0.72, -0.1]),
    sphere(0.26, [-0.16, -0.84, -0.05]),
    sphere(0.22, [-0.44, -0.96, 0.05]),
  );
  const cloud2 = smooth(0.1, sphere(0.15, [0.42, -1.04, -0.1]), sphere(0.19, [0.62, -0.96, -0.12]), sphere(0.14, [0.8, -1.05, -0.1]));
  const trailEnd: Vec3 = [-0.62, -0.74, -0.05];
  const flow = v3.norm(v3.sub(trailEnd, tail));
  return {
    parts: [
      ...placeParts(local, pos, rot),
      part(cone(tail, trailEnd, 0.055, 0.2), { value: 0.7, light: 0.4, motion: MOTION.flow }),
      part(cut(cloud, [0, -1.08, 0], [0, -1, 0]), { value: 0.48 }),
      part(cut(cloud2, [0, -1.16, 0], [0, -1, 0]), { value: 0.38 }),
      star([-0.65, 0.78, 0.1], 0.16, [-8, -16, 10]),
      star([-0.22, 0.98, 0.05], 0.1, [6, 14, -12]),
      star([-0.82, 0.2, 0.1], 0.105, [10, 18, 20]),
      star([0.82, -0.42, 0.1], 0.115, [-6, -20, -8]),
    ],
    flow: [flow[0], flow[1]],
  };
}

export const STEP_SCENES: Record<StepId, () => StepScene> = {
  discover: telescope,
  design: paletteAndBrush,
  build: codeAndGear,
  launch: rocket,
};

/**
 * The box a picture is fitted into, in world units (globe radii). A little
 * narrower than the globe: it sits in the middle column between the copy
 * and the steps, and the sway and the pointer turn one side toward the
 * camera, which makes it wider. Height has room.
 */
export const PICTURE_BOX = { width: 1.8, height: 2.4 } as const;

/**
 * How deep the dots sit compared with the real shapes (their light always
 * comes from the real shapes). Flatter turns less with the sway, so the
 * pictures keep the look they were drawn with and stay in their column.
 */
const DEPTH = 0.65;

/** A built picture: per particle x, y, z and w = brightness (0–2; 0 = hidden) + 2 × (motion + 16 × tint). */
export type StepTarget = {
  data: Float32Array;
  /** How many particles show a dot. */
  dots: number;
  fit: Fit;
  flow?: Vec2;
  dab?: Vec2;
  /** The spin axis in the fitted picture. */
  spin?: { pivot: Vec3; axis: Vec3 };
};

/** At most this many specks in a picture's haze (at most 12% of the particles, so fewer on phones). */
const HAZE_DOTS = 2200;

/**
 * Builds step `id` as a morph target for `count` particles. The first
 * `usable` make the picture (leftovers park hidden on its dots); the rest,
 * the globe's outer shell, become a meshy haze around it, like the
 * portrait's edges (HAZE_DOTS at most, the others park hidden in it), so the
 * shell only pulls in a little.
 */
export function stepTarget(
  id: StepId,
  count: number,
  { usable = count, spacing = 0.0175, depth = DEPTH }: { usable?: number; spacing?: number; depth?: number } = {},
): StepTarget {
  const scene = STEP_SCENES[id]();
  const { dots, fit } = sampleDots(scene.parts, { ...PICTURE_BOX, spacing, maxDots: usable, depth });
  const data = new Float32Array(count * 4);
  dots.forEach(({ x, y, z, b, part }, i) => {
    const p = scene.parts[part];
    data.set([x, y, z, Math.min(b, 1.98) + 2 * ((p.motion ?? 0) + (p.tint ? 16 : 0))], i * 4);
  });
  for (let i = dots.length; i < usable; i++) {
    const j = Math.floor(Math.random() * dots.length);
    data.set([dots[j].x, dots[j].y, dots[j].z, 0], i * 4);
  }
  const haze = hazePoints(dots, { count: Math.min(HAZE_DOTS, Math.round(count * 0.12), count - usable) });
  for (let i = usable, k = 0; i < count; i++, k++) {
    const shown = k < haze.length;
    const { x, y, z, b } = haze[shown ? k : Math.floor(Math.random() * haze.length)] ?? { x: 0, y: 0, z: 0, b: 0 };
    data.set([x, y, z, (shown ? b : 0) + 2 * MOTION.drift], i * 4);
  }
  const toFit = (p: Vec3): Vec3 => [(p[0] - fit.cx) * fit.s, (p[1] - fit.cy) * fit.s, (p[2] - fit.cz) * fit.s * depth];
  return {
    data,
    dots: dots.length,
    fit,
    flow: scene.flow,
    dab: scene.dab,
    spin: scene.spin && { pivot: toFit(scene.spin.pivot), axis: scene.spin.axis },
  };
}

