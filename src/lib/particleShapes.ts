import * as THREE from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { ART_H, ART_W, artPlacements, LAYERS, MOTION_CODE, type Layer, type StepArt } from "./stepIcons";

/**
 * Every shape returns a Float32Array of `count * 3` positions. All shapes use
 * the same particle count so particle #i in the globe can fly to particle #i
 * in the shape. That one-to-one mapping is what makes the morph work.
 */

export type LandMask = { data: Uint8ClampedArray; width: number; height: number };

/** Particle roles inside the globe: affects size and brightness in the shader. */
export const KIND_LAND = 0;
export const KIND_HALO = 1;
export const KIND_OCEAN = 2;

/** Base radius of the dancing outer shell (globe radius = 1). Keep in sync with uShellRadius. */
export const SHELL_RADIUS = 1.36;

export async function loadLandMask(url: string): Promise<LandMask> {
  const img = new Image();
  img.src = url;
  await img.decode();
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0);
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return { data, width: canvas.width, height: canvas.height };
}

function isLand(mask: LandMask, lon: number, lat: number) {
  const u = (lon + Math.PI) / (2 * Math.PI);
  const v = (Math.PI / 2 - lat) / Math.PI;
  const x = Math.min(mask.width - 1, Math.max(0, Math.floor(u * mask.width)));
  const y = Math.min(mask.height - 1, Math.max(0, Math.floor(v * mask.height)));
  return mask.data[(y * mask.width + x) * 4] > 127;
}

/** lon/lat (radians) → point on a sphere. Longitude 0 faces the camera (+Z). */
function toSphere(lon: number, lat: number, r: number, out: number[], i: number) {
  const c = Math.cos(lat);
  out[i * 3] = r * c * Math.sin(lon);
  out[i * 3 + 1] = r * Math.sin(lat);
  out[i * 3 + 2] = r * c * Math.cos(lon);
}

function randomDirection() {
  const lon = Math.random() * Math.PI * 2 - Math.PI;
  const lat = Math.asin(Math.random() * 2 - 1);
  return { lon, lat };
}

/**
 * Dotted earth: evenly spaced dots on the continents (Fibonacci lattice so it
 * looks like a clean dot-grid, not random clumps), sparse dots on the oceans
 * and an outer shell of particles. The shell's final radius is computed in the
 * vertex shader every frame (animated noise), so here we only store each shell
 * particle's direction at the base radius.
 */
export function buildGlobe(count: number, mask: LandMask) {
  const positions = new Array<number>(count * 3);
  const kinds = new Float32Array(count);

  const landCount = Math.round(count * 0.64);
  const oceanCount = Math.round(count * 0.08);
  const haloCount = count - landCount - oceanCount;

  // Estimate how much of the sphere is land so the lattice has the right density.
  let hits = 0;
  const probes = 4000;
  for (let i = 0; i < probes; i++) {
    const { lon, lat } = randomDirection();
    if (isLand(mask, lon, lat)) hits++;
  }
  const landFraction = Math.max(0.05, hits / probes);
  const latticeSize = Math.round(landCount / landFraction);

  const golden = Math.PI * (3 - Math.sqrt(5));
  const land: [number, number][] = [];
  for (let i = 0; i < latticeSize; i++) {
    const y = 1 - ((i + 0.5) / latticeSize) * 2;
    const lat = Math.asin(y);
    let lon = (i * golden) % (Math.PI * 2);
    if (lon > Math.PI) lon -= Math.PI * 2;
    if (isLand(mask, lon, lat)) land.push([lon, lat]);
  }
  // Top up or trim so we have exactly landCount land dots.
  while (land.length < landCount) {
    const { lon, lat } = randomDirection();
    if (isLand(mask, lon, lat)) land.push([lon, lat]);
  }
  for (let i = land.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [land[i], land[j]] = [land[j], land[i]];
  }

  let p = 0;
  for (let i = 0; i < landCount; i++, p++) {
    const [lon, lat] = land[i];
    toSphere(lon, lat, 1 + (Math.random() - 0.5) * 0.006, positions, p);
    kinds[p] = KIND_LAND;
  }
  for (let i = 0; i < oceanCount; i++, p++) {
    let d = randomDirection();
    while (isLand(mask, d.lon, d.lat)) d = randomDirection();
    toSphere(d.lon, d.lat, 1, positions, p);
    kinds[p] = KIND_OCEAN;
  }
  for (let i = 0; i < haloCount; i++, p++) {
    const d = randomDirection();
    toSphere(d.lon, d.lat, SHELL_RADIUS, positions, p);
    kinds[p] = KIND_HALO;
  }

  return { positions: new Float32Array(positions), kinds };
}

