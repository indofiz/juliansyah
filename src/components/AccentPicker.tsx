"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { nav } from "@/content/site";
import { setAccent, useAccentId } from "@/lib/accent";
import { palettes } from "@/lib/palettes";
import { Icon } from "./ui/Icon";

/**
 * The palettes as a radio group: native radios, so arrow keys move between
 * them and only the chosen one is a tab stop. Each swatch shows its own
 * palette's accent. Used in the header popover and in the phone menu.
 */
export function AccentOptions({ tabIndex }: { tabIndex?: number }) {
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
            tabIndex={tabIndex}
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
 * Desktop: a dot in the current accent opens a small frosted popover with
 * the palettes (hidden on phones, where the menu lists them). It stays open
 * while you try colours; Escape, a click outside or tabbing away closes it.
 */
export function AccentPicker() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const popId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      if (root.current?.contains(document.activeElement)) button.current?.focus();
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={root}
      className="accent-picker"
      onBlur={(e) => {
        // relatedTarget is null when Safari drops focus on a click inside;
        // clicks outside are handled by the pointerdown listener.
        if (e.relatedTarget && !root.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
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
