"use client";

import { useEffect, useState } from "react";
import { nav, site } from "@/content/site";
import { Icon } from "./ui/Icon";

/**
 * Mobile only (hidden above 900px): hamburger button + full-screen menu, and
 * the header hides while scrolling down and comes back when scrolling up.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);

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
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        className={`burger ${open ? "is-open" : ""}`}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
      </button>

      <div id="mobile-menu" className={`mobile-menu ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <nav className="mobile-menu-inner" aria-label="Mobile">
          {nav.map((item) => (
            <div className="mm-group" key={item.label}>
              {"items" in item ? (
                <>
                  <span className="mm-title">{item.label}</span>
                  {item.items.map((sub) => (
                    <a key={sub.href} href={sub.href} onClick={close} tabIndex={open ? 0 : -1}>
                      {sub.label}
                    </a>
                  ))}
                </>
              ) : (
                <a className="mm-title-link" href={item.href} onClick={close} tabIndex={open ? 0 : -1}>
                  {item.label}
                </a>
              )}
            </div>
          ))}
          <div className="mm-footer">
            <a href="#cta" className="btn btn-glow btn-block" onClick={close} tabIndex={open ? 0 : -1}>
              <Icon name="wand" size={16} /> Hire me
            </a>
            <a href="#" className="btn btn-ghost btn-block" onClick={close} tabIndex={open ? 0 : -1}>
              Résumé
            </a>
            <span className="mm-email">{site.email}</span>
          </div>
        </nav>
      </div>
    </>
  );
}
