# Plan: add the Malinau Regency portal (malinau.go.id) to Selected work

Status: **done** (2026-11-17, committed and pushed on `feat/portfolio-home`).

The user's answers, 2026-11-17: go; **no score** (no Lighthouse at all); the
purpose was to **modernise** the portal; the colours follow the **brand the
regency asked for**, with **Dayak patterns**. Defaults taken for the rest:
live site, first hero photo, link to the live site, before and after from the
Wayback Machine, replaces `dummy-design` after Alindo.

- Timeline from the Wayback Machine: old jQuery homepage last archived
  2025-02-21; the new Next.js site first archived 2025-10-28; footer © 2025.
  The live site matches that October 2025 version, so it's the user's design.
- Brand, read from the live CSS: `--blue-brand` #003466, `--orange-brand`
  #FE7700. Dayak pattern images (`/pattern/…`) frame Main Services, the
  regent's welcome corners, Popular News, the announcements, and open the footer.
- Media from the live site: card 10 s 960×600 (WebM 773 KB, MP4 635 KB), full
  21 s 1280×800 (2.0 / 2.1 MB), 2× still, two 2× close-ups, the Feb 2025 homepage.
  Recording needed three fixes, now in `scripts/record-scroll.mjs`:
  `initScript` pauses the hero slider (a 5 s interval), a 1 px repaint ticker
  keeps Chrome's screencast sending frames so the header's fade back to
  transparent lands on camera, and `tail` keeps recording after the last
  stop. 25 fps: at 30 the encoder fell behind on this heavier page.
- New on case studies: `compare.shots` (before and after screenshots above the
  rows) and `brand` (colour swatches and close-ups, "Brand and pattern").
- Card metric: 13 public services linked from the homepage (counted).
- The user, later on 2026-11-17: role is **front end**; the other TODOs were left
  to me. So: role "Front-end developer", platform Web only (the copy doesn't
  claim the visual design), stack as read from the site, and a result that only
  says what the live site shows (no numbers, no feedback). No TODO left, so
  `dummy` is off: indexed, in the sitemap, with JSON-LD.


## In one paragraph

The Malinau portal gets its own card in Selected work and its own case study,
built like Alindo's: a still of the homepage, an 8-second scroll-through on
hover, the full homepage on the case study, and Lighthouse scores shown as
PageSpeed-style rings. There's no codebase any more, so everything comes from the
public site: agent-browser records and screenshots the live portal, Lighthouse
measures it, and the Wayback Machine supplies a "before" picture of the old site.
The story (what you did, why, what changed) comes from you. Nothing is filled in
from guesses: anything you haven't confirmed stays a visible `TODO:`.

## What's there now

**On the portfolio**
- Projects, in order (`src/content/site.ts:213`): Presensi PKP (flagship), Alindo,
  and two placeholder cards, `dummy-flutter-app` (phone) and `dummy-design` (browser).
- "Kabupaten Malinau" is already in the hero's logo strip (`site.ts:106`,
  `public/logos/malinau.png`).
- Everything Alindo needed is reusable as it is:
  - `scripts/record-scroll.mjs`: works with any URL.
  - `scripts/encode-scroll.sh`.
  - `ScrollVideo`, through `media.scroll`.
  - `ScoreRings`, through `project.lighthouse`.
  - Before-and-after rows, through `caseStudy.compare`.
  - Links, through `caseStudy.links`.

**The live site, seen 2026-11-17 with agent-browser**
- **Built with:** Next.js (App Router), in English and Indonesian (`/` redirects to
  `/en`).
- **Media:** images come from `cdn.malinau.go.id`.
- **Homepage, in order:**
  - Hero: a full-screen photo slider of 10+ slides, the title "Welcome to Malinau
    Regency Portal", an "Our Services" button, and four values (Indah, Tertib,
    Makmur, Unggul).
  - Main Services, then Our Services.
  - Malinau News, then Latest Announcements.
  - Gallery, then Video.
  - Footer.
- **Pages:** Profil, Berita, Kegiatan, Repositori, Pengumuman, Gallery, Video,
  Tentang and SAGET. The footer says © 2025.
- **Server:** openresty in front of Next.js (`x-powered-by: Next.js`).
- **Speed:** very uneven. One plain request took **76 s** for the homepage HTML
  (230 KB, server-rendered); a browser visit a minute later loaded in a few
  seconds. If the server is that slow during the Lighthouse runs, Performance
  will mostly measure the server, not the front end.
- **Archive:** the Wayback Machine has snapshots of the homepage from 2002 to
  2026. From 2017 to 2025 there are several a year; the 2026 ones are tiny
  (redirects).

## Steps

