# Plan: round 3D step pictures (How I work), v4

Status: **built** (2026-11-13, `feat/portfolio-home`), with the defaults for
all five open decisions, after `4ef30fd` (v3: layered illustrations, see
`how-i-work-step-illustrations.md`). The shapes were signed off at Step 0.

Afterwards (same day): **the picture moved to the middle**, as main's
globe in "Seamless from Call to Launch": copy | picture | steps (keyframe
x 0, scale 0.72; columns 0.95fr / 1.1fr / 0.95fr so the picture and its
halo clear the copy and the step track, also at 1024×768 with the pointer
at either side). Pinned stage, Discover-first arrival and phones unchanged.

Changed while building:

- **Sway ±8°, not ±12°, and the dots sit at 65% of the real depth** (their
  light still comes from the real shapes). Real 3D turned so much at ±12°
  that the pictures looked different, and near parts (the brush) swung off
  the screen.
- **Pictures fit 1.8 units wide, not 1.9** (`PICTURE_BOX`), and the halo
  sits 0.10/0.15 out, not 0.12: at 1024×768 with the pointer far left the
  brush touched the screen's edge. Now only the faint halo can graze it.
- **Finer dot grid:** 0.0175 instead of 0.021 (5–8k dots a picture).
- **Drop-shadow gaps:** particles add their light, so they can't layer, and
  surfaces hidden behind a front part get no dots. When a picture sways, a
  thin dark gap opens behind front parts (`</>`, the brush). It reads like
  a drop shadow.
- **A picture fades in once built** (0.9 s), so one that's already wanted
  never pops in over the globe. Landing in the section, the fly-in waits
  (up to 2.5 s) for Discover.
- **The phone icons are lifted** (brighter mid-tones): at 40 px the shaded
  side sank into the page.
- The no-WebGL picture is the smooth render (like the references), not dots:
  smaller files and closer to the clay look.
- `--scene-rim` (the particles' rim colour) is now a CSS variable, for the
  images' light parts.
- `tsconfig.json` gained `allowImportingTsExtensions`, so Node can load
  `sdf.ts` and `stepScenes.ts` for the script.

Checked: lint, build; production worker (each picture 250–350 ms, all four
in 1.1 s, Discover first); arrival from Work, scrolling back to the hero
(earth again), landing on `#process`; each step and mid-morph at 1440×900;
clipping at 1440×900 and 1024×768 with the pointer at the far left; phone
(390×844: telescope under the title, icons beside the steps); Violet and
Lime; no WebGL; reduced motion; software WebGL (6k particles); 60 fps at
1.75× for the globe and all four steps (production, this Mac's GPU in
headless Chrome). Not checked: Lighthouse, a real phone.

## What you asked

1. The pictures look flat. Make them round and solid, like the three 3D
   references (clay-style icons).
2. **Discover:** a telescope on a tripod with two stars (reference 1).
3. **Design:** a painter's palette with paint blobs and a brush (reference 2).
4. **Build:** a code window with `</>` and a gear (reference 3).
5. **Launch:** keep the idea, but make the rocket round (3D).
6. **Orbit:** the particles around each picture should follow its shape,
   and there should be only a few of them.
7. **Arrival:** the section starts on the Discover picture, never the
   earth.

## Why today's pictures look flat

Each picture is SVG outlines filled with a dot grid. The four layers sit at
different depths, and each outline is copied a few times behind itself as a
"wall". So every part is a cut-out with straight sides, and its light is one
gradient across the whole part. Nothing curves. When the picture sways, you
see stacked cards turning, not objects. The references read as 3D because of
**curved surfaces and the light on them**: a bright side, a soft shadow side,
a highlight, and darker creases where parts touch.

The orbit is the globe's whole outer shell (28% of the particles, about
11.7k), stretched into a tall oval. It doesn't follow the picture, and it's
thick.

## The approach: real 3D shapes, dotted like the portrait

