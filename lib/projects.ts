/**
 * Single source of truth for portfolio projects.
 *
 * Both list surfaces (home "Selected Work" + the /projects page) and the
 * dynamic detail route read from `projects`. Only entries with a `detail`
 * object get a statically-generated detail page at /projects/<slug>; the
 * demo entries stay summary-only with `href: "#"` until they become real.
 */

export type ProjectCategory = "Frontend" | "UI/UX" | "Mobile";

export interface ProjectStat {
  value: string;
  label: string;
}

/** `icon` is a key mapped to a lucide-react component in the detail UI. */
export interface ProjectFeature {
  icon: string;
  title: string;
  description: string;
}

/** A portrait phone screenshot. `src` may point at a file that doesn't exist
 * yet — the gallery renders a graceful placeholder until it's dropped in. */
export interface ProjectShot {
  src: string;
  alt: string;
}

export interface ProjectTechGroup {
  group: string;
  items: string[];
}

export interface ProjectDetail {
  /** Hero subtitle. */
  tagline: string;
  /** Who it was built for. */
  client: string;
  /** Optional client logo (path under /public). */
  clientLogo?: string;
  /** e.g. ["Android", "iOS"]. */
  platforms: string[];
  /** 1–2 short paragraphs — shown in the Overview and used for SEO. */
  overview: string[];
  stats: ProjectStat[];
  features: ProjectFeature[];
  techStack: ProjectTechGroup[];
  gallery: ProjectShot[];
  /** Public store URLs — buttons render only when a URL is present. */
  storeLinks?: { playStore?: string; appStore?: string };
  privacyPolicyUrl?: string;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  year: string;
  role: string;
  category: ProjectCategory;
  badges: string[];
  /** "/projects/<slug>" for real case studies, "#" for demos. */
  href: string;
  /** Shown in the home "Selected Work" subset. */
  featured?: boolean;
  /** Card + hero + OG image (path under /public). Optional until provided. */
  thumbnail?: string;
  /** Present only for real case studies — drives the detail page. */
  detail?: ProjectDetail;
}

const ASSET_BASE = "/projects/presensi-pkp";

