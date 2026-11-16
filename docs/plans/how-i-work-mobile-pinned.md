# How I work on phones: the 3D changes with each step

Goal: on phones (≤ 900px wide), scrolling through How I work changes the 3D
picture step by step, as on desktop: telescope → UI/UX window → code
window → rocket.

## Why it doesn't change today

Nothing pins on phones. The particles form Discover's telescope under the
title, and `ScrollFx` always shows Discover there (`ids[0]`). As the steps
scroll up over it, About's transition (`about.mobileScroll`, starting at
the section's top) dissolves and dims it, so by step 2 it's fading behind
the step text. Each step has its own small icon instead.

## Measured today (390×844)

Header 64 · badge 28 · title 75 (2 lines) · intro text 74 · steps 109 / 109
/ 109 / 90 · buttons 40.

## Plan: pin the section on phones, one step on screen at a time

```
┌──────────────────────────┐
│ ☰ header                 │
│ (How I work)             │
│ From First Sketch        │
│ to Live App.             │
│ No hand-off between …    │
│                          │
│        3D picture        │  ← changes with the step
│                          │
│ ━━━━━━━━━░░░░░░░░░░░░░░  │  ← progress, fills as you scroll
│ Step 02                  │
│ Design                   │  ← only the current step; the next
│ Wireframes first, …      │    one fades in as you scroll
│ [Start a project] [See…] │
└──────────────────────────┘
```

### 1. Layout — `src/styles/mobile.css`
- The track becomes ~100vh + 4 × 50vh tall with a sticky 100svh stage, as on desktop.
- The stage is a column: header (badge, title, intro text), the picture's
  space (takes the leftover height), the step panel, then the buttons side by side.
- The four steps share one spot; only the lit step shows (fade + small rise).
  The vertical step track turns into a horizontal progress bar over the panel.
- The small per-step icons go (the big picture does their job now).

### 2. The picture — `src/lib/sceneKeyframes.ts`, `mobile.css`
- Mobile `process` keyframe: centre and size set to the picture's space
  (about 45vh, scale ~0.85, measured at 360×740 / 390×844 / 430×932). The
  two arrival `via`s move with it (final y − 1.33 and − 0.67, as now).
- About's transition on phones starts when the pin ends, not at the section's
  top (drop `about.mobileScroll` and the `via` dimming), so the picture stays
  whole while you're on the steps.

### 3. Behaviour — `src/components/ScrollFx.tsx`
- The step track uses the pinned range on phones too, and phones show the lit
  step's picture (`ids[current]`, not always Discover).
- The fill drives a `--fill` value, so CSS uses it as height (desktop) or width (phones).
- **Snap**: when a swipe ends, the page settles on the nearest step (ScrollTrigger
  `snap`). Touch stays native: a fast swipe can pass a step, but always lands
  on one, and the picture morphs to it. (Desktop's wheel gate stays wheel-only.)

### 4. Kept as today
- Reduced motion on phones: no pin, every step listed and lit, icons beside them.
- Short screens (under 700px tall: iPhone SE, phones in landscape): today's
  list layout. The pinned layout needs ~710px.
- Without WebGL: the lit step's image shows in the picture's space.
- Desktop: unchanged.

### 5. Checks
- Lint, build.
- Screenshots of each step at 360×740, 390×844, 430×932, 768×1024
  (touch emulation, swiping): right picture, panel text readable, nothing clipped.
- Swipes: slow (one step at a time), fast (lands on a step), and back up.
- About's portrait still forms after the pin; reduced motion and a 375×667
  phone keep the list layout.

## Open decisions (defaults in bold)

1. Swipe: **free swipe + snap to the nearest step**, or one step per swipe
   (taking over touch scrolling, like desktop's wheel; riskier on iPhone Safari).
2. Under 700px tall: **keep today's list layout**, or pin there too and drop
   the intro text to make room.

## Built (2026-11-16, user said "go": defaults)

Changed from the plan while building:
- **Pin from 600px tall, not 700.** Real phones are shorter than their screens:
  an iPhone 13/14 in Safari with its bars showing is ~390×664, so a 700px cut
  would have left most iPhones on the old list. `PHONE_PIN` =
  `(max-width: 900px) and (min-height: 600px)`. Under 700px tall the badge
  hides so the picture fits.
- Picture: mobile `process` keyframe y −0.07 (centre 53.5%), scale 0.75; vias
  −1.4 / −0.74. The list layout's `--globe-cy` / `--globe-r` follow.
- `about.mobileScroll` became `listScroll` (only phones that don't pin);
  ScrollScenes and ScrollFx read `PHONE_PIN`.
- Snap: not plain nearest/directional (a swipe entering just past step 1
  skipped to step 2). `snapStep`: move to the next step in the swipe's
  direction once 30% of the way there, else settle back.
- The wheel gate also runs on pinned phone widths (narrow desktop windows);
  touch is never gated.

Measured (headless, touch emulation): every step shows its own picture at
360×640, 390×664, 390×844, 430×932, 768×1024; picture space centre within
~10px of the particles' centre. Swipes: entering stops on step 1, a short
swipe moves one step, a fast swipe can pass one but lands on a step, swiping
on from step 4 leaves into About, where the rocket dissolves into the
portrait. 375×580, 844×390 and reduced motion keep the list. Desktop fill
and wheel gate unchanged (stops 4572 / 4842 / 5112 / 5382).

Not checkable here: real iOS Safari (toolbar resizing, momentum + snap) —
test on a phone.
