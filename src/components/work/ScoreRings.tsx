import type { LighthouseScores } from "@/content/types";
import type { LocalContent } from "@/content/locale";

type Labels = LocalContent["work"]["labels"]["lighthouse"];

const CATEGORIES = ["performance", "accessibility", "bestPractices", "seo"] as const;

/** PageSpeed's bands: 90–100 pass (green), 50–89 average (orange), 0–49 fail (red). */
const band = (score: number) => (score >= 90 ? "pass" : score >= 50 ? "average" : "fail");

/** r = 100 / 2π, so the circle is 100 long and a score is its own dash length. */
const R = 15.9155;

/**
 * Lighthouse scores drawn the way PageSpeed Insights draws them: a ring per
 * category, the arc the score out of 100 in its band's colour over a tinted
 * disc, the number in the middle and the category under it. The caption
 * names the tool and the device. The number and the name are always printed,
 * so the colour never carries the score alone.
 *
 * On the homepage ScrollFx fills the arcs in as they reach the screen; the
 * markup already holds the final values (no script, reduced motion).
 */
export function ScoreRings({
  scores,
  labels,
  size = "sm",
  className = "",
}: {
  scores: LighthouseScores;
  labels: Labels;
  size?: "sm" | "lg";
  className?: string;
}) {
  return (
    <figure className={`scores scores--${size} ${className}`}>
      <figcaption className="scores-caption">
        {labels.title} · {labels[scores.device]}
      </figcaption>
      <ul className="scores-list">
        {CATEGORIES.map((key) => {
          const value = Math.max(0, Math.min(100, Math.round(scores[key])));
          return (
            <li key={key} className={`score score--${band(value)}`}>
              <span className="score-ring" aria-hidden="true">
                <svg viewBox="0 0 36 36">
                  <circle className="score-base" cx="18" cy="18" r={R} />
                  <circle
                    className="score-arc"
                    cx="18"
                    cy="18"
                    r={R}
                    strokeDasharray={`${value} 100`}
                    transform="rotate(-90 18 18)"
                  />
                </svg>
                <span className="score-value">{value}</span>
              </span>
              <span className="score-label">
                {labels[key]}
                <span className="sr-only">
                  : {value} {labels.outOf}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}