export const projects: Project[] = [
  {
    slug: "presensi-pkp",
    title: "Presensi PKP",
    description:
      "The official GPS-verified attendance app for the Pangkalpinang city government — field check-ins, leave requests, and history in one Flutter codebase, serving ~7,000 employees at 99.9% crash-free.",
    year: "2025",
    role: "Mobile Engineer · Flutter",
    category: "Mobile",
    badges: ["Flutter", "Dart", "BLoC", "Clean Architecture", "Firebase"],
    href: "/projects/presensi-pkp",
    featured: true,
    thumbnail: `${ASSET_BASE}/thumbnail.webp`,
    detail: {
      tagline:
        "GPS-verified employee attendance for a city government — check-in, leave requests, and history in one Flutter app.",
      client: "Pemerintah Kota Pangkalpinang · Diskominfo",
      clientLogo: "/logos/pangkalpinang.png",
      platforms: ["Android", "iOS"],
      overview: [
        "Presensi PKP is the official employee-attendance app for the Pangkalpinang city government, replacing manual fingerprint machines with GPS-verified mobile check-ins. Civil servants (ASN) clock in and out from the field, request leave, and review their attendance history — every action validated against the government's servers in real time.",
        "Built in Flutter on a Clean Architecture + BLoC foundation, it ships to Android and iOS from a single codebase and today serves roughly 7,000 active employees at a 99.9% crash-free rate.",
      ],
      stats: [
        { value: "7,000+", label: "Active users" },
        { value: "99.9%", label: "Crash-free sessions" },
        { value: "2", label: "Platforms — Android & iOS" },
        { value: "Material 3", label: "Light & dark themes" },
      ],
      features: [
        {
          icon: "map-pin",
          title: "GPS-verified check-in",
          description:
            "Clock in and out only within the office geofence, validated with geolocator over an OpenStreetMap view.",
        },
        {
          icon: "shield-alert",
          title: "Fake-GPS detection",
          description:
            "Mock-location and GPS-spoofing attempts are detected and blocked, so attendance can't be faked.",
        },
        {
          icon: "camera",
          title: "Photo capture",
          description:
            "A camera capture at check-in adds a second layer of identity verification.",
        },
        {
          icon: "file-text",
          title: "Leave requests (Izin)",
          description:
            "Submit and track leave and permits with document attachments, end to end.",
        },
        {
          icon: "history",
          title: "Attendance history",
          description:
            "A calendar view of every past check-in, check-out, and daily status.",
        },
        {
          icon: "bell",
          title: "Push notifications",
          description:
            "Firebase Cloud Messaging delivers reminders and real-time updates.",
        },
        {
          icon: "clock",
          title: "Server-time sync",
          description:
            "Timestamps are locked to server time, not the device clock, to prevent tampering.",
        },
        {
          icon: "wifi-off",
          title: "Offline-ready",
          description:
            "Hive caching keeps the app responsive on unreliable field networks.",
        },
      ],
      techStack: [
        { group: "Framework", items: ["Flutter", "Dart"] },
        {
          group: "Architecture",
          items: ["Clean Architecture", "BLoC / Cubit", "GetIt (DI)", "Freezed"],
        },
        {
          group: "Data & Network",
          items: ["Dio", "GoRouter", "Hive", "Secure Storage", "dartz"],
        },
        {
          group: "Device",
          items: ["geolocator", "flutter_map (OSM)", "camera"],
        },
        {
          group: "Platform",
          items: ["Firebase Crashlytics", "Firebase Messaging"],
        },
      ],
      gallery: [
        { src: `${ASSET_BASE}/screen-01.webp`, alt: "Presensi PKP login screen" },
        {
          src: `${ASSET_BASE}/screen-02.webp`,
          alt: "Home dashboard with the attendance summary and menu",
        },
        {
          src: `${ASSET_BASE}/screen-03.webp`,
          alt: "Check-in screen showing the office location on a map",
        },
        {
          src: `${ASSET_BASE}/screen-04.webp`,
          alt: "Camera capture during check-in",
        },
        {
          src: `${ASSET_BASE}/screen-05.webp`,
          alt: "Leave request (Izin) form",
        },
        {
          src: `${ASSET_BASE}/screen-06.webp`,
          alt: "Attendance history calendar",
        },
        {
          src: `${ASSET_BASE}/screen-07.webp`,
          alt: "Push notifications list",
        },
        {
          src: `${ASSET_BASE}/screen-08.webp`,
          alt: "Employee profile screen",
        },
      ],
      // TODO: paste the public store URLs here — buttons appear automatically.
      storeLinks: { playStore: "", appStore: "" },
      // TODO (optional): public privacy-policy URL.
      privacyPolicyUrl: "",
    },
  },

  // ── Demo projects (placeholders, href "#") ─────────────────────────────
  {
    slug: "e-commerce-platform",
    title: "E-Commerce Platform",
    description:
      "A full storefront with cart, checkout, and Stripe payments — built for speed and a seamless mobile experience, on a component system designed to scale.",
    year: "2024",
    role: "Frontend Engineer",
    category: "Frontend",
    badges: ["Next.js", "TypeScript", "Tailwind", "Stripe", "Zustand"],
    href: "#",
    featured: true,
  },
  {
    slug: "task-management-app",
    title: "Task Management App",
    description:
      "Real-time collaborative workspace with drag-and-drop kanban boards, live updates, and a snappy, keyboard-friendly interface.",
    year: "2024",
    role: "Frontend Engineer",
    category: "Frontend",
    badges: ["React", "TypeScript", "Tailwind", "dnd-kit", "Zustand"],
    href: "#",
    featured: true,
  },
  {
    slug: "analytics-dashboard",
    title: "Analytics Dashboard",
    description:
      "Designed and built a data-viz platform that turns complex datasets into clear, actionable insight — custom widgets, date filtering, and CSV export.",
    year: "2023",
    role: "UI/UX & Frontend",
    category: "UI/UX",
    badges: ["Figma", "Design System", "React", "Recharts"],
    href: "#",
    featured: true,
  },
  {
    slug: "mobile-banking-app",
    title: "Mobile Banking App",
    description:
      "A secure, intuitive banking experience with biometric auth, peer-to-peer transfers, and spending analytics — one Flutter codebase, native feel on iOS & Android.",
    year: "2023",
    role: "Mobile Developer · Flutter",
    category: "Mobile",
    badges: ["Flutter", "Dart", "Riverpod", "Biometrics"],
    href: "#",
  },
  {
    slug: "ai-content-generator",
    title: "AI Content Generator",
    description:
      "A polished interface for an LLM writing tool — streaming responses, prompt presets, and an editor that stays fast under heavy load.",
    year: "2023",
    role: "Frontend Engineer",
    category: "Frontend",
    badges: ["Next.js", "TypeScript", "Streaming UI", "Tailwind"],
    href: "#",
  },
  {
    slug: "real-estate-platform",
    title: "Real Estate Platform",
    description:
      "Property search with interactive maps, advanced filters, and saved searches — designed end-to-end, from wireframes to shipped UI.",
    year: "2022",
    role: "UI/UX & Frontend",
    category: "UI/UX",
    badges: ["Figma", "Next.js", "Mapbox", "Design System"],
    href: "#",
  },
  {
    slug: "habit-fitness-tracker",
    title: "Habit & Fitness Tracker",
    description:
      "A cross-platform habit and workout tracker with delightful micro-animations, progress charts, and an offline-first local store.",
    year: "2022",
    role: "Mobile Developer · Flutter",
    category: "Mobile",
    badges: ["Flutter", "Dart", "Animations", "Local DB"],
    href: "#",
  },
];

/** Home "Selected Work" subset. */
export const featuredProjects = projects.filter((p) => p.featured);

export const getProjectBySlug = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug);

/** Params for `generateStaticParams` — only projects with a detail page. */
export const detailedSlugs = (): { slug: string }[] =>
  projects.filter((p) => p.detail).map((p) => ({ slug: p.slug }));
