import { hero, site } from "@/content/site";
import { Icon } from "../ui/Icon";
import { Button, GlowFrame } from "../ui/primitives";
import { DashboardMock } from "../mocks/DashboardMock";

/** Eight-spoked asterisk between the greeting and the tagline. Drawn, not
 *  typed: the ✳ character turns into a green emoji tile on Apple devices. */
function Spark() {
  return (
    <svg className="hero-eyebrow-spark" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3v18M3 12h18M5.64 5.64l12.72 12.72M18.36 5.64 5.64 18.36" />
    </svg>
  );
}

/** Who are you? Greeting, one-line promise, what you get, and a preview of the design system. */
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
        <p className="hero-eyebrow">
          <span>
            {hero.eyebrow.greeting} <b>{site.name}</b>
          </span>
          <Spark />
          <span className="sr-only">, </span>
          <span className="hero-eyebrow-tagline">{hero.eyebrow.tagline}</span>
        </p>
        <h1 id="hero-title" className="hero-title grad-text">
          {hero.title}
        </h1>
        <p className="hero-text">{hero.text}</p>
        <div className="hero-actions">
          <Button href={hero.primary.href} iconEnd="arrowUpRight">
            {hero.primary.label}
          </Button>
          <a className="link-quiet" href={hero.secondary.href}>
            {hero.secondary.label}
            <Icon name="arrowRight" size={15} />
          </a>
        </div>
      </div>

      {/* Design-system preview: real stat card (users, clients, socials)
          inside sample dashboard chrome. */}
      <div className="container hero-frame-wrap">
        <GlowFrame className="hero-frame" innerClassName="fade-bottom">
          <DashboardMock />
        </GlowFrame>
      </div>
    </section>
  );
}
