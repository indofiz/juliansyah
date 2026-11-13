# Device mockup library with transparent screens

You are building a library of device mockups for my portfolio site. I'm a Flutter, web and UI/UX developer. Each mockup is a photoreal, unbranded device on a transparent background, and its **screen is transparent too**. Later I'll put a screen recording, a screenshot or an AI-generated video behind it. Make every file with your image generation tool, then clean and measure it with scripts you write.

Work only in the folder you were started in, and don't change anything outside it. This text is saved there as `PROMPT.md`. Re-read it whenever you resume, start a new session or lose track of the details, and use `manifest.json` (section 11) to see where you stopped.

---

## 0. Context: what the mockups are for

- Right now the site draws its frames in CSS: a phone with a 9:19.5 screen and a pill-shaped camera cutout, and a browser window with a 16:10 content area. The new mockups will replace or sit next to these.
- The site is dark (page background `#0d0c0a`) and has 7 accent colours the visitor can switch between. So the mockups must be **colour-neutral**: no coloured light, glow or tint in the images. The site adds its own accent glow in CSS.
- The layers stack from bottom to top: shadow, content (video or image) clipped by the screen mask and warped into the screen with the measured corners, glare, then the frame PNG with its transparent screen.
- Two things matter most:
  1. A clean transparent screen with a crisp, anti-aliased edge.
  2. Accurate screen corners, so content can be perspective-warped to fit.

## 1. How each file is made

1. **Generate** the image with the display filled with flat key magenta `#FF00FF` on a transparent background.
2. **Key** the magenta out to get the transparent screen, and save the screen mask.
3. **Measure** the screen's 4 corners and write them to JSON, with the homography and a CSS `matrix3d`.
4. **Preview**: warp a test card into the screen, under the frame. Open the preview and look at it.
5. **Validate** with the automatic checks in section 9. If a check fails, retry.

Why not ask for a transparent screen directly? Image models draw screens as glass, with reflections, gradients or black. They can't cut a clean alpha hole. A flat key colour gives a hole with an exact, smooth edge, and you can measure that edge.

### Image tool settings

- Use your built-in image generation tool with the newest gpt-image model you have. If you don't have that tool, call the OpenAI Images API with the same model from a script. Read `OPENAI_API_KEY` from the environment, and never print it or write it to a file.
- Settings: `background: transparent`, `output_format: png`, `quality: high`.
- Sizes: portrait canvas 1024×1536, landscape 1536×1024, square 1024×1024. If the tool offers a larger size with the same shape, use the largest.
- **Reference images:** if the tool accepts them, pass the device's approved `front` image as a reference for every other angle of that device and colourway. Add: *"Same device, same materials and proportions as the reference, new camera angle."*
- **If the tool can't return a transparent background:** retry with the sentence *"on a solid pure green #00FF00 background"* in place of "fully transparent background". Then remove the green in step 2: only remove green that is connected to the image border, and despill green on the edges.
- Keep every raw attempt in `raw/<id>__a<n>.png`. Never overwrite one.

---

## 2. Prompt assembly

Build each image prompt from these blocks, in this order, and use them word for word:

```
HEAD + DEVICE + COLOURWAY + ANGLE + SCREEN + STYLE + NEVER
```

Groups (section 6) use `HEAD + SCENE + COLOURWAY + SCREEN (group) + STYLE + NEVER`.

**HEAD:**
> Photorealistic studio product render of {device short name}, {angle short name}.

**SCREEN (single device):**
> SCREEN: the entire active display area is one flat, perfectly uniform colour: pure magenta #FF00FF (RGB 255, 0, 255), like a matte unlit sticker. No reflection, glare, highlight, gradient, vignette, noise, texture, wallpaper, UI, text or icons on it. The magenta fills the display edge to edge, right up to the black border, with a crisp clean edge that follows the display's rounded corners. Any camera cutout stays solid black on top of the magenta. Magenta and pink appear nowhere else in the image: not on the body, not as a reflection, not as light spill.

**SCREEN (group):**
> SCREEN: every device's entire active display area is one flat, perfectly uniform colour: pure magenta #FF00FF (RGB 255, 0, 255), like a matte unlit sticker. No reflection, glare, highlight, gradient, vignette, noise, texture, wallpaper, UI, text or icons on any display. Each magenta area fills its display edge to edge, right up to that device's black border, with a crisp clean edge that follows the rounded corners. Camera cutouts stay solid black on top of the magenta. Magenta and pink appear nowhere else in the image.

