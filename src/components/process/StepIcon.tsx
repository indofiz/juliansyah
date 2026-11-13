import type { CSSProperties, HTMLAttributes } from "react";
import type { StepId } from "@/lib/stepScenes";

/**
 * A How I work step's picture as an image, rendered by `npm run step-art`
 * from the same 3D scene the particle globe turns into (lib/stepScenes.ts).
 * Two masks, painted in the palette's accent and in its light rim colour
 * (.step-picture in sections.css), so it follows the accent picker.
 *
 * By default the small icon beside each step on phones; with `art` the
 * whole picture in a 1.9 × 2.4 box (globe radii), placed as the particles
 * place it, where the globe would be without WebGL.
 */
export function StepIcon({ id, art = false, className = "", style, ...props }: { id: StepId; art?: boolean } & HTMLAttributes<HTMLSpanElement>) {
  const src = `/process/${id}-${art ? "art" : "icon"}`;
  const masks = { "--mask": `url(${src}.png)`, "--mask-light": `url(${src}-light.png)` } as CSSProperties;
  return <span aria-hidden="true" className={`step-picture ${className}`} style={{ ...masks, ...style }} {...props} />;
}
