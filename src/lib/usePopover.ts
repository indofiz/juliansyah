import { useEffect, useRef, useState, type FocusEvent } from "react";

/**
 * Open/closed state for a small popover in the header (accent colours,
 * language). Escape, a press outside or tabbing away closes it; Escape also
 * puts focus back on the button. Spread `root` and `onBlur` on the wrapper,
 * `button` on the toggle.
 */
export function usePopover() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

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

  // relatedTarget is null when Safari drops focus on a click inside;
  // clicks outside are handled by the pointerdown listener.
  const onBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (e.relatedTarget && !root.current?.contains(e.relatedTarget as Node)) setOpen(false);
  };

  return { open, setOpen, root, button, onBlur };
}
