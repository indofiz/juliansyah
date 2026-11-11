import { hero, site } from "@/content/site";
import { Icon } from "../ui/Icon";
import { Button } from "../ui/primitives";
import { WorkReel } from "../work/WorkReel";

/** Who are you? Name, status, one-sentence promise, and a reel of real work. */
export function Hero() {
  return (
    <section className="hero-layer" aria-labelledby="hero-title">
      <span className="hero-gradient" aria-hidden="true" />
      {/* Four frosted-glass panels over the globe. The globe looks soft
          through the glass; the thin gaps between panels show the raw,
          sharp particles, which read as glowing dotted strips. */}
      <div className="hero-bars" aria-hidden="true">
        <span className="hero-bar hero-bar--outer" />
        <span className="hero-bar hero-bar--inner" />
        <span className="hero-bar hero-bar--inner" />
        <span className="hero-bar hero-bar--outer" />
      </div>

      <div className="hero-copy container">
        <span className="status status-live hero-status">{hero.status}</span>
        <p className="hero-name">
          <b>{site.name}</b>
          <span>{hero.roles}</span>
        </p>
        <h1 id="hero-title" className="hero-title grad-text">
          {hero.title}
        </h1>
        <p className="hero-text">{hero.text}</p>
        <div className="hero-actions">
          <Button href={hero.primary.href} icon="arrowDown">
            {hero.primary.label}
          </Button>
          <a className="link-quiet" href={hero.secondary.href}>
            {hero.secondary.label}
            <Icon name="arrowRight" size={15} />
          </a>
        </div>
      </div>

      <div className="container hero-reel-wrap">
        <WorkReel items={hero.reel} />
      </div>
    </section>
  );
}
