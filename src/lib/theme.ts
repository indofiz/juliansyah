/**
 * Accent colours for code that can't read CSS variables (the WebGL scene).
 * Keep in step with the accent ramp in src/styles/tokens.css. DOM elements
 * (including inline SVG) should use `var(--accent…)` instead.
 */
export const theme = {
  /** Globe / portrait particle colour (ramp 400). */
  particle: "#ff5029",
  /** Bright rim and highlight colour of the particles (ramp 100). */
  particleRim: "#ffd6c4",
  /** WebGL clear colour behind the particles. */
  canvasBg: "#060302",
} as const;
