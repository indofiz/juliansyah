import type { LoopMedia } from "@/content/types";
import { BrowserFrame, PhoneFrame } from "../media/DeviceFrame";
import { LoopVideo } from "../media/LoopVideo";
import { Placeholder } from "../ui/Placeholder";

/** Hero reel: a browser frame with a phone frame overlapping its corner. */
export function WorkReel({ items }: { items: readonly LoopMedia[] }) {
  const browser = items.find((m) => m.frame === "browser");
  const phone = items.find((m) => m.frame === "phone");

  return (
    <div className="reel">
      {browser && (
        <figure className="reel-browser">
          <BrowserFrame address={browser.caption} className="fade-bottom-soft">
            <LoopVideo media={browser} />
          </BrowserFrame>
        </figure>
      )}
      {phone && (
        <figure className="reel-phone">
          <PhoneFrame>
            <LoopVideo media={phone} />
          </PhoneFrame>
          {phone.caption && (
            <figcaption className="reel-caption">
              <Placeholder text={phone.caption} />
            </figcaption>
          )}
        </figure>
      )}
    </div>
  );
}
