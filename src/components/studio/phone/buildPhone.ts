import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { BODY, DETAILS, type Colourway, type Front } from "./spec";

/** Scene unit is the centimetre: a 72 mm phone is 7.2 units wide. */
const cm = (mm: number) => mm / 10;

/** Layers above the front face, far enough apart to never z-fight. */
const LAYER = { display: 0.0005, cutout: 0.001, glass: 0.0015 };

/** Rounded rectangle centred on the origin. */
export function roundedRect(w: number, h: number, r: number): THREE.Shape {
  const x = -w / 2;
  const y = -h / 2;
  const s = new THREE.Shape();
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x + w, y + h - r);
  s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
  s.lineTo(x + r, y + h);
  s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + r);
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  return s;
}

export type PhoneMaterials = {
  frame: THREE.MeshPhysicalMaterial;
  border: THREE.MeshPhysicalMaterial;
  back: THREE.MeshPhysicalMaterial;
  island: THREE.MeshPhysicalMaterial;
  /**
   * Front glass: a soft diagonal sheen, added on top of the screen. Flat
   * glass seen through a long lens reflects almost the same thing everywhere
   * (a haze that washes the UI out), so this is the designer's version: a
   * controlled sheen that slides across as the phone turns (`setGlare`).
   */
  glass: THREE.MeshBasicMaterial;
  screen: THREE.MeshBasicMaterial;
  black: THREE.MeshBasicMaterial;
  lens: THREE.MeshPhysicalMaterial;
  flash: THREE.MeshStandardMaterial;
};

export function createMaterials(screen: THREE.Texture): PhoneMaterials {
  return {
    frame: new THREE.MeshPhysicalMaterial({ metalness: 1, roughness: 0.3 }),
    border: new THREE.MeshPhysicalMaterial({ color: 0x050506, roughness: 0.22 }),
    back: new THREE.MeshPhysicalMaterial({ clearcoat: 1, clearcoatRoughness: 0.32 }),
    island: new THREE.MeshPhysicalMaterial({ roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.06 }),
    glass: new THREE.MeshBasicMaterial({
      map: sheenTexture(),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    }),
    // Not tone-mapped: the app's colours come out exactly as in the screenshot.
    screen: new THREE.MeshBasicMaterial({ map: screen, toneMapped: false }),
    black: new THREE.MeshBasicMaterial({ color: 0x000000 }),
    lens: new THREE.MeshPhysicalMaterial({
      color: 0x040507,
      roughness: 0.06,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
      // A hint of blue-violet lens coating. Without a thickness map, the
      // maximum is the coating thickness in nm.
      iridescence: 0.55,
      iridescenceIOR: 1.6,
      iridescenceThicknessMinimum: 200,
      iridescenceThicknessMaximum: 290,
    }),
    flash: new THREE.MeshStandardMaterial({ color: 0xe9dfc9, roughness: 0.55 }),
  };
}

export function applyColourway(m: PhoneMaterials, c: Colourway) {
  m.frame.color.set(c.frame);
  m.frame.roughness = c.frameRoughness;
  m.back.color.set(c.back);
  m.back.roughness = c.backRoughness;
  m.island.color.set(c.island);
}

export function disposeMaterials(m: PhoneMaterials) {
  m.glass.map?.dispose();
  for (const mat of Object.values(m)) mat.dispose();
}

/** The sheen's width on the glass, as a share of the texture: the rest is room to slide. */
const SHEEN_VIEW = 0.6;

/**
 * Glass sheen strength (0 = none; 1 = the default, up to ~14% white) and
 * position: it slides with the phone's turn, so it sweeps across in videos.
 */
export function setGlare(m: PhoneMaterials, strength: number, yawDeg: number) {
  m.glass.opacity = 0.14 * strength;
  m.glass.visible = strength > 0;
  const map = m.glass.map;
  if (map) map.offset.x = (1 - SHEEN_VIEW) / 2 + ((1 - SHEEN_VIEW) / 2) * Math.sin(THREE.MathUtils.degToRad(yawDeg));
}

/** Grey on black (it's added): a broad soft sheen and a thin line, on a diagonal. */
function sheenTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 1024;
  const ctx = c.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, 1024, 1024);
    const g = ctx.createLinearGradient(0, 0, 1024, 640);
    const stops: [number, number][] = [
      [0, 0],
      [0.3, 0],
      [0.38, 0.9],
      [0.5, 0.35],
      [0.56, 0],
      [0.62, 0],
      [0.655, 0.5],
      [0.69, 0],
      [1, 0],
    ];
    stops.forEach(([at, a]) => g.addColorStop(at, `rgba(255,255,255,${a})`));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 1024, 1024);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.repeat.set(SHEEN_VIEW, 1);
  return t;
}

