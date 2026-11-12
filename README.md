# Juliansyah — portfolio

> **Looking for the previous site?** The original Tailwind portfolio (v1, with
> separate About / Projects / Contact pages) is preserved at git tag
> `v1-legacy` and branch `legacy/v1`. Its old URLs redirect here (see
> `next.config.ts`). The first particle version (mint accent) is at tag `v2-mint`.

A Next.js portfolio for a Flutter developer, front-end developer and UI/UX
designer in Jakarta. A glowing particle globe and a particle portrait move
with the scroll, inside a dark, amber-glow ("Ember") design system.

## Run it

```bash
npm install
npm run dev       # http://localhost:3000
npm run lint
npm run build
```

## The page answers four questions, in order

| # | Section | id | Answers | Notes |
| --- | --- | --- | --- | --- |
| 1 | Hero | `hero` | Who are you? | Greeting pill (name ✳ tagline), headline (the only h1), description, two CTAs, design-system dashboard whose stat card is real (12K+ users, moving strip of client logos in colour) inside sample chrome. **Pinned**: the copy slides up and the dashboard slides down while the globe rises |
| 2 | Track record | `proof` | Can I trust you? | Second screen of the pinned intro: one-line stats (icon, white number, amber label) around the centred globe; View work / Learn more on desktop |
| 3 | Selected work | `work` | Can you do what I need? | Flagship card with "Tap to try" (lazy Flutter web iframe), then project cards. Each opens `/work/[slug]` |
| 4 | How I work | `process` | What's it like to work with you? | Main's "Seamless from Call to Launch" layout with the globe on the right: copy, four steps (Discover, Design, Build, Launch) on a track that fills as you scroll, and a frosted lens on the globe where the lit step's SVG illustration draws itself in. **Pinned** on desktop; phones stack title, globe, steps, buttons |
| 5 | About | `about` | Who are you, and can you do what I need? | Main's "Under One Roof" layout, titled "From Design to Production, Under One Roof.": three cards a side (Who I am, then five expertise cards with their tools) with the particle portrait forming in the empty middle column. Phones: title, portrait, then a card carousel. Without WebGL the real photo fills the middle column |
| 6 | Playground | `playground` | Can you do what I need? | Experiments that load near the viewport and pause off screen |
| 7 | Testimonials | `testimonials` | Can I trust you? | Short quotes, just before Contact |
| 8 | Contact | `contact` | How do I reach you? | Email + copy, book a call, reply time, availability. The globe rises behind the frosted panel |
| – | Footer | `footer` | | Socials, résumé, last updated (build date) |

Case studies live at `/work/[slug]` (problem → my role → process → key
decisions → result → next project), prerendered from `projects` in
`src/content/site.ts`, each with its own Open Graph image and CreativeWork
JSON-LD. Projects marked `dummy: true` are noindex and left out of the sitemap.

## Content and placeholders

**All copy lives in `src/content/site.ts`** (types in `src/content/types.ts`);
components never hard-code text. Any string that starts with `TODO:` is a
placeholder: it renders with a dashed outline so it can't ship unnoticed.
List them all:

```bash
grep -n "TODO:" src/content/site.ts
```

**Screen recordings** (`LoopMedia`): put `webm` + `mp4` + a `poster` in
`public/work/<slug>/` and reference them on the project's `media`. They play
muted, inline and looped, load only near the viewport, pause off screen and
never autoplay with reduced motion or Save-Data. Until then a wireframe
placeholder is shown.

**"Tap to try"**: build the Flutter app for the web with
`flutter build web --base-href /demos/<slug>/`, copy `build/web` to
`public/demos/<slug>/`, and set `demo: { src: "/demos/<slug>/", title }` on
the project. The iframe is created only after the click.

## Fits every screen size

All sizes are in `rem`. On screens ≥ 1024px wide the root font size scales
with the window (`tokens.css`), so the page behaves like the 1440×900 design
zoomed in or out. Use `calc(N * var(--vw))` instead of `Nvw` for fluid values.
Below 1024px it's a normal responsive layout with a 16px base; phone rules
(≤ 900px) live in `src/styles/mobile.css`.

## Motion and accessibility

- `prefers-reduced-motion`: nothing pins or scrubs (`src/styles/reduced-motion.css`,
  loaded last), videos stay on their poster, the globe cuts between states
  instead of moving and its drift stands still, and How I work shows every
  step lit.
- Visible focus ring everywhere (`:focus-visible` in `tokens.css`); the
  mobile menu moves focus in and returns it on Escape; "Tap to try" moves
  focus into the demo and back.
- One h1 per page; every section is labelled by its heading.

## Where to edit

| What | File |
| --- | --- |
| **All copy, projects, case studies, numbers** | `src/content/site.ts` |
| Colors, radii, fonts (design tokens) | `src/styles/tokens.css` |
| Accent colour (whole site) | the `--accent-*` ramp in `tokens.css` + `src/lib/theme.ts` (WebGL) |
| Buttons, badges, cards, frames, device frames, nav | `src/styles/components.css` |
| Section layouts | `src/styles/sections.css` and `src/components/sections/*` |
| Scroll choreography of the particles | `src/lib/sceneKeyframes.ts` |
| Pinned intro timing (headline up, dashboard down, proof in) | intro timeline in `src/components/ScrollFx.tsx` |
| How I work illustrations (one SVG per step, drawn in and looped with CSS) | `src/components/process/StepArt.tsx`, styles under "Step art" in `sections.css` |
| Particle look, count, bloom | `src/components/canvas/shaders.ts`, `Scene.tsx` |

**Adding a section:** add a `<section id="my-section">` to `page.tsx` and a
`"my-section": { ... }` entry to `sceneKeyframes.ts` in the same order. The
particles' transition into it plays while that section scrolls from the
bottom of the screen to the top. Use the `hidden` preset if they shouldn't show.

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

## Your portrait (in the About section)

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
`scripts/make-portrait.py` (it's placed from the detected eyes). Position is the `about` keyframe in `sceneKeyframes.ts`. Shine speed/width and the mouse turn are in `shaders.ts` and
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

- The particle scene (three.js + post-processing, the largest script) starts
  on the first interaction, or 3 s after load, so it never competes with the
  headline (LCP) or hydration.
- Particle budget (`Scene.tsx`): 42k on desktop, 16k on screens ≤ 768px,
  6k and no bloom when WebGL runs without a GPU. Pixel ratio starts at up to
  1.75; `QualityGovernor` measures the real frame rate while the particles
  are on screen and steps it down (1.5, 1.25, 1) below 48 fps, then turns
  bloom off below 28 fps. It never steps back up during a visit.
- The globe spins on its own, one turn about every 80 s
  (`GLOBE_SPIN_SPEED` in `ParticleMorph.tsx`); still with reduced motion.
- The render loop stops while the particles are faded out (most of the page).
- Videos, iframes and playground items load only near the viewport.
- Lighthouse 13.6, mobile profile, local production build (2026-11-11):
  homepage 80 / 100 / 100 / 100, case study 98 / 100 / 100 / 100
  (performance / accessibility / best practices / SEO). LCP 1.1 s.
