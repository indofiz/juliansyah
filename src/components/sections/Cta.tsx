import type { CSSProperties } from "react";
import { cta, site } from "@/content/site";
import { Button } from "../ui/primitives";

/* Rising "particle" bars: [left %, bottom %, body height %, wick above %, wick below %] */
const candles = [
  [8, 14, 34, 6, 10],
  [22, 26, 32, 5, 6],
  [36, 24, 26, 6, 5],
  [50, 30, 34, 4, 4],
  [64, 46, 22, 5, 4],
  [78, 52, 30, 6, 3],
];

/** Big panel: corner glow that slides to the bottom as you scroll, dotted
 *  texture, and dotted-particle bars on the right. */
export function Cta() {
  return (
    <section id="cta" className="section cta">
      <div className="container">
        <div className="cta-panel" data-cta>
          <span className="cta-glow-corner" />
          <span className="cta-glow-bottom" />
          <span className="dots cta-dots" />
          <div className="cta-copy">
            <h2 className="cta-title grad-text">
              {cta.title[0]}
              <br />
              {cta.title[1]}
            </h2>
            <p className="cta-text">{cta.text}</p>
            <div className="btn-row">
              <Button href={`mailto:${site.email}`} icon="wand">
                {cta.primary}
              </Button>
              <Button href={site.github} variant="ghost">
                {cta.secondary}
              </Button>
            </div>
          </div>
          <div className="candles" aria-hidden="true">
            {candles.map(([left, bottom, h, up, down], i) => (
              <span
                key={i}
                className="candle"
                style={
                  {
                    left: `${left}%`,
                    bottom: `${bottom}%`,
                    height: `${h}%`,
                    "--up": `${up / 4}rem`,
                    "--down": `${down / 4}rem`,
                  } as CSSProperties
                }
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
