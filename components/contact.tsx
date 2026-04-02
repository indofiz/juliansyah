const links = [
  { label: "GitHub", href: "https://github.com/indofiz" },
  { label: "LinkedIn", href: "#" },
  { label: "Email", href: "mailto:hello@juliansyah.dev" },
];

export default function Contact() {
  return (
    <section id="contact" className="w-full px-6 py-24 md:px-25">
      <div className="mx-auto flex max-w-5xl flex-col gap-16">

        {/* Header */}
        <h2 className="font-(family-name:--font-bricolage) text-sm font-medium uppercase tracking-widest text-gray-text">
          Contact
        </h2>

        {/* Content */}
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-4 max-w-lg">
            <h3 className="font-(family-name:--font-bricolage) text-4xl font-semibold text-white leading-tight">
              Let&apos;s work{" "}
              <span className="font-(family-name:--font-instrument) italic text-brand">
                together.
              </span>
            </h3>
            <p className="text-base leading-relaxed text-gray-text">
              Have a project in mind or just want to say hi? My inbox is always
              open — I&apos;ll get back to you as soon as I can.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-3">
            {links.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group flex items-center gap-3 text-gray-text transition-colors hover:text-white"
              >
                <span className="h-px w-6 bg-gray-text transition-all group-hover:w-10 group-hover:bg-brand" />
                <span className="text-sm font-medium uppercase tracking-widest">
                  {label}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Divider + footer */}
        <div className="flex flex-col gap-4 border-t border-white-15 pt-8 md:flex-row md:items-center md:justify-between">
          <span className="text-xs text-gray-text">
            © {new Date().getFullYear()} Juliansyah. Built with Next.js &amp; Tailwind CSS.
          </span>
          <span className="text-xs text-gray-text">
            Designed &amp; developed by Juliansyah
          </span>
        </div>

      </div>
    </section>
  );
}
