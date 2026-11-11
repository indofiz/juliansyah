import type { CSSProperties } from "react";
import type { Capability } from "@/content/types";
import { services } from "@/content/site";
import { Icon } from "../ui/Icon";
import { SectionHeader } from "../ui/primitives";
import { ARTS, STAGE_SIZES } from "../bento/Arts";
import { BentoFx } from "../bento/BentoFx";

/** Which illustration (and bento slot) each group uses. */
const ART: Record<Capability["id"], keyof typeof ARTS> = {
  mobile: "flutter",
  design: "uiux",
  web: "frontend",
  motion: "motion",
  performance: "perf",
};

/**
 * What I do: five groups by outcome, in a bento. A tall Flutter card, two
 * wide cards (design, web) and a row of two. Hovering a card plays its
 * illustration; on touch screens it plays while the card is in view. On
 * phones the cards become a swipe carousel.
 */
export function Capabilities() {
  return (
    <section id="services" className="section capabilities" aria-labelledby="services-title">
      <div className="container">
        <SectionHeader id="services-title" badge={services.badge} badgeIcon="layers" title={services.title} text={services.text} />
        <div className="bento" data-carousel>
          {services.items.map((c) => {
            const art = ART[c.id];
            const Art = ARTS[art];
            const [w, h] = STAGE_SIZES[art];
            return (
              <article key={c.id} className={`bento-card bento--${art}`} data-reveal data-slide>
                <span className="bento-spot" aria-hidden="true" />
                <span className="bento-ring" aria-hidden="true" />
                <div className="bento-art" aria-hidden="true">
                  <div className="stage-fit" style={{ "--sw": `${w}rem`, "--sh": `${h}rem` } as CSSProperties}>
                    <Art />
                  </div>
                </div>
                <div className="bento-copy">
                  <div className="bento-title">
                    <span className="bento-icon">
                      <Icon name={c.icon} size={16} />
                    </span>
                    <h3>{c.title}</h3>
                  </div>
                  <p>{c.text}</p>
                  <ul className="bento-tags" aria-label={services.toolsLabel}>
                    {c.tools.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
        <div className="carousel-dots" data-carousel-nav>
          {services.items.map((c) => (
            <button key={c.id} type="button" aria-label={c.title} />
          ))}
        </div>
      </div>
      <BentoFx />
    </section>
  );
}
