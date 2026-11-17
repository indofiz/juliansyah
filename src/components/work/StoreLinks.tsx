import Image from "next/image";
import type { Project } from "@/content/types";
import { getContent } from "@/content";
import { Icon } from "../ui/Icon";

/**
 * The official store badges, unmodified (public/badges: Apple's SVG, and
 * Google's PNG with only its transparent margin trimmed), at the same height.
 */
export async function StoreBadges({ stores }: { stores: NonNullable<Project["stores"]> }) {
  const { caseStudyLabels: L } = await getContent();
  const badges = [
    stores.appStore && { href: stores.appStore, store: L.appStore, src: "/badges/app-store.svg", width: 120, height: 40, alt: "Download on the App Store" },
    stores.googlePlay && { href: stores.googlePlay, store: L.googlePlay, src: "/badges/google-play.png", width: 564, height: 168, alt: "Get it on Google Play" },
  ].filter(Boolean) as { href: string; store: string; src: string; width: number; height: number; alt: string }[];

  return (
    <ul className="store-badges" aria-label={L.getApp}>
      {badges.map((b) => (
        <li key={b.href}>
          <a href={b.href} target="_blank" rel="noopener noreferrer" aria-label={`${L.download} ${stores.name} ${L.on} ${b.store}`}>
            <Image src={b.src} alt={b.alt} width={b.width} height={b.height} unoptimized={b.src.endsWith(".svg")} />
          </a>
        </li>
      ))}
    </ul>
  );
}

/** "★ 4.5 on Google Play · 28 ratings", linking to the listing. */
export async function RatingLine({ rating, className = "" }: { rating: NonNullable<Project["rating"]>; className?: string }) {
  const { work } = await getContent();
  return (
    <a className={`rating ${className}`} href={rating.href} target="_blank" rel="noopener noreferrer">
      <Icon name="star" size={15} />
      <strong>{rating.value}</strong>
      <span>
        {work.labels.ratingOn} {rating.store}
        <span className="rating-count">
          {" "}
          · {rating.count} {work.labels.ratings}
        </span>
      </span>
    </a>
  );
}