export type PhoneModel = {
  group: THREE.Group;
  /** Display size in scene units (cm). */
  display: { width: number; height: number };
  /** Outline points in the phone's own space, for framing the camera. */
  fitPoints: THREE.Vector3[];
  /** Centre of the camera cutout, in the phone's own space. */
  cutoutCentre: THREE.Vector3;
  /** The display and the front glass, for the transparent-screen export. */
  screen: THREE.Mesh;
  glass: THREE.Mesh;
  /**
   * The display's corners in the phone's own space, as the content is held:
   * top-left, top-right, bottom-right, bottom-left. These are the sharp
   * corners of its rectangle; the rounded ones sit inside them.
   */
  displayCorners: { tl: THREE.Vector3; tr: THREE.Vector3; br: THREE.Vector3; bl: THREE.Vector3 };
  dispose(): void;
};

/** Shape UVs are in shape units; map them to 0–1 across the display. */
function fitUVs(geo: THREE.BufferGeometry, w: number, h: number) {
  const pos = geo.getAttribute("position");
  const uv = geo.getAttribute("uv");
  for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) / w + 0.5, pos.getY(i) / h + 0.5);
  uv.needsUpdate = true;
}

/**
 * Builds the phone facing +z, its top at +y, centred on the origin. The
 * front's aspect sets the display height; the border stays the same on all
 * four sides.
 */