/** A loose cloud the globe dissolves into before re-forming. */
export function buildScatter(count: number) {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const { lon, lat } = randomDirection();
    const r = 0.6 + Math.cbrt(Math.random()) * 1.7;
    const c = Math.cos(lat);
    out[i * 3] = r * c * Math.sin(lon) * 1.25;
    out[i * 3 + 1] = r * Math.sin(lat) * 0.8 + 0.15;
    out[i * 3 + 2] = r * c * Math.cos(lon);
  }
  return out;
}

/**
 * Samples `count` points evenly over the surface of any geometry, centred and
 * scaled to fit roughly inside the globe's footprint.
 */
/** A morph target: one position per particle plus a 0–1 brightness. */
export type ShapeData = { positions: Float32Array; shade: Float32Array; minY: number; maxY: number };

function yRange(positions: Float32Array) {
  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 1; i < positions.length; i += 3) {
    minY = Math.min(minY, positions[i]);
    maxY = Math.max(maxY, positions[i]);
  }
  return { minY, maxY };
}

/** Turns sampled mesh points into ShapeData; brightness falls off toward the back. */
export function geometryShape(geometry: THREE.BufferGeometry, count: number, size = 2.3): ShapeData {
  const positions = sampleGeometry(geometry, count, size);
  const shade = new Float32Array(count);
  for (let i = 0; i < count; i++) shade[i] = THREE.MathUtils.smoothstep(positions[i * 3 + 2], -1.1, 1.1) * 0.75 + 0.25;
  return { positions, shade, ...yRange(positions) };
}

/**
 * An even, staggered (hexagonal) dot grid over a W × H area with spacing
 * `g`: the halftone look of the portrait and the step icons. `keep` gives
 * each dot a 0–1 weight; dots at 0 are left out.
 */
function hexGrid(W: number, H: number, g: number, keep: (x: number, y: number) => number) {
  const pts: [number, number, number][] = [];
  const rowH = g * 0.866;
  for (let r = 0, y = rowH / 2; y < H; r++, y += rowH) {
    for (let x = r % 2 ? g : g / 2; x < W; x += g) {
      const k = keep(x, y);
      if (k > 0) pts.push([x, y, k]);
    }
  }
  return pts;
}

/** Depth of each layer's front face and the thickness of its slab, in world units. */
const LAYER_DEPTH: Record<Layer, { z: number; wall: number }> = {
  back: { z: -0.35, wall: 0.06 },
  middle: { z: -0.05, wall: 0.06 },
  front: { z: 0.22, wall: 0.22 },
  accent: { z: 0.3, wall: 0 },
};

/**
 * A How I work step picture (lib/stepIcons.ts) as a morph target: 4 floats
 * per particle, its position (x, y, z) and w = brightness + 2 × motion
 * (MOTION_CODE; brightness 0 = hidden).
 *
 * Each depth layer is drawn on its own canvas, and every part in front is
 * cut out of the layers behind it with a `gap` (picture units) around it.
 * The portrait's halftone dot grid is laid over each layer at the same dot
 * spacing (`spacing`, world units), so the pictures are as bright as the
 * portrait. Each layer sits at its own depth with its outline repeated
 * behind it as a slab wall (dimmer: `wall`). The picture is centred and
 * fits inside `width` × `height` world units.
 *
 * Only the first `usable` particles are used; the rest are the globe's
 * outer shell, which the shader keeps around the picture. Leftovers among
 * the usable ones park hidden on the picture's dots, a few as faint dust.
 */
