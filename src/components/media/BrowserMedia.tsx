import Image from "next/image";
import type { LoopMedia } from "@/content/types";
import { BrowserFrame } from "./DeviceFrame";
import { LoopVideo } from "./LoopVideo";

/**
 * A browser frame's content: with no recording but a real screen, that
 * screen as a still, without the toolbar (the glow stays); otherwise the
 * loop, or its placeholder, under the toolbar.
 */
export function BrowserMedia({ media, sizes, eager = false }: { media: LoopMedia; sizes: string; eager?: boolean }) {
  const shot = media.webm || media.mp4 ? undefined : media.screens?.[0];
  if (shot) {
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
      </BrowserFrame>
    );
  }
  return (
    <BrowserFrame address={media.caption}>
      <LoopVideo media={media} />
    </BrowserFrame>
  );
}
