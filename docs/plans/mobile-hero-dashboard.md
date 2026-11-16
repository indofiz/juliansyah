# Mobile hero: logo strip only, globe behind the card

Scope: screens ≤ 900px (the project's mobile breakpoint, so tablets too).
Desktop stays exactly as it is: every change is in a `max-width: 900px` rule
or in the hero keyframe's `mobile` override. No TSX or copy changes
(`site.ts` keeps the tag, stat and label for desktop).

## Today (measured, 390×844, dev server)

| Element | Top → bottom (px) |
| --- | --- |
| Buttons (`.hero-actions`) | 370 → 457 |
| Dashboard frame (`--peek: 19rem`) | 540 → 844 |
| Top bar (tag, bell, avatar) | 547 → 603 |
| Stat card (12K+, apps, label, logos) | 623 → 826 |
| Logo strip only | 758 → 806 |
| Globe (hero `mobile.y = -0.26`) | centre 532 (63vh), lower half behind the frame |

At 360×740 the frame already overflows: it ends at 816 on a 740 screen, so
the logos are cut off.

## Steps

### 1. Top bar out — `src/styles/mobile.css` (hero block, ~L359–374)
The breadcrumb and Documentation chip are already hidden on mobile. With the
tag, bell and avatar gone the bar would be an empty 56px strip, so hide the
whole `.hero-frame .mock-top`. The four rules that only arranged its contents
(`.mock-crumb`/chip hide, `.mock-top-right` flex, `.mock-live` nowrap) go.

### 2. Stat card → logo strip — `src/styles/mobile.css`
- Hide `.hero-frame .mock-hero-stat` (12K+, "people use my apps",
  "Presensi PKP, PKP Smart and more") and the strip's label
  (`.hero-frame .mock-clients > .mock-tile-label`, "Organisations I've worked with").
- Card padding `1rem 0`, so the logos run the card's
  full width (the strip's edges already fade).
- Drop the dead `.mock-big` and `.mock-greet` rules.
- Screen readers: the logo list keeps its name (aria-labelledby still reads a
  hidden label). The 12K+ figure is still in the proof rows of the same pinned scene.

### 3. Shorter peek — `src/styles/mobile.css`
`--peek: 19rem` → `7.8125rem` (built): bezel 7 + body padding 20 + strip card 80
+ the same 18px cut below the card as today (card bottom 826 at 390×844, as before).
This also fixes the 360×740 overflow.

### 4. Globe lower, behind the card
- `src/lib/sceneKeyframes.ts` hero `mobile: { y: -0.26 }` → about `-0.56`
  (centre 63vh → 78vh). The proof keyframe doesn't change, so the globe rises
  a little further as you scroll.
- The glass bars follow the globe's centre (`--cy`). Move the mobile `--cy`
  into `.hero-bars` in `mobile.css` (≤ 900px, the same breakpoint as the
  keyframe override). Remove it from the portrait query in `sections.css`
  (L178–182), which keeps `--r`. Reading the code, portrait screens wider
  than 900px (e.g. iPad Pro portrait) get the desktop globe (90vh) but bars at
  63vh today, so this also lines them up there.
- Update the comments that quote the old numbers (sections.css L180,
  mobile.css hero block).

Projected with y −0.56, peek 8.25rem (built: 7.8125rem, card ~7px lower) (globe radius ≈ 0.366 × 90vw):

| Screen | Globe top | Buttons end | Card top | Globe behind card |
| --- | --- | --- | --- | --- |
| 360×740 | 459 | 480 | 608 | ~37% |
| 390×844 | 530 | 457 | 712 | ~29% |
| 430×932 | 585 | 410 | 800 | ~24% |

The globe's position is in vh and the card's height is in rem, so taller
phones hide a bit less. On 360×740 the globe's top already sits behind the
buttons today (top ≈ 348), and this puts it lower.

### 5. Checks
- `npm run lint`, `npm run build`.
- Screenshots (Playwright from the scratchpad, globe rendered): 360×740,
  390×844, 430×932, 768×1024; mid-pin (half a screen scrolled) at 390;
  reduced motion at 390 (stacked layout: strip + sample tiles, no top bar).
- Desktop unchanged: 1440×900 hero element rects identical before and after.

## Decisions (user said "go": defaults in bold, built 2026-11-16)

1. Top bar: **hide it entirely**, or keep the "Dashboard" breadcrumb so the
   card still reads as an app window.
2. How much globe behind the card: **about a third (y ≈ −0.56)**, or half
   like now (centre on the card's top edge, y ≈ −0.68).