export function artShape(
  art: StepArt,
  count: number,
  {
    usable = count,
    // A little under the globe's diameter: at 16:10 and narrower there's
    // ~1.18 globe radii between its centre and the screen's right edge, and
    // when the sway and the mouse turn the right side toward the camera,
    // perspective makes it ~10% wider there.
    width = 1.9,
    height = 2.4,
    spacing = 0.021,
    wall = 0.14,
    gap = 2.5,
  }: { usable?: number; width?: number; height?: number; spacing?: number; wall?: number; gap?: number } = {},
): Float32Array {
  // Canvas pixels per picture unit, and room around the box for figures
  // that reach past it.
  const PX = 4.4;
  const MARGIN = 8;
  const W = Math.ceil((ART_W + 2 * MARGIN) * PX);
  const H = Math.ceil((ART_H + 2 * MARGIN) * PX);
  const toCanvas = new DOMMatrix([PX, 0, 0, PX, MARGIN * PX, MARGIN * PX]);
  const newCtx = () => {
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    return ctx;
  };

  // Every part with its layer, motion and transform (figure box → picture),
  // and how many picture units one figure unit is.
  const parts = artPlacements(art).flatMap((p) => {
    const { rotate = 0, scale = 1 } = p.figure;
    const m = new DOMMatrix()
      .translate(p.x - p.size / 2, p.y - p.size / 2)
      .scale(p.size / 100)
      .translate(50, 50)
      .rotate(rotate)
      .scale(scale)
      .translate(-50, -50);
    const unit = (p.size / 100) * scale;
    return p.figure.parts.map((part) => {
      const motion = part.motion ?? p.motion;
      return { part, p, m, unit, layer: part.layer ?? p.layer, code: motion ? MOTION_CODE[motion] : 0 };
    });
  });
  type Part = (typeof parts)[number];
  const shape = (ctx: CanvasRenderingContext2D, { part, m }: Part, extra = 0) => {
    ctx.setTransform(toCanvas.multiply(m));
    const path = new Path2D(part.d);
    if (!part.stroke) ctx.fill(path, "evenodd");
    if (part.stroke || extra) {
      ctx.lineWidth = (part.stroke ?? 0) + extra;
      ctx.stroke(path);
    }
  };

  // Paint each layer (red = brightness, alpha = inside), with a mask per
  // motion so a part's motion doesn't bleed into its neighbours' edges.
  // Later parts paint over earlier ones, in the masks too.
  const layers = LAYERS.map(() => ({ ctx: newCtx(), masks: new Map<number, CanvasRenderingContext2D>() }));
  for (const item of parts) {
    const { part, p, m, layer, code } = item;
    const { ctx, masks } = layers[LAYERS.indexOf(layer)];
    const k = p.shade ?? 1;
    const color = (v: number) => {
      const c = Math.round(Math.min(1, v * k) * 255);
      return `rgb(${c} ${c} ${c})`;
    };
    if (Array.isArray(part.shade)) {
      // Light from the top left of the figure's box, in picture space.
      const inv = m.inverse();
      const a = inv.transformPoint(new DOMPoint(p.x - p.size / 2, p.y - p.size / 2));
      const b = inv.transformPoint(new DOMPoint(p.x + p.size / 2, p.y + p.size / 2));
      const g = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
      g.addColorStop(0, color(part.shade[0]));
      g.addColorStop(1, color(part.shade[1]));
      ctx.fillStyle = ctx.strokeStyle = g;
    } else ctx.fillStyle = ctx.strokeStyle = color(part.shade ?? 1);
    shape(ctx, item);

    for (const [c, mask] of masks) {
      if (c === code) continue;
      mask.globalCompositeOperation = "destination-out";
      shape(mask, item);
      mask.globalCompositeOperation = "source-over";
    }
    if (code) {
      if (!masks.has(code)) masks.set(code, newCtx());
      shape(masks.get(code)!, item);
    }
  }

  // Cut everything in front out of the layers behind it, with a gap around it.
  for (const item of parts) {
    for (let i = 0; i < LAYERS.indexOf(item.layer); i++) {
      const { ctx } = layers[i];
      ctx.globalCompositeOperation = "destination-out";
      shape(ctx, item, (2 * gap) / item.unit);
      ctx.globalCompositeOperation = "source-over";
    }
  }

  const images = layers.map(({ ctx, masks }) => ({
    data: ctx.getImageData(0, 0, W, H).data,
    masks: [...masks].map(([code, mask]) => ({ code, data: mask.getImageData(0, 0, W, H).data })),
  }));
  const at = (x: number, y: number) => (Math.floor(y) * W + Math.floor(x)) * 4;
  const inside = (data: Uint8ClampedArray, x: number, y: number) => x >= 0 && y >= 0 && x < W && y < H && data[at(x, y) + 3] > 127;

  let minX = W, maxX = 0, minY = H, maxY = 0;
  for (const { data } of images) {
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        if (data[(y * W + x) * 4 + 3] <= 127) continue;
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }
  }
  const s = Math.min(width / (maxX - minX + 1), height / (maxY - minY + 1)); // world units per pixel
  const cx = (minX + maxX + 1) / 2;
  const cy = (minY + maxY + 1) / 2;

  // Each layer's dots, and those on its outline (a neighbour on the grid is outside).
  const build = (g: number) => {
    const h = g * 0.866;
    return images.map(({ data }) => {
      const face = hexGrid(W, H, g, (x, y) => (inside(data, x, y) ? 1 : 0));
      const edge = face.filter(
        ([x, y]) =>
          !inside(data, x + g, y) ||
          !inside(data, x - g, y) ||
          !inside(data, x + g / 2, y + h) ||
          !inside(data, x - g / 2, y + h) ||
          !inside(data, x + g / 2, y - h) ||
          !inside(data, x - g / 2, y - h),
      );
      return { face, edge };
    });
  };
  const wallsFor = (g: number) => LAYERS.map((l) => Math.round(LAYER_DEPTH[l].wall / (g * s)));
  let g = spacing / s;
  let dots = build(g);
  let walls = wallsFor(g);
  const total = () => dots.reduce((sum, d, i) => sum + d.face.length + d.edge.length * walls[i], 0);
  // Fewer particles than that (software WebGL): a coarser grid, fewer wall layers.
  while (total() > usable * 0.9) {
    g *= 1.1;
    dots = build(g);
    walls = wallsFor(g);
  }

  const out = new Float32Array(count * 4);
  let n = 0;
  const put = (x: number, y: number, z: number, w: number) => {
    out.set([x, y, z, w], n * 4);
    n++;
  };
  const toX = (x: number) => (x - cx) * s;
  const toY = (y: number) => (cy - y) * s;
  LAYERS.forEach((layer, li) => {
    const { z, wall: depth } = LAYER_DEPTH[layer];
    const { data, masks } = images[li];
    const { face, edge } = dots[li];
    const read = (x: number, y: number) => {
      const i = at(x, y);
      const code = masks.find((mk) => mk.data[i + 3] > 127)?.code ?? 0;
      return { b: data[i] / 255, code };
    };
    for (const [x, y] of face) {
      const { b, code } = read(x, y);
      put(toX(x), toY(y), z, b + 2 * code);
    }
    const L = walls[li];
    for (let l = 1; l <= L; l++) {
      const zl = z - (depth * l) / L;
      const f = wall * (1 - (0.5 * l) / L);
      for (const [x, y] of edge) {
        const { b, code } = read(x, y);
        put(toX(x), toY(y), zl, b * f + 2 * code);
      }
    }
  });

  // Leftovers: most park hidden on the picture's dots; a few become faint
  // dust just around it. The particles from `usable` on stay zero: they're
  // the globe's shell.
  const visible = n;
  const dust = Math.round((usable - visible) * 0.03);
  while (n < usable) {
    const j = Math.floor(Math.random() * visible) * 4;
    if (n < usable - dust) {
      put(out[j], out[j + 1], out[j + 2], 0);
      continue;
    }
    const ang = Math.random() * Math.PI * 2;
    const r = 0.03 + Math.pow(Math.random(), 2.2) * 0.3;
    put(out[j] + Math.cos(ang) * r, out[j + 1] + Math.sin(ang) * r, out[j + 2] + (Math.random() - 0.5) * 0.3, 0.02 + Math.random() * 0.04);
  }
  return out;
}

