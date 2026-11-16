# Plan: language switcher (English / Bahasa Indonesia)

Status: **all steps built** (2026-11-16, `feat/portfolio-home`), with the
default answers. `/id` is in Indonesian (Claude's draft in
`src/content/site.id.ts`, waiting for your review); `npm run i18n:check`
reports 292 of 292 lines covered. The fit check (step 3) found nothing to
change at 1440 or 390. Open: the language icons (SVG) you asked for later.

How step 1 came out, where it differs from the plan below:
- Indonesian isn't a second copy of the content: `site.id.ts` is a
  dictionary, English line → Indonesian line, applied over `site.ts` by
  `content/locale.ts`. Links, images and numbers can't drift, and changing
  an English line makes its translation show up in `npm run i18n:check`.
- Client components get their strings from one context
  (`ContentProvider`, set in the `[lang]` layout) instead of props, so
  `site.ts` no longer ships to the browser.
- Keeping the section on a switch only matters on phones: the desktop
  header scrolls away with the hero, so its button is used at the top.

## In one paragraph

The desktop header's GitHub button becomes a language button: **English**
(the default, at the URLs you have now) and **Bahasa Indonesia** (the same
pages under `/id`). The site has no translation support today and all copy is
English in `src/content/site.ts`, so this has three parts. First, the button
and its popover, built to look like the accent picker next to it. Second,
routing, so `/id` serves Indonesian pages, still as static HTML. Third, the
Indonesian copy itself, about 2,200 words. You lose no GitHub link: it's
still in the About section and the footer.

## What's there now

- `src/components/SiteHeader.tsx:20`: the GitHub `icon-btn`. On phones it is
  already hidden (`src/styles/mobile.css:133`), so phones have no free header
  slot. Their language switch has to go somewhere else (see the mock).
- GitHub is also in `socials` (`src/content/site.ts:35`), which About and the
  footer use, so taking it out of the header loses nothing.
- All copy is in `src/content/site.ts`: 758 lines, about 258 strings of
  prose, about 2,200 words, 29 `TODO:` placeholders. 28 files read it. 6 of
  them are client components: NavBar, MobileMenu, AccentPicker,
  PlaygroundTile, CopyEmail and DeviceStill.
- English is also hard-coded in a few places outside site.ts:
  - `layout.tsx`: `<html lang="en">`, "Skip to main content" and Open Graph
    `locale: "en_US"`
  - `Footer.tsx:10`: the date is formatted as `en-GB`
  - `SiteHeader.tsx:20`: the `aria-label="GitHub"` (removed with the button)
- Next 16.4.5 with `cacheComponents` on. Its own guide
  (`node_modules/next/dist/docs/01-app/02-guides/internationalization.md`)
  says to use `app/[lang]/` + `proxy.ts` + `next/root-params`. With Cache
  Components, `generateStaticParams` must list the languages or the build
  fails.

## What it looks like (mock)

Desktop header, right side:

```
now:     JULIANSYAH                          (●)  (GH)  [ Hire me ]

A (recommended), a button showing the current language that opens the
same frosted popover as the accent orb:

after:   JULIANSYAH                          (●)  (EN)  [ Hire me ]
                                                   ┌────────────────────┐
                                                   │ LANGUAGE           │
                                                   │ English          ✓ │
                                                   │ Bahasa Indonesia   │
                                                   └────────────────────┘

B, a two-part toggle with no popover (one click, but wider):

after:   JULIANSYAH                     (●)  [ EN | ID ]  [ Hire me ]
```

Phones: the GitHub button was already hidden there, so the switch goes in the
hamburger menu, above Hire me:

```
  Work          →
  About         →
  Playground    →
  Contact       →

  [ English | Bahasa Indonesia ]
  [          Hire me           ]
  [          Email me          ]
        <email address>
```

Details for both:
- The language names are always written in their own language ("English",
  "Bahasa Indonesia") with `lang` and `hreflang` set, so a screen reader
  reads each one correctly.
- The button's label is "Language: English" or "Bahasa: Indonesia".
- The options are real links (`<a href="/id">`), so they work without
  JavaScript and search engines find both versions.
