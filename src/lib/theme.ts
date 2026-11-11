/**
 * Accent colours for code: the WebGL scene, inline SVG and content data.
 * Mirrors the accent block in src/styles/tokens.css; keep the two in step.
 */
const accent = "#ff4400";
const accent2 = "#e63600";
const accentBright = "#ff7a45";
const accentPale = "#ffd5c2";
const accentInk = "#140300";

export const theme = {
  accent,
  accent2,
  accentBright,
  accentPale,
  accentInk,

  /** Globe / portrait particle colour. */
  particle: accent,
  /** Bright rim and highlight colour of the particles. */
  particleRim: "#ffd5c2",
  /** WebGL clear colour behind the particles. */
  canvasBg: "#040404",

  /** Logo orb: radial gradient (light -> mid -> dark), orbit ring, highlight dot. */
  logo: { light: accentPale, mid: accent, dark: "#440b00", ring: accentBright, dot: "#fff2eb" },

  /** Design-system card swatches, darkest first. */
  swatches: [
    ["#260600", "900"],
    ["#7a1600", "700"],
    [accent2, "500"],
    [accent, "400"],
    [accentPale, "100"],
  ] as const,

  /** Colour of the flagship project in the work table. */
  orbit: accent,
} as const;
