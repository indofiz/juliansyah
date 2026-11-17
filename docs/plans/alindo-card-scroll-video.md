# Plan: Alindo card, a scroll-through video on hover, plus real Lighthouse numbers

Status: **built** (2026-11-17, `feat/portfolio-home`, not committed).

- Lighthouse on the local Alindo build: `docs/evidence/alindo/lighthouse.md`.
  The card shows 92 (performance, desktop); the result shows 92 / 92 / 100.
- Videos in `public/projects/alindo/video/`: `card` (8 s, 960×600, WebM 446 KB,
  MP4 488 KB) and `full` (18 s, 1280×800, WebM 1.2 MB, MP4 1.3 MB). Both end on
  the frame they start on (PSNR 43–44 dB first vs last).
- `screens/home.webp` replaced by a 2× still of the same prepared page, so the
  video fades in on the same layout.
- Checked with agent-browser on `next dev`: hover plays within 0.7 s and
  rewinds on leave; touch (matchMedia faked, headless Chrome can't emulate
  `hover: none`) plays at 60 % visible, with a working pause button; the case
  study plays by itself; with reduced motion nothing is requested.
- Built site, Lighthouse mobile: the homepage requests no video. The case
  study loads the 1.2 MB video after the page; with it blocked vs not, the
  scores overlap (72–90 vs 71–88, TBT noise), LCP 0.9–1.2 s either way.
- Tooling notes: Homebrew has no bottles for macOS 13 Intel (Tier 3), so
  ffmpeg is the evermeet.cx static build in `/usr/local/bin`. agent-browser
  records Chrome's JPEG screencast: saturated colours lose a little (the
  orange button 246,95,0 → ~228,117,37); invisible at card size.

Decided 2026-11-17: the card plays a short top-half tour (~8 s,
`scripts/tours/alindo-card.json`), the case study hero plays the full tour
(~17 s, `alindo-full.json`) while it's on screen. Touch screens: plays while
the card is mostly on screen, with a pause button. Leaving the card fades out
and rewinds. The logos may show.

This is the first of the Selected work upgrades; the recording and encoding
scripts are written so the other cards can reuse them.

## In one paragraph

The Alindo card on the homepage keeps the screenshot it shows today. When
you hover over the card (or tab to it), a short video fades in on top of the
screenshot: the Alindo homepage scrolling from the hero to "Let's work
together" and back up, so the loop has no jump. When the pointer leaves, the
video fades out and goes back to the start. The video is recorded from your
local build in `~/PROJECT/alindo/alindo_landing` with Vercel's agent-browser,
then compressed to about 1–2 MB. Lighthouse runs on the same local build, and
the score you pick replaces the two `TODO: Lighthouse` placeholders.

## What's there now

- The card: `src/components/work/ProjectCard.tsx:136` (`ProjectCard`). Its
  media is `BrowserMedia` (`src/components/media/BrowserMedia.tsx`), which
  shows `media.screens[0]` as a still, without the toolbar, because Alindo has
  no `webm`/`mp4`.
- Alindo's content: `src/content/site.ts:405`. Screenshot
  `public/projects/alindo/screens/home.webp` (2560×1600). Placeholders:
  `site.ts:418` (card metric) and `site.ts:488` (result metric).
  `dummy: true` keeps the case study out of search until the result is in.
- `BrowserMedia` is also the case study hero (`src/app/[lang]/work/[slug]/page.tsx:138`).
  Just adding `webm`/`mp4` to Alindo's media would switch **both** places to the
  always-playing `LoopVideo` with a toolbar. So the hover video gets its own
  field and its own component instead.
- `.work-media` has `pointer-events: none` (the title link covers the whole
  card), so hover has to be read from the `<article class="work-card">`, not
  from the video.
- Alindo build: plain HTML, Tailwind from `cdn.tailwindcss.com`, GSAP 3.12 and
  ScrollTrigger from jsDelivr, Google Fonts (Outfit). Homepage sections, in
  order: `hero`, `why-us`, `about`, `services`, `clients`, `partners`,
  `alliance`, `connect`. The scroll reveals play once, on a timer
  (`toggleActions: 'play none none none'`), so the recording has to run in real
  time, not jump frame by frame.
- Tools on this Mac: Node 22, Homebrew, Google Chrome. **Not installed:**
  ffmpeg, agent-browser, Lighthouse.
- agent-browser (npm, v0.43.0, Vercel Labs) is a CLI. `agent-browser mcp`
  runs it as an MCP server. `agent-browser record start/stop` records video,
  but only with ffmpeg on `PATH`.

## Steps

### 0. Install the tools (needs your OK: these install software on your Mac)

```bash
brew install ffmpeg                       # agent-browser record needs it; I use it to compress too
npm i -g agent-browser@0.43.0
agent-browser install                     # downloads its Chrome
agent-browser doctor                      # should show "Recording: ok"
claude mcp add --scope user agent-browser -- agent-browser mcp
```

The MCP tools only show up after Claude Code restarts. The recording is a
timed script, so I run it with the CLI. That's easier to repeat and to tune
than step-by-step MCP calls. The MCP is there for checks while browsing.

### 1. Lighthouse and the other measurements (nothing on the portfolio changes)

1. Serve the build exactly as it is: `npx serve -l 4173 ~/PROJECT/alindo/alindo_landing`
   (gzip on, like a normal host). I won't edit anything in the Alindo repo:
   the score has to describe what you shipped.
2. Lighthouse, mobile (default) and desktop (`--preset=desktop`), **3 runs each**,
   using the median run. Categories: Performance, Accessibility, Best Practices, SEO.
3. Also taken from the same runs: LCP, CLS, TBT, total page weight, number of
   requests, and every failing accessibility audit.
