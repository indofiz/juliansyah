import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";
import { site } from "@/content/site";

export function Badge({
  icon = "shield",
  children,
  variant,
  className = "",
}: {
  icon?: IconName;
  children: ReactNode;
  variant?: "plain" | "purple";
  className?: string;
}) {
  return (
    <span className={`badge ${variant ? `badge-${variant}` : ""} ${className}`}>
      <Icon name={icon} size={14} />
      {children}
    </span>
  );
}

type BtnVariant = "glow" | "ghost" | "ghost-mint" | "light" | "soft" | "rose" | "rose-ghost";

export function Button({
  href = "#",
  variant = "glow",
  size,
  block,
  icon,
  tone,
  children,
  className = "",
}: {
  href?: string;
  variant?: BtnVariant;
  size?: "sm" | "lg";
  block?: boolean;
  icon?: IconName;
  tone?: string;
  children: ReactNode;
  className?: string;
}) {
  const cls = ["btn", `btn-${variant}`, size && `btn-${size}`, block && "btn-block", tone && `tone-${tone}`, className]
    .filter(Boolean)
    .join(" ");
  const external = /^https?:\/\//.test(href);
  return (
    <a href={href} className={cls} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {icon && <Icon name={icon} size={16} />}
      {children}
    </a>
  );
}

export function SectionHeader({
  badge,
  badgeIcon,
  title,
  text,
  align = "center",
  as: Tag = "h2",
  reveal = true,
}: {
  badge?: string;
  badgeIcon?: IconName;
  title: ReactNode;
  text?: ReactNode;
  align?: "center" | "left";
  as?: "h1" | "h2";
  /** Fade up on scroll. Off for content animated by its own timeline. */
  reveal?: boolean;
}) {
  return (
    <header className={`sh ${align === "left" ? "left" : ""}`} data-reveal={reveal ? "" : undefined}>
      {badge && <Badge icon={badgeIcon}>{badge}</Badge>}
      <Tag className="h2 grad-text">{title}</Tag>
      {text && <p className="sh-text">{text}</p>}
    </header>
  );
}

export function GlowFrame({
  children,
  purple,
  className = "",
  innerClassName = "",
}: {
  children: ReactNode;
  purple?: boolean;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <div className={`frame ${purple ? "purple" : ""} ${className}`}>
      <div className={`frame-inner ${innerClassName}`}>{children}</div>
    </div>
  );
}

/** Small orb mark + two-tone spaced wordmark. Replace with your own logo. */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <a href="#hero" className="logo" aria-label={`${site.name} home`}>
      <svg className="logo-mark" viewBox="0 0 32 32" aria-hidden="true">
        <defs>
          <radialGradient id="lm-g" cx="35%" cy="30%" r="75%">
            <stop offset="0" style={{ stopColor: "var(--accent-100)" }} />
            <stop offset="0.45" style={{ stopColor: "var(--accent)" }} />
            <stop offset="1" style={{ stopColor: "var(--accent-800)" }} />
          </radialGradient>
        </defs>
        <circle cx="16" cy="16" r="11" fill="url(#lm-g)" />
        <ellipse cx="16" cy="16" rx="15" ry="5.5" fill="none" style={{ stroke: "var(--accent-300)" }} strokeWidth="1.4" transform="rotate(-24 16 16)" opacity="0.85" />
        <circle cx="25.5" cy="10" r="1.6" style={{ fill: "var(--accent-50)" }} />
      </svg>
      {!compact && (
        <span>
          {site.wordmark.first}
          <span className="logo-second">{site.wordmark.second}</span>
        </span>
      )}
    </a>
  );
}
