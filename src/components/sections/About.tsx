import Image from "next/image";
import { about } from "@/content/site";
import type { AboutCard as Card } from "@/content/types";
import { Icon } from "../ui/Icon";
import { LocalTime } from "../ui/LocalTime";
import { Placeholder } from "../ui/Placeholder";
import { Button, SectionHeader } from "../ui/primitives";

function AboutCard({ c }: { c: Card }) {
  return (
    <article className="card about-card" data-reveal data-slide>
      {c.photo ? (
        <figure className="about-card-icon about-avatar">
          <Image src={about.photo.src} alt={about.photo.alt} width={about.photo.width} height={about.photo.height} sizes="3.25rem" />
        </figure>
      ) : (
        <span className="about-card-icon">
          <Icon name={c.icon} size={22} />
        </span>
      )}
      <div className="about-card-body">
        <h3>{c.title}</h3>
        {c.text && (
          <p>
            <Placeholder text={c.text} />
          </p>
        )}
        {c.widget === "localTime" && <LocalTime />}
        {c.cta && (
          <Button variant="ghost-accent" size="sm" href={c.cta.href} iconEnd="arrowRight">
            {c.cta.label}
          </Button>
        )}
      </div>
    </article>
  );
}

/**
 * About: three cards either side of an empty middle column, where the
 * particle portrait (your face with the VR headset) forms (the "about"
 * keyframe in sceneKeyframes). On phones the portrait forms between the
 * title and the cards, which become a swipe carousel.
 *
 * Without WebGL there are no particles: on desktop the real photo fills the
 * middle column instead, on phones the space closes up (.no-webgl, set by
 * SceneCanvas).
 */
export function About() {
  const cards = [...about.cards.left, ...about.cards.right];
  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <div className="container">
        <SectionHeader id="about-title" badge={about.badge} badgeIcon="user" title={about.title} />
        <div className="about-grid" data-carousel>
          <div className="about-col">
            {about.cards.left.map((c) => (
              <AboutCard key={c.id} c={c} />
            ))}
          </div>
          <div className="about-gap" aria-hidden="true">
            <Image className="about-gap-photo" src={about.photo.src} alt="" width={about.photo.width} height={about.photo.height} sizes="20rem" loading="lazy" />
          </div>
          <div className="about-col">
            {about.cards.right.map((c) => (
              <AboutCard key={c.id} c={c} />
            ))}
          </div>
        </div>
        <div className="carousel-dots" data-carousel-nav>
          {cards.map((c) => (
            <button key={c.id} type="button" aria-label={c.title} />
          ))}
        </div>
      </div>
    </section>
  );
}
