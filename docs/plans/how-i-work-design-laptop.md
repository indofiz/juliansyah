# Plan: Design step becomes a laptop with a design app (How I work)

Status: **superseded at "go"** (2026-11-13). With the "go" came a second,
simpler reference: a UI/UX design window (a window with a title bar and
three dots, a panel with "UI/UX", an "AX" type tile, an image tile, a "T"
text tool with selection handles and a pen):
`/private/tmp/claude-501/-Users-macbook-PROJECT-react-js-juliansyah/70db9b49-a473-49a6-a085-8c69ca288c59/images/5.png`.
It was built instead (`designWindow` in `lib/stepScenes.ts`): about six
chunky objects, nearly square, the same clay-icon family as the other
pictures, so it reads far better as dots than the laptop scene below. Kept
from this plan: the shape sign-off, the "float" motion (the tiles bob at
their own pace) and the dab (the pen). Not needed: the colour wheel
`pattern` and the laptop-only phone icon. Not pushed (asked to hold).

Built and checked (2026-11-13): lint, build; the shape signed off on the
page next to the reference; title-bar dots made bigger and the slash in
"UI/UX" given more room after sign-off; phone icon and no-WebGL image
re-rendered (`npm run step-art`); 1024×768 with the pointer at both sides
(clear of the copy and the step track); Violet and Lime; morphs in and out;
production worker (Design ready 0.67 s after the scene starts, Discover
still first at 0.35 s).

The laptop plan, for reference:

## What you asked

Replace the Design picture (palette and brush) with the reference: a laptop
running a design app, with an eyedropper on a colour wheel, a cursor,
floating tool windows, a toggle, a phone wireframe and a pencil. It fits
the step's copy ("Wireframes first, then Figma screens built on a design
system…") better than a palette.

Reference image (yours):
`/private/tmp/claude-501/-Users-macbook-PROJECT-react-js-juliansyah/70db9b49-a473-49a6-a085-8c69ca288c59/images/4.jpg`

## The problem to solve first

The reference is landscape (4:3) and busy: about ten objects and a lot of
small UI detail. Our picture box is **portrait** (1.8 × 2.4 globe radii, the
middle column), and particles show big round forms well and fine detail
poorly. Copied as is, the laptop would be width-bound at ~1.35 tall, and
the small parts (slider knobs, title-bar icons, single keys, the ruler)
would blur into noise.

So the plan **re-arranges it as a portrait** and **keeps the parts that
read at dot size**, made chunkier.

## The picture

Portrait layout, top to bottom:

```
   [colour panel]   (toggle)   [gradient window]      ← floating, behind
         ┌─────────────────────────────┐
  cursor │  [ ▢╳ ]   ─   ◎ wheel ← eyedropper           ← laptop screen
         │  ═══        ═══ sliders  │
         └─────────────────────────────┘
          ▤▤▤▤▤▤ keyboard ▤▤▤▤▤▤  trackpad               ← laptop base, 3/4 view
   [phone, lying flat]                 ✏ pencil         ← in front
```

| Part | Shape | Brightness (one accent colour) |
|---|---|---|
| **Laptop (the hero)** | Rounded screen with a thick bezel, tipped back a little; rounded base seen from slightly above, receding | Body and bezel in the light rim colour (white in the reference) |
| Screen | Sunken dark panel; an app window with a raised title bar and chunky − □ × | Screen dark (0.3), panels mid (0.55), title bar 0.7 |
| Left panel | Back-button chip, a wireframe image (a frame with a bold X), 3 text bars | Wireframe and bars bright, light colour |
| Right panel | A small square icon, 3 sliders (thick bars with round knobs), a colour wheel (thick donut) | See "the colour wheel" below |
| Keyboard | A raised grid of rounded keys (about 10 × 3, big enough to read as keys) and a trackpad | Keys mid accent, one dark key as in the reference |
| **Eyedropper** | Glass tube with a dark bulb, its tip on the colour wheel | Glass dim and glossy, bulb bright |
| **Cursor** | A puffy 3D arrow at the screen's left edge | Light colour, bright |
| Colour panel (top left) | A floating window: title bar, 3 sliders, a colour wheel | Frame light, bar accent |
| Gradient window (top right) | A floating window: a square with a gradient and a vertical slider | Gradient as a brightness sweep |
| Toggle (top middle) | A pill with a round knob | Pill light, knob accent |
| Phone (bottom left) | Lying flat, in perspective, with a mini wireframe on screen | Body light, screen accent |
| Pencil (bottom right) | Round body, sharpened tip, band and eraser | Body accent, tip and band light |

