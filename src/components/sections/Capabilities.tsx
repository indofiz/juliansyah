import type { CSSProperties } from "react";
import { capabilities } from "@/content/site";
import { Icon } from "../ui/Icon";
import { ARTS, STAGE_SIZES } from "../bento/Arts";
import { BentoFx } from "../bento/BentoFx";

/**
 * Skills bento: a tall Flutter card, two wide cards (UI/UX, front-end) and a
 * row of three. Hovering a card plays its illustration; on touch screens it
 * plays while the card is in view. On phones the cards become a swipe carousel.
 */
export function Capabilities() {
  return (
    <section id="capabilities" className="section capabilities">
      <div className="container">
        <div className="bento" data-carousel>
          {capabilities.map((c) => {
            const Art = ARTS[c.id];
            const [w, h] = STAGE_SIZES[c.id];
            return (
              <article key={c.id} className={`bento-card bento--${c.id}`} data-reveal data-slide>
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
                  <ul className="bento-tags">
                    {c.tags.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
        <div className="carousel-dots" data-carousel-nav aria-label="Skills">
          {capabilities.map((c) => (
            <span key={c.id} role="button" tabIndex={-1} aria-label={c.title} />
          ))}
        </div>
      </div>
      <BentoFx />
    </section>
  );
}
