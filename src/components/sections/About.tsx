import Image from "next/image";
import { about, socials } from "@/content/site";
import type { AboutCard as Card } from "@/content/types";
import { Icon, isColourLogo } from "../ui/Icon";
import { Placeholder, isTodo } from "../ui/Placeholder";
import { SectionHeader } from "../ui/primitives";

const external = (href: string) => (/^https?:\/\//.test(href) ? { target: "_blank", rel: "noopener noreferrer" } : {});

/** Icon buttons for the "Who I am" card. A "TODO:" link shows as a dashed, unclickable tile. */
function Socials() {
  return (
    <ul className="about-socials" aria-label={about.socialsLabel}>
      {socials.map((s) => (
        <li key={s.label}>
          {isTodo(s.href) ? (
            <span className="about-social is-todo" title={s.href}>
              <Icon name={s.icon} size={17} />
              <span className="sr-only">{s.href}</span>
            </span>
          ) : (
            <a className="about-social" href={s.href} aria-label={s.label} {...external(s.href)}>
              <Icon name={s.icon} size={17} />
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}

function AboutCard({ c }: { c: Card }) {
  // A stack logo (Flutter, TypeScript) tints its whole card in its brand colour.
  const logo = isColourLogo(c.icon) ? c.icon : undefined;
  return (
    <article className="card about-card" data-logo={logo} data-reveal data-slide>
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
        {c.place && (
          <p className="about-place">
            <Icon name="mapPin" size={14} />
            {c.place}
          </p>
        )}
        <p>
          <Placeholder text={c.text} />
        </p>
        {c.tools && (
          <ul className="tags" aria-label={about.toolsLabel}>
            {c.tools.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}
        {c.socials && <Socials />}
      </div>
    </article>
  );
}

/**
 * About: who I am and what I do, in main's "Under One Roof" layout. Three
 * cards either side of an empty middle column, where the particle portrait
 * (your face with the VR headset) forms (the "about" keyframe in
 * sceneKeyframes). On phones the portrait forms between the title and the
 * cards, which become a swipe carousel.
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
        <SectionHeader id="about-title" title={about.title} />
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
