/**
 * All page copy lives here; the components only read from this file.
 * Types: ./types.ts. The previous site (v1) is preserved at git tag `v1-legacy`.
 *
 * Placeholders: any string starting with "TODO:" is unconfirmed and renders
 * with a dashed outline. List them with: grep -n "TODO:" src/content/site.ts
 */

import type { Capability, LoopMedia, Platform, PlaygroundItem, Project, ProofItem } from "./types";

export const site = {
  name: "Juliansyah",
  wordmark: { first: "JULIAN", second: "SYAH" },
  role: "Flutter developer, front-end developer and UI/UX designer",
  // TODO: confirm the domain. It's used for canonical URLs, the sitemap and Open Graph.
  url: "https://juliansyah.dev",
  email: "juliansyah.ekt17@gmail.com",
  github: "https://github.com/indofiz",
  location: "Jakarta, Indonesia",
  timeZone: "Asia/Jakarta",
  utcOffset: "UTC+7",
  description:
    "Juliansyah designs and builds Flutter apps and web front-ends from Jakarta (UTC+7): UI/UX design, Flutter, React and Next.js, from first sketch to shipped release.",
};

/** Social icons in the footer. Add LinkedIn / X / Dribbble here when ready. */
export const socials = [
  { icon: "github", label: "GitHub", href: site.github },
  { icon: "mail", label: "Email", href: `mailto:${site.email}` },
] as const;

export const nav = [
  {
    label: "Work",
    items: [
      { label: "Selected projects", href: "/#work" },
      { label: "Case study", href: "/work/presensi-pkp" },
      { label: "Capabilities", href: "/#capabilities" },
    ],
  },
  {
    label: "Services",
    items: [
      { label: "What I do", href: "/#services" },
      { label: "Design → code", href: "/#design-to-code" },
    ],
  },
  {
    label: "About",
    items: [{ label: "Quick answers", href: "/#assistant" }],
  },
  { label: "Contact", href: "/#contact" },
] as const;

/* ---------------------------------------------------------------------------
 * 1. Hero: who are you?
 * ------------------------------------------------------------------------- */
export const hero = {
  status: "Available for projects",
  roles: "Flutter developer · Front-end developer · UI/UX designer",
  title: "I design and build Flutter apps and web front-ends for teams that care how their product feels.",
  text: "Design and code from one person, so nothing gets lost in the hand-off.",
  primary: { label: "See my work", href: "/#work" },
  secondary: { label: "Contact", href: "/#contact" },
  /** The work reel under the headline: one browser frame, one phone frame. */
  reel: [
    {
      frame: "browser",
      label: "TODO: describe the web project in this loop",
      caption: "TODO: web project",
    },
    {
      frame: "phone",
      label: "TODO: Presensi PKP check-in flow, screen recording",
      caption: "Presensi PKP · Flutter",
    },
  ] satisfies LoopMedia[],
};

/* ---------------------------------------------------------------------------
 * 2. Proof: can I trust you? (first signal). Real numbers only.
 * ------------------------------------------------------------------------- */
