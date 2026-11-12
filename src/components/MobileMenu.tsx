"use client";

import { useEffect, useRef, useState } from "react";
import { nav, site } from "@/content/site";
import { Icon } from "./ui/Icon";

/**
 * Mobile only (hidden above 900px): hamburger button + full-screen menu with
 * the same four links as the desktop pill, and the header hides while
 * scrolling down and comes back when scrolling up. Escape closes the menu
 * and returns focus to the button. (The accent colours have their own orb
 * in the header: AccentPicker.)
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const burger = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

  // Hide-on-scroll-down / show-on-scroll-up for the fixed mobile header.
  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".site-header");
    if (!header) return;
    let last = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      const down = y > last;
      header.classList.toggle("is-hidden", down && y > 80);
      header.classList.toggle("is-scrolled", y > 20);
      last = y;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
    if (open) firstLink.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        burger.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);
  const tab = open ? 0 : -1;

  return (
    <>
      <button
        ref={burger}
        className={`burger ${open ? "is-open" : ""}`}
        aria-label={open ? nav.menu.close : nav.menu.open}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
      </button>

      <div id="mobile-menu" className={`mobile-menu ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <nav className="mobile-menu-inner" aria-label={nav.menu.label}>
          <ul className="mm-links">
            {nav.links.map((item, i) => (
              <li key={item.href}>
                <a ref={i === 0 ? firstLink : undefined} href={item.href} onClick={close} tabIndex={tab}>
                  {item.label}
                  <Icon name="arrowRight" size={18} />
                </a>
              </li>
            ))}
          </ul>
          <div className="mm-footer">
            <a href={nav.hire.href} className="btn btn-glow btn-block" onClick={close} tabIndex={tab}>
              {nav.hire.label}
            </a>
            <a href={`mailto:${site.email}`} className="btn btn-ghost btn-block" onClick={close} tabIndex={tab}>
              {nav.email}
            </a>
            <span className="mm-email">{site.email}</span>
          </div>
        </nav>
      </div>
    </>
  );
}
