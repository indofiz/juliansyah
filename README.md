# Juliansyah — portfolio (v2)

> **Looking for the previous site?** The original Tailwind portfolio (v1, with
> separate About / Projects / Contact pages) is preserved at git tag
> `v1-legacy` and branch `legacy/v1`:
> `git checkout v1-legacy` (or `git worktree add ../juliansyah-v1 legacy/v1`).
> Its old URLs redirect to the matching section here (see `next.config.ts`).
> This design first shipped with a mint-green accent; that version is at git
> tag `v2-mint`.

A Next.js portfolio landing page with a glowing particle globe that changes as
you scroll, wrapped in a dark, orange-glow design system: gradient headings,
glowing pill buttons, icon badges, glow-framed app screens, dotted textures and
scroll-lit lists.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Sections (in order)

| # | Section | id | Pattern |
| --- | --- | --- | --- |
| 1–2 | Intro (hero + stats) | `hero` / `about` | **Pinned scene on desktop.** Scrolling slides the headline up and the dashboard down while the globe rises to the centre, then the stats fade in around it. Normal scrolling on mobile |
| 3 | Services | `services` | Globe dissolves → sinks → your portrait builds up from the bottom between 3 + 3 cards, with a light sweep and a small mouse turn |
| 4 | Work | `work` | Project index in a glowing table, rows light up on scroll |
| – | Pricing | `pricing` | *Not rendered.* Three plans, middle one highlighted |
| – | Estimator | `estimator` | *Not rendered.* Clickable scope tiers update four stat boxes |
| 7 | Process | `process` | Globe centre, steps with a track that fills on scroll |
| 8 | Case study | `spotlight` | Sticky: scrolling switches the active feature and the framed screen |
| 9 | Assistant | `assistant` | Purple orb, purple-framed chat with clickable suggestions |
| 10 | Featured | `featured` | Statement, purple button pair, framed analytics screen |
| 11 | Skills bento | `capabilities` | Six cards (Flutter, UI/UX, front-end, design systems, motion, performance). Each illustration is a small live UI that plays on hover, or while centred in view on touch screens |
| – | Portal | `portal` | *Not rendered.* Framed client-portal UI bleeding off the right edge, working toggles |
| 13 | CTA | `cta` | Panel whose glow slides from the corner to the bottom, rising particle bars |
| 14 | Footer | `footer` | Link columns, button cards, giant glowing wordmark |

## Fits every screen size

All sizes are in `rem`. On screens ≥ 1024px wide the root font size scales
with the window (`tokens.css`), so the page behaves like the 1440×900 design
zoomed in or out: same proportions at 1440px, 2560px or 4K. It follows the
tighter of width and height, so short and ultrawide windows still fit. For
fluid values use `calc(N * var(--vw))` instead of `Nvw`: `--vw` is 1% of the
design width on desktop and a real `1vw` on mobile. Below 1024px it's a normal
responsive layout with a 16px base.

When adding CSS, write sizes in `rem` (px ÷ 16, so `24px → 1.5rem`). Keep
`1px` for hairlines. Icons take their `size` in design px and convert to rem
themselves.

## Mobile (≤ 900px)

Follows the reference's phone layout: fixed header with a ☰ full-screen menu
(hides on scroll down, returns on scroll up), the same pinned hero → stats
intro, your portrait above a swipe carousel of service cards, swipe carousels
for plans and capabilities (glowing bar / dash indicators), centred section
headers, stacked buttons, and a 2-column footer. All mobile rules live in
`src/styles/mobile.css`; carousel indicators are driven by
`src/components/Carousels.tsx` (`data-carousel` + `data-carousel-nav`).
Globe/portrait positions on mobile are the `mobile` overrides in
`sceneKeyframes.ts`.

## Skills bento

Cards and copy: `capabilities` in `src/content/site.ts`. Illustrations:
`src/components/bento/Arts.tsx` (markup) and `src/styles/bento.css` (look and
animations, all keyed off `.bento-card:is(:hover, .is-active)`).
`src/components/bento/BentoFx.tsx` scales each illustration to its card,
moves the hover spotlight and tilt, and on touch screens plays a card while
it's in view.

**Your Flutter screenshots:** the phone shows a dummy travel app for now. Put
two portrait PNGs (e.g. 390×844) in `public/work/` and list them in
`flutterScreens` in `site.ts`; the phone then swipes from the first to the
second on hover.

## Where to edit

| What | File |
| --- | --- |
| **All copy, numbers, projects, plans** | `src/content/site.ts` |
| Colors, radii, fonts (design tokens) | `src/styles/tokens.css` |
| Accent colour (whole site) | the `--accent-*` ramp in `tokens.css` + `src/lib/theme.ts` (WebGL) |
| Buttons, badges, cards, glow frames, nav | `src/styles/components.css` |
| Section layouts | `src/styles/sections.css` and `src/components/sections/*` |
| Mock app screens inside frames | `src/components/mocks/*` and `src/styles/mocks.css` |
| Scroll choreography of the globe | `src/lib/sceneKeyframes.ts` |
| Pinned intro timing (headline up, dashboard down, stats in) | intro timeline in `src/components/ScrollFx.tsx` |
| Other scroll effects (reveals, steps, CTA glow, beams) | `src/components/ScrollFx.tsx` |
| Outer shell "dance" (radius, speed, strands) and lighting | `src/components/canvas/shaders.ts` |
| Particle look (size, glow, drift, sinking) | `src/components/canvas/shaders.ts` |
| Particle count, bloom strength | `src/components/canvas/Scene.tsx` |

