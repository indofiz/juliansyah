# Plan: richer step illustrations (How I work), v3

Status: **built** (2026-11-13, `feat/portfolio-home`), with the defaults for
all five open decisions, after commit `ef2a482` (v2: four single icons, see
`how-i-work-step-shapes.md`).

Changed while building:

- **Tiny particles around the pictures, like the earth** (asked for at "go").
  The globe's dancing outer shell (its last 28% of particles) is no longer
  hidden in the pictures; it stays around them, 15% taller (the pictures are
  taller than the globe) but no wider, so it doesn't reach the step text. It
  is fainter across its face so it doesn't speckle the picture.
- **Discover:** the user in the lens is a simple head over shoulders, sitting
  fully inside the lens. A first try filled the lens edge to edge; the ring's
  gap cut the shoulders into an oval and the glint notched the head.
- **Design:** a painter's palette instead of three swatches, which read as
  "•••".
- **Build:** the check badge overlaps the window's corner less.
- Step 0 (sign-off on the drawings before any particle work) was skipped:
  the sampler and shader don't depend on the drawings, so changing a drawing
  after review still only means changing its paths.

Checked: lint, build, screenshots at 1440×900 and 1024×768 (each step,
mid-morph, after Launch), 390×844, Violet, no WebGL, reduced motion, software
WebGL (6k particles), and two frames 0.6 s apart for the motions. Not
checked: frame rate on the 2017 MacBook, Lighthouse.

## Why

v2 works and reads at a glance, but each step is one flat icon: it feels
too minimal. v3 turns each icon into a small illustration. The icon stays
the hero, with a scene around it that tells the step's story, in layers
at different depths, with light and small motions.

v1's risk still applies: particles show bold shapes well and fine detail
poorly. So the rule is the **hero stays as big and bold as now**. The extras
are secondary, dimmer and behind or around it, so if one of them blurs, the
picture still reads.

## The four illustrations

Depth is in world units (the icon is ~1.9 wide). Brightness is 0–1. The
hero is the object from v2.

### Discover: a magnifying glass over the scope

| Layer | Depth | What | Brightness |
|---|---|---|---|
| Back | −0.35 | The scope: a tall card with a folded corner, a title bar and 3 text bars | 0.4 |
| Hero | +0.2 | The magnifying glass, over the card's lower right | 1.0 |
| In the lens | +0.1 | A user (head and shoulders), plus a glint arc at the lens's top left | 0.8, glint 1.0 |
| Accents | +0.3 | 3 four-point sparkles | twinkle |

The glass hovers gently. Story: "a call about your users", "a written scope".

### Design: a pencil sketching an app screen

| Layer | Depth | What | Brightness |
|---|---|---|---|
| Back | −0.35 | A phone outline with a chunky wireframe: header bar, image block, 2 text bars, a pill button | 0.4–0.55 |
| Middle | 0 | A bold sketch line curving from the screen to the pencil's tip | 0.8 |
| Hero | +0.3 | The pencil, its tip on the line's end | 1.0 |
| Accents | +0.3 | A painter's palette (the design system), a sparkle | 0.95 → 0.6 |

The pencil moves a little as if writing. Story: "wireframes first",
"built on a design system".

### Build: a code window and `</>`

| Layer | Depth | What | Brightness |
|---|---|---|---|
| Back | −0.35 | An editor window: frame, title bar with 3 dots, 4 code lines (bars of different lengths and indents) | 0.4 |
| Back | −0.3 | A caret at the end of the last line | blinks |
| Hero | +0.3 | `</>`, over the window's lower half | 1.0 |
| Accents | +0.3 | A check badge at the top right: the test build passed | 0.9 |

`</>` hovers. Story: "built from the same design tokens, with test builds
along the way".

### Launch: a rocket lifting off

| Layer | Depth | What | Brightness |
|---|---|---|---|
| Hero | +0.2 | The rocket and its flame | 0.9, flame flickers |
| Trail | −0.1 | An exhaust stream flowing back from the nozzle | flows |
| Back | −0.35 | A puffy cloud bank at the bottom left, where the trail starts | 0.45 |
| Accents | +0.3 | 4–5 stars | twinkle |

The rocket shakes very slightly. Story: "release to the stores", "go-live".

## What makes them richer

1. **Layers at different depths.** The sway and the mouse turn them, so the
   back slides against the front (parallax). This is the biggest step from
   flat to 3D.
2. **Gaps between layers.** A back layer is cut away a little around
   everything in front of it, so each object gets a dark outline instead of
   merging into one blob. Illustrators use the same trick.
3. **Light.** Each part runs from lit at the top left to darker at the
   bottom right (a gradient), instead of one flat brightness. Glass and metal
   get a bright glint.
4. **The shine sweep.** The portrait's band of light crosses the
   illustration every ~5.5 s.
5. **Small motions.** Hover, twinkle, blink, flicker and flow. All run in
   the shader, with no JavaScript per frame.
