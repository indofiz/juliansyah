import { howIWork as h } from "@/content/site";
import { STEP_ART } from "../process/StepArt";
import { Button, SectionHeader } from "../ui/primitives";

/**
 * How I work: main's "Seamless from Call to Launch" layout, with the globe
 * moved to the right. Copy | steps | the particle globe (the "process"
 * keyframe), and on the globe a frosted lens showing the lit step's
 * illustration (process/StepArt.tsx), which draws itself in each time.
 *
 * Desktop: the track is taller than the screen and its stage sticks, so the
 * globe holds still while scrolling fills the step track and lights each
 * step in turn; the lens follows the lit step (ScrollFx, [data-steps]).
 * Phones: title, globe, steps, buttons, nothing pinned. Reduced motion:
 * nothing pinned, every step lit, the pictures swap without moving. Without
 * WebGL the lens sits on a soft glow instead of the globe (.no-webgl).
 */
export function Process() {
  return (
    <section id="process" className="process" aria-labelledby="process-title">
      <div className="process-track" data-steps-pin>
        <div className="process-stage">
          <div className="container process-grid">
            <div className="process-copy">
              <SectionHeader id="process-title" align="left" badge={h.badge} badgeIcon="rocket" title={h.title} text={h.text} />
              <div className="btn-row process-actions" data-reveal>
                <Button href={h.primary.href} icon="wand">
                  {h.primary.label}
                </Button>
                <Button href={h.secondary.href} variant="ghost">
                  {h.secondary.label}
                </Button>
              </div>
            </div>

            {/* The globe itself is WebGL (SceneCanvas); this is its space and the lens on it. */}
            <div className="process-globe" aria-hidden="true">
              <div className="process-lens">
                <div className="process-arts">
                  {h.steps.map((s, i) => {
                    const Art = STEP_ART[s.id];
                    return (
                      <div key={s.id} className={`process-art ${i === 0 ? "on" : ""}`} data-step-art>
                        <Art />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="steps" data-steps>
              <span className="steps-track" aria-hidden="true">
                <span className="steps-fill" />
              </span>
              <ol className="steps-list">
                {h.steps.map((s, i) => (
                  <li className={`step ${i === 0 ? "on" : ""}`} key={s.id}>
                    <span className="step-dot" aria-hidden="true">
                      {i + 1}
                    </span>
                    <span className="step-label">
                      {h.stepLabel} {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="step-title">{s.title}</h3>
                    <p className="step-text">{s.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
