"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowLeft,
  Bell,
  Camera,
  Clock,
  FileText,
  History,
  ImageIcon,
  MapPin,
  ShieldAlert,
  ShieldCheck,
  WifiOff,
  type LucideIcon,
} from "lucide-react";
import type { Project } from "@/lib/projects";

// Feature `icon` keys → lucide components (data stays serializable/server-safe).
const ICONS: Record<string, LucideIcon> = {
  "map-pin": MapPin,
  "shield-alert": ShieldAlert,
  camera: Camera,
  "file-text": FileText,
  history: History,
  bell: Bell,
  clock: Clock,
  "wifi-off": WifiOff,
};

/** Branded fallback shown until a real image file is dropped in (or on load error). */
function Placeholder({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#161619] text-dark-gray">
      <ImageIcon aria-hidden="true" size={28} strokeWidth={1.25} />
      <span className="px-3 text-center text-[11px] font-medium uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

/** next/image that degrades to a branded placeholder when the file is missing. */
function SmartImage({
  src,
  alt,
  sizes,
  priority,
  placeholderLabel,
}: {
  src?: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  placeholderLabel: string;
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <Placeholder label={placeholderLabel} />;
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
      className="object-cover"
    />
  );
}

function GooglePlayGlyph() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3.6 2.3c-.2.2-.35.55-.35 1v17.4c0 .45.15.8.4 1l.1.1L13.3 12v-.2L3.75 2.2l-.15.1Z" />
      <path d="M16.5 15.2 13.3 12v-.2l3.2-3.2.08.05 3.8 2.16c1.08.6 1.08 1.6 0 2.22l-3.8 2.16-.08.05Z" />
      <path d="M16.58 15.15 13.3 11.9 3.6 21.7c.36.38.94.42 1.6.05l11.38-6.6Z" />
      <path d="M16.58 8.65 5.2 2.05c-.66-.38-1.24-.33-1.6.05l9.7 9.8 3.28-3.25Z" />
    </svg>
  );
}

function AppleGlyph() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 12.54c-.03-2.6 2.12-3.85 2.22-3.9-1.21-1.77-3.1-2.02-3.77-2.05-1.6-.16-3.13.94-3.94.94-.82 0-2.07-.92-3.4-.9-1.75.03-3.36 1.02-4.26 2.58-1.82 3.16-.46 7.83 1.3 10.4.86 1.25 1.88 2.66 3.22 2.6 1.29-.05 1.78-.83 3.34-.83 1.55 0 2 .83 3.36.81 1.39-.03 2.27-1.27 3.12-2.53.98-1.45 1.39-2.85 1.41-2.92-.03-.02-2.71-1.04-2.74-4.13ZM14.7 4.9c.71-.86 1.19-2.05 1.06-3.24-1.02.04-2.26.68-2.99 1.54-.66.76-1.23 1.98-1.08 3.14 1.14.09 2.3-.58 3.01-1.44Z" />
    </svg>
  );
}

/** Store button — a real link when a URL is set, else a clearly-disabled placeholder. */
function StoreButton({
  href,
  label,
  glyph,
}: {
  href?: string;
  label: string;
  glyph: React.ReactNode;
}) {
  const base =
    "inline-flex h-11 items-center gap-2 rounded-lg px-5 text-sm font-medium transition-colors";
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Download Presensi PKP on ${label} (opens in a new tab)`}
        className={`${base} bg-white text-[#060703] hover:opacity-90`}
      >
        {glyph}
        {label}
      </a>
    );
  }
  return (
    <span
      role="link"
      aria-disabled="true"
      title="Link coming soon"
      className={`${base} cursor-not-allowed border border-white-15 text-dark-gray`}
    >
      {glyph}
      {label}
    </span>
  );
}

