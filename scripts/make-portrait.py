"""
Turn a portrait photo into the particle "portrait map" used by the 3D scene.

    python3 scripts/make-portrait.py path/to/photo.jpg              # adds a VR headset
    python3 scripts/make-portrait.py path/to/photo.jpg --no-headset # just your face

If the photo already shows a headset with a glowing visor, it's detected and
used (pushed forward in depth) and no headset is drawn.

Writes public/portrait/portrait-map.png, plus assets/portrait-preview.png to
check the cutout, depth and brightness (kept out of public/ so it isn't deployed).
The map packs three things into one image:
    R = brightness   (lit areas get brighter, denser dots)
    G = depth        (255 = closest to the camera)
    B = mask         (255 = part of you, 0 = background)

Works best with: a head-and-shoulders photo, face roughly centred, a plain
background that's clearly different from skin/hair/clothes (a solid colour,
or already removed: transparent PNGs are supported).

Requires: pip install numpy scipy pillow "opencv-python-headless<5"
(OpenCV 4.x bundles the face/eye detectors this script uses.)
"""
from __future__ import annotations

import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image
from scipy import ndimage

SIZE = 512  # output map resolution
ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "portrait"
PREVIEW = ROOT / "assets" / "portrait-preview.png"


# --------------------------------------------------------------------------
# 1. Load + square-crop
# --------------------------------------------------------------------------
def load(path: Path) -> tuple[np.ndarray, np.ndarray | None]:
    im = Image.open(path)
    alpha = None
    if im.mode in ("RGBA", "LA") or "transparency" in im.info:
        im = im.convert("RGBA")
        alpha = np.asarray(im)[..., 3].astype(np.float32) / 255
        if (alpha < 0.5).mean() < 0.02:  # an alpha channel that's fully opaque isn't a cutout
            alpha = None
    rgb = np.asarray(im.convert("RGB"))
    h, w = rgb.shape[:2]
    s = min(h, w)
    y0, x0 = (h - s) // 2, (w - s) // 2
    rgb = rgb[y0 : y0 + s, x0 : x0 + s]
    rgb = cv2.resize(rgb, (SIZE, SIZE), interpolation=cv2.INTER_AREA)
    if alpha is not None:
        alpha = cv2.resize(alpha[y0 : y0 + s, x0 : x0 + s], (SIZE, SIZE), interpolation=cv2.INTER_AREA)
    return rgb, alpha


# --------------------------------------------------------------------------
# 2. Background removal
# --------------------------------------------------------------------------
def person_mask(rgb: np.ndarray, alpha: np.ndarray | None) -> np.ndarray:
    if alpha is not None:
        mask = alpha > 0.5
    else:
        # Sample the background colour from the image border, then key out
        # pixels close to it in colour (Lab distance) that are also connected
        # to the border.
        lab = cv2.cvtColor(rgb, cv2.COLOR_RGB2LAB).astype(np.float32)
        border = np.concatenate([lab[:6].reshape(-1, 3), lab[:, :6].reshape(-1, 3), lab[:, -6:].reshape(-1, 3)])
        hsv = cv2.cvtColor(rgb, cv2.COLOR_RGB2HSV).astype(np.float32)
        bh = np.median(np.concatenate([hsv[:6].reshape(-1, 3), hsv[:, :6].reshape(-1, 3), hsv[:, -6:].reshape(-1, 3)]), axis=0)
        # Distance in a/b (colour) with a looser L (the background may be a gradient).
        ref = np.median(border, axis=0)
        dist = np.sqrt(((lab[..., 1] - ref[1]) ** 2 + (lab[..., 2] - ref[2]) ** 2) + 0.15 * (lab[..., 0] - ref[0]) ** 2)
        hue_d = np.minimum(np.abs(hsv[..., 0] - bh[0]), 180 - np.abs(hsv[..., 0] - bh[0]))
        bg = (dist < 32) | ((hue_d < 8) & (hsv[..., 1] > bh[1] * 0.72) & (hsv[..., 2] > 70))
        # Only background regions touching the border count as background.
        lbl, _ = ndimage.label(bg)
        edge_labels = np.unique(np.concatenate([lbl[0], lbl[-1], lbl[:, 0], lbl[:, -1]]))
        bg = np.isin(lbl, edge_labels[edge_labels > 0])
        mask = ~bg

    # Clean up: keep the largest blob, fill holes, smooth the outline.
    lbl, n = ndimage.label(mask)
    if n > 1:
        sizes = ndimage.sum(mask, lbl, range(1, n + 1))
        mask = lbl == (np.argmax(sizes) + 1)
    mask = ndimage.binary_fill_holes(mask)
    mask = ndimage.binary_opening(mask, iterations=2)
    mask = ndimage.binary_erosion(mask, iterations=1)
    return mask


