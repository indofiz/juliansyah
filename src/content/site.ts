/**
 * All page copy lives here; the components only read from this file.
 * Types: ./types.ts. The previous site (v1) is preserved at git tag `v1-legacy`.
 *
 * Placeholders: any string starting with "TODO:" is unconfirmed and renders
 * with a dashed outline. List them with: grep -n "TODO:" src/content/site.ts
 */

import type { Capability, ClientLogo, IconName, Link, LoopMedia, MockNavItem, Platform, PlaygroundItem, Project, ProofItem, Testimonial } from "./types";

export const site = {
  name: "Juliansyah",
  wordmark: { first: "JULIAN", second: "SYAH" },
  role: "Flutter developer, front-end developer and UI/UX designer",
  // TODO: confirm the domain. It's used for canonical URLs, the sitemap and Open Graph.
  url: "https://juliansyah.dev",
  email: "juliansyah.ekt17@gmail.com",
  github: "https://github.com/indofiz",
  linkedin: "TODO: LinkedIn URL",
  dribbble: "TODO: Dribbble URL",
  location: "Jakarta, Indonesia",
  timeZone: "Asia/Jakarta",
  utcOffset: "UTC+7",
  description:
    "Juliansyah designs and builds Flutter apps and web front-ends from Jakarta (UTC+7): UI/UX design, Flutter, React and Next.js, from first sketch to shipped release.",
};

/** Social icons in the footer. A "TODO:" href renders as a dashed placeholder. */
export const socials: { icon: IconName; label: string; href: string }[] = [
  { icon: "github", label: "GitHub", href: site.github },
  { icon: "linkedin", label: "LinkedIn", href: site.linkedin },
  { icon: "dribbble", label: "Dribbble", href: site.dribbble },
  { icon: "mail", label: "Email", href: `mailto:${site.email}` },
];

/** Main navigation (desktop pill and mobile menu). "Hire me" goes to Contact. */
export const nav = {
  links: [
    { label: "Work", href: "/#work" },
    { label: "About", href: "/#about" },
    { label: "Playground", href: "/#playground" },
    { label: "Contact", href: "/#contact" },
  ] satisfies Link[],
  hire: { label: "Hire me", href: "/#contact" },
  email: "Email me",
  menu: { open: "Open menu", close: "Close menu", label: "Main" },
};

/* ---------------------------------------------------------------------------
 * 1. Hero: who are you?
 * ------------------------------------------------------------------------- */
export const hero = {
  /** The pill above the headline: "Hi, I'm <name> ✳ <tagline>". The ✳ is drawn by Hero.tsx. */
  eyebrow: { greeting: "Hi, I'm", tagline: "Your Technology Partner" },
  /** Not shown in the hero any more; used as the footer line of the Open Graph image. */
  roles: "Flutter developer · Front-end developer · UI/UX designer",
  title: "I Engineer Digital Products That Solve Real Problems.",
  text: "I'm a software engineer with a strong eye for design and a product-driven mindset. I turn complex challenges into intuitive, functional digital experiences that help businesses work better.",
  primary: { label: "Let's Work Together", href: "/#contact" },
  secondary: { label: "Explore My Work", href: "/#work" },
  /**
   * The dashboard under the buttons: a preview of the free design system.
   * The stat card is REAL (users, client logos). The sidebar, top
   * bar and the three tiles below it are SAMPLE data; the `tag` says so.
   */
  dashboard: {
    tag: "Design system preview",
    nav: [
      { icon: "grid", label: "Dashboard" },
      { icon: "folder", label: "Projects", tail: "chevron" },
      { icon: "cube", label: "Components", tail: "chevron" },
      { icon: "phone", label: "Mobile", tail: "hot" },
      { icon: "users", label: "Customers", tail: "chevron" },
      { icon: "file", label: "Reports" },
      { icon: "activity", label: "Analytics", tail: "ai" },
      { icon: "layers", label: "Tokens", tail: "new" },
      { icon: "message", label: "Messages" },
    ] satisfies MockNavItem[],
    pills: { hot: "Hot", ai: "AI", new: "New" },
    tour: "Product tour · 2 min",
    themes: ["Dark", "Light"],
    crumb: "Dashboard",
    range: "Last 30 days",
    alerts: "3",
    greet: "Good evening, visitor",
    /** People using apps I've built (user's figure, 2026-11-11). */
    users: { value: "12K+", label: "people use my apps", apps: "Presensi PKP, PKP Smart and more" },
    /** Moving logo strip. Files in public/logos (from the v1 site); width/height are the PNG's real size. */
    clients: {
      label: "Organisations I've worked with",
      logos: [
        { name: "Linknet", src: "/logos/linknet.png", width: 562, height: 200 },
        { name: "Uswah", src: "/logos/uswah_salam.png", width: 540, height: 200 },
        { name: "Mabes TNI", src: "/logos/mabes_tni.png", width: 213, height: 200 },
        { name: "Kabupaten Malinau", src: "/logos/malinau.png", width: 159, height: 200 },
        { name: "Nizamia Andalusia", src: "/logos/nizamia.png", width: 200, height: 200 },
        { name: "Kota Pangkalpinang", src: "/logos/pangkalpinang.png", width: 163, height: 200 },
        { name: "THI", src: "/logos/thi.png", width: 200, height: 200 },
        { name: "Yayasan Al Azhar", src: "/logos/yayasan_pendidikan_alazhar.png", width: 200, height: 200 },
      ] satisfies ClientLogo[],
    },
    /** Sample data. */
    tiles: [
      { label: "Conversion rate", value: "3.8%" },
      { label: "Avg. session", value: "4m 12s" },
      { label: "Tickets resolved", value: "1,204" },
    ],
  },
};

