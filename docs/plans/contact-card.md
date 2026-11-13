# Plan: the contact card

Status: **built** (2026-11-13, `feat/portfolio-home`, not committed) with
every default. Waiting for your sign-off on the screenshots (Step 0).

What changed from the plan while building:

- The Bahasa line went into step 1 ("You send a few lines, in English or
  Bahasa Indonesia.") instead of a separate line under the guidance: same
  message, one line less.
- Reply time lives only in step 2 (no separate "Typical reply" fact).
- Contrast needed more than the card's own surface. Measured at many scroll
  positions (not only at rest), **the globe itself** passes behind the text
  while the panel scrolls in, and the frosted glass let 38% of it through.
  The panel tint went from 0.62 to **0.78** on every size. On ≤ 900px both
  glows got fixed sizes, because a glow sized in % of a tall panel sat behind
  the text.
- Phones: the address and Copy stack (they don't fit side by side at 390).
- Content you sent after "go": résumé (Google Drive), LinkedIn, Dribbble,
  and availability "taking projects now, open to remote work".
- "Copy" and "Copied" share one grid cell, so the button keeps one width
  (a min-width was 1–2px short and nudged the centred row).
- The "Book a call" placeholder note uses the quiet-link grey (#d5d2cf):
  in --muted it read 4.3:1 at 1024 while the globe passed.

Checked (headless Chrome against `next dev`): contrast for every text
element at many scroll positions with the real glow states (Ember, Lime,
Aqua at 1440 / 1024 / 390; earlier runs across all 7 palettes differed by at
most ~0.4), lowest 5.03:1; Copy allowed and denied with 0px movement at
390 / 820 / 1024 / 1440; selection fallback and touch/keyboard wording;
phone targets ≥ 44px; both mailto links pre-filled; tab order; reduced
motion; lint, tsc, build (backdrop-filter kept in the built CSS). Not
checked: a real phone, a real screen reader, every palette in the slow
scroll sweep.

Measured on your `next dev` (:3000) in headless Chrome at 1440×900, 1024×768
and 390×844. Screenshots:
`/private/tmp/claude-501/-Users-macbook-PROJECT-react-js-juliansyah/1bb1ea77-ed76-4276-affb-38c8d4fcf80d/scratchpad/shots/`.
Scripts in the same scratchpad: `contact.mjs` (screens), `contrast.mjs`
(worst-case contrast against the real glow behind the text), `copy.mjs`
(layout shift when Copy is pressed).

## In one paragraph

The card has a good headline and does one smart thing: it shows the address
next to a Copy button. But it doesn't answer what people worry about just
before they write to someone: *will I get an answer, when, is he free, what
do I write, what happens after I send it?* Its brightest button is the least
reliable one (a `mailto:` link, which does nothing on a computer without a
mail app set up), it gives two buttons that do the same thing, it
has a real accessibility failure on phones (text at 1.39:1 over the globe's
glow), and it only speaks to people who want a product built. The plan comes
in three parts: fix what's broken (Phase 1), turn the empty right half into a
"what to expect" card with your face, your availability and the next steps
(Phase 2), and optional extras such as WhatsApp for Indonesian clients
(Phase 3).

## What's there now

`src/components/sections/Contact.tsx`, `src/components/contact/CopyEmail.tsx`,
styles `src/styles/sections.css:1332–1440` and `src/styles/mobile.css:797–851`,
copy `src/content/site.ts:432–455`.

From top to bottom: a "Contact" badge, the title "Tell me what you're
building.", one line of guidance, the email address (a mailto link) with an
icon-only Copy button, then "Email me" (mailto, glowing) and "Book a call"
(placeholder), then three facts: Typical reply, Availability and Time zone.
The globe rises behind the frosted panel, and the corner glow slides to the
bottom as you scroll (`ScrollFx.tsx:159`).

## What I measured

| Check | 1440 | 1024 | 390 (phone) |
|---|---|---|---|
| Panel | 1280×587, content in the left 60%, **right 40% empty** | 921×476 | 350×644, centred, long |
| Worst text contrast (WCAG asks ≥ 4.5:1) | "Availability" label **3.13:1** | — | "Time zone" **1.39:1**, its value **2.59:1**, "Availability" **3.06:1**, "Typical reply" **3.79:1** |
| Tap targets | Email me 44 tall | Copy **41×29** | Email me **40** tall, address link **20** tall |
| Press Copy | no shift | — | **buttons jump down 28–30px**, under the thumb |
| Copy fails | "Press Ctrl+C or ⌘C" | — | same text on a phone, which **has no keyboard** |
| Facts row | wraps to 2 + 1 (looks unfinished) | 2 + 1 | stacked, centred |
| mailto links | 2 in the card, 2 more in the footer one screen down | | |
| Placeholders | Book a call, Typical reply, Availability | | |

Why the contrast fails: `.cta-glow-bottom` reaches full opacity when the
panel is centred (the scrub ends at `center 45%`). On phones the facts are
stacked at the bottom of the panel, right on top of the glow's brightest
point (background around rgb 186,145,97 behind the time zone). The glow
changes with the palette, and Lime and Aqua are lighter than Ember, so
some palettes will be worse.

## Who reaches this card

There are two ways to arrive. Some people **scroll the whole page** and are
already convinced, so they just need the action. Others **jump here from
"Let's Work Together"** in the hero or "Contact" in the nav. They have seen
almost none of the proof, so the card has to reassure them by itself.

| Who | What they're thinking | What they need here | Served today? |
|---|---|---|---|
| **Indonesian agency PM or government IT staff** (like your real clients: Pemkot, Pijar, Alindo, Kreasindo) | "Is he free for this project? Can I just message him?" | A quick channel (WhatsApp is the default for business in Indonesia), availability, and to know they can write in Bahasa | Email only, availability is a TODO |
| **Founder or product lead abroad** | "Will a freelancer in Indonesia answer? When? How much do our hours overlap? What do I even write?" | Reply time, time zone, what happens next, an easy first message | Time zone yes. Reply time TODO, no next steps, blank email |
| **Recruiter or hiring manager** | "Is he open to a role? Where's the CV or LinkedIn?" | Résumé, LinkedIn, whether he's open to roles | No. "Tell me what you're building" doesn't speak to them, and the résumé is only in the footer (TODO) |
| **Fellow dev or designer** (Moondance design system users) | "I want to say hi or give feedback, nothing formal" | A low-pressure channel, GitHub | Email works, the rest is in the footer |

The feelings at the moment of writing, which are what the card should answer:

1. **"Will anyone answer, and when?"** Reply time.
2. **"Is he even available?"** Availability.
3. **"What do I write?"** Fear of a blank page.
4. **"I clicked Email me and nothing happened."** The mailto failed silently.
5. **"Who will I talk to?"** No face. Is this one person or an agency?
6. **"What happens after I send it?"** Next steps.

## What the research says

- **Say when people will hear back, for every channel, including the time
  zone**, then keep that promise. Most people expect an email or form reply
  within 24 hours (NN/g, *Contact Us pages*, guideline 12).
- **Offer more than one channel. A form adds to email, it never replaces
  it.** People don't trust forms because they lose control and don't know
  whether or when they'll get an answer. If you do use a form, keep it to 3–5
  fields (NN/g, guidelines 1, 7, 8).
- **mailto links fail silently** when no mail app is set up, which is common
  for people who use Gmail in the browser. The standard fix is a visible
  address with a Copy button (Seibert Group, CSS-Tricks, Mozilla bug 986350).
- **WhatsApp is the main business channel in Indonesia.** In MEF's 2026
  Consumer Survey, 74% chose it for messages from companies and 93% for chats
  with people.
- **Say what comes next and give a timeline.** It lowers anxiety at the
  moment of committing (NN/g, transparency in *4 principles to reduce
  cognitive load*; confirmation-state guidance from form-design write-ups).
  Clients mostly fear scope creep, missed deadlines and poor communication,
  so a visible process helps.

Sources are listed at the end.

## What's wrong, most important first

1. **Contrast fails on phones** (WCAG 1.4.3). Text you can't read is the
   worst problem.
2. **The primary action is the least reliable one.** On a computer "Email
   me" often does nothing, and the Copy fallback looks secondary
   (icon only, and smaller).
3. **Two actions do the same thing.** The address and "Email me" both open
   mail, and the footer has two more mailto links. People wonder whether
   they're different (Hick's law: more options of equal weight make the
   choice slower).
4. **Nothing answers their worries.** Reply time and availability are
   placeholders, and nothing says what happens next. In production the
   placeholder "Book a call" looks like a button but isn't one.
5. **It speaks to one audience.** Recruiters and peers have no path.
6. **No local channel**, while most of your real clients are Indonesian.
7. **The email opens blank**, even though the card's own text says exactly
   what to write.
8. **The layout looks unfinished.** The right 40% is empty (main had art
   there), and the facts wrap 2 + 1.
9. **Phones:** pressing Copy moves the buttons, the copy-failed message
   mentions keyboard keys, and tap targets are 40px (Apple asks for 44,
   Material for 48).
10. **No person.** The About card has your photo, but the moment of contact
    has no face.

What already works and stays: the headline, the guidance line, the visible
address with Copy, the `role="status"` announcement, the `dl` facts,
`aria-labelledby`, reduced motion, and the globe rising behind frosted glass
as the page's closing scene.

## The plan

### Phase 0: content only you can give (nothing is made up)

These stay visible `TODO:` placeholders until you replace them:

| What | Where |
|---|---|
| Typical reply (e.g. "within one working day") | `site.ts:441` |
| Availability (e.g. "taking new projects from January 2027") | `site.ts:442` |
| Booking link (Cal.com or Calendly), or "no call button" | `site.ts:439` |
| LinkedIn URL (for the recruiter line) | `site.ts:19` |
| Résumé PDF | `site.ts:480` |
| WhatsApp number, if you want WhatsApp (Phase 3) | new |
| Domain (then a `hello@domain` address looks more established than Gmail) | `site.ts:15` |

### Phase 1: fix what's broken (small, no layout change)

1. **Contrast.** Keep all card text at ≥ 4.5:1 at the glow's peak, at
   every size and in **all 7 palettes**. On ≤ 640px the glow becomes
   smaller and sits lower (below the last line of text), and a soft dark
   wash runs under the text. On desktop the facts move off the glow's
   hottest spot (Phase 2 gives them their own surface anyway). Check it with
   `contrast.mjs` for every palette.
2. **Pre-filled email.** `mailto:` gets a subject and a three-line body
   taken from the card's own guidance: *What I'm building / Who it's for /
   When I need it*. The template lives in `site.ts`. The visitor never faces
   a blank email.
3. **Copy becomes a real button, with no jump.** The button gets a visible
   "Copy" label and a fixed width, and "Copy" turns into "Copied ✓" inside
   the button itself. The status text stays for screen readers but takes no
   space. If copying fails, the address is selected and the message depends
   on the device: on touch screens "Address selected, copy it from the
   menu", with a keyboard "Press ⌘C / Ctrl+C". The accessible name
   "Copy email address" still contains the visible "Copy" (WCAG 2.5.3).
4. **Tap targets.** On touch screens (`pointer: coarse`): buttons 48px tall,
   Copy at least 44×44, and the address link padded to 44px tall.
5. **The "Book a call" placeholder** shows as a plain note, not a fake
   button. It stays visible as a TODO, per the content rules.
6. **Facts row:** three equal columns on desktop, so the row no longer
   wraps 2 + 1.

### Phase 2: rebuild the card as "Start" | "What to expect"

Desktop (≥ 901px): two columns. Left is **what you do**. Right is **what
you'll get**, which fills the empty half and answers the six feelings above.

```
┌──────────────────────────────────────────────────────────────────────────┐
│ ✉ Contact                                                                │
│                                          ┌─────────────────────────────┐ │
│ Tell me what                             │ (photo) Juliansyah          │ │
│ you're building.                         │ ● TODO: availability        │ │
│                                          │─────────────────────────────│ │
│ One email is enough to start: what       │ What happens next           │ │
│ you're making, who it's for and when     │ 1  You send a few lines     │ │
│ you need it.                             │ 2  I reply with questions,  │ │
│                                          │    within TODO: reply time  │ │
│ [ ✈ Email me ]  [ 🗓 Book a call ]        │ 3  A short call, then a     │ │
│                                          │    written scope before     │ │
│ juliansyah.ekt17@gmail.com  [ Copy ]     │    any work starts          │ │
│                                          │─────────────────────────────│ │
│ Hiring for a role? Résumé · LinkedIn     │ ⌖ Pangkalpinang · UTC+7     │ │
│                                          └─────────────────────────────┘ │
└─────────────────────────────── the globe rises ──────────────────────────┘
```

- **Left column:** badge, title (two lines), guidance, then **one primary
  action** ("Email me", pre-filled) with the secondary next to it ("Book a
  call", or WhatsApp in Phase 3), then the address with Copy underneath as
  the fallback for webmail users. The address stays large but is no longer
  the biggest thing in the action area. Last comes a quiet line for
  recruiters: *"Hiring for a role? Résumé · LinkedIn"*.
- **Right column, the "reply card":** your photo (the About avatar, already
  cached) and name, an availability line with a softly pulsing dot (still
  with reduced motion), **What happens next** as an `<ol>` of three steps
  taken from How I work's Discover step ("a written scope before any work
  starts" is copy you already accepted), then the time zone. Reply time
  sits inside step 2, where it means the most.
- **Surface:** a translucent dark fill **without its own blur**, because
  the panel behind it is already blurred and a second blur would cost GPU
  time every frame over the WebGL canvas. That fill also fixes the facts'
  contrast for good.
- **Columns:** `minmax(0, 1.25fr) minmax(19rem, 0.75fr)`, centred
  vertically. They still fit at 1024 (about 560 + 330).

Phones (≤ 900px): one column.

```
┌──────────────────────────┐
│        ✉ Contact         │
│  Tell me what you're     │
│        building.         │
│  One email is enough …   │
│ [      ✈ Email me      ] │  48px
│ [    🗓 Book a call     ] │
│ juliansyah.ekt17@… [Copy]│
│ ┌──────────────────────┐ │
│ │ (o) Juliansyah       │ │  left-aligned
│ │ ● TODO: availability │ │  inside the card
│ │ 1 You send a few …   │ │
│ │ 2 I reply within …   │ │
│ │ 3 A short call, …    │ │
│ │ ⌖ Pangkalpinang UTC+7│ │
│ └──────────────────────┘ │
│ Hiring? Résumé·LinkedIn  │
└──────────────────────────┘
```

The top block stays centred, like every other section header on phones. The
reply card is left-aligned, because centred lists are hard to scan.

**Motion:** keep the corner-to-bottom glow scrub. The reply card fades up
a beat after the copy (the existing `data-reveal`), and the availability dot
pulses. With reduced motion everything is static. No new libraries.

**Step 0, a sign-off gate (as before):** build the layout with your real
and TODO content, plus one preview-only screenshot with the TODOs filled in
with sample text so you can see the finished look. The sample text never
ships. You approve at 1440, 1024 and 390 before any polish.

### Phase 3: optional extras (pick any)

| | What | Why | Default |
|---|---|---|---|
| A | **WhatsApp** button (`wa.me/<number>?text=` with a pre-filled first message), brand mark drawn like the Flutter logo | It's the channel most Indonesian clients expect (74% in MEF 2026) | **Off** until you give a number. Note that a public number attracts spam |
| B | One line: *"Bahasa Indonesia is fine too."* | Tells local clients they don't have to write in English | **On** |
| C | **Brief chips** above the button: New app · Redesign · Join your team · Just saying hi. They change the email's subject and body, and "Join your team" brings up the résumé and LinkedIn | An easy first click, and each audience picks its own path | Off (try it later if enquiries are vague) |
| D | "Open in Gmail / Outlook" menu on the Email button (desktop) | Webmail users skip copying | Off (Copy covers this) |
| E | "It's 14:32 in Pangkalpinang" line | Helps people abroad picture the overlap | Off (you dropped the clock from About) |
| F | Footer: remove its two extra mailto links | Less repetition, one screen apart | Off (outside this card) |

## Copy (goes in `site.ts`, `contact` block)

Kept as is: badge, title, guidance line, "Email me".

New, **my draft for you to edit**:

- Mail subject: `Project enquiry via juliansyah.com`
- Mail body: `Hi Juliansyah,\n\nWhat I'm building:\nWho it's for:\nWhen I need it:\n\n`
- Copy button: `Copy` → `Copied`. If copying fails: touch `Address selected. Copy it from the menu.`, keyboard `Address selected. Press ⌘C or Ctrl+C.`
- Reply card heading: `What happens next`
- Steps: `You send a few lines` · `I reply with questions, within {reply}` · `A short call, then a written scope before any work starts`
- Recruiter line: `Hiring for a role?` + `Résumé` + `LinkedIn`
- (B) `Bahasa Indonesia is fine too.`

The unused `contact.form` block (`site.ts:445–454`, a mailto form that was
never built) is removed, or reused if you pick C.

## Files

- `src/components/sections/Contact.tsx`: two columns, reply card,
  recruiter line
- `src/components/contact/CopyEmail.tsx`: in-button state, selection
  fallback, wording by device, no layout shift
- `src/content/site.ts` and `src/content/types.ts`: mail template, steps,
  recruiter line, optional WhatsApp and Bahasa line
- `src/styles/sections.css` and `src/styles/mobile.css`: grid, reply card,
  glow position and size, tap targets
- `src/components/ScrollFx.tsx`: only if the glow's scrub end has to move
  for contrast
- `src/components/ui/Icon.tsx`: WhatsApp mark (only with A)

## Checks after each phase

- `npm run lint`, `npm run build`, `tsc`
- Screenshots at 1440×900, 1024×768 and 390×844, including the scroll
  into the section and the hand-off to the footer
- `contrast.mjs` at the glow's peak in **all 7 palettes**: body text
  ≥ 4.5:1, title ≥ 3:1
- `copy.mjs`: 0px shift with copying allowed and with copying denied, on
  phone and desktop
- Tap targets ≥ 44px with a touch pointer
- Keyboard order: Email me → secondary → address → Copy → Résumé →
  LinkedIn, with visible focus throughout
- Screen reader names: the Copy announcement, the steps as a list, the
  facts as a `dl`
- Reduced motion (no pulse, glow static) and no-JS (every link still works)
- Lighthouse accessibility stays at 100, and the page weight barely
  changes (the avatar is already cached)

Not covered by these checks: a real phone, a real screen reader.

## Open decisions (saying "go" takes the defaults)

1. **Layout:** two columns "Start | What to expect" (**default**), or keep
   one column with the reply card under the buttons.
2. **Book a call:** keep the visible placeholder until you have a link
   (**default**, per the content rules), or drop the button.
3. **WhatsApp:** off until you give a number (**default**).
4. **Recruiter line:** on (**default**). Résumé and LinkedIn stay TODO
   until you fill them.
5. **Bahasa line:** on (**default**).
6. **Brief chips (C), Gmail menu (D), local time (E), footer tidy (F):**
   off (**default**).

## Sources

- NN/g, Contact Us pages: https://www.nngroup.com/articles/contact-us-pages/
- NN/g, 4 principles to reduce cognitive load: https://nngroup.com/articles/4-principles-reduce-cognitive-load
- Seibert Group, Why mailto links should be avoided: https://seibert.group/blog/en/why-mailto-links-should-be-avoided-on-websites/
- CSS-Tricks, on mailto links: https://css-tricks.com/?p=319511
- Mozilla bug 986350 (mailto with no mail app): https://bugzilla.mozilla.org/show_bug.cgi?id=986350
- MEF Consumer Survey 2026, WhatsApp in Indonesia: https://mobileecosystemforum.com/2026/06/26/mef-data-whatsapp-is-clear-winner-in-indonesia-but-spam-is-of-growing-concern/
- Fueler, freelance portfolio that converts (process transparency): https://fueler.io/blog/how-to-build-a-freelance-portfolio-that-converts-visitors-into-clients
- Form confirmation and next steps: https://www.platoforms.com/blog/invisible-friction-form-design/
