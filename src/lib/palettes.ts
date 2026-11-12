/**
 * Accent palettes: the one place accent colours are defined.
 *
 * Visitors pick one with the swatch in the header (phones: in the menu). The
 * first palette is the default. To add one:
 *   1. `npm run palette -- <id> "<Label>" <hue>` prints a palette with every
 *      colour moved to that OKLCH hue at ember's lightness, plus a contrast
 *      check. Paste it into the list below and tune it by eye.
 *   2. That's all: the CSS, the swatch in the picker, the no-flash script
 *      and the 3D scene all read this list.
 *
 * How it reaches the page: the layout prints `paletteCss` (`:root` for the
 * default, `:root[data-accent="<id>"]` for the rest) and `paletteScript`,
 * which sets `data-accent` on <html> before the first paint. tokens.css
 * builds the solid and translucent colours from these values.
 *
 * Keep this file free of imports and non-erasable TypeScript: the palette
 * script loads it straight into Node.
 */

export type Hex = `#${string}`;

/** Emitted as `--<name>-rgb: r g b`; tokens.css makes `--<name>` and translucent mixes from them. */
type RgbToken =
  | "accent" // main accent: links, highlights, particles
  | "accent-2" // deeper accent
  | "accent-bright" // light accent: logo ring, sparkline
  | "accent-pale" // near-white accent: button sweep
  | "accent-ink" // text on accent fills
  | "accent-50"
  | "accent-200"
  | "accent-600"
  | "accent-700"
  | "accent-800"
  | "accent-900"
  | "glass" // tint of the frosted nav pill and phone header
  | "glass-menu"; // tint of the phone menu

/** Emitted as-is: `--<name>: value`. */
type RawToken =
  | "hero-1" // hero glow behind the headline, top to edge (stops 0 / 30 / 60 / 85%)
  | "hero-2"
  | "hero-3"
  | "hero-4"
  | "bar-tint" // frosted glass bars over the globe
  | "lens" // frosted lens over the globe in How I work
  | "bezel-end" // dark end of the phone and screen frame bezels
  | "sheen" // warm white in the primary button's light sweep
  | "logo-light" // logo orb highlight
  | "avatar-1" // sample avatar orb in the hero dashboard: light, mid, dark
  | "avatar-2"
  | "avatar-3";

export type Palette = {
  id: string;
  /** Shown in the picker. */
  label: string;
  rgb: Record<RgbToken, Hex>;
  raw: Record<RawToken, string>;
  /** WebGL: particle rim highlight, canvas clear colour (the page background
   *  behind every section) and bloom strength. Particles use `rgb.accent`. */
  scene: { rim: Hex; canvas: Hex; bloom: number };
};

export const palettes = [
  {
    id: "ember",
    label: "Ember",
    rgb: {
      accent: "#ffaf4f",
      "accent-2": "#e79105",
      "accent-bright": "#fed7ae",
      "accent-pale": "#fee7cf",
      "accent-ink": "#190e03",
      "accent-50": "#fff6ec",
      "accent-200": "#fedfbe",
      "accent-600": "#c87a05",
      "accent-700": "#a86206",
      "accent-800": "#3a2205",
      "accent-900": "#241604",
      glass: "#100b06",
      "glass-menu": "#080604",
    },
    raw: {
      "hero-1": "rgba(73, 47, 14, 0.8)",
      "hero-2": "rgba(57, 36, 10, 0.62)",
      "hero-3": "rgba(32, 19, 4, 0.4)",
      "hero-4": "rgba(15, 8, 3, 0.16)",
      "bar-tint": "rgba(20, 13, 6, 0.22)",
      lens: "rgba(14, 10, 6, 0.5)",
      "bezel-end": "#100c08",
      sheen: "#faf4ee",
      "logo-light": "#ffe2bd",
      "avatar-1": "#ffe1a8",
      "avatar-2": "#d38b3a",
      "avatar-3": "#6b3a12",
    },
    scene: { rim: "#ffe7ce", canvas: "#050301", bloom: 1.15 },
  },
  {
    // `npm run palette -- violet "Violet" 293`, then accent, accent-2, 600
    // and 700 taken a little darker so they read as violet, not lavender
    // (at ember's lightness violet can't be saturated). Contrast: accent on
    // the background 7.9:1, ink on accent 7.3:1.
    id: "violet",
    label: "Violet",
    rgb: {
      accent: "#aa8fff",
      "accent-2": "#946cf8",
      "accent-bright": "#dfd9fe",
      "accent-pale": "#ebe8ff",
      "accent-ink": "#110e1c",
      "accent-50": "#f8f6fe",
      "accent-200": "#e5e0ff",
      "accent-600": "#7d53dc",
      "accent-700": "#653fb7",
      "accent-800": "#292241",
      "accent-900": "#1a1629",
      glass: "#0c0b12",
      "glass-menu": "#060609",
    },
    raw: {
      "hero-1": "rgba(55, 47, 81, 0.8)",
      "hero-2": "rgba(42, 36, 63, 0.62)",
      "hero-3": "rgba(23, 19, 36, 0.4)",
      "hero-4": "rgba(10, 8, 17, 0.16)",
      "bar-tint": "rgba(15, 13, 22, 0.22)",
      lens: "rgba(11, 10, 15, 0.5)",
      "bezel-end": "#0d0c11",
      sheen: "#f5f4fc",
      "logo-light": "#e7e3ff",
      "avatar-1": "#e5e1fe",
      "avatar-2": "#a18de6",
      "avatar-3": "#4b3e72",
    },
    scene: { rim: "#ece8ff", canvas: "#030306", bloom: 1.4 },
  },
] as const satisfies readonly Palette[];

export type PaletteId = (typeof palettes)[number]["id"];

export const defaultPalette: Palette = palettes[0];

export const isPaletteId = (value: unknown): value is PaletteId => palettes.some((p) => p.id === value);

export const getPalette = (id: PaletteId): Palette => palettes.find((p) => p.id === id) ?? defaultPalette;

/** localStorage key holding the visitor's choice. */
export const ACCENT_STORAGE_KEY = "accent";

/** "#ffaf4f" → "255 175 79". */
export const hexToRgb = (hex: string): string =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(" ");

/** "#ffaf4f", 0.5 → "rgba(255,175,79,0.5)" (for places that can't use CSS variables, like the OG image). */
export const hexAlpha = (hex: string, alpha: number): string => `rgba(${hexToRgb(hex).replaceAll(" ", ",")},${alpha})`;

const declarations = (p: Palette) =>
  [
    ...Object.entries(p.rgb).map(([name, hex]) => `--${name}-rgb:${hexToRgb(hex)}`),
    ...Object.entries(p.raw).map(([name, value]) => `--${name}:${value}`),
  ].join(";");

/** Every palette's custom properties, printed into <head> by the layout. */
export const paletteCss = palettes
  .map((p, i) => `${i === 0 ? ":root" : `:root[data-accent="${p.id}"]`}{${declarations(p)}}`)
  .join("\n");

/**
 * Runs in <head> before the first paint: applies the saved palette, if it's
 * one we know. Without it the page would flash the default first.
 */
export const paletteScript = `(function(){try{var a=localStorage.getItem(${JSON.stringify(ACCENT_STORAGE_KEY)});if(${JSON.stringify(
  palettes.map((p) => p.id),
)}.indexOf(a)>0)document.documentElement.setAttribute("data-accent",a)}catch(e){}})()`;
