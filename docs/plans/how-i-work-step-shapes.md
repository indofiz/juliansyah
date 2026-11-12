# Plan: the globe becomes each step's icon (How I work)

Status: **plan only, nothing built yet.** v2, written 2026-11-12 on
`feat/portfolio-home`. It replaces v1 (commit `32298cc`), which used detailed
3D models (speech bubble with waveform, phone with wireframe, rocket with
lathe body and fins). v2 uses four simple, bold icons to cut the risks.
Waiting for "go" plus answers to the open decisions at the bottom.

## The idea

In "From First Sketch to Live App." (section `#process`), remove the frosted
lens and the SVG drawings on the right. Instead, the 3D particle globe itself
turns into a big, simple icon for each step as the step lights up.

It's feasible: every particle already carries one target position per shape
(globe, cloud, portrait) and the GPU blends between them. Each step adds one
more target.

## What v2 changes, and why

| v1 risk | v2 answer |
|---|---|
| Detailed shapes may not read (thin bars, wireframe lines) | Bold icons, no line thinner than ~12% of the icon's height |
| Phones lose the only per-step picture | Phones get each step's icon beside its title |
| Building 3D shapes takes 100–300 ms on a mid phone | A 2D canvas drawing plus a dot grid: a few ms per icon |
| Dense shapes blow out with bloom | Same dot spacing as the portrait (already tuned in all 7 palettes); hidden particles skipped by the GPU |
| Fast scrolling flies through Design and Build | Goes straight from one icon to the next |
| No WebGL: the right column is empty | The lit step's icon shows there as a static SVG |

## The icons

| Step | Icon | Why it fits |
|---|---|---|
| Discover | Magnifying glass: thick ring and handle (alternative: a bold `?`) | Finding out what users need |
| Design | Pencil, diagonal | "First Sketch" in the section title; wireframes first |
| Build | `</>` with thick strokes | Code |
| Launch | Rocket as one flat silhouette tilted 45°, round window as a hole (alternative: paper plane) | Matches the section's badge icon |

Rules for every icon:

- **One silhouette**, filled or drawn with a thick stroke. No small parts.
- **No line thinner than ~12% of the icon's height**: about 65 px on a
  1440×900 screen.
- **Big**: up to ~2.4 world units tall and ~2.2 wide, about the size of the
  globe with its outer ring (about 530 px tall on a 1440×900 screen, 59% of
  the screen height). The width limit keeps it off the step text.

## How the icons are made

- `src/lib/stepIcons.ts`: each icon is a few SVG path strings in a 100×100
  box, each with a fill or a stroke width. It is the single source for both
  the particles and the SVG versions (phones, no WebGL). Changing an icon
  means changing a path string; a path exported from Figma works too.
- Particles: draw the paths on an offscreen canvas (`Path2D`) and lay the
  portrait's halftone dot grid over it. The grid code is shared with
  `loadPortraitShape`, not copied. With the portrait's dot spacing an icon
  takes only ~4–6k dots; with 6k particles (software WebGL) the grid widens
  by itself, as the portrait's does.
- Depth: the front face plus its edge repeated 2–3 times behind it (about 0.2
  deep, dimmer), so it reads as a solid slab when it turns. The icons face
  the camera with their own slow sway (±15°) and the existing mouse tilt, not
  the globe's spin.
- No three.js geometry, no `MeshSurfaceSampler`, no downloads, no new
  libraries.

## Plan

### Step 0: preview gate (before any scroll wiring)

Build the 4 icons and a dev-only switch (keys 0 = globe, 1–4 = icons) to look
at each one on the real GPU, in 2–3 palettes including Lime. Check that each
reads at a glance, its size and brightness, and whether the depth shows. It's
cheap: if one icon doesn't read, change its path, not the approach.

### Step 1: shader and data

- `src/lib/particleShapes.ts`: `iconShape(icon, count)` returns a `ShapeData`.
  The leftover particles work as in the portrait: a little dust around the
  icon, the rest hidden.
