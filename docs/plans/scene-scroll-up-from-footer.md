# Plan: no frozen earth or telescope when scrolling back up

Status: **built** (2026-11-13, `feat/portfolio-home`): steps 1–3, with the
defaults for all three open decisions (step 4 not built).

Checked after the change (headless GPU Chrome on `next dev`): the freeze
probe at 1440×900, 1920×1080, 1280×720, 1024×1366, 900×1000, 820×1180 and
390×844, with wheel, trackpad swipe, fling, long fling to the top and
reduced motion: 15 runs, **no loop stop with a visible frame** (before: 1–2
in every run). Biggest change between two frames while wheeling or
swiping: 0.03–0.16 in opacity (before: 0.25 → 0). Long flings still change
up to ~0.7 between frames, because the scene really does sweep past How I
work at ~10,000 px/s. That's step 4's territory. Reduced-motion cuts are 1.0
by design. Settled views before/after at 1440×900 and 390×844 are the same,
except the bottom: the leftover earth behind the footer is gone (decision
1). The previous fix's checks still pass (arrival without the earth, four
step pictures, rocket → portrait, back up to the hero, reloads at
`#process` / `#contact`, reduced motion, dev keys). Lint, tsc, build.
Not checked: how the lag feels on a real trackpad or phone. The follow
rate is worked out from `scrub: 1`'s own ease, not tuned by eye.

## What you saw

1. Scrolling down: perfect.
2. Scrolling up from the footer: the earth behind Contact breaks apart, which
   is correct.
3. Then it gets stuck on screen like a glitch while the page keeps moving.
4. Sometimes the stuck thing is the telescope.

## What I reproduced (headless GPU Chrome against your `next dev` on :3000)

A probe records the scene every frame and, each time the render loop stops,
what the last drawn frame showed. That frame stays on the fixed canvas until
the particles come back.

| Run | Stuck on screen |
|---|---|
| 1440×900, mouse wheel up from the footer | half-dissolved earth (opacity 0.24) at the bottom of the screen, from Testimonials up to Playground |
| 1440×900, fast fling up | almost whole earth (0.82) over Testimonials |
| 1440×900, long fling to the top | the same, then the **telescope** (0.6) over the hero |
| 820×1180 and 900×1000 (≤ 900px layout), wheel | dissolving earth (0.11 to 0.2) |
| 820×1180, fling | almost whole earth (0.87) |
| 390×844 phone, fling | earth (0.59) |
| 390×844 phone, slow wheel or trackpad swipe | nothing: clean |
| 1440×900, reduced motion | **whole earth** (1.0), then **whole telescope** behind Work's title |

Frames: `/private/tmp/claude-501/-Users-macbook-PROJECT-react-js-juliansyah/2f320f9b-a48c-4c7d-aa6b-d000aaf0bb02/scratchpad/evidence.png`
(earth stuck over Playground, over Testimonials, telescope stuck behind
"Apps and sites I designed and built.").

## Why

Three faults in a row.

### 1. Nine timelines write to the same scene object

`src/components/ScrollScenes.tsx:83`: each pair of neighbouring sections
gets its own scrubbed timeline, and every one writes all the values
(opacity, morph, position, `pictures`…) of the one `sceneState`. That's only
safe if one timeline moves at a time. It breaks in two ways:

- **Overlapping ranges.** A transition runs while its section's top goes from
  the bottom of the screen to the top (line 71). When the section before it
  is shorter than the screen, two transitions run over the same scroll.
  Testimonials is 595px tall on a 900px screen, so its transition
  (scattered → scattered, a no-op) and Contact's overlap by 305px. In that
  stretch the later one overwrites Contact's every frame. Scrolling up, the
  scene drops from "earth breaking up, opacity 0.25" to "gone" in a single
  frame (measured at scrollY 8929 → 8831). Overlaps on every screen size:

  | Screen | Overlaps |
  |---|---|
  | every desktop size tried (1280×720 to 2560×1440) | testimonials ∩ contact 240–488px, contact ∩ footer 27–67px |
  | 1024×1366 | playground ∩ testimonials, testimonials ∩ contact 773px, contact ∩ footer 604px |
  | 820×1180, 768×1024, 900×1000 | about ∩ playground, playground ∩ testimonials, testimonials ∩ contact |
  | 390×844 | playground ∩ testimonials 65px |
  | 375×667 | none |

- **Lag.** `scrub: 1` (lines 68, 71) has each timeline catch up with the
  scrollbar over about a second. A fling crosses several sections within
  that second, so several timelines are still catching up at the same time,
  and the last one to write each frame wins. The scene jumps between
  sections: the earth at 0.85 one frame, gone the next; or How I work's
  telescope written while you're already over Work or the hero.

Scrolling down hides most of this: in the overlap the cloud stays faded
until Contact takes over, so the earth just appears a little late.

### 2. The render loop stops on whatever was drawn last

`src/components/canvas/Scene.tsx:116` (`LoopGate`) stops rendering as soon
as `sceneState.opacity` is 0.003 or less. Its comment assumes the fade was
gradual, so the last frame is empty. After a jump from (1), the last frame
drawn is a visible earth or telescope, and it stays frozen on the fixed
canvas while the page scrolls. That's the glitch.