**Hidden sections:** Pricing, Estimator and Portal still exist in
`src/components/sections/` but aren't in `page.tsx` or `sceneKeyframes.ts`.
To bring one back, update its copy in `site.ts` and re-add both entries in the
same position.

**Replacing the mock screens with real work:** the framed screens are built in
HTML so the page works out of the box. When you have screenshots, drop an
`<img>` inside `<GlowFrame>` instead of the mock component.

**Adding a section:** add a `<section id="my-section">` to `page.tsx` and a
`"my-section": { ... }` entry to `sceneKeyframes.ts` in the same order. The
globe's transition into it plays while that section scrolls from the bottom of
the screen to the top. Use the `hidden` preset if the globe shouldn't show.

## How the globe works

```
Lenis smooth scroll ──▶ GSAP ScrollTrigger (scrub) ──▶ sceneState ──▶ useFrame ──▶ shader uniforms
                         one timeline per section pair   plain object    every frame
```

- **One fixed `<canvas>` behind the page** (`SceneCanvas`). All content is
  normal HTML on top of it, so it stays responsive and SEO-friendly.
- **Particles, not a model.** `particleShapes.ts` builds one position per
  particle for each state: `aGlobe` (dots on land, sampled from
  `public/textures/earth-mask.png`, plus an atmosphere halo), `aScatter` (a
  loose cloud), and `aShape` (points sampled from the surface of any mesh).
- **The morph runs on the GPU.** `shaders.ts` blends between those positions
  using one number, `uMorph` (0 = globe, 1 = cloud, 2 = shape).
- **The outer shell** is ~24% of the globe's particles. In the vertex shader
  their radius is pushed in and out by 3D simplex noise that changes over
  time, split into three parallel strands, and they're brightest at the
  silhouette, so the layer reads as wavy lines that keep moving. Tune
  `uShellRadius` / `uShellAmp` in `ParticleMorph.tsx` or the noise speeds in
  the shader.
- **Lighting:** a key light from the top-left brightens the rim and land on
  that side and dims the bottom-right (`lightDir` in the shader).
- **Keyframes** can include `via` (one or more in-between states, e.g. grow →
  sink → cloud before the shape), `scroll` (a custom scroll range, used for
  the pinned intro) and `mobile` overrides. While the globe is faded out it
  isn't drawn at all.
- **Hero glass bars:** four `.hero-bar` panels with `backdrop-filter: blur`
  sit over the canvas. The globe looks frosted through them, and the thin gaps
  between panels show the raw particles as sharp dotted strips. They're sized
  in units of the globe radius (`--r`), which mirrors the globe's size rule in
  `ParticleMorph.tsx`. If you move or resize the hero globe, update `--cy` /
  `--r` in `.hero-bars`; adjust `--bar` / `--gap` for panel width and spacing.

## Your portrait (the head in the services section)

The particle cloud forms your head and shoulders, wearing a VR headset, as
a dim dotted 2.5D relief: real depth from a depth map, so it turns a few
degrees toward the mouse, with a band of light sweeping up it every ~5.5 s.
The headset is the brightest part; the shoulders fade out toward the bottom.

**Change the photo:**

```bash
pip install numpy scipy pillow "opencv-python-headless<5"   # one-time
npm run portrait path/to/photo.jpg                # adds a VR headset
npm run portrait path/to/photo.jpg -- --no-headset # just your face
```

If your photo already shows a headset with a glowing visor (like the current
`assets/portrait-source.png`), it's detected automatically: the visor sets
the eye line and nose, it's pushed forward in depth, glows brightest, and no
headset is drawn on top. Transparent PNG cut-outs are used as-is.

That rewrites `public/portrait/portrait-map.png` (R = brightness, G = depth,
B = mask) and saves `assets/portrait-preview.png` so you can check the
cutout, depth and brightness. Best results: head-and-shoulders, face roughly
centred, plain background that differs from skin/hair/clothes (or a
transparent PNG). Your original photo stays in `assets/`, which isn't served.

**Tune it** in `src/components/canvas/Scene.tsx`:
`brightness` (overall dot brightness, try 0.6–1.3), `height` (size), `depth`
(how deep the relief is), `dotSpacing` (gap between dots as a fraction of the
height; bigger = coarser halftone).
The headset's shape and size are in `add_headset()` in
`scripts/make-portrait.py` (it's placed from the detected eyes). Position per section is in `sceneKeyframes.ts`
(`services`). Shine speed/width and the mouse turn are in `shaders.ts` and
`ParticleMorph.tsx` (`uMouse`).

How the depth is made: background removed by colour keying; OpenCV finds the
face and eyes; a rounded bust from the silhouette plus a head ellipsoid, nose,
brow, cheeks and eye sockets placed from the detected features, plus fine
relief from the photo's shading.

## Use your own shape (e.g. a bull head)

1. Put a `.glb` file in `public/models/`, e.g. `public/models/bull.glb`.
   Keep it under a few MB; only the surface is used, not textures.
2. In `src/components/canvas/Scene.tsx` set
   `const SHAPE: ShapeSource = { type: "model", url: "/models/bull.glb" };`
3. Adjust `shapeSpin` in `sceneKeyframes.ts` so it faces the viewer.

## Regenerate the earth mask

```bash
npm run mask                                   # 1024×512, 50m coastlines
node scripts/generate-earth-mask.mjs 2048 50m  # sharper
```

Or replace it with any equirectangular world map where land is bright and
ocean is dark.

## Performance notes

- 42k particles on desktop, 16k on screens ≤ 768px (`Scene.tsx`).
- Pixel ratio is capped at 1.75; the globe isn't drawn while faded out.
- "Reduce motion" users get native scrolling, no reveals and static lists.
