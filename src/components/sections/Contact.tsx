import Image from "next/image";
import { about, contact, footer, site } from "@/content/site";
import { mailto } from "@/lib/mailto";
import { Icon } from "../ui/Icon";
import { Placeholder, isTodo } from "../ui/Placeholder";
import { Badge, Button } from "../ui/primitives";
import { CopyEmail } from "../contact/CopyEmail";

const mailHref = mailto(site.email, contact.mail);
const whatsappHref = `https://wa.me/${contact.whatsapp.number}?text=${encodeURIComponent(contact.whatsapp.text)}`;

/** A link, or its label as a dashed placeholder while the href is a "TODO:". */
function MaybeLink({ href, label, download }: { href: string; label: string; download?: boolean }) {
  if (isTodo(href)) {
    return (
      <span className="todo" title={href}>
        {label}
      </span>
    );
  }
  const isExternal = /^https?:\/\//.test(href);
  const external = isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {};
  // download only works for files on this site; an external page just opens.
  return (
    <a href={href} download={(download && !isExternal) || undefined} {...external}>
      {label}
    </a>
  );
}

/** "I reply with my questions {reply}." with the reply time (or its placeholder) in place. */
function Step({ text }: { text: string }) {
  const [before, after] = text.split("{reply}");
  if (after === undefined) return <>{text}</>;
  return (
    <>
      {before}
      <Placeholder text={contact.card.reply} />
      {after}
    </>
  );
}

/**
 * How do I reach you? Left: what to do (email, WhatsApp, copy the address,
 * or the résumé for recruiters). Right: what to expect (who answers, when
 * they're free, what happens after you write, the time zone). One column
 * on ≤ 900px, with the card last.
 */
export function Contact() {
  const { card } = contact;
  return (
    <section id="contact" className="section cta" aria-labelledby="contact-title">
      <div className="container">
        <div className="cta-panel" data-cta data-reveal>
          <span className="cta-glow-corner" />
          <span className="cta-glow-bottom" />
          <span className="dots cta-dots" />

          <div className="cta-copy">
            <Badge icon="mail">{contact.badge}</Badge>
            <h2 id="contact-title" className="cta-title grad-text">
              {contact.title}
            </h2>
            <p className="cta-text">{contact.text}</p>
            <div className="btn-row cta-actions">
              <Button href={mailHref} icon="send">
                {contact.primary}
              </Button>
              <Button href={whatsappHref} variant="ghost" icon="whatsapp">
                {contact.whatsapp.label}
              </Button>
            </div>
            <CopyEmail />
            <p className="cta-hiring">
              {contact.hiring.text} <MaybeLink href={footer.resume.href} label={contact.hiring.resume} download />
              <span aria-hidden="true"> · </span>
              <MaybeLink href={site.linkedin} label={contact.hiring.linkedin} />
            </p>
          </div>

          <div className="cta-card" data-reveal>
            <div className="cta-card-head">
              <Image className="cta-card-avatar" src={about.photo.src} alt="" width={about.photo.width} height={about.photo.height} sizes="3.25rem" />
              <div>
                <p className="cta-card-name">{site.name}</p>
                <p className="cta-card-sub">{card.sub}</p>
              </div>
            </div>
            <p className="status status-live cta-avail">
              <span className="sr-only">{card.availabilityLabel}: </span>
              <Placeholder text={card.availability} />
            </p>
            <h3 className="cta-card-title">{card.nextTitle}</h3>
            {/* role="list": Safari drops list semantics when list-style is none. */}
            <ol className="cta-steps" role="list">
              {card.steps.map((s) => (
                <li key={s}>
                  <span>
                    <Step text={s} />
                  </span>
                </li>
              ))}
            </ol>
            <p className="cta-card-place">
              <Icon name="mapPin" size={15} />
              <span className="sr-only">{card.placeLabel}: </span>
              {card.place}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
