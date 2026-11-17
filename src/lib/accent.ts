import { useLayoutEffect, useSyncExternalStore } from "react";
import { ACCENT_STORAGE_KEY, defaultPalette, getPalette, isPaletteId, type Palette, type PaletteId } from "./palettes";

/**
 * The visitor's accent palette (client side). The source of truth is the
 * `data-accent` attribute on <html>, which the inline script in the layout
 * sets from localStorage before the first paint; no attribute means the
 * default palette. CSS follows the attribute on its own; code that needs
 * the colours as values (the WebGL scene) subscribes here.
 */

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

function read(): PaletteId {
  const id = document.documentElement.getAttribute("data-accent");
  return isPaletteId(id) ? id : (defaultPalette.id as PaletteId);
}

function apply(id: PaletteId) {
  const root = document.documentElement;
  if (id === defaultPalette.id) root.removeAttribute("data-accent");
  else root.setAttribute("data-accent", id);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Another tab picked a palette: follow it.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== ACCENT_STORAGE_KEY) return;
    apply(isPaletteId(e.newValue) ? e.newValue : (defaultPalette.id as PaletteId));
    notify();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Switches palette: page colours (cross-faded where supported), storage, subscribers. */
export function setAccent(id: PaletteId) {
  if (id === read()) return;
  try {
    localStorage.setItem(ACCENT_STORAGE_KEY, id);
  } catch {
    // Private mode or storage blocked: the choice lasts for this page only.
  }
  const swap = () => {
    apply(id);
    notify();
  };
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && typeof document.startViewTransition === "function") document.startViewTransition(swap);
  else swap();
}

/** Current palette id; the server (and hydration) render the default. */
export function useAccentId(): PaletteId {
  const id = useSyncExternalStore(subscribe, read, () => defaultPalette.id as PaletteId);

  // In development, Strict Mode's remount resets <html> to the attributes
  // React renders, dropping data-accent: put it back before paint. No-op in
  // production, where the inline script's attribute is never touched.
  useLayoutEffect(() => {
    try {
      const saved = localStorage.getItem(ACCENT_STORAGE_KEY);
      if (isPaletteId(saved) && saved !== read()) {
        apply(saved);
        notify();
      }
    } catch {}
  }, []);

  return id;
}

/** Current palette. */
export function useAccent(): Palette {
  return getPalette(useAccentId());
}