- The popover behaves like the accent picker: Escape, a click outside or
  tabbing away closes it, and focus goes back to the button.

## How it works

**URLs**
- English stays at `/` and `/work/<slug>`. Nothing changes for links that
  are already out there or for search results. The old v1 redirects
  (`/about`, `/projects/:slug`…) keep working.
- Indonesian lives at `/id` and `/id/work/<slug>`, with the same slugs.
- `/en/...` redirects (308) to the address without `/en`, so each English
  page has one URL only.

**Routing** (the pattern from the Next guide)
- Everything under `src/app/` moves into `src/app/[lang]/`: layout, home
  page, `work/[slug]`, the OG images and studio. `sitemap.ts` and
  `robots.ts` stay at the root.
- The layout's `generateStaticParams` returns `en` and `id`, so both
  languages are prerendered as static HTML.
- New `src/proxy.ts`:
  - a path with no language → **rewrite** to `/en/...` (the visitor still
    sees `/`)
  - `/en/...` → redirect
  - `/id/...` → let it through
- The proxy's matcher skips `_next`, any file with an extension (logos,
  .apk, .glb, fonts), `sitemap.xml`, `robots.txt` and the OG image routes.

**Switching**
- Clicking a language saves the choice in a cookie and does a full page load
  to the other version.
- It adds the section you're looking at (`#work`, `#process`…), so you land
  on the same section, not back at the top.
- It doesn't keep the exact scroll position. Indonesian runs about 15–25%
  longer, so the same pixel offset would land somewhere else. The section is
  the honest equivalent.
- Full page load is on purpose. Changing `[lang]` remounts the whole page,
  3D canvas included, either way, and a clean load is the dependable path.

**Remembering the choice**
- A `lang` cookie, kept for a year. If a visitor who picked Indonesian opens
  an English link, the proxy sends them to the `/id` version.
- No automatic detection from the browser's language: English is the
  default, as you asked. It can be added later.

**Content**
- `site.ts` stays the English source with the same exports, plus one bundle
  export (`en`).
- New `src/content/site.id.ts` holds the Indonesian bundle, typed with the
  same `Content` type, so a missing key fails `tsc`.
  - Everything that isn't text (links, logos, images, slugs, numbers, icons)
    is reused from the English file, not copied, so the two can never
    disagree on a number.
- New `src/content/index.ts`:
  - `getContent()` reads `lang()` from `next/root-params` and returns the
    right bundle.
  - `localHref()` turns `/#work` into `/id#work` and `/work/x` into
    `/id/work/x`.
- Server components change one line each, from
  `import { hero } from "@/content/site"` to
  `const { hero } = await getContent()`.
- The 6 client components can't read root params, so their server parents
  pass in the strings they need as props. For example, SiteHeader passes
  them to NavBar, MobileMenu and AccentPicker.
- The helpers in `lib/projects.ts` take the current language's project list.
- New `npm run i18n:check` lists Indonesian strings that are still identical
  to the English ones, with an allowlist for names like Flutter or
  Presensi PKP. An untranslated line can't slip through.

**Also translated per language**
- `<html lang>` and the skip link
- the footer date (`id-ID`: "16 November 2026")
- page title and description
- Open Graph `locale: "id_ID"`
- `alternates.languages` (hreflang `en`, `id`, `x-default`), plus the same in
  the sitemap
- JSON-LD `jobTitle` and `description`
- the OG images (headline text)

## The Indonesian copy

About 2,200 words: the homepage sections plus the case studies.

- **Same claims:** every number and claim stays as it is in English. No new
  proof gets written in.
- **Names stay as they are:** project, client and product names don't
  change (Presensi PKP, Moondance Design System, the logo names).
- **Placeholders:** `TODO:` strings stay `TODO:`, so they remain visible and
  easy to grep.
- **Tech words:** the ones Indonesian developers use in English stay in
  English (Flutter, front-end, UI/UX, design system).
- **Your own lines:** copy you wrote yourself, like the hero headline, gets
  a draft translation that you approve or replace.

## Decisions (my default first)

1. **Desktop look:** A, the button + popover (matches the accent orb) / B,
   the EN | ID toggle.
