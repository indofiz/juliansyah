import type { IconName } from "@/components/ui/Icon";

/*
 * Types for everything in site.ts.
 *
 * Placeholders: any string that starts with "TODO:" is unconfirmed content.
 * <Placeholder> (components/ui/Placeholder.tsx) renders it with a dashed
 * outline so it can't ship unnoticed. List them all with:
 *   grep -rn "TODO:" src/content
 */

export type { IconName };

export type Link = { label: string; href: string };

export type Platform = "Flutter" | "Web" | "Design";

export type ImageRef = { src: string; alt: string; width: number; height: number };

/** One number with its meaning, e.g. { value: "7,000+", label: "active users" }. */
export type Metric = { value: string; label: string };

/**
 * A short, silent screen recording. Plays muted and looped only while it's
 * near the viewport, never with reduced motion. With no `webm`/`mp4` yet, a
 * wireframe placeholder is shown instead.
 */
export type LoopMedia = {
  frame: "phone" | "browser";
  /** What the loop shows. Used as the accessible name. */
  label: string;
  /** Short visible caption, e.g. "Presensi PKP · Flutter". */
  caption?: string;
  /** First frame, shown before playback and as the reduced-motion fallback. */
  poster?: string;
  webm?: string;
  mp4?: string;
  /** WebVTT captions, only if the loop shows text a screen reader would miss. */
  captions?: string;
};

export type ProofItem = { icon: IconName; value: string; label: string };

export type CaseStudy = {
  /** The problem, in the client's words where possible. */
  problem: string[];
  role: { summary: string; did: string[] };
  process: { title: string; text: string }[];
  decisions: { title: string; why: string; tradeoff?: string }[];
  result: { text: string; metrics: Metric[] };
  gallery?: ImageRef[];
  links?: Link[];
};

export type Project = {
  slug: string;
  /** Product name, e.g. "Presensi PKP". */
  name: string;
  /** Headline that leads with the outcome. */
  title: string;
  summary: string;
  client: string;
  role: string;
  platforms: Platform[];
  year: string;
  /** The one result shown on the card. */
  metric: Metric;
  media: LoopMedia;
  /**
   * A Flutter web build in /public/demos/<slug>/, built with
   * `flutter build web --base-href /demos/<slug>/`. Set this only once the
   * build exists; without it the card shows the video.
   */
  demo?: { src: string; title: string };
  /** The flagship gets the large card with "Tap to try". */
  flagship?: boolean;
  /** Dummy entries hold a slot until a real project replaces them. */
  dummy?: boolean;
  caseStudy: CaseStudy;
};

/** "What I do": grouped by what the client gets. `id` also picks the bento illustration. */
export type Capability = {
  id: "mobile" | "web" | "design" | "motion" | "performance";
  icon: IconName;
  title: string;
  text: string;
  tools: string[];
};

export type PlaygroundItem = {
  slug: string;
  title: string;
  text: string;
  /** "video": a muted loop. "iframe": an interactive page, mounted only near the viewport. */
  kind: "video" | "iframe";
  media: LoopMedia;
  src?: string;
  href?: string;
  tags: string[];
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  /** Initials avatar until a photo is provided. */
  photo?: ImageRef;
  /** Slug of the project it's about; links the quote to its case study. */
  project?: string;
};
