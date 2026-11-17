# Plan: floating WhatsApp chat button

Status: **built** (2026-11-16, `feat/portfolio-home`, not committed) with
the default answers. Step 0 was done on the real button instead of a mock:
at 1440, 1024, 768 and 390, at the hero, How I work, About, Contact and the
page end, no text sits under it. One overlap, as expected: on phones it
sits on the right end of the hero's logo strip (logos only, they scroll
past). Decision 3's "after the hero" option removes that if you want.
Changed from the plan: the bubble is 54% of the circle (not 43%), closer
to the reference.

## In one paragraph

A round button sits in the bottom-right corner of every page (home and case
studies) on desktop, tablet and phone. It looks like your reference: a light
grey circle with a dark chat bubble and a smile. Tapping it opens WhatsApp to
your number with the first message already typed, the same as the "WhatsApp
me" button in Contact. It's a plain link, so it needs no JavaScript. Desktop
shows a small "Chat on WhatsApp" label on hover. Nothing else on the page
moves, except some extra space under the footer's last line so the button
never covers it.

## What's there now

- The number and the first message already exist:
  `src/content/site.ts:705` (`contact.whatsapp.number`, `.text`), and the
  Indonesian message is in `src/content/site.id.ts:315`. The button reuses
  them, so there's one place to change your number.
- `src/components/sections/Contact.tsx:51` builds the `wa.me` link inline.
  It moves into a small helper both buttons use (like `src/lib/mailto.ts`).
- Fixed layers today (`src/styles/tokens.css:86`): scene 0, page 1,
  header 40, nav pill 50, skip link 1000. Nothing else is fixed to the
  bottom of the screen on any size.
- Phones: the hamburger menu is a full-screen layer inside the header
  (z 40), and the accent swatches are a column on the right edge, centred
  vertically (`src/styles/mobile.css:174`). The new button goes under both
  (z 30), so the open menu covers it and nothing needs JavaScript to hide it.
- No `viewport-fit=cover` is set, so iPhone safe areas are already handled
  by Safari. The button still uses `env(safe-area-inset-bottom)` as a
  harmless guard.

## What it looks like (mock)

```
Desktop (1440×900)                         Phone (390×844)
┌──────────────────────────────────────┐   ┌──────────────────┐
│ JULIANSYAH   [ Work About … ]  (●)(EN)│   │ JULIANSYAH  (●) ≡│
│                                      │   │                  │
│              …page…                  │   │      …page…      │
│                                      │   │                  │
│                 ┌──────────────────┐ │   │                  │
│      (hover) →  │ Chat on WhatsApp │(☺)│   │              (☺) │
│                 └──────────────────┘ │   │                  │
└──────────────────────────────────────┘   └──────────────────┘
          24px from the right and bottom         16px from the edges
```

