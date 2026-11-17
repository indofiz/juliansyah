/**
 * Signed distance shapes (SDF) for the How I work step pictures
 * (lib/stepScenes.ts), and the code that turns a scene of them into
 * particles or an image.
 *
 * A shape is a function that says how far a point is from its surface
 * (negative inside). Round building blocks (spheres, tubes, rings, rounded
 * boxes, profiles spun around an axis, thick rounded flat shapes) are joined
 * into small scenes. To make particles, the portrait's even dot grid is laid
 * over the picture facing the camera and a ray goes from each dot into the
 * scene: the dot sits on the first surface it hits, at its depth, lit by a
 * soft key light from the top left (the globe's), with darker creases where
 * parts meet, highlights on glossy parts and a rim light on the edges.
 *
 * Plain math: no DOM, no three.js, so it runs in a worker and in Node
 * (scripts/make-step-art.mjs). Keep it that way: no path aliases, only
 * relative `.ts` imports and erasable TypeScript (no enums), so
 * `node --experimental-strip-types` can load it.
 */

export type Vec2 = [number, number];
export type Vec3 = [number, number, number];
/** A 3D shape: distance to its surface (negative inside) and a sphere around it. */
export type Shape = { f: (x: number, y: number, z: number) => number; c: Vec3; r: number };
/** A flat shape in its own x/y plane, and a circle around it. */
export type Shape2 = { f: (x: number, y: number) => number; c: Vec2; r: number };

const DEG = Math.PI / 180;
const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const hyp2 = (x: number, y: number) => Math.sqrt(x * x + y * y);
const hyp3 = (x: number, y: number, z: number) => Math.sqrt(x * x + y * y + z * z);

export const v3 = {
  add: (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]],
  sub: (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
  scale: (a: Vec3, k: number): Vec3 => [a[0] * k, a[1] * k, a[2] * k],
  dot: (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
  cross: (a: Vec3, b: Vec3): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
  len: (a: Vec3) => hyp3(a[0], a[1], a[2]),
  norm: (a: Vec3): Vec3 => {
    const l = hyp3(a[0], a[1], a[2]) || 1;
    return [a[0] / l, a[1] / l, a[2] / l];
  },
  /** a + (b − a) × t */
  lerp: (a: Vec3, b: Vec3, t: number): Vec3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t],
};

/** Smooth minimum: joins two distances with a fillet of size k. */
export const smin = (a: number, b: number, k: number) => {
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - h * h * k * 0.25;
};

function enclose2(items: { c: Vec2; r: number }[]): { c: Vec2; r: number } {
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const { c, r } of items) {
    x0 = Math.min(x0, c[0] - r);
    x1 = Math.max(x1, c[0] + r);
    y0 = Math.min(y0, c[1] - r);
    y1 = Math.max(y1, c[1] + r);
  }
  const c: Vec2 = [(x0 + x1) / 2, (y0 + y1) / 2];
  return { c, r: Math.max(...items.map((s) => hyp2(s.c[0] - c[0], s.c[1] - c[1]) + s.r)) };
}

function enclose3(items: { c: Vec3; r: number }[]): { c: Vec3; r: number } {
  const lo: Vec3 = [Infinity, Infinity, Infinity];
  const hi: Vec3 = [-Infinity, -Infinity, -Infinity];
  for (const { c, r } of items) {
    for (let k = 0; k < 3; k++) {
      lo[k] = Math.min(lo[k], c[k] - r);
      hi[k] = Math.max(hi[k], c[k] + r);
    }
  }
  const c = v3.scale(v3.add(lo, hi), 0.5);
  return { c, r: Math.max(...items.map((s) => v3.len(v3.sub(s.c, c)) + s.r)) };
}

// ---- Flat shapes -------------------------------------------------------------

export const circle2 = (r: number, c: Vec2 = [0, 0]): Shape2 => ({ f: (x, y) => hyp2(x - c[0], y - c[1]) - r, c, r });