2. **Phones:** a row in the menu / a second button in the header next to the
   orb (tight: logo, orb, Hire me, burger already share 390px).
3. **URLs:** `/` English + `/id` Indonesian / a `?lang=` query / no URL
   change. I don't recommend the last one: Google would only ever see
   English, and every section would ship both languages in its JavaScript.
4. **Remember the choice:** yes, with a cookie / no, the URL alone decides.
5. **Detect the browser's language on a first visit:** no / yes.
6. **Case studies:** translated too / homepage only (the case study pages
   stay English for everyone).
7. **Who writes the Indonesian:** I draft and you review section by section /
   you write it.
8. **Tone:** *saya / Anda* (professional, suits government and enterprise
   clients) / *aku / kamu* (casual).

## Steps (commit after each)

0. **Look.** Build the button, the popover and the menu row, not wired yet.
   Screenshots at 1440×900, 1024×768 and 390×844 (popover open and closed,
   menu open). Wait for your yes before going on.
1. **Routing and plumbing.**
   - Move the routes under `app/[lang]`, add the proxy, `getContent()`,
     `localHref()`, the client-component props, hreflang and the sitemap.
   - The Indonesian bundle is a copy of the English one for now, so the
     whole switch can be tested before any translation exists.
   - Moving the root layout may need one restart of your `next dev`.
2. **Indonesian copy.** Homepage sections first, then case studies.
   `i18n:check` comes back clean, then your review.
3. **Fit.** Indonesian is longer, so check every place where text is tight:
   - the nav pill and Hire me
   - the hero headline's line breaks
   - the dashboard mock
   - the proof labels, which must stay on one line
   - the How I work steps and the contact card

   Check at 1440, 1024 and 390, in both languages.

**Checks after each step**
- `npm run lint`, `tsc` and `npm run build`. The build output must show
  `/[lang]` prerendered for both `en` and `id`.
- Headless screenshots against your `next dev` on :3000. I won't start
  another one.
- URLs that must stay the same:
  - `/` and `/work/<slug>`
  - `/about`, `/projects/x` and `/contact` still redirect
  - `/en` redirects to `/`
  - `/id` renders
  - logos, APKs, .glb models, `sitemap.xml` and `robots.txt` don't pass
    through the proxy
- Keyboard: Tab to the button, Enter opens it, Escape closes it and focus
  goes back to the button.
- The page language changes in `<html lang>`.
- Reduced motion still works.
- LCP is no worse.

## Risks

- **It touches almost every section file.** Every route moves under
  `app/[lang]`, and about 22 files switch to `getContent()`. The change is
  mechanical, but it's wide, so step 1 is its own commit, with English in
  both languages.
- **Longer text.** Indonesian runs longer and the layout has tight spots.
  Step 3 covers them, and some labels may need shorter wording, not CSS
  changes.
- **OG images.** Their internal URLs get a language prefix. The proxy must
  not bounce them through the `/en` redirect.
- **The proxy runs on every page request.** It's tiny, and the pages stay
  static. It would stop working if the site ever moved to
  `output: "export"`, which it doesn't use today.
- **The studio tool** moves to `app/[lang]/studio`. It is still a 404 in
  production.

## Files

New:
- `src/proxy.ts`
- `src/content/index.ts`
- `src/content/site.id.ts`
- `src/components/LanguagePicker.tsx`
- `scripts/i18n-check.mjs`

Moved into `src/app/[lang]/`:
- `layout.tsx`
- `page.tsx`
- `opengraph-image.tsx`
- `work/[slug]/*`
- `studio/page.tsx`

Changed:
- `SiteHeader.tsx` (GitHub out, picker in)
- `MobileMenu.tsx` (language row)
- `site.ts` (`nav.language` strings, `en` bundle)
- `types.ts` (`Locale`, `Content`)
- `lib/projects.ts`
- `lib/jsonLd.ts`
- `sitemap.ts`
- `Footer.tsx` (date format)
- `components.css` and `mobile.css` (picker styles, reusing the accent
  popover's frost)
- every component that reads `@/content/site`
- `package.json` (the `i18n:check` script)