Each picture becomes a small 3D scene built in code from round building
blocks: spheres, tubes with round ends, rings (tori), rounded boxes, shapes
spun around an axis (the rocket's body), and thick rounded versions of flat
shapes (`</>`, the gear, the palette, stars). These are signed distance
functions (SDF): plain math, no meshes, no models, no downloads.

To turn a scene into particles:

1. **Same dot grid as now.** The portrait's even, staggered grid is laid
   over the picture, facing the camera. For each grid dot, a ray goes into
   the scene and stops at the first surface it hits. The dot sits **on that
   surface**, at its real depth. Only surfaces you can see get dots, so
   hidden parts don't shine through (the particles add up their light, so a
   hidden back would muddy the front).
2. **Light baked into each dot:**
   - a soft key light from the top left, the same direction as the globe's
     (clay looks soft, so the shadow side wraps and never goes black)
   - ambient occlusion: darker creases where parts meet, like the tube
     sitting in its mount
   - a specular highlight on glossy parts (the lens, the rings, the brush's
     metal band, the rocket's window)
   - a rim light on the edges in the palette's light rim colour, which
     echoes the globe's bright edge
3. **Parts stay apart.** A thin dark line runs where one part passes in
   front of another, so they don't merge.
4. **Motion.** A part's motion is packed into the brightness float, as now.
   Highlights and rim light use brightness above 1, which the shader turns
   into glow in the rim colour (bloom picks it up). **No new attributes**
   (still 11 of 16), and no new libraries.

The sway (±12°) and the mouse tilt now turn real 3D objects. The tube's
round side, the rocket's body and the paint blobs show their curves, and
the near parts slide against the far ones. That replaces v3's stacked
cards.

**Colour:** everything is still in the accent colour (all 7 palettes work).
The references separate parts by colour; here they're separated by
brightness, by the rim tone for highlight parts, and by the light. See open
decision 1.

The references are stock images. We draw our own versions of the ideas,
not copies of the artwork.

## The four pictures

Box: 1.9 × 2.4 world units, as now (it fits beside the steps at 16:10 and
narrower). No part thinner than about 0.09 units (4 dot spacings, ~5% of
the width). The references are chunky already, so that's easy to keep.

Brightness 0–1, in the accent unless the row says "rim tone".

### Discover: a telescope (reference 1)

| Part | Shape | Brightness |
|---|---|---|
| Tube | Tube pointing up and right at ~30°, its front turned ~25° toward you so the lens shows as an oval | 0.7 |
| End rings | Thick rounded rings on both ends, the front one bigger | 1.0 rim tone, glossy |
| Lens | Glass set into the front ring, slightly domed | 0.35, glossy glint |
| Mount | A curved yoke under the tube's middle, a round knob on its left, a collar below | 0.85 |
| Tripod | 3 thick legs spread out (one in front, two behind), round feet | 0.6, feet 0.8 |
| Stars | 2 puffy five-point stars (upper left, right of the lens) | rim tone, twinkle and bob |

### Design: a palette and a brush (reference 2)

| Part | Shape | Brightness |
|---|---|---|
| Palette | Thick bean shape with rounded edges and a thumb hole, tipped back ~35° so you see its top | 0.55 (dimmer, so the paint stands out) |
| Paint | 4 domed blobs on the palette | rim tone, 0.75–1.0 each (the brightness tells them apart), glossy |
| Handle | Long, slightly tapered round handle, upper right | 0.75 |
| Metal band | Short tube between the handle and the bristles | 1.0, glossy |
| Bristles | A tapered tuft with a dab of paint on its tip | 0.3, tip 0.9 rim tone |

The brush dabs gently (a small diagonal bob). The paint blobs catch the
shine sweep.

### Build: a code window, `</>` and a gear (reference 3)

| Part | Shape | Brightness |
|---|---|---|
| Window | Thick rounded slab with a raised edge and a sunken screen | 0.35, edge 0.5 |
| Window dots | 3 small domes at the top left | 0.9 rim tone |
| `<` `>` | Thick rounded strokes in front of the window's right half | 0.85 |
| Slash | A rounded slash between them | 1.0 rim tone |
| Gear | Thick gear with 8 rounded teeth, lower left, overlapping the window | 0.9 rim tone |
| Gear cap | A domed disc in the gear's centre | 1.0, glossy |

The gear **turns slowly** (one turn about every 16 s, a new "spin" motion).
`</>` hovers.

### Launch: the same rocket, now round

The composition stays as it is now (tilted 45°, trail down into the clouds,
stars). Only the build changes:

| Part | Shape | Brightness |
|---|---|---|
| Body | A profile spun around the axis: pointed nose, round body, slight taper | 0.85 |
| Nose tip and a band | A cap on the nose and a raised ring around the body (the ring shows the roundness at a glance) | 1.0 rim tone |
| Window | Domed glass in a thick round frame | glass 0.35 glossy, frame 1.0 |
| Fins | 3 rounded fins: 2 in profile, 1 facing you (edge-on) | 0.65 |
| Nozzle | A short flared bell | 0.5 |
| Flame | A soft teardrop | rim tone, flickers (as now) |
| Exhaust | The band of dots streaming into the clouds | flows (as now) |
| Clouds | Puffy 3D clouds (spheres blended together) | 0.45 |
| Stars | Puffy stars, as in Discover | twinkle |

## The orbit: a thin halo that follows the picture

- **Shape:** the picture's outline, pushed out by ~0.12 units (~25 px at
  1440×900) and smoothed, so it wraps the overall form. It goes around the
  tripod, not between its legs.
