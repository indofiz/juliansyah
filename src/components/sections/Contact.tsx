import { contact, site } from "@/content/site";
import { Icon } from "../ui/Icon";
import { Placeholder, isTodo } from "../ui/Placeholder";
import { Badge, Button } from "../ui/primitives";
import { CopyEmail } from "../contact/CopyEmail";

/** How do I reach you? Email (with copy), book a call, reply time and availability. */
export function Contact() {
  return (
    <section id="contact" className="section cta" aria-labelledby="contact-title">
      <div className="container">
        <div className="cta-panel" data-cta>
          <span className="cta-glow-corner" />
          <span className="cta-glow-bottom" />
          <span className="dots cta-dots" />
          <div className="cta-copy">
            <Badge icon="mail">{contact.badge}</Badge>
            <h2 id="contact-title" className="cta-title grad-text">
              {contact.title}
            </h2>
            <p className="cta-text">{contact.text}</p>
            <CopyEmail />
            <div className="btn-row">
              <Button href={`mailto:${site.email}`} icon="send">
                {contact.primary}
              </Button>
              {isTodo(contact.call.href) ? (
                <span className="btn btn-ghost">
                  <Icon name="calendar" size={16} />
                  {contact.call.label} <Placeholder text={contact.call.href} />
                </span>
              ) : (
                <Button href={contact.call.href} variant="ghost" icon="calendar">
                  {contact.call.label}
                </Button>
              )}
            </div>
            <dl className="contact-facts">
              {contact.facts.map((f) => (
                <div key={f.label}>
                  <dt>
                    <Icon name={f.icon} size={15} /> {f.label}
                  </dt>
                  <dd>
                    <Placeholder text={f.value} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
