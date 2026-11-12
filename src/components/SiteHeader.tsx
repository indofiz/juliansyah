import { nav, site } from "@/content/site";
import { Icon } from "./ui/Icon";
import { Button, Logo } from "./ui/primitives";
import { AccentPicker } from "./AccentPicker";
import { MobileMenu } from "./MobileMenu";
import { NavBar } from "./NavBar";

/**
 * Desktop: logo + actions scroll away with the hero; the nav pill stays fixed.
 * Mobile: the header is fixed (hides on scroll down, returns on scroll up)
 * with a hamburger menu instead of the nav pill.
 */
export function SiteHeader() {
  return (
    <>
      <div className="site-header">
        <Logo />
        <div className="header-actions">
          <AccentPicker />
          <a className="icon-btn" href={site.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <Icon name="github" size={19} />
          </a>
          <Button variant="glow" href={nav.hire.href} className="header-cta">
            {nav.hire.label}
          </Button>
          <MobileMenu />
        </div>
      </div>

      <NavBar />
    </>
  );
}
