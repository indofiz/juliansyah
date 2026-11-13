"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import type { DeviceStill as Still, ImageRef } from "@/content/types";
import { work } from "@/content/site";
import { cssMatrix3d, squareToQuad } from "@/lib/homography";
import { Icon } from "../ui/Icon";

/**
 * A studio still of a device with real content in its screen
 * (docs/plans/phone-3d-on-site.md). Back to front:
 *  1. the content, laid out at the phone's size in points, warped into the
 *     screen with the exported corners (matrix3d) and clipped by the mask
 *  2. the frame, whose screen is see-through (the camera pill sits on top)
 *  3. the glass sheen: a CSS gradient over the screen, or the studio's glare
 *     image when the still has one
 * The stage is laid out at the frame image's pixel size and scaled to the
 * box by one CSS variable (--k), kept up to date by a ResizeObserver.
 * Near the viewport it gets .is-near, which runs the gentle float.
 */
export function DeviceStill({
  still,
  sizes,
  className = "",
  onNearChange,
  overlay,
  children,
}: {
  still: Still;
  /** `sizes` for the frame images, i.e. how wide the box is shown. */
  sizes: string;
  className?: string;
  onNearChange?: (near: boolean) => void;
  /** Controls drawn over the box, unwarped (e.g. a pause button). */
  overlay?: ReactNode;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onNear = useRef(onNearChange);
  useEffect(() => {
    onNear.current = onNearChange;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => el.style.setProperty("--k", String(entry.contentRect.width / still.width)));
    ro.observe(el);
    const io = new IntersectionObserver(
      ([entry]) => {
        el.classList.toggle("is-near", entry.isIntersecting);
        onNear.current?.(entry.isIntersecting);
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, [still.width]);

  const [tl, tr, br, bl] = still.quad;
  const transform = cssMatrix3d(squareToQuad({ tl, tr, br, bl }), still.screen.width, still.screen.height);
  const mask = `url(${still.mask})`;

  return (
    <div ref={ref} className={`device-still ${className}`} style={{ aspectRatio: `${still.width} / ${still.height}` }}>
      <div className="device-float">
        <div className="device-stage" style={{ width: still.width, height: still.height }}>
          <div className="device-screen" style={{ maskImage: mask, WebkitMaskImage: mask }}>
            <div className="device-content" style={{ width: still.screen.width, height: still.screen.height, transform }}>
              {children}
            </div>
          </div>
          <Image className="device-layer" src={still.src} alt="" width={still.width} height={still.height} sizes={sizes} />
          {still.glare && <Image className="device-layer" src={still.glare} alt="" width={still.width} height={still.height} sizes={sizes} />}
        </div>
      </div>
      {overlay}
    </div>
  );
}

const SCREEN_SECONDS = 3.5;

/** True when motion may start on its own: no reduced motion, no Save-Data. On the server: false. */
function useAutoMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => {
      const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
      return !window.matchMedia("(prefers-reduced-motion: reduce)").matches && !saveData;
    },
    () => false,
  );
}

/**
 * The studio phone showing real app screens, crossfading every 3.5 s while
 * it's near the viewport. It moves for longer than 5 s, so it has a pause
 * button. With reduced motion or Save-Data it holds the first screen until
 * someone presses play. Each screen loads just before its turn (the first
 * two once it's near), so the slideshow costs one screenshot at a time.
 */
export function PhoneScreens({
  still,
  screens,
  label,
  sizes,
  screenSizes,
  className,
}: {
  still: Still;
  screens: ImageRef[];
  /** Accessible name of the slideshow, e.g. "Presensi PKP: app screens". */
  label: string;
  sizes: string;
  screenSizes: string;
  className?: string;
}) {
  const auto = useAutoMotion();
  const [near, setNear] = useState(false);
  // `seen` is the furthest screen shown so far; screens up to seen + 1 are mounted.
  const [slide, setSlide] = useState({ index: 0, seen: 0 });
  // "auto" follows the visitor's settings; the button switches to an explicit choice.
  const [choice, setChoice] = useState<"auto" | "play" | "pause">("auto");
  const many = screens.length > 1;
  const wantsPlay = many && (choice === "play" || (choice === "auto" && auto));
  const playing = wantsPlay && near;

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(
      () =>
        setSlide((s) => {
          const index = (s.index + 1) % screens.length;
          return { index, seen: Math.max(s.seen, index) };
        }),
      SCREEN_SECONDS * 1000,
    );
    return () => clearInterval(id);
  }, [playing, screens.length]);

  const toggle = many && (
    <button
      type="button"
      className="loop-toggle device-toggle"
      onClick={() => setChoice(wantsPlay ? "pause" : "play")}
      aria-label={wantsPlay ? work.labels.pauseScreens : work.labels.playScreens}
    >
      <Icon name={wantsPlay ? "pause" : "play"} size={14} />
    </button>
  );

  return (
    <DeviceStill still={still} sizes={sizes} className={className} onNearChange={setNear} overlay={toggle}>
      <div className="device-slides" role="group" aria-roledescription="slideshow" aria-label={label}>
        {screens.map((s, i) =>
          i === 0 || (near && i <= slide.seen + 1) ? (
            <Image
              key={s.src}
              className={`device-slide${i === slide.index ? " is-active" : ""}`}
              src={s.src}
              alt={s.alt}
              fill
              sizes={screenSizes}
              aria-hidden={i !== slide.index}
            />
          ) : null,
        )}
      </div>
    </DeviceStill>
  );
}
