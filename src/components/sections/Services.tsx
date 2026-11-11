import { services } from "@/content/site";
import { Icon } from "../ui/Icon";
import { Button } from "../ui/primitives";

type Service = (typeof services.left)[number];

function ServiceCard({ s }: { s: Service }) {
  return (
    <article className={`card svc-card tone-${s.tone}`} data-reveal data-slide>
      <span className={`svc-icon tone-${s.tone}`}>
        <Icon name={s.icon} size={22} />
      </span>
      <div className="svc-body">
        <h3>{s.title}</h3>
        <p>{s.text}</p>
        <Button variant="soft" tone={s.tone === "accent" ? undefined : s.tone} href="#contact">
          {s.cta}
        </Button>
      </div>
    </article>
  );
}

/** Three cards either side of the particle shape (morph target). */
export function Services() {
  return (
    <section id="services" className="section services">
      <div className="container">
        <h2 className="h2 grad-text services-title" data-reveal>
          {services.title}
        </h2>
        <div className="services-grid" data-carousel>
          <div className="services-col">
            {services.left.map((s) => (
              <ServiceCard key={s.title} s={s} />
            ))}
          </div>
          <div className="services-gap" />
          <div className="services-col">
            {services.right.map((s) => (
              <ServiceCard key={s.title} s={s} />
            ))}
          </div>
        </div>
        <div className="carousel-bar" data-carousel-nav aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  );
}