/** A rectangle (half sizes hw × hh) with rounded corners, turned `rot` degrees. */
export function rect2(hw: number, hh: number, round = 0, c: Vec2 = [0, 0], rot = 0): Shape2 {
  const co = Math.cos(-rot * DEG), si = Math.sin(-rot * DEG);
  const ax = hw - round, ay = hh - round;
  return {
    f: (x, y) => {
      const dx = x - c[0], dy = y - c[1];
      const qx = Math.abs(co * dx - si * dy) - ax;
      const qy = Math.abs(si * dx + co * dy) - ay;
      return hyp2(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - round;
    },
    c,
    r: hyp2(hw, hh),
  };
}

function segment(x: number, y: number, ax: number, ay: number, bx: number, by: number) {
  const px = x - ax, py = y - ay, ex = bx - ax, ey = by - ay;
  const h = clamp((px * ex + py * ey) / (ex * ex + ey * ey), 0, 1);
  return hyp2(px - ex * h, py - ey * h);
}

/** A line through `points`, `r` thick on each side, with round ends and joins. */
export function stroke2(points: Vec2[], r: number): Shape2 {
  return {
    f: (x, y) => {
      let d = Infinity;
      for (let i = 0; i < points.length - 1; i++) d = Math.min(d, segment(x, y, points[i][0], points[i][1], points[i + 1][0], points[i + 1][1]));
      return d - r;
    },
    ...enclose2(points.map((c) => ({ c, r }))),
  };
}

/** Any polygon (exact distance). */
export function polygon2(points: Vec2[]): Shape2 {
  const n = points.length;
  return {
    f: (x, y) => {
      let d = (x - points[0][0]) ** 2 + (y - points[0][1]) ** 2;
      let s = 1;
      for (let i = 0, j = n - 1; i < n; j = i, i++) {
        const [vix, viy] = points[i];
        const [vjx, vjy] = points[j];
        const ex = vjx - vix, ey = vjy - viy;
        const wx = x - vix, wy = y - viy;
        const h = clamp((wx * ex + wy * ey) / (ex * ex + ey * ey), 0, 1);
        const bx = wx - ex * h, by = wy - ey * h;
        d = Math.min(d, bx * bx + by * by);
        const c1 = y >= viy, c2 = y < vjy, c3 = ex * wy > ey * wx;
        if ((c1 && c2 && c3) || (!c1 && !c2 && !c3)) s = -s;
      }
      return s * Math.sqrt(d);
    },
    ...enclose2(points.map((c) => ({ c, r: 0 }))),
  };
}

/** A five-point star, radius R; `inner` (0–1) sets how deep the dents are. Points up, turned `rot` degrees. */
export function star2(R: number, inner = 0.5, c: Vec2 = [0, 0], rot = 0): Shape2 {
  const k1x = 0.809016994375, k1y = -0.587785252292;
  const k2x = -k1x, k2y = k1y;
  const bax = inner * -k1y, bay = inner * k1x - 1;
  const bb = bax * bax + bay * bay;
  const co = Math.cos(-rot * DEG), si = Math.sin(-rot * DEG);
  return {
    f: (x0, y0) => {
      const dx = (x0 - c[0]) / R, dy = (y0 - c[1]) / R;
      let x = Math.abs(co * dx - si * dy);
      let y = si * dx + co * dy;
      let t = 2 * Math.max(k1x * x + k1y * y, 0);
      x -= t * k1x;
      y -= t * k1y;
      t = 2 * Math.max(k2x * x + k2y * y, 0);
      x -= t * k2x;
      y -= t * k2y;
      x = Math.abs(x);
      y -= 1;
      const h = clamp((x * bax + y * bay) / bb, 0, 1);
      return hyp2(x - bax * h, y - bay * h) * Math.sign(y * bax - x * bay) * R;
    },
    c,
    r: R,
  };
}

/** A gear: a disc of radius R with `teeth` rounded teeth reaching `depth` past it, each `halfWidth` wide on a side. */
export function gear2(R: number, teeth: number, depth: number, halfWidth: number, round = 0): Shape2 {
  const sector = (2 * Math.PI) / teeth;
  const tooth = rect2(depth / 2 + round + 0.01, halfWidth, round, [R + depth / 2 - round - 0.01, 0]);
  return {
    f: (x, y) => {
      const rr = hyp2(x, y);
      let a = Math.atan2(y, x);
      a = ((((a + sector / 2) % sector) + sector) % sector) - sector / 2;
      return Math.min(rr - R, tooth.f(rr * Math.cos(a), Math.abs(rr * Math.sin(a))));
    },
    c: [0, 0],
    r: R + depth,
  };
}

export const union2 = (...s: Shape2[]): Shape2 => ({
  f: (x, y) => {
    let d = Infinity;
    for (const t of s) d = Math.min(d, t.f(x, y));
    return d;
  },
  ...enclose2(s),
});

export const smooth2 = (k: number, ...s: Shape2[]): Shape2 => ({
  f: (x, y) => {
    let d = s[0].f(x, y);
    for (let i = 1; i < s.length; i++) d = smin(d, s[i].f(x, y), k);
    return d;
  },
  ...enclose2(s),
});

/** `a` with `b` cut out of it. */
export const subtract2 = (a: Shape2, b: Shape2): Shape2 => ({ f: (x, y) => Math.max(a.f(x, y), -b.f(x, y)), c: a.c, r: a.r });

// ---- 3D shapes ---------------------------------------------------------------

export const sphere = (r: number, c: Vec3 = [0, 0, 0]): Shape => ({ f: (x, y, z) => hyp3(x - c[0], y - c[1], z - c[2]) - r, c, r });

/** An ellipsoid with radii rx, ry, rz (approximate distance, fine for marching). */
export function ellipsoid(rx: number, ry: number, rz: number, c: Vec3 = [0, 0, 0]): Shape {
  return {
    f: (x, y, z) => {
      const dx = x - c[0], dy = y - c[1], dz = z - c[2];
      const k0 = hyp3(dx / rx, dy / ry, dz / rz);
      const k1 = hyp3(dx / (rx * rx), dy / (ry * ry), dz / (rz * rz));
      return (k0 * (k0 - 1)) / (k1 || 1e-9);
    },
    c,
    r: Math.max(rx, ry, rz),
  };
}

/** A tube from a to b, radius r, with round ends. */
export function capsule(a: Vec3, b: Vec3, r: number): Shape {
  const e = v3.sub(b, a);
  const ee = v3.dot(e, e);
  return {
    f: (x, y, z) => {
      const px = x - a[0], py = y - a[1], pz = z - a[2];
      const h = clamp((px * e[0] + py * e[1] + pz * e[2]) / ee, 0, 1);
      return hyp3(px - e[0] * h, py - e[1] * h, pz - e[2] * h) - r;
    },
    c: v3.lerp(a, b, 0.5),
    r: Math.sqrt(ee) / 2 + r,
  };
}

/** A cone from a (radius ra) to b (radius rb) with round ends: tapered legs, handles, a flame. */
export function cone(a: Vec3, b: Vec3, ra: number, rb: number): Shape {
  const ba = v3.sub(b, a);
  const l2 = v3.dot(ba, ba);
  const rr = ra - rb;
  const a2 = l2 - rr * rr;
  const il2 = 1 / l2;
  return {
    f: (x, y, z) => {
      const pax = x - a[0], pay = y - a[1], paz = z - a[2];
      const yy = pax * ba[0] + pay * ba[1] + paz * ba[2];
      const zz = yy - l2;
      const qx = pax * l2 - ba[0] * yy, qy = pay * l2 - ba[1] * yy, qz = paz * l2 - ba[2] * yy;
      const x2 = qx * qx + qy * qy + qz * qz;
      const y2 = yy * yy * l2;
      const z2 = zz * zz * l2;
      const k = Math.sign(rr) * rr * rr * x2;
      if (Math.sign(zz) * a2 * z2 > k) return Math.sqrt(x2 + z2) * il2 - rb;
      if (Math.sign(yy) * a2 * y2 < k) return Math.sqrt(x2 + y2) * il2 - ra;
      return (Math.sqrt(x2 * a2 * il2) + yy * rr) * il2 - ra;
    },
    c: v3.lerp(a, b, 0.5),
    r: Math.sqrt(l2) / 2 + Math.max(ra, rb),
  };
}

/** A cylinder from a to b, radius r, its edges rounded by `round`. */
export function cylinder(a0: Vec3, b0: Vec3, r0: number, round = 0): Shape {
  const axis = v3.norm(v3.sub(b0, a0));
  const a = v3.add(a0, v3.scale(axis, round));
  const b = v3.sub(b0, v3.scale(axis, round));
  const r = r0 - round;
  const ba = v3.sub(b, a);
  const baba = v3.dot(ba, ba);
  return {
    f: (px, py, pz) => {
      const pax = px - a[0], pay = py - a[1], paz = pz - a[2];
      const paba = pax * ba[0] + pay * ba[1] + paz * ba[2];
      const x = hyp3(pax * baba - ba[0] * paba, pay * baba - ba[1] * paba, paz * baba - ba[2] * paba) - r * baba;
      const y = Math.abs(paba - baba * 0.5) - baba * 0.5;
      const x2 = x * x;
      const y2 = y * y * baba;
      const d = Math.max(x, y) < 0 ? -Math.min(x2, y2 * 1) : (x > 0 ? x2 : 0) + (y > 0 ? y2 : 0);
      return (Math.sign(d) * Math.sqrt(Math.abs(d))) / baba - round;
    },
    c: v3.lerp(a0, b0, 0.5),
    r: hyp2(v3.len(v3.sub(b0, a0)) / 2, r0),
  };
}

/** A ring around `axis` through c: radius R, tube radius r. */
export function torus(c: Vec3, axis: Vec3, R: number, r: number): Shape {
  const n = v3.norm(axis);
  return {
    f: (x, y, z) => {
      const dx = x - c[0], dy = y - c[1], dz = z - c[2];
      const h = dx * n[0] + dy * n[1] + dz * n[2];
      const q = hyp3(dx - n[0] * h, dy - n[1] * h, dz - n[2] * h) - R;
      return hyp2(q, h) - r;
    },
    c,
    r: R + r,
  };
}

/** A box (half sizes) centred on the origin, edges rounded by `round`. Place it with place(). */
export function box(hx: number, hy: number, hz: number, round = 0): Shape {
  return {
    f: (x, y, z) => {
      const qx = Math.abs(x) - hx + round, qy = Math.abs(y) - hy + round, qz = Math.abs(z) - hz + round;
      return hyp3(Math.max(qx, 0), Math.max(qy, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qy, qz), 0) - round;
    },
    c: [0, 0, 0],
    r: hyp3(hx, hy, hz),
  };
}

/** A flat shape made thick: ±h along z, its edges rounded by `round` (the outline stays where it was). */
export function extrude(s: Shape2, h: number, round = 0): Shape {
  return {
    f: (x, y, z) => {
      const wx = s.f(x, y) + round, wy = Math.abs(z) - h + round;
      return Math.min(Math.max(wx, wy), 0) + hyp2(Math.max(wx, 0), Math.max(wy, 0)) - round;
    },
    c: [s.c[0], s.c[1], 0],
    r: hyp2(s.r, h),
  };
}

/** A profile (x = distance from the axis, y = height) spun around the y axis. */
export function revolve(s: Shape2): Shape {
  return { f: (x, y, z) => s.f(hyp2(x, z), y), c: [0, s.c[1], 0], r: Math.abs(s.c[0]) + s.r };
}

/** Rotation matrix (row-major) for turns in degrees about x, then y, then z. */
export function rotation([rx, ry, rz]: Vec3): number[] {
  const [cx, sx] = [Math.cos(rx * DEG), Math.sin(rx * DEG)];
  const [cy, sy] = [Math.cos(ry * DEG), Math.sin(ry * DEG)];
  const [cz, sz] = [Math.cos(rz * DEG), Math.sin(rz * DEG)];
  // Rz · Ry · Rx
  return [
    cz * cy, cz * sy * sx - sz * cx, cz * sy * cx + sz * sx,
    sz * cy, sz * sy * sx + cz * cx, sz * sy * cx - cz * sx,
    -sy, cy * sx, cy * cx,
  ];
}

const rotate = (m: number[], [x, y, z]: Vec3): Vec3 => [m[0] * x + m[1] * y + m[2] * z, m[3] * x + m[4] * y + m[5] * z, m[6] * x + m[7] * y + m[8] * z];

/** Where point p ends up when moved like place(…, pos, rot). */
export const transformPoint = (p: Vec3, pos: Vec3, rot: Vec3 = [0, 0, 0]): Vec3 => v3.add(rotate(rotation(rot), p), pos);
/** Where direction d points when turned like place(…, pos, rot). */
export const transformDir = (d: Vec3, rot: Vec3): Vec3 => rotate(rotation(rot), d);

/** A shape turned (degrees about x, then y, then z, around its origin) and moved to pos. */
export function place(s: Shape, pos: Vec3, rot: Vec3 = [0, 0, 0]): Shape {
  const m = rotation(rot);
  return {
    f: (x, y, z) => {
      const dx = x - pos[0], dy = y - pos[1], dz = z - pos[2];
      // Inverse rotation = transpose.
      return s.f(m[0] * dx + m[3] * dy + m[6] * dz, m[1] * dx + m[4] * dy + m[7] * dz, m[2] * dx + m[5] * dy + m[8] * dz);
    },
    c: v3.add(rotate(m, s.c), pos),
    r: s.r,
  };
}

export const union = (...s: Shape[]): Shape => ({
  f: (x, y, z) => {
    let d = Infinity;
    for (const t of s) d = Math.min(d, t.f(x, y, z));
    return d;
  },
  ...enclose3(s),
});

/** Shapes blended together with fillets of size k (clouds, a teardrop). */
export const smooth = (k: number, ...s: Shape[]): Shape => ({
  f: (x, y, z) => {
    let d = s[0].f(x, y, z);
    for (let i = 1; i < s.length; i++) d = smin(d, s[i].f(x, y, z), k);
    return d;
  },
  ...enclose3(s),
});

/** `a` with `b` cut out of it. */
export const subtract = (a: Shape, b: Shape): Shape => ({ f: (x, y, z) => Math.max(a.f(x, y, z), -b.f(x, y, z)), c: a.c, r: a.r });

/** Only the part of `s` on the side of the plane through p that n points away from (n · (x − p) ≤ 0). */
export function cut(s: Shape, p: Vec3, n0: Vec3): Shape {
  const n = v3.norm(n0);
  return { f: (x, y, z) => Math.max(s.f(x, y, z), (x - p[0]) * n[0] + (y - p[1]) * n[1] + (z - p[2]) * n[2]), c: s.c, r: s.r };
}

// ---- Scenes ------------------------------------------------------------------

export type Material = {
  /** Brightness of the part's colour, 0–1. */
  value: number;
  /** Drawn in the palette's light rim colour instead of the accent. */
  tint?: boolean;
  /** 0–1: how glossy (a highlight that glows). */
  gloss?: number;
  /** 0–1: how much the key light shapes it (default 1). Less for a part that turns (the gear), so its light doesn't visibly turn with it. */
  light?: number;
  /** Motion code (stepScenes.ts MOTION), played by the particle shader. */
  motion?: number;
};
export type Part = Material & { shape: Shape };

/** Each part's shape moved like place(…, pos, rot): parts built together, placed together. */
export const placeParts = (parts: Part[], pos: Vec3, rot: Vec3 = [0, 0, 0]): Part[] => parts.map((p) => ({ ...p, shape: place(p.shape, pos, rot) }));

/** Key light from the top left and the front, as on the globe (shaders.ts). */
const LIGHT = v3.norm([-0.55, 0.7, 0.5]);
const HALF = v3.norm(v3.add(LIGHT, [0, 0, 1]));

/**
 * Finds where rays from the camera (looking down −z) first hit a scene.
 * Bounding spheres keep it fast: a ray only tests the parts whose sphere it
 * passes through.
 */
export class Tracer {
  readonly parts: Part[];
  private cx: Float64Array;
  private cy: Float64Array;
  private cz: Float64Array;
  private r: Float64Array;
  private cand: Int32Array;
  /** The part the last dist() or march() found nearest. */
  hit = -1;

  constructor(parts: Part[]) {
    this.parts = parts;
    const n = parts.length;
    this.cx = new Float64Array(n);
    this.cy = new Float64Array(n);
    this.cz = new Float64Array(n);
    this.r = new Float64Array(n);
    this.cand = new Int32Array(n);
    parts.forEach(({ shape }, i) => {
      this.cx[i] = shape.c[0];
      this.cy[i] = shape.c[1];
      this.cz[i] = shape.c[2];
      this.r[i] = shape.r;
    });
  }

  /** The scene's extent on screen: [x0, y0, x1, y1] from the bounding spheres. */
  bounds(): [number, number, number, number] {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (let i = 0; i < this.parts.length; i++) {
      x0 = Math.min(x0, this.cx[i] - this.r[i]);
      x1 = Math.max(x1, this.cx[i] + this.r[i]);
      y0 = Math.min(y0, this.cy[i] - this.r[i]);
      y1 = Math.max(y1, this.cy[i] + this.r[i]);
    }
    return [x0, y0, x1, y1];
  }

  /** Distance from a point to the nearest part (sets `hit`). */
  dist(x: number, y: number, z: number): number {
    let best = Infinity;
    this.hit = -1;
    for (let i = 0; i < this.parts.length; i++) {
      const dx = x - this.cx[i], dy = y - this.cy[i], dz = z - this.cz[i];
      if (Math.sqrt(dx * dx + dy * dy + dz * dz) - this.r[i] > best) continue;
      const d = this.parts[i].shape.f(x, y, z);
      if (d < best) {
        best = d;
        this.hit = i;
      }
    }
    return best;
  }

  /** Depth of the first surface along the ray at (x, y), or NaN; sets `hit`. */
  march(x: number, y: number): number {
    let n = 0;
    let zTop = -Infinity, zBot = Infinity;
    for (let i = 0; i < this.parts.length; i++) {
      const dx = x - this.cx[i], dy = y - this.cy[i];
      const r = this.r[i];
      if (dx * dx + dy * dy > r * r) continue;
      this.cand[n++] = i;
      zTop = Math.max(zTop, this.cz[i] + r);
      zBot = Math.min(zBot, this.cz[i] - r);
    }
    this.hit = -1;
    if (!n) return NaN;
    let z = zTop;
    for (let step = 0; step < 160 && z > zBot; step++) {
      let best = Infinity;
      let hit = -1;
      for (let k = 0; k < n; k++) {
        const i = this.cand[k];
        const dx = x - this.cx[i], dy = y - this.cy[i], dz = z - this.cz[i];
        if (Math.sqrt(dx * dx + dy * dy + dz * dz) - this.r[i] > best) continue;
        const d = this.parts[i].shape.f(x, y, z);
        if (d < best) {
          best = d;
          hit = i;
        }
      }
      if (best < 6e-4) {
        this.hit = hit;
        return z;
      }
      z -= Math.max(best * 0.85, 4e-4);
    }
    return NaN;
  }

  /** Surface normal of part i at a point. */
  normal(i: number, x: number, y: number, z: number): Vec3 {
    const f = this.parts[i].shape.f;
    const e = 0.0015;
    const a = f(x + e, y - e, z - e), b = f(x - e, y - e, z + e), c = f(x - e, y + e, z - e), d = f(x + e, y + e, z + e);
    return v3.norm([a - b - c + d, -a - b + c + d, -a + b - c + d]);
  }

  /** Ambient occlusion: 1 in the open, lower in creases where parts meet. */
  ao(x: number, y: number, z: number, [nx, ny, nz]: Vec3): number {
    let occ = 0;
    let w = 1;
    for (let k = 1; k <= 5; k++) {
      const h = 0.018 * k;
      occ += (h - this.dist(x + nx * h, y + ny * h, z + nz * h)) * w;
      w *= 0.7;
    }
    return clamp(1 - 3.2 * occ, 0, 1);
  }
}

/**
 * A dot's brightness from its part's material, its normal and occlusion:
 * soft (clay) light that wraps into the shadow side, a highlight on glossy
 * parts and a rim light on the edges. Above 1 means glow: the shader shows
 * up to 1 as brightness and the rest as glow in the rim colour.
 */
export function shade(m: Material, [nx, ny, nz]: Vec3, ao: number): number {
  const lit = m.light ?? 1;
  const ndl = nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2];
  const wrap = clamp((ndl + 0.5) / 1.5, 0, 1);
  const diffuse = 0.62 + (0.16 + 0.84 * wrap * wrap - 0.62) * lit;
  const base = m.value * diffuse * (0.3 + 0.7 * ao);
  const ndh = Math.max(nx * HALF[0] + ny * HALF[1] + nz * HALF[2], 0);
  const spec = (m.gloss ?? 0) * Math.pow(ndh, 36) * 0.95 * lit;
  const rim = Math.pow(1 - clamp(nz, 0, 1), 3) * 0.45 * wrap * Math.sqrt(m.value);
  return clamp(base + spec + rim, 0, 1.98);
}

