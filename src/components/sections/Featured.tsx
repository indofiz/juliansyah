import { featured, site } from "@/content/site";
import { AnalyticsMock } from "../mocks/Mocks";
import { Icon } from "../ui/Icon";
import { GlowFrame } from "../ui/primitives";

/** Centered statement with the purple button pair, then a big framed screen. */
export function Featured() {
  return (
    <section id="featured" className="section featured">
      <div className="container">
        <header className="sh" data-reveal>
          <h2 className="h2 grad-text featured-title">{featured.title}</h2>
          <p className="sh-text">{featured.text}</p>
          <div className="btn-row center-row">
            <a href="#spotlight" className="btn btn-purple">
              <span className="btn-icon-circle">
                <Icon name="arrowRight" size={14} />
              </span>
              {featured.primary}
            </a>
            <a href={site.github} className="btn btn-purple-ghost" target="_blank" rel="noopener noreferrer">
              {featured.secondary}
            </a>
          </div>
        </header>
        <div data-reveal>
          <GlowFrame innerClassName="fade-bottom">
            <AnalyticsMock />
          </GlowFrame>
        </div>
      </div>
    </section>
  );
}