export function buildPhone(front: Front, m: PhoneMaterials): PhoneModel {
  const W = cm(BODY.width);
  const D = cm(BODY.depth);
  const e = cm(BODY.edge);
  const border = cm(BODY.bezel);
  const dw = W - 2 * border;
  const dh = (dw * front.aspect[1]) / front.aspect[0];
  const H = dh + 2 * border;
  const dr = cm(BODY.displayRadius);
  const R = dr + border;
  const zFront = D / 2;
  const zBack = -D / 2;

  const group = new THREE.Group();
  const geometries: THREE.BufferGeometry[] = [];
  const add = (geo: THREE.BufferGeometry, mat: THREE.Material | THREE.Material[], x = 0, y = 0, z = 0) => {
    geometries.push(geo);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    group.add(mesh);
    return mesh;
  };

  // Body. Extrude groups: 0 = the flat front and back, 1 = sides + rounded
  // edges. So the front reads as the black border and the sides as metal.
  const bodyGeo = new THREE.ExtrudeGeometry(roundedRect(W - 2 * e, H - 2 * e, R - e), {
    depth: D - 2 * e,
    bevelEnabled: true,
    bevelThickness: e,
    bevelSize: e,
    bevelSegments: 8,
    curveSegments: 48,
  });
  bodyGeo.translate(0, 0, -(D - 2 * e) / 2);
  add(bodyGeo, [m.border, m.frame]);

  // Back glass over the flat back face.
  const backGeo = new THREE.ShapeGeometry(roundedRect(W - 2 * e, H - 2 * e, R - e), 48);
  backGeo.rotateY(Math.PI);
  add(backGeo, m.back, 0, 0, zBack - LAYER.display);

  // Display.
  const displayGeo = new THREE.ShapeGeometry(roundedRect(dw, dh, dr), 48);
  fitUVs(displayGeo, dw, dh);
  const screen = add(displayGeo, m.screen, 0, 0, zFront + LAYER.display);
  const zDisplay = zFront + LAYER.display;
  const displayCorners = {
    tl: new THREE.Vector3(-dw / 2, dh / 2, zDisplay),
    tr: new THREE.Vector3(dw / 2, dh / 2, zDisplay),
    br: new THREE.Vector3(dw / 2, -dh / 2, zDisplay),
    bl: new THREE.Vector3(-dw / 2, -dh / 2, zDisplay),
  };

  // Camera cutout, sitting on the display.
  const cut = front.cutout;
  const cutoutCentre = new THREE.Vector3(0, dh / 2 - cm(cut.centreFromTop), zFront + LAYER.cutout);
  if (cut.kind === "pill") {
    add(new THREE.ShapeGeometry(roundedRect(cm(cut.width), cm(cut.height), cm(cut.height) / 2), 24), m.black, 0, cutoutCentre.y, cutoutCentre.z);
  } else {
    const r = cm(cut.diameter) / 2;
    add(new THREE.CircleGeometry(r, 48), m.black, 0, cutoutCentre.y, cutoutCentre.z);
    add(new THREE.CircleGeometry(r * 0.42, 32), m.lens, 0, cutoutCentre.y, cutoutCentre.z + LAYER.display / 2);
  }

  // Front glass over the whole face: adds the reflection that sweeps as it turns.
  const glassGeo = new THREE.ShapeGeometry(roundedRect(W - 2 * e, H - 2 * e, R - e), 48);
  fitUVs(glassGeo, W - 2 * e, H - 2 * e);
  const glass = add(glassGeo, m.glass, 0, 0, zFront + LAYER.glass);

  // Side buttons on the right.
  const b = DETAILS.button;
  const buttonX = W / 2 + cm(b.protrusion) - cm(0.5);
  for (const btn of [DETAILS.volume, DETAILS.power]) {
    const geo = new RoundedBoxGeometry(cm(1), cm(btn.length), cm(b.thickness), 3, cm(0.45));
    add(geo, m.frame, buttonX, H / 2 - cm(btn.centreFromTop), 0);
  }

  // Bottom edge: USB-C port, speaker and mic holes (flat shapes facing down).
  const bottomY = -H / 2 - LAYER.display;
  const facingDown = (geo: THREE.BufferGeometry) => geo.rotateX(Math.PI / 2);
  const p = DETAILS.port;
  add(facingDown(new THREE.ShapeGeometry(roundedRect(cm(p.width), cm(p.height), cm(p.height) / 2), 16)), m.black, 0, bottomY, 0);
  const sp = DETAILS.speaker;
  for (let i = 0; i < sp.count; i++) {
    add(facingDown(new THREE.CircleGeometry(cm(sp.diameter) / 2, 16)), m.black, cm(sp.firstFromCentre + i * sp.pitch), bottomY, 0);
  }
  add(facingDown(new THREE.CircleGeometry(cm(sp.diameter) / 2, 16)), m.black, cm(DETAILS.micFromCentre), bottomY, 0);

  // Camera island on the back. Seen from behind, its top left is at +x here.
  const isl = DETAILS.island;
  const iw = cm(isl.width);
  const ih = cm(isl.height);
  const raise = cm(isl.raise);
  const ie = cm(0.4);
  const islandX = W / 2 - cm(isl.inset) - iw / 2;
  const islandY = H / 2 - cm(isl.inset) - ih / 2;
  const islandGeo = new THREE.ExtrudeGeometry(roundedRect(iw - 2 * ie, ih - 2 * ie, cm(isl.radius) - ie), {
    depth: raise - 2 * ie,
    bevelEnabled: true,
    bevelThickness: ie,
    bevelSize: ie,
    bevelSegments: 4,
    curveSegments: 32,
  });
  islandGeo.translate(0, 0, ie);
  islandGeo.rotateY(Math.PI);
  add(islandGeo, [m.island, m.frame], islandX, islandY, zBack);

  // Two lenses and a flash on the island.
  const islandTop = zBack - raise;
  const lens = DETAILS.lens;
  const islandTopY = islandY + ih / 2;
  const rise = cm(lens.rise);
  for (let i = 0; i < 2; i++) {
    const y = islandTopY - cm(lens.firstFromTop + i * lens.pitch);
    const ring = new THREE.CylinderGeometry(cm(lens.ring), cm(lens.ring), rise, 64);
    ring.rotateX(Math.PI / 2);
    add(ring, m.frame, islandX, y, islandTop - rise / 2);
    const lensGlass = new THREE.CircleGeometry(cm(lens.glass), 64);
    lensGlass.rotateY(Math.PI);
    add(lensGlass, m.lens, islandX, y, islandTop - rise - LAYER.display);
    const aperture = new THREE.CircleGeometry(cm(lens.glass) * 0.42, 48);
    aperture.rotateY(Math.PI);
    add(aperture, m.black, islandX, y, islandTop - rise - LAYER.cutout);
  }
  const flash = new THREE.CircleGeometry(cm(DETAILS.flash.diameter) / 2, 32);
  flash.rotateY(Math.PI);
  add(flash, m.flash, islandX, islandTopY - cm(DETAILS.flash.fromTop), islandTop - LAYER.display);

  // Points for framing: the outline on both faces, the camera bump, the buttons.
  const outline = roundedRect(W, H, R).getPoints(8);
  const fitPoints = [
    ...outline.map((pt) => new THREE.Vector3(pt.x, pt.y, zFront)),
    ...outline.map((pt) => new THREE.Vector3(pt.x, pt.y, zBack)),
    ...[-1, 1].flatMap((sx) => [-1, 1].map((sy) => new THREE.Vector3(islandX + (sx * iw) / 2, islandY + (sy * ih) / 2, islandTop - rise))),
    new THREE.Vector3(buttonX + cm(0.5), H / 2 - cm(DETAILS.volume.centreFromTop), 0),
  ];

  return {
    group,
    display: { width: dw, height: dh },
    fitPoints,
    cutoutCentre,
    screen,
    glass,
    displayCorners,
    dispose: () => geometries.forEach((g) => g.dispose()),
  };
}
