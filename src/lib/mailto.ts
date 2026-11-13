/** A mailto: link with the subject and body filled in (RFC 6068 percent-encoding). */
export function mailto(to: string, { subject, body }: { subject: string; body: string }) {
  const q = (s: string) => encodeURIComponent(s.replace(/\r?\n/g, "\r\n"));
  return `mailto:${to}?subject=${q(subject)}&body=${q(body)}`;
}
