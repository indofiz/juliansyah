import { Icon } from "./ui/Icon";
import { Button, Logo } from "./ui/primitives";
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
          <a className="icon-btn" href="#" aria-label="GitHub">
            <Icon name="github" size={19} />
          </a>
          <Button variant="ghost" href="#">
            Résumé
          </Button>
          <Button variant="glow" href="#cta" className="header-cta">
            Hire me
          </Button>
          <MobileMenu />
        </div>
      </div>

      <NavBar />
    </>
  );
}