/** Fits a scene into width × height (world units): scale and the scene's centre. */
export type Fit = { s: number; cx: number; cy: number; cz: number; w: number; h: number };

/** Measures what a scene covers on screen with a coarse grid of rays, and fits it. */
export function fitScene(tracer: Tracer, width: number, height: number): Fit & { coverage: number } {
  const [bx0, by0, bx1, by1] = tracer.bounds();
  const step = Math.max(bx1 - bx0, by1 - by0) / 140;
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity, z0 = Infinity, z1 = -Infinity;
  let hits = 0;
  for (let y = by0 + step / 2; y < by1; y += step) {
    for (let x = bx0 + step / 2; x < bx1; x += step) {
      const z = tracer.march(x, y);
      if (Number.isNaN(z)) continue;
      hits++;
      x0 = Math.min(x0, x);
      x1 = Math.max(x1, x);
      y0 = Math.min(y0, y);
      y1 = Math.max(y1, y);
      z0 = Math.min(z0, z);
      z1 = Math.max(z1, z);
    }
  }
  x0 -= step / 2;
  x1 += step / 2;
  y0 -= step / 2;
  y1 += step / 2;
  const s = Math.min(width / (x1 - x0), height / (y1 - y0));
  return {
    s,
    cx: (x0 + x1) / 2,
    cy: (y0 + y1) / 2,
    cz: (z0 + z1) / 2,
    w: (x1 - x0) * s,
    h: (y1 - y0) * s,
    // Area covered, in fitted world units².
    coverage: hits * step * step * s * s,
  };
}

