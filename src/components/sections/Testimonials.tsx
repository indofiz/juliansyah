import Image from "next/image";
import type { Testimonial } from "@/content/types";
import { testimonials } from "@/content/site";
import { Icon } from "../ui/Icon";
import { Placeholder, isTodo } from "../ui/Placeholder";
import { SectionHeader } from "../ui/primitives";

const initials = (name: string) =>
  isTodo(name)
    ? "?"
    : name
        .split(/\s+/)
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

function Quote({ t }: { t: Testimonial }) {
  return (
    <figure className="quote card" data-reveal>
      <Icon name="quote" size={22} className="quote-mark" />
      <blockquote>
        <p>
          <Placeholder text={t.quote} />
        </p>
      </blockquote>
      <figcaption className="quote-by">
        {t.photo ? (
          <Image className="quote-avatar" src={t.photo.src} alt={t.photo.alt} width={t.photo.width} height={t.photo.height} sizes="3rem" />
        ) : (
          <span className="quote-avatar" aria-hidden="true">
            {initials(t.name)}
          </span>
        )}
        <span>
          <b>
            <Placeholder text={t.name} />
          </b>
          <small>
            <Placeholder text={t.role} /> · <Placeholder text={t.company} />
          </small>
        </span>
      </figcaption>
    </figure>
  );
}

/** Kind words: two or three short quotes, just before Contact. */
export function Testimonials() {
  return (
    <section id="testimonials" className="section testimonials" aria-labelledby="testimonials-title">
      <div className="container">
        <SectionHeader id="testimonials-title" badge={testimonials.badge} badgeIcon="message" title={testimonials.title} text={testimonials.text} />
        <div className="quotes">
          {testimonials.items.map((t, i) => (
            <Quote key={i} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
