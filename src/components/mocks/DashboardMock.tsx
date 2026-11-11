import Image from "next/image";
import { hero } from "@/content/site";
import { theme } from "@/lib/theme";
import { Icon } from "../ui/Icon";
import { Logo } from "../ui/primitives";
import { Sparkline, series } from "../ui/Sparkline";

const d = hero.dashboard;

/** One sparkline per tile. Seeded, so the server and the client draw the same line. */
const sparks = [
  { seed: 3, trend: 0.9, noise: 0.35, color: theme.accent },
  { seed: 8, trend: -0.2, noise: 0.5, color: theme.accentBright },
  { seed: 12, trend: 0.5, noise: 0.25, color: theme.accent },
];

/**
 * Moving strip of client logos. Two identical sets side by side; the track
 * slides left by exactly one set (-50%) and loops, so the seam never shows.
 * Screen readers get the first set as a list; the copy is hidden from them.
 * Pauses on hover; stands still with reduced motion.
 */
function ClientMarquee() {
  const { label, logos } = hero.dashboard.clients;
  return (
    <div className="mock-clients">
      <span id="hero-clients-label" className="mock-tile-label">
        {label}
      </span>
      <div className="mock-marquee">
        <div className="mock-marquee-track">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              className="mock-marquee-set"
              aria-labelledby={copy === 0 ? "hero-clients-label" : undefined}
              aria-hidden={copy === 1 ? true : undefined}
            >
              {logos.map((l) => (
                <li key={l.name} className={l.width / l.height > 1.5 ? "wide" : undefined}>
                  <Image src={l.src} alt={copy === 0 ? l.name : ""} title={l.name} width={l.width} height={l.height} sizes="6rem" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Hero dashboard, a preview of the design system (copy: `hero.dashboard` in
 * site.ts). Only the stat card is real (users, clients) and readable
 * by screen readers; the sample chrome and tiles around it are aria-hidden.
 */
export function DashboardMock() {
  return (
    <div className="mock">
      <aside className="mock-side" aria-hidden="true">
        <div className="mock-brand">
          <Logo decorative gradientId="lm-g-mock" />
          <span className="mock-collapse">
            <Icon name="chevronRight" size={13} style={{ transform: "rotate(180deg)" }} />
          </span>
        </div>
        {d.nav.map((n, i) => (
          <div key={n.label} className={`mock-nav ${i === 0 ? "active" : ""}`}>
            <Icon name={n.icon} size={14} />
            {n.label}
            {n.tail === "chevron" && <Icon name="chevronRight" size={13} className="tail" />}
            {n.tail && n.tail !== "chevron" && <span className={`mock-pill ${n.tail}`}>{d.pills[n.tail]}</span>}
          </div>
        ))}
        <div className="mock-side-foot">
          <div className="mock-tour">
            <Icon name="eye" size={13} /> {d.tour}
          </div>
          <div className="mock-switch">
            {d.themes.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
      </aside>

      <div className="mock-main">
        <div className="mock-top" aria-hidden="true">
          <div className="mock-crumb">
            <Icon name="grid" size={14} />
            <b>{d.crumb}</b>
          </div>
          <div className="mock-top-right">
            <span className="mock-live">{d.tag}</span>
            <span className="mock-chip">
              <Icon name="calendar" size={13} /> {d.range}
            </span>
            <span className="mock-chip mock-bell">
              <Icon name="bell" size={13} />
              <i>{d.alerts}</i>
            </span>
            <span className="mock-avatar" />
          </div>
        </div>

        <div className="mock-body">
          <div className="mock-panel mock-hero-card">
            <div className="dots" aria-hidden="true" />
            <div className="mock-hero-stat">
              <div className="mock-greet" aria-hidden="true">
                {d.greet} <Icon name="eye" size={14} />
              </div>
              <p className="mock-big">
                {d.users.value}
                <small>{d.users.label}</small>
              </p>
              <p className="mock-delta">{d.users.apps}</p>
            </div>
            <ClientMarquee />
          </div>

          <div className="mock-tiles" aria-hidden="true">
            {d.tiles.map((t, i) => {
              const s = sparks[i % sparks.length];
              return (
                <div key={t.label} className="mock-panel mock-tile">
                  <span className="mock-tile-label">{t.label}</span>
                  <span className="mock-tile-value">{t.value}</span>
                  <Sparkline values={series(s.seed, 28, s.trend, s.noise)} height={44} color={s.color} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