export default function ProjectDetail({ project }: { project: Project }) {
  const rootRef = useRef<HTMLElement>(null);
  const detail = project.detail!; // route guarantees this

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        // Hero entrance.
        gsap.from("[data-hero-item]", {
          opacity: 0,
          y: 24,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
        });

        // Section reveals on scroll.
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          gsap.from(el, {
            opacity: 0,
            y: 28,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          });
        });
      }, root);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  const stores = detail.storeLinks ?? {};

  return (
    <article ref={rootRef} className="w-full">
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pb-14 pt-10 md:px-25 md:pb-20 md:pt-16">
        {/* Ambient brand glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-10 h-96 w-96 rounded-full opacity-40 blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, rgba(255,80,41,0.18), transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-5xl">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" data-hero-item className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-text">
              <li>
                <Link href="/" className="transition-colors hover:text-white">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-dark-gray">
                /
              </li>
              <li>
                <Link href="/projects" className="transition-colors hover:text-white">
                  Projects
                </Link>
              </li>
              <li aria-hidden="true" className="text-dark-gray">
                /
              </li>
              <li aria-current="page" className="text-white">
                {project.title}
              </li>
            </ol>
          </nav>

          <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-14">
            {/* Left — copy */}
            <div className="flex flex-col gap-5">
              <span
                data-hero-item
                className="font-(family-name:--font-bricolage) text-sm font-medium uppercase tracking-widest text-gray-text"
              >
                {project.category} · {project.year}
              </span>

              <h1
                data-hero-item
                className="font-(family-name:--font-bricolage) text-4xl font-semibold leading-tight text-white md:text-5xl"
              >
                {project.title}
              </h1>

              <p
                data-hero-item
                className="max-w-xl text-lg leading-relaxed text-gray-text"
              >
                {detail.tagline}
              </p>

              {/* Client + platforms */}
              <div
                data-hero-item
                className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-text"
              >
                {detail.clientLogo && (
                  <Image
                    src={detail.clientLogo}
                    alt=""
                    width={28}
                    height={28}
                    className="h-7 w-7 rounded-md object-contain"
                  />
                )}
                <span>{detail.client}</span>
                <span aria-hidden="true" className="text-dark-gray">
                  ·
                </span>
                <span>{detail.platforms.join(" · ")}</span>
              </div>

              {/* Store buttons */}
              {"playStore" in stores || "appStore" in stores ? (
                <div data-hero-item className="mt-1 flex flex-wrap gap-3">
                  {"playStore" in stores && (
                    <StoreButton
                      href={stores.playStore || undefined}
                      label="Google Play"
                      glyph={<GooglePlayGlyph />}
                    />
                  )}
                  {"appStore" in stores && (
                    <StoreButton
                      href={stores.appStore || undefined}
                      label="App Store"
                      glyph={<AppleGlyph />}
                    />
                  )}
                </div>
              ) : null}

              {detail.privacyPolicyUrl ? (
                <a
                  data-hero-item
                  href={detail.privacyPolicyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-fit text-sm text-gray-text underline underline-offset-4 transition-colors hover:text-white"
                >
                  Privacy policy
                </a>
              ) : null}
            </div>

            {/* Right — thumbnail */}
            <div
              data-hero-item
              className="relative aspect-video w-full overflow-hidden rounded-xl border border-white-15 bg-[#1a1a1d]"
            >
              <SmartImage
                src={project.thumbnail}
                alt={`${project.title} — app preview`}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                placeholderLabel="Thumbnail coming soon"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────── */}
      <section className="px-6 md:px-25" data-reveal>
        <dl className="mx-auto grid max-w-5xl grid-cols-2 gap-px overflow-hidden rounded-xl border border-white-15 bg-white-15 md:grid-cols-4">
          {detail.stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col-reverse gap-1 bg-background p-6 md:p-7"
            >
              <dt className="text-xs font-medium uppercase tracking-widest text-gray-text">
                {stat.label}
              </dt>
              <dd className="font-(family-name:--font-bricolage) text-3xl font-semibold text-white md:text-4xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── OVERVIEW ─────────────────────────────────────────── */}
      <section className="px-6 py-20 md:px-25 md:py-24" data-reveal>
        <div className="mx-auto max-w-3xl">
          <h2 className="font-(family-name:--font-bricolage) text-sm font-medium uppercase tracking-widest text-gray-text">
            Overview
          </h2>
          <div className="mt-6 flex flex-col gap-5">
            {detail.overview.map((para, i) => (
              <p
                key={i}
                className="text-lg leading-relaxed text-gray-text first:text-foreground"
              >
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY ──────────────────────────────────────────── */}
      <section className="px-6 pb-20 md:px-25 md:pb-24" data-reveal>
        <div className="mx-auto max-w-5xl">
          <h2 className="font-(family-name:--font-bricolage) text-sm font-medium uppercase tracking-widest text-gray-text">
            Screens
          </h2>
          <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {detail.gallery.map((shot, i) => (
              <li
                key={shot.src}
                className="relative aspect-[9/19] overflow-hidden rounded-2xl border border-white-15 bg-[#1a1a1d]"
              >
                <SmartImage
                  src={shot.src}
                  alt={shot.alt}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  placeholderLabel={`Screen ${i + 1}`}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section className="border-t border-white-15 px-6 py-20 md:px-25 md:py-24" data-reveal>
        <div className="mx-auto max-w-5xl">
          <h2 className="font-(family-name:--font-bricolage) text-3xl font-semibold text-white md:text-4xl">
            Key{" "}
            <span className="font-(family-name:--font-instrument) italic text-brand">
              features
            </span>
          </h2>
          <ul className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {detail.features.map((feature) => {
              const Icon = ICONS[feature.icon] ?? ShieldCheck;
              return (
                <li key={feature.title} className="flex flex-col gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-white-15 bg-[#1a1a1d] text-brand">
                    <Icon aria-hidden="true" size={20} strokeWidth={1.75} />
                  </span>
                  <h3 className="font-(family-name:--font-bricolage) text-lg font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-text">
                    {feature.description}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ── TECH STACK ───────────────────────────────────────── */}
      <section className="border-t border-white-15 px-6 py-20 md:px-25 md:py-24" data-reveal>
        <div className="mx-auto max-w-5xl">
          <h2 className="font-(family-name:--font-bricolage) text-3xl font-semibold text-white md:text-4xl">
            Built with
          </h2>
          <div className="mt-10 flex flex-col gap-8">
            {detail.techStack.map((group) => (
              <div
                key={group.group}
                className="flex flex-col gap-4 border-b border-white-15 pb-8 last:border-b-0 last:pb-0 md:flex-row md:gap-8"
              >
                <h3 className="shrink-0 text-xs font-medium uppercase tracking-widest text-gray-text md:w-40 md:pt-1">
                  {group.group}
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-white-15 px-3 py-1 text-sm font-medium text-foreground"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BACK ─────────────────────────────────────────────── */}
      <section className="border-t border-white-15 px-6 py-14 md:px-25">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-base text-gray-text transition-colors hover:text-white"
          >
            <ArrowLeft
              aria-hidden="true"
              size={18}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            Back to all projects
          </Link>
        </div>
      </section>
    </article>
  );
}
