import { playground } from "@/content/site";
import { SectionHeader } from "../ui/primitives";
import { PlaygroundTile } from "../playground/PlaygroundTile";

/** Playground: small experiments in a grid (a swipe row on phones). */
export function Playground() {
  return (
    <section id="playground" className="section playground" aria-labelledby="playground-title">
      <div className="container">
        <SectionHeader id="playground-title" badge={playground.badge} badgeIcon="spark" title={playground.title} text={playground.text} />
        <div className="pg-grid" data-carousel>
          {playground.items.map((item) => (
            <PlaygroundTile key={item.slug} item={item} />
          ))}
        </div>
        <div className="carousel-dots" data-carousel-nav>
          {playground.items.map((item, i) => (
            <button key={item.slug} type="button" aria-label={`${playground.badge} ${i + 1}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
