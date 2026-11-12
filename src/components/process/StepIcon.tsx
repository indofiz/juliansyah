import { Fragment, type SVGProps } from "react";
import {
  ART_H,
  ART_W,
  artPlacements,
  figureTransform,
  flatShade,
  placementTransform,
  STEP_ART,
  type Figure,
  type StepId,
} from "@/lib/stepIcons";

/** Gap cut around everything in front of the back layer, in picture units (as the particles do). */
const GAP = 2.5;
/** Room around the picture's box for figures that reach past it. */
const PAD = 5;

/**
 * A figure's parts in `currentColor`, each part's shade as its opacity.
 * With `gap`, a page-coloured outline is painted under the whole figure
 * first, so it stands apart from what's behind it.
 */
function Parts({ figure, shade = 1, gap = 0 }: { figure: Figure; shade?: number; gap?: number }) {
  const line = { strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <>
      {gap > 0 &&
        figure.parts.map(({ d, stroke }) => (
          <path key={`gap-${d}`} d={d} fillRule="evenodd" strokeWidth={(stroke ?? 0) + 2 * gap} style={{ fill: stroke ? "none" : "var(--bg)", stroke: "var(--bg)" }} {...line} />
        ))}
      {figure.parts.map(({ d, shade: s, stroke }) => {
        const opacity = Math.min(1, flatShade(s) * shade);
        return (
          <Fragment key={d}>
            {stroke ? (
              <path d={d} fill="none" stroke="currentColor" strokeWidth={stroke} opacity={opacity} {...line} />
            ) : (
              <path d={d} fill="currentColor" fillRule="evenodd" opacity={opacity} />
            )}
          </Fragment>
        );
      })}
    </>
  );
}

/**
 * A How I work step drawn as SVG, from the same paths the particle globe
 * turns into (lib/stepIcons.ts), in `currentColor`. By default only the
 * step's icon (the picture's hero), beside each step on phones; with `art`
 * the whole picture, still, where the globe would be without WebGL.
 */
export function StepIcon({ id, art = false, ...props }: { id: StepId; art?: boolean } & SVGProps<SVGSVGElement>) {
  const step = STEP_ART[id];
  if (!art) {
    return (
      <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false" {...props}>
        <g transform={figureTransform(step.icon.figure)}>
          <Parts figure={step.icon.figure} />
        </g>
      </svg>
    );
  }
  return (
    <svg viewBox={`${-PAD} ${-PAD} ${ART_W + 2 * PAD} ${ART_H + 2 * PAD}`} aria-hidden="true" focusable="false" {...props}>
      {artPlacements(step).map((p, i) => (
        <g key={i} transform={placementTransform(p)}>
          <Parts figure={p.figure} shade={p.shade} gap={p.layer === "back" ? 0 : GAP / ((p.size / 100) * (p.figure.scale ?? 1))} />
        </g>
      ))}
    </svg>
  );
}
