/** A point in image pixels. */
export type Pt = [number, number];

/** Screen corners in the content's own orientation: top-left, top-right, bottom-right, bottom-left. */
export type Quad = { tl: Pt; tr: Pt; br: Pt; bl: Pt };

/** Row-major 3×3. */
export type Mat3 = [[number, number, number], [number, number, number], [number, number, number]];

/**
 * The homography that maps the unit square onto a quad: (0,0)→tl, (1,0)→tr,
 * (1,1)→br, (0,1)→bl. Heckbert's closed form.
 */
export function squareToQuad({ tl, tr, br, bl }: Quad): Mat3 {
  const [x0, y0] = tl;
  const [x1, y1] = tr;
  const [x2, y2] = br;
  const [x3, y3] = bl;
  const dx1 = x1 - x2;
  const dx2 = x3 - x2;
  const dx3 = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2;
  const dy2 = y3 - y2;
  const dy3 = y0 - y1 + y2 - y3;
  let g = 0;
  let h = 0;
  if (Math.abs(dx3) > 1e-9 || Math.abs(dy3) > 1e-9) {
    const den = dx1 * dy2 - dx2 * dy1;
    g = (dx3 * dy2 - dx2 * dy3) / den;
    h = (dx1 * dy3 - dx3 * dy1) / den;
  }
  return [
    [x1 - x0 + g * x1, x3 - x0 + h * x3, x0],
    [y1 - y0 + g * y1, y3 - y0 + h * y3, y0],
    [g, h, 1],
  ];
}

export function applyH(H: Mat3, u: number, v: number): Pt {
  const w = H[2][0] * u + H[2][1] * v + H[2][2];
  return [(H[0][0] * u + H[0][1] * v + H[0][2]) / w, (H[1][0] * u + H[1][1] * v + H[1][2]) / w];
}

/**
 * CSS for a `w × h` element placed at the image's top-left with
 * `transform-origin: 0 0`: it lands exactly on the quad.
 */
export function cssMatrix3d(H: Mat3, w: number, h: number): string {
  const g = [
    [H[0][0] / w, H[0][1] / h, H[0][2]],
    [H[1][0] / w, H[1][1] / h, H[1][2]],
    [H[2][0] / w, H[2][1] / h, H[2][2]],
  ];
  const n = (x: number) => +(x / g[2][2]).toPrecision(10);
  return `matrix3d(${[g[0][0], g[1][0], 0, g[2][0], g[0][1], g[1][1], 0, g[2][1], 0, 0, 1, 0, g[0][2], g[1][2], 0, g[2][2]].map(n).join(", ")})`;
}
