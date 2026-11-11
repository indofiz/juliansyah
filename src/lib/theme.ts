/**
 * Accent colours for code: the WebGL scene, inline SVG and content data.
 * Mirrors the accent block in src/styles/tokens.css; keep the two in step.
 */
const accent = "#ffaf4f";
const accent2 = "#e79105";
const accentBright = "#fed7ae";
const accentPale = "#fee7cf";
const accentInk = "#190e03";

export const theme = {
  accent,
  accent2,
  accentBright,
  accentPale,
  accentInk,

  /** Globe / portrait particle colour. */
  particle: accent,
  /** Bright rim and highlight colour of the particles. */
  particleRim: "#ffe7ce",
  /** WebGL clear colour behind the particles. */
  canvasBg: "#050301",

  /** Logo orb: radial gradient (light -> mid -> dark), orbit ring, highlight dot. */
  logo: { light: "#ffe2bd", mid: accent, dark: "#3a2205", ring: accentBright, dot: "#fff6ec" },
} as const;