/** One dot: x, y, z in fitted world units, brightness (0–2), part index. */
export type Dot = { x: number; y: number; z: number; b: number; part: number };

/**
 * The scene as dots on the portrait's staggered grid (spacing `spacing`
 * world units), fitted into width × height and centred. A dot just behind
 * an edge of a part in front of it goes dark, so parts don't merge. The
 * grid widens if it would need more than `maxDots`.
 *
 * `depth` flattens the dots' depth (not their light, which comes from the
 * real shapes): a deep scene turning with the sway would change its look a
 * lot and swing its near parts out of the column.
 */
export function sampleDots(
  parts: Part[],
  {
    width = 1.9,
    height = 2.4,
    spacing = 0.02,
    maxDots = Infinity,
    depth = 1,
  }: { width?: number; height?: number; spacing?: number; maxDots?: number; depth?: number } = {},
): { dots: Dot[]; fit: Fit; spacing: number } {
  const tracer = new Tracer(parts);
  const fit = fitScene(tracer, width, height);
  let g = spacing;
  const expected = fit.coverage / (g * g * 0.866);
  if (expected > maxDots * 0.95) g *= Math.sqrt(expected / (maxDots * 0.95));
  const rowH = g * 0.866;
  const rows = Math.ceil(fit.h / rowH) + 1;
  const cols = Math.ceil(fit.w / g) + 2;
  const idx = new Int32Array(rows * cols).fill(-1);
  const dots: Dot[] = [];

  for (let r = 0; r < rows; r++) {
    const wy = -fit.h / 2 + rowH / 2 + r * rowH;
    for (let j = 0; j < cols; j++) {
      const wx = -fit.w / 2 + (r % 2 ? g : g / 2) + j * g;
      const sx = fit.cx + wx / fit.s, sy = fit.cy + wy / fit.s;
      const sz = tracer.march(sx, sy);
      if (Number.isNaN(sz)) continue;
      const part = tracer.hit;
      const n = tracer.normal(part, sx, sy, sz);
      const ao = tracer.ao(sx, sy, sz, n);
      idx[r * cols + j] = dots.length;
      dots.push({ x: wx, y: wy, z: (sz - fit.cz) * fit.s * depth, b: shade(parts[part], n, ao), part });
    }
  }

  // Outlines: a dot with a neighbour of another part clearly in front of it.
  const gap = 0.05 * depth;
  const dark = new Uint8Array(dots.length);
  for (let r = 0; r < rows; r++) {
    for (let j = 0; j < cols; j++) {
      const i = idx[r * cols + j];
      if (i < 0) continue;
      const odd = r % 2;
      const near: [number, number][] = [
        [r, j - 1],
        [r, j + 1],
        [r - 1, odd ? j : j - 1],
        [r - 1, odd ? j + 1 : j],
        [r + 1, odd ? j : j - 1],
        [r + 1, odd ? j + 1 : j],
      ];
      for (const [rr, jj] of near) {
        if (rr < 0 || rr >= rows || jj < 0 || jj >= cols) continue;
        const k = idx[rr * cols + jj];
        if (k >= 0 && dots[k].part !== dots[i].part && dots[k].z - dots[i].z > gap) {
          dark[i] = 1;
          break;
        }
      }
    }
  }
  dots.forEach((d, i) => {
    if (dark[i]) d.b *= 0.12;
  });
  return { dots, fit, spacing: g };
}

