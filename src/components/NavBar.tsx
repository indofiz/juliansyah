"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { nav } from "@/content/site";
import { Icon } from "./ui/Icon";

/**
 * Desktop nav pill (hidden on mobile, which uses MobileMenu).
 *
 *  - An accent glow lives inside the frosted pill. Idle, it drifts slowly
 *    around the centre and breathes; hovering an item slides it behind that
 *    item. Leaving the nav sends it back to drifting.
 *  - Big at the top of the page, a bit smaller once scrolled (.is-compact).
 *  - Opening a dropdown grows the pill back up (.is-open), the chevron flips
 *    and a card drops in under the item.
 */
export function NavBar() {
  const navRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const idle = useRef<gsap.core.Timeline | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const [compact, setCompact] = useState(false);

  // Big at the top of the page, a bit smaller once you scroll.
  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const reduce = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Idle drift + breathing, centred in the pill.
  const startIdle = () => {
    const navEl = navRef.current;
    const glow = glowRef.current;
    if (!navEl || !glow) return;
    idle.current?.kill();
    const centre = navEl.clientWidth / 2;
    const amp = navEl.clientWidth * 0.07;
    if (reduce()) {
      gsap.to(glow, { x: centre, opacity: 0.85, duration: 0.3 });
      return;
    }
    const tl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: "sine.inOut" } });
    tl.to(glow, { x: centre - amp, opacity: 0.55, duration: 1.5 })
      .to(glow, { x: centre + amp, opacity: 1, duration: 1.6 })
      .to(glow, { x: centre + amp * 0.2, opacity: 0.7, duration: 1.2 });
    idle.current = tl;
  };

  useEffect(() => {
    const glow = glowRef.current;
    const navEl = navRef.current;
    if (!glow || !navEl) return;
    gsap.set(glow, { x: navEl.clientWidth / 2, opacity: 0.8 });
    startIdle();
    const onResize = () => active === null && startIdle();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      idle.current?.kill();
    };
    // Start once; hover handlers manage the glow afterwards.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const focusItem = (i: number) => {
    setActive(i);
    const item = itemRefs.current[i];
    const glow = glowRef.current;
    if (!item || !glow) return;
    idle.current?.kill();
    gsap.to(glow, {
      x: item.offsetLeft + item.offsetWidth / 2,
      opacity: 1,
      duration: reduce() ? 0 : 0.5,
      ease: "power3.out",
      overwrite: true,
    });
  };

  const release = () => {
    setActive(null);
    const glow = glowRef.current;
    const navEl = navRef.current;
    if (!glow || !navEl) return;
    gsap.to(glow, {
      x: navEl.clientWidth / 2,
      opacity: 0.8,
      duration: reduce() ? 0 : 0.6,
      ease: "power2.out",
      overwrite: true,
      onComplete: startIdle,
    });
  };

  const openItem = active !== null && "items" in nav[active];

  return (
    <nav
      ref={navRef}
      className={`nav ${compact ? "is-compact" : ""} ${openItem ? "is-open" : ""}`}
      aria-label="Main"
      onPointerLeave={release}
      onBlur={(e) => {
        if (!navRef.current?.contains(e.relatedTarget as Node)) release();
      }}
    >
      <span className="nav-glow-clip" aria-hidden="true">
        <span className="nav-glow" ref={glowRef} />
      </span>
      {nav.map((item, i) => (
        <div
          className={`nav-item ${active === i ? "is-active" : ""}`}
          key={item.label}
          ref={(el) => {
            itemRefs.current[i] = el;
          }}
          onPointerEnter={() => focusItem(i)}
          onFocus={() => focusItem(i)}
        >
          {"items" in item ? (
            <>
              <button className="nav-link" aria-haspopup="true" aria-expanded={active === i}>
                {item.label}
                <Icon name="chevronDown" size={15} />
              </button>
              <div className="nav-menu" role="menu">
                {item.items.map((sub) => (
                  <a key={sub.href} href={sub.href} role="menuitem" onClick={release}>
                    <span>{sub.label}</span>
                    <Icon name="chevronRight" size={14} />
                  </a>
                ))}
              </div>
            </>
          ) : (
            <a className="nav-link" href={item.href}>
              {item.label}
            </a>
          )}
        </div>
      ))}
    </nav>
  );
}