# --------------------------------------------------------------------------
# 3. Depth
# --------------------------------------------------------------------------
def detect_face(gray: np.ndarray):
    cascades = cv2.data.haarcascades
    face_det = cv2.CascadeClassifier(cascades + "haarcascade_frontalface_default.xml")
    faces = face_det.detectMultiScale(gray, 1.08, 5, minSize=(SIZE // 8, SIZE // 8))
    if len(faces) == 0:
        prof = cv2.CascadeClassifier(cascades + "haarcascade_profileface.xml")
        faces = prof.detectMultiScale(gray, 1.08, 4, minSize=(SIZE // 8, SIZE // 8))
    if len(faces) == 0:
        return None, []
    x, y, w, h = max(faces, key=lambda f: f[2] * f[3])
    eye_det = cv2.CascadeClassifier(cascades + "haarcascade_eye.xml")
    roi = gray[y : y + h // 2 + h // 8, x : x + w]
    eyes = eye_det.detectMultiScale(roi, 1.05, 6, minSize=(w // 10, w // 10))
    eyes = sorted(eyes, key=lambda e: e[2] * e[3], reverse=True)[:2]
    eyes = [(x + ex + ew / 2, y + ey + eh / 2, ew) for ex, ey, ew, eh in eyes]
    return (x, y, w, h), eyes


def find_visor(rgb: np.ndarray, face, mask: np.ndarray):
    """A VR headset already in the photo: find its glowing (green/cyan) visor
    in the upper part of the face. Returns the visor's bounding box or None."""
    x, y, w, h = face
    H, W = mask.shape
    x0, x1 = max(0, int(x - 0.35 * w)), min(W, int(x + 1.35 * w))
    y0, y1 = max(0, int(y)), min(H, int(y + 0.8 * h))
    r, g, b = (rgb[y0:y1, x0:x1, i].astype(np.int32) for i in range(3))
    glow = (g > r + 35) & (g > b + 10) & (g > 70) & mask[y0:y1, x0:x1]
    glow = ndimage.binary_closing(glow, iterations=3)
    lbl, n = ndimage.label(glow)
    if n == 0:
        return None
    sizes = ndimage.sum(glow, lbl, range(1, n + 1))
    k = int(np.argmax(sizes)) + 1
    if sizes[k - 1] < 0.015 * w * h:
        return None
    ys, xs = np.nonzero(lbl == k)
    return (int(xs.min() + x0), int(ys.min() + y0), int(xs.max() + x0), int(ys.max() + y0))


def gauss(shape, cx, cy, sx, sy, angle=0.0):
    yy, xx = np.mgrid[0 : shape[0], 0 : shape[1]].astype(np.float32)
    dx, dy = xx - cx, yy - cy
    c, s = np.cos(angle), np.sin(angle)
    u, v = c * dx + s * dy, -s * dx + c * dy
    return np.exp(-0.5 * ((u / sx) ** 2 + (v / sy) ** 2))


def build_depth(rgb: np.ndarray, mask: np.ndarray) -> tuple[np.ndarray, dict]:
    gray = cv2.cvtColor(rgb, cv2.COLOR_RGB2GRAY)
    lum = gray.astype(np.float32) / 255
    info: dict = {}

    # (a) Bust: rounded profile from the silhouette (distance to the edge),
    #     computed per row band so the neck is narrow-round and the head big-round.
    dt = ndimage.distance_transform_edt(mask)
    dt = ndimage.gaussian_filter(dt, 6)
    bust = np.sqrt(np.clip(dt / (dt.max() + 1e-6), 0, 1))

    face, eyes = detect_face(gray)
    relief = np.zeros_like(lum)
    head = np.zeros_like(lum)
    if face is not None:
        x, y, w, h = face
        cx, cy = x + w / 2, y + h * 0.52
        info["face"] = (int(x), int(y), int(w), int(h))
        info["eyes"] = [(int(a), int(b)) for a, b, _ in eyes]

        # Head as an ellipsoid bulging toward the camera.
        head = gauss(lum.shape, cx, cy, w * 0.62, h * 0.78) * 0.55

        # A headset in the photo hides the eyes: use its visor for the eye line.
        visor = find_visor(rgb, face, mask) if len(eyes) < 2 else None
        if visor:
            info["visor"] = visor

        # Where is the face turned? Use the eyes' midpoint vs the face box.
        if visor:
            vx0, vy0, vx1, vy1 = visor
            mid_x, eye_y, eye_dist = (vx0 + vx1) / 2, (vy0 + vy1) / 2, (vx1 - vx0) * 0.42
        elif len(eyes) == 2:
            mid_x = (eyes[0][0] + eyes[1][0]) / 2
            eye_y = (eyes[0][1] + eyes[1][1]) / 2
            eye_dist = abs(eyes[0][0] - eyes[1][0])
        else:
            mid_x, eye_y, eye_dist = cx, y + h * 0.42, w * 0.38
        # Eyes: the nose sits further toward the turn. Visor: its centre is
        # already over the nose bridge.
        nose_x = mid_x if visor else mid_x + (mid_x - cx) * 0.6
        nose_tip_y = (visor[3] + h * 0.06) if visor else (eye_y + h * 0.27)
        info["nose"] = (int(nose_x), int(nose_tip_y))
        if len(eyes) == 2:
            (lx, ly, _), (rx, ry, _) = sorted(eyes, key=lambda e: e[0])
            angle = float(np.arctan2(ry - ly, rx - lx))
        else:
            angle = 0.0
        info["eye_line"] = dict(mid_x=float(mid_x), eye_y=float(eye_y), eye_dist=float(eye_dist), nose_x=float(nose_x), angle=angle)

        # Nose tip, chin; with visible eyes also nose ridge, brow, cheeks and
        # eye sockets (a headset covers those).
        relief += gauss(lum.shape, nose_x, nose_tip_y, w * 0.085, h * 0.07) * 0.22
        relief += gauss(lum.shape, mid_x, y + h * 0.95, w * 0.17, h * 0.09) * 0.14
        if not visor:
            relief += gauss(lum.shape, nose_x, eye_y + h * 0.16, w * 0.06, h * 0.17) * 0.32
            relief += gauss(lum.shape, mid_x, eye_y - h * 0.11, w * 0.34, h * 0.06) * 0.1
            for ex, ey, *_ in (eyes or [(mid_x - eye_dist / 2, eye_y), (mid_x + eye_dist / 2, eye_y)]):
                relief -= gauss(lum.shape, ex, ey, eye_dist * 0.26, eye_dist * 0.17) * 0.12
                relief += gauss(lum.shape, ex, ey + eye_dist * 0.62, eye_dist * 0.32, eye_dist * 0.24) * 0.08

    # (b) Fine detail from shading (shape-from-shading approximation):
    #     a high-pass of brightness, so lit ridges come forward a little.
    smooth = cv2.bilateralFilter(gray, 7, 38, 5).astype(np.float32) / 255
    hp = smooth - ndimage.gaussian_filter(smooth, 9)
    detail = ndimage.gaussian_filter(hp, 1.2) * 0.45

    depth = bust * 0.55 + head + relief + detail
    depth = np.where(mask, depth, 0)
    depth = ndimage.gaussian_filter(depth, 1.5)
    inside = depth[mask]
    lo, hi = np.percentile(inside, 1), np.percentile(inside, 99.5)
    depth = np.clip((depth - lo) / (hi - lo + 1e-6), 0, 1) * mask
    return depth, info


# --------------------------------------------------------------------------
# 4. Brightness: equalise so the dots read well, keep hair/shirt visible.
# --------------------------------------------------------------------------
def build_brightness(rgb: np.ndarray, mask: np.ndarray, info: dict) -> np.ndarray:
    gray = cv2.cvtColor(rgb, cv2.COLOR_RGB2GRAY)
    # Smooth skin/fabric texture but keep edges (visor, lips, hairline), so the
    # dots read as shapes rather than noise on sharp photos.
    gray = cv2.bilateralFilter(gray, 7, 38, 5)
    clahe = cv2.createCLAHE(clipLimit=2.6, tileGridSize=(8, 8))
    eq = clahe.apply(gray).astype(np.float32) / 255
    # Lift the darks (black hair, shadowed shirt) so they still get some dots.
    b = 0.14 + 0.86 * np.power(eq, 1.0)

    # Glowing green/cyan elements (e.g. a VR visor): use their real light
    # level (brightest channel), not their luma, so they glow in the dots.
    r, g, bl = (rgb[..., i].astype(np.int32) for i in range(3))
    glow = (g > r + 35) & (g > bl + 10) & (g > 60) & mask
    glow = ndimage.binary_dilation(glow, iterations=1)
    v = rgb.max(axis=-1).astype(np.float32) / 255
    b = np.where(glow, np.maximum(b, np.clip(0.6 + 0.55 * v, 0, 1)), b)

    # Clothing below the chin fades out so the face stays the focus.
    if "face" in info:
        x, y, w, h = info["face"]
        chin = y + h * 0.92
        H = mask.shape[0]
        yy = np.arange(H, dtype=np.float32)[:, None]
        t = np.clip((yy - chin) / max(H - chin, 1), 0, 1)
        b = b * (1 - 0.65 * np.sqrt(t))
    return np.clip(b, 0, 1) * mask


# --------------------------------------------------------------------------
# 5. VR headset (optional): drawn into the map in front of the eyes
# --------------------------------------------------------------------------
def add_headset(depth: np.ndarray, bright: np.ndarray, mask: np.ndarray, info: dict):
    """Curved visor over the eyes that sticks out from the face, a side panel
    running back toward the ear (the side of the face turned to the camera)
    and a strap. Depth: the face is squeezed into 0–0.8 so the visor can be
    the closest thing (up to 1.0). Brightness: the visor is the brightest part
    of the portrait, with a bright rim and a darker seam."""
    el = info.get("eye_line")
    if not el:
        print("  (no eyes found: skipping the headset)")
        return depth, bright, mask
    H, W = depth.shape
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    ed, ang = el["eye_dist"], el["angle"]
    fx, fy, fw, fh = info["face"]
    c, s_ = np.cos(ang), np.sin(ang)

    # Which side of the face is toward the camera? (nose shifted away from it)
    toward = 1.0 if el["nose_x"] <= el["mid_x"] else -1.0  # +1: viewer's right side is visible

    depth = depth * 0.8
    bright = bright * 0.72  # face a step darker so the headset is the brightest part
    face_d = ndimage.grey_dilation(depth, size=(9, 9))

    # Front visor: a rounded rectangle (superellipse) centred near the nose.
    vcx = el["nose_x"] + toward * ed * 0.08
    vcy = el["eye_y"] - ed * 0.04
    b = ed * 0.5
    u = (xx - vcx) * c + (yy - vcy) * s_
    v = -(xx - vcx) * s_ + (yy - vcy) * c
    # Wider on the side turned to the camera, foreshortened on the far side.
    a_near, a_far = ed * 1.1, ed * 0.86
    a = np.where(u * toward >= 0, a_near, a_far)
    se = np.abs(u / a) ** 4.5 + np.abs(v / b) ** 4.5
    visor = se <= 1.0
    base = float(np.percentile(face_d[visor], 95)) if visor.any() else 0.7
    bulge = 1 - np.clip((u / a) ** 2, 0, 1)
    visor_d = base + 0.14 + 0.05 * bulge + 0.015 * (1 - np.clip((v / b) ** 2, 0, 1))
    rim = (se > 0.72) & visor
    seam = visor & (np.abs(v / b + 0.25) < 0.06)
    bevel = visor & (v / b < -0.62)
    visor_b = 0.74 + 0.12 * (u / a) * toward
    visor_b = np.where(rim, 1.0, np.where(seam, 0.48, np.where(bevel, 0.9, visor_b)))

    # Side panel: trapezoid from the visor edge back toward the ear.
    edge_x = vcx + toward * a_near * 0.96
    ear_x = (fx + fw * 1.02) if toward > 0 else (fx - fw * 0.02)
    t = np.clip((xx - edge_x) / (ear_x - edge_x + 1e-6), 0, 1)
    in_x = ((xx - edge_x) * toward >= 0) & ((xx - ear_x) * toward <= 0)
    half_h = b * (0.88 - 0.35 * t)
    centre_y = vcy + (xx - vcx) * np.tan(ang) - ed * 0.05 * t
    side = in_x & (np.abs(yy - centre_y) <= half_h) & ~visor
    side_d = (base + 0.14) * (1 - t) + (face_d + 0.05) * t
    side_b = 0.6 - 0.15 * t + 0.25 * (np.abs(yy - centre_y) > half_h * 0.8)

    # Strap: from the ear end of the panel to the silhouette at the back.
    strap_y = centre_y - ed * 0.05
    beyond = (xx - ear_x) * toward > 0
    strap = beyond & (np.abs(yy - strap_y + (xx - ear_x) * toward * 0.12) <= ed * 0.17) & mask
    strap_d = face_d + 0.035
    strap_b = 0.42 + 0.2 * (np.abs(yy - strap_y + (xx - ear_x) * toward * 0.12) > ed * 0.12)

    for region, d, br in ((strap, strap_d, strap_b), (side, side_d, side_b), (visor, visor_d, visor_b)):
        depth = np.where(region, d, depth)
        bright = np.where(region, br, bright)
        mask = mask | region
    info["headset"] = True
    return np.clip(depth, 0, 1), np.clip(bright, 0, 1), mask


def push_real_headset(depth: np.ndarray, mask: np.ndarray, info: dict) -> np.ndarray:
    """A headset that's in the photo: bring its front (visor + frame) forward
    so it sticks out from the face when the portrait turns."""
    vx0, vy0, vx1, vy1 = info["visor"]
    H, W = depth.shape
    vw, vh = vx1 - vx0, vy1 - vy0
    cx, cy = (vx0 + vx1) / 2, (vy0 + vy1) / 2
    a, b = vw / 2 + vw * 0.07, vh / 2 + vh * 0.22  # include the black frame
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    u, v = (xx - cx) / a, (yy - cy) / b
    region = ((np.abs(u) ** 4 + np.abs(v) ** 4) <= 1) & mask
    depth = depth * 0.82
    base = float(np.percentile(depth[region], 90)) if region.any() else 0.7
    front = base + 0.12 + 0.05 * (1 - np.clip(u * u, 0, 1))
    depth = np.where(region, np.maximum(depth, front), depth)
    return np.clip(ndimage.gaussian_filter(depth, 0.8), 0, 1) * mask


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not args:
        sys.exit(__doc__)
    src = Path(args[0])
    with_headset = "--no-headset" not in sys.argv
    rgb, alpha = load(src)
    mask = person_mask(rgb, alpha)
    depth, info = build_depth(rgb, mask)
    bright = build_brightness(rgb, mask, info)
    if "visor" in info:
        print("  headset found in the photo: using it (no drawn headset)")
        depth = push_real_headset(depth, mask, info)
        # Face and hair a step darker so the visor is the brightest part.
        vx0, vy0, vx1, vy1 = info["visor"]
        pad_x, pad_y = int((vx1 - vx0) * 0.08), int((vy1 - vy0) * 0.25)
        keep = np.zeros(mask.shape, np.float32)
        keep[max(0, vy0 - pad_y) : vy1 + pad_y, max(0, vx0 - pad_x) : vx1 + pad_x] = 1
        keep = ndimage.gaussian_filter(keep, 6)
        bright = bright * (0.8 + 0.2 * keep)
    elif with_headset:
        depth, bright, mask = add_headset(depth, bright, mask, info)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out = np.stack([bright * 255, depth * 255, mask * 255.0], axis=-1).round().astype(np.uint8)
    Image.fromarray(out, "RGB").save(OUT_DIR / "portrait-map.png", optimize=True)

    # Preview: original | mask | depth | brightness
    def g(a):
        return np.repeat((np.clip(a, 0, 1) * 255).astype(np.uint8)[..., None], 3, axis=-1)

    preview = np.concatenate([rgb, g(mask.astype(np.float32)), g(depth), g(bright)], axis=1)
    if "face" in info:
        x, y, w, h = info["face"]
        cv2.rectangle(preview, (x, y), (x + w, y + h), (47, 227, 154), 2)
        if "visor" in info:
            vx0, vy0, vx1, vy1 = info["visor"]
            cv2.rectangle(preview, (vx0, vy0), (vx1, vy1), (255, 200, 60), 2)
        for ex, ey in info.get("eyes", []):
            cv2.circle(preview, (ex, ey), 6, (47, 227, 154), 2)
        if "nose" in info:
            cv2.circle(preview, info["nose"], 5, (255, 200, 60), -1)
    PREVIEW.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(preview).save(PREVIEW)
    print(f"Wrote {OUT_DIR / 'portrait-map.png'}  face={info.get('face')} eyes={info.get('eyes')}")


if __name__ == "__main__":
    main()
