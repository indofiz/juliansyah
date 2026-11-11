/**
 * Accent colours for code that can't read CSS variables (the WebGL scene).
 * Keep in step with the accent ramp in src/styles/tokens.css. DOM elements
 * (including inline SVG) should use `var(--accent…)` instead.
 */
export const theme = {
  /** Globe / portrait particle colour (ramp 400). */
  particle: "#ff4400",
  /** Bright rim and highlight colour of the particles (ramp 100). */
  particleRim: "#ffd5c2",
  /** WebGL clear colour behind the particles. */
  canvasBg: "#040404",
} as const;