/**
 * Portrait morph target from a "portrait map" (see scripts/make-portrait.py):
 * R = brightness, G = depth, B = mask.
 *
 * Particles sit on an even, staggered dot grid (halftone look) with a fixed
 * spacing (`dotSpacing`, fraction of the image height); the photo's
 * brightness drives each dot's brightness, very dark areas
 * are thinned a little, and the shoulders fade toward the bottom. A few
 * leftover particles become a faint dust aura; the rest are hidden.
 */
export async function loadPortraitShape(
  url: string,
  count: number,
  {
    height = 3.3,
    depth = 0.34,
    fadeStart = 0.42,
    dotSpacing = 0.0064,
    gridPoints = 16000,
  }: { height?: number; depth?: number; fadeStart?: number; dotSpacing?: number; gridPoints?: number } = {},
): Promise<ShapeData> {
  const img = new Image();
  img.src = url;
  await img.decode();
  const W = img.naturalWidth;
  const H = img.naturalHeight;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0);
  const { data } = ctx.getImageData(0, 0, W, H);

  const px = (x: number, y: number) =>
    (Math.min(H - 1, Math.max(0, Math.round(y))) * W + Math.min(W - 1, Math.max(0, Math.round(x)))) * 4;
  const fade = (v: number) => 1 - THREE.MathUtils.smoothstep(v, fadeStart, 1);
  // Probability that a grid dot is kept: 1 in lit areas so the grid stays
  // regular, thinner in shadows (adds contrast) and toward the bottom edge.
  const keepProb = (x: number, y: number) => {
    const i = px(x, y);
    if (data[i + 2] < 128) return 0;
    const b = data[i] / 255;
    return Math.min(1, 0.4 + 0.95 * b) * (0.12 + 0.88 * fade(y / H));
  };
  const grid = (g: number) => hexGrid(W, H, g, keepProb);

  // Fixed dot spacing (fraction of the image height) so the halftone looks the
  // same whatever the photo's framing; widened only if that would need more
  // than `gridPoints` (or `count`) dots.
  const target = Math.min(count, gridPoints);
  let spacing = dotSpacing * H;
  const expected = (g: number) => grid(g).reduce((a, p) => a + p[2], 0);
  if (expected(spacing) > target) {
    let lo = spacing;
    let hi = spacing * 4;
    for (let k = 0; k < 16; k++) {
      const mid = (lo + hi) / 2;
      if (expected(mid) > target) lo = mid;
      else hi = mid;
    }
    spacing = hi;
  }
  const cand = grid(spacing);
  let dots = cand.filter((p) => Math.random() < p[2]);
  if (dots.length > target) {
    for (let i = dots.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [dots[i], dots[j]] = [dots[j], dots[i]];
    }
    dots = dots.slice(0, target);
  }

  // Centre on the dots' bounding box and scale to `height` world units.
  let minX = Infinity, maxX = -Infinity, minYp = Infinity, maxYp = -Infinity;
  for (const [x, y] of dots) {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minYp = Math.min(minYp, y);
    maxYp = Math.max(maxYp, y);
  }
  const s = height / H;
  const cx = (minX + maxX) / 2;
  const cy = (minYp + maxYp) / 2;

  const positions = new Float32Array(count * 3);
  const shade = new Float32Array(count);
  let n = 0;
  for (const [x, y] of dots) {
    const j = px(x, y);
    positions[n * 3] = (x - cx) * s;
    positions[n * 3 + 1] = (cy - y) * s;
    positions[n * 3 + 2] = (data[j + 1] / 255 - 0.5) * depth * height;
    shade[n] = (0.03 + 0.97 * Math.pow(data[j] / 255, 1.7)) * (0.1 + 0.9 * fade(y / H));
    n++;
  }

  // Remaining particles: a small share becomes faint dust just outside the
  // head; the rest park on random dots with zero brightness (invisible in
  // the portrait, but they still take part in the globe and cloud stages).
  const gridCount = n;
  const dustCount = Math.round((count - gridCount) * 0.1);
  while (n < count - dustCount) {
    const k = Math.floor(Math.random() * gridCount);
    positions[n * 3] = positions[k * 3];
    positions[n * 3 + 1] = positions[k * 3 + 1];
    positions[n * 3 + 2] = positions[k * 3 + 2];
    shade[n] = 0;
    n++;
  }
  const upper = dots.filter(([, y]) => y / H < 0.6);
  const source = upper.length ? upper : dots;
  while (n < count) {
    const [x, y] = source[Math.floor(Math.random() * source.length)];
    const bx = (x - cx) * s;
    const by = (cy - y) * s;
    const out = 0.03 + Math.pow(Math.random(), 2.2) * 0.3;
    const ang = Math.atan2(by - height * 0.12, bx) + (Math.random() - 0.5) * 0.8;
    positions[n * 3] = bx + Math.cos(ang) * out;
    const sy = Math.sin(ang);
    positions[n * 3 + 1] = by + sy * out * (sy > 0 ? 0.35 : 0.8);
    positions[n * 3 + 2] = (Math.random() - 0.5) * depth * height;
    shade[n] = 0.02 + Math.random() * 0.06;
    n++;
  }
  return { positions, shade, ...yRange(positions) };
}

