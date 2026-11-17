# Alindo homepage: Lighthouse, local build

Measured 2026-11-17 for the Alindo card and case study (`src/content/site.ts`).

- **What:** `index.html` from `~/PROJECT/alindo/alindo_landing` (latest commit
  `49ba065`), unchanged, served with `npx serve@14.2.4` (gzip on) at
  `http://localhost:4173/`.
- **How:** Lighthouse 13.6.0, headless Chrome, 5 runs on mobile (default
  throttling) and 5 on desktop (`--preset=desktop`). The run with the median
  Performance score is kept here: `lighthouse-mobile.html`, `lighthouse-desktop.html`.
- Tailwind (`cdn.tailwindcss.com`), GSAP (jsDelivr) and Google Fonts load from the
  internet, as they did live.

| | Mobile | Desktop |
| --- | --- | --- |
| Performance | **60** (49–66 over 5 runs) | **92** (91–93) |
| Accessibility | **92** (all runs) | **92** |
| Best Practices | **96** (all runs) | **96** |
| SEO | **100** (all runs) | **100** |
| LCP | 9.3 s | 1.7 s |
| CLS | 0 | 0 |
| FCP | 2.6 s | 0.7 s |
| Page weight | 2,585 KiB, 58 requests | 2,702 KiB, 64 requests |

Performance on mobile moves between runs (mostly Total Blocking Time, from
Tailwind building the CSS in the browser). The other three categories were the
same in every run.

## What held the scores back

- **Mobile LCP** is the hero's decorative left ornament
  (`assets/LEFT-ORNAMENT.webp`, 204 KiB). It's faded in by script, so it can't
  paint until Tailwind's CDN script and GSAP have run. The heaviest files are
  the Connect and About artwork PNGs (412, 381 and 320 KiB).
- **Accessibility (92):** colour contrast (white on the orange buttons, small
  orange text), a heading that skips a level (the Why Us cards are `h3`), and
  no `<main>` landmark.
- **Best Practices (96):** the four Why Us icons are served at 56 px, too small
  for 2× screens.
