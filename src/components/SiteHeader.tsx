import { nav } from "@/content/site";
import { Icon } from "./ui/Icon";
import { Button, Logo } from "./ui/primitives";

/** Logo + actions scroll away with the hero; the nav pill stays fixed. */
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
          <Button variant="glow" href="#cta">
            Hire me
          </Button>
        </div>
      </div>

      <nav className="nav" aria-label="Main">
        {nav.map((item) =>
          "items" in item ? (
            <div className="nav-item" key={item.label}>
              <button className="nav-link" aria-haspopup="true">
                {item.label}
                <Icon name="chevronDown" size={15} />
              </button>
              <div className="nav-menu" role="menu">
                {item.items.map((sub) => (
                  <a key={sub.href} href={sub.href} role="menuitem">
                    {sub.label}
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <div className="nav-item" key={item.label}>
              <a className="nav-link" href={item.href}>
                {item.label}
              </a>
            </div>
          ),
        )}
      </nav>
    </>
  );
}
