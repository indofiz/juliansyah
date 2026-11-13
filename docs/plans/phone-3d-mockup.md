# 3D phone mockup for Presensi PKP

Status (2026-11-13): Steps 0–3 BUILT and verified, uncommitted. Step 4 sample set rendered. Step 5 (site use) not started.

Changes made while building:
- **Glass:** a designed diagonal sheen that slides with the phone's turn, not a physical reflection. Flat glass through a long lens reflects almost the same thing across the whole screen, which came out as a haze that washed out the UI.
- **Video export:** in-browser, with `mediabunny` pinned at 1.64.0 (exact version, the newest release at least two weeks old).

## Can it be done in 3D?

Yes. three.js 0.187 and react-three-fiber 9 are already dependencies (the earth scene uses them). I'd build the phone **in code**, not download a model. That way it's unbranded, its screen has exactly the shape and corners we choose, and no licence comes attached.

What 3D gives that the Codex images can't:

| | 3D phone (this plan) | Codex AI images |
|---|---|---|
| Same phone at every angle | exactly the same | varies a little between images |
| Screen corners | exact, calculated from the camera | measured from the picture |
| Camera moving in a video (orbit, push in, reveal) | yes | no, only cuts between stills |
| New angle | free, any angle, any size | a new generation each time |
| Back of the phone | yes | not in the list |
| Range of devices | one device per model I build (phone first) | 9 devices quickly |
| Look | clean product render | can look more like a photo |

My advice: use 3D for the phone, since it's the hero device for Presensi and for the videos. Let Codex cover breadth (tablets, laptops, monitors, groups). Both libraries will use the same JSON format, so the site doesn't care where a mockup came from.

## What I found

- Presensi PKP is the flagship card (`TryDemo` → CSS `PhoneFrame` + `LoopVideo`). It has no recording, poster or demo build yet (all TODO in `src/content/site.ts`), and `public/projects/presensi-pkp/` is empty.
- **The 10 screenshots in `public/screenshot/` are from Ikan Segar** (the fish freshness app), not Presensi.
- **Presensi screens exist in the app's own repo:** `presensi-mobile/tool/screenshots/output/{en,id}/`. They're rendered from **fake data** at 1290×2796 (iPhone Pro Max size, exactly 9:19.5) with an iOS-style status bar. There are 25 screens, plus `_full` tall versions for scroll animations. You picked `03_onboarding_language`, `04_login`, `07_home` and `14_history`.
- Available without new packages: `RoundedBoxGeometry`, `RoomEnvironment` and `CSS3DRenderer` from `three/examples`. drei isn't installed and isn't needed.
- ffmpeg isn't installed on this Mac.
- The homepage already runs one WebGL scene, and mobile Lighthouse performance is about 80 against a target of 90. So by default there's no second live 3D canvas on the homepage (see Step 5).

## The phone

A generic flagship phone with **two fronts** that share one body:

