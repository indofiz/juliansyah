"use client";

import { useEffect, useRef, useState } from "react";
import type { LoopMedia } from "@/content/types";
import { Icon } from "../ui/Icon";
import { Placeholder } from "../ui/Placeholder";

/**
 * A muted screen-recording loop.
 *  - preload="none": nothing downloads until it's near the viewport
 *  - an IntersectionObserver plays it near the viewport and pauses it off screen
 *  - reduced motion or Save-Data: it never autoplays; the poster stays
 *  - a pause/play button, because it moves for longer than 5 seconds
 * Without video files yet, a wireframe placeholder is shown instead.
 */
export function LoopVideo({ media }: { media: LoopMedia }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(true);
  const userPaused = useRef(false);
  const hasVideo = Boolean(media.webm || media.mp4);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || saveData) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !userPaused.current) video.play().catch(() => {});
        else video.pause();
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  if (!hasVideo) return <MediaPlaceholder media={media} />;

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
    <div className="loop">
      <video
        ref={ref}
        className="loop-video"
        muted
        playsInline
        loop
        preload="none"
        poster={media.poster}
        aria-label={media.label}
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
      >
        {media.webm && <source src={media.webm} type="video/webm" />}
        {media.mp4 && <source src={media.mp4} type="video/mp4" />}
        {media.captions && <track kind="captions" src={media.captions} srcLang="en" label="English" default />}
      </video>
      <button type="button" className="loop-toggle" onClick={toggle} aria-label={paused ? "Play video" : "Pause video"}>
        <Icon name={paused ? "play" : "pause"} size={14} />
      </button>
    </div>
  );
}

/** Wireframe stand-in for a missing recording: a faint app skeleton plus the TODO. */
export function MediaPlaceholder({ media }: { media: LoopMedia }) {
  return (
    <div className={`media-ph media-ph--${media.frame}`} role="img" aria-label={media.label}>
      <div className="media-ph-skel" aria-hidden="true">
        <i className="sk-bar" />
        <i className="sk-hero" />
        <i className="sk-row" />
        <i className="sk-row" />
        <i className="sk-row sk-short" />
      </div>
      <span className="media-ph-label" aria-hidden="true">
        <Icon name="play" size={14} />
        <Placeholder text={media.label} />
      </span>
    </div>
  );
}
