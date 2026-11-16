# How I work (desktop): one step per scroll

Goal: on desktop, however fast someone scrolls, each step stays on screen
long enough to read it and to watch the 3D picture change.

## Today

- The section's track is 220vh with a sticky 100vh stage, so the steps own
  120vh of scroll: 1,080px at 1440×900, **270px per step**. One mouse-wheel
  notch moves ~90px (Lenis `wheelMultiplier: 0.9`), so 3 notches per step.
- Changing pictures is a 1.1s tween (`showStepIcon`, sceneState.ts) that
  heads straight for the newest target (`overwrite`), skipping the ones in
  between.
- Measured (headless, 1440×900, a quick burst of wheel events from Work):
  steps 2, 3 and 4 lit for **~360ms each**, then the page kept going
  **2,200px past** the end of the section into About. The pictures in
  between never finish forming, and the text can't be read.

## Mobile: is it normal that the 3D doesn't change? Yes, by design

On phones (≤ 900px) nothing pins. The particles form Discover's picture
under the title, and as the steps scroll up over it they dissolve towards
About's portrait (the `about` keyframe's `mobileScroll`). Each step carries
its own small picture, top right, which lights up with the step instead.
A changing 3D picture would sit behind the step text while fading out, so
you wouldn't see it change. Making it change on phones means pinning the
section there too (picture on top, steps changing below), which is a
separate redesign. Not in this plan; say if you want a plan for it.

## Plan: step-by-step scrolling (desktop only)

Inside the pinned section, each scroll gesture moves exactly one step, and
the next step can't start until the picture has finished changing.

### 1. A hook into Lenis — `src/components/SmoothScroll.tsx`, new `src/lib/scrollGate.ts`
Lenis has a `virtualScroll` option that sees every wheel event before it
scrolls. SmoothScroll passes it a function from `scrollGate.ts` that asks
whichever gate is registered (none by default, so nothing changes elsewhere).
`scrollGate.ts` also exposes the Lenis instance so the gate can call
`lenis.scrollTo`. Note: returning `false` from `virtualScroll` does not
cancel the wheel event in Lenis 1.3.27 (checked in `dist/lenis.mjs`), so the
gate calls `preventDefault()` itself, or the page would scroll natively.

### 2. The steps gate — `src/components/ScrollFx.tsx` (desktop context)
Registered only when the section pins (≥ 901px, no reduced motion).
- **Stops**: the middle of each step's 270px band, read live from the
  existing track ScrollTrigger (so resizes just work).
- **Entering**: a wheel event that would cross into the section from Work
  (or from About, scrolling up) is cut off at step 1 (or step 4), however
  big the flick.
- **Inside**: one gesture = one step. The gate cancels the wheel event and
  calls `lenis.scrollTo(next stop, { duration: ~0.9s, lock: true })`. The
  fill line, lit step and picture keep working off scroll position as
  today.
- **Busy until the picture is done**: further wheel events are swallowed
  until (a) the scroll has arrived, (b) the picture has finished morphing
  (`sceneState.icons[target]` ≈ 1), and (c) the wheel has been quiet for
  ~200ms, so a trackpad's coasting tail doesn't count as a second gesture.
  Result: at most one step per ~1.7s however hard you flick, and as long as
  you like when you stop. Constants at the top of the gate to tune.
- **Leaving**: scrolling down on step 4, or up on step 1, isn't gated: the
  page scrolls on normally into About (or back to Work).
- **Not gated** (they skip the gate on purpose): keyboard (arrows, Space,
  Page Down), dragging the scrollbar, nav links like "About", touch
  scrolling (e.g. iPad landscape, where Lenis leaves touch native), and
  reduced motion (no Lenis, nothing pins).

The trade-off: inside this one section the page decides the pace instead of
the wheel. That's what makes it work for fast scrollers, and it's held to one
section, with keyboard, scrollbar and links left alone.

### 3. Checks
- Lint, build.
- Headless 1440×900, logging the lit step and picture over time:
  - fast flick from Work: stops at step 1; repeated flicks: 2, 3, 4 in
    order, each held ≥ 1.5s with the picture fully formed; nothing skipped.
  - one wheel notch at a time: one step per notch.
  - upwards from About: 4, 3, 2, 1, then back to Work.
  - after step 4, scrolling continues normally into About.
  - Page Down and the "About" nav link go straight through.
- Screenshots of each step's picture at 1440×900.
- ≤ 900px and reduced motion behave exactly as before.

## Open decision (default in bold)

1. Pace: **step by step, as above (guaranteed)**, or a lighter version: a
   longer track (220vh → ~400vh), slower wheel inside the section, and a snap
   to the nearest step when the scroll stops. The lighter one feels freer but
   a hard flick can still skip steps.

## Built (2026-11-16, user said "go": step by step)

`src/lib/scrollGate.ts` (Lenis hook + registry), `src/lib/stepGate.ts` (the
gate, constants GLIDE 0.9s / QUIET 200ms / FORMED 0.98 / MAX_WAIT 3s),
wired in SmoothScroll (`virtualScroll: runScrollGate`) and ScrollFx (pinned
desktop context only). Measured headless at 1440×900:
- One hard flick per step from Work: lands at 4572, 4842, 5112, 5382 (the
  four stops) with each picture fully formed; the fifth flick leaves into About.
- Repeated hard flicks: steps in order, ~2.6s each (was ~0.36s), none skipped.
- Flicks up from About: caught at step 4, then 3, 2, 1, then back to Work.
- One notch at a time: one step per notch.
- Page Down: straight through (not gated).
- 390 and 900 wide, and reduced motion: wheel scrolls freely, as before.