/* ---------------------------------------------------------------------------
 * 2. Track record (section id "proof"): can I trust you? The first numbers.
 * ------------------------------------------------------------------------- */
export const proof = {
  badge: "Track record",
  title: "Numbers from Shipped Work.",
  text: "From production apps for government, education and enterprise clients, as of November 2026.",
  /** Desktop only (hidden on phones, as on the old site). */
  primary: { label: "View work", href: "/#work" },
  secondary: { label: "Learn more", href: "/#services" },
  /** Keep labels short: they sit on one line next to the number. */
  items: [
    { icon: "users", value: "12K+", label: "App users" },
    // UNCONFIRMED: placeholder figure kept at the user's request (2026-11-11); replace with the real one.
    { icon: "shield", value: "99.9%", label: "Crash-free sessions" },
    { icon: "award", value: "8", label: "Client organisations" },
    // UNCONFIRMED: placeholder figure kept at the user's request (2026-11-11); replace with the real one.
    { icon: "clock", value: "3+", label: "Years of experience" },
    { icon: "layers", value: "3", label: "Web, UI/UX & mobile" },
  ] satisfies ProofItem[],
};

/* ---------------------------------------------------------------------------
 * 3. Selected work: can you do what I need? Cards link to /work/<slug>.
 * ------------------------------------------------------------------------- */
export const work = {
  badge: "Selected work",
  title: "Apps and sites I designed and built.",
  text: "Each card opens the full story: the problem, my role, the decisions and the result.",
  labels: {
    caseStudy: "Read the case study",
    tryDemo: "Tap to try",
    closeDemo: "Close demo",
    noDemo: "TODO: add a Flutter web build in /public/demos/<slug>/ to enable Tap to try",
    role: "Role",
    platform: "Platform",
    year: "Year",
  },
};

/** Empty slot for a project you haven't added yet. Pages for these are noindex. */
function dummyProject(slug: string, platform: Platform, frame: LoopMedia["frame"]): Project {
  return {
    slug,
    dummy: true,
    name: `TODO: ${platform} project name`,
    title: `TODO: outcome-led headline for a ${platform} project`,
    summary: "TODO: two sentences: who it was for and what changed for them.",
    client: "TODO: client",
    role: "TODO: your role",
    platforms: [platform],
    year: "TODO: year",
    metric: { value: "TODO: result", label: "TODO: what the number measures" },
    media: { frame, label: `TODO: screen recording of the ${platform} project`, caption: "TODO: project name" },
    caseStudy: {
      problem: ["TODO: the problem, in the client's words."],
      role: { summary: "TODO: what you owned.", did: ["TODO: what you did"] },
      process: [{ title: "TODO: step", text: "TODO: what happened in this step." }],
      decisions: [{ title: "TODO: decision", why: "TODO: why you made it." }],
      result: { text: "TODO: what changed after launch.", metrics: [{ value: "TODO: result", label: "TODO: what the number measures" }] },
    },
  };
}

