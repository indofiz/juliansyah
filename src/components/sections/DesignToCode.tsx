import { designToCode as d } from "@/content/site";
import { Placeholder } from "../ui/Placeholder";
import { SectionHeader } from "../ui/primitives";
import { STAGES } from "../craft/Stages";
import { DesignToCodeFx } from "../craft/DesignToCodeFx";

/**
 * Design → code: one component through five stages (sketch, wireframe,
 * design, Flutter code, running). The track is several screens tall and
 * its stage sticks to the viewport; scroll progress crossfades the stages
 * and fills the rail (DesignToCodeFx). With reduced motion nothing pins
 * and the five stages sit in a static row, each with its caption.
 */
export function DesignToCode() {
  return (
    <section id="design-to-code" className="d2c" aria-labelledby="d2c-title">
      <div className="d2c-track">
        <div className="d2c-stage">
          <div className="container d2c-grid">
            <div className="d2c-copy">
              <SectionHeader id="d2c-title" align="left" badge={d.badge} badgeIcon="code" title={d.title} text={d.text} reveal={false} />
              {/* Visual progress only; the figures below carry the same text for screen readers. */}
              <ol className="d2c-rail" aria-hidden="true">
                <span className="d2c-rail-track">
                  <span className="d2c-rail-fill" />
                </span>
                {d.stages.map((s, i) => (
                  <li key={s.id} className={`d2c-step ${i === 0 ? "is-on" : ""}`}>
                    <span className="d2c-step-n">{String(i + 1).padStart(2, "0")}</span>
                    <span className="d2c-step-label">{s.label}</span>
                    <span className="d2c-step-text">{s.text}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="d2c-view">
              <div className="frame d2c-frame">
                <div className="frame-inner d2c-canvas">
                  {d.stages.map((s, i) => {
                    const Stage = STAGES[s.id as keyof typeof STAGES];
                    return (
                      <figure key={s.id} className={`d2c-layer ${i === 0 ? "is-on" : ""}`} data-stage={s.id}>
                        <Stage />
                        <figcaption className="d2c-figcap">
                          <b>
                            {String(i + 1).padStart(2, "0")} · {s.label}
                          </b>
                          <span>{s.text}</span>
                        </figcaption>
                      </figure>
                    );
                  })}
                </div>
              </div>
              <p className="d2c-caption">
                {d.component} <span aria-hidden="true">·</span> <Placeholder text={d.note} />
              </p>
            </div>
          </div>
        </div>
      </div>
      <DesignToCodeFx />
    </section>
  );
}
