import type { ReactNode } from "react";
import { Icon, type IconName } from "../ui/Icon";
import { Logo } from "../ui/primitives";
import { Sparkline, series } from "../ui/Sparkline";

const sideNav: { icon: IconName; label: string; tail?: "chevron" | "hot" | "ai" | "new" }[] = [
  { icon: "grid", label: "Dashboard" },
  { icon: "folder", label: "Projects", tail: "chevron" },
  { icon: "cube", label: "Lab", tail: "chevron" },
  { icon: "rocket", label: "Launch Sprint", tail: "hot" },
  { icon: "globe", label: "Case studies", tail: "chevron" },
  { icon: "file", label: "Writing" },
  { icon: "activity", label: "Analytics", tail: "ai" },
  { icon: "layers", label: "Design system", tail: "new" },
  { icon: "mail", label: "Contact" },
];

/** Sidebar + top bar chrome shared by every mock screen. */
export function MockShell({
  active = "Dashboard",
  crumb,
  sub,
  children,
}: {
  active?: string;
  crumb?: string;
  sub?: string[];
  children: ReactNode;
}) {
  return (
    <div className="mock">
      <aside className="mock-side">
        <div className="mock-brand">
          <Logo />
          <span className="mock-collapse">
            <Icon name="chevronRight" size={13} style={{ transform: "rotate(180deg)" }} />
          </span>
        </div>
        {sideNav.map((n) => (
          <div key={n.label}>
            <div className={`mock-nav ${n.label === active ? "active" : ""}`}>
              <Icon name={n.icon} size={14} />
              {n.label}
              {n.tail === "chevron" && <Icon name="chevronRight" size={13} className="tail" />}
              {n.tail === "hot" && <span className="mock-pill hot">Hot</span>}
              {n.tail === "ai" && <span className="mock-pill ai">AI</span>}
              {n.tail === "new" && <span className="mock-pill new">New</span>}
            </div>
            {n.label === active &&
              sub?.map((s, i) => (
                <div key={s} className={`mock-nav sub ${i === 1 ? "active" : ""}`} style={i === 1 ? { boxShadow: "none" } : undefined}>
                  {s}
                </div>
              ))}
          </div>
        ))}
        <div className="mock-side-foot">
          <div className="mock-tour">
            <Icon name="eye" size={13} /> Studio tour · 2 min
          </div>
          <div className="mock-switch">
            <span>Client</span>
            <span>Team</span>
          </div>
        </div>
      </aside>
      <div className="mock-main">
        <div className="mock-top">
          <div className="mock-crumb">
            <Icon name="grid" size={14} />
            {crumb ? (
              <>
                Dashboard <span>/</span> <b>{crumb}</b>
              </>
            ) : (
              <b>Dashboard</b>
            )}
          </div>
          <div className="mock-top-right">
            <span className="mock-live">Available</span>
            <span className="mock-chip">
              <Icon name="calendar" size={13} /> Next slot <b>Jan 2027</b>
            </span>
            <span className="mock-chip mock-bell">
              <Icon name="bell" size={13} />
              <i>3</i>
            </span>
            <span className="mock-avatar" />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

/** Hero frame: studio dashboard. */
export function DashboardMock() {
  return (
    <MockShell>
      <div className="mock-body">
        <div className="mock-panel mock-hero-card">
          <div className="dots" />
          <div>
            <div className="mock-greet">
              Good evening, visitor <Icon name="eye" size={14} />
            </div>
            <div className="mock-big">
              140<small>projects shipped</small>
            </div>
            <div className="mock-delta">+18 this year · 60+ clients</div>
          </div>
          <div className="mock-actions">
            <span className="mock-action on">
              <Icon name="download" size={14} /> Résumé
            </span>
            <span className="mock-action">
              <Icon name="calendar" size={14} /> Book a call
            </span>
            <span className="mock-action">
              <Icon name="mail" size={14} /> Email
            </span>
            <span className="mock-action">
              <Icon name="folder" size={14} /> Projects
            </span>
          </div>
        </div>
        <div className="mock-tiles">
          <div className="mock-panel mock-tile">
            <span className="mock-tile-label">Avg. Lighthouse score</span>
            <span className="mock-tile-value">98</span>
            <Sparkline values={series(3, 28, 0.9, 0.35)} height={44} />
          </div>
          <div className="mock-panel mock-tile">
            <span className="mock-tile-label">Avg. delivery time</span>
            <span className="mock-tile-value">4.2 wk</span>
            <Sparkline values={series(8, 28, -0.2, 0.5)} height={44} color="#66ffc4" />
          </div>
          <div className="mock-panel mock-tile">
            <span className="mock-tile-label">Client rating</span>
            <span className="mock-tile-value">4.9 / 5</span>
            <Sparkline values={series(12, 28, 0.5, 0.25)} height={44} />
          </div>
        </div>
      </div>
    </MockShell>
  );
}

const fleet = [
  { g: "SG", name: "Singapore Hub", tag: ["Air", "Express", "Priority"], up: "+24.6%", eta: "98%", n: "1,842", rank: 1 },
  { g: "RT", name: "Rotterdam Port", tag: ["Sea", "Bulk", "EU"], up: "+18.1%", eta: "96%", n: "1,126", rank: 2 },
  { g: "LA", name: "Los Angeles", tag: ["Sea", "Retail", "US"], up: "+36.8%", eta: "97%", n: "2,341", rank: 3 },
  { g: "DB", name: "Dubai Gateway", tag: ["Air", "Transit"], up: "+21.3%", eta: "95%", n: "904", rank: 4 },
  { g: "SH", name: "Shanghai", tag: ["Sea", "Electronics"], up: "+48.2%", eta: "99%", n: "1,683", rank: 5 },
  { g: "SP", name: "São Paulo", tag: ["Road", "LATAM"], up: "+29.7%", eta: "94%", n: "1,077", rank: 6 },
];

/** Case-study screens, switched by the spotlight section as you scroll. */
export function SpotlightScreen({ index }: { index: number }) {
  if (index === 1) {
    const routes = [
      ["Shanghai → LA", "14.2 d", "$2,940", "-6.1%", "down"],
      ["Rotterdam → NY", "9.8 d", "$2,180", "+3.4%", "up"],
      ["Singapore → Dubai", "6.1 d", "$1,420", "+8.9%", "up"],
      ["Santos → Lisbon", "11.5 d", "$1,960", "-2.2%", "down"],
      ["Busan → Seattle", "12.9 d", "$2,610", "+5.7%", "up"],
    ];
    return (
      <MockShell active="Case studies" crumb="Route analytics" sub={["Live globe", "Route analytics", "Alerts"]}>
        <div className="mock-body">
          <div>
            <div className="mock-h">Route Analytics</div>
            <div className="mock-sub">Cost, delay and carbon for every lane, updated hourly.</div>
          </div>
          <div className="mock-filters">
            <span className="on">All lanes</span>
            <span>Sea</span>
            <span>Air</span>
            <span>Road</span>
            <span>High delay</span>
            <span className="mock-search">
              <Icon name="search" size={12} /> Search routes…
            </span>
          </div>
          <div className="mock-panel">
            <div className="mock-bars">
              {[38, 52, 45, 70, 62, 84, 58, 76, 90, 66, 72, 95, 80, 68].map((h, i) => (
                <i key={i} style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
          <div className="mock-panel mock-table">
            <div className="mock-tr head">
              <span>Lane</span>
              <span>Avg. transit</span>
              <span>Cost / TEU</span>
              <span>vs last month</span>
              <span>Status</span>
            </div>
            {routes.map(([lane, t, c, d, dir]) => (
              <div className="mock-tr" key={lane}>
                <span>{lane}</span>
                <span>{t}</span>
                <span>{c}</span>
                <span className={dir}>{d}</span>
                <span className="mock-live">On time</span>
              </div>
            ))}
          </div>
        </div>
      </MockShell>
    );
  }

  if (index === 2) {
    const alerts = [
      ["high", "Port congestion at Long Beach", "142 shipments may slip by 2 days", "2m ago"],
      ["med", "Fuel surcharge change on 3 lanes", "Rotterdam, Hamburg, Antwerp", "18m ago"],
      ["low", "Customs cleared early", "SG-4421 released 6h ahead of schedule", "1h ago"],
      ["high", "Weather reroute suggested", "Typhoon path crosses Busan → Seattle", "2h ago"],
      ["low", "Carrier on-time rate up", "Maersk lanes now at 97%", "4h ago"],
    ];
    return (
      <MockShell active="Case studies" crumb="Smart alerts" sub={["Live globe", "Route analytics", "Alerts"]}>
        <div className="mock-body">
          <div>
            <div className="mock-h">Smart Alerts</div>
            <div className="mock-sub">Anomalies ranked by impact, with a suggested fix for each.</div>
          </div>
          <div className="mock-tabs">
            <span className="on">All</span>
            <span>High</span>
            <span>Medium</span>
            <span>Resolved</span>
          </div>
          <div className="mock-panel">
            {alerts.map(([sev, t, s, time]) => (
              <div className="mock-alert" key={t}>
                <span className={`sev ${sev}`}>{sev === "high" ? "High" : sev === "med" ? "Medium" : "Low"}</span>
                <div>
                  <b>{t}</b>
                  <small>{s}</small>
                </div>
                <small>{time}</small>
              </div>
            ))}
          </div>
          <div className="mock-panel" style={{ padding: "0.875rem" }}>
            <Sparkline values={series(21, 40, 0.3, 0.7)} height={80} color="#66ffc4" />
          </div>
        </div>
      </MockShell>
    );
  }

  return (
    <MockShell active="Case studies" crumb="Live globe" sub={["Live globe", "Route analytics", "Alerts"]}>
      <div className="mock-body">
        <div>
          <div className="mock-h">Live Shipments</div>
          <div className="mock-sub">Every hub in the network, ranked by on-time performance.</div>
        </div>
        <div className="mock-tabs">
          <span className="on">Hubs</span>
          <span>Carriers</span>
          <span>Lanes</span>
        </div>
        <div className="mock-filters">
          <span className="on">All regions</span>
          <span>APAC</span>
          <span>EMEA</span>
          <span>Americas</span>
          <span>Air</span>
          <span>Sea</span>
          <span className="mock-search">
            <Icon name="search" size={12} /> Search hubs…
          </span>
        </div>
        <div className="mock-cards">
          {fleet.map((f, i) => (
            <div className="mock-panel mock-card" key={f.name}>
              <div className="mock-card-head">
                <span className="mock-glyph">{f.g}</span>
                <div>
                  <b>{f.name}</b>
                  <small>{f.tag.join(" · ")}</small>
                </div>
                <em>#{f.rank}</em>
              </div>
              <Sparkline values={series(30 + i, 30, 0.9, 0.55)} height={46} />
              <div className="mock-kpis">
                <span>
                  Growth<b className="up">{f.up}</b>
                </span>
                <span>
                  On time<b>{f.eta}</b>
                </span>
                <span>
                  Shipments<b>{f.n}</b>
                </span>
              </div>
              <div className="mock-card-foot">
                <span>Updated live</span>
                <span>Track</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MockShell>
  );
}

function Radar() {
  const pts = (r: number) =>
    Array.from({ length: 5 }, (_, i) => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
      return `${(100 + Math.cos(a) * r).toFixed(1)},${(100 + Math.sin(a) * r).toFixed(1)}`;
    }).join(" ");
  const vals = [0.86, 0.72, 0.94, 0.6, 0.8];
  const shape = vals
    .map((v, i) => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
      return `${(100 + Math.cos(a) * 70 * v).toFixed(1)},${(100 + Math.sin(a) * 70 * v).toFixed(1)}`;
    })
    .join(" ");
  const labels = ["Speed", "Access", "SEO", "Bundle", "UX"];
  return (
    <svg viewBox="0 0 200 200" width="100%" height="220" style={{ height: "13.75rem" }} aria-hidden="true">
      {[70, 52, 34].map((r) => (
        <polygon key={r} points={pts(r)} fill="none" stroke="rgba(255,255,255,0.08)" />
      ))}
      <polygon points={shape} fill="rgba(47,227,154,0.25)" stroke="#2fe39a" strokeWidth="1.5" />
      {labels.map((l, i) => {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
        return (
          <text key={l} x={100 + Math.cos(a) * 88} y={100 + Math.sin(a) * 88 + 3} fill="#7d8783" fontSize="8.5" textAnchor="middle">
            {l}
          </text>
        );
      })}
    </svg>
  );
}

/** Featured frame: per-project analytics. */
export function AnalyticsMock() {
  const metrics = [
    ["Total sessions", "48,210", "", 0],
    ["Conversion rate", "6.8%", "up", 68],
    ["Bounce rate", "-21%", "up", 0],
    ["Largest paint", "0.9s", "up", 82],
    ["JS bundle", "142 kB", "", 0],
    ["Layout shift", "0.01", "up", 0],
    ["Avg. time on page", "3m 12s", "", 0],
    ["Best release", "+34%", "up", 0],
    ["Errors / 1k", "0.4", "down", 12],
  ] as const;
  return (
    <MockShell active="Analytics" crumb="Analytics">
      <div className="mock-body">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem" }}>
          <div>
            <div className="mock-h">Analytics</div>
            <div className="mock-sub">Track releases, spot regressions and see what moves the needle.</div>
          </div>
          <span className="mock-chip">
            <span className="mock-live" /> All projects <b>14</b>
          </span>
        </div>
        <div className="mock-tabs">
          <span>Overview</span>
          <span className="on">Performance</span>
          <span>Web Vitals</span>
          <span>Funnels</span>
          <span>Releases</span>
          <span>Notes</span>
        </div>
        <div className="mock-panel">
          <div style={{ display: "flex", alignItems: "center", padding: "0.875rem 1rem 0" }}>
            <div>
              <b style={{ fontSize: "0.9375rem", color: "#fff", fontWeight: 600 }}>Project Statistics</b>
              <div className="mock-sub">All-time</div>
            </div>
            <div className="mock-range">
              {["1D", "7D", "1M", "3M", "1Y", "ALL"].map((r) => (
                <span key={r} className={r === "ALL" ? "on" : ""}>
                  {r}
                </span>
              ))}
            </div>
          </div>
          <div className="mock-stats-grid">
            <div className="mock-panel" style={{ padding: "0.75rem" }}>
              <b style={{ fontSize: "0.75rem", color: "#fff" }}>Quality score</b>
              <Radar />
            </div>
            <div className="mock-metrics">
              {metrics.map(([label, value, dir, meter]) => (
                <div className="mock-metric" key={label}>
                  <small>{label}</small>
                  <b className={dir}>{value}</b>
                  {meter ? (
                    <div className={`mock-meter ${dir === "down" ? "red" : ""}`}>
                      <i style={{ width: `${meter}%` }} />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MockShell>
  );
}
