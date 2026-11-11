import { portal } from "@/content/site";
import { PortalMock } from "../mocks/InteractiveMocks";
import { GlowFrame, SectionHeader } from "../ui/primitives";

/** Copy on the left, a framed portal UI that bleeds off the right edge. */
export function Portal() {
  return (
    <section id="portal" className="section portal">
      <div className="portal-grid">
        <div className="portal-copy">
          <SectionHeader align="left" badge={portal.badge} badgeIcon="shield" title={portal.title} text={portal.text} />
        </div>
        <div className="portal-frame" data-reveal>
          <GlowFrame innerClassName="fade-bottom">
            <PortalMock />
          </GlowFrame>
        </div>
      </div>
    </section>
  );
}
