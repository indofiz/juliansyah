import * as THREE from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

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
  const grid = (g: number) => {
    const pts: [number, number, number][] = [];
    const rowH = g * 0.866;
    for (let r = 0, y = rowH / 2; y < H; r++, y += rowH) {
      for (let x = r % 2 ? g : g / 2; x < W; x += g) {
        const k = keepProb(x, y);
        if (k > 0) pts.push([x, y, k]);
      }
    }
    return pts;
  };

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
