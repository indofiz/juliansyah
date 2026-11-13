"use client";

import { useEffect, useRef, useState } from "react";
import { contact, site } from "@/content/site";
import { mailto } from "@/lib/mailto";
import { Icon } from "../ui/Icon";

type State = "idle" | "done" | "fail";

/**
 * The email address (a pre-filled mailto link) and a Copy button, for people
 * whose mailto opens nothing (webmail). "Copy" turns into "Copied" inside the
 * button, which keeps one width, so nothing moves. If the browser won't copy,
 * the address is selected and a hint, worded for touch or keyboard, appears in
 * the space kept free below the row. Screen readers hear both through the
 * status region.
 */
export function CopyEmail() {
  const [state, setState] = useState<State>("idle");
  const [hint, setHint] = useState("");
  const address = useRef<HTMLAnchorElement>(null);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    window.clearTimeout(timer.current);
    let next: State = "done";
    let text: string = contact.copy.announce;
    try {
      await navigator.clipboard.writeText(site.email);
    } catch {
      const el = address.current;
      const selection = window.getSelection();
      if (el && selection) {
        const range = document.createRange();
        range.selectNodeContents(el);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      next = "fail";
      text = window.matchMedia("(pointer: coarse)").matches ? contact.copy.failTouch : contact.copy.failKeys;
    }
    setState(next);
    setHint(text);
    timer.current = window.setTimeout(
      () => {
        setState("idle");
        setHint("");
      },
      next === "done" ? 2500 : 6000,
    );
  };

  return (
    <div className="contact-email">
      <a ref={address} href={mailto(site.email, contact.mail)}>
        {site.email}
      </a>
      <button type="button" className="btn btn-ghost btn-sm contact-copy" data-state={state} onClick={copy} aria-label={contact.copy.label}>
        <Icon name={state === "done" ? "check" : "copy"} size={15} />
        {/* Both labels share one grid cell, so the button is as wide as the
            longer one in every state and nothing around it moves. */}
        <span className="contact-copy-label" aria-hidden="true">
          <span data-on={state !== "done" || undefined}>{contact.copy.idle}</span>
          <span data-on={state === "done" || undefined}>{contact.copy.done}</span>
        </span>
      </button>
      <span className="contact-hint" aria-hidden="true" data-show={state === "fail" || undefined}>
        {state === "fail" ? hint : ""}
      </span>
      <span className="sr-only" role="status">
        {hint}
      </span>
    </div>
  );
}