The button:
- Circle: light warm grey (`#d9d6d2`, close to your image and to the
  site's warm neutrals), soft drop shadow. It does **not** change with the
  accent picker (your image is neutral; see decision 1).
- Icon: drawn as inline SVG, a dark rounded-square bubble (`--surface-2`)
  with its tail at the bottom right and a light smile, like the reference.
- Size: 3.5rem. That's 56px on phones and tablets and at 1440 desktop; it
  scales with the desktop page like everything else (45px at 1024, never
  under 44px).
- Hover: lifts 2px and turns lighter. Pressed: shrinks a little. Keyboard
  focus: the site's usual focus ring.
- Arrives with a short fade and scale-in (0.4 s, after 0.8 s so it doesn't
  compete with the hero intro). Reduced motion: no animation, no lift.
- Desktop label: on hover or keyboard focus, a small dark pill reading
  "Chat on WhatsApp" slides in to its left. Phones and tablets don't hover,
  so they show the icon only; screen readers always hear the label.

What tapping does:
- **Phone:** the WhatsApp app opens a chat with you, the message already in
  the box; the visitor taps send.
- **Desktop:** a new tab opens WhatsApp's page, which hands over to
  WhatsApp Desktop or WhatsApp Web. The portfolio stays open in its tab.
- English pages send the English message, `/id` pages the Indonesian one.

## Steps

### 0. Mock first (sign-off)
Headless screenshots with the button injected into your running dev server
(:3000, I won't start another): 1440×900, 1024×768, 768×1024 and 390×844, at
the hero, How I work (desktop pin), About, Contact and the page end, in Ember
plus one more accent. What I'll look for:
- **Phone hero:** the hero card's bottom edge is at about 826px on a
  390×844 screen, so the button (772–828px) probably sits on the right end
  of the logo strip. If that looks bad, decision 3 fixes it.
- **How I work on desktop:** the stage is pinned for 220vh. If a step's
  text ends in the bottom-right corner, the button would cover it for the
  whole pin.
- **Page end:** the footer's "Last updated" line (desktop, right) and the
  © line (phones, centred) are inside the button's area today.

### 1. Build
- `src/components/ChatButton.tsx` (new, server component, no client JS):
  `<a class="chat-fab" href=… target="_blank" rel="noopener noreferrer">`
  with the SVG and the label text inside, so the label is the link's name.
- `src/lib/whatsapp.ts` (new): `whatsappHref(number, text)`, used by
  `ChatButton` and `Contact.tsx`.
- `src/content/site.ts`: `contact.chat = { label: "Chat on WhatsApp" }`
  (comment says it reuses `contact.whatsapp`).
  `src/content/site.id.ts`: `"Chat on WhatsApp": "Chat lewat WhatsApp"`.
- `src/app/[lang]/page.tsx` and `src/app/[lang]/work/[slug]/page.tsx`:
  render `<ChatButton />` right after `<Footer />`, so it's the last stop
  when tabbing and the dev-only studio doesn't get it. It's never inside
  `.site-header`: the header's hide-on-scroll transform would trap a fixed
  child (the same reason the phone menu glass lives on `::before`).
- `src/styles/tokens.css`: `--z-chat: 30` in the layer list.
- `src/styles/components.css`: `.chat-fab` (size, colours, shadow, hover,
  focus, label pill, entrance), offsets 1.5rem; `≤ 640px` offsets 1rem.
- `src/styles/sections.css`: `.footer-bottom` gets extra bottom padding
  (button size + offset) so the last line clears the button.
- `src/styles/reduced-motion.css`: no entrance, no lift.

### 2. Checks
- `npm run lint`, `npm run build`, `npm run i18n:check`
- Screenshots at the four sizes, top, middle and end of the page, `/` and
  `/id`, a case study.
- Keyboard: Tab reaches it last, the focus ring shows, Enter opens it.
- The phone menu covers it; the accent swatches sit above it.
- Lighthouse accessibility stays at 100 on the home page.
- Link check: `https://wa.me/6283175087363?text=…` with the message encoded,
  English and Indonesian.
- **By hand, on your iPhone in Safari** (Playwright can't run WebKit on this
  Mac): the button clears Safari's bottom bar, both when the bar is
  expanded and when it's collapsed.

## Open decisions (defaults in bold)

1. **Look:** **your reference: grey circle, dark bubble** / circle in the
   accent colour (follows the palette picker) / WhatsApp green with the
   WhatsApp logo (says "WhatsApp" before anyone taps).
2. **Desktop hover label "Chat on WhatsApp": on** / off (icon only
   everywhere).
3. **When it shows: always, from the first screen** / only after the
   visitor scrolls past the hero (keeps the hero clean and clears the
   phone logo strip; about 20 lines of JavaScript) / also hidden while
   Contact is on screen (Contact has its own WhatsApp button).
4. **First message: the same three questions as Contact** / just "Hi
   Juliansyah, I found you through your portfolio." / empty.

Not planned: a pulse or bounce to draw attention (the page already has a lot
of motion), a chat window or popup on the site, analytics.
