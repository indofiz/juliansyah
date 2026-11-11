/**
 * All page copy lives here; the components only read from this file.
 * The previous site (v1) is preserved at git tag `v1-legacy`.
 */

export const site = {
  name: "Juliansyah",
  wordmark: { first: "JULIAN", second: "SYAH" },
  role: "Frontend Engineer",
  url: "https://juliansyah.dev",
  email: "hello@juliansyah.dev",
  github: "https://github.com/indofiz",
  location: "Bangka Belitung, Indonesia · Working remotely",
  description:
    "Frontend Engineer with a design edge. I design and build pixel-perfect, production-ready web interfaces and Flutter mobile apps.",
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
      { label: "Selected projects", href: "#work" },
      { label: "Case study", href: "#spotlight" },
      { label: "Capabilities", href: "#capabilities" },
    ],
  },
  {
    label: "Services",
    items: [
      { label: "What I do", href: "#services" },
      { label: "How I work", href: "#process" },
    ],
  },
  {
    label: "About",
    items: [
      { label: "Numbers", href: "#about" },
      { label: "Quick answers", href: "#assistant" },
    ],
  },
  { label: "Contact", href: "#cta" },
] as const;

export const hero = {
  badge: "Available for freelance & full-time",
  title: "Design Meets Code",
  subtitle: "Frontend Engineer with a design edge",
  text: "Most developers hand off to designers. I don't. I design the interfaces and write the production code myself, so there's less back-and-forth, faster delivery, and products that look intentional because they are.",
  cta: "Start a project",
};

export const stats = {
  badge: "Track record",
  title: "Numbers from Shipped Work.",
  text: "From production apps for government, education and enterprise clients, as of November 2026.",
  items: [
    { icon: "users", value: "7,000+", label: "Active app users" },
    { icon: "shield", value: "99.9%", label: "Crash-free sessions" },
    { icon: "award", value: "8", label: "Client organisations" },
    { icon: "clock", value: "3+", label: "Years of experience" },
    { icon: "layers", value: "3", label: "Web, UI/UX & mobile" },
  ],
};

export const services = {
  title: "From Figma to Production, Under One Roof.",
  left: [
    { icon: "code", title: "Frontend Engineering", text: "React, Next.js and TypeScript interfaces that are fast, accessible and pixel-perfect.", cta: "Start a project", tone: "accent" },
    { icon: "cube", title: "Motion & 3D", text: "GSAP and WebGL moments that make a product feel alive, like the scene on this page.", cta: "Let's talk", tone: "accent" },
    { icon: "spark", title: "Design & Build Sprint", text: "From a Figma file to a live, production-ready page in one focused sprint.", cta: "Book a sprint", tone: "gold" },
  ],
  right: [
    { icon: "pen", title: "UI / UX Design", text: "Wireframes, user flows and prototypes in Figma, designed around what users actually do.", cta: "Learn more", tone: "accent" },
    { icon: "layers", title: "Design Systems", text: "Tokens and components your whole team can build with, in Figma and in code.", cta: "Try it", tone: "indigo" },
    { icon: "phone", title: "Flutter Mobile Apps", text: "Android and iOS from one Flutter codebase, on Clean Architecture and BLoC.", cta: "Build an app", tone: "accent" },
  ],
};

export const work = {
  badge: "Selected work",
  title: "Recent Work. Real Results.",
  text: "Products I've designed and built across web, mobile and design systems.",
  note: "Presensi PKP is live in production. Entries marked Concept are demo builds; full case studies coming soon.",
  rows: [
    { initials: "PK", color: "var(--accent)", name: "Presensi PKP", client: "Pemkot Pangkalpinang", year: "2025", metric: "7,000+ users", status: "Live", category: "Mobile", href: "#spotlight" },
    { initials: "EC", color: "#e0b53c", name: "E-Commerce Platform", client: "Storefront", year: "2024", metric: "Stripe checkout", status: "Concept", category: "Frontend" },
    { initials: "TM", color: "#2fe39a", name: "Task Management App", client: "Collaboration", year: "2024", metric: "Real-time kanban", status: "Concept", category: "Frontend" },
    { initials: "AD", color: "#33b9e0", name: "Analytics Dashboard", client: "Data visualisation", year: "2023", metric: "Custom widgets", status: "Concept", category: "UI/UX" },
    { initials: "MB", color: "#9b7bff", name: "Mobile Banking App", client: "Fintech", year: "2023", metric: "Biometric auth", status: "Concept", category: "Mobile" },
    { initials: "AI", color: "#e8e8e8", name: "AI Content Generator", client: "LLM tooling", year: "2023", metric: "Streaming UI", status: "Concept", category: "Frontend" },
    { initials: "RE", color: "var(--accent-300)", name: "Real Estate Platform", client: "Property search", year: "2022", metric: "Map search", status: "Concept", category: "UI/UX" },
    { initials: "HF", color: "#ff7aa8", name: "Habit & Fitness Tracker", client: "Health", year: "2022", metric: "Offline-first", status: "Concept", category: "Mobile" },
  ],
};

