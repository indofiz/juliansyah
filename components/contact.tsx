"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, ArrowUpRight, ArrowUp, Copy, Check } from "lucide-react";

const EMAIL = "hello@juliansyah.dev";

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/indofiz",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
        <path d="M12 .5C5.37.5 0 5.78 0 12.292c0 5.211 3.438 9.63 8.205 11.188.6.111.82-.254.82-.567 0-.28-.01-1.022-.015-2.005-3.338.711-4.042-1.582-4.042-1.582-.546-1.361-1.335-1.725-1.335-1.725-1.087-.731.084-.716.084-.716 1.205.082 1.838 1.215 1.838 1.215 1.07 1.803 2.809 1.282 3.495.981.108-.763.417-1.282.76-1.577-2.665-.295-5.466-1.309-5.466-5.827 0-1.287.465-2.339 1.235-3.164-.135-.297-.54-1.497.105-3.121 0 0 1.005-.31 3.3 1.209.96-.262 1.98-.392 3-.398 1.02.006 2.04.136 3 .398 2.28-1.519 3.285-1.209 3.285-1.209.645 1.624.24 2.824.12 3.121.765.825 1.23 1.877 1.23 3.164 0 4.53-2.805 5.527-5.475 5.817.42.354.81 1.077.81 2.182 0 1.578-.015 2.846-.015 3.229 0 .315.21.689.825.567C20.565 21.917 24 17.495 24 12.292 24 5.78 18.627.5 12 .5z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: `mailto:${EMAIL}`,
    icon: <Mail size={20} strokeWidth={1.75} aria-hidden="true" />,
  },
];

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "Work", href: "#projects" },
  { label: "About", href: "#about" },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — no-op */
    }
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add(
      {
        motionOK: "(prefers-reduced-motion: no-preference)",
        isDesktop: "(hover: hover) and (pointer: fine)",
      },
      (ctx) => {
        const { motionOK, isDesktop } = ctx.conditions as {
          motionOK: boolean;
          isDesktop: boolean;
        };
        if (!motionOK) return;

        const q = gsap.utils.selector(section);
        const cleanups: Array<() => void> = [];

        const lines = q("[data-c-line]");
        const rest = q(
          "[data-c-eyebrow], [data-c-sub], [data-c-cta], [data-c-socials], [data-c-footer]"
        );

        gsap.set(lines, { yPercent: 110 });
        gsap.set(rest, { opacity: 0, y: 30 });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: section, start: "top 75%" },
        });

        tl.to(q("[data-c-eyebrow]"), {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
        })
          .to(
            lines,
            {
              yPercent: 0,
              duration: 1,
              stagger: 0.12,
              ease: "power4.out",
            },
            "-=0.3"
          )
          .to(
            q("[data-c-sub]"),
            { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
            "-=0.6"
          )
          .to(
            q("[data-c-cta]"),
            { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
            "-=0.5"
          )
          .to(
            q("[data-c-socials]"),
            { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
            "-=0.45"
          )
          .to(
            q("[data-c-footer]"),
            { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
            "-=0.4"
          );

        // Desktop: magnetic pull on the primary email button.
        if (isDesktop) {
          const magnet = section.querySelector<HTMLElement>("[data-magnetic]");
          if (magnet) {
            const xTo = gsap.quickTo(magnet, "x", { duration: 0.6, ease: "power3.out" });
            const yTo = gsap.quickTo(magnet, "y", { duration: 0.6, ease: "power3.out" });
            const onMove = (e: MouseEvent) => {
              const r = magnet.getBoundingClientRect();
              xTo((e.clientX - (r.left + r.width / 2)) * 0.3);
              yTo((e.clientY - (r.top + r.height / 2)) * 0.5);
            };
            const onLeave = () => {
              xTo(0);
              yTo(0);
            };
            magnet.addEventListener("mousemove", onMove);
            magnet.addEventListener("mouseleave", onLeave);
            cleanups.push(() => {
              magnet.removeEventListener("mousemove", onMove);
              magnet.removeEventListener("mouseleave", onLeave);
            });
          }
        }

        document.fonts.ready.then(() => ScrollTrigger.refresh());

        return () => cleanups.forEach((fn) => fn());
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full overflow-hidden px-6 py-28 md:px-25 md:py-36"
    >
      {/* Top hairline gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent 15%, rgba(255,80,41,0.25) 50%, transparent 85%)",
        }}
      />
      {/* Ambient brand glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full opacity-40 blur-[130px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,80,41,0.22), transparent 70%)",
        }}
      />

      <div className="relative mx-auto flex max-w-5xl flex-col gap-14">
        {/* CTA block */}
        <div className="flex flex-col items-start gap-7">
          {/* Eyebrow / availability */}
          <span
            data-c-eyebrow
            className="inline-flex items-center gap-2.5 rounded-full border border-white-15 px-4 py-2"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <span className="text-xs font-medium uppercase tracking-widest text-gray-text">
              Available for new projects
            </span>
          </span>

          {/* Headline */}
          <h2 className="heading-gradient max-w-3xl font-(family-name:--font-bricolage) text-[clamp(2.5rem,7vw,5rem)] font-semibold leading-[1.05]">
            <span className="block overflow-hidden pb-1">
              <span data-c-line className="block">
                Let&apos;s build something
              </span>
            </span>
            <span className="block overflow-hidden pb-1">
              <span data-c-line className="block">
                worth{" "}
                <span
                  className="font-(family-name:--font-instrument) italic text-brand"
                  style={{ WebkitTextFillColor: "var(--color-brand)" }}
                >
                  shipping.
                </span>
              </span>
            </span>
          </h2>

          {/* Subtext */}
          <p
            data-c-sub
            className="max-w-xl text-base leading-relaxed text-gray-text md:text-lg"
          >
            Have a web app, a design system, or a Flutter build in mind? My inbox
            is always open — tell me what you&apos;re working on and I&apos;ll get
            back to you within a day or two.
          </p>

          {/* Primary CTA */}
          <div data-c-cta className="flex flex-wrap items-center gap-3">
            <a
              data-magnetic
              href={`mailto:${EMAIL}`}
              className="group inline-flex h-14 items-center gap-3 rounded-full bg-white px-7 text-sm font-semibold text-[#060703] transition-shadow hover:shadow-[0_0_40px_-8px_rgba(255,80,41,0.6)]"
            >
              <Mail size={18} strokeWidth={2} />
              <span>{EMAIL}</span>
              <ArrowUpRight
                size={18}
                strokeWidth={2}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>

            <button
              type="button"
              onClick={handleCopy}
              aria-label={copied ? "Email copied to clipboard" : "Copy email address"}
              className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-white-15 text-gray-text transition-colors hover:border-brand/40 hover:text-white"
            >
              {copied ? (
                <Check size={18} strokeWidth={2} className="text-green-400" />
              ) : (
                <Copy size={18} strokeWidth={1.75} />
              )}
            </button>
          </div>
        </div>

        {/* Socials */}
        <div data-c-socials className="flex flex-wrap items-center gap-3">
          {socials.map(({ label, href, icon }) => {
            const external = href.startsWith("http");
            return (
              <a
                key={label}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                aria-label={external ? `${label} (opens in new tab)` : label}
                className="group inline-flex h-12 items-center gap-3 rounded-xl border border-white-15 pl-4 pr-3 text-gray-text transition-colors hover:border-brand/40 hover:text-white"
              >
                {icon}
                <span className="text-sm font-medium">{label}</span>
                <ArrowUpRight
                  size={15}
                  className="opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 group-hover:text-brand"
                />
              </a>
            );
          })}
        </div>

        {/* Footer */}
        <footer
          data-c-footer
          className="flex flex-col gap-6 border-t border-white-15 pt-8 md:flex-row md:items-center md:justify-between"
        >
          <span className="order-2 text-xs text-gray-text md:order-1">
            {`© ${new Date().getFullYear()} Juliansyah — Crafted with care in Bangka Belitung`}
          </span>

          <nav className="order-1 flex items-center gap-6 md:order-2">
            {navLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-xs font-medium uppercase tracking-widest text-gray-text transition-colors hover:text-white"
              >
                {label}
              </a>
            ))}
            <a
              href="#hero"
              aria-label="Back to top"
              className="group inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-gray-text transition-colors hover:text-white"
            >
              Top
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white-15 transition-colors group-hover:border-brand/40 group-hover:text-brand">
                <ArrowUp size={14} />
              </span>
            </a>
          </nav>
        </footer>
      </div>
    </section>
  );
}
