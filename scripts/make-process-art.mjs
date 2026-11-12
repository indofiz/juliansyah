// Turns the hand-drawn illustrations in public/what-i-like (black lines on
// white fills) into masks for the "How I work" globe: the lines become
// opaque, everything else transparent. CSS paints them in the accent colour
// (mask-image), so the colour stays a design token. Run with:
//   npm run process-art
// To change a step's picture, edit ART below and run it again.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = "public/what-i-like";
const OUT = "public/process";
const SIZE = 320; // shown at up to ~150 CSS px, so this covers 2x screens

/** Output name (the step id in src/content/site.ts) → source file. */
const ART = {
  discover: "discussion 1.png",
  design: "notebook 1.png",
  build: "laptop 1.png",
  launch: "push-pins 1.png",
};

fs.mkdirSync(OUT, { recursive: true });

for (const [name, file] of Object.entries(ART)) {
  const { data, info } = await sharp(path.join(SRC, file))
    .resize(SIZE, SIZE, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // White pixels, alpha = how dark (and how opaque) the source pixel was.
  const out = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0, o = 0; i < data.length; i += info.channels, o += 4) {
    const lum = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
    out[o] = out[o + 1] = out[o + 2] = 255;
    out[o + 3] = Math.round((1 - lum) * data[i + 3]);
  }

  // Lossy WebP keeps each one under ~10 KB; the soft edges don't mind.
  const dest = path.join(OUT, `${name}.webp`);
  await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .webp({ quality: 80, alphaQuality: 70, effort: 6 })
    .toFile(dest);
  console.log(`${dest}  ${(fs.statSync(dest).size / 1024).toFixed(1)} KB`);
}