6. **More room.** The drawing box becomes 100×125 instead of 100×100,
   matching the 1.9 × 2.4 space. The illustrations use the height the square
   icons left empty, so the hero stays about as big as now.

## How it's built

### Data: `src/lib/stepIcons.ts`

Each part gains a few optional fields:

```ts
type IconPart = {
  d: string;
  stroke?: number;
  shade?: number | [lit: number, dark: number]; // gradient, top left → bottom right
  layer?: "back" | "middle" | "front" | "accent"; // sets its depth
  motion?: "hover" | "twinkle" | "blink" | "flicker" | "flow";
  small?: boolean; // part of the small icon on phones
};
```

It's still one SVG source for the particles and the SVG versions.

### Sampler: `iconShape()` in `particleShapes.ts`

- Each layer is drawn on its own canvas. The layers in front are cut out of
  the ones behind, with the gap.
- Dots sit on the same halftone grid as now. Each dot's depth comes from its
  layer. Walls are full on the hero and thin on the back cards, which keeps
  the edges from glowing too much.
- A part's motion is packed into the brightness float
  (`w = brightness + 2 × motion`), so there are **no new attributes** (still
  11 of 16).

### Shader: `shaders.ts`

- Unpack motion and brightness per icon, before blending, so transitions
  stay clean.
- The motions:
  - **hover:** the part moves up and down together.
  - **twinkle:** brightness pulses, each dot at its own phase.
  - **blink:** on and off.
  - **flicker:** brightness noise plus a tiny jitter.
  - **flow:** dots slide back along the rocket's axis and fade at both ends.
    The direction comes from one uniform.
- The shine sweep also runs on the illustrations.
- With reduced motion it all stands still, as the rest of the scene does
  (frozen clock).

### SVG versions

- **Phones:** the small icons beside the steps show only the hero (`small`
  parts), so they stay clean at 40 px.
- **No WebGL (desktop):** the full illustration, still, with layers by
  opacity and gradients as SVG gradients.

## Steps

0. **Drawings first (sign-off).** I draw the 4 illustrations as SVG (the real
   source) and show them on a private preview page next to the current
   icons. You approve or change them before any particle work. Changing a
   drawing here is cheap.
1. Data model and sampler: layers, gaps, gradients, motion packing.
2. Shader: motions and shine. Tune depth, brightness and gaps with the dev
   keys (0–4).
3. SVG versions (phones: hero only; no WebGL: full).
4. Checks: lint, build, screenshots at 1440×900, 1024×768 and 390×844 per
   step and mid-morph, Violet and Lime palettes, no WebGL, reduced motion,
   software WebGL (6k particles). Frame rate on the 2017 MacBook if you can
   run it; it wasn't checked for v2 either.

## Risks, most serious first

1. **Busy instead of rich.** Three or four things per picture can read as
   clutter at dot resolution. Against it: the hero stays biggest and
   brightest, the back layers sit at ~40% with gaps around the front, and
   Step 0 is a sign-off on the drawings.
2. **Small details at the limit:** text bars, swatch dots, stars, the check
   mark, the caret. The rule is no detail under ~6% of the box, and only on
   secondary elements. If one blurs, the picture still reads.
3. **Brightness.** About twice today's lit dots (~15k of 42k, still fewer
   than the globe's ~27k land dots). Tune per layer. Violet (bloom 1.4) is
   now the palette to watch, not Lime.
4. **Cost.** The extra dots, plus a few operations per particle per icon for
   the motions. Fine on the RTX 3050; the MacBook needs a check.
5. **Busier transitions.** Richer pictures make a fuller cloud mid-morph.
6. **Low (checked):** no new attributes, the box stays 1.9 wide (no edge
   clipping), and phones look as they do now (their small icons keep only the
   hero).

Not recommended: 3D models from an icon pack (glTF). They'd look more
realistic, but they need downloads and licences, and sampling meshes brings
back v1's readability risk.

## Open decisions (defaults in brackets)

1. **Discover, in the lens:** [a user, head and shoulders] or the scope's
   lines magnified, or a `?`.
2. **Design:** [phone wireframe + pencil + sketch line + swatches] or the pen
   tool with Bézier handles (the designer's symbol).
3. **Build:** [code window + `</>` + check badge] or a laptop and a phone
   side by side (web and mobile).
4. **Launch:** [rocket + trail + clouds + stars] or add a small ringed
   planet.
5. **Motion:** [subtle loops: hover, twinkle, blink, flicker, flow] or still
   pictures with only the shine sweep.

## Notes for whoever picks this up

- Pull first; the branch is worked on from more than one device.
- If a `next dev` is already running on :3000, test against it.
- Screenshots: Playwright from a scratch folder, with Chromium's
  `--use-angle=d3d11 --enable-gpu --ignore-gpu-blocklist` on Windows (real
  GPU) or `--use-angle=metal` on macOS. `--use-angle=swiftshader` tests the
  6k-particle path.
- `AGENTS.md`: read `node_modules/next/dist/docs/` before Next-specific code
  (Next 16.4).