| | Android (punch-hole) | Pill (like the site's current CSS frame) |
|---|---|---|
| Display | 9:20, fits 1080×2400 screenshots exactly | 9:19.5, fits the current frame and 1179×2556 |
| Camera on the front | 3.0 mm round hole, centred, 3.6 mm below the top of the display | pill, about 30% of the display width, 3.2% from the top |

Real-world sizes, so proportions read right at any angle:
- **Body:** 72 × 156 × 8 mm; corner radius 10 mm.
- **Frame:** flat sides with a 0.8 mm rounded edge.
- **Display:** even black border of about 2 mm; display corner radius 8 mm (the body radius minus the border, so the curves run parallel).
- **Glass:** the front glass sits over the display as a thin clear layer, so a soft reflection sweeps across the screen as the phone turns. Its strength can be set from 0 to 100%.
- **Sides and ports:** volume rocker and power button on the right; USB-C port, speaker holes and SIM tray on the bottom edge.
- **Back:** frosted glass, with a rounded-square camera island at the top left holding 2 lenses and a flash. This is generic, not copied from a real model.
- **Materials:** physical metal for the frame (metalness 1, roughness about 0.3); clearcoat for the back glass; lenses as dark glass with metal rings.
- **Colourways:** graphite (default; reads on the dark site with a rim light) and silver. Titanium or a brand colour can be added later as a single setting.

Not doing: an exact iPhone, Galaxy or Pixel replica (logo, camera layout, Dynamic Island shape). The site is public, and those designs are protected.

## Lighting and render quality

- A studio reflection map built in code from `RoomEnvironment` plus two long softbox strips, for crisp highlights along the metal edges.
- A key light, a rim light from behind (so the outline shows on a dark background) and a soft fill. All neutral white; any accent glow is added by the site.
- The body uses filmic tone mapping (AgX or Neutral, chosen by eye in Step 0). The screen skips tone mapping, so app colours match the screenshot exactly.
- Exports render at 2× and scale down, on top of normal anti-aliasing, so edges stay clean.
- An optional soft contact shadow. It's exported as its own layer when the background is transparent.
- Background options: transparent, the site's dark `#0d0c0a`, a solid colour or a gradient.

## Presensi content

Found: the app's screenshot tool already renders every screen with fake data (see "What I found"). For sharper close-ups it can render at 1720×3728 (`--dart-define=SHOT_SCALE=4`). What follows was the original request, kept for other projects:

- **Screenshots** at the phone's native resolution, not resized. The status bar is fine. Suggested screens, from the case study's feature list:
  - login
  - home with the check-in button
  - check-in on the geofence map
  - selfie check-in
  - leave or permit request
  - attendance history calendar
  - a notification
- **Optional screen recording:** 10–20 s from Android's built-in recorder (1080×2400, 30 or 60 fps). Then the screen in the video moves for real.
- **HTML:** WebGL can't draw a live web page onto the phone's screen. I'd record the page first in headless Chrome at the screen size, then use that recording like a video.
- I won't draw a made-up Presensi UI, because it would misrepresent the real app. Until your screens arrive, Steps 0–3 use a test card and the Ikan Segar screens as stand-ins, labelled as such.

## What it makes

**Stills:** transparent PNGs up to 4096 px on the long edge.
- Angles: the same ids as the Codex library (front, tilt-l/r, three-quarter-l/r, deep-l/r, high-angle, low-angle, lying, lying-rotated, iso-l/r, landscape, close-top), plus `back` and `back-three-quarter`.
- Each still comes with a library version: transparent screen, mask and JSON in the same shape as Codex's `meta/<id>.json`. The corners come straight from the camera projection, so the fit is exact.

**Videos:**

| Preset | Length | Loops | What happens |
|---|---|---|---|
| `float-loop` | 6 s | yes | Gentle bob and tilt at three-quarter. Meant for the site's flagship card. |
| `turntable` | 8 s | yes | A slow 360° turn, showing the back on the way round. |
| `hero-reveal` | 5 s | no | The phone rises while turning from back to front, the screen lights up, and it settles at three-quarter. |
| `screen-tour` | 12–15 s | no | The phone holds at three-quarter while the camera pushes in slowly. Screens change inside with swipe, fade or scroll transitions, and a tap dot shows where a finger would press. |
| `scroll` | any length | no | A long screenshot scrolls inside a still phone. |

Sizes: 16:9 (1920×1080), 9:16 (1080×1920, for Reels and TikTok) and 1:1 (1080×1080); 30 or 60 fps; MP4 (H.264). A transparent background is possible as a PNG frame sequence. Transparent video is covered in Step 5.

Every animation runs on a timeline that is stepped one frame at a time, not played in real time. So an export never drops frames, however slow the render.

## Where it lives

- **A dev-only page, `/studio`.** In production it calls `notFound()` (a 404 with `noindex`). There's no `next.config` change, so no risk to other routes. (Changed from the first draft's `pageExtensions` idea, which applies to every page.)
- **Screens are loaded by dropping image files on the page** (or via a file input). Nothing is copied into `public/`.
- **Code** goes in `src/components/studio/`. The phone model is its own component, so Step 5 can reuse it.
- **Studio controls:**
  - front (Android or pill) and colourway;
  - camera preset or free orbit;
  - screen source (images, video, recorded HTML) and transitions;
  - background, glass and shadow strength;
  - output size and fps;
  - buttons: Export still, Export library still, Export video.
- **How export works** is open decision 3.

## Steps

**Step 0, sign-off on the model (gate):**
1. Build the phone with both fronts in graphite and silver.
2. Render a board of 6 stills: front, three-quarter-l, deep-r, low-angle, back-three-quarter and close-top, with the test card and an Ikan Segar screen.
3. Put your Pinterest references next to them, if you send some.
4. You approve, or tell me what to change. Nothing else is built until then.

**Step 1, studio:** the `/studio` page with the controls above, the screen sources and the transitions.

**Step 2, stills:** PNG export, library export (transparent screen + mask + JSON), and the angle presets.

**Step 3, video:** the 5 presets and the export pipeline.

**Step 4, the Presensi set (when your screens arrive):**
- all angles in the chosen front and colourway;
- `hero-reveal` at 16:9 and 9:16;
- `screen-tour` at 16:9;
- `float-loop` and a poster for the site.

**Step 5 (optional, later), on the site:** a separate plan once Step 4 exists. The choices:
- (a) The rendered `float-loop` as the flagship card's loop. It needs a transparent video so the accent glow behind it still changes with the palette: WebM with alpha for Chrome and Firefox, HEVC with alpha for Safari (I need to check that macOS can encode it).
- (b) A live 3D phone on desktop only. It would mount when near the screen, draw only when something moves, and fall back to the CSS frame.
- (c) Leave the homepage as it is and use 3D only on the case study page.

## Checks

- `npm run lint` and `npm run build` pass, and `/studio` returns 404 in production.
- **Corners are exact:** a test card warped with the exported JSON matches the rendered screen to within 1 px.
- **Exports are repeatable:** rendering the same frame twice gives identical pixels.
- **Loops are seamless:** the first and last frames of `float-loop` and `turntable` match.
- **Videos play** in Chrome and Safari, with file sizes reported.
- **Look:** Step 0 board next to your references.

## Open decisions (my defaults)

1. **Front for Presensi:** **pill** (default, changed after the screenshots arrived). They're 9:19.5 with an iOS status bar laid out around a pill, and the site's current frame uses a pill too. Punch-hole stays available. Both get built; this only picks the one used for the Presensi renders.
2. **Colourway:** **graphite** (default); silver is built too.
3. **Export:**
   - **Default:** an in-browser Export button. It encodes the MP4 in Chrome with WebCodecs plus one small package (`mediabunny`, used only by the dev page), so you can make videos yourself without ffmpeg.
   - **Alternative:** no new package. I drive the page with Playwright from my scratchpad and join the frames with ffmpeg, which you'd need to install, e.g. `brew install ffmpeg`.
4. **Presensi screens:** which ones, and when you can send them. Steps 0–3 don't wait for them.
5. **Site use:** decided later, in Step 5.
