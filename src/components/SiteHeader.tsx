import { nav } from "@/content/site";
import { Button, Logo } from "./ui/primitives";
import { AccentPicker } from "./AccentPicker";
import { LanguagePicker } from "./LanguagePicker";
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
          <LanguagePicker current="en" label={nav.language.label} />
          <Button variant="glow" href={nav.hire.href} className="header-cta">
            {nav.hire.label}
          </Button>
          <MobileMenu locale="en" />
        </div>
      </div>

      <NavBar />
    </>
  );
}
