import { getContent } from "@/content";
import { whatsappHref } from "@/lib/whatsapp";

/**
 * Round chat button, fixed to the bottom-right corner of every page. It opens
 * WhatsApp to the same number, with the same first message, as the "WhatsApp
 * me" button in Contact (content: contact.whatsapp). A plain link, so no
 * client JavaScript.
 *
 * Pages render it right after <Footer />, so it's the last stop when tabbing.
 * Never move it inside .site-header: on phones the header slides away on
 * scroll (a transform), and that would carry a fixed child with it.
 *
 * The label is the link's name. Desktop shows it as a pill on hover or
 * keyboard focus; touch screens keep it for screen readers only.
 */
export async function ChatButton() {
  const { contact } = await getContent();
  return (
    <a className="chat-fab" href={whatsappHref(contact.whatsapp.number, contact.whatsapp.text)} target="_blank" rel="noopener noreferrer">
      <span className="chat-fab-label">{contact.chat.label}</span>
      {/* A rounded speech bubble with its tail at the bottom right, and a smile. */}
      <svg className="chat-fab-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path className="chat-fab-bubble" d="M5.25 1.5h13.5a3.25 3.25 0 0 1 3.25 3.25V22.6a.6.6 0 0 1-.97.47L17.5 20.5H5.25A3.25 3.25 0 0 1 2 17.25V4.75A3.25 3.25 0 0 1 5.25 1.5Z" />
        <path className="chat-fab-smile" d="M7 13.75q5 3.4 10 0" />
      </svg>
    </a>
  );
}