/** In display order. The first flagship gets the big card with "Tap to try". */
export const projects: Project[] = [
  {
    slug: "presensi-pkp",
    name: "Presensi PKP",
    title: "GPS-verified check-ins replaced fingerprint machines for a city government.",
    summary:
      "The official attendance app for the Pangkalpinang city government. Civil servants check in and out from the field, request leave and review their history, and every record is validated against the city's servers.",
    client: "Pemerintah Kota Pangkalpinang · Diskominfo",
    role: "Flutter developer",
    platforms: ["Flutter"],
    year: "2025",
    status: "Live in production",
    metric: { value: "TODO: confirm 7,000+", label: "active employees" },
    media: {
      frame: "phone",
      label: "TODO: Presensi PKP check-in flow, screen recording",
      caption: "Presensi PKP · Flutter",
    },
    flagship: true,
    caseStudy: {
      problem: [
        "The city replaced its fingerprint machines with a mobile app. Civil servants clock in and out from the field, request leave and check their history, and every record is validated against the city's servers in real time.",
        "TODO: what wasn't working before, in the client's words.",
      ],
      role: {
        summary: "I built the Android and iOS app in Flutter, from one codebase.",
        did: [
          "TODO: team size, and whether you also designed it",
          "Check-in only inside the office geofence, shown on an OpenStreetMap view",
          "Fake-GPS and mock-location detection",
          "Photo capture at check-in as a second identity check",
          "Leave and permit requests with attachments",
          "Attendance history on a calendar",
          "Push notifications through Firebase Cloud Messaging",
        ],
      },
      process: [
        { title: "TODO: discovery", text: "TODO: how you learned what staff and admins needed." },
        { title: "TODO: design", text: "TODO: flows, wireframes and testing with real users." },
        { title: "TODO: build and release", text: "TODO: rollout, devices tested and release cadence." },
      ],
      decisions: [
        {
          title: "Server time, not the phone's clock",
          why: "Timestamps come from the server, so changing the device clock can't move a check-in.",
        },
        {
          title: "Refuse fake GPS",
          why: "Mock-location and spoofing attempts are detected and blocked, so a check-in means the person was really there.",
        },
        {
          title: "Cache for weak networks",
          why: "Hive caching keeps the app responsive on unreliable field connections.",
          tradeoff: "TODO: what you gave up, or how sync conflicts are handled.",
        },
        {
          title: "Clean Architecture with BLoC",
          why: "TODO: why this structure (testability, team size, long-term maintenance?).",
        },
      ],
      result: {
        text: "TODO: what changed for the city after launch.",
        metrics: [
          { value: "TODO: confirm 7,000+", label: "active employees" },
          { value: "TODO: confirm 99.9%", label: "crash-free sessions" },
          { value: "2", label: "platforms from one codebase, Android and iOS" },
        ],
      },
      links: [
        { label: "Google Play", href: "TODO: Google Play URL" },
        { label: "App Store", href: "TODO: App Store URL" },
      ],
    },
  },
  dummyProject("dummy-web-app", "Web", "browser"),
  dummyProject("dummy-flutter-app", "Flutter", "phone"),
  dummyProject("dummy-design", "Design", "browser"),
];

/** Headings on the case study pages (/work/<slug>). */
export const caseStudyLabels = {
  back: "All work",
  problem: "The problem",
  role: "My role",
  process: "Process",
  decisions: "Key decisions",
  tradeoff: "Trade-off",
  result: "Result",
  links: "Links",
  next: "Next project",
  ogEyebrow: "Case study",
};

/* ---------------------------------------------------------------------------
 * 4. Design → code: can you do what I need? (design and engineering, one person)
 * Pinned and scroll-scrubbed; a static row with reduced motion.
 * ------------------------------------------------------------------------- */
