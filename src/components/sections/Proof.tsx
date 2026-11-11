import { proof } from "@/content/site";
import { Icon } from "../ui/Icon";
import { Placeholder } from "../ui/Placeholder";
import { SectionHeader } from "../ui/primitives";

/** Proof strip: real signals around the centred globe (second screen of the pinned intro). */
export function Proof() {
  return (
    <section id="proof" className="proof-layer" aria-labelledby="proof-title">
      <div className="container proof-grid">
        <div className="proof-copy">
          <SectionHeader id="proof-title" align="left" badge={proof.badge} badgeIcon="award" title={proof.title} text={proof.text} reveal={false} />
        </div>
        <div className="proof-globe-space" />
        <ul className="proof-list">
          {proof.items.map((p) => (
            <li key={p.label} className="proof-row">
              <Icon name={p.icon} size={26} />
              <span className="proof-value">
                <strong>
                  <Placeholder text={p.value} />
                </strong>
                <span>{p.label}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
