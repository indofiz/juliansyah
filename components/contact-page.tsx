"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, Send, Check, Copy, ArrowUpRight, MapPin } from "lucide-react";

const EMAIL = "hello@juliansyah.dev";

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
    <path d="M12 .5C5.37.5 0 5.78 0 12.292c0 5.211 3.438 9.63 8.205 11.188.6.111.82-.254.82-.567 0-.28-.01-1.022-.015-2.005-3.338.711-4.042-1.582-4.042-1.582-.546-1.361-1.335-1.725-1.335-1.725-1.087-.731.084-.716.084-.716 1.205.082 1.838 1.215 1.838 1.215 1.07 1.803 2.809 1.282 3.495.981.108-.763.417-1.282.76-1.577-2.665-.295-5.466-1.309-5.466-5.827 0-1.287.465-2.339 1.235-3.164-.135-.297-.54-1.497.105-3.121 0 0 1.005-.31 3.3 1.209.96-.262 1.98-.392 3-.398 1.02.006 2.04.136 3 .398 2.28-1.519 3.285-1.209 3.285-1.209.645 1.624.24 2.824.12 3.121.765.825 1.23 1.877 1.23 3.164 0 4.53-2.805 5.527-5.475 5.817.42.354.81 1.077.81 2.182 0 1.578-.015 2.846-.015 3.229 0 .315.21.689.825.567C20.565 21.917 24 17.495 24 12.292 24 5.78 18.627.5 12 .5z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
  </svg>
);

const socials = [
  { label: "GitHub", href: "https://github.com/indofiz", description: "See my open-source work", icon: <GithubIcon /> },
  { label: "LinkedIn", href: "#", description: "Let's connect professionally", icon: <LinkedinIcon /> },
];

