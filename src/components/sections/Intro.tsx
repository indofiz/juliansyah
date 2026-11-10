import { hero, stats } from "@/content/site";
import { DashboardMock } from "../mocks/Mocks";
import { Icon } from "../ui/Icon";
import { Badge, Button, GlowFrame, SectionHeader } from "../ui/primitives";

/**
 * Hero + stats as one pinned scene (desktop).
 *
 * The section is three screens tall and its stage sticks to the viewport, so
 * scrolling drives the animation instead of moving the page (see the intro
 * timeline in ScrollFx and the "about" keyframe in sceneKeyframes):
 *   1st screen of scroll: headline slides up, dashboard slides down,
 *                         globe rises from the bottom to the centre
 *   2nd screen:           stats copy and rows fade in around the globe
 *   then:                 the stage releases and the page scrolls on
 *
 * On screens ≤ 900px the stage is a normal scrolling layout.
 */
export function Intro() {
  return (
    <section id="hero" className="intro">
      <div className="intro-stage">
        <div className="hero-layer">
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
            <Badge icon="zap" variant="plain" className="hero-badge">
              {hero.badge}
            </Badge>
            <h1 className="display grad-text">{hero.title}</h1>
            <p className="hero-subtitle">{hero.subtitle}</p>
            <p className="hero-text">{hero.text}</p>
            <Button href="#cta" icon="wand" className="hero-cta">
              {hero.cta}
            </Button>
          </div>

          <div className="container hero-frame-wrap">
            <GlowFrame className="hero-frame" innerClassName="fade-bottom">
              <DashboardMock />
            </GlowFrame>
          </div>
        </div>

        <div id="about" className="stats-layer">
          <div className="container stats-grid">
            <div className="stats-copy">
              <SectionHeader align="left" badge={stats.badge} title={stats.title} text={stats.text} reveal={false} />
              <div className="btn-row">
                <Button href="#work" icon="wand">
                  View work
                </Button>
                <Button href="#process" variant="ghost">
                  Learn more
                </Button>
              </div>
            </div>
            <div className="stats-globe-space" />
            <ul className="stats-list">
              {stats.items.map((s) => (
                <li key={s.label} className="stat-row">
                  <Icon name={s.icon} size={18} />
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
