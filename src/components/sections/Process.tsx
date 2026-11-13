import { howIWork as h } from "@/content/site";
import { StepIcon } from "../process/StepIcon";
import { Button, SectionHeader } from "../ui/primitives";

/**
 * How I work: main's "Seamless from Call to Launch" layout, with the globe
 * moved to the right. Copy | steps | the particles (the "process"
 * keyframe), which form the lit step's 3D picture (lib/stepScenes.ts):
 * Discover's telescope as the section comes in, never the earth.
 *
 * Desktop: the track is taller than the screen and its stage sticks, so the
 * picture holds still while scrolling fills the step track, lights each
 * step in turn and turns the particles into its picture (ScrollFx,
 * [data-steps]). Phones: title, the telescope, steps, buttons, nothing
 * pinned; each step shows its own icon beside it. Reduced motion: nothing
 * pinned, every step lit, the pictures swap without moving. Without WebGL
 * the lit step's picture shows as an image where the particles would be
 * (.no-webgl).
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

            {/* The globe itself is WebGL (SceneCanvas); this is its space. */}
            <div className="process-globe" aria-hidden="true">
              <div className="process-icons">
                {h.steps.map((s, i) => (
                  <StepIcon key={s.id} id={s.id} art className={`process-icon ${i === 0 ? "on" : ""}`} data-step-icon />
                ))}
              </div>
            </div>

            <div className="steps" data-steps>
              <span className="steps-track" aria-hidden="true">
                <span className="steps-fill" />
              </span>
              <ol className="steps-list">
                {h.steps.map((s, i) => (
                  <li className={`step ${i === 0 ? "on" : ""}`} key={s.id} data-step={s.id}>
                    <span className="step-dot" aria-hidden="true">
                      {i + 1}
                    </span>
                    <StepIcon id={s.id} className="step-icon" />
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
