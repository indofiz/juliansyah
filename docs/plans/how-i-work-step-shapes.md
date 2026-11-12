# Plan: the globe becomes each step's shape (How I work)

Status: **plan only, nothing built yet.** Written 2026-11-12 on `feat/portfolio-home`
(after commit `679ea78`). Waiting for "go" plus answers to the open decisions
at the bottom.

## The idea

In "From First Sketch to Live App." (section `#process`), remove the frosted
lens and the SVG illustration on the right. Instead, the 3D particle globe
itself turns into a shape that fits each step as the step lights up.

It's feasible: every particle already carries one target position per shape
(globe, cloud, portrait) and the GPU blends between them. Each step adds one
more target.

## How the section works today

- **Desktop:** the track is 220vh with a sticky stage (`src/styles/sections.css`,
  `.process-track` / `.process-stage`), so the globe holds still in the right
  column (the `process` keyframe in `src/lib/sceneKeyframes.ts`, x 0.64,
  scale 0.75). A frosted lens sits on it showing the lit step's SVG
  (`src/components/process/StepArt.tsx`). `src/components/ScrollFx.tsx`
  (`[data-steps]` block) lights the steps, replays the drawing (`.played`) and
  fades the lens with the globe (`syncLens`).
- **Phones (≤ 900px):** nothing pins. The globe sits under the title; the
  `about` keyframe's `mobileScroll` starts at `#process` top, so the globe dims
  and dissolves as soon as the steps scroll up over it.
- **Shader:** `uMorph` 0 → 1 → 2 = globe → cloud → portrait
  (`src/components/canvas/shaders.ts`). 7 vertex attributes today: position,
  aGlobe, aScatter, aShape, aShade, aRandom, aKind.

## Plan

### Step 0: preview gate (before any scroll wiring)

Build the 4 shapes and a dev-only switch (keys 1–4) to look at each one on the
real GPU, in 2–3 palettes. If they don't read as objects, stop here; only the
preview work is lost.

| Step | Shape |
|---|---|
| Discover | Speech bubble, with the 5 waveform bars standing out of its face |
| Design | Phone with a raised wireframe (header bar, image block, lines, button) |
| Build | A chunky `</>` |
| Launch | Rocket (round body, nose cone, 3 fins, window), spare particles as exhaust |

All drawn in code from three.js shapes (`THREE.Shape` + `ExtrudeGeometry`, a
`LatheGeometry` for the rocket body, merged with `mergeGeometries`): no
downloads, no new libraries. Fronts sampled on an even dot grid like the
portrait (halftone look); a slow sway (about ±20°) so the depth reads.

### Step 1: shader and data

- `src/lib/particleShapes.ts`: `buildStepShapes(count)` returns 4 `ShapeData`,
  each sized to the globe's footprint (height ≤ ~2.4, width ≤ ~2.2 world
  units) so nothing reaches the step text. Unknown step ids fall back to the
  globe.
- `src/components/canvas/ParticleMorph.tsx`: attributes `aStep1`…`aStep4`
  (vec3) + `aStepShade` (vec4) → 12 attributes. three r187 is WebGL2-only,
  which guarantees 16. Built after the intro in idle time (one shape per idle
  slot), not at start-up; until they exist the step value is held at 0.
- `src/components/canvas/shaders.ts`: one uniform `uStep` (0 globe,
  1 Discover … 4 Launch). The "home" position = staggered blend between
  neighbouring targets (same per-particle stagger as the portrait morph). The
  atmosphere sphere and the outer strands fade while a shape shows. The cloud,
  portrait and floor stages run unchanged on top of it.
- `src/lib/sceneState.ts`: `step` lives on `sceneState` but outside
  `SceneValues` (like `intro`), so `ScrollScenes` never overwrites it.

### Step 2: scroll wiring (`ScrollFx`)

- When a step lights up, tween `sceneState.step` to its index over ~1.2 s
  (`power2.inOut`, `overwrite`), so it always rests on a whole shape.
- Scrolling back plays it in reverse. Above the section → 0 (globe).
- After Launch the value stays 4: the rocket dissolves into the cloud and
  becomes the portrait in About.

### Step 3: remove the illustration

Delete the lens and arts from `Process.tsx`, `StepArt.tsx`, the lens sync and
`play()` in `ScrollFx`, and ~350 lines of lens and `sa-*` CSS in
`sections.css`, `mobile.css` and `reduced-motion.css`. Git history keeps them
(commit `0577b1f`).

### Step 4: checks

- `npm run lint`, `npm run build`
- Screenshots at 1440×900, 1024 wide and 390×844, one per step (mid-pin)
- Brightness in all 7 palettes (Lime has the lowest bloom, 1.0)
- Frame rate on the 2017 MacBook (Iris Plus 650): it runs ~59 fps at 42k
  particles / pixel ratio 1.75 / bloom today and must stay there
- Lighthouse 13.6+ mobile: no regression (valid only when
  `environment.benchmarkIndex` ≈ 1800)
- Reduced motion and no-WebGL

## Risks, most serious first

1. **The shapes may not read.** Particles show bold outlines well and fine
   detail poorly. Bubble, phone, `</>` and rocket should work; thin parts
   (wireframe lines, waveform bars, the `/`) can blur into blobs, and the
   current drawings' detail (scope document, swatches, cursor tap) is lost.
   Step 0 catches this.
2. **Phones won't see the shapes** unless their layout changes: the globe sits
   behind the title and fades as the steps scroll over it. Removing the lens
   also removes the only per-step picture phones have now. A sticky phone
   layout (shape on top, one step at a time below) is a redesign and brings
   the iOS address-bar height issues (use `svh`).
3. **Extra cost.** About 2.7 MB more memory at 42k particles (~1 MB at 16k on
   phones). Building may take 100–300 ms on a mid Android phone, so it's split
   into idle chunks. Shapes pack dots closer than the globe (more overdraw),
   so on weak GPUs `QualityGovernor` may lower resolution sooner.
4. **Brightness varies by palette.** Dense shapes plus bloom can blow out,
   Lime especially. Tune per shape.
5. **Fast scrolling** from step 1 to 4 flies briefly through Design and Build.
   Quick, but busy.
6. **Fallbacks need an answer.** No WebGL: no globe, and without the lens the
   right column is empty. Reduced motion: shapes switch instantly.
7. **Low risks (checked):** 12 of 16 guaranteed attributes; the canvas is
   `aria-hidden` and the step text carries the meaning; one commit, easy to
   roll back.

## Open decisions (defaults in brackets)

1. **Phones:** [desktop first, decide phones after seeing the preview] or do
   the sticky phone layout in the same round.
2. **Discover:** [becomes the speech bubble] or stays the globe ("your users,
   anywhere"), one shape fewer.
3. **No-WebGL fallback:** [section becomes two columns, copy | steps] or keep
   the SVG drawings only for that case.
4. **The 4 shapes:** [as in the table] or your own. Simple filled outlines
   from Figma work as a source.

## Notes for whoever picks this up

- Pull first; the branch is worked on from more than one device.
- If a `next dev` is already running on :3000, test against it rather than
  starting another.
- Headless screenshots: Playwright run from a scratch folder (not a project
  dependency). For the real GPU in headless Chrome on macOS use
  `--use-angle=metal`.
- `AGENTS.md`: read `node_modules/next/dist/docs/` before Next-specific code
  (Next 16.4).
