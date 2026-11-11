import { hero, site } from "@/content/site";
import { ogCard, ogSize } from "@/lib/ogImage";

export const alt = `${site.name}: ${hero.title}`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogCard({ eyebrow: site.name, title: hero.title, footer: `${hero.roles} · ${site.location} (${site.utcOffset})` });
}
