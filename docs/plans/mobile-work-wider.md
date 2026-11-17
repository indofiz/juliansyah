# Mobile Selected work: wider cards

Goal: on phones the work cards use more of the screen, so screenshots and
text are wider. Scope: ≤ 640px, where the cards stack one per row (641–1023px
shows two columns and stays as is). Desktop is untouched. CSS only, in the
phones block at the end of `src/styles/mobile.css`.

## Today (measured, 390px wide)

| | Left → right (px) | Width |
| --- | --- | --- |
| Page gutter (`--gutter`, 1.25rem) | 0 → 20, 370 → 390 | 20 each side |
| Cards (flagship and regular) | 20 → 370 | 350 |
| Flagship text (padding 20) | 40 → 350 | 310 |
| Regular card screenshot / text (padding 24) | 44 → 346 | 302 |

The text starts 40–44px from the screen edge, so it uses only 77–79% of the
screen.

## Steps

### 1. Cards closer to the screen edge
`.work-grid { margin-inline: calc(0.75rem - var(--gutter)); }` puts the
cards 12px from each edge (were 20). Only the cards move: the section title
keeps the 20px gutter every other section uses, so titles still line up as
you scroll. The calc holds 12px on every phone width (the gutter grows from
20 to 28px between 455 and 640px wide).

### 2. Less padding inside the cards
- Flagship: sides 1.25rem → 1rem (20 → 16px). Top and bottom unchanged.
- Regular cards: `.work-media` and `.work-body` sides 1.5rem → 1rem
  (24 → 16px). Top and bottom unchanged.

### Result

| | 360px wide | 390px wide |
| --- | --- | --- |
| Card | 320 → 336 | 350 → 366 |
| Flagship text | 280 → 304 | 310 → 334 (+8%) |
| Card screenshot / text | 272 → 304 | 302 → 334 (+11%) |
| Text inset from the screen edge | 40–44 → 28 | 40–44 → 28 |

The flagship phone (11rem) doesn't change size.

### 3. Checks
- `npm run lint`.
- Screenshots of the section at 360, 390 and 430 wide, plus 640 (the last
  width with one card per row) and 641 (two columns, should be unchanged).
- Desktop 1440×900 Work rects identical before and after.

## Decision (user said "go": default in bold, built 2026-11-16; measured exactly as projected, 641px+ and desktop identical)

How close to the edge: **12px cards with 16px padding (text 28px from the
edge)**, or 16px cards with 16px padding (text 32px from the edge, subtler).
