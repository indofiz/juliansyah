/**
 * Prints a new accent palette for src/lib/palettes.ts, made from the default
 * palette (ember) by moving every colour to another hue while keeping its
 * OKLCH lightness, so contrast stays where ember has it. Colours that can't
 * keep their saturation at that lightness lose some (lightness wins).
 *
 *   npm run palette -- <id> "<Label>" <hue 0–360>
 *   npm run palette -- violet "Violet" 293
 *
 * Hues: red ≈ 25, orange ≈ 55, ember ≈ 68, yellow ≈ 95, green ≈ 145,
 * teal ≈ 185, cyan ≈ 215, blue ≈ 260, violet ≈ 293, pink ≈ 350.
 * Paste the output into the `palettes` list, then tune it by eye (a richer
 * accent often needs a slightly lower lightness; check the contrast lines).
 */
import { palettes } from "../src/lib/palettes.ts";

const [id, label, hueArg] = process.argv.slice(2);
const hue = Number(hueArg);
if (!id || !label || !Number.isFinite(hue)) {
  console.error('Usage: npm run palette -- <id> "<Label>" <hue 0-360>');
  process.exit(1);
}

// ---- sRGB <-> OKLCH -------------------------------------------------------
const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const fromLinear = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

function rgbToOklch([r, g, b]) {
  const [R, G, B] = [r, g, b].map((v) => toLinear(v / 255));
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return [L, Math.hypot(a, bb)];
}

function oklchToLinear(L, C, H) {
  const a = C * Math.cos((H * Math.PI) / 180);
  const b = C * Math.sin((H * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

/** Same lightness and (as much as fits in sRGB) chroma, new hue. */
function shift(rgb) {
  const [L, C0] = rgbToOklch(rgb);
  let C = C0;
  let lin = oklchToLinear(L, C, hue);
  while (C > 0 && lin.some((v) => v < -1e-4 || v > 1 + 1e-4)) {
    C = Math.max(0, C - 0.002);
    lin = oklchToLinear(L, C, hue);
  }
  return lin.map((v) => Math.round(Math.min(1, Math.max(0, fromLinear(v))) * 255));
}

// ---- parsing / printing ---------------------------------------------------
const parseHex = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const toHex = (rgb) => "#" + rgb.map((v) => v.toString(16).padStart(2, "0")).join("");

/** Shifts every #hex and rgb()/rgba() colour inside a CSS value, keeping alpha. */
function shiftValue(value) {
  return value
    .replace(/#[0-9a-f]{6}\b/gi, (hex) => toHex(shift(parseHex(hex))))
    .replace(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/g, (_, r, g, b) => {
      const [R, G, B] = shift([+r, +g, +b]);
      return `rgba(${R}, ${G}, ${B}`;
    });
}

const luminance = (hex) => {
  const [r, g, b] = parseHex(hex).map((v) => toLinear(v / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (x, y) => {
  const [a, b] = [luminance(x), luminance(y)].sort((p, q) => q - p);
  return ((a + 0.05) / (b + 0.05)).toFixed(2);
};

const base = palettes[0];
const rgb = Object.fromEntries(Object.entries(base.rgb).map(([k, v]) => [k, toHex(shift(parseHex(v)))]));
const raw = Object.fromEntries(Object.entries(base.raw).map(([k, v]) => [k, shiftValue(v)]));
const scene = { rim: toHex(shift(parseHex(base.scene.rim))), canvas: toHex(shift(parseHex(base.scene.canvas))) };
// Bloom reacts to brightness: a darker accent needs a little more to glow as much.
const bloom = Math.min(1.6, +(base.scene.bloom * Math.sqrt(luminance(base.rgb.accent) / luminance(rgb.accent))).toFixed(2));

const q = (k) => (/^[a-z]+$/.test(k) ? k : JSON.stringify(k));
const lines = (obj) =>
  Object.entries(obj)
    .map(([k, v]) => `      ${q(k)}: ${JSON.stringify(v)},`)
    .join("\n");

console.log(`  {
    id: ${JSON.stringify(id)},
    label: ${JSON.stringify(label)},
    rgb: {
${lines(rgb)}
    },
    raw: {
${lines(raw)}
    },
    scene: { rim: ${JSON.stringify(scene.rim)}, canvas: ${JSON.stringify(scene.canvas)}, bloom: ${bloom} },
  },`);

const bg = "#060403";
console.error(`
Contrast (WCAG; 4.5 is the floor for text):
  accent on page background   ${contrast(rgb.accent, bg)}  (${base.id} ${contrast(base.rgb.accent, bg)})
  ink on accent fill          ${contrast(rgb["accent-ink"], rgb.accent)}  (${base.id} ${contrast(base.rgb["accent-ink"], base.rgb.accent)})
  accent-2 on page background ${contrast(rgb["accent-2"], bg)}  (${base.id} ${contrast(base.rgb["accent-2"], bg)})`);
