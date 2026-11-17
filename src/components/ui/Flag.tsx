import { useId } from "react";
import type { Locale } from "@/lib/locales";

/**
 * A language's flag as a small circle, drawn inline (no image to load): the
 * Union Jack for English (the site's copy is British English) and the Merah
 * Putih for Bahasa Indonesia. Decorative: the language's name is always next
 * to it or in the button's label.
 */
export function Flag({ locale, className = "" }: { locale: Locale; className?: string }) {
  // Unique per copy (the header button, the popover and the phone menu each draw one).
  const clip = `flag-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <span className={`flag ${className}`} aria-hidden="true">
      {locale === "id" ? (
        <svg viewBox="0 0 30 30" focusable="false">
          <rect width="30" height="15" fill="#e70011" />
          <rect y="15" width="30" height="15" fill="#fff" />
        </svg>
      ) : (
        // The standard 60×30 Union Jack, cropped to its centre square. The
        // clip offsets the red diagonals, as on the real flag.
        <svg viewBox="15 0 30 30" focusable="false">
          <clipPath id={clip}>
            <path d="M30 15h30v15zv15H0zH0V0zV0h30z" />
          </clipPath>
          <rect width="60" height="30" fill="#012169" />
          <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6" />
          <path d="M0 0l60 30m0-30L0 30" clipPath={`url(#${clip})`} stroke="#c8102e" strokeWidth="4" />
          <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
          <path d="M30 0v30M0 15h60" stroke="#c8102e" strokeWidth="6" />
        </svg>
      )}
    </span>
  );
}
