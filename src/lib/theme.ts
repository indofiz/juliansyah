/**
 * Accent colours for code that can't read CSS variables (the WebGL scene).
 * Keep in step with the accent ramp in src/styles/tokens.css. DOM elements
 * (including inline SVG) should use `var(--accent…)` instead.
 */
export const theme = {
  /** Globe / portrait particle colour (ramp 400). */
  particle: "#2fe39a",
  /** Bright rim and highlight colour of the particles (ramp 100). */
  particleRim: "#b6ffe0",
  /** WebGL clear colour behind the particles. */
  canvasBg: "#020604",
} as const;