Left out by default (too small at dot size in a narrow box): the ruler strip
at the bottom and the small wireframe with selection handles on the right.
See open decision 1.

Every part follows the existing rule: nothing thinner than ~0.06 units
(the X, the text bars, the slider bars are drawn thick). Floating windows,
toggle and pencil sit at different depths, so they slide against the laptop
as the picture sways.

### The colour wheel without colour

The reference's rainbow can't show in one accent colour. Default: the donut's
**brightness sweeps around the ring** (dark to bright, like a conic gradient),
which still reads as a wheel. The same per-point brightness gives the
gradient window its square. This needs one small engine addition (below).

## How it's built

| File | Change |
|---|---|
| `src/lib/sdf.ts` | Materials can take a `pattern(x, y, z)`: a brightness multiplier at each hit point (the wheel's sweep, the gradient square). Used by the dots and the rendered images |
| `src/lib/stepScenes.ts` | `paletteAndBrush` is replaced by `laptopDesign`, with small builders reused inside it: `toolWindow` (frame, title bar, − □ ×), `slider`, `colourWheel`, `wireframeBox`, `keyGrid`. The eyedropper takes over the brush's "dab" direction. Parts can be marked for the small icon |
| `src/components/canvas/shaders.ts` | A new **float** motion: an object bobs gently at its own pace (phase from where it is), for the floating windows and the toggle. The existing hover is synced, so everything would bob together |
| `scripts/make-step-art.mjs` | The phone icon (40 px) draws only the parts marked for it: the laptop, the eyedropper and the cursor. The rest would be mush at that size. The no-WebGL picture draws everything |
| `public/process/design-*.png` | Re-rendered with `npm run step-art` |

The haze will wrap the laptop group more loosely for this picture (a larger
`smoothing`), so it doesn't outline each floating window separately and
look busy.

Motion (default): the eyedropper dabs at the wheel, the cursor hovers, the
floating windows and the toggle float, each at its own pace.

## Steps

0. **Shape sign-off (a gate, as for the first four pictures).** Build the
   scene and send you page screenshots next to the reference, at both ends of
   the sway. You approve, or ask for parts to be dropped, moved or resized,
   before the rest.
1. Motions (float, the eyedropper dab), haze smoothing for this picture,
   brightness per palette (Violet's bloom is the one to watch).
2. Phone icon (laptop only) and no-WebGL image; `npm run step-art`.
3. Checks: lint, build; Design at 1440×900 and 1024×768 with the pointer at
   both sides (clear of the copy and the step track); morphs into and out of
   Design; phone; Violet and Lime; software WebGL; worker build time.

## Risks, most serious first

1. **Busy instead of rich.** It's the densest picture by far. Against it:
   the portrait layout gives each object room, the laptop stays biggest and
   brightest, small parts are left out or made thick, and Step 0 is where
   to cut more.
2. **Screen detail at dot size.** At 1440×900 the screen is ~280 px wide,
   so its UI is drawn with ~4 px dots. The X, the bars and the wheel are
   bold enough; title-bar icons and slider knobs are the limit.
3. **Smaller laptop than the reference suggests.** In a portrait box with
   windows above and the phone and pencil below, the laptop is ~1.3 units
   wide (~280 px at 1440×900).
4. **Build time.** About 40 parts instead of ~10, so it takes longer to
   build: estimated under ~1 s in the worker, measured at Step 3. Design is
   built second, after Discover, so the arrival isn't affected.
5. **Brightness.** A big light-coloured laptop body adds a lot of light.
   Tune it at Step 0 (the body can drop to a mid value if it outshines the
   screen).

## Open decisions (defaults in brackets)

1. **Which parts:** [laptop, eyedropper, cursor, colour panel, gradient
   window, toggle, phone, pencil] or all of them (adding the ruler strip and
   the wireframe with handles) or a minimal set (laptop, eyedropper, cursor,
   one floating window).
2. **Colour wheel:** [smooth brightness sweep around the ring] or alternating
   segments in the accent and the light colour.
3. **Layout:** [portrait: windows above, phone and pencil below] or
   landscape like the reference (the whole picture smaller, ~1.35 tall).
4. **Light and dark:** [laptop body and window frames in the light colour,
   screen dark] or the other way round (body accent, screen UI light).
5. **Motion:** [eyedropper dabs, cursor hovers, windows and toggle float] or
   still.
