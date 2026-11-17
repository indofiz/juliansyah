# Plan: the earth comes back after How I work (contact, hero)

Status: **built** (2026-11-13, `feat/portfolio-home`), with the defaults for
both open decisions.

Checked after the change (headless GPU Chrome on `next dev`): Contact and the
bottom show the earth at 1440×900, 820×900 and 390×844; the hero is the
earth after wheeling back, a jump from the bottom and a fast fling (frames
during the fling show the earth at Proof); How I work unchanged (no earth
while it comes in, all four step pictures, rocket → portrait, rocket and
telescope again on the way up); reload at `#process` assembles the
telescope, at `#contact` the earth; reduced motion; dev keys 2 and 0 at the
hero; lint, tsc, build. Not checked: a real phone, a real trackpad.

## What you saw

1. Landing: the hero shows the earth. Correct.
2. Scrolling down: How I work's pictures and About's portrait work.
3. At the bottom, the globe behind Contact is a step picture (the telescope),
   not the earth.
4. Sometimes, after scrolling back to the top, the hero shows the telescope
   too.

## What I reproduced (headless GPU Chrome against your `next dev` on :3000)

| Run | Contact / bottom | Hero after going back up |
|---|---|---|
| 1440×900, wheel (Lenis) | **Launch rocket** behind the contact panel | earth |
| 820×900 (≤ 900px layout) | **telescope** | earth |
| 390×844 phone | **telescope** (its star and eyepiece above the footer) | earth |
| from the very bottom, jump to the top (Home key, `scrollTo(0)`) | | earth |
| from the bottom, one fast fling to the top | | earth |

So (3) is reproduced on every screen size: the rocket on desktop, the
telescope at ≤ 900px. (4) didn't happen in 5 headless runs, but the code has
two weaknesses that fit it (below), and the fix removes both.

Frames: `/private/tmp/claude-501/-Users-macbook-PROJECT-react-js-juliansyah/49ce771e-edad-4af6-8f80-ca2e3c26fbb8/scratchpad/zoom1.png`
(desktop hero / contact / hero again) and `.../scratchpad/zoom2.png` (phone).

## Why

### Contact: the picture is never switched off

- `src/components/ScrollFx.tsx:136` — the "arrival" trigger that turns the
  globe into a picture runs from How I work's top to
  `ScrollTrigger.maxScroll(window)` (line 139), i.e. **to the end of the
  page**. Only scrolling back above How I work brings the earth back.
- About hides that: its morph goes to 2 (the portrait), and from morph 1 up
  the "home" shape (globe or picture) doesn't show at all. Playground and
  Testimonials are a faded cloud. So nothing looks wrong until Contact.
- Contact re-forms "the globe" (`contact` keyframe, `morph: 0`,
  `src/lib/sceneKeyframes.ts:118`). In the shader the globe's home is
  `mix(globe, picture, picture weight)`, and the weight is still 1, so the
  held picture forms there:
  - desktop: the step track ended on Launch → **rocket**;
  - ≤ 900px: phones only ever show Discover → **telescope**.

### Hero: the way back to the earth is fragile

- **Timing.** Going up, the step track runs back to step 1, so the picture
  is the telescope again, and it turns into the earth with a 1.1 s tween
  (`src/lib/sceneState.ts:57`) that starts when How I work's top passes the
  bottom of the screen. The globe is visible again ~1,300 px higher (Proof).
  A fast trackpad flick covers that in a fraction of a second, so the hero
  can show the telescope still melting into the earth.
- **Edge-triggered.** The earth comes back only from callbacks at trigger
  edges (`onToggle`, line 140) and the step track's updates. GSAP fires
  `onToggle` only when a trigger's active state flips; a jump from past the
  end to before the start flips nothing. Today the step track's callback
  happens to cover that case; any other missed edge leaves the picture held
  over the hero until you scroll through How I work again.

## The fix: "may a picture show here" becomes part of the scroll choreography