export const process = {
  badge: "How I work",
  title: "Seamless from Call to Launch.",
  text: "Clear milestones, regular demos and no surprises, whether I'm joining your team or building solo.",
  steps: [
    { title: "Discover", text: "A short call to understand your goals, your users and your timeline." },
    { title: "Design & Build", text: "Figma first, then production code, with demos so you see real progress." },
    { title: "Launch", text: "Testing on real devices, a smooth go-live and support after launch." },
  ],
};

/** Sticky case study. The framed screens are illustrations in mocks/Mocks.tsx. */
export const spotlight = {
  title: "Presensi PKP",
  text: "The official GPS-verified attendance app for the Pangkalpinang city government: check-ins, leave requests and history for around 7,000 employees, from one Flutter codebase.",
  features: [
    { title: "GPS-Verified Check-in", text: "Clock in only inside the office geofence, with fake-GPS detection and a photo capture for identity." },
    { title: "Leave Requests & History", text: "Submit leave with attachments and review every check-in and check-out on a calendar view." },
    { title: "Built for the Field", text: "Server-time sync, offline caching and push notifications, running at 99.9% crash-free." },
  ],
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

/**
 * Skills bento (section "capabilities"). Each card's illustration is a small
 * animated UI that plays on hover (see src/components/bento/Arts.tsx).
 *
 * Flutter screenshots: the phone shows a dummy app until you add real ones.
 * Put two PNGs (portrait, ~9:19.5, e.g. 390×844) in public/work/ and list them
 * in `flutterScreens`; the phone then swipes from the first to the second.
 */
export const flutterScreens: string[] = [
  // "/work/flutter-1.png",
  // "/work/flutter-2.png",
];

export const capabilities = [
  {
    id: "flutter",
    icon: "smartphone",
    title: "Flutter Apps",
    text: "Cross-platform apps for iOS, Android and web from one codebase.",
    tags: ["Dart", "Riverpod", "Firebase", "Material 3"],
  },
  {
    id: "uiux",
    icon: "pen",
    title: "UI/UX Design",
    text: "From research and wireframes to polished, tested interfaces.",
    tags: ["Figma", "User research", "Prototyping"],
  },
  {
    id: "frontend",
    icon: "code",
    title: "Front-end Development",
    text: "Fast, accessible web apps in React and Next.js, built from your designs.",
    tags: ["React", "Next.js", "TypeScript"],
  },
  {
    id: "system",
    icon: "layers",
    title: "Design Systems",
    text: "Tokens and components that keep design and code in sync.",
    tags: ["Tokens", "Components", "Docs"],
  },
  {
    id: "motion",
    icon: "spark",
    title: "Motion & Interaction",
    text: "Micro-interactions that make interfaces feel alive.",
    tags: ["Flutter animations", "GSAP", "Rive"],
  },
  {
    id: "perf",
    icon: "gauge",
    title: "Performance & Accessibility",
    text: "Lighthouse in the green and WCAG AA by default.",
    tags: ["Core Web Vitals", "WCAG AA"],
  },
] as const;

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
        { label: "Projects", href: "#work" },
        { label: "Case study", href: "#spotlight" },
        { label: "Capabilities", href: "#capabilities" },
      ],
    },
    {
      title: "Services",
      links: [
        { label: "What I do", href: "#services" },
        { label: "How I work", href: "#process" },
      ],
    },
    {
      title: "About",
      links: [
        { label: "Numbers", href: "#about" },
        { label: "Quick answers", href: "#assistant" },
        { label: "Contact", href: "#cta" },
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
