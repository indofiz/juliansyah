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
  /**
   * Real screens, shown while there's no recording: a slideshow in the studio
   * phone, or the first one as a still in a browser frame without its toolbar.
   */
  screens?: ImageRef[];
  /**
   * Studio stills (content/mockups.ts): `card` on the homepage, `page` on the
   * case study, `tablet` for the case study's tablet screenshot.
   */
  stills?: { card: DeviceStill; page: DeviceStill; tablet?: DeviceStill };
  /**
   * Browser frame only: recordings of the page scrolling, played over the
   * still in `screens[0]` (media/ScrollVideo.tsx). `card` plays on the
   * homepage card while it's hovered or focused (on touch screens, while it's
   * on screen); `page` plays on the case study hero. Each starts and ends on
   * the still's frame, so it loops without a jump. Recorded with
   * scripts/record-scroll.mjs, compressed with scripts/encode-scroll.sh.
   */
  scroll?: { card?: VideoSources; page?: VideoSources };
};

/** One recording in two formats: WebM (VP9) first, MP4 (H.264) for Safari. */
export type VideoSources = { webm: string; mp4: string };

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

/*
 * Bold: in case-study copy (role, process, decisions, result, before/after),
 * wrap words in **double asterisks** to show them in bold. Not in a
 * project's title or summary: those also go to meta tags and the OG image.
 */

export type CaseStudy = {
  /** The problem, in the client's words where possible. */
  problem: string[];
  /**
   * Old way vs new way, one pair per row. Shown right after the problem.
   * `shots`: screenshots of the two, side by side above the rows (16:10, in
   * browser frames), e.g. the old site from the Wayback Machine and the new one.
   */
  compare?: {
    beforeTitle: string;
    afterTitle: string;
    rows: { before: string; after: string }[];
    shots?: { before: ImageRef & { caption: string }; after: ImageRef & { caption: string } };
  };
  role: { summary: string; did: string[] };
  process: { title: string; text: string }[];
  /**
   * Brand and pattern: the brand colours as swatches (`hex` exactly as the
   * site uses it) and close-ups of where the identity shows on the page.
   * Shown after the key decisions.
   */
  brand?: { colors: { label: string; hex: string }[]; details: (ImageRef & { caption: string })[] };
    /** "Built with": the stack in named groups, shown as chips. */
  stack?: { group: string; items: string[] }[];
  decisions: { title: string; why: string; tradeoff?: string }[];
  /** More real screens, each in the studio phone (needs `media.stills`), with a short caption under it. */
  gallery?: (ImageRef & { caption: string })[];
  /**
   * A tablet screenshot in the studio tablet, with the phone's first screen
   * in front of it, above the gallery (needs `media.stills.tablet`).
   */
  tablet?: ImageRef & { caption: string };
  result: { text: string; metrics: Metric[] };
  links?: Link[];
};

/**
 * Lighthouse category scores (0–100) from one measured run, drawn as
 * PageSpeed's rings (work/ScoreRings.tsx). Never estimated: keep the report
 * beside the numbers (docs/evidence/<project>/).
 */
export type LighthouseScores = {
  /** Which run the numbers come from; named in the caption. */
  device: "desktop" | "mobile";
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
};

/** Where to get a live app. `name` is the app's name in the stores. */
export type StoreLinks = { name: string; appStore?: string; googlePlay?: string };

/** A store's star rating as the store showed it on `checked` (ISO date). Update it by hand. */
export type StoreRating = { value: string; count: number; store: string; href: string; checked: string };

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
  /** Lighthouse rings: on the card in place of `metric`, and in the case study's result. */
  lighthouse?: LighthouseScores;
  /** A few key technologies, shown in bold on the card, e.g. ["Clean Architecture", "BLoC", "Firebase"]. */
  keyTech?: string[];
  /** Store links: badges on the case study. */
  stores?: StoreLinks;
  /** Star rating: a chip on the card and a line on the case study. */
  rating?: StoreRating;
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
