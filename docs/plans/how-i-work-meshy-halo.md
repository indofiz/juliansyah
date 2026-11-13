# Plan: a meshy haze instead of the line halo (How I work)

Status: **built** (2026-11-13, `feat/portfolio-home`), with the defaults for
all four open decisions, after `522fee1`.

Changed while building: the shader now skips all picture work (the four
pictures, their motions, the haze's wander) while no picture is showing,
which is most of the page. The wander is worked out once per particle, not
once per picture.

Checked: lint, build; each step at 1440×900 (2× crops), 1024×768 with the
pointer at both sides (clear of the copy and the step track), a phone,
Violet, software WebGL (720 specks), mid-morph; production worker. Frame
rate on the production build: 60 fps on most runs, but this Mac was under
heavy load (load average 10–14), and the dips showed on the hero globe too,
so those runs don't measure the change. Not checked: an idle-machine frame
rate run, a real phone.

## What you asked

The particles around each step picture read as a line (two thin dotted
strands). They should look "meshy", like the About section ("From Design to
Production, Under One Roof.").

## What "meshy" is in About

The portrait has no outline. Its edges break up: the shoulders thin out into
loose, scattered dots, and a faint dust sits just outside the head. Dots are
densest at the shape and fewer the further out you go, at random, never in
lines. That's the look to copy.

A rough mock (Node, not the real shader; the page adds bloom and motion)
of today's halo next to the haze, on the real telescope and palette dots:
`/private/tmp/claude-501/-Users-macbook-PROJECT-react-js-juliansyah/70db9b49-a473-49a6-a085-8c69ca288c59/scratchpad/mock-sheet.png`

## The change

| | Today: line halo | New: haze |
|---|---|---|
| Shape | 2 strands following the outline 0.10 and 0.15 units out, with gaps | Specks scattered around the outline, densest right at the edge, thinning out to ~0.22 units |
| Placement | On the strands | Random, no lines, no pattern of gaps |
| Brightness | ~0.3, a few sparkles | Brighter near the edge, fading outward (0.45 → 0.06), 3% brighter specks |
| Dots | Soft, small | Soft and small, like the portrait's dust |
| Depth | Flat (±0.04) | Spread ±0.12, so it reads as a cloud when the picture turns |
| Particles | ~1,500 | ~2,200 (scattered dots look lighter than lines); still a fifth of the globe's old shell |
| Motion | The strands wave in and out | Each speck drifts slowly on its own and glimmers |

The haze hugs each picture closely: around the telescope and its stars,
around the tripod (not filled in between its legs) and around the brush and
palette. The picture's own dots don't change. The haze starts just outside
them, so the picture keeps its crisp edge.

The footprint stays about the old halo's, whose outer strand plus its
movement reached ~0.2 units. So the haze stays clear of the copy and the
step track in the middle layout, as the halo does.

Transitions work as now: the globe's outer shell pulls in a short way to
become the haze, and between steps the haze moves to the next picture's
outline.

## How it's built

| File | Change |
|---|---|
| `src/lib/sdf.ts` | `haloPoints` becomes `hazePoints`: the same distance from the picture's outline (the distance transform already there), then specks picked at random with density falling off with distance; returns x, y, z and brightness |
| `src/lib/stepScenes.ts` | Uses `hazePoints`; `HALO_DOTS` 1,500 → `HAZE_DOTS` 2,200 (at most 12% of the particles, so phones and software WebGL get fewer) |
| `src/components/canvas/shaders.ts` | The "orbit" motion becomes a drift: each speck wanders a little on slow noise and glimmers, instead of the strands moving in and out |

No new attributes, no new files. The phone icons and the no-WebGL images
have no halo, so they don't change. On phones the telescope under the title
gets the haze too, from the same data.

## Steps

1. `hazePoints` and the drift; tune falloff, reach and brightness with the
   dev keys (0–4).
2. Screenshots: each step at 1440×900 and 1024×768 with the pointer at both
   sides (clear of the copy and the step track), a phone, Violet and Lime,
   software WebGL (6k particles), mid-morph between steps. Frame rate on
   the production build.

## Risks

1. **Dust, not mesh.** Too sparse reads as dirt on the screen, too dense as
   a blur. Against it: the falloff is tuned on the page, and you see
   screenshots before I commit.
2. **A soft edge.** If the haze starts too close, the picture looks blurred.
   It starts just outside the picture's dots (~0.012 units).
3. **Brightness.** The particles add up their light, so dense specks right
   at the edge brighten it. The haze is faint where it's dense.
4. **Low:** cost. It's the same particles as the halo (they're already
   drawn), with one noise sample each, as the halo has now.

## Open decisions (defaults in brackets)

1. **Density:** [~2,200 specks] or lighter (~1,500, today's count) or
   denser (~3,500).
2. **Reach:** [tight, ~0.22 units, hugging the shape] or a looser cloud
   (~0.35). At 1024×768 the looser cloud would reach the copy and the step
   track.
3. **Motion:** [slow drift and glimmer] or still.
4. **The pictures' own bottom edge:** [unchanged] or fading into specks like
   the portrait's shoulders (the tripod's feet, the clouds under the rocket).
