/**
 * Accent palettes: the one place accent colours are defined.
 *
 * Visitors pick one with the orb in the header (AccentPicker). The
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
    // `npm run palette -- lime "Lime" 125`, accent, accent-2, 600 and 700 taken
    // more saturated (the generator's lime is olive at ember's saturation).
    // Accent on the background 12.6:1, ink on accent 11.6:1.
    id: "lime",
    label: "Lime",
    rgb: {
      accent: "#abdb37",
      "accent-2": "#91bd19",
      "accent-bright": "#d4e7b6",
      "accent-pale": "#e5f1d3",
      "accent-ink": "#0e1305",
      "accent-50": "#f5faee",
      "accent-200": "#dcecc4",
      "accent-600": "#769c03",
      "accent-700": "#5f7e01",
      "accent-800": "#222d0b",
      "accent-900": "#151c08",
      glass: "#0b0d07",
      "glass-menu": "#060704",
    },
    raw: {
      "hero-1": "rgba(46, 59, 22, 0.8)",
      "hero-2": "rgba(35, 45, 16, 0.62)",
      "hero-3": "rgba(18, 25, 7, 0.4)",
      "hero-4": "rgba(8, 11, 4, 0.16)",
      "bar-tint": "rgba(13, 16, 7, 0.22)",
      "bezel-end": "#0c0e09",
      sheen: "#f3f6ef",
      "logo-light": "#deeec5",
      "avatar-1": "#d9efb5",
      "avatar-2": "#8bab4b",
      "avatar-3": "#3e5015",
    },
    scene: { rim: "#e5f1d3", canvas: "#030401", bloom: 1 },
  },
  {
    // `npm run palette -- emerald "Emerald" 160`, accent, accent-2, 600 and 700
    // taken more saturated (the generator's is a soft mint). Accent on the
    // background 12.2:1, ink on accent 11.2:1.
    id: "emerald",
    label: "Emerald",
    rgb: {
      accent: "#36e29a",
      "accent-2": "#06c281",
      "accent-bright": "#b8eecf",
      "accent-pale": "#d5f4e2",
      "accent-ink": "#04150c",
      "accent-50": "#effbf4",
      "accent-200": "#c6f1d8",
      "accent-600": "#019f68",
      "accent-700": "#078053",
      "accent-800": "#08301f",
      "accent-900": "#071f13",
      glass: "#070e0a",
      "glass-menu": "#040706",
    },
    raw: {
      "hero-1": "rgba(19, 63, 42, 0.8)",
      "hero-2": "rgba(14, 49, 32, 0.62)",
      "hero-3": "rgba(6, 27, 17, 0.4)",
      "hero-4": "rgba(4, 12, 7, 0.16)",
      "bar-tint": "rgba(7, 17, 12, 0.22)",
      "bezel-end": "#090e0b",
      sheen: "#f0f7f3",
      "logo-light": "#c7f4da",
      "avatar-1": "#b7f6d3",
      "avatar-2": "#44b581",
      "avatar-3": "#0a5638",
    },
    scene: { rim: "#d4f5e2", canvas: "#010402", bloom: 1.1 },
  },
  {
    // `npm run palette -- aqua "Aqua" 205`, as generated. Accent on the
    // background 12.0:1, ink on accent 11.1:1.
    id: "aqua",
    label: "Aqua",
    rgb: {
      accent: "#0bdbec",
      "accent-2": "#0fbdcc",
      "accent-bright": "#a8edf5",
      "accent-pale": "#cdf4f8",
      "accent-ink": "#001417",
      "accent-50": "#ecfbfd",
      "accent-200": "#baf0f6",
      "accent-600": "#0da1ae",
      "accent-700": "#0a8590",
      "accent-800": "#002f33",
      "accent-900": "#001e21",
      glass: "#050e0f",
      "glass-menu": "#040708",
    },
    raw: {
      "hero-1": "rgba(1, 61, 67, 0.8)",
      "hero-2": "rgba(0, 48, 52, 0.62)",
      "hero-3": "rgba(0, 26, 29, 0.4)",
      "hero-4": "rgba(2, 12, 13, 0.16)",
      "bar-tint": "rgba(5, 17, 18, 0.22)",
      "bezel-end": "#080e0f",
      sheen: "#eef7f8",
      "logo-light": "#baf3f9",
      "avatar-1": "#a4f5fe",
      "avatar-2": "#0fb1c0",
      "avatar-3": "#01535a",
    },
    scene: { rim: "#ccf4f9", canvas: "#010405", bloom: 1.11 },
  },
  {
    // `npm run palette -- azure "Azure" 255`, accent, accent-2, 600 and 700
    // taken darker so they read as blue, not pastel (like violet). Accent on the
    // background 8.3:1, ink on accent 7.7:1.
    id: "azure",
    label: "Azure",
    rgb: {
      accent: "#60a7ff",
      "accent-2": "#388cf0",
      "accent-bright": "#cae1fe",
      "accent-pale": "#dfedff",
      "accent-ink": "#07111d",
      "accent-50": "#f3f8ff",
      "accent-200": "#d5e7fe",
      "accent-600": "#1a73d5",
      "accent-700": "#0e5caf",
      "accent-800": "#142943",
      "accent-900": "#0d1a2b",
      glass: "#080c12",
      "glass-menu": "#050709",
    },
    raw: {
      "hero-1": "rgba(31, 54, 83, 0.8)",
      "hero-2": "rgba(23, 42, 65, 0.62)",
      "hero-3": "rgba(11, 23, 37, 0.4)",
      "hero-4": "rgba(5, 10, 17, 0.16)",
      "bar-tint": "rgba(9, 15, 23, 0.22)",
      "bezel-end": "#0a0d11",
      sheen: "#f1f6fc",
      "logo-light": "#d8e9fe",
      "avatar-1": "#d5e7ff",
      "avatar-2": "#63a0ec",
      "avatar-3": "#254976",
    },
    scene: { rim: "#dfedff", canvas: "#020307", bloom: 1.36 },
  },
  {
    // `npm run palette -- violet "Violet" 293`, then accent, accent-2, 600 and
    // 700 taken a little darker so they read as violet, not lavender (at ember's
    // lightness violet can't be saturated). Contrast: accent on the background
    // 7.9:1, ink on accent 7.3:1.
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
      "bezel-end": "#0d0c11",
      sheen: "#f5f4fc",
      "logo-light": "#e7e3ff",
      "avatar-1": "#e5e1fe",
      "avatar-2": "#a18de6",
      "avatar-3": "#4b3e72",
    },
    scene: { rim: "#ece8ff", canvas: "#030306", bloom: 1.4 },
  },
  {
    // `npm run palette -- rose "Rose" 355`, accent, accent-2, 600 and 700 taken
    // darker so they read as rose, not pastel. Accent on the background 8.8:1,
    // ink on accent 8.2:1.
    id: "rose",
    label: "Rose",
    rgb: {
      accent: "#fe82b6",
      "accent-2": "#ed5c9e",
      "accent-bright": "#ffd0e1",
      "accent-pale": "#fee3ec",
      "accent-ink": "#1b0b11",
      "accent-50": "#fef5f8",
      "accent-200": "#ffd9e6",
      "accent-600": "#cd4686",
      "accent-700": "#ab366e",
      "accent-800": "#3d1c29",
      "accent-900": "#27111a",
      glass: "#110a0c",
      "glass-menu": "#090506",
    },
    raw: {
      "hero-1": "rgba(77, 39, 55, 0.8)",
      "hero-2": "rgba(60, 30, 42, 0.62)",
      "hero-3": "rgba(34, 15, 23, 0.4)",
      "hero-4": "rgba(16, 7, 10, 0.16)",
      "bar-tint": "rgba(21, 11, 15, 0.22)",
      "bezel-end": "#110b0d",
      sheen: "#fbf2f5",
      "logo-light": "#fedde8",
      "avatar-1": "#fedae6",
      "avatar-2": "#db79a1",
      "avatar-3": "#6c334b",
    },
    scene: { rim: "#fee3ec", canvas: "#060203", bloom: 1.31 },
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
