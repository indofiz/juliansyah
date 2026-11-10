import { pricing } from "@/content/site";
import { Badge, Button, SectionHeader } from "../ui/primitives";

/** Three plans, the middle one highlighted with a glowing edge. */
export function Pricing() {
  return (
    <section id="pricing" className="section pricing">
      <div className="container">
        <SectionHeader badge={pricing.badge} badgeIcon="crown" title={pricing.title} />
        <div className="plans">
          {pricing.plans.map((p) => (
            <article key={p.name} className={`plan ${"popular" in p && p.popular ? "popular" : ""}`} data-reveal>
              <div className="plan-head">
                <h3>{p.name}</h3>
                {"popular" in p && p.popular && (
                  <Badge icon="crown" variant="plain" className="badge-sm">
                    Most popular
                  </Badge>
                )}
              </div>
              <p className="plan-text">{p.text}</p>
              <div className="plan-actions">
                <Button href="#cta" icon="wand" block>
                  Start a project
                </Button>
                <Button href="#cta" variant="ghost-mint" block>
                  Book a call
                </Button>
              </div>
              <ul className="plan-list">
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