Add one scene value, `pictures` (0 = the earth, 1 = the step picture), to
every keyframe in `sceneKeyframes.ts`. ScrollScenes already scrubs every
keyframe value from the scroll position, and each tween writes opacity,
morph and `pictures` **together**. So a frame you can see only carries a
picture where the keyframes say so. Hero, Proof and Contact get the earth
by construction, whatever the step callbacks did and however fast you
scroll.

| Section | `pictures` | Why it's safe |
|---|---|---|
| hero, proof, work | 0 | the earth |
| process | via 1: **1**, end: 1 | rises 0 → 1 in the first third, while opacity is still 0 (unseen) |
| about | 1 | the picture dissolves into the portrait, as now |
| playground, testimonials (`scattered`) | 0 | drops 1 → 0 while morph goes 2 → 1 and opacity → 0 (unseen) |
| contact | 0 | **the earth** behind the panel |
| footer (`hidden`) | 0 | |

The process `via[0]` must say `pictures: 1`. Without it, it would inherit
Work's 0 and ramp up in the visible third (the earth turning into the
telescope on screen).

### Code changes

1. **`src/lib/sceneState.ts`**: `pictures: 0` in `SceneValues` and
   `sceneState`. Icons start on Discover (`discover: 1`,
   `iconTarget: "discover"`), so a picture is always chosen and `pictures`
   decides whether it shows.
2. **`src/lib/sceneKeyframes.ts`**: `pictures` on every keyframe, `hidden`
   and `scattered`, as in the table. The type makes it required, so a new
   section can't forget it.
3. **`src/components/canvas/ParticleMorph.tsx`**
   - Line 324: weights become `icons × ready × pictures`. The atmosphere and
     tilt already follow those weights.
   - Line 230: the intro waits for a picture only if `pictures > 0.5`.
     Reloading at Contact then builds the earth at once, instead of waiting
     up to 2.5 s for the rocket.
   - Dev keys 1–4 (line 165): set a dev-only override so the pictures still
     show anywhere on the page; key 0 clears it.
4. **`src/components/ScrollFx.tsx`**: ScrollFx now only chooses **which**
   picture. The arrival trigger and the `null` state go away. Desktop:
   `ids[current]`, from the step track's own progress (above the track that
   is 0 → Discover). Phones and reduced motion: Discover. It runs in the
   track's own `onUpdate`/`onRefresh`, which fire on every progress change,
   jumps and refreshes included, so it doesn't depend on other triggers'
   timing. On a layout change the cleanup goes back to Discover.
5. Comments in ScrollFx, Process.tsx and sceneKeyframes describing "the
   globe comes back above the section" get updated.

### What stays the same

How I work and About look the same: Discover as the section comes in
(never the earth), a picture per step on desktop, the rocket (desktop) or
telescope (phones) dissolving into the portrait. The no-WebGL images,
reduced-motion cuts and step track are unchanged. Your uncommitted About,
Icon, site.ts and sections.css changes aren't touched.

### Side benefits

- On a fast scroll into How I work, the earth → telescope switch was also a
  1.1 s tween that could finish on screen. Now it's always done while
  hidden.
- Contact no longer runs the picture part of the shader (it's skipped when
  every weight is 0).

## Checks

- Same headless runs as above, before and after: contact and bottom show the
  earth at 1440×900, 820×900 and 390×844. The hero is the earth after
  wheeling back, after a jump from the bottom and after a fling, with frames
  every ~100 ms during the fling (no telescope in any frame).
- How I work unchanged: arrival frames (no earth while it comes in), each
  step's picture on desktop, rocket → portrait at About, phone telescope.
- Reload at `#process`: intro assembles into the telescope. Reload at
  `#contact`: intro assembles the earth.
- Reduced motion, dev keys 1–4/0, palette switch while at Contact.
- `npm run lint`, `npm run build`.

## Open decisions (defaults in bold)

1. Dev keys 1–4: **still show a picture anywhere** (dev-only override), or
   only inside How I work / About.
2. After Launch on desktop: **the rocket dissolves into the portrait (as
   now)**, or the earth comes back first.
