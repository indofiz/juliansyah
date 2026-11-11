import type { ReactNode } from "react";
import { Icon, type IconName } from "../ui/Icon";
import { Logo } from "../ui/primitives";
import { Sparkline, series } from "../ui/Sparkline";

const sideNav: { icon: IconName; label: string; tail?: "chevron" | "hot" | "ai" | "new" }[] = [
  { icon: "grid", label: "Dashboard" },
  { icon: "folder", label: "Projects", tail: "chevron" },
  { icon: "cube", label: "Lab", tail: "chevron" },
  { icon: "phone", label: "Mobile apps", tail: "hot" },
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
            <Icon name="eye" size={13} /> Portfolio tour · 2 min
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
              <Icon name="globe" size={13} /> Open to <b>remote</b>
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
              7,000+<small>active app users</small>
            </div>
            <div className="mock-delta">Presensi PKP · Android &amp; iOS</div>
          </div>
          <div className="mock-actions">
            <span className="mock-action on">
              <Icon name="github" size={14} /> GitHub
            </span>
            <span className="mock-action">
              <Icon name="star" size={14} /> Case study
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
            <span className="mock-tile-label">Crash-free sessions</span>
            <span className="mock-tile-value">99.9%</span>
            <Sparkline values={series(3, 28, 0.9, 0.35)} height={44} />
          </div>
          <div className="mock-panel mock-tile">
            <span className="mock-tile-label">Client organisations</span>
            <span className="mock-tile-value">8</span>
            <Sparkline values={series(8, 28, -0.2, 0.5)} height={44} color="var(--accent-300)" />
          </div>
          <div className="mock-panel mock-tile">
            <span className="mock-tile-label">Years building</span>
            <span className="mock-tile-value">3+</span>
            <Sparkline values={series(12, 28, 0.5, 0.25)} height={44} />
          </div>
        </div>
      </div>
    </MockShell>
  );
}

// Illustrative data for the case-study screens (not real figures).
const fleet = [
  { g: "DK", name: "Diskominfo", tag: ["Dinas", "Office"], up: "+2.4%", eta: "98%", n: "126", rank: 1 },
  { g: "SD", name: "Sekretariat Daerah", tag: ["Setda", "Office"], up: "+1.8%", eta: "97%", n: "312", rank: 2 },
  { g: "BI", name: "Kec. Bukit Intan", tag: ["Kecamatan", "Field"], up: "+3.6%", eta: "96%", n: "84", rank: 3 },
  { g: "KS", name: "Dinas Kesehatan", tag: ["Dinas", "Shifts"], up: "+1.3%", eta: "95%", n: "268", rank: 4 },
  { g: "GR", name: "Kec. Gerunggang", tag: ["Kecamatan", "Field"], up: "+4.1%", eta: "95%", n: "77", rank: 5 },
  { g: "PU", name: "Dinas PUPR", tag: ["Dinas", "Field"], up: "+2.9%", eta: "94%", n: "193", rank: 6 },
];

/** Case-study screens (illustrations), switched by the spotlight section as you scroll.
 *  Replace with real Presensi PKP screenshots when available. */
export function SpotlightScreen({ index }: { index: number }) {
  if (index === 1) {
    const routes = [
      ["Diskominfo", "07:24", "98.1%", "+1.2%", "up"],
      ["Dinas Kesehatan", "07:31", "96.4%", "+0.8%", "up"],
      ["Kec. Bukit Intan", "07:38", "94.9%", "-0.6%", "down"],
      ["Sekretariat Daerah", "07:27", "97.3%", "+2.1%", "up"],
      ["Dinas PUPR", "07:42", "93.8%", "-1.4%", "down"],
    ];
    return (
      <MockShell active="Case studies" crumb="History" sub={["Live attendance", "History", "Alerts"]}>
        <div className="mock-body">
          <div>
            <div className="mock-h">Attendance History</div>
            <div className="mock-sub">Check-ins, leave and lateness for every office, updated hourly.</div>
          </div>
          <div className="mock-filters">
            <span className="on">All</span>
            <span>Present</span>
            <span>Leave</span>
            <span>Sick</span>
            <span>Late</span>
            <span className="mock-search">
              <Icon name="search" size={12} /> Search employees…
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
              <span>Office</span>
              <span>Avg. check-in</span>
              <span>Present</span>
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
      ["high", "Mock location blocked", "Fake-GPS app detected on 2 devices", "2m ago"],
      ["med", "Check-in outside geofence", "Kec. Gerunggang · 340 m from office", "18m ago"],
      ["low", "Offline check-ins synced", "48 records uploaded after reconnecting", "1h ago"],
      ["high", "Device clock mismatch", "Timestamp replaced with server time", "2h ago"],
      ["low", "Leave request approved", "Izin · 2 days · Dinas Kesehatan", "4h ago"],
    ];
    return (
      <MockShell active="Case studies" crumb="Alerts" sub={["Live attendance", "History", "Alerts"]}>
        <div className="mock-body">
          <div>
            <div className="mock-h">Smart Alerts</div>
            <div className="mock-sub">Suspicious check-ins and sync issues, ranked by impact.</div>
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
            <Sparkline values={series(21, 40, 0.3, 0.7)} height={80} color="var(--accent-300)" />
          </div>
        </div>
      </MockShell>
    );
  }

  return (
    <MockShell active="Case studies" crumb="Live attendance" sub={["Live attendance", "History", "Alerts"]}>
      <div className="mock-body">
        <div>
          <div className="mock-h">Live Attendance</div>
          <div className="mock-sub">Every office in the city, ranked by on-time check-ins today.</div>
        </div>
        <div className="mock-tabs">
          <span className="on">Offices</span>
          <span>Employees</span>
          <span>Shifts</span>
        </div>
        <div className="mock-filters">
          <span className="on">All offices</span>
          <span>Dinas</span>
          <span>Kecamatan</span>
          <span>Kelurahan</span>
          <span>Office</span>
          <span>Field</span>
          <span className="mock-search">
            <Icon name="search" size={12} /> Search offices…
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
                  vs last wk<b className="up">{f.up}</b>
                </span>
                <span>
                  On time<b>{f.eta}</b>
                </span>
                <span>
                  Checked in<b>{f.n}</b>
                </span>
              </div>
              <div className="mock-card-foot">
                <span>Updated live</span>
                <span>Details</span>
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
      <polygon points={shape} style={{ fill: "rgb(var(--accent-rgb) / 0.25)", stroke: "var(--accent)" }} strokeWidth="1.5" />
      {labels.map((l, i) => {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
        return (
          <text key={l} x={100 + Math.cos(a) * 88} y={100 + Math.sin(a) * 88 + 3} fill="#87807d" fontSize="8.5" textAnchor="middle">
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
