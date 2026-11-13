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

/** One step in How I work. `id` picks its picture (lib/stepScenes.ts). */
export type ProcessStep = { id: "discover" | "design" | "build" | "launch"; title: string; text: string };

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
  /** Real app screens, shown in the studio phone as a slideshow while there's no recording. */
  screens?: ImageRef[];
  /** Studio stills of the phone (content/mockups.ts): `card` on the homepage, `page` on the case study. */
  stills?: { card: DeviceStill; page: DeviceStill };
};

/**
 * A still of a device whose screen is see-through, exported from /studio
 * ("Library files", cropped to the phone). Content is warped into the screen
 * with the corners below: see media/DeviceStill.tsx.
 */
export type DeviceStill = {
  /** The frame, with a transparent screen. */
  src: string;
  /** The screen as an alpha mask (white where the screen is), for CSS mask-image. */
  mask: string;
  /** The glass sheen, white with alpha, laid over the screen. */
  glare?: string;
  /** Size of the three images, in pixels. */
  width: number;
  height: number;
  /** Screen corners in those pixels, as the content is held: top-left, top-right, bottom-right, bottom-left. */
  quad: [[number, number], [number, number], [number, number], [number, number]];
  /** The CSS size content is laid out at before it's warped in (the phone's size in points). */
  screen: { width: number; height: number };
};

export type ProofItem = { icon: IconName; value: string; label: string };

/** A logo in the hero's moving strip. width/height: the image file's real pixel size. */
export type ClientLogo = { name: string; src: string; width: number; height: number };

/** Sidebar row of the hero dashboard mock; `tail` adds a chevron or a coloured pill. */
export type MockNavItem = { icon: IconName; label: string; tail?: "chevron" | "hot" | "ai" | "new" };

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
  /** Optional status chip, e.g. "Live in production". */
  status?: string;
  /** The one result shown on the card. */
  metric: Metric;
  media: LoopMedia;
  /** The flagship gets the large card. */
  flagship?: boolean;
  /** Dummy entries hold a slot until a real project replaces them. */
  dummy?: boolean;
  caseStudy: CaseStudy;
};

/**
 * A card beside the particle portrait in About: the first is about you (with
 * `photo`, your real photo replaces the icon tile), the rest are expertise,
 * each with the tools underneath.
 */
export type AboutCard = {
  id: string;
  icon: IconName;
  photo?: boolean;
  title: string;
  /** Location line under the title, with a pin. */
  place?: string;
  text: string;
  tools?: string[];
  /** Show the social buttons (from `socials` in site.ts) under the text. */
  socials?: boolean;
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
