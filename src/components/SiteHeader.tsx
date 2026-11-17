import { getContent } from "@/content";
import { Button, Logo } from "./ui/primitives";
import { AccentPicker } from "./AccentPicker";
import { LanguagePicker } from "./LanguagePicker";
import { MobileMenu } from "./MobileMenu";
import { NavBar } from "./NavBar";

/**
 * Desktop: logo + actions scroll away with the hero; the nav pill stays fixed.
 * Mobile: the header is fixed (hides on scroll down, returns on scroll up)
 * with a hamburger menu instead of the nav pill.
 *
 * `path` is this page without its language ("/" or "/work/<slug>"), so the
 * language links lead to the same page in the other language.
 */
export async function SiteHeader({ path }: { path: string }) {
  const { nav } = await getContent();
  return (
    <>
      <div className="site-header">
        <Logo />
        <div className="header-actions">
          <AccentPicker />
          <LanguagePicker path={path} />
          <Button variant="glow" href={nav.hire.href} className="header-cta">
            {nav.hire.label}
          </Button>
          <MobileMenu path={path} />
        </div>
      </div>

      <NavBar />
    </>
  );
}