/**
 * The scene as a smooth image (no dots): brightness 0–2 and the part hit
 * (−1 = none) per pixel, `px` pixels per world unit, over `width` × `height`
 * world units centred where sampleDots() centres the scene (default: the
 * scene's own fitted size). For the phone icons and the still picture
 * without WebGL (scripts/make-step-art.mjs).
 */
export function renderImage(
  parts: Part[],
  fit: Fit,
  px: number,
  { width: bw = fit.w, height: bh = fit.h }: { width?: number; height?: number } = {},
): { data: Float32Array; part: Int16Array; width: number; height: number } {
  const tracer = new Tracer(parts);
  const width = Math.round(bw * px);
  const height = Math.round(bh * px);
  const data = new Float32Array(width * height);
  const part = new Int16Array(width * height).fill(-1);
  for (let py = 0; py < height; py++) {
    const wy = bh / 2 - (py + 0.5) / px;
    for (let pxi = 0; pxi < width; pxi++) {
      const wx = -bw / 2 + (pxi + 0.5) / px;
      const sx = fit.cx + wx / fit.s, sy = fit.cy + wy / fit.s;
      const sz = tracer.march(sx, sy);
      if (Number.isNaN(sz)) continue;
      const hit = tracer.hit;
      const n = tracer.normal(hit, sx, sy, sz);
      data[py * width + pxi] = shade(parts[hit], n, tracer.ao(sx, sy, sz, n));
      part[py * width + pxi] = hit;
    }
  }
  return { data, part, width, height };
}