**STYLE:**
> STYLE: high-end product photography look, physically accurate materials, fine bevels and chamfers, subtle realistic reflections on metal only. Neutral white studio light: a large soft key light from the upper left, a soft fill from the right, and a thin crisp rim light along the outer edges, so the silhouette reads on a near-black page and on a white page. Everything is in sharp focus: no depth-of-field blur, no motion blur. Isolated object on a fully transparent background, with roughly 10% empty margin on every side. Nothing touches the image edge.

(For `close-top` and `close-screen` only, drop the last two sentences; the angle text says which edge the device may touch.)

**NEVER:**
> NEVER: no floor, table, backdrop, cast shadow, ground reflection, props, hands, people, plants, text, numbers, letters, logos, brand marks, stickers, watermarks, coloured lights, coloured glow, lens flare or bokeh.

### Example: `phone-graphite-three-quarter-l`

> Photorealistic studio product render of a modern unbranded flagship smartphone, three-quarter view facing left.
> DEVICE: a modern, unbranded flagship smartphone. Flat sides on a softly rounded metal frame, flat front glass, a uniform thin black border around the display (about 1.5% of the phone's width), and a display with large rounded corners. A small pill-shaped black camera cutout sits on the display, centred near the top. Volume buttons on the left side, one power button on the right side. Overall proportion about 1 : 2.1; the display is about 9 wide by 19.5 tall.
> COLOURWAY: dark graphite (space-grey) satin metal for the frame, body and stand; black display border. Browser window: dark graphite toolbar.
> ANGLE: three-quarter view. The device stands upright and is turned 30° about its vertical axis, so the display faces toward the left of the image. Its right-hand edge is nearer the camera, and the side of the frame shows there as a thin band; the left-hand edge recedes. The camera is slightly above centre, looking down about 8°, with a 50 mm look. The display stays fully visible.
> SCREEN: … (single-device block above)
> STYLE: … (block above)
> NEVER: … (block above)

---

## 3. Devices

All devices are unbranded and generic: no logos, and no trademark design features copied from a real product.

| id | short name (for HEAD) | canvas | screen aspect (w:h as held) | test card px |
|---|---|---|---|---|
| `phone` | a modern unbranded flagship smartphone | portrait | 9:19.5 | 1080×2340 |
| `phone-punch` | an unbranded Android-style flagship smartphone | portrait | 9:20 | 1080×2400 |
| `foldable` | an unbranded book-style foldable phone, unfolded | square | 5:6 | 1500×1800 |
| `tablet-portrait` | an unbranded 11-inch tablet in portrait | portrait | 1:1.43 | 1640×2360 |
| `tablet-landscape` | an unbranded 11-inch tablet in landscape | landscape | 1.43:1 | 2360×1640 |
| `laptop` | an unbranded thin 14-inch laptop | landscape | 16:10 | 1920×1200 |
| `monitor` | an unbranded 27-inch desktop display | landscape | 16:9 | 1920×1080 |
| `browser` | a floating desktop browser window as a physical object | landscape | 16:10 | 1920×1200 |
| `watch` | an unbranded smartwatch | portrait | 1:1.22 | 410×500 |

Canvas overrides:
- The `landscape` and `landscape-three-quarter` angles use a landscape canvas.
- On `phone`, `phone-punch`, `foldable` and `tablet-portrait`, the `iso-l`, `iso-r` and `lying-rotated` angles use a square canvas.

**DEVICE blocks:**

- **phone:** DEVICE: a modern, unbranded flagship smartphone. Flat sides on a softly rounded metal frame, flat front glass, a uniform thin black border around the display (about 1.5% of the phone's width), and a display with large rounded corners. A small pill-shaped black camera cutout sits on the display, centred near the top. Volume buttons on the left side, one power button on the right side. Overall proportion about 1 : 2.1; the display is about 9 wide by 19.5 tall.
- **phone-punch:** DEVICE: an unbranded Android-style flagship smartphone. A very thin, even black border around the display, a slightly tighter display corner radius, a flat glass front, and a satin metal frame with gently rounded sides. A tiny round punch-hole camera sits on the display, centred near the top. Volume and power buttons on the right side. The display is about 9 wide by 20 tall.
- **foldable:** DEVICE: an unbranded book-style foldable phone, fully unfolded flat and standing upright, with the hinge running vertically down the middle. A large inner display, almost square (about 5 wide by 6 tall), with a very thin even black border, rounded corners and no visible crease. A tiny round punch-hole camera sits on the display near its top-right corner. Satin metal frame; the hinge shows only as a slim spine on the outer edge.
- **tablet-portrait:** DEVICE: an unbranded 11-inch tablet in portrait orientation. Flat aluminium edges with slightly rounded corners, a flat glass front, and an even black border on all four sides of the display (about 3% of the short side). The display has rounded corners and is about 1 wide by 1.43 tall. A tiny front camera dot sits in the border at the centre of the top edge, in the border and not on the display.
- **tablet-landscape:** DEVICE: an unbranded 11-inch tablet in landscape orientation. Flat aluminium edges with slightly rounded corners, a flat glass front, and an even black border on all four sides of the display (about 3% of the short side). The display has rounded corners and is about 1.43 wide by 1 tall. A tiny front camera dot sits in the border at the centre of the top long edge, in the border and not on the display.
- **laptop:** DEVICE: an unbranded thin 14-inch laptop, open to about 110°. Satin aluminium body and a thin black border around the display, with a tiny webcam dot centred in the top border (no notch). The display has slightly rounded corners and is about 16 wide by 10 tall. Keyboard with blank dark keycaps (no letters) and a large trackpad. No logo on the lid or anywhere else, no stickers.
- **monitor:** DEVICE: an unbranded 27-inch desktop display. Flat panel with an even thin black border; the display is about 16 wide by 9 tall. It stands on a slim aluminium stand with a flat rectangular foot. No logo, no visible buttons, no cables.
- **browser:** DEVICE: a desktop browser window made into a physical object: a thin rounded-rectangle slab (depth about 1.5% of its width) with softly bevelled edges. Across the top is a slim window toolbar in the colourway's toolbar colour. It has three small round window buttons on the left, all the same neutral grey (not red, yellow or green), and an empty rounded address bar in the middle with no text, no icons and no tabs. Below the toolbar, the content area fills the rest of the window and is about 16 wide by 10 tall. The magenta screen is this content area.
- **watch:** DEVICE: an unbranded smartwatch with a rounded-square case and slightly domed glass. The display has rounded corners and a thin black border and is about 1 wide by 1.22 tall. A crown and a flat button on the right side. A plain sport band in a matching neutral colour forms a closed loop behind the case.

---

## 4. Angles

Naming: `-l` means the display faces toward the **left** of the image, and `-r` toward the right.

`top` is the direction the device's top points in the image, in degrees: 0 = up, 90 = right, 180 = down, 270 = left. It sets the corner order in section 8.

| id | short name | top |
|---|---|---|
| `front` | straight-on front view | 0 |
| `tilt-l` | front view tilted left | 348 |
| `tilt-r` | front view tilted right | 12 |
| `three-quarter-l` | three-quarter view facing left | 0 |
| `three-quarter-r` | three-quarter view facing right | 0 |
| `deep-l` | strong perspective view facing left | 0 |
| `deep-r` | strong perspective view facing right | 0 |
| `high-angle` | high-angle view | 0 |
| `low-angle` | low hero angle | 0 |
| `lying` | lying flat, seen from the front | 0 |
| `lying-rotated` | lying flat, rotated | 30 |
| `iso-l` | isometric view, top toward the upper left | 300 (lying) / 0 (laptop, monitor) |
| `iso-r` | isometric view, top toward the upper right | 60 (lying) / 0 (laptop, monitor) |
| `landscape` | landscape front view | 270 |
| `landscape-three-quarter` | landscape three-quarter view | 270 |
| `close-top` | close-up of the top half | 0 |
| `close-screen` | close-up of the display | 0 |

**ANGLE blocks:**

- **front:** ANGLE: straight-on front view. The camera is level with the centre of the display, its lens axis perpendicular to the display, with a long-lens look (about 85 mm) and almost no perspective. The device is upright and perfectly vertical, display facing the camera, centred in the image.
- **tilt-l:** ANGLE: front view. The camera is level and perpendicular to the display (85 mm look), and the device is rotated 12° counter-clockwise in the picture plane, so its top leans to the left, as if floating.
- **tilt-r:** ANGLE: front view. The camera is level and perpendicular to the display (85 mm look), and the device is rotated 12° clockwise in the picture plane, so its top leans to the right, as if floating.
- **three-quarter-l:** ANGLE: three-quarter view. The device stands upright and is turned 30° about its vertical axis, so the display faces toward the left of the image. Its right-hand edge is nearer the camera, and the side of the frame shows there as a thin band; the left-hand edge recedes. The camera is slightly above centre, looking down about 8°, with a 50 mm look. The display stays fully visible.
- **three-quarter-r:** ANGLE: three-quarter view. The device stands upright and is turned 30° about its vertical axis, so the display faces toward the right of the image. Its left-hand edge is nearer the camera, and the side of the frame shows there as a thin band; the right-hand edge recedes. The camera is slightly above centre, looking down about 8°, with a 50 mm look. The display stays fully visible.
- **deep-l:** ANGLE: strong perspective view. The device stands upright and is turned 55° about its vertical axis, so the display faces toward the left of the image. The right-hand side of the frame is clearly visible. 35 mm look with noticeable perspective. The display is narrower but still fully visible.
- **deep-r:** ANGLE: strong perspective view. The device stands upright and is turned 55° about its vertical axis, so the display faces toward the right of the image. The left-hand side of the frame is clearly visible. 35 mm look with noticeable perspective. The display is narrower but still fully visible.
- **high-angle:** ANGLE: high angle. The device stands upright, turned 15° so the display faces slightly left. The camera is about 35° above the device's centre, looking down, so the top edge of the device is visible and the device narrows toward the bottom.
- **low-angle:** ANGLE: low hero angle. The device stands upright, turned 15° so the display faces slightly right. The camera is below the device's centre, looking up about 20°, so the bottom edge of the device is visible and the device narrows toward the top. It should feel tall and confident.
- **lying:** ANGLE: the device lies flat on its back on an invisible surface, display up, with its top pointing straight away from the camera. The camera is in front of its bottom edge, raised 40° above the surface, so the display is foreshortened (the far edge looks narrower). Nothing is under the device.
- **lying-rotated:** ANGLE: the device lies flat on its back on an invisible surface, display up, rotated 30° clockwise on the surface so its top points to the upper right. The camera is raised 55° above the surface. Nothing is under the device.
- **iso-l (phones, tablets, foldable, browser):** ANGLE: true isometric view (orthographic, no vanishing points, 30° isometric grid). The device lies flat, display up, with its top pointing toward the upper left of the image along the isometric axis. The device's thickness shows along its lower edges.
- **iso-r (phones, tablets, foldable, browser):** ANGLE: true isometric view (orthographic, no vanishing points, 30° isometric grid). The device lies flat, display up, with its top pointing toward the upper right of the image along the isometric axis. The device's thickness shows along its lower edges.
- **iso-l (laptop, monitor):** ANGLE: true isometric view (orthographic, no vanishing points, 30° isometric grid) of the device standing normally on an invisible isometric ground, display facing toward the lower left of the image.
- **iso-r (laptop, monitor):** ANGLE: true isometric view (orthographic, no vanishing points, 30° isometric grid) of the device standing normally on an invisible isometric ground, display facing toward the lower right of the image.
- **landscape:** ANGLE: straight-on front view (85 mm look). The phone is turned 90° counter-clockwise into landscape, so the camera cutout is at the LEFT end of the display.
- **landscape-three-quarter:** ANGLE: the phone is in landscape, with the camera cutout at the LEFT end of the display. It is turned 30° about its vertical axis so the display faces toward the right of the image. The camera is slightly above centre, with a 50 mm look.
- **close-top:** ANGLE: close-up of the upper half of the phone, turned 25° so the display faces slightly right. The camera is level with the camera cutout, with a 50 mm look. The phone fills the width of the image with a little margin, and its lower half is cut off by the bottom edge of the image, the only edge it may touch.
- **close-screen:** ANGLE: close three-quarter view of the laptop's display, turned 25° so it faces slightly left. The display fills most of the image, and the keyboard is cut off by the bottom edge of the image, the only edge it may touch.

---

## 5. Colourways

- **graphite** (default): COLOURWAY: dark graphite (space-grey) satin metal for the frame, body and stand; black display border. Browser window: dark graphite toolbar.
- **silver:** COLOURWAY: light silver satin aluminium for the frame, body and stand; black display border. Browser window: light grey toolbar.
- **clay** (extras only): COLOURWAY: matte off-white clay render. The whole device is one soft matte white material, with no metal, no glass reflections, and soft ambient occlusion in the seams. Keep the black display border so the screen edge reads.

---

## 6. Groups (several screens in one image)

Every group uses one key colour. The screens are told apart as separate connected areas, so displays must never touch or overlap each other. `order` sets how screens are numbered in the JSON.

- **group-responsive-front** (landscape canvas; order: by area, largest first, so laptop, tablet, phone; top 0 for all):
  SCENE: three unbranded devices of the same family and colourway arranged as a responsive set. All stand upright and face the camera with a gentle 10° turn to the left; the camera is slightly high (10°), with a 50 mm look. A thin 14-inch laptop, open at 110° with a 16:10 display, stands at the back centre. An 11-inch tablet in portrait stands to its left, slightly in front. A smartphone with a pill camera cutout stands to its right, furthest in front. The devices may overlap a little, but each display is fully visible and separated from the others by its black border.
- **group-responsive-iso** (landscape canvas; order: by area, largest first; top: laptop 0, tablet 300, phone 300):
  SCENE: true isometric view (orthographic, 30° grid) of a responsive set on invisible ground. A thin laptop, open at 110°, at the back, with its display facing the lower left. A tablet lying flat, display up, at the front left. A smartphone lying flat, display up, at the front right. The tops of the lying devices point to the upper left. No display covers another.
- **group-phone-trio** (landscape canvas; order: left to right; top 0):
  SCENE: three identical unbranded smartphones with pill camera cutouts, standing upright in a row. The middle one faces the camera straight on, slightly in front. The left and right ones stand a little behind it, turned 25° inward toward the middle one. Level camera, 85 mm look. Even gaps between the phones, no overlap.
- **group-phone-duo** (square canvas; order: left to right; top: 350 then 10):
  SCENE: two identical unbranded smartphones with pill camera cutouts, floating side by side. The left one sits higher and is tilted 10° counter-clockwise; the right one sits lower and is tilted 10° clockwise. A small even gap between them, no overlap.
- **group-phone-row-iso** (landscape canvas; order: left to right; top 300):
  SCENE: true isometric view (orthographic) of five identical unbranded smartphones with pill camera cutouts, lying flat, display up. They form one straight, evenly spaced row running from the lower left to the upper right, with their tops pointing to the upper left. No overlap.
- **group-laptop-phone** (landscape canvas; order: by area, largest first; top 0):
  SCENE: an unbranded thin 14-inch laptop, open at 110°, turned 30° so its display faces the left of the image. An unbranded smartphone with a pill camera cutout stands upright in front of the laptop's right corner, turned the same way. Camera slightly above, 50 mm look. The phone does not cover the laptop's display.

---

## 7. The full list

Expand this into `manifest.json`: one entry per file, with id, device, colourway, angle, canvas, the exact prompt, screen count, order, `top` per screen, status, attempts and file paths. Id pattern: `{device}-{colourway}-{angle}` for single devices and `{group}-{colourway}` for groups.

```yaml
colourways: [graphite, silver]          # clay only under extras
devices:
  phone:            {angles: [front, tilt-l, tilt-r, three-quarter-l, three-quarter-r, deep-l, deep-r, high-angle, low-angle, lying, lying-rotated, iso-l, iso-r, landscape, landscape-three-quarter, close-top]}
  phone-punch:      {angles: [front, tilt-l, tilt-r, three-quarter-l, three-quarter-r, low-angle, lying, iso-l, iso-r]}
  foldable:         {angles: [front, three-quarter-l, three-quarter-r, lying, iso-r]}
  tablet-portrait:  {angles: [front, tilt-l, tilt-r, three-quarter-l, three-quarter-r, low-angle, lying, iso-l, iso-r]}
  tablet-landscape: {angles: [front, three-quarter-l, three-quarter-r, high-angle, lying, iso-l, iso-r]}
  laptop:           {angles: [front, three-quarter-l, three-quarter-r, deep-l, deep-r, high-angle, low-angle, iso-l, iso-r, close-screen]}
  monitor:          {angles: [front, three-quarter-l, three-quarter-r, deep-l, deep-r, high-angle, low-angle]}
  browser:          {angles: [front, tilt-l, tilt-r, three-quarter-l, three-quarter-r, deep-l, deep-r, lying, iso-l, iso-r]}
  watch:            {angles: [front, three-quarter-l, three-quarter-r, low-angle]}
groups: [group-responsive-front, group-responsive-iso, group-phone-trio, group-phone-duo, group-phone-row-iso, group-laptop-phone]
extras:
  clay: {devices: [phone, tablet-portrait, laptop, browser], angles: [front, three-quarter-l, iso-r]}
```

That makes 83 images per colourway (77 single-device + 6 groups), 166 for graphite and silver, plus 12 clay: **178 files**.

---

## 8. Post-processing (`tools/process.py`)

Use Python 3 in a venv with `pillow`, `numpy` and `opencv-python-headless`. Do all of this deterministically in code. No AI editing after generation.

**Key (screen to transparent):**
1. Compute `score = min(R, B) − G` per pixel (0–255 scale). Key core: `score ≥ 140` and `|R − B| ≤ 90`.
2. Screen regions are the connected components of the key core with an area of at least 0.5% of the canvas. Drop smaller specks.
3. Holes inside a region:
   - Fill holes whose median luminance is 60 or more. They're glare.
   - Keep dark holes (the camera cutout). They stay opaque frame pixels.
4. Soft edge: in a 3 px band around each region, use key amount `k = clamp((score − 40) / 100, 0, 1)`. Inside the region, `k = 1`.
5. Final alpha = raw alpha × (1 − k).
6. Despill: for every pixel within 6 px of a region with `score > 20`, set `d = max(0, min(R, B) − G)`, then `R −= d` and `B −= d`.
7. Write `masks/<id>.screen<N>.png`: 8-bit grayscale, white = screen (soft edge included), black = everything else. Camera cutouts are black.

**Measure (corners):**
1. Take the outer contour of each region with its holes filled (`RETR_EXTERNAL`, `CHAIN_APPROX_NONE`).
2. Make the convex hull, then run `approxPolyDP`, raising epsilon from 0.5% of the perimeter until you get 4 vertices. These are the rough corners.
3. For each side, take the contour points in the middle 70% of that side, which skips the rounded corners. Fit a line with `cv2.fitLine` (`DIST_HUBER`). Intersect adjacent lines to get **virtual sharp corners**. They sit slightly outside the rounded corners, and that's correct: the mask clips the content.
4. Corner order:
   - The top edge is the edge whose outward normal (seen from the centroid) is closest to the screen's `top` direction.
   - From the first vertex of the top edge, walk clockwise in image space (y points down) to get TL, TR, BR, BL.
   - Cross-check on `phone`, `phone-punch` and `foldable`: the black cutout hole must be nearest the TL–TR edge (on the foldable, nearest TR).
5. Homography `H` maps content `(u, v) ∈ [0, 1]²` to master pixels: (0,0)→TL, (1,0)→TR, (1,1)→BR, (0,1)→BL. Use `cv2.getPerspectiveTransform`.
6. CSS: for a content element the size of the test card (`w×h`), placed at the image's top-left with `transform-origin: 0 0`:
   - `G = H · diag(1/w, 1/h, 1)`, normalised so that `G22 = 1`.
   - `matrix3d(G00, G10, 0, G20, G01, G11, 0, G21, 0, 0, 1, 0, G02, G12, 0, G22)`.
   - This is in master pixels. The README explains how to scale a wrapper by `displayedWidth / masterWidth`.
7. Corner radius estimate, for `front`, `tilt` and `landscape` angles only: `r ≈ sqrt((quadArea − filledRegionArea) / (4 − π))`.

**Layers:**
- `layers/<id>.shadow.png`: the device silhouette (alpha with the screen filled in), blurred with σ = 1.5% of the canvas's long edge, moved down by 2% of the canvas height, black at 35% opacity. It's an approximation; say so in the README.
- `layers/<id>.glare.png`: a soft diagonal white band from the screen's top-left, at most 8% alpha, clipped to the screen mask, transparent everywhere else. It goes over the content.

**Test cards** (`tools/testcards.py`, one per screen aspect, drawn in code, not by the AI): a dark background, an 8×8 grid, a large up arrow labelled `TOP`, corner labels `TL TR BR BL` in four different colours, a circle in the centre (to show distortion), a 2% red border (to show whether the edges are covered), and the size printed small.

**Preview:** stack checkerboard → shadow → test card warped with `H` and multiplied by the mask → glare → master. Save `previews/<id>.jpg` (long edge 1024 px, quality 85). If `./sample-screens/` exists, also make `previews/sample/<id>.jpg` using the image there whose aspect is closest to the screen's.

**Web export:** `web/<id>.webp` and `web/<id>.mask.webp`, long edge at most 1600 px, quality 90, alpha kept.

**JSON** (`meta/<id>.json`). Example shape:

```json
{
  "id": "phone-graphite-three-quarter-l",
  "device": "phone", "colourway": "graphite", "angle": "three-quarter-l",
  "canvas": { "width": 1024, "height": 1536 },
  "screens": [
    {
      "index": 1, "label": "phone",
      "top": 0,
      "aspectTarget": "9:19.5",
      "contentSize": { "width": 1080, "height": 2340 },
      "quadPx":   { "tl": [0, 0], "tr": [0, 0], "br": [0, 0], "bl": [0, 0] },
      "quadNorm": { "tl": [0, 0], "tr": [0, 0], "br": [0, 0], "bl": [0, 0] },
      "bboxPx": [0, 0, 0, 0],
      "homography": [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
      "cssMatrix3d": "matrix3d(...)",
      "cornerRadiusPx": null,
      "hasCutout": true,
      "mask": "masks/phone-graphite-three-quarter-l.screen1.png"
    }
  ],
  "files": {
    "master": "masters/….png", "web": "web/….webp", "webMask": "web/….mask.webp",
    "shadow": "layers/….shadow.png", "glare": "layers/….glare.png", "preview": "previews/….jpg"
  },
  "generation": { "model": "", "size": "", "quality": "high", "attempts": 1, "prompt": "", "reference": null, "mirroredFrom": null },
  "checks": { "background": true, "screens": true, "uniform": true, "leftover": true, "shape": true, "orientation": true, "visual": true }
}
```

---

## 9. Validation and retries

Automatic checks for each file:

| check | passes when |
|---|---|
| background | at least 99% of pixels in a 4 px ring around the image border have alpha ≤ 8 (for `close-*` angles, skip the edge the device may touch) |
| screens | the number of screen regions equals the expected count, and each covers at least 2% of the canvas (watch: 1%) |
| uniform | in the raw image, the inside of each screen (mask eroded by 2% of the screen width) has per-channel std ≤ 12 and a mean within 30 of (255, 0, 255) |
| leftover | after keying, pixels with alpha > 32 and score > 60 are no more than 0.02% of the canvas |
| shape | every quad is convex; for `front`, `tilt-*` and `landscape`, the measured aspect is within ±12% of the target |
| orientation | the cutout cross-check in section 8 passes, where it applies |
| visual | you open the preview and confirm: the right device, angle and colourway; no text or logos; `TOP` points to the device's top; the test card covers the whole screen; no pink fringe |

If a check fails, regenerate. Allow up to 3 attempts per file, and add the matching sentence to the prompt:
- background: "The background must be 100% transparent alpha: no floor, no shadow, no backdrop."
- uniform: "The magenta is a flat unlit fill, exactly RGB 255,0,255 in every pixel of the display, with absolutely no reflection or highlight on it."
- leftover: "No pink, purple or magenta anywhere except the display."
- screens / shape / visual: restate the ANGLE block with its numbers, plus what was wrong.

After 3 failed attempts:
- If it's a `-r` angle and its `-l` twin passed, mirror the `-l` raw image horizontally, run it through processing, and set `mirroredFrom`.
- Otherwise mark it `failed` in `failed.json` with the reason, and move on.

---

## 10. Folder layout and tools

```
./                   the folder you were started in
  PROMPT.md          this prompt
  sample-screens/    optional: my real app screenshots for the previews
  manifest.json      every file: prompt, status (pending | ok | failed | mirrored), attempts, paths
  failed.json
  README.md          how to use the library (below)
  gallery.html       browse everything (below)
  tools/             testcards.py, process.py, sheets.py, gallery.py, compose_image.py, compose_video.py
  testcards/         one test card per screen aspect
  raw/               every generator output, untouched: <id>__a1.png, <id>__a2.png …
  masters/           final RGBA PNG: transparent background and transparent screen(s)
  masks/             <id>.screen<N>.png
  layers/            <id>.shadow.png, <id>.glare.png
  meta/              <id>.json
  web/               <id>.webp, <id>.mask.webp
  previews/          <id>.jpg (+ sample/ if sample-screens exists)
  sheets/            contact sheets
```

- **Contact sheets** (`tools/sheets.py`): one per device and colourway, `sheets/<device>-<colourway>.jpg`, 4 columns, each preview labelled with its id. Make one per tier too: `sheets/tier-<n>.jpg`.
- **Gallery** (`tools/gallery.py`, writes `gallery.html`): a static page that opens from `file://`, so put the manifest inline (no fetch). Filter chips for device, angle and colourway. Each tile shows the web image with the test card behind it, placed with the JSON's `cssMatrix3d`; this proves the CSS numbers are right. Clicking a tile cycles through test card, sample screen (if present) and empty screen.
- **`tools/compose_image.py <id> <image> [--screen N] [--fit cover|contain] [--out file.png]`**: puts a screenshot into the screen. For groups, `--screen N <image>` can repeat.
- **`tools/compose_video.py <id> <video> [--screen N] [--out out.mp4] [--alpha]`**, using ffmpeg:
  1. Cover-crop the video to the screen's aspect and scale it to the canvas size.
  2. Run `perspective` with `sense=destination` and the corners in ffmpeg's order (TL, TR, BL, BR).
  3. `alphamerge` with the mask, then overlay the master on top.
  4. Output H.264 MP4 (yuv420p) on black. With `--alpha`, output a transparent-background ProRes 4444 `.mov` as well, for later compositing.
  5. Test it on a 3-second `testsrc` clip with three mockups (one front, one three-quarter, one iso) and look at a frame from each.
  6. If ffmpeg isn't installed, skip this tool and say so in the report.
- **README.md**:
  - what each file is, and the layer order;
  - how corners and `top` work;
  - a CSS example: frame `<img>` on top with `pointer-events: none`, `<video>` underneath with `mask-image` from the mask and `transform: matrix3d(...)`, inside a wrapper scaled to the displayed size;
  - the two compose commands;
  - the recording sizes that match each screen without cropping (the test card sizes in section 3).

---

## 11. Order of work

**Step 0, pilot (then STOP):**
1. Set up the venv, write the test cards and `process.py`, and expand `manifest.json`.
2. Generate and process these 4 files:
   - `phone-graphite-front`
   - `phone-graphite-three-quarter-l`
   - `laptop-graphite-three-quarter-r`
   - `group-phone-trio-graphite`
3. Show me the 4 previews and a contact sheet, with each one's check results.
4. **Stop and wait for me to say "go".** I'll approve the style or adjust the blocks first.

**After "go", run through every tier without stopping.** Within each device, make `front` first; once it passes, it's the reference for that device's other angles.

1. **Tier 1, graphite (what the site uses now):** `phone` (all 16 angles), `laptop`, `browser`, `group-phone-trio`, `group-responsive-front`. 38 files.
2. **Tier 2, graphite:** `phone-punch`, `foldable`, `tablet-portrait`, `tablet-landscape`, `monitor`, `watch`, and the other 4 groups. 45 files.
3. **Tier 3, silver for everything:** 83 files. Prefer an *edit* of the approved graphite raw image of the same id, with *"Change only the material to light silver satin aluminium (light grey browser toolbar). Keep the geometry, camera, framing and the flat magenta display exactly as they are."* If the edit fails the checks, generate it from scratch.
4. **Tier 4, clay extras:** 12 files.

**Resuming:** `manifest.json` is the source of truth. On restart, skip anything that's `ok` or `mirrored` and carry on.

**Finish with a report:**
- counts per tier (ok, failed, mirrored);
- every failed id with its reason;
- total generations used;
- any device or angle that kept failing, and a better prompt wording for it;
- paths to the contact sheets, `gallery.html` and the README.