export function sampleGeometry(geometry: THREE.BufferGeometry, count: number, size = 2.3) {
  const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
  const sampler = new MeshSurfaceSampler(mesh).build();
  const tmp = new THREE.Vector3();
  const out = new Float32Array(count * 3);
  const box = new THREE.Box3();
  for (let i = 0; i < count; i++) {
    sampler.sample(tmp);
    out.set([tmp.x, tmp.y, tmp.z], i * 3);
    box.expandByPoint(tmp);
  }
  const center = box.getCenter(new THREE.Vector3());
  const dims = box.getSize(new THREE.Vector3());
  const s = size / Math.max(dims.x, dims.y, dims.z);
  for (let i = 0; i < count; i++) {
    out[i * 3] = (out[i * 3] - center.x) * s;
    out[i * 3 + 1] = (out[i * 3 + 1] - center.y) * s;
    out[i * 3 + 2] = (out[i * 3 + 2] - center.z) * s;
  }
  return out;
}

/** Fallback morph target used until you drop in your own model. */
export function defaultShapeGeometry() {
  return new THREE.TorusKnotGeometry(0.8, 0.28, 260, 36, 2, 3);
}

/**
 * Loads a .glb/.gltf and merges all of its meshes into one position-only
 * geometry (world transforms applied) ready for sampling.
 */
export async function loadModelGeometry(url: string) {
  const gltf = await new GLTFLoader().loadAsync(url);
  gltf.scene.updateMatrixWorld(true);
  const parts: THREE.BufferGeometry[] = [];
  gltf.scene.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh || !mesh.geometry?.attributes.position) return;
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", mesh.geometry.attributes.position.clone());
    if (mesh.geometry.index) g.setIndex(mesh.geometry.index.clone());
    g.applyMatrix4(mesh.matrixWorld);
    parts.push(g.index ? g.toNonIndexed() : g);
  });
  if (!parts.length) throw new Error(`No meshes found in ${url}`);
  return parts.length === 1 ? parts[0] : mergeGeometries(parts)!;
}
