import { proof } from "@/content/site";
import { Icon } from "../ui/Icon";
import { Placeholder } from "../ui/Placeholder";
import { Button, SectionHeader } from "../ui/primitives";

/**
 * Track record: numbers around the centred globe (second screen of the pinned
 * intro). Each row is one line: icon, number, label. The rows share one grid
 * (subgrid), so numbers and labels line up in columns.
 */
export function Proof() {
  return (
    <section id="proof" className="proof-layer" aria-labelledby="proof-title">
      <div className="container proof-grid">
        <div className="proof-copy">
          <SectionHeader id="proof-title" align="left" badge={proof.badge} badgeIcon="shield" title={proof.title} text={proof.text} reveal={false} />
          <div className="btn-row proof-actions">
            <Button href={proof.primary.href} icon="wand">
              {proof.primary.label}
            </Button>
            <Button href={proof.secondary.href} variant="ghost">
              {proof.secondary.label}
            </Button>
          </div>
        </div>
        <div className="proof-globe-space" />
        <ul className="proof-list">
          {proof.items.map((p) => (
            <li key={p.label} className="proof-row">
              <Icon name={p.icon} size={28} />
              <strong>
                <Placeholder text={p.value} />
              </strong>
              <span>{p.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
