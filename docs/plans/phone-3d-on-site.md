# 3D phone on the site (Step 5 of phone-3d-mockup.md)

Status (2026-11-13): BUILT with approach A and all defaults, uncommitted.

Changes while building:
- **Sheen:** drawn in CSS (`.device-screen::after`) instead of the glare PNG, which saves ~33 KB.
- **Loading:** each screen loads just before its turn.
- **Demo state:** none. The user dropped "Tap to try" on 2026-11-13 (TryDemo, the `demo` field and its labels are removed). The flagship phone is `FlagshipPhone` in ProjectCard.tsx.
- **Safari:** checked by the user, works.

Measured:
- **Bytes when the card comes near:** ~92 KB (frame 15 + mask 3 + 2 screens 73). Before scrolling, mobile Lighthouse already loads ~44 KB of it: Chrome's lazy-load distance is large on slow connections, and CSS masks always load.
- **Lighthouse:** the one valid run (benchmark 1,822) scored 88 (LCP 1.3 s, TBT 460 ms, CLS 0). The other two ran on a loaded Mac (index 700–780) and don't count.
- **WebKit:** not run. Playwright 1.60 has no WebKit for macOS 13, so check in Safari by hand.

## Goal

Replace the CSS phone on the **Presensi flagship card** and the **Presensi case study** with the studio phone, showing the real Presensi screens. It has to look at least as good everywhere (Safari, phones, all 7 accents) and cost no measurable performance.

## Today

- The flagship card is `TryDemo`: a CSS `PhoneFrame` (accent-tinted bezel, 16.5rem wide) around a `LoopVideo`. There's no recording yet, so it shows a wireframe placeholder and a TODO. With a Flutter web build, "Tap to try" swaps in an iframe. There's no build yet either.
- The case study page uses the same CSS frame, 17rem wide.
- The other project cards are dummies with no screens, so they keep the CSS frames.
- Homepage mobile Lighthouse performance is about 80 (target 90). The card sits below the fold, so it doesn't affect LCP, but anything heavy loading early would hurt.

## Three ways to do it

| | A. Layered still (recommended) | B. Rendered transparent video | C. Live 3D in the card |
|---|---|---|---|
| What it is | The studio's library files: the phone PNG with a see-through screen, the screens placed inside with the exported `matrix3d`, the glare layer on top, a gentle CSS float | The whole phone (float loop) rendered as a video with a transparent background | three.js running in the card: drag to turn it |
| Safari | ✓ | ✗ WebM transparency doesn't play; needs HEVC with alpha, which I can't encode here | ✓ |
| Weight | ~40 KB frame (AVIF) + ~50 KB per screen, lazy | 2–5 MB, and re-rendered whenever the screens change | three.js chunk + a second WebGL context + shader warm-up |
| Screens change | Swap an image, or later drop in the screen recording (a normal opaque video) | Re-render | Swap a texture |
| Motion | Float + screens changing | Anything | Anything, interactive |
| Risk | Low | Medium (Safari, size) | High (performance, jank on first draw) |

**My recommendation: A** for both places. It's what the transparent-screen library was made for. B and C can come later for one special place (for example, C on the case study page only) if you still want them.

## How A works

The layers inside one box, bottom to top:

1. **Screen content:** the 4 Presensi screenshots as a slideshow, or the screen recording once it exists (`LoopVideo`). It's warped into the screen with the exported homography, as CSS `matrix3d`, and clipped by the mask, so the rounded corners and pill are exact.
2. **Frame:** the phone with the transparent screen. The pill and border sit on top of the content, as on a real phone.
3. **Glare:** the sheen layer, white with alpha.

The whole stack floats gently (about ±4 px, ±0.6°, 6 s). It's off with reduced motion, and paused off screen.

Details:
- **Scaling:** `matrix3d` works in the frame image's pixels, so a tiny client script (ResizeObserver) sets one scale variable to the displayed width. Until it runs, a rem-based default is close enough.
- **Mask:** CSS masks use alpha, so the studio's library export gains an alpha version of the mask (white with alpha). Luminance masks aren't reliable in Safari.
- **Images:** go through `next/image` with explicit `sizes`, so visitors get AVIF/WebP at about 2× the displayed size, not the 2400 px masters.
- **Slideshow:**
  - crossfade, 3.5 s per screen;
  - runs only while the card is near the screen;
  - has a pause button, as `LoopVideo` already does (it moves for more than 5 s);
  - with reduced motion, it shows the first screen only.
- **"Tap to try" later:** when the demo opens, the picture changes to the **front** view, so the iframe is upright and usable, not skewed. Until a demo exists, nothing changes there.
- **Accents:** the phone stays neutral graphite; the card's accent glow behind it still changes with the palette. The CSS bezel's accent edge goes away on this card only.
- **Data:** a typed `src/content/mockups.ts` holds each frame's file, size, corner data (homography) and screen size, copied from the studio's JSON. The homography helpers move to `src/lib/` so the site and the studio share them.

## Assets

From the studio, pill front, graphite:
- `public/projects/presensi-pkp/phone-three-quarter-l.png`, `.mask.png`, `.glare.png` (flagship card)
- the front set (case study, and the future demo state)
- 4 screenshots: `07_home`, `14_history`, `04_login`, `03_onboarding_language`, from the `en` set (fake data) at 1290×2796. `next/image` resizes them.

## Steps

**Step 0, look (gate):** a mock of both places with the real files, injected in headless Chrome only (no site changes), at 1440×900 and 390×844, in 2 accents. You approve, or tell me what to change.

**Step 1, studio:** add the alpha mask to the library export. Export the assets above.

**Step 2, component:** `DeviceMockup` (layers, scaling, float) and `ScreenSlides` (crossfade, pause, reduced motion, pause off screen). `LoopVideo` keeps working inside it for when the recording exists.

**Step 3, wire it in:**
- `TryDemo`: no demo → `DeviceMockup`; demo open → front view + iframe.
- The case study figure.
- `site.ts`: Presensi's `media` gains the screens, so the content stays in `site.ts`.

**Step 4, checks:**
- `npm run lint` and `npm run build`.
- Screenshots at 1440×900 and 390×844, in all 7 accents, plus reduced motion.
- Bytes added to the homepage (target: under 150 KB, all lazy).
- Lighthouse mobile, compared with the current ~80 (no regression).
- WebKit (Safari's engine) through Playwright, if you're OK with me downloading it (~100 MB).

## Open decisions (my defaults)

1. **Approach:** **A, layered still** (default) / B / C.
2. **Card angle:** **three-quarter left** (default), so the phone faces the text on the right. Front is the alternative.
3. **Case study angle:** **front** (default, calmer next to a long read) / three-quarter right.
4. **Screens and order:** **home → history → login → language** (default; the strongest screen first). Any of the 25 can be used.
5. **Slideshow transition:** **crossfade** (default, calm next to text) / push slide like the videos.
6. **Float motion:** **on, subtle** (default) / off.
7. **WebKit check:** **yes**, download it (default) / skip.