- **Few particles:** 2 thin strands, about 1,500 dots, an eighth of
  today's ~11.7k. The rest of the shell fades out as it pulls in.
- **Motion:** it dances with the same noise as the globe's shell (in and
  out, slowly), faint (~0.35), with a few brighter sparkles.
- **Morph:** the shell's particles move only a short way, from the shell
  around the globe to the halo around the picture. Between two pictures,
  the halo reshapes itself.

## Discover from the start

Today the earth forms as the section scrolls in, and Discover only appears
once the stage pins. New:

- Discover is set as the section starts to come in (its top at the
  screen's bottom). The particles are invisible there (opacity 0, coming
  from Work's faded cloud), so they assemble **straight into the telescope**.
  The earth never shows in this section.
- Scrolling back up into Work, it switches back to the globe while it's
  invisible, so the hero still has its earth.
- Landing on the section directly (reload, a `#process` link): the
  pictures are built Discover first, and the fly-in waits for it (under
  ~0.1 s), so it assembles into the telescope, not the earth.
- After Launch, the rocket still dissolves into About's portrait, as now.

## Phones and no WebGL

The SVG paths in `stepIcons.ts` can't draw the new 3D pictures, so:

- A script, `npm run step-art`, renders each scene from the **same code**
  into small images in `public/process/`, in grey, used as CSS masks over
  the accent colour (every palette works):
  - **Phones:** the step icons beside the steps become small, smoothly
    shaded 3D icons (2.5rem, rendered at 3×).
  - **No WebGL:** the dotted picture, still, where the globe would be.
- `pngjs` is already a dev dependency; nothing new to install. The images
  are committed. Rerun the script after changing a scene.

## How it's built

| File | Change |
|---|---|
| `src/lib/sdf.ts` (new) | Building blocks, joins, transforms; the ray, light, occlusion, outlines, dot grid and halo. Plain math (no DOM, no three.js), so it runs in a worker and in Node |
| `src/lib/stepScenes.ts` (new, replaces `stepIcons.ts`) | The 4 scenes: parts with shape, place, brightness, tone, gloss and motion |
| `src/components/canvas/stepArt.worker.ts` (new) | Builds the pictures off the main thread, Discover first, and hands each back as a buffer. Turbopack supports `new Worker(new URL(…, import.meta.url))`. If the worker fails, it falls back to building in idle-time slices |
| `particleShapes.ts` | `artShape` and the SVG canvas sampler removed |
| `shaders.ts` | New motions: spin (the gear) and orbit (the halo's dance). Brightness above 1 becomes glow. The shell no longer gets a stretched globe in the pictures: its particles have their own places (halo or hidden) |
| `ParticleMorph.tsx` | Worker instead of canvases; the shell joins the pictures; the fly-in waits for Discover when landing on the section |
| `ScrollFx.tsx` | Discover from the section's arrival; the globe again above it |
| `StepIcon.tsx`, `sections.css`, `mobile.css` | Images (masks) instead of SVG |
| `scripts/make-step-art.mjs` (new), `package.json` | The `step-art` script |

## Steps

0. **Shape sign-off (a gate; skipped last time, not this time).** Build
   `sdf.ts` and the 4 scenes, wire them into the particles with the dev keys
   (0–4), and send you screenshots on the real page at 1440×900, each next to
   its reference, plus frames at both ends of the sway. You approve or ask
   for changes before anything else. Changing a scene at this point means
   changing a few numbers.
1. Light polish: occlusion, highlights, rim glow, outlines, per-palette
   check (Violet's bloom of 1.4 is the one to watch).
2. Motions (spin, dab, twinkle, flicker, flow) and the orbit halo.
3. Discover from the start, including landing on the section directly.
4. The `step-art` script, phone icons, the no-WebGL picture; delete the old
   SVG paths.
5. Checks: lint, build; screenshots at 1440×900, 1024×768 and 390×844 for
   the arrival, each step, mid-morph and after Launch; Violet and Lime; no
   WebGL; reduced motion; software WebGL (6k particles); build time per
   picture in the worker; frame rate on this Mac (GPU headless, Iris Plus
   650).

## Risks, most serious first

1. **Thin parts at dot resolution:** tripod legs, bristles, gear teeth,
   the window's dots, the lens ring. Against it: the 0.09-unit minimum,
   chunky proportions as in the references, and the Step 0 gate. There are
   particles to spare (~30k usable, a picture needs ~6–9k), so the grid can
   be made finer (0.021 → 0.017) if the details need it.
2. **Parts merging in one colour.** The references use blue against orange;
   we have brightness, the rim tone, creases and outlines. If a part still
   merges, adjust its brightness at Step 0.
3. **Brightness.** Shadow sides are dimmer than today's flat fill, and
   highlights glow. Tune per palette.
4. **Build time.** Tracing rays is CPU work. My estimate is 50–150 ms per
   picture, not measured yet; it's measured in Step 5. It runs in a worker,
   so scrolling and the fly-in don't stutter. Software WebGL (6k particles)
   gets a coarser grid, as now.
5. **The halo could read as a sticker outline.** Against it: the gap,
   broken strands and the dance. If it still does, use the ring (open
   decision 2).
6. **Editing gets harder.** Today a Figma path can replace a part; after
   this, a scene is numbers in code (positions, radii, angles). That's the
   cost of real 3D without a 3D tool.

Not recommended: modelling the pictures in Blender or Spline, or buying the
reference icons as 3D files. It would look closer to the references, but
costs a download, a licence, a GPU read-back step, and every change would
need the 3D tool.

## Open decisions (defaults in brackets)

1. **Colour:** [accent and its light rim tone, parts told apart by
   brightness] or real colours like the references (blue, orange, yellow),
   which this section alone would keep whatever the accent picker says.
2. **Orbit:** [a thin halo that follows the picture's outline, 2 strands,
   ~1,500 dots] or a tilted ring around each picture, like a planet's ring.
3. **Phones:** [the telescope instead of the earth under the title, and
   small 3D-shaded icons beside the steps] or keep the earth on phones.
4. **Launch:** [the clouds and stars become puffy 3D too, to match the round
   rocket] or keep them as they are.
5. **Motion:** [stars twinkle and bob, the brush dabs, the gear turns,
   `</>` hovers, the flame flickers and the trail flows; the telescope holds
   still] or the telescope also pans slowly.

## Notes for whoever picks this up

- Pull first; the branch is worked on from more than one device.
- The user runs `next dev` on :3000; test against it, don't start another.
- Screenshots: Playwright from a scratch folder, with `--use-angle=metal`
  on macOS (real GPU) or `--use-angle=d3d11 --enable-gpu
  --ignore-gpu-blocklist` on Windows; `--use-angle=swiftshader` tests the
  6k-particle path.
- `AGENTS.md`: read `node_modules/next/dist/docs/` before Next-specific code
  (Next 16.4).
