import Link from "next/link";
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
  variant?: "plain";
  className?: string;
}) {
  return (
    <span className={`badge ${variant ? `badge-${variant}` : ""} ${className}`}>
      <Icon name={icon} size={14} />
      {children}
    </span>
  );
}

type BtnVariant = "glow" | "ghost" | "ghost-accent" | "light";

export function Button({
  href = "#",
  variant = "glow",
  size,
  block,
  icon,
  iconEnd,
  tone,
  children,
  className = "",
}: {
  href?: string;
  variant?: BtnVariant;
  size?: "sm" | "lg";
  block?: boolean;
  icon?: IconName;
  /** Icon after the label (e.g. ↗); it nudges in its own direction on hover. */
  iconEnd?: IconName;
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
      {iconEnd && <Icon name={iconEnd} size={16} className={`btn-icon-end btn-icon-${iconEnd}`} />}
    </a>
  );
}

export function SectionHeader({
  id,
  badge,
  badgeIcon,
  title,
  text,
  align = "center",
  as: Tag = "h2",
  reveal = true,
}: {
  /** Id of the heading, for aria-labelledby on the section. */
  id?: string;
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
      <Tag id={id} className="h2 grad-text">
        {title}
      </Tag>
      {text && <p className="sh-text">{text}</p>}
    </header>
  );
}

export function GlowFrame({
  children,
  className = "",
  innerClassName = "",
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <div className={`frame ${className}`}>
      <div className={`frame-inner ${innerClassName}`}>{children}</div>
    </div>
  );
}

/**
 * Small orb mark + two-tone spaced wordmark. Replace with your own logo.
 * `decorative` renders it as plain, unfocusable markup (inside mock UIs);
 * each copy on a page needs its own `gradientId`.
 */
export function Logo({
  compact = false,
  decorative = false,
  gradientId = "lm-g",
}: {
  compact?: boolean;
  decorative?: boolean;
  gradientId?: string;
}) {
  const content = (
    <>
      <svg className="logo-mark" viewBox="0 0 32 32" aria-hidden="true">
        <defs>
          <radialGradient id={gradientId} cx="35%" cy="30%" r="75%">
            <stop offset="0" style={{ stopColor: "var(--logo-light)" }} />
            <stop offset="0.45" style={{ stopColor: "var(--accent)" }} />
            <stop offset="1" style={{ stopColor: "var(--accent-800)" }} />
          </radialGradient>
        </defs>
        <circle cx="16" cy="16" r="11" fill={`url(#${gradientId})`} />
        <ellipse cx="16" cy="16" rx="15" ry="5.5" fill="none" style={{ stroke: "var(--accent-bright)" }} strokeWidth="1.4" transform="rotate(-24 16 16)" opacity="0.85" />
        <circle cx="25.5" cy="10" r="1.6" style={{ fill: "var(--accent-50)" }} />
      </svg>
      {!compact && (
        <span>
          {site.wordmark.first}
          <span className="logo-second">{site.wordmark.second}</span>
        </span>
      )}
    </>
  );
  if (decorative) return <span className="logo">{content}</span>;
  return (
    <Link href="/" className="logo" aria-label={`${site.name} home`}>
      {content}
    </Link>
  );
}
