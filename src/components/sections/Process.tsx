import { process } from "@/content/site";
import { Button, SectionHeader } from "../ui/primitives";

/** Copy left, globe centre, steps right with a track that fills on scroll. */
export function Process() {
  return (
    <section id="process" className="section process">
      <div className="container process-grid">
        <div className="process-copy">
          <SectionHeader align="left" badge={process.badge} title={process.title} text={process.text} />
          <div className="btn-row" data-reveal>
            <Button href="#contact" icon="wand">
              Start a project
            </Button>
            <Button href="#work" variant="ghost">
              See my work
            </Button>
          </div>
        </div>
        <div className="process-globe-space" />
        <ol className="steps" data-steps>
          <span className="steps-track">
            <span className="steps-fill" />
          </span>
          {process.steps.map((s, i) => (
            <li className="step" key={s.title}>
              <span className="step-dot">{i + 1}</span>
              <span className="step-label">Step {String(i + 1).padStart(2, "0")}</span>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-text">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
