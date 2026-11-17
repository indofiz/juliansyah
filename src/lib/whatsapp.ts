/**
 * A wa.me link: opens a WhatsApp chat with `number` (the app on phones,
 * WhatsApp Web or Desktop elsewhere) with `text` already typed in the box.
 * `number` is in international format, digits only (no + or spaces).
 */
export function whatsappHref(number: string, text: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
