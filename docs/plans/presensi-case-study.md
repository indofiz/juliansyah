# Presensi PKP: the full story (plan)

Status (2026-11-16): the user said "go" (all defaults). Questions 1–4 are still open, so those parts are `TODO:` placeholders.
- Steps 1–4 BUILT: copy and corrections, before/after, built with, store badges + rating, JSON-LD, homepage card, Screens gallery.
- Step 5 (tablet): see the status at the end of this file.
- Changes while building: the Screens block keeps the two-column layout of the other blocks (it looked better aligned than full width). The "anyone can sign for anyone" row was dropped from before/after because you never said it. The draft "why" for Clean Architecture is written from the code (Claude's wording), not your reason.

Goal: the Presensi card and case study tell the real story (paper sheets → minute-accurate attendance that pay is based on), name the engineering in **bold** (Clean Architecture, BLoC, Firebase), show the app on phone **and tablet**, and link to both stores with the real rating. Every claim is either yours or checked in the code, the app's own docs or the store pages. Nothing is invented; anything still unknown stays a visible `TODO:`.

---

## 1. Facts, and where each one comes from

| Fact | Source | Used for |
|---|---|---|
| The app replaced **paper** attendance sheets. Late arrivals could write an on-time arrival; some staff filled in the whole 5-day week at once. | You, 2026-11-16 | Title, problem, before/after |
| Now lateness and absence cut the employee's **"bonus"**, by how late or how many days absent. | You | Problem, result (official name to confirm: Q2) |
| Discovery = listening to **BKPSDMD** about the problem, then design, then development. | You; the App Store listing spells it **BKPSDMD** and says the app is published by Diskominfo and BKPSDMD, which also creates every account | Process |
| **Clean Architecture**: every feature is split into `data / domain / presentation`; `Either<Failure, T>` everywhere; GetIt DI. | presensi-mobile `lib/features/*`, `CLAUDE.md` | Role, stack, decision |
| **BLoC**: 5 BLoCs (Auth, Events, History, Izin, Presensi) + 4 Cubits. | `CLAUDE.md`, `pubspec.yaml` (flutter_bloc 9) | Role, stack |
| **Firebase**: Crashlytics, Performance Monitoring (HTTP interceptor + traces), Analytics (`check_in`, `check_out`, `izin_submit`, `notification_view`), Cloud Messaging + local notifications. | `pubspec.yaml`, `lib/core/services/*`, `lib/core/network/performance_interceptor.dart` | Role, stack, decision |
| Crashlytics, Android 1.0.8, 30 days to 2026-11-02: **99.89 % crash-free sessions**, 97.30 % crash-free users, 5,989 users. iOS: no fatal crash or ANR in 90 days. 1.0.9 fixed the top four (H1–H4). | `docs/bug-fixing/TOP_CRASHES_FIX_PLAN.md` | Metric (Q3), decision |
| **Phone + tablet**: iPad is a build target (`TARGETED_DEVICE_FAMILY = 1,2`), breakpoints compact / regular / tablet, `ResponsiveBody` caps the width on tablets, system text size clamped to 0.9–1.3×. 27 files use the responsive helpers. | `ios/Runner.xcodeproj`, `lib/core/extensions`, `lib/core/widgets/responsive_body.dart`, `lib/app.dart:184` | Role, decision, tablet visual |
| **Google Play: 4.5★ from 28 ratings**, 5K+ downloads, updated 3 Nov 2026. | Play page, checked 2026-11-16 | Rating line |
| **App Store: no rating shown yet** ("not enough ratings"). iPhone + iPad, iOS 15+, Productivity, 4+, version 1.0.9. | App Store page, checked 2026-11-16 | Store badge only, no stars |
| Store links: `apps.apple.com/us/app/presensi-kota-pangkalpinang/id6805311056`, `play.google.com/store/apps/details?id=id.go.pangkalpinangkota.presensipkp`. | You | Replaces the 2 link TODOs |
| 104 tests in 19 files (bloc_test, mocktail). Codemagic CI. Indonesian + English. | `test/`, `codemagic.yaml`, `lib/l10n` | Stack chips |
| Server time (AppClock), fake GPS refused (`isMocked`), geofence radius check, selfie at check-in, an attachment required on every leave request since 1.0.9, help desk button. | Code, `docs/deploy/RELEASE_NOTES.md` | Role list, decisions |
| Repo history: first commit **2026-04-03**, 168 commits, releases v1.0.5 → v1.0.9. | `git log` | Year conflict (Q1) |

## 2. Corrections to what the site says today

1. **"Replaced fingerprint machines"** (card title, case-study title, problem paragraph 1, and the OG image, which uses the title) → it replaced **paper sheets**.
2. **Decision "Cache for weak networks: Hive caching keeps the app responsive…"** is not true in the code: Hive only stores the notification inbox, and `CachedResponse` is never used. Removed, and replaced by a decision the code supports (§3.5).
3. **Year "2025"** vs a repo that starts in April 2026 (Q1).
4. Case-study metric **"TODO: confirm 99.9%"** → the real Crashlytics figure (Q3).

## 3. The story (draft copy: your facts, my wording; edit freely)

### 3.1 Title (card + case study + OG image)
- **A (default, smallest change):** "GPS-verified check-ins replaced paper sign-in sheets for a city government."
- B: "Attendance that can't be backdated, for 7,000+ civil servants."
- C: "From paper sign-in sheets to attendance recorded to the minute."

### 3.2 Summary
"The official attendance app for the Pangkalpinang city government. Civil servants check in with GPS and a selfie, request leave and review their history. Lateness is recorded to the minute, and BKPSDMD uses those records for the allowance." (The last sentence depends on Q2.)

### 3.3 The problem
1. "Attendance was signed on paper. Someone who arrived late could still write down an on-time arrival, and some staff filled in the whole five-day week in one go."
2. "That matters because pay depends on it: the [TPP allowance] is cut by how late someone is and how many days they miss. BKPSDMD needed records it could trust." (Q2)

### 3.4 Before / after (new block, right under the problem)
| Paper sheet | Presensi PKP |
|---|---|
| The time is whatever the person writes | The time comes from the server; changing the phone's clock does nothing |
| A whole week can be filled in at once | Each check-in happens on the day, inside the office geofence |
| Anyone can sign for anyone | A selfie at every check-in; fake GPS is refused |
| Lateness can't be measured | Lateness is counted to the minute and feeds the allowance cut (Q2) |

### 3.5 My role (bold where you asked)
Summary: "I built the app in **Flutter** for Android, iPhone and iPad, from one codebase." (+ "and designed it" if Q4 says so)
- **Clean Architecture** with **BLoC**: data, domain and presentation per feature
- **Firebase**: **Crashlytics**, **Performance Monitoring**, **Analytics** and **Cloud Messaging**
- Responsive layouts for **phones and tablets (iPad)**
- Check-in only inside the office geofence, on an OpenStreetMap view
- Fake-GPS and mock-location detection
- Photo capture at check-in as a second identity check
- Leave and permit requests with attachments
- Attendance history on a calendar
- Releases to Google Play and the App Store (draft: confirm it was you)
- `TODO: team size`

### 3.6 Process (your three steps)
1. **Discovery: listening to BKPSDMD.** "Sessions with BKPSDMD, the city's civil service agency, about what the paper sheets got wrong: late arrivals written as on time, and whole weeks filled in at once." + `TODO: who else took part and what they asked for`
2. **Design.** `TODO: what you designed (check-in, leave, history flows), in which tool, and who reviewed it`
3. **Development.** "Flutter with **Clean Architecture** and **BLoC**. **Firebase Crashlytics**, **Performance Monitoring**, **Analytics** and **Cloud Messaging** from the first release, so problems in the field show up on a dashboard. Released to Google Play and the App Store; version 1.0.9 fixed the four crashes Crashlytics ranked highest."

### 3.7 Key decisions
1. **Server time, not the phone's clock** (kept).
2. **Refuse fake GPS** (kept).
3. **Let Crashlytics set the priorities (new; replaces the caching claim).** "Every crash is ranked by how many people it hits. The top one, a Retry button on the location dialog that did nothing, reached up to 64 users in a month. Version 1.0.9 fixed the top four." Trade-off: "A rare Android 13 camera crash (2 users) waits for a later release."
4. **Clean Architecture with BLoC.** Draft why: "Each feature splits data, domain and presentation, so the attendance rules are tested without a device: 104 tests, BLoCs included." (Draft: confirm it's your reason.)
5. **Tablets get a bounded layout (new).** "On an iPad, content stops at a readable width instead of stretching edge to edge, and system text size is capped at 1.3× so large fonts can't break the check-in screen."

### 3.8 Result
Metrics:
- **7,000+** active employees
- **4.5★** on Google Play (28 ratings, November 2026)
- **99.89 %** crash-free sessions (Q3)
- **3**: Android, iPhone and iPad from one codebase

Text: "Attendance is recorded on the day, where people actually work, with lateness counted to the minute, and BKPSDMD bases the allowance cut on it." + `TODO: anything else that changed (time saved on recaps, disputes…)`

## 4. Page changes

### 4.1 Content model (`src/content/types.ts`, `site.ts`)
- **Bold in copy:** `**text**` inside case-study strings, rendered by a tiny `<Rich>` helper (split on `**`, no dependency; works with `Placeholder`).
- `CaseStudy.compare?: { before: { title; points[] }; after: { title; points[] } }`
- `CaseStudy.stack?: { group: string; items: string[] }[]`. Groups: Architecture (Clean Architecture, BLoC, GetIt), Firebase (Crashlytics, Performance Monitoring, Analytics, Cloud Messaging), Platforms (Android, iOS, iPadOS), Quality (104 tests, Codemagic CI).
- `Project.stores?: { appStore?: string; googlePlay?: string }` and `Project.rating?: { value; count; store; checked; href }`, with a comment saying when it was checked.

### 4.2 Case study page (`src/app/work/[slug]/page.tsx`)
New order: hero → The problem → **Before / after** → My role → Process → **Built with** → Key decisions → **Screens** → Result → Next project.
- **Hero:** under the facts, the two **official store badges** and one rating line: "★ 4.5 on Google Play · 28 ratings". The badges replace the old "Links" row, so they aren't repeated at the bottom.
- **Before / after:** two columns (paper | app), one on phones; the app side gets the accent.
- **Built with:** the stack groups as chips, with group names in bold.
- **Screens:** 6 real screens (check-in camera, success, map view, leave form, events, notifications) in the same studio phone (the frame PNG is shared and cached, ~10 KB), grid on desktop, swipe row on phones, all lazy. Plus the tablet (§4.4).
- **JSON-LD:** CreativeWork gains `about: MobileApplication` (name, operating systems, category, store URLs). **No `aggregateRating`:** Google's review-snippet rules don't allow ratings taken from another site.

### 4.3 Homepage card (`ProjectCard.tsx`)
- New title and summary.
- Next to "7,000+ active employees": a small "★ 4.5 Google Play" chip.
- A one-line stack under the metric: "**Clean Architecture · BLoC · Firebase**".
- No store badges on the card: it keeps one action, the case study.

### 4.4 Tablet visual
1. **presensi-mobile:** add `SHOT_DEVICE=tablet` to the screenshot tool (iPad 11", 834×1194 pt → 1668×2388 px, portrait), so it renders the app's real tablet layout with the same fake data. Done on a branch (`feature/portfolio-tablet-screenshots`), committed locally, **not pushed** until you say.
2. **/studio:** a third front, `tablet` (3:4-ish display, even bezel, front camera dot, no pill), and export its front still like the phone's.
3. **Case study:** the tablet sits behind the phone in the Screens block ("phone and tablet" in one picture). Not on the homepage card.

Cheaper alternative: a CSS tablet frame (like `BrowserFrame`). It would look less like the phone next to it.

### 4.5 Store badges
- Official artwork only, unmodified: Apple's black "Download on the App Store" (SVG from Apple's marketing tools) and Google's "Get it on Google Play" (from Google's badge page). English, because the site is in English.
- The Google Play file you sent is 135×40 px, so it would blur on 2× screens; I'll use the official full-size artwork. Both badges at the same height (Google asks for its badge to be no smaller than the others).
- Link names for screen readers: "Download Presensi Kota Pangkalpinang on the App Store" / "…on Google Play". Open in a new tab.

### 4.6 Homepage Track record (optional)
"99.9 % crash-free sessions" is still marked UNCONFIRMED. Presensi's Crashlytics shows 99.89 %, which rounds to 99.9 %. I can mark it confirmed, with a comment naming the source (Q8).

## 5. Steps (commit after each; push when you say)
0. **Answers.** Building can start before them; anything unanswered stays a `TODO:`.
1. **Content:** corrections (§2), the new copy (§3), `**bold**` + `<Rich>`, store links, rating, metrics.
2. **Case study blocks:** before/after, built with, badges + rating in the hero, JSON-LD.
3. **Homepage card:** title, summary, rating chip, stack line.
4. **Screens gallery:** export the 6 screens from presensi-mobile's `tool/screenshots/output/en` → WebP in `public/projects/presensi-pkp/screens/`.
5. **Tablet:** screenshot tool (presensi-mobile branch) → studio tablet → export → figure.
6. **Checks:**
   - `npm run lint` and `npm run build`
   - screenshots at 1440×900 and 390×844, in 2 accents and with reduced motion
   - heading order and alt text; badge links have names
   - bytes added to the homepage (target: the chip and stack line only, ~0 KB)
   - case-study Lighthouse run, compared with today's

## 6. Questions for you
**Content (the answer goes in the copy; until then it stays a TODO):**
1. **Year:** the site says 2025, but the repo starts in April 2026. Which one, or "2025–2026"?
2. **"Bonus":** is it the **TPP** (Tambahan Penghasilan Pegawai)? In English I'd write "allowance" (or "performance allowance").
3. **Crash figure:** **99.89 % crash-free sessions** (Android 1.0.8, from the report; default) / your current 1.0.9 figure from Crashlytics / "99 %" as you said.
4. **Discovery and design:** who took part besides BKPSDMD, and did you design the screens yourself? If so, the role becomes "UI/UX designer and Flutter developer". Team size?

**Build decisions (my defaults in bold):**
5. Title: **A** / B / C (§3.1).
6. Tablet: **studio tablet + real tablet screenshots** / CSS frame / skip the tablet.
7. Card: **rating chip + stack line** / title and summary only.
8. Track record: **mark 99.9 % confirmed** from Presensi's data / leave it as is.
9. presensi-mobile: **OK to add the tablet size to the screenshot tool on a local branch** / don't touch that repo.