export const designToCode = {
  badge: "Design → code",
  title: "I design it and I ship it.",
  text: "One real component, five stages, one person. Scroll to watch a check-in card go from pencil sketch to running code.",
  component: "Presensi PKP · check-in card",
  note: "TODO: swap in the real sketch, wireframe, Figma frame and widget source from Presensi PKP",
  stages: [
    { id: "sketch", label: "Sketch", text: "Pencil first: what does someone in the field need to see before they tap?" },
    { id: "wireframe", label: "Wireframe", text: "Layout and hierarchy in greyscale, before colour gets a vote." },
    { id: "design", label: "Design", text: "Real type, colour and states, built on the design system's tokens." },
    { id: "code", label: "Flutter widget", text: "The same card as a Flutter widget, reading the same tokens." },
    { id: "running", label: "Running", text: "A web recreation of the Flutter widget, live on this page. Tap Check in." },
  ],
  sketch: { title: "check-in card", notes: ["where am I?", "inside the fence?", "big tap target"] },
  wireframe: { map: "Map + geofence", status: "Status line", button: "Check in" },
  /** Sample content inside the card mock-ups (illustration, not real data). */
  card: {
    greeting: "Good morning",
    time: "07:42",
    officeLabel: "Your office",
    office: "City Hall",
    status: "Inside the geofence",
    statusDone: "Attendance recorded",
    button: "Check in",
    buttonDone: "Checked in at",
    reset: "Reset demo",
  },
  codeFile: "check_in_card.dart",
  /** Highlighted at build time (src/lib/highlight.ts). Keep lines under ~50 characters. */
  code: `// TODO: paste the real widget from Presensi PKP
class CheckInCard extends StatelessWidget {
  const CheckInCard({
    super.key,
    required this.state,
    required this.onCheckIn,
  });

  final CheckInState state;
  final VoidCallback onCheckIn;

  @override
  Widget build(BuildContext context) {
    final t = context.tokens;
    return Card(
      color: t.surface,
      child: Column(children: [
        OfficeMap(fence: state.geofence),
        StatusChip(inside: state.inside),
        FilledButton(
          onPressed: state.inside ? onCheckIn : null,
          child: Text(t.label.checkIn),
        ),
      ]),
    );
  }
}`,
};

/* ---------------------------------------------------------------------------
 * 5. What I do: can you do what I need? Grouped by what the client gets.
 * Each card's illustration plays on hover (or while in view on touch screens):
 * see src/components/bento/Arts.tsx.
 * ------------------------------------------------------------------------- */
export const services = {
  badge: "What I do",
  title: "What you get when you work with me.",
  text: "Grouped by outcome, not by tool. The tools sit underneath each one.",
  toolsLabel: "Tools",
  items: [
    {
      id: "mobile",
      icon: "smartphone",
      title: "Mobile apps in Flutter",
      text: "One codebase for Android and iOS, on an architecture your team can keep extending.",
      tools: ["Flutter", "Dart", "BLoC", "Riverpod", "Firebase"],
    },
    {
      id: "design",
      icon: "pen",
      title: "UI/UX and design systems",
      text: "Flows, wireframes and prototypes, plus the tokens and components that keep design and code in sync.",
      tools: ["Figma", "Prototyping", "Design tokens", "Component libraries"],
    },
    {
      id: "web",
      icon: "code",
      title: "Web front-ends",
      text: "Fast, accessible sites and web apps, built straight from the design with no hand-off gap.",
      tools: ["React", "Next.js", "TypeScript"],
    },
    {
      id: "motion",
      icon: "spark",
      title: "Motion and interaction",
      text: "Transitions and micro-interactions that explain what just happened.",
      tools: ["Flutter animations", "GSAP", "Rive"],
    },
    {
      id: "performance",
      icon: "gauge",
      title: "Performance and accessibility",
      text: "Core Web Vitals budgets and WCAG AA from the first commit, checked before launch.",
      tools: ["Lighthouse", "Core Web Vitals", "WCAG AA"],
    },
  ] satisfies Capability[],
};

