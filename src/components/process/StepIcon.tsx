import type { SVGProps } from "react";
import { iconTransform, STEP_ICONS, type StepId } from "@/lib/stepIcons";

/**
 * A How I work step icon as SVG, from the same paths the particle globe
 * turns into (lib/stepIcons.ts). Painted in `currentColor`; each part's
 * shade becomes its opacity. Used where the particles can't show the icon:
 * beside each step on phones, and in the globe's place without WebGL.
 */
export function StepIcon({ id, ...props }: { id: StepId } & SVGProps<SVGSVGElement>) {
  const icon = STEP_ICONS[id];
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false" {...props}>
      <g transform={iconTransform(icon)}>
        {icon.parts.map(({ d, shade = 1, stroke }) =>
          stroke ? (
            <path key={d} d={d} fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" opacity={shade} />
          ) : (
            <path key={d} d={d} fill="currentColor" fillRule="evenodd" opacity={shade} />
          ),
        )}
      </g>
    </svg>
  );
}