type Values = { name: string; email: string; subject: string; message: string; company: string };
type Errors = Partial<Record<keyof Values, string>>;
type Status = "idle" | "sending" | "success";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactPage() {
  const sectionRef = useRef<HTMLElement>(null);
  const [values, setValues] = useState<Values>({
    name: "",
    email: "",
    subject: "",
    message: "",
    company: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [copied, setCopied] = useState(false);

  const update =
    (key: keyof Values) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((v) => ({ ...v, [key]: e.target.value }));
      setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
      if (status === "success") setStatus("idle");
    };

  const validate = (v: Values): Errors => {
    const next: Errors = {};
    if (!v.name.trim()) next.name = "Please tell me your name.";
    if (!v.email.trim()) next.email = "An email so I can reply.";
    else if (!EMAIL_RE.test(v.email.trim())) next.email = "That email looks off.";
    if (v.message.trim().length < 10)
      next.message = "A little more detail helps (10+ characters).";
    return next;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (values.company) return; // honeypot — silently drop bots
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;

    setStatus("sending");
    const subject = values.subject.trim() || `New message from ${values.name.trim()}`;
    const body = `${values.message.trim()}\n\n— ${values.name.trim()}\n${values.email.trim()}`;
    const href = `mailto:${EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
    setTimeout(() => setStatus("success"), 600);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();
    mm.add({ motionOK: "(prefers-reduced-motion: no-preference)" }, (ctx) => {
      if (!ctx.conditions?.motionOK) return;
      const q = gsap.utils.selector(section);

      gsap.from(q("[data-cf-eyebrow]"), {
        opacity: 0,
        y: 20,
        duration: 0.7,
        ease: "power3.out",
      });
      const title = q("[data-cf-title]")[0];
      if (title) {
        gsap.set(title, { yPercent: 115 });
        gsap.to(title, { yPercent: 0, duration: 0.9, ease: "power4.out", delay: 0.1 });
      }
      gsap.from(q("[data-cf-sub]"), {
        opacity: 0,
        y: 20,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.25,
      });
      gsap.from(q("[data-cf-field]"), {
        opacity: 0,
        y: 24,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: q("[data-cf-form]")[0], start: "top 80%" },
      });
      gsap.from(q("[data-cf-aside]"), {
        opacity: 0,
        y: 28,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: q("[data-cf-asidewrap]")[0], start: "top 80%" },
      });
      gsap.from(q("[data-cf-footer]"), {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: { trigger: q("[data-cf-footer]")[0], start: "top 95%" },
      });

      document.fonts.ready.then(() => ScrollTrigger.refresh());
    });

    return () => mm.revert();
  }, []);

  const fieldClass = (key: keyof Values, base: string) =>
    `${base} ${
      errors[key]
        ? "border-red-500/70 focus:border-red-500"
        : "border-white-15 focus:border-brand"
    }`;

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden px-6 py-20 md:px-25"
    >
      {/* Ambient brand glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full opacity-40 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,80,41,0.18), transparent 70%)",
        }}
      />

      <div className="relative mx-auto flex max-w-5xl flex-col gap-16">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-white-15 pb-12">
          <span
            data-cf-eyebrow
            className="font-(family-name:--font-bricolage) text-sm font-medium uppercase tracking-widest text-gray-text"
          >
            Get In Touch
          </span>
          <div className="overflow-hidden pb-1">
            <h1
              data-cf-title
              className="font-(family-name:--font-bricolage) text-5xl font-semibold leading-tight text-white md:text-6xl"
            >
              Let&apos;s work{" "}
              <span className="font-(family-name:--font-instrument) italic text-brand">
                together.
              </span>
            </h1>
          </div>
          <p
            data-cf-sub
            className="max-w-xl text-base leading-relaxed text-gray-text"
          >
            Have a project in mind, a role to fill, or just want to say hello?
            Fill out the form and it&apos;ll land straight in my inbox — or reach
            me directly through any of the channels on the right.
          </p>
        </div>

        {/* Main content */}
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr] md:gap-16">
          {/* Form */}
          <div className="flex flex-col gap-6">
            <h2 className="font-(family-name:--font-bricolage) text-sm font-medium uppercase tracking-widest text-gray-text">
              Send a Message
            </h2>

            <form data-cf-form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              {/* Honeypot */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={values.company}
                onChange={update("company")}
                className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
              />

              <div data-cf-field className="flex flex-col gap-2">
                <label htmlFor="contact-name" className="text-xs font-medium uppercase tracking-widest text-gray-text">
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder="John Doe"
                  value={values.name}
                  onChange={update("name")}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "err-name" : undefined}
                  className={fieldClass(
                    "name",
                    "h-12 rounded-lg border bg-white/5 px-4 text-sm text-white placeholder-gray-text outline-none transition-colors focus:bg-white/[0.07]"
                  )}
                />
                {errors.name && (
                  <span id="err-name" className="text-xs text-red-400">
                    {errors.name}
                  </span>
                )}
              </div>

              <div data-cf-field className="flex flex-col gap-2">
                <label htmlFor="contact-email" className="text-xs font-medium uppercase tracking-widest text-gray-text">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="john@example.com"
                  value={values.email}
                  onChange={update("email")}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "err-email" : undefined}
                  className={fieldClass(
                    "email",
                    "h-12 rounded-lg border bg-white/5 px-4 text-sm text-white placeholder-gray-text outline-none transition-colors focus:bg-white/[0.07]"
                  )}
                />
                {errors.email && (
                  <span id="err-email" className="text-xs text-red-400">
                    {errors.email}
                  </span>
                )}
              </div>

              <div data-cf-field className="flex flex-col gap-2">
                <label htmlFor="contact-subject" className="text-xs font-medium uppercase tracking-widest text-gray-text">
                  Subject <span className="text-gray-text/50">(optional)</span>
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  name="subject"
                  placeholder="Project inquiry / Just saying hi"
                  value={values.subject}
                  onChange={update("subject")}
                  className={fieldClass(
                    "subject",
                    "h-12 rounded-lg border bg-white/5 px-4 text-sm text-white placeholder-gray-text outline-none transition-colors focus:bg-white/[0.07]"
                  )}
                />
              </div>

              <div data-cf-field className="flex flex-col gap-2">
                <label htmlFor="contact-message" className="text-xs font-medium uppercase tracking-widest text-gray-text">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  placeholder="Tell me about your project or idea..."
                  value={values.message}
                  onChange={update("message")}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "err-message" : undefined}
                  className={fieldClass(
                    "message",
                    "resize-none rounded-lg border bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-text outline-none transition-colors focus:bg-white/[0.07]"
                  )}
                />
                {errors.message && (
                  <span id="err-message" className="text-xs text-red-400">
                    {errors.message}
                  </span>
                )}
              </div>

              <button
                data-cf-field
                type="submit"
                disabled={status === "sending"}
                className="group mt-2 flex h-12 items-center justify-center gap-2 rounded-lg bg-white text-sm font-semibold text-[#060703] transition-shadow hover:shadow-[0_0_40px_-8px_rgba(255,80,41,0.6)] disabled:opacity-70"
              >
                {status === "success" ? (
                  <>
                    <Check size={18} strokeWidth={2} className="text-green-600" />
                    Message ready
                  </>
                ) : status === "sending" ? (
                  "Opening your mail app…"
                ) : (
                  <>
                    Send Message
                    <Send
                      size={16}
                      strokeWidth={2}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </>
                )}
              </button>

              {status === "success" && (
                <p role="status" className="text-xs leading-relaxed text-gray-text">
                  Your email app should have opened with the message ready to
                  send. If nothing happened, email me directly at{" "}
                  <a href={`mailto:${EMAIL}`} className="text-brand underline">
                    {EMAIL}
                  </a>
                  .
                </p>
              )}
            </form>
          </div>

          {/* Aside */}
          <div data-cf-asidewrap className="flex flex-col gap-8">
            {/* Availability */}
            <div data-cf-aside className="flex items-center gap-3 rounded-xl border border-white-15 bg-white/[0.02] p-5">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-white">Open to opportunities</span>
                <span className="text-xs text-gray-text">Freelance &amp; full-time · Frontend · UI/UX · Flutter</span>
              </div>
            </div>

            {/* Direct email */}
            <div data-cf-aside className="flex flex-col gap-3">
              <h2 className="font-(family-name:--font-bricolage) text-sm font-medium uppercase tracking-widest text-gray-text">
                Email Me Directly
              </h2>
              <div className="flex items-center justify-between gap-3 rounded-xl border border-white-15 p-4">
                <a
                  href={`mailto:${EMAIL}`}
                  className="flex items-center gap-3 text-sm text-white transition-colors hover:text-brand"
                >
                  <Mail size={18} strokeWidth={1.75} className="shrink-0 text-brand" />
                  {EMAIL}
                </a>
                <button
                  type="button"
                  onClick={handleCopy}
                  aria-label={copied ? "Email copied" : "Copy email address"}
                  className="shrink-0 text-gray-text transition-colors hover:text-white"
                >
                  {copied ? (
                    <Check size={16} className="text-green-400" />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
              </div>
            </div>

            {/* Socials */}
            <div data-cf-aside className="flex flex-col gap-3">
              <h2 className="font-(family-name:--font-bricolage) text-sm font-medium uppercase tracking-widest text-gray-text">
                Find Me Online
              </h2>
              <div className="flex flex-col gap-2">
                {socials.map(({ label, href, description, icon }) => {
                  const external = href.startsWith("http");
                  return (
                    <a
                      key={label}
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      aria-label={external ? `${label} (opens in new tab)` : label}
                      className="group flex items-center justify-between rounded-xl border border-white-15 p-4 transition-colors hover:border-brand/40 hover:bg-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-gray-text transition-colors group-hover:text-white">
                          {icon}
                        </span>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-medium text-white">{label}</span>
                          <span className="text-xs text-gray-text">{description}</span>
                        </div>
                      </div>
                      <ArrowUpRight
                        size={16}
                        className="shrink-0 text-gray-text opacity-0 transition-all group-hover:text-brand group-hover:opacity-100"
                      />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Info */}
            <div data-cf-aside className="flex flex-col gap-2 text-xs leading-relaxed text-gray-text">
              <span className="flex items-center gap-2">
                <MapPin size={14} className="text-brand" />
                Bangka Belitung, Indonesia · GMT+7 (WIB)
              </span>
              <span>
                I typically respond within 1–2 business days. For anything urgent,
                email me directly.
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          data-cf-footer
          className="flex flex-col gap-4 border-t border-white-15 pt-8 md:flex-row md:items-center md:justify-between"
        >
          <span className="text-xs text-gray-text">
            {`© ${new Date().getFullYear()} Juliansyah — Crafted with care in Bangka Belitung`}
          </span>
          <a
            href="#main-content"
            className="text-xs font-medium uppercase tracking-widest text-gray-text transition-colors hover:text-white"
          >
            Back to top
          </a>
        </div>
      </div>
    </section>
  );
}