### 1. Your answers (before anything is written)

The decisions at the end, plus the facts only you have: your role, the year,
who it was for, what was wrong before, and anything that changed after launch.

### 2. Is the live site still your work?

You left, so the portal may have been changed since. With agent-browser I'll
screenshot the live homepage and the Wayback snapshot closest to your last month
there, side by side. You confirm what's yours. If it has changed, the card and
case study use the archived version, labelled with its date.

### 3. Evidence: Lighthouse on the live site

- **Runs:** Lighthouse 13.6, 5 runs on mobile and 5 on desktop against
  `https://malinau.go.id/en`, using the median of each, the same as Alindo.
- **Saved:** the reports go in `docs/evidence/malinau/`.
- **Context:** the scores measure today's site, including its server and the photos
  staff upload, not just your code. The caption says "Lighthouse · desktop, live
  site, <date>".
- **Server speed:** the report's "server response time" is logged with each run,
  so a slow server shows up as the cause rather than looking like a front-end
  problem.
- **If they're weak:** you decide whether the rings go on the card or another real
  number does. Nothing is rounded up.

### 4. Media, with agent-browser (`scripts/record-scroll.mjs`)

- **Card** (`scripts/tours/malinau-card.json`): hero → Main Services → Our
  Services → News → back to the top, about 8 s, 960×600.
- **Case study** (`malinau-full.json`): the whole homepage down to the footer and
  back, about 18 s, 1280×800.
- **Still:** a 2× still of the top of the page, 2560×1600, so the video fades in
  without a shift.
- **The slider:** it moves on its own, so the first and last frames could show
  different photos and the loop would jump. Before recording, and again before the
  scroll returns to the top, the tour clicks the first slide's dot. The still shows
  that same slide, so you pick which photo the card shows.
- **The slow server:** one untimed pass first fills the browser cache, so photos
  don't pop in on camera. Lazy images are already loaded up front by the script.
- **"Before":** a screenshot of the old homepage from the Wayback Machine, for the
  case study's before-and-after section.
- I'll send you frames and file sizes before anything goes into the site.

### 5. Content (`src/content/site.ts`, Indonesian in `site.id.ts`)

A new project, slug `malinau-portal`. Everything you haven't confirmed stays
`TODO:`. Here's what I can write from the live site and what has to come from you:

| Field | From the site (I can write it) | From you |
| --- | --- | --- |
| name, client | "Malinau Regency Portal", Pemerintah Kabupaten Malinau | OK to name? Via Pijar? |
| title, summary | What the portal is and does | The outcome: what changed |
| role, platforms, year | — | Design? Front-end? Back-end/CMS? Solo or a team? Year |
| problem | — | What was wrong with the old site |
| process, decisions | What's visible: bilingual, Next.js, services first, news and announcements, CDN for media | Why you chose them, and the trade-offs |
| stack | Next.js | The rest (CSS, CMS, hosting…) |
| result | Lighthouse rings (step 3) | Anything else measured (visitors, adoption…) |
| links | `https://malinau.go.id` | OK to link? |

`dummy: true` (noindex) stays on until the problem and result aren't `TODO` any
more, as on Alindo.

### 6. Placement

By default Malinau replaces the `dummy-design` placeholder: it's the same browser
frame, so the grid keeps three cards in the row. The order becomes Presensi
(flagship), Alindo, Malinau, then the Flutter placeholder.

### 7. Checks

- `npx tsc --noEmit`, `npm run lint`, `npm run i18n:check`, `npm run build`.
- On `next dev`, with agent-browser:
  - Card: hover, leave, touch (fake `hover: none`), reduced motion.
  - Case study: the video plays by itself; `/id` shows the Indonesian copy.
- Lighthouse on the built portfolio: no Malinau video requested at page load.
- Screenshots to you, then a commit (and a push if you want).

## Decisions (default in bold)

1. **Live or archived:** **use the live site if you confirm it's still your
   design**, otherwise the Wayback version from when you left.
2. **The card's number:** **Lighthouse rings, if the scores hold up**, or another
   real figure you give me.
3. **Hero photo:** **the slider's first slide**, or a slide you pick. The slider
   shows real people; they're on the public site, but your call.
4. **Link to the live site:** **yes, "Visit the live site" in the case study**, or
   no link (like Alindo).
5. **Before and after:** **yes, the old homepage from the Wayback Machine** (needs
   your launch month), or skip it.
6. **Placement:** **replace the `dummy-design` card, after Alindo**, or put Malinau
   before Alindo.

## Out of scope

- Inner pages (News, Repository, SAGET…) as extra screens: browser frames have no
  gallery yet. That can be a later step.
- Claiming anything from after you left.