/** Text inside the bento illustrations (decorative, hidden from screen readers). */
export const bentoArt = {
  flutter: {
    /**
     * Your Flutter screenshots: two portrait PNGs (~9:19.5, e.g. 390×844) in
     * public/work/. The phone then swipes from the first to the second.
     */
    screens: [
      // "/work/flutter-1.png",
      // "/work/flutter-2.png",
    ] as string[],
    platforms: ["iOS", "Android", "Web"],
    clock: "9:41",
    toast: "Hot reload",
    home: {
      greeting: "Good morning",
      title: "Explore Bali",
      search: "Search places",
      hero: "Mount Batur",
      heroSub: "Sunrise trek",
      tabs: ["Hiking", "Beach", "Food"],
      tile: "Tegallalang",
      tileSub: "Rice terraces",
    },
    detail: { title: "Mount Batur", place: "Kintamani, Bali", priceLabel: "From", price: "$45", cta: "Book trip" },
  },
  uiux: { frame: "Home · Mobile", button: "Get started", spacing: "16", size: "320 × 280", comment: "Bigger tap target?", client: "Client", you: "You" },
  frontend: {
    tabs: ["Ship.tsx", "page.tsx"],
    url: "localhost:3000",
    button: "Ship it",
    done: "Shipped",
    /** [token class, text] per line: k keyword, f function, t tag, a attribute, v value, s string, p plain. */
    code: [
      [["k", "export const "], ["f", "Ship"], ["p", " = () => {"]],
      [["p", "  "], ["k", "const "], ["p", "[done, set] = "], ["f", "useState"], ["p", "("], ["v", "false"], ["p", ")"]],
      [["p", "  "], ["k", "return "], ["p", "("]],
      [["p", "    <"], ["t", "Button "], ["a", "glow onClick"], ["p", "={() => "], ["f", "set"], ["p", "("], ["v", "true"], ["p", ")}>"]],
      [["p", "      {done ? "], ["s", '"Shipped"'], ["p", " : "], ["s", '"Ship it"'], ["p", "}"]],
      [["p", "    </"], ["t", "Button"], ["p", ">"]],
      [["p", "  )"]],
      [["p", "}"]],
    ] as [string, string][][],
  },
  motion: { curve: "ease-in-out · cubic-bezier(.65, 0, .35, 1)" },
  /**
   * Score rings: this site's homepage, measured with Lighthouse 13.6 (mobile
   * profile) on 2026-11-11 against a local production build. Re-measure on the
   * live site after deploying and update these.
   */
  perf: [
    { label: "Performance", score: 80 },
    { label: "Accessibility", score: 100 },
    { label: "Best Practices", score: 100 },
    { label: "SEO", score: 100 },
  ],
};

/* ---------------------------------------------------------------------------
 * 6. Playground: small experiments people can play with. Each tile loads
 * only near the viewport and pauses (or unloads) when it leaves.
 * ------------------------------------------------------------------------- */
const experiment = (n: number, kind: PlaygroundItem["kind"]): PlaygroundItem => ({
  slug: `experiment-${n}`,
  title: `TODO: experiment ${n} name`,
  text: "TODO: one line on what it explores",
  kind,
  media: { frame: "browser", label: `TODO: experiment ${n} preview loop` },
  tags: ["TODO: tool"],
});

export const playground = {
  badge: "Playground",
  title: "Small experiments, built for fun.",
  text: "Motion studies and interface ideas I build between projects. Go ahead and play.",
  labels: { open: "Open", load: "Load experiment", source: "Source" },
  items: [
    experiment(1, "iframe"),
    experiment(2, "video"),
    experiment(3, "video"),
    experiment(4, "iframe"),
    experiment(5, "video"),
    experiment(6, "video"),
  ],
};

/* ---------------------------------------------------------------------------
 * 7. About: who are you, really? The particle portrait forms beside it.
 * ------------------------------------------------------------------------- */
