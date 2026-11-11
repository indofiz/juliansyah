// Generates public/textures/earth-mask.png: an equirectangular black/white
// land mask (white = land). The particle globe samples this image to decide
// where to place dots. Run with:  npm run mask
// Optional args: width (default 1024) and resolution "110m" | "50m".
//   node scripts/generate-earth-mask.mjs 2048 50m
//
// You can also skip this script and drop in any equirectangular world map
// (land = bright, ocean = dark) at the same path.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { geoEquirectangular, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import { PNG } from "pngjs";

const require = createRequire(import.meta.url);
const width = Number(process.argv[2] ?? 1024);
const res = process.argv[3] ?? "50m";
const height = width / 2;

const topo = require(`world-atlas/land-${res}.json`);
const land = feature(topo, topo.objects.land);

// d3 projects the land and cuts polygons at the antimeridian for us; we just
// record the resulting rings and fill them with a scanline rasterizer.
const rings = [];
let ring = null;
const recorder = {
  moveTo(x, y) { ring = [[x, y]]; rings.push(ring); },
  lineTo(x, y) { ring.push([x, y]); },
  closePath() {},
  arc() {},
};
const projection = geoEquirectangular()
  .scale(width / (2 * Math.PI))
  .translate([width / 2, height / 2])
  .precision(0.1);
geoPath(projection, recorder)(land);

const png = new PNG({ width, height });
for (let i = 0; i < png.data.length; i += 4) png.data[i + 3] = 255;

for (let y = 0; y < height; y++) {
  const sy = y + 0.5;
  const crossings = [];
  for (const r of rings) {
    for (let i = 0, n = r.length; i < n; i++) {
      const [x0, y0] = r[i];
      const [x1, y1] = r[(i + 1) % n];
      if ((y0 <= sy && y1 > sy) || (y1 <= sy && y0 > sy)) {
        crossings.push(x0 + ((sy - y0) / (y1 - y0)) * (x1 - x0));
      }
    }
  }
  crossings.sort((a, b) => a - b);
  for (let k = 0; k + 1 < crossings.length; k += 2) {
    const xa = Math.max(0, Math.ceil(crossings[k] - 0.5));
    const xb = Math.min(width - 1, Math.floor(crossings[k + 1] - 0.5));
    for (let x = xa; x <= xb; x++) {
      const i = (y * width + x) * 4;
      png.data[i] = png.data[i + 1] = png.data[i + 2] = 255;
    }
  }
}

const out = path.join(process.cwd(), "public", "textures", "earth-mask.png");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, PNG.sync.write(png));
console.log(`Wrote ${out} (${width}x${height}, ${res})`);
