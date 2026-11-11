"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/content/types";
import { work } from "@/content/site";
import { PhoneFrame } from "../media/DeviceFrame";
import { LoopVideo } from "../media/LoopVideo";
import { Icon } from "../ui/Icon";
import { Placeholder } from "../ui/Placeholder";

/**
 * Flagship phone: plays the project's loop until someone taps "Tap to try",
 * then swaps in the real Flutter web build from /public/demos/<slug>/. The
 * iframe (and its several MB of Flutter runtime) is created only after the
 * click. Without a build it simply shows the video.
 *
 * Keyboard: the button opens the demo and moves focus into it; "Close demo"
 * sits before the phone in tab order, and Escape (outside the iframe)
 * closes it and returns focus to the button.
 */
export function TryDemo({ project }: { project: Project }) {
  const { demo, media } = project;
  const [open, setOpen] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const tryRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (open) {
      frameRef.current?.focus();
      wasOpen.current = true;
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
    if (wasOpen.current) tryRef.current?.focus();
  }, [open]);

  return (
    <div className={`try ${open ? "is-open" : ""}`}>
      {demo && open && (
        <button type="button" className="btn btn-ghost btn-sm try-close" onClick={() => setOpen(false)}>
          <Icon name="arrowLeft" size={14} />
          {work.labels.closeDemo}
        </button>
      )}
      <PhoneFrame>
        {demo && open ? (
          <iframe ref={frameRef} className="try-frame" src={demo.src} title={demo.title} />
        ) : (
          <LoopVideo media={media} />
        )}
      </PhoneFrame>
      {demo ? (
        !open && (
          <button ref={tryRef} type="button" className="btn btn-glow try-btn" onClick={() => setOpen(true)} aria-label={`${work.labels.tryDemo}: ${demo.title}`}>
            <Icon name="hand" size={16} />
            {work.labels.tryDemo}
          </button>
        )
      ) : (
        <p className="try-note">
          <Placeholder text={work.labels.noDemo.replace("<slug>", project.slug)} />
        </p>
      )}
    </div>
  );
}
