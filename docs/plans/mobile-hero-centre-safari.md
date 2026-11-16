# Mobile hero: text centred, card down to the screen's edge in Safari

Scope: ≤ 900px (phones and tablets). Desktop untouched. CSS only, in the hero
block of `src/styles/mobile.css`.

## 1. The text block in the middle

Today the text starts right under the header (padding-top 5.75rem) and the
space between the buttons and the card is empty (on 768×1024 the text ends at
374px and the card starts at 933px).

Change: the text block (greeting, title, intro, buttons) sits in the middle
of the space between the header and the dashboard card:
`.hero-copy { padding-top: 4rem (the header); padding-bottom: 0; margin-block: auto }`,
`.hero-frame-wrap { margin-top: 0 }`.

Mocked (CSS injected in-page), greeting top / buttons bottom:

| Screen | Today | Centred |
| --- | --- | --- |
| 360×740 | 92 / 480 | 163 / 550 |
| 430×932 | 92 / 410 | 293 / 612 |
| 768×1024 | 92 / 374 | 358 / 639 |

The globe doesn't move. On tablets its top edge passes just behind the
buttons; on phones it stays below them.

## 2. Safari's see-through bottom bar (user's iPhone screenshot)

Cause: the 3D layer is fixed to the whole screen, including under Safari's
translucent bottom bar, but the hero's stage is `100svh` (the small viewport),
which ends at the top of that bar. So the card stops above the bar and the
globe shows under it.

Change (≤ 900px):
- `.intro-stage { height: 100lvh }`: the stage reaches the screen's bottom
  edge, under the bar, like the 3D layer.
- `--peek: calc(5.6875rem + 100lvh - 100svh)`: the card's visible part grows
  by the bar's height, so the logos stay above the bar and the card carries on
  underneath it to the edge.
- `.proof-layer { bottom: calc(100lvh - 100svh) }`: the track-record rows keep
  their current place above the bar.
- Hide the sample tiles (`.hero-frame .mock-tiles`) and give the card's inner
  panel enough height to reach past the screen's edge, so what shows through
  the bar is plain dark card, not blurred "3.8%" / "4m 12s" tiles. (You
  asked for only the logo slide on mobile.)

On Android Chrome the same units fix the gap that opens at the bottom when its
address bar hides while you scroll the hero. Where both units are equal
(desktop, tablets without bars) nothing changes.

Mocked with a stand-in 84px bar, since a desktop browser can't reproduce
Safari's bar: today the card stops above the bar and the globe shows
through; fixed, the card runs under the bar to the edge.

## 3. Checks
- Lint, build.
- Screenshots at 360×740, 390×844, 430×932, 768×1024 (+ the stand-in Safari
  bar), mid-scroll of the hero → proof, reduced motion.
- Desktop hero identical (element rects before/after).
- Real iPhone: you check, as Safari's bar can't be emulated here.

## Built (2026-11-16, user said "go")

The user's screenshots showed both Safari styles: iOS 26's floating see-through
bar, and an older Safari's opaque bottom bar.

- `.intro { --chrome-bar: calc(100lvh - 100svh) }` holds the bar allowance
  (a test can set it to 84px to stand in for Safari). Stage 100lvh, peek
  `5.6875rem + --chrome-bar`, `.proof-layer { bottom: var(--chrome-bar) }`.
- Text centring: padding 5.75rem / 1.75rem (the 1.75rem gap on each side of
  the 4rem header) + `margin-block: auto`, so reduced motion keeps its top gap.
- Tiles hidden; the card's inner panel `min-height: calc(var(--peek) * 2)` so
  the bottom fade starts below the visible part. Reduced motion (card shown
  whole): no min-height, no fade (reduced-motion.css).

Measured: text gaps above/below equal at 360×740 (99/99), 390×844 (162/162),
430×932 (229/229), 768×1024 (294/294). Stand-in 84px bar at 390×844: logos
end at 744, bar starts at 760, card runs to 844; proof rows end at 677. Desktop
1440×900 / 1280×800 hero identical. Older Safari (opaque bar): while the bar
shows, the card runs behind it; when it shrinks on scroll, there's card down to
the edge instead of a gap.
