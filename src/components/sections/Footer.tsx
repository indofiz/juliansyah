import { footer, site, socials } from "@/content/site";
import { Icon } from "../ui/Icon";
import { Placeholder, isTodo } from "../ui/Placeholder";
import { Logo } from "../ui/primitives";

const external = (href: string) => (/^https?:\/\//.test(href) ? { target: "_blank", rel: "noopener noreferrer" } : {});

// Set at build time in next.config.ts, so the page stays static.
const built = process.env.NEXT_PUBLIC_BUILD_DATE ?? "2026-11-11";
const builtLabel = new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeZone: "UTC" }).format(new Date(built));

/** Socials, link columns, résumé, last updated, giant glowing wordmark. */
export function Footer() {
  return (
    <footer id="footer" className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Logo />
            <p className="footer-tagline">{footer.tagline}</p>
            <p className="footer-meta">
              {site.location} · {site.utcOffset}
            </p>
            <div className="footer-social">
              {socials.map((s) =>
                isTodo(s.href) ? (
                  <span key={s.label} className="todo" title={s.href}>
                    {s.label}
                  </span>
                ) : (
                  <a key={s.label} href={s.href} aria-label={s.label} {...external(s.href)}>
                    <Icon name={s.icon} size={19} />
                  </a>
                ),
              )}
            </div>
          </div>
          {footer.columns.map((c) => (
            <div className="footer-col" key={c.title}>
              <h2>{c.title}</h2>
              {c.links.map((l) => (
                <a key={l.label} href={l.href}>
                  {l.label}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="footer-buttons">
          {isTodo(footer.resume.href) ? (
            <span className="footer-btn">
              <Icon name="fileDown" size={24} />
              <span>
                <small>{footer.resume.label}</small>
                <Placeholder text={footer.resume.href} />
              </span>
            </span>
          ) : (
            <a href={footer.resume.href} className="footer-btn" {...(/^https?:\/\//.test(footer.resume.href) ? external(footer.resume.href) : { download: true })}>
              <Icon name="fileDown" size={24} />
              <span>
                <small>{footer.resume.hint}</small>
                <b>{footer.resume.label}</b>
              </span>
            </a>
          )}
          <a href={site.github} className="footer-btn" {...external(site.github)}>
            <Icon name="github" size={24} />
            <span>
              <small>{footer.github.top}</small>
              <b>{footer.github.bottom}</b>
            </span>
          </a>
          <a href={`mailto:${site.email}`} className="footer-btn">
            <Icon name="mail" size={24} />
            <span>
              <small>{footer.emailButton.top}</small>
              <b>{site.email}</b>
            </span>
          </a>
        </div>
      </div>

      <div className="wordmark-wrap" aria-hidden="true">
        <span className="wordmark-glow" />
        <div className="wordmark">{site.name}</div>
      </div>

      <div className="container">
        <div className="footer-small">
          <p>{footer.smallPrint}</p>
        </div>
        <div className="footer-bottom">
          <span>
            © {built.slice(0, 4)} {site.name}. {footer.rights}
          </span>
          <span>
            {footer.lastUpdated}: <time dateTime={built}>{builtLabel}</time>
          </span>
        </div>
      </div>
    </footer>
  );
}