Reduced motion shows it most: there the scene cuts between states on
purpose (`ScrollScenes.tsx:46`), so every cut from a visible state to a
hidden one freezes a full earth or telescope.

### 3. The footer transition never finishes

The footer's transition ends when the footer's top reaches the top of the
screen, which is below the bottom of the page. At the very bottom it's only
82% done (44% on a 1024×1366 tablet). So a faint earth (opacity ≈ 0.07)
stays behind the footer and the scene never stops rendering there. This
isn't the glitch, but it's the same kind of range bug, and the fix for (1)
handles it.

## The fix

### Step 1: never freeze a visible frame (`Scene.tsx`, LoopGate)

The loop stops only once a frame has actually been **drawn** with the
particles hidden. LoopGate records the opacity of the frame it renders, and
stops when both the current and the drawn opacity are ≤ 0.003. Whatever is
left on the canvas is then always the empty background. This alone ends
the freeze everywhere, reduced motion included. It's a few lines and
doesn't depend on step 2.

### Step 2: one writer for the scene (`ScrollScenes.tsx`)

Replace the nine timelines with one small resolver. `sceneKeyframes.ts`
keeps its format (keyframes, vias, `scroll` / `mobileScroll`, `mobile`
overrides), so the choreography doesn't change.

- **Ranges.** Each transition still gets a ScrollTrigger with today's
  start/end. It has no animation and is only used to measure, so refreshes,
  resizes, fonts and the 900px switch work as now. After each refresh the
  ranges are fixed up in page order:
  - a transition from a state to the same state (Testimonials: scattered →
    scattered) is dropped;
  - where two ranges overlap, both move to the middle of the overlap, so
    one ends where the next begins;
  - no range ends below the bottom of the page (step 3).
- **One lagging value.** A single "scene scroll" value follows the real
  scroll on the GSAP ticker, with a damped lag tuned to feel like today's
  `scrub: 1` (compared side by side). Each frame it finds the transition it's
  in, or the last one passed, blends that transition's states with today's
  eases (`power1.inOut` for two states, `sine.inOut` through vias), and
  writes `sceneState` once. A fling now plays the scene in page order, one
  consistent state per frame. It can't be in two sections at once.
- **Reduced motion.** Same resolver, no lag, and a cut when a section's top
  passes 55% of the screen, as today.
- **Landing mid-page** (reload, `#process`): the scene scroll starts at the
  real scroll, with no fly-through, so the intro still waits for the right
  picture.

Why not just patch the timelines: removing the lag (`scrub: true`) would
stop the fling fights but change the feel you said is perfect, and the
overlaps would still need fixing. One writer fixes both by construction.

### Step 3: the page's end (`ScrollScenes.tsx` ranges)

Transitions end at the bottom of the page at the latest. The footer's
"drifts up and fades" then finishes at the very bottom, and the render loop
stops there (saves battery). On tall tablets, Contact and the footer split
the last screen (meet in the middle).

### Step 4 (option, off by default): long jumps fade instead of fast-forwarding

After steps 1–3, a fast fling from the footer to the top plays every state
in order within about a second: earth → cloud → portrait → rocket or
telescope → hero earth. Nothing freezes and nothing is out of place, but it
is busy. If that still reads as a glitch to you: while the scene scroll is
more than about 2 screens behind the real scroll, the particles dim, then
come back on the destination's state.

## What stays the same

- `sceneKeyframes.ts` values (only comments change: how ranges and overlaps
  are resolved). Every settled view (hero, proof, How I work's arrival and
  four steps, rocket → portrait, About, Contact) should look identical.
- `ScrollFx` still picks the step picture from the step track. `pictures`
  still decides where a picture may show, and with one writer that rule
  can't be broken by a lagging timeline any more.
- Lenis, the hero intro, the pinned How I work track, the dev keys 1–4/0,
  QualityGovernor.
- Your uncommitted contact/About work: none of these files are in it, so the
  fix can be its own commit.

## Checks

- Freeze probe (scratchpad `frozen.mjs`): at 1440×900, 1920×1080, 1280×720,
  1024×1366, 900×1000, 820×1180 and 390×844, with wheel, trackpad swipe,
  fling, long fling to the top, and reduced motion. Pass = no loop stop with
  a visible last frame (today: 1–2 per run), and no frame-to-frame jump
  bigger than 0.1 in opacity or 0.25 in morph (today: 0.25 → 0 and
  0.85 → 0).
- Settled views before/after, side by side, at every section, plus the
  bottom (now fully faded).
- The previous fix's checks (`checks.mjs`): How I work arrival, steps,
  rocket → portrait, reloads at `#process` / `#contact`, dev keys.
- `npm run lint`, `tsc`, `npm run build`.
- Not checkable headless: how the lag feels on your trackpad and phone. You
  compare it against today.

## Open decisions (defaults in bold)

1. Bottom of the page: **the earth finishes fading behind the footer** (what
   `footer: hidden` intends), or keep a faint glow there on purpose
   (footer opacity ≈ 0.07 in the keyframe).
2. Long jumps (step 4): **off**, or on.
3. Overlaps: **meet in the middle**, or the later transition waits for the
   earlier one to finish (it then runs over a shorter stretch).
