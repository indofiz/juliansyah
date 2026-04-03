import Navbar from "@/components/navbar";
import { ArrowUpRight } from "lucide-react";

const socials = [
  { label: "GitHub", href: "https://github.com/indofiz", description: "See my open-source work" },
  { label: "LinkedIn", href: "#", description: "Let's connect professionally" },
  { label: "Twitter / X", href: "#", description: "Follow my thoughts & updates" },
  { label: "Email", href: "mailto:hello@juliansyah.dev", description: "hello@juliansyah.dev" },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="w-full px-6 py-20 md:px-25">
        <div className="mx-auto max-w-5xl flex flex-col gap-20">

          {/* Page Header */}
          <div className="flex flex-col gap-4 border-b border-white-15 pb-16">
            <span className="font-(family-name:--font-bricolage) text-sm font-medium uppercase tracking-widest text-gray-text">
              Get In Touch
            </span>
            <h1 className="font-(family-name:--font-bricolage) text-5xl font-semibold leading-tight text-white md:text-6xl">
              Let&apos;s work{" "}
              <span className="font-(family-name:--font-instrument) italic text-brand">
                together.
              </span>
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-gray-text">
              Whether you have a project in mind, a job opportunity, or just want to say
              hello — my inbox is always open. I&apos;ll get back to you as soon as I can.
            </p>
          </div>

          {/* Main content */}
          <div className="grid gap-16 md:grid-cols-2 md:gap-24">

            {/* Contact Form */}
            <div className="flex flex-col gap-6">
              <h2 className="font-(family-name:--font-bricolage) text-sm font-medium uppercase tracking-widest text-gray-text">
                Send a Message
              </h2>

              <form className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium uppercase tracking-widest text-gray-text">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="h-12 rounded-lg border border-white-15 bg-white/5 px-4 text-sm text-white placeholder-gray-text outline-none transition-colors focus:border-brand focus:bg-white/[0.07]"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium uppercase tracking-widest text-gray-text">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="h-12 rounded-lg border border-white-15 bg-white/5 px-4 text-sm text-white placeholder-gray-text outline-none transition-colors focus:border-brand focus:bg-white/[0.07]"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium uppercase tracking-widest text-gray-text">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Project inquiry / Just saying hi"
                    className="h-12 rounded-lg border border-white-15 bg-white/5 px-4 text-sm text-white placeholder-gray-text outline-none transition-colors focus:border-brand focus:bg-white/[0.07]"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium uppercase tracking-widest text-gray-text">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Tell me about your project or idea..."
                    className="resize-none rounded-lg border border-white-15 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-text outline-none transition-colors focus:border-brand focus:bg-white/[0.07]"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 flex h-12 items-center justify-center rounded-lg bg-white text-sm font-medium text-[#060703] transition-opacity hover:opacity-90"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Socials + Info */}
            <div className="flex flex-col gap-10">
              {/* Availability */}
              <div className="flex flex-col gap-3">
                <h2 className="font-(family-name:--font-bricolage) text-sm font-medium uppercase tracking-widest text-gray-text">
                  Availability
                </h2>
                <div className="flex items-center gap-3 rounded-xl border border-white-15 p-5">
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-white">Open to opportunities</span>
                    <span className="text-xs text-gray-text">Available for freelance & full-time roles</span>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex flex-col gap-3">
                <h2 className="font-(family-name:--font-bricolage) text-sm font-medium uppercase tracking-widest text-gray-text">
                  Find Me Online
                </h2>
                <div className="flex flex-col gap-2">
                  {socials.map(({ label, href, description }) => (
                    <a
                      key={label}
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="group flex items-center justify-between rounded-xl border border-white-15 p-4 transition-colors hover:border-brand/30 hover:bg-white/5"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium text-white">{label}</span>
                        <span className="text-xs text-gray-text">{description}</span>
                      </div>
                      <ArrowUpRight
                        size={16}
                        className="shrink-0 text-gray-text opacity-0 transition-all group-hover:opacity-100 group-hover:text-brand"
                      />
                    </a>
                  ))}
                </div>
              </div>

              {/* Response time note */}
              <p className="text-xs leading-relaxed text-gray-text">
                I typically respond within 1–2 business days. For urgent inquiries feel free to
                reach out directly via email.
              </p>
            </div>

          </div>

          {/* Footer line */}
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
    </main>
  );
}