export const proof = {
  badge: "Proof",
  title: "Shipped work, not mockups.",
  text: "Signals from apps and sites running in production.",
  items: [
    { icon: "building", value: "TODO: number of organisations", label: "Organisations I've shipped for" },
    { icon: "star", value: "TODO: store rating", label: "Store rating, Presensi PKP" },
    { icon: "download", value: "TODO: installs", label: "App installs" },
    { icon: "github", value: "TODO: GitHub stars", label: "GitHub stars" },
    { icon: "clock", value: "TODO: first year", label: "Shipping since" },
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

export const assistant = {
  badge: "Quick answers",
  title: "Ask Me Anything",
  text: ["The questions I get asked most,", "answered in one place."],
  suggestions: [
    { q: "What's your tech stack?", a: "React, Next.js and TypeScript on the web, Flutter with BLoC on mobile, Figma for design, and GSAP and Three.js for motion." },
    { q: "Are you available?", a: "Yes. I'm open to freelance projects and full-time roles, remote or on-site in Bangka Belitung." },
    { q: "Do you design too?", a: "Yes. I design the interfaces in Figma and write the production code myself, so nothing gets lost in the hand-off." },
  ],
};

export const featured = {
  title: "Built Fast. Measured, Not Guessed.",
  text: "Performance budgets, Core Web Vitals and an accessible component system come standard, so the work holds up long after launch.",
  primary: "Explore the case study",
  secondary: "View my GitHub",
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
  /** Score rings. TODO: replace with this site's measured Lighthouse scores (mobile). */
  perf: [
    { label: "Performance", score: 90 },
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

export const cta = {
  title: ["Let's Build Something", "Worth Scrolling For"],
  text: "Tell me about your project or role.",
  primary: "Email me",
  secondary: "View GitHub",
};

export const footer = {
  tagline: "Frontend · UI/UX · Flutter",
  columns: [
    {
      title: "Work",
      links: [
        { label: "Projects", href: "/#work" },
        { label: "Case study", href: "/work/presensi-pkp" },
        { label: "Capabilities", href: "/#capabilities" },
      ],
    },
    {
      title: "Services",
      links: [
        { label: "What I do", href: "/#services" },
        { label: "Design → code", href: "/#design-to-code" },
      ],
    },
    {
      title: "About",
      links: [
        { label: "Quick answers", href: "/#assistant" },
        { label: "Contact", href: "/#contact" },
      ],
    },
  ],
  buttons: [
    { icon: "github", top: "View code on", bottom: "GitHub", href: site.github },
    { icon: "mail", top: "Email me at", bottom: site.email, href: `mailto:${site.email}` },
  ],
  smallPrint: [
    "Availability: open to freelance projects and full-time roles.",
    "Built with Next.js, React Three Fiber and GSAP. The particle portrait is generated from a photo of me.",
  ],
};

/* ---------------------------------------------------------------------------
 * Not rendered: these sections were removed from page.tsx (and their keys from
 * sceneKeyframes.ts). The copy below is still the design's placeholder text.
 * To bring one back, update the copy, re-add the component to page.tsx and its
 * keyframe in the same position.
 * ------------------------------------------------------------------------- */

export const pricing = {
  badge: "Plans that suit you",
  title: "Choose How We Work",
  plans: [
    {
      name: "SPRINT",
      text: "A focused two-week build for a launch, campaign or single landing page.",
      features: ["From $4,800", "1 page, fully responsive", "Motion & micro-interactions", "2 revision rounds", "Launch support"],
    },
    {
      name: "STUDIO",
      popular: true,
      text: "Design and development for a complete marketing site with 3D moments.",
      features: ["From $14,000", "Up to 8 pages", "Custom WebGL scene", "CMS of your choice", "30 days of support"],
    },
    {
      name: "RETAINER",
      text: "An ongoing creative-tech partner for teams that ship every month.",
      features: ["From $6,500 / month", "Priority scheduling", "Unlimited requests", "Monthly strategy call"],
    },
  ],
};

export const estimator = {
  heading: "Choose your scope",
  title: "Project Estimator",
  badge: "New",
  text: "Pick a scope to see a typical timeline. Every project starts with a free 30-minute call to confirm the details.",
  tiers: [
    { tier: "Tier 1", name: "Landing page", base: "$ 4.8k", plus: "+ 3D", total: "2 weeks", stats: ["2 wk", "2", "1", "14d"] },
    { tier: "Tier 2", name: "Marketing site", base: "$ 9k", plus: "+ 3D", total: "4 weeks", stats: ["4 wk", "3", "5", "30d"] },
    { tier: "Tier 3", name: "Immersive site", base: "$ 14k", plus: "+ 3D", total: "6 weeks", stats: ["6 wk", "3", "8", "30d"] },
    { tier: "Tier 4", name: "Web app", base: "$ 24k", plus: "+ 3D", total: "10 weeks", stats: ["10 wk", "4", "12+", "60d"] },
  ],
  statLabels: ["Timeline", "Revisions", "Pages", "Support"],
  cta: "Book your slot & get started",
};

export const portal = {
  badge: "Transparent process",
  title: "Your Project, Live in One Place.",
  text: "Every client gets a private portal with live previews, progress and a shareable link.",
};