// ---- Halo ----------------------------------------------------------------------

/**
 * Exact Euclidean distance transform (Felzenszwalb & Huttenlocher): for each
 * cell of a W × H grid, the distance in cells to the nearest cell where
 * `feature` is true.
 */
function distanceTransform(feature: Uint8Array, W: number, H: number): Float32Array {
  const INF = 1e20;
  const grid = new Float64Array(W * H);
  for (let i = 0; i < W * H; i++) grid[i] = feature[i] ? 0 : INF;
  const n = Math.max(W, H);
  const f = new Float64Array(n);
  const d = new Float64Array(n);
  const v = new Int32Array(n);
  const z = new Float64Array(n + 1);
  const pass = (len: number) => {
    let k = 0;
    v[0] = 0;
    z[0] = -INF;
    z[1] = INF;
    for (let q = 1; q < len; q++) {
      let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
      while (s <= z[k]) {
        k--;
        s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
      }
      k++;
      v[k] = q;
      z[k] = s;
      z[k + 1] = INF;
    }
    k = 0;
    for (let q = 0; q < len; q++) {
      while (z[k + 1] < q) k++;
      d[q] = (q - v[k]) ** 2 + f[v[k]];
    }
  };
  for (let x = 0; x < W; x++) {
    for (let y = 0; y < H; y++) f[y] = grid[y * W + x];
    pass(H);
    for (let y = 0; y < H; y++) grid[y * W + x] = d[y];
  }
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) f[x] = grid[y * W + x];
    pass(W);
    for (let x = 0; x < W; x++) grid[y * W + x] = d[x];
  }
  const out = new Float32Array(W * H);
  for (let i = 0; i < W * H; i++) out[i] = Math.sqrt(grid[i]);
  return out;
}