4. A second opinion: `agent-browser vitals http://localhost:4173/`.
5. Results go to you as a short table. You choose which number goes on the card.
   The HTML reports for the median runs are kept in `docs/evidence/alindo/`
   (not in `public/`), so the claim can be checked later.

What to expect, without guessing numbers: the Tailwind CDN script builds
the CSS in the browser, so Performance will probably be the weakest score. The
case study already says so in its trade-off. The card label says where the
number comes from, e.g. "Lighthouse accessibility, mobile, local build".

### 2. Record the video

`scripts/record-scroll.sh` (new, reusable for the other cards):

1. Serve the build (as above) and open `http://localhost:4173/` in agent-browser at
   **1440×900, device scale 2** (`--args "--force-device-scale-factor=2"`). That's
   the same size and shape as today's screenshot (16:10, 2880×1800).
2. Before the first paint, an init script hides the scrollbar
   (`html { scrollbar-width: none }`), so there's nothing to crop.
3. Wait for fonts, the hero's intro animation and the images above the fold.
4. `record start` at 30 fps. Then one `eval` runs a smooth eased scroll section
   by section: a short stop on the hero, why-us, services and the client logos,
   down to `connect`, then a quick scroll back to the top. About 16–20 s.
   The first and last frames are the same settled hero, so the loop has no jump.
5. `record stop` gives a high-quality master in the scratchpad (not committed).

### 3. Compress it

`scripts/encode-preview.sh` (new): from the master, with ffmpeg, no audio:

| File | Codec | Size | Target |
| --- | --- | --- | --- |
| `public/projects/alindo/video/home-scroll.webm` | VP9, 2-pass, CRF ~36 | 960×600, 30 fps | ≤ 1.2 MB |
| `public/projects/alindo/video/home-scroll.mp4` | H.264 High, CRF ~26, `+faststart` | 960×600, 30 fps | ≤ 2 MB (Safari fallback) |

960 px wide covers the card (about 370 px wide on desktop) on 2× screens. I tune
the CRF by eye and send you a few frames plus the file sizes before going on.

`home.webp` gets replaced by frame 0 of the same recording, so the still and the
video's first frame match exactly and the fade-in doesn't shift. The case study
hero uses the same file, so it changes too, but it's the same page at the same
size.

### 4. Build the hover video

- `src/content/types.ts`: a new optional `LoopMedia.preview: { webm: string; mp4: string }`,
  described as "a scroll-through that plays over the still while the card is
  hovered". Existing `webm`/`mp4` keep their current meaning.
- `src/components/media/HoverVideo.tsx` (new, client component):
  - A `<video muted playsInline loop preload="none" aria-hidden>` on top of the
    still, at opacity 0. It's `aria-hidden` because the still's alt text already
    describes the page.
  - It finds its `.work-card` with `closest()` and listens for `pointerenter`/
    `pointerleave` (mouse and pen) and `focusin`/`focusout` (keyboard). The
    card stays a server component.
  - Hover: `play()`, then fade in on the `playing` event (0.35 s), so you never
    see a blank frame. Leave: pause, fade out, then go back to 0.
  - Loading: on devices that can hover, the video starts downloading once the
    card is on screen, so the first hover starts right away. Lighthouse never
    scrolls that far, so the portfolio's own score shouldn't change. Step 6
    checks it.
  - With reduced motion or Save-Data it never loads or plays. You just see the
    still.
- `BrowserMedia.tsx`: a new `preview` prop. When it's set and `media.preview`
  exists, it renders the still plus `HoverVideo` (still `bar={false}`). Only
  `ProjectCard` passes it, so the case study hero stays a still.
- CSS in `src/styles/components.css` (`.hover-video`, `.hover-video.is-on`) and
  a guard in `reduced-motion.css`.
- `site.ts`: add `preview` to Alindo's media. No new visible text, so nothing
  changes in `site.id.ts` for the video.

### 5. The metric

Put the number you chose into `site.ts:418` (card) and `site.ts:488`
(result), with the Indonesian labels in `site.id.ts`. `dummy: true` stays until
`result.text` and `problem[1]` stop being TODO, unless you want it off.

### 6. Checks

- `npx tsc --noEmit`, `npm run lint`, `npm run build`, `npm run i18n:check`.
- With agent-browser on `npm run dev`, at 1440 and 1024: the still at rest,
  hover → video fades in and scrolls, leave → back to the still. Tab to the
  card → it plays. Screenshots for you.
- Reduced motion (emulated): the video never downloads (network panel).
- Touch (emulated iPhone): behaves as decision 1 says.
- Lighthouse on the portfolio homepage, before and after: Performance and LCP
  don't get worse, and the video doesn't show up in the initial requests.
- On your devices: desktop Chrome and Safari (mp4 fallback), and the iPhone.
- New branch `feat/alindo-card-video` from `main`. I commit only when you
  say so.

## Decisions (default in bold)

1. **Phones and tablets can't hover.** **Play while the card is mostly on
   screen, with a pause button** (needed when it plays on its own for more than
   5 s), or keep the still on touch, or show a play button to tap.
2. **When the pointer leaves:** **fade out and go back to the start**, or pause
   where it is and carry on next time.
3. **How much of the page:** **the whole homepage, hero to "Let's work
   together" and back (~16–20 s)**, or only the top half (~8 s, smaller file).
4. **Client and partner logos.** The full scroll shows Alindo's client,
   partner and alliance logo sections. **OK to show** (they're on the homepage
   you designed), or stop the scroll before them.
5. **The case study hero:** **stays a still**, or also plays the video.
6. **The card number:** chosen after step 1, from the real results.

## Out of scope

- Changing the Alindo code to raise its scores (it would no longer describe
  what you shipped).
- The other cards. They reuse steps 2–4 later, one project at a time.
