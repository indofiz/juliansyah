import Image from "next/image";
import type { LoopMedia } from "@/content/types";
import { BrowserFrame } from "./DeviceFrame";
import { LoopVideo } from "./LoopVideo";
import { ScrollVideo } from "./ScrollVideo";

/**
 * A browser frame's content: with no recording but a real screen, that
 * screen as a still, without the toolbar (the glow stays); otherwise the
 * loop, or its placeholder, under the toolbar.
 *
 * `scroll` lays the matching scroll-through (media.scroll.card or .page)
 * over the still: on hover for "card", while on screen for "page".
 */
export function BrowserMedia({
  media,
  sizes,
  eager = false,
  scroll,
}: {
  media: LoopMedia;
  sizes: string;
  eager?: boolean;
  scroll?: "card" | "page";
}) {
  const shot = media.webm || media.mp4 ? undefined : media.screens?.[0];
  if (shot) {
    const video = scroll && media.scroll?.[scroll];
    return (
      <BrowserFrame bar={false}>
        <Image
          className="browser-shot"
          src={shot.src}
          alt={shot.alt}
          fill
          sizes={sizes}
          loading={eager ? "eager" : undefined}
          fetchPriority={eager ? "high" : undefined}
        />
        {video && <ScrollVideo src={video} trigger={scroll === "card" ? "hover" : "view"} />}
      </BrowserFrame>
    );
  }
  return (
    <BrowserFrame address={media.caption}>
      <LoopVideo media={media} />
    </BrowserFrame>
  );
}
