import { footer, site, socials } from "@/content/site";
import { Icon } from "../ui/Icon";
import { Logo } from "../ui/primitives";

const external = (href: string) =>
  /^https?:\/\//.test(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};

/** Link columns, button cards, giant glowing wordmark, small print. */
export function Footer() {
  return (
    <footer id="footer" className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Logo />
            <p className="footer-tagline">{footer.tagline}</p>
            <p className="footer-meta">{site.location}</p>
            <a className="footer-meta" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            <div className="footer-social">
              {socials.map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label} {...external(s.href)}>
                  <Icon name={s.icon} size={19} />
                </a>
              ))}
            </div>
          </div>
          {footer.columns.map((c) => (
            <div className="footer-col" key={c.title}>
              <h4>{c.title}</h4>
              {c.links.map((l) => (
                <a key={l.label} href={l.href}>
                  {l.label}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="footer-buttons">
          {footer.buttons.map((b) => (
            <a key={b.bottom} href={b.href} className="footer-btn" {...external(b.href)}>
              <Icon name={b.icon} size={24} />
              <span>
                <small>{b.top}</small>
                <b>{b.bottom}</b>
              </span>
            </a>
          ))}
        </div>
      </div>

      <div className="wordmark-wrap" aria-hidden="true">
        <span className="wordmark-glow" />
        <div className="wordmark">{site.name}</div>
      </div>

      <div className="container">
        <div className="footer-small">
          <h4>Good to know</h4>
          {footer.smallPrint.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <div className="footer-bottom">
          <span>
            © 2026 {site.name}. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
