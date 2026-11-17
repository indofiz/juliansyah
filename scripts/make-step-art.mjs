/**
 * Renders the How I work step pictures (src/lib/stepScenes.ts, the shapes
 * the particle globe turns into) as images, for where the particles don't
 * show them:
 *
 *   public/process/<id>-icon.png   the icon beside each step on phones
 *   public/process/<id>-art.png    the picture where the globe would be,
 *                                  without WebGL, placed in a 1.9 × 2.4 box
 *                                  (globe radii) as the particles place it
 *
 * Each comes with a `-light.png` twin: one mask for the parts in the accent
 * colour, one for the parts in the light rim colour, so CSS paints them in
 * the visitor's palette (StepIcon.tsx). Shading is in the masks' alpha.
 *
 *   npm run step-art
 *
 * Rerun after changing a scene. Takes a minute or two (a ray per pixel,
 * four per pixel for smooth edges).
 */
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";
import { fitScene, renderImage, Tracer } from "../src/lib/sdf.ts";
import { PICTURE_BOX, STEP_IDS, STEP_SCENES } from "../src/lib/stepScenes.ts";

const OUT = path.join(import.meta.dirname, "../public/process");
/** Supersampling per side: renders this many times larger, then averages. */
const SS = 2;
const SIZES = {
  // 2.5rem at 3×: the largest side 120 px, the picture's own bounds. At
  // 40 px the shadow side sinks into the page, so the light is lifted.
  icon: { px: (fit) => 120 / Math.max(fit.w, fit.h), box: (fit) => ({ width: fit.w, height: fit.h }), lift: (b) => Math.min(1, 1.2 * b ** 0.7) },
  // A 1.9 × 2.4 box around the picture, ~1× on a 1440 px screen.
  art: { px: () => 280, box: () => ({ width: 1.9, height: 2.4 }), lift: (b) => b },
};

/** A greyscale + alpha PNG: white, with `alpha` (0–1) as its alpha. */
function writeMask(file, width, height, alpha) {
  const png = new PNG({ width, height });
  for (let i = 0; i < width * height; i++) {
    png.data[i * 4] = png.data[i * 4 + 1] = png.data[i * 4 + 2] = 255;
    png.data[i * 4 + 3] = Math.round(Math.min(1, Math.max(0, alpha[i])) * 255);
  }
  fs.writeFileSync(file, PNG.sync.write(png, { colorType: 4, deflateLevel: 9 }));
  return fs.statSync(file).size;
}

fs.mkdirSync(OUT, { recursive: true });
for (const id of STEP_IDS) {
  const { parts } = STEP_SCENES[id]();
  const fit = fitScene(new Tracer(parts), PICTURE_BOX.width, PICTURE_BOX.height);
  for (const [name, size] of Object.entries(SIZES)) {
    const px = size.px(fit);
    const img = renderImage(parts, fit, px * SS, size.box(fit));
    const width = Math.floor(img.width / SS);
    const height = Math.floor(img.height / SS);
    const accent = new Float32Array(width * height);
    const light = new Float32Array(width * height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let a = 0, l = 0;
        for (let j = 0; j < SS; j++) {
          for (let i = 0; i < SS; i++) {
            const k = (y * SS + j) * img.width + x * SS + i;
            const hit = img.part[k];
            if (hit < 0) continue;
            // Brightness above 1 is glow on the particles; here it's full.
            const b = size.lift(Math.min(1, img.data[k]));
            if (parts[hit].tint) l += b;
            else a += b;
          }
        }
        accent[y * width + x] = a / (SS * SS);
        light[y * width + x] = l / (SS * SS);
      }
    }
    const kb = (writeMask(path.join(OUT, `${id}-${name}.png`), width, height, accent) + writeMask(path.join(OUT, `${id}-${name}-light.png`), width, height, light)) / 1024;
    console.log(`${id}-${name}: ${width}×${height}, ${kb.toFixed(0)} KB`);
  }
}