/** One speck of a picture's haze: position (world units) and brightness. */
export type Speck = { x: number; y: number; z: number; b: number };

/**
 * A meshy haze around a picture's dots, like the portrait's edges in About:
 * specks scattered at random around the outline, densest just outside it
 * (from `start`) and thinning out with distance (`falloff`) up to `reach`
 * (world units), brighter near the picture. The outline is closed first
 * (`smoothing`), so narrow gaps like the space between a tripod's legs stay
 * clear. Specks spread ±`depth` in z, so the haze reads as a cloud when the
 * picture turns. Exactly `count` specks.
 */
export function hazePoints(
  dots: { x: number; y: number }[],
  {
    count = 2200,
    start = 0.012,
    falloff = 0.07,
    reach = 0.22,
    depth = 0.12,
    smoothing = 0.1,
    cell = 0.012,
    fill = 0.02,
  }: { count?: number; start?: number; falloff?: number; reach?: number; depth?: number; smoothing?: number; cell?: number; fill?: number } = {},
): Speck[] {
  if (!dots.length || count <= 0) return [];
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const { x, y } of dots) {
    x0 = Math.min(x0, x);
    x1 = Math.max(x1, x);
    y0 = Math.min(y0, y);
    y1 = Math.max(y1, y);
  }
  const margin = reach + smoothing + 4 * cell;
  x0 -= margin;
  y0 -= margin;
  const W = Math.ceil((x1 + margin - x0) / cell);
  const H = Math.ceil((y1 + margin - y0) / cell);

  // The picture's silhouette, and the distance from it.
  const inside = new Uint8Array(W * H);
  const r = Math.ceil(fill / cell);
  for (const { x, y } of dots) {
    const cx = Math.floor((x - x0) / cell), cy = Math.floor((y - y0) / cell);
    for (let j = -r; j <= r; j++) for (let i = -r; i <= r; i++) inside[(cy + j) * W + cx + i] = 1;
  }
  const toShape = distanceTransform(inside, W, H);
  // Distance from the closed silhouette (grown by `smoothing`, shrunk back):
  // 0 in the narrow gaps the closing fills.
  const grown = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) grown[i] = toShape[i] * cell > smoothing ? 1 : 0;
  const toGrownEdge = distanceTransform(grown, W, H);
  const distance = (i: number) => {
    const d = toShape[i] * cell;
    return d > smoothing ? d : Math.max(0, smoothing - toGrownEdge[i] * cell);
  };

  // Each cell in the band, weighted by how dense the haze is there.
  const cells: number[] = [];
  const dist: number[] = [];
  const cumulative: number[] = [];
  let total = 0;
  for (let i = 0; i < W * H; i++) {
    const d = distance(i);
    if (d <= start || d >= reach || toShape[i] * cell <= start) continue;
    total += Math.exp(-(d - start) / falloff);
    cells.push(i);
    dist.push(d);
    cumulative.push(total);
  }
  if (!cells.length) return [];

  const specks: Speck[] = [];
  for (let n = 0; n < count; n++) {
    // Pick a cell by weight (binary search on the running total).
    const t = Math.random() * total;
    let lo = 0, hi = cumulative.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cumulative[mid] < t) lo = mid + 1;
      else hi = mid;
    }
    const i = cells[lo];
    const fade = Math.exp(-(dist[lo] - start) / (falloff * 1.3));
    specks.push({
      x: x0 + ((i % W) + Math.random()) * cell,
      y: y0 + (Math.floor(i / W) + Math.random()) * cell,
      z: (Math.random() * 2 - 1) * depth,
      b: Math.random() < 0.03 ? 0.8 : (0.06 + 0.4 * fade) * (0.55 + 0.45 * Math.random()),
    });
  }
  return specks;
}
