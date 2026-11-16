"use client";

import { useId } from "react";
import { localeHome, locales, type Locale } from "@/lib/locales";
import { usePopover } from "@/lib/usePopover";
import { Icon } from "./ui/Icon";

type LinksProps = {
  current: Locale;
  className: string;
  /** -1 while the list sits in a closed menu. */
  tabIndex?: number;
};

/**
 * One link per language, each name in its own language (lang + hreflang set,
 * so screen readers and search engines read it right). Plain links: they
 * work without JavaScript. The current one is marked with aria-current.
 */
export function LanguageLinks({ current, className, tabIndex }: LinksProps) {
  return (
    <ul className={className}>
      {locales.map((l) => (
        <li key={l.id}>
          <a
            href={localeHome(l.id)}
            lang={l.id}
            hrefLang={l.id}
            className="lang-option"
            aria-current={l.id === current ? "true" : undefined}
            tabIndex={tabIndex}
          >
            <span className="lang-name">{l.label}</span>
            <Icon name="check" size={15} className="lang-check" />
          </a>
        </li>
      ))}
    </ul>
  );
}

/**
 * The language button in the desktop header (phones get a row in
 * MobileMenu instead). It shows the current language's code and opens the
 * same frosted popover as the accent orb next to it.
 */
export function LanguagePicker({ current, label }: { current: Locale; label: string }) {
  const { open, setOpen, root, button, onBlur } = usePopover();
  const popId = useId();
  const lang = locales.find((l) => l.id === current) ?? locales[0];

  return (
    <div ref={root} className="lang-picker" onBlur={onBlur}>
      <button
        ref={button}
        type="button"
        className="icon-btn lang-btn"
        aria-label={`${label}: ${lang.label}`}
        title={label}
        aria-expanded={open}
        aria-controls={popId}
        onClick={() => setOpen((v) => !v)}
      >
        <span aria-hidden="true">{lang.short}</span>
      </button>
      <div id={popId} className={`lang-pop ${open ? "is-open" : ""}`}>
        <p className="lang-pop-title" aria-hidden="true">
          {label}
        </p>
        <LanguageLinks current={current} className="lang-options" />
      </div>
    </div>
  );
}
