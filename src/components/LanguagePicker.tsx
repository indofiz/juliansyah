"use client";

import { useId, type MouseEvent } from "react";
import { localeCookie, localeInfo, localHref, locales, type Locale } from "@/lib/locales";
import { usePopover } from "@/lib/usePopover";
import { useContent } from "./ContentProvider";
import { Flag } from "./ui/Flag";
import { Icon } from "./ui/Icon";

/**
 * The part of the page on screen, as an id to come back to: a homepage
 * section (#work, #process…) or a case study heading. Empty at the top.
 */
function sectionInView(): string {
  const line = window.innerHeight * 0.35;
  let id = "";
  document.querySelectorAll<HTMLElement>("main > section[id], .cs-block h2[id], footer[id]").forEach((el) => {
    if (el.getBoundingClientRect().top <= line) id = el.id;
  });
  return id;
}

/**
 * Remembers the choice (the proxy reads it on plain English URLs) and goes
 * to the same page in that language, at the same section. Without
 * JavaScript the link still works, from the top of the page.
 */
function switchTo(e: MouseEvent<HTMLAnchorElement>, locale: Locale, current: Locale) {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
  e.preventDefault();
  document.cookie = `${localeCookie}=${locale}; path=/; max-age=31536000; samesite=lax`;
  if (locale === current) return;
  const id = sectionInView();
  window.location.assign(e.currentTarget.pathname + (id ? `#${id}` : ""));
}

type LinksProps = {
  /** This page without its language: "/" or "/work/<slug>". */
  path: string;
  className: string;
  /** -1 while the list sits in a closed menu. */
  tabIndex?: number;
};

/**
 * One link per language, each name in its own language (lang + hreflang set,
 * so screen readers and search engines read it right). Plain links to the
 * same page in each language; the current one is marked with aria-current.
 */
export function LanguageLinks({ path, className, tabIndex }: LinksProps) {
  const { locale: current } = useContent();
  return (
    <ul className={className}>
      {locales.map((l) => (
        <li key={l.id}>
          <a
            href={localHref(path, l.id)}
            lang={l.id}
            hrefLang={l.id}
            className="lang-option"
            aria-current={l.id === current ? "true" : undefined}
            tabIndex={tabIndex}
            onClick={(e) => switchTo(e, l.id, current)}
          >
            <Flag locale={l.id} />
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
 * MobileMenu instead). It shows the current language's flag and opens the
 * same frosted popover as the accent orb next to it.
 */
export function LanguagePicker({ path }: { path: string }) {
  const { locale, nav } = useContent();
  const { open, setOpen, root, button, onBlur } = usePopover();
  const popId = useId();
  const lang = localeInfo(locale);
  const { label } = nav.language;

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
        <Flag locale={locale} />
      </button>
      <div id={popId} className={`lang-pop ${open ? "is-open" : ""}`}>
        <p className="lang-pop-title" aria-hidden="true">
          {label}
        </p>
        <LanguageLinks path={path} className="lang-options" />
      </div>
    </div>
  );
}
