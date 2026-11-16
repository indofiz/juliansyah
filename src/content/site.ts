/**
 * All page copy lives here, in English. Components read it through
 * getContent() (content/index.ts) or, client-side, useContent(), which give
 * the page's language; Indonesian is a dictionary over this file (site.id.ts).
 * Types: ./types.ts. The previous site (v1) is preserved at git tag `v1-legacy`.
 *
 * Placeholders: any string starting with "TODO:" is unconfirmed and renders
 * with a dashed outline. List them with: grep -n "TODO:" src/content/site.ts
 */

import { presensiStills } from "./mockups";
import type { AboutCard, ClientLogo, IconName, Link, LoopMedia, MockNavItem, Platform, PlaygroundItem, ProcessStep, Project, ProofItem, Testimonial } from "./types";

export const site = {
  name: "Juliansyah",
  wordmark: { first: "JULIAN", second: "SYAH" },
  role: "Flutter developer, front-end developer and UI/UX designer",
  /** Confirmed by the user (2026-11-13). Used for canonical URLs, the sitemap, robots.txt, JSON-LD and Open Graph. */
  url: "https://juliansyah.com",
  email: "juliansyah.ekt17@gmail.com",
  github: "https://github.com/indofiz",
  linkedin: "https://www.linkedin.com/in/julianui",
  dribbble: "https://dribbble.com/indofiz",
  city: "Pangkalpinang",
  region: "Bangka Belitung",
  location: "Pangkalpinang, Indonesia",
  /** IANA zone for WIB (UTC+7), which covers Bangka Belitung. */
  timeZone: "Asia/Jakarta",
  utcOffset: "UTC+7",
  description:
    "Juliansyah designs and builds Flutter apps and web front-ends from Pangkalpinang, Indonesia (UTC+7): UI/UX design, Flutter, React and Next.js, from first sketch to shipped release.",
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
  /** Palette picker (orb in the header). Palette names live in src/lib/palettes.ts. */
  accent: { label: "Accent color" },
  /** Language button (header) and row (phone menu). Language names live in src/lib/locales.ts. */
  language: { label: "Language" },
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
   * bar and the three tiles below it are SAMPLE data; the `tag` names the design system.
   */
  dashboard: {
    tag: "Moondance Design System",
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
    docs: "Documentation",
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
  title: "Proven in Production.",
  text: "Apps I've built and shipped for government, education and enterprise teams, live with real users. Your project gets the same standard.",
  /** Desktop only (hidden on phones, as on the old site). */
  primary: { label: "View work", href: "/#work" },
  secondary: { label: "Learn more", href: "/#about" },
  /** Keep labels short: they sit on one line next to the number. */
  items: [
    { icon: "users", value: "12K+", label: "App users" },
    // Presensi PKP's Crashlytics: 99.89% crash-free sessions (Android 1.0.8, 30 days to 2026-11-02;
    // presensi-mobile docs/bug-fixing/TOP_CRASHES_FIX_PLAN.md), rounded. Confirmed this way 2026-11-16.
    { icon: "shield", value: "99.9%", label: "Crash-free sessions" },
    // Same organisations as the logo strip in the hero, so the two never disagree.
    { icon: "award", value: String(hero.dashboard.clients.logos.length), label: "Client organisations" },
    // Working since 2020 (user, 2026-11-12). Counted at build time, so a rebuild keeps it current.
    { icon: "clock", value: `${new Date().getFullYear() - 2020}+`, label: "Years of experience" },
    { icon: "layers", value: "3", label: "Web, UI/UX & mobile" },
  ] satisfies ProofItem[],
};

/* ---------------------------------------------------------------------------
 * 3. Selected work: can you do what I need? Cards link to /work/<slug>.
 * ------------------------------------------------------------------------- */
export const work = {
  badge: "Selected work",
  /**
   * Uses the cards' own word ("Read the case study") and says each card holds more than pictures.
   * The non-breaking space keeps "Not Just" together, so phones break after the comma.
   */
  title: "Case Studies, Not\u00A0Just Screenshots.",
  /** Opens with the kinds of project (the cards' Flutter / Web / Design labels), then what a card opens to. */
  text: "Mobile apps, web apps and UI/UX projects. Open any card for the full story: the problem, my role, the decisions and the result.",
  labels: {
    caseStudy: "Read the case study",
    /** Names the slideshow of app screens, after the project name. */
    screens: "app screens",
    /** Accessible names of the phone itself, which pauses and plays the screens when tapped (no visible button). */
    pauseScreens: "Pause the screens",
    playScreens: "Play the screens",
    role: "Role",
    platform: "Platform",
    year: "Year",
    /** Screen-reader text for the key-technology line on the card. */
    keyTech: "Built with",
    /** "4.5 on Google Play": shown with a star; the count goes in `ratings`. */
    ratingOn: "on",
    ratings: "ratings",
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

/** In display order. The first flagship gets the big card. */
export const projects: Project[] = [
  {
    slug: "presensi-pkp",
    name: "Presensi PKP",
    // User, 2026-11-16: the app replaced PAPER sign-in sheets (not fingerprint machines),
    // and lateness or absence now cuts the employee's bonus.
    title: "GPS-verified check-ins replaced paper sign-in sheets for a city government.",
    summary:
      "The official attendance app for the Pangkalpinang city government. Civil servants check in with GPS and a selfie, request leave and review their history. Every late minute is on record, and bonus cuts are based on it.",
    client: "Pemerintah Kota Pangkalpinang · Diskominfo",
    // User, 2026-11-16: team of six; they were the designer and the Flutter developer.
    role: "UI/UX designer and Flutter developer",
    platforms: ["Flutter"],
    // UNCONFIRMED (asked 2026-11-16): the app's repo starts in April 2026.
    year: "2025",
    status: "Live in production",
    // Confirmed by the user, 2026-11-13.
    metric: { value: "7,000+", label: "active employees" },
    keyTech: ["Clean Architecture", "BLoC", "Firebase"],
    // Links from the user, 2026-11-16. `name` is the app's name in both stores.
    stores: {
      name: "Presensi Kota Pangkalpinang",
      appStore: "https://apps.apple.com/us/app/presensi-kota-pangkalpinang/id6805311056",
      googlePlay: "https://play.google.com/store/apps/details?id=id.go.pangkalpinangkota.presensipkp",
    },
    // As the Play page showed it on `checked` (the App Store shows no rating yet). Update by hand.
    rating: {
      value: "4.5",
      count: 28,
      store: "Google Play",
      href: "https://play.google.com/store/apps/details?id=id.go.pangkalpinangkota.presensipkp",
      checked: "2026-11-16",
    },
    media: {
      frame: "phone",
      label: "TODO: Presensi PKP check-in flow, screen recording",
      caption: "Presensi PKP · Flutter",
      // From the app's screenshot tool (presensi-mobile/tool/screenshots), which renders fake data.
      screens: [
        { src: "/projects/presensi-pkp/screens/home.webp", alt: "Home screen: today's clock, the check-in window and upcoming events", width: 1290, height: 2796 },
        { src: "/projects/presensi-pkp/screens/history.webp", alt: "Attendance history: the month's totals and each day's check-in and check-out times", width: 1290, height: 2796 },
        { src: "/projects/presensi-pkp/screens/login.webp", alt: "Sign-in screen: employee ID (NIK or NIP) and password", width: 1290, height: 2796 },
        { src: "/projects/presensi-pkp/screens/language.webp", alt: "First launch: choosing Bahasa Indonesia or English", width: 1290, height: 2796 },
      ],
      // Front on both (user, 2026-11-16: the card used three-quarter left before).
      stills: { card: presensiStills.front, page: presensiStills.front, tablet: presensiStills.tablet },
    },
    flagship: true,
    // Facts: the user (2026-11-16) and the presensi-mobile repo (code, docs/bug-fixing, release notes).
    // Plan and sources: docs/plans/presensi-case-study.md.
    caseStudy: {
      problem: [
        "Attendance used to be signed on paper. Someone who arrived late could still write down an on-time arrival, and some staff filled in the whole five-day week in one go.",
        "The record matters more now: the bonus is cut by how late someone is and by every absence. BKPSDMD, the city's civil service agency, needed attendance it could trust.",
      ],
      compare: {
        beforeTitle: "Paper sheet",
        afterTitle: "Presensi PKP",
        rows: [
          {
            before: "The time is whatever the person writes down.",
            after: "The time comes from the **server**, so changing the phone's clock does nothing.",
          },
          {
            before: "A whole week can be filled in at one sitting.",
            after: "Each check-in happens **on the day**, inside the office geofence, with a selfie. Fake GPS is refused.",
          },
          {
            before: "Nobody can tell how late anyone really was.",
            after: "Lateness is counted **to the minute**, and bonus cuts follow the record.",
          },
        ],
      },
      role: {
        summary: "I designed the app and built it in **Flutter** for Android, iPhone and iPad, from one codebase.",
        did: [
          "A team of six: a project manager, two backend developers, two cyber security specialists, and me on **UI/UX design** and the **Flutter** app",
          "**Clean Architecture** with **BLoC**: data, domain and presentation in every feature",
          "**Firebase**: **Crashlytics**, **Performance Monitoring**, **Analytics** and **Cloud Messaging**",
          "Responsive layouts for **phones and tablets**, iPad included",
          "Check-in only inside the office geofence, shown on an OpenStreetMap view",
          "Fake-GPS and mock-location detection",
          "Photo capture at check-in as a second identity check",
          "Leave and permit requests with attachments",
          "Attendance history on a calendar",
        ],
      },
      process: [
        {
          title: "Discovery: listening to BKPSDMD",
          text: "I listened to BKPSDMD, the city's civil service agency, about what the paper sheets got wrong: late arrivals written down as on time, and whole weeks filled in at once.",
        },
        {
          title: "Design",
          // Tool and reviewers not given yet; add them here if you want them on the page.
          text: "I designed the check-in, leave and history flows myself, so the screens went straight into the Flutter build with no hand-off.",
        },
        {
          title: "Development",
          text: "**Flutter** with **Clean Architecture** and **BLoC**, and **Firebase Crashlytics**, **Performance Monitoring**, **Analytics** and **Cloud Messaging**, so problems in the field show up on a dashboard. Released on Google Play and the App Store; version 1.0.9 fixed the four crashes Crashlytics ranked highest.",
        },
      ],
      stack: [
        { group: "Architecture", items: ["Clean Architecture", "BLoC", "GetIt", "Dio", "GoRouter"] },
        { group: "Firebase", items: ["Crashlytics", "Performance Monitoring", "Analytics", "Cloud Messaging"] },
        { group: "Platforms", items: ["Android", "iOS", "iPadOS"] },
        // presensi-mobile, 2026-11-16: 19 test files, 104 cases; codemagic.yaml.
        { group: "Quality", items: ["104 tests", "bloc_test", "Codemagic CI"] },
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
          // presensi-mobile docs/bug-fixing/TOP_CRASHES_FIX_PLAN.md: H1 = 282 events, up to 64 users on 1.0.8;
          // M2 (Android 13 camera, 2 users) not in 1.0.9.
          title: "Let Crashlytics set the priorities",
          why: "**Crashlytics** ranks every crash by how many people it hits. The top one, a Retry button on the location dialog that did nothing, reached up to 64 users on version 1.0.8. Version 1.0.9 fixed the top four.",
          tradeoff: "A rare camera crash on Android 13, seen by 2 users, waits for a later release.",
        },
        {
          // Claude's wording from the code (the user's own reason is still open).
          title: "Clean Architecture with BLoC",
          why: "Each feature splits **data, domain and presentation**, and every call returns a result or a typed failure, so the attendance rules are tested without a device: **104 tests**, BLoCs included.",
        },
        {
          // presensi-mobile: ResponsiveBody, breakpoints compact/regular/tablet, text scale clamped to 0.9–1.3 (lib/app.dart).
          title: "A bounded layout on tablets",
          why: "On an **iPad**, content stops at a readable width instead of stretching edge to edge, and system text size is capped at 1.3× so large fonts don't break the layout.",
        },
      ],
      // presensi-mobile's screenshot tool with SHOT_DEVICE=tablet (fake data), 1668×2388 WebP.
      // Shown on the studio tablet with the phone's home screen in front of it.
      tablet: {
        src: "/projects/presensi-pkp/screens/tablet-home.webp",
        alt: "The home screen on a tablet: the same cards as on the phone, held to a readable width in the middle of the screen",
        caption: "The same home screen on a phone and a tablet, from one codebase",
        width: 1668,
        height: 2388,
      },
      // presensi-mobile's screenshot tool (fake data), in check-in order. 1290×2796 WebP.
      gallery: [
        {
          src: "/projects/presensi-pkp/screens/checkin.webp",
          alt: "Check-in screen: the work unit, today's check-in time and the latest allowed time, and the button to take a photo and check in",
          caption: "Today's schedule",
          width: 1290,
          height: 2796,
        },
        {
          src: "/projects/presensi-pkp/screens/camera.webp",
          alt: "Check-in camera with a frame to line up the face",
          caption: "Selfie at check-in",
          width: 1290,
          height: 2796,
        },
        {
          src: "/projects/presensi-pkp/screens/success.webp",
          alt: "Check-in successful, with the recorded check-in time",
          caption: "Recorded",
          width: 1290,
          height: 2796,
        },
        {
          src: "/projects/presensi-pkp/screens/refused.webp",
          alt: "Check-in refused: the phone is 248 metres outside the office radius",
          caption: "Refused outside the radius",
          width: 1290,
          height: 2796,
        },
        {
          src: "/projects/presensi-pkp/screens/detail.webp",
          alt: "Attendance detail: check-in and check-out times, the photo taken at each, and where each was recorded",
          caption: "Photos and places on record",
          width: 1290,
          height: 2796,
        },
        {
          src: "/projects/presensi-pkp/screens/leave.webp",
          alt: "Leave request form: leave type, dates, reason and a required supporting document",
          caption: "Leave with a document",
          width: 1290,
          height: 2796,
        },
      ],
      result: {
        text: "Attendance is now recorded on the day, where people actually work, with lateness counted **to the minute**, and bonus cuts follow that record.",
        metrics: [
          { value: "7,000+", label: "active employees" },
          { value: "4.5★", label: "on Google Play, from 28 ratings" },
          // Crashlytics, Android 1.0.8, 30 days to 2026-11-02 (presensi-mobile TOP_CRASHES_FIX_PLAN.md).
          // The user said "99%"; the plan's default was the exact figure.
          { value: "99.89%", label: "crash-free sessions on Android" },
          { value: "3", label: "devices from one codebase: Android, iPhone and iPad" },
        ],
      },
    },
  },
  {
    slug: "alindo-company-website",
    name: "Alindo Company Website",
    title: "Redesigned an IT company's website so visitors see what it does from the first screen.",
    summary:
      "A redesign of the company website for Alindo, an IT company offering six services and six products, from web and mobile apps to AI and cloud. I worked alone, from UX and visual design in Figma to the HTML, Tailwind and JavaScript build.",
    // Confirmed by the user, 2026-11-15: solo, 2026, Figma + Claude, Tailwind, plain HTML,
    // every page designed and built by them. It went live and has since been replaced.
    // No links: neither the company's site nor any copy of the build is shown.
    client: "PT Alnair Inovasi Solusindo (Alindo)",
    role: "UI/UX designer and front-end developer",
    platforms: ["Design", "Web"],
    year: "2026",
    // Waiting on the HTML folder: Lighthouse run locally.
    metric: { value: "TODO: Lighthouse score", label: "TODO: what it measures (performance, accessibility…)" },
    media: {
      frame: "browser",
      label: "Alindo company website, homepage",
      caption: "Alindo · HTML and Tailwind",
      // Screenshot by the user, 2026-11-15: 2880×1800, the scrollbar cropped off, scaled to 2560×1600.
      screens: [
        {
          src: "/projects/alindo/screens/home.webp",
          alt: "Alindo homepage: the headline “Engineering Digital Solutions for a Better Tomorrow” above four reasons to choose Alindo",
          width: 2560,
          height: 1600,
        },
      ],
    },
    // Noindex until the metric and result are in.
    dummy: true,
    caseStudy: {
      problem: [
        "Alindo offers six services and six products, from web and mobile apps to AI, cloud and cyber security. The website had to explain all of that to a first-time visitor, give every service and product its own page, show the clients and partners behind it, and lead to a project enquiry.",
        "TODO: what wasn't working on the old page, or what Alindo asked for.",
      ],
      role: {
        summary: "I worked alone, from UX and visual design in Figma to slicing the design and building it in HTML, CSS and JavaScript.",
        did: [
          "Site map and wireframes for every page",
          "Visual design in Figma, in the brand's navy and orange",
          "A page for each of the six services and six products, plus about, contact and the portfolio",
          "Slicing the design into assets: logo, icons and illustrations",
          "Responsive HTML with Tailwind CSS, from phone to desktop",
          "A mega menu for the six products, a mobile menu and a navbar that changes on scroll, in plain JavaScript",
          "Scroll animations with GSAP and ScrollTrigger",
          "Labelled sections and menus for screen readers, and lazy-loaded images",
        ],
      },
      process: [
        {
          title: "Structure",
          text: "Mapped the site around Alindo's offer: a homepage that runs from why choose us through the six services, clients, partners and technology alliance to a call to start a project, then a page for each service and product.",
        },
        {
          title: "Design",
          text: "Designed every page in Figma in the brand's navy and orange, with the Outfit typeface.",
        },
        {
          title: "Build",
          text: "Sliced the design into HTML with Tailwind, wrote the interactions in plain JavaScript and the motion with GSAP, with Claude as an AI assistant.",
        },
      ],
      decisions: [
        {
          title: "One message above the fold",
          why: "The headline, both next steps (start a project, see the products) and four reasons to choose Alindo all fit on the first screen, so a visitor knows what the company does without scrolling.",
        },
        {
          title: "Plain HTML and Tailwind, no framework",
          why: "Static pages with no build step, so the site can be hosted anywhere and handed over as files.",
          tradeoff: "Tailwind's CDN script builds the styles in the browser on every visit. A compiled CSS file would load faster.",
        },
        {
          title: "One shared script for the site chrome",
          why: "The navbar, mobile menu and mega menu live in one file that every page loads, while each page loads only its own animations.",
        },
        {
          title: "Motion that follows the scroll",
          why: "GSAP's ScrollTrigger brings each section in as it reaches the screen: the reasons to choose Alindo, a split reveal for About, a dark reveal for the services and a scatter for the client logos.",
        },
      ],
      result: {
        text: "TODO: client feedback, or what changed after it went live in 2026.",
        metrics: [{ value: "TODO: Lighthouse scores", label: "TODO: from the HTML folder" }],
      },
    },
  },
  dummyProject("dummy-flutter-app", "Flutter", "phone"),
  dummyProject("dummy-design", "Design", "browser"),
];

/** Headings on the case study pages (/work/<slug>). */
export const caseStudyLabels = {
  back: "All work",
  problem: "The problem",
  compare: "Before and after",
  role: "My role",
  stack: "Built with",
  screens: "Screens",
  /** Store badges: the link's accessible name is "<download> <app name> <on> <store>". */
  getApp: "Get the app",
  download: "Download",
  on: "on",
  appStore: "the App Store",
  googlePlay: "Google Play",
  process: "Process",
  decisions: "Key decisions",
  tradeoff: "Trade-off",
  result: "Result",
  links: "Links",
  next: "Next project",
  ogEyebrow: "Case study",
};

/* ---------------------------------------------------------------------------
 * 4. How I work (section id "process"): what's it like to work with you?
 * Main's "Seamless from Call to Launch" layout: copy | steps | the globe,
 * where the globe turns into the lit step's picture. The pictures are 3D
 * scenes in lib/stepScenes.ts, matched by step `id`.
 * ------------------------------------------------------------------------- */
export const howIWork = {
  badge: "How I work",
  title: "From First Sketch to Live App.",
  text: "No hand-off between designer and developer: the person you brief is the person who ships it.",
  primary: { label: "Start a project", href: "/#contact" },
  secondary: { label: "See my work", href: "/#work" },
  /** Shown as "Step 01", "Step 02"… above each title. */
  stepLabel: "Step",
  steps: [
    {
      id: "discover",
      title: "Discover",
      text: "A call about your users, your goals and your deadline. You get a written scope before any work starts.",
    },
    {
      id: "design",
      title: "Design",
      text: "Wireframes first, then Figma screens built on a design system, so you can click through the app before any code exists.",
    },
    {
      id: "build",
      title: "Build",
      text: "Flutter for mobile, React and Next.js for the web, built from the same design tokens, with test builds along the way.",
    },
    {
      id: "launch",
      title: "Launch",
      text: "Testing on real devices, release to the stores or the server, and support after go-live.",
    },
  ] satisfies ProcessStep[],
};

/* ---------------------------------------------------------------------------
 * 5. About: who are you, and can you do what I need? Main's "Under One
 * Roof" layout: three cards either side of an empty middle column, where
 * the particle portrait forms. The first card is about you; the other five
 * are your expertise, grouped by what the client gets (tools underneath).
 * ------------------------------------------------------------------------- */
export const about = {
  title: "From Design to Production, Under One Roof.",
  photo: {
    src: "/image-me.png",
    alt: "Juliansyah, smiling, in a green batik shirt against an orange background",
    width: 1024,
    height: 1024,
  },
  toolsLabel: "Tools",
  socialsLabel: "Find me online",
  /**
   * Desktop rows read across the portrait: Who I am | Web, Flutter |
   * Motion, UI/UX | Performance. Phones swipe through left, then right.
   */
  cards: {
    left: [
      {
        id: "me",
        icon: "user",
        photo: true,
        title: "Who I am",
        place: `${site.city}, ${site.region}`,
        text: "A designer who codes. I design apps, then build them myself, for mobile and the web.",
        socials: true,
      },
      {
        id: "mobile",
        icon: "flutter",
        title: "Cross-platform mobile apps",
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
    ],
    right: [
      {
        id: "web",
        icon: "typescript",
        title: "Type-safe web apps",
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
    ],
  } satisfies { left: AboutCard[]; right: AboutCard[] },
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
 * 7. Testimonials: can I trust you? Real quotes only, with permission.
 * ------------------------------------------------------------------------- */
const quote = (n: number): Testimonial => ({
  quote: `TODO: a one- or two-sentence quote from client ${n}, used with permission.`,
  name: `TODO: client ${n} name`,
  role: "TODO: role",
  company: "TODO: company",
});

export const testimonials = {
  badge: "Kind words",
  /** Opens with the answer to "can I trust you?"; "teams" is the word Track record uses for clients. */
  title: "Trusted by the Teams I've Built For.",
  /** Where the quotes come from, so they read as real; it keeps the rule above (with permission). */
  text: "Clients on what working together was like, quoted with their permission.",
  items: [quote(1), quote(2), quote(3)],
};

/* ---------------------------------------------------------------------------
 * 8. Contact: how do I reach you? One obvious next step.
 * ------------------------------------------------------------------------- */
export const contact = {
  badge: "Contact",
  title: "Tell me what you're building.",
  text: "One message is enough to start: what you're making, who it's for and when you need it.",
  primary: "Email me",
  /**
   * Every email link on the card opens with this filled in, so nobody starts
   * from a blank page. The body asks the three questions from `text`.
   */
  mail: {
    subject: "Project enquiry via your portfolio",
    body: "Hi Juliansyah,\n\nWhat I'm building:\n\nWho it's for:\n\nWhen I need it:\n\n",
  },
  copy: {
    /** Screen readers hear `label`; the button shows `idle`, then `done`. */
    label: "Copy email address",
    idle: "Copy",
    done: "Copied",
    announce: "Email address copied",
    /** When the browser won't copy, the address is selected instead. */
    failTouch: "Address selected. Copy it from the menu.",
    failKeys: "Address selected. Press ⌘C or Ctrl+C.",
  },
  /**
   * Second button: opens WhatsApp (app on phones, web elsewhere) with the same
   * three questions as the email. Number in international format, digits only.
   */
  whatsapp: {
    label: "WhatsApp me",
    number: "6283175087363",
    text: "Hi Juliansyah, I found you through your portfolio.\n\nWhat I'm building:\nWho it's for:\nWhen I need it:",
  },
  /** Quiet line for recruiters. Links: footer.resume.href and site.linkedin. */
  hiring: { text: "Hiring for a role?", resume: "Résumé", linkedin: "LinkedIn" },
  /** The card beside the buttons: who answers, when, and what happens after. */
  card: {
    sub: "You talk to me directly.",
    availabilityLabel: "Availability",
    /** User's words, 2026-11-13: "I can take any project now, open to remote work also". */
    availability: "Taking new projects now · open to remote work",
    nextTitle: "What happens next",
    /** `{reply}` is replaced with `reply` below. */
    steps: [
      "You send a few lines by email or WhatsApp, in English or Bahasa Indonesia.",
      "I reply with my questions {reply}.",
      "A short call, then a written scope before any work starts.",
    ],
    /** Reads after "I reply with my questions…". */
    /** Filled in by Claude at the user's request (2026-11-13), from the placeholder's own example. */
    reply: "within one working day",
    placeLabel: "Time zone",
    place: `${site.location} · ${site.utcOffset}`,
  },
};

/* ---------------------------------------------------------------------------
 * 9. Footer
 * ------------------------------------------------------------------------- */
export const footer = {
  tagline: "Flutter · Front-end · UI/UX",
  columns: [
    {
      title: "Work",
      links: [
        { label: "Selected work", href: "/#work" },
        { label: "How I work", href: "/#process" },
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
  resume: { label: "View my résumé", hint: "PDF on Google Drive", href: "https://drive.google.com/file/d/18AtqPm4QkKI00OTa-VlHU7LN6ivJ7E9Y/view?usp=sharing" },
  github: { top: "View code on", bottom: "GitHub" },
  emailButton: { top: "Email me at" },
  lastUpdated: "Last updated",
  smallPrint: "Built with Next.js, React Three Fiber and GSAP. The particle portrait is generated from a photo of me.",
  rights: "All rights reserved.",
};

/* ---------------------------------------------------------------------------
 * 10. Interface text outside the sections
 * ------------------------------------------------------------------------- */
export const ui = {
  skip: "Skip to main content",
  /** The logo link's accessible name. */
  home: `${site.name}, home`,
  video: { play: "Play video", pause: "Pause video" },
};

/**
 * Everything above as one object: the English content. The Indonesian
 * version is made from it with the dictionary in site.id.ts (content/locale.ts).
 * Components get the right one from getContent() (content/index.ts).
 */
export const content = { site, socials, nav, hero, proof, work, projects, caseStudyLabels, howIWork, about, playground, testimonials, contact, footer, ui };

export type Content = typeof content;
