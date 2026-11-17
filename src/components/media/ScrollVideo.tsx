"use client";

import { useEffect, useRef, useState } from "react";
import type { VideoSources } from "@/content/types";
import { Icon } from "../ui/Icon";
import { useContent } from "../ContentProvider";

/** "hover": plays while the card is hovered or focused. "view": plays while it's on screen. */
type Mode = "hover" | "view";

/**
 * A recording of a page scrolling, laid over its still (BrowserMedia). It's
 * invisible until it actually plays, so the still shows while it loads and
 * after it stops, and the first frame matches the still.
 *
 * trigger="hover" (homepage card):
 *  - mouse and pen: downloads once the card is near the viewport, plays
 *    while the pointer is over the card (or focus is inside it), then fades
 *    out and goes back to the start
 *  - touch screens: plays while the card is mostly on screen, with a
 *    pause button
 * trigger="view" (case study hero): downloads after the page has loaded,
 * plays while it's on screen, with a pause button.
 *
 * Reduced motion or Save-Data: nothing downloads, the still stays.
 */
export function ScrollVideo({ src, trigger }: { src: VideoSources; trigger: "hover" | "view" }) {
  const { video: labels } = useContent();
  const ref = useRef<HTMLVideoElement>(null);
  /** Set once it's near the viewport: which way it plays. Until then it has no sources. */
  const [mode, setMode] = useState<Mode | null>(null);
  const [on, setOn] = useState(false);
  const [paused, setPaused] = useState(true);
  const userPaused = useRef(false);

  // Arm it (add the sources) when it's near the viewport; on the case study,
  // not before the page has loaded, so it never competes with the still.
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || saveData) return;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const next: Mode = trigger === "hover" && canHover ? "hover" : "view";

    let io: IntersectionObserver | undefined;
    const watch = () => {
      io = new IntersectionObserver(
        ([e]) => {
          if (!e.isIntersecting) return;
          setMode(next);
          io?.disconnect();
        },
        { rootMargin: "300px 0px" },
      );
      io.observe(video);
    };
    if (trigger === "view" && document.readyState !== "complete") {
      window.addEventListener("load", watch, { once: true });
    } else watch();
    return () => {
      window.removeEventListener("load", watch);
      io?.disconnect();
    };
  }, [trigger]);

  useEffect(() => {
    const video = ref.current;
    // Adding the <source>s starts loading on its own; calling load() too would
    // abort that request and start a second one.
    if (!mode || !video) return;

    // Rewind once the fade-out is over, so it fades from where it stopped.
    let rewind: number | undefined;
    const play = () => {
      window.clearTimeout(rewind);
      video.play().catch(() => {});
    };
    const stop = (toStart: boolean) => {
      video.pause();
      setOn(false);
      if (toStart) rewind = window.setTimeout(() => (video.currentTime = 0), 400);
    };

    if (mode === "hover") {
      const card = video.closest(".work-card") ?? video.parentElement;
      if (!card) return;
      const enter = () => play();
      const leave = () => stop(true);
      const focusOut = (e: Event) => {
        if (!card.contains((e as FocusEvent).relatedTarget as Node | null)) leave();
      };
      card.addEventListener("pointerenter", enter);
      card.addEventListener("pointerleave", leave);
      card.addEventListener("focusin", enter);
      card.addEventListener("focusout", focusOut);
      if (card.matches(":hover")) play();
      return () => {
        window.clearTimeout(rewind);
        card.removeEventListener("pointerenter", enter);
        card.removeEventListener("pointerleave", leave);
        card.removeEventListener("focusin", enter);
        card.removeEventListener("focusout", focusOut);
      };
    }

    // "view": the card plays while mostly on screen and rewinds when it
    // leaves; the case study hero (it starts low on the first screen, lower
    // still under a three-line title) plays once a tenth of it shows, and
    // just pauses.
    const min = trigger === "hover" ? 0.6 : 0.1;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.intersectionRatio < min) stop(trigger === "hover");
        else if (!userPaused.current) play();
      },
      { threshold: [0, min] },
    );
    io.observe(video);
    return () => {
      window.clearTimeout(rewind);
      io.disconnect();
    };
  }, [mode, trigger]);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      video.play().catch(() => {});
    } else {
      userPaused.current = true;
      video.pause();
    }
  };

  return (
    <>
      <video
        ref={ref}
        className={`scroll-video${on ? " is-on" : ""}`}
        muted
        playsInline
        loop
        preload={mode ? "auto" : "none"}
        aria-hidden="true"
        tabIndex={-1}
        onPlaying={() => {
          setOn(true);
          setPaused(false);
        }}
        onPause={() => setPaused(true)}
      >
        {mode && <source src={src.webm} type="video/webm" />}
        {mode && <source src={src.mp4} type="video/mp4" />}
      </video>
      {mode === "view" && (
        <button type="button" className="loop-toggle" onClick={toggle} aria-label={paused ? labels.play : labels.pause}>
          <Icon name={paused ? "play" : "pause"} size={14} />
        </button>
      )}
    </>
  );
}
