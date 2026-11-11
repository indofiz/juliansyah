/**
 * All page copy lives here. Replace the placeholder name, numbers, projects
 * and plans with your own; the components only read from this file.
 */

export const site = {
  name: "Your Name",
  wordmark: { first: "YOUR", second: "NAME" },
  role: "Creative Developer",
  email: "hello@example.com",
  location: "Jakarta, Indonesia · Working worldwide",
};

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
      { label: "Plans", href: "#pricing" },
      { label: "Estimator", href: "#estimator" },
    ],
  },
  { label: "Process", href: "#process" },
  {
    label: "About",
    items: [
      { label: "Numbers", href: "#about" },
      { label: "Ask the assistant", href: "#assistant" },
      { label: "Contact", href: "#cta" },
    ],
  },
] as const;

export const hero = {
  badge: "Available for new projects",
  title: "Designing Worlds",
  subtitle: "Creative development & real-time 3D for the web",
  text: "Immersive, high-performance websites where motion, WebGL and design work together to tell your story.",
  cta: "Start a project",
};

export const stats = {
  badge: "Transparent track record",
  title: "Numbers that Outperform.",
  text: "Results from client projects, correct as of November 2026.",
  items: [
    { icon: "users", value: "60+", label: "Happy clients" },
    { icon: "rocket", value: "140+", label: "Projects shipped" },
    { icon: "grid", value: "98", label: "Lighthouse score" },
    { icon: "award", value: "12", label: "Awards & features" },
    { icon: "clock", value: "< 24h", label: "Response time" },
  ],
};

export const services = {
  title: "From Idea to Launch, Under One Roof.",
  left: [
    { icon: "code", title: "Creative Development", text: "Hand-built sites with motion and polish in every detail.", cta: "Learn more", tone: "green" },
    { icon: "cube", title: "WebGL & 3D", text: "Real-time scenes, particles and shaders that run smoothly.", cta: "See demos", tone: "green" },
    { icon: "spark", title: "Launch Sprint", text: "Ship a high-impact landing page in two weeks flat.", cta: "Book a sprint", tone: "gold" },
  ],
  right: [
    { icon: "pen", title: "Product Design", text: "Interfaces designed around what your users actually do.", cta: "Learn more", tone: "green" },
    { icon: "layers", title: "Design Systems", text: "Tokens and components your whole team can build with.", cta: "Try it", tone: "indigo" },
    { icon: "gauge", title: "Performance & SEO", text: "Fast loads, clean markup and Core Web Vitals in the green.", cta: "Audit my site", tone: "green" },
  ],
};

export const work = {
  badge: "Selected work",
  title: "Recent Work. Real Results.",
  text: "A few of the products and launches I've designed and built.",
  note: "Metrics measured 90 days after launch. Full case studies available on request.",
  rows: [
    { initials: "OR", color: "#2fe39a", name: "Orbit Analytics", client: "Logistics SaaS", year: "2026", metric: "+62% signups", category: "WebGL" },
    { initials: "NV", color: "#e0b53c", name: "Nova Studio", client: "Creative agency", year: "2026", metric: "Site of the Day", category: "Motion" },
    { initials: "PH", color: "#f08a3c", name: "Pulse Health", client: "Healthcare", year: "2025", metric: "30k daily users", category: "Web app" },
    { initials: "AT", color: "#33b9e0", name: "Atlas Commerce", client: "E-commerce", year: "2025", metric: "+28% conversion", category: "3D" },
    { initials: "LM", color: "#e8e8e8", name: "Lumen Docs", client: "Developer tools", year: "2024", metric: "0.8s LCP", category: "Docs" },
    { initials: "TD", color: "#9b7bff", name: "Tide Finance", client: "Fintech", year: "2024", metric: "4.9★ rating", category: "Product" },
  ],
};

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

export const process = {
  badge: "Getting started",
  title: "Seamless from Call to Launch.",
  text: "Most projects go from first call to live in under six weeks. Clear milestones, weekly demos and no surprises.",
  steps: [
    { title: "Discover", text: "A 30-minute call to understand your goals, audience and timeline." },
    { title: "Design & Build", text: "Weekly demos so you see real progress, not just status updates." },
    { title: "Launch", text: "Testing on real devices, a smooth go-live and 30 days of support." },
  ],
};

export const spotlight = {
  title: "Orbit",
  text: "A real-time logistics dashboard that turned a spreadsheet-heavy workflow into a live, interactive globe.",
  features: [
    { title: "Live Shipment Globe", text: "40,000 shipments rendered as particles, updating every second." },
    { title: "Route Analytics", text: "Delays, costs and carbon per route, filterable in one click." },
    { title: "Smart Alerts", text: "Anomalies flagged before they become missed deliveries." },
  ],
};

export const assistant = {
  badge: "Powered by AI",
  title: "Ask My Portfolio Anything",
  text: ["From idea to estimate.", "Inside a single conversation."],
  suggestions: [
    { q: "What's your tech stack?", a: "Next.js, React Three Fiber, GSAP and TypeScript for most builds, with Figma for design and Vercel for hosting." },
    { q: "How fast can you start?", a: "Usually within two weeks. Sprints can start sooner if a slot opens up." },
    { q: "Do you work with agencies?", a: "Yes. Around half of my projects are white-label builds for design and branding studios." },
  ],
};

export const featured = {
  title: "Every Project Ships with Its Own Analytics",
  text: "Performance budgets, real-user metrics and a living design system come standard, so you can see the impact from day one.",
  primary: "Explore the case study",
  secondary: "View the code",
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

export const portal = {
  badge: "Transparent process",
  title: "Your Project, Live in One Place.",
  text: "Every client gets a private portal with live previews, progress and a shareable link.",
};

export const cta = {
  title: ["Let's Build Something", "Worth Scrolling For"],
  text: "Replies within 24 hours.",
  primary: "Start a project",
  secondary: "Book a call",
};

export const footer = {
  tagline: "Creative development studio",
  columns: [
    { title: "Work", links: ["Projects", "Case studies", "Lab"] },
    { title: "Services", links: ["Development", "WebGL & 3D", "Design systems"] },
    { title: "Studio", links: ["About", "Process", "Contact", "Résumé"] },
  ],
  buttons: [
    { icon: "github", top: "View code on", bottom: "GitHub" },
    { icon: "download", top: "Download my", bottom: "Résumé (PDF)" },
    { icon: "calendar", top: "Book a call on", bottom: "Cal.com" },
    { icon: "dribbble", top: "Follow on", bottom: "Dribbble" },
  ],
  smallPrint: [
    "Availability: currently booking projects for January 2027 onwards. Sprints can sometimes start sooner.",
    "All project names, metrics and client logos on this page are placeholders. Replace them with your own work before publishing.",
  ],
  legal: ["Privacy", "Imprint", "Colophon"],
};
