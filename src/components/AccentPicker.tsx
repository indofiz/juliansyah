"use client";

import { useEffect, useId, type CSSProperties } from "react";
import { nav } from "@/content/site";
import { setAccent, useAccentId } from "@/lib/accent";
import { palettes } from "@/lib/palettes";
import { usePopover } from "@/lib/usePopover";
import { Icon } from "./ui/Icon";

/**
 * The palettes as a radio group: native radios, so arrow keys move between
 * them and only the chosen one is a tab stop. Each swatch shows its own
 * palette's accent. The names are visible on desktop and read out (but
 * hidden) on phones.
 */
export function AccentOptions() {
  const current = useAccentId();
  const name = useId();
  return (
    <div className="accent-options" role="radiogroup" aria-label={nav.accent.label}>
      {palettes.map((p) => (
        <label key={p.id} className="accent-option">
          <input
            type="radio"
            className="sr-only"
            name={name}
            value={p.id}
            checked={current === p.id}
            onChange={() => setAccent(p.id)}
          />
          <span className="accent-swatch" style={{ "--swatch": p.rgb.accent } as CSSProperties} aria-hidden="true" />
          <span className="accent-name">{p.label}</span>
          <Icon name="check" size={15} className="accent-check" />
        </label>
      ))}
    </div>
  );
}

/**
 * An orb in the current accent, in the header. Desktop: it opens a small
 * frosted popover listing the palettes by name, under the orb. Phones: a
 * column of round swatches without text, on the right edge, centred
 * vertically (the header stays in place while it's open: see mobile.css).
 * It stays open while you try colours; Escape, a tap outside or tabbing
 * away closes it.
 */
export function AccentPicker() {
  const { open, setOpen, root, button, onBlur } = usePopover();
  const popId = useId();

  // Phones: keeps the header (and the column inside it) from sliding away.
  useEffect(() => {
    document.documentElement.classList.toggle("accent-open", open);
    return () => document.documentElement.classList.remove("accent-open");
  }, [open]);

  return (
    <div ref={root} className="accent-picker" onBlur={onBlur}>
      <button
        ref={button}
        type="button"
        className="icon-btn accent-btn"
        aria-label={nav.accent.label}
        title={nav.accent.label}
        aria-expanded={open}
        aria-controls={popId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="accent-dot" aria-hidden="true" />
      </button>
      <div id={popId} className={`accent-pop ${open ? "is-open" : ""}`}>
        <p className="accent-pop-title" aria-hidden="true">
          {nav.accent.label}
        </p>
        <AccentOptions />
      </div>
    </div>
  );
}