- `src/components/canvas/ParticleMorph.tsx`: attributes `aStep1`…`aStep4`
  (vec4: position plus brightness), 11 attributes of the 16 that WebGL2
  guarantees (three r187 is WebGL2-only). Built right after the globe, in an
  idle callback.
- `src/components/canvas/shaders.ts`:
  - One uniform `uStepW` (vec4): how much of each icon shows. The globe gets
    the rest.
  - Particles move a little out of step, like in the portrait morph.
  - The atmosphere sphere and the outer strands fade while an icon shows.
  - Particles with no dot in the icon get point size 0 once they arrive, so
    the GPU skips them. This also speeds up the portrait.
  - The cloud, portrait and floor stages run unchanged on top of it.
- `src/lib/sceneState.ts`: the step weights live on `sceneState` but outside
  `SceneValues` (like `intro`), so `ScrollScenes` never overwrites them.

### Step 2: scroll wiring (`ScrollFx`)

- When a step lights up, tween its icon's weight to 1 and the others to 0
  over ~1 s (`power2.inOut`, `overwrite`). Going from Build back to Discover
  goes straight there, never through Design.
- The globe rises into the section as today and turns into the magnifying
  glass when the stage pins. Above the section it's the globe; scrolling back
  plays everything in reverse.
- After Launch the rocket stays: it dissolves into the cloud and becomes the
  portrait in About.
- Reduced motion: the icons swap at once.

### Step 3: replace the lens

- Delete the lens and drawings: `StepArt.tsx` (224 lines), the lens and
  `sa-*` CSS in `sections.css`, `mobile.css` and `reduced-motion.css`, and
  `play()` / `syncLens` in `ScrollFx`. Git keeps them (commit `0577b1f`).
- Add a small `StepIcon` component (SVG from the same paths):
  - **Phones (≤ 900px):** a small icon beside each step's title.
  - **No WebGL (desktop):** the lit step's icon, big and static, where the
    globe would be, with the accent glow.

### Step 4: checks

- `npm run lint`, `npm run build`
- Screenshots at 1440×900, 1024 wide and 390×844, one per step (mid-pin)
- Brightness in all 7 palettes (Lime has the lowest bloom, 1.0)
- Frame rate on the 2017 MacBook (Iris Plus 650): it runs ~59 fps at 42k
  particles / pixel ratio 1.75 / bloom today and must stay there
- Lighthouse 13.6+ mobile: no regression (valid only when
  `environment.benchmarkIndex` ≈ 1800)
- Reduced motion and no-WebGL

## Risks left, most serious first

1. **The icons are plainer than the drawings.** The scope document, swatches
   and cursor tap are gone, by choice.
2. **Phones still don't see the particle icons**, only the small ones in the
   list: there the globe sits behind the title and fades as the steps scroll
   over it. A sticky phone layout is a separate redesign, for later if
   wanted.
3. **Brightness by palette.** Smaller now that the dot spacing matches the
   portrait, but Lime is still the one to check.
4. **Memory:** about 2.7 MB more at 42k particles (~1 MB at 16k on phones).
   Low.
5. **Low risks (checked):** 11 of 16 guaranteed attributes; the canvas is
   `aria-hidden` and the step text carries the meaning; one commit, easy to
   roll back.

## Open decisions (defaults in brackets)

1. **Discover:** [magnifying glass] or a bold `?`.
2. **Design and Launch:** [pencil, rocket] or a pen nib / a paper plane.
3. **Phones:** [small icon beside each step's title] or nothing (the globe
   as today, no per-step picture).
4. **Small icons on desktop too:** [no, only the big one] or beside every
   step's title on all screens, which ties each big icon to its step.

## Notes for whoever picks this up

- Pull first; the branch is worked on from more than one device.
- If a `next dev` is already running on :3000, test against it rather than
  starting another.
- Headless screenshots: Playwright run from a scratch folder (not a project
  dependency). For the real GPU in headless Chrome on macOS use
  `--use-angle=metal`.
- `AGENTS.md`: read `node_modules/next/dist/docs/` before Next-specific code
  (Next 16.4).