export const about = {
  badge: "About",
  title: "Hi, I'm Juliansyah.",
  photo: {
    src: "/image-me.png",
    alt: "Juliansyah, smiling, in a green batik shirt against an orange background",
    width: 1024,
    height: 1024,
  },
  story: [
    "I'm a Flutter developer, front-end developer and UI/UX designer in Jakarta. I design the screens, then build them myself, for phones and the web.",
    "TODO: two or three sentences on how you got started and the problems you like solving.",
  ],
  careTitle: "What I care about",
  // Drafted from the work on this site: confirm or rewrite them.
  care: [
    "Apps that keep working on weak networks and older phones.",
    "Interfaces anyone can use: keyboard, screen reader or large text.",
    "Code the next developer can read without me in the room.",
  ],
  location: { title: "Where and when", place: "Jakarta, Indonesia", localTime: "Local time" },
  /** Working hours used for the overlap: 09:00–18:00 in both places. */
  workday: { start: 9, end: 18 },
  overlapTitle: "Hours my working day overlaps with yours",
  overlapUnit: "h overlap",
  // Which markets to show is a choice: edit freely (IANA time-zone names).
  zones: [
    { city: "Singapore", tz: "Asia/Singapore" },
    { city: "Tokyo", tz: "Asia/Tokyo" },
    { city: "Sydney", tz: "Australia/Sydney" },
    { city: "Dubai", tz: "Asia/Dubai" },
    { city: "Amsterdam", tz: "Europe/Amsterdam" },
    { city: "London", tz: "Europe/London" },
  ],
};

/* ---------------------------------------------------------------------------
 * 8. Testimonials: can I trust you? Real quotes only, with permission.
 * ------------------------------------------------------------------------- */
const quote = (n: number): Testimonial => ({
  quote: `TODO: a one- or two-sentence quote from client ${n}, used with permission.`,
  name: `TODO: client ${n} name`,
  role: "TODO: role",
  company: "TODO: company",
});

export const testimonials = {
  badge: "Kind words",
  title: "What it's like to work with me, in clients' words.",
  items: [quote(1), quote(2), quote(3)],
};

/* ---------------------------------------------------------------------------
 * 9. Contact: how do I reach you? One obvious next step.
 * ------------------------------------------------------------------------- */
export const contact = {
  badge: "Contact",
  title: "Tell me what you're building.",
  text: "One email is enough to start: what you're making, who it's for and when you need it.",
  emailLabel: "Email",
  primary: "Email me",
  copy: { label: "Copy email address", done: "Copied", fallback: "Press Ctrl+C or ⌘C to copy" },
  call: { label: "Book a call", href: "TODO: booking URL (Cal.com or Calendly)" },
  facts: [
    { icon: "clock", label: "Typical reply", value: "TODO: e.g. within one working day" },
    { icon: "calendar", label: "Availability", value: "TODO: e.g. taking new projects from January 2027" },
    { icon: "mapPin", label: "Time zone", value: `${site.location} · ${site.utcOffset}` },
  ] satisfies { icon: IconName; label: string; value: string }[],
  form: {
    title: "Or send a quick note",
    name: "Your name",
    email: "Your email",
    message: "What are you building?",
    submit: "Write the email",
    note: "This opens your email app with the note filled in. Nothing is stored on this site.",
    sent: "Your email app should open now. If it doesn't, write to",
    subject: "Project enquiry from",
  },
};

/* ---------------------------------------------------------------------------
 * 10. Footer
 * ------------------------------------------------------------------------- */
export const footer = {
  tagline: "Flutter · Front-end · UI/UX",
  columns: [
    {
      title: "Work",
      links: [
        { label: "Selected work", href: "/#work" },
        { label: "Design → code", href: "/#design-to-code" },
        { label: "What I do", href: "/#services" },
        { label: "Playground", href: "/#playground" },
      ],
    },
    {
      title: "About",
      links: [
        { label: "About me", href: "/#about" },
        { label: "Kind words", href: "/#testimonials" },
        { label: "Contact", href: "/#contact" },
      ],
    },
  ] satisfies { title: string; links: Link[] }[],
  resume: { label: "Download my résumé", hint: "PDF", href: "TODO: /resume.pdf" },
  github: { top: "View code on", bottom: "GitHub" },
  emailButton: { top: "Email me at" },
  lastUpdated: "Last updated",
  smallPrint: "Built with Next.js, React Three Fiber and GSAP. The particle portrait is generated from a photo of me.",
  rights: "All rights reserved.",
};
