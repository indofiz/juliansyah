import * as THREE from "three";

/**
 * Camera presets. Ids match the Codex mockup library
 * (docs/prompts/codex-device-mockups.md), plus two back views.
 *
 * The phone turns, the camera stays on its orbit:
 *  - roll: in-plane turn, + = counter-clockwise (top leans left)
 *  - pitch: -90 lays it flat, display up, top pointing away
 *  - yaw: turn about the vertical, + = display faces the right of the image
 *  - elevation / azimuth: where the camera sits, in degrees
 *  - focal: 35 mm-equivalent lens on the long side, or "ortho" for isometric
 */
/** How the phone is turned (degrees), and lifted (cm). */
export type Pose = { yaw?: number; pitch?: number; roll?: number; lift?: number };

/** Where the camera sits (degrees) and its lens. */
export type Lens = { elevation?: number; azimuth?: number; focal: number | "ortho" };

export type Angle = Pose &
  Lens & {
    id: string;
    label: string;
    canvas: "portrait" | "landscape" | "square";
    /** Frame only the top half; the rest runs off the bottom edge. */
    crop?: "top";
  };

const ISO_ELEVATION = 35.264;

export const ANGLES: Angle[] = [
  { id: "front", label: "Front", focal: 85, canvas: "portrait" },
  { id: "tilt-l", label: "Tilt left", roll: 12, focal: 85, canvas: "portrait" },
  { id: "tilt-r", label: "Tilt right", roll: -12, focal: 85, canvas: "portrait" },
  { id: "three-quarter-l", label: "Three-quarter left", yaw: -30, elevation: 8, focal: 50, canvas: "portrait" },
  { id: "three-quarter-r", label: "Three-quarter right", yaw: 30, elevation: 8, focal: 50, canvas: "portrait" },
  { id: "deep-l", label: "Deep left", yaw: -55, elevation: 5, focal: 35, canvas: "portrait" },
  { id: "deep-r", label: "Deep right", yaw: 55, elevation: 5, focal: 35, canvas: "portrait" },
  { id: "high-angle", label: "High angle", yaw: -15, elevation: 35, focal: 50, canvas: "portrait" },
  { id: "low-angle", label: "Low hero angle", yaw: 15, elevation: -20, focal: 50, canvas: "portrait" },
  { id: "lying", label: "Lying flat", pitch: -90, elevation: 40, focal: 50, canvas: "portrait" },
  { id: "lying-rotated", label: "Lying, rotated", pitch: -90, yaw: -30, elevation: 55, focal: 50, canvas: "square" },
  { id: "iso-l", label: "Isometric left", pitch: -90, yaw: 90, elevation: ISO_ELEVATION, azimuth: 45, focal: "ortho", canvas: "square" },
  { id: "iso-r", label: "Isometric right", pitch: -90, elevation: ISO_ELEVATION, azimuth: 45, focal: "ortho", canvas: "square" },
  { id: "landscape", label: "Landscape", roll: 90, focal: 85, canvas: "landscape" },
  { id: "landscape-three-quarter", label: "Landscape three-quarter", roll: 90, yaw: 30, elevation: 8, focal: 50, canvas: "landscape" },
  { id: "close-top", label: "Close-up, top half", yaw: 25, focal: 50, canvas: "portrait", crop: "top" },
  { id: "back-three-quarter", label: "Back three-quarter", yaw: 215, elevation: 8, focal: 50, canvas: "portrait" },
  { id: "back", label: "Back", yaw: 180, focal: 85, canvas: "portrait" },
];

export const angleById = (id: string): Angle => ANGLES.find((a) => a.id === id) ?? ANGLES[0];

/** Width / height of each canvas shape. */
export const CANVAS_ASPECT: Record<Angle["canvas"], number> = { portrait: 2 / 3, landscape: 3 / 2, square: 1 };

const rad = THREE.MathUtils.degToRad;
const AXIS = { x: new THREE.Vector3(1, 0, 0), y: new THREE.Vector3(0, 1, 0), z: new THREE.Vector3(0, 0, 1) };

/** Roll first, then pitch, then yaw about the world vertical. */
export function angleQuaternion(a: Pose): THREE.Quaternion {
  const yaw = new THREE.Quaternion().setFromAxisAngle(AXIS.y, rad(a.yaw ?? 0));
  const pitch = new THREE.Quaternion().setFromAxisAngle(AXIS.x, rad(a.pitch ?? 0));
  const roll = new THREE.Quaternion().setFromAxisAngle(AXIS.z, rad(a.roll ?? 0));
  return yaw.multiply(pitch).multiply(roll);
}

/** Direction from the target to the camera. */
function cameraDirection(a: Lens): THREE.Vector3 {
  const el = rad(a.elevation ?? 0);
  const az = rad(a.azimuth ?? 0);
  return new THREE.Vector3(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el));
}

/**
 * Points the camera along the lens direction and fits the points into the
 * frame with `margin` (a fraction of the canvas) on the limiting sides,
 * centred. Perspective: a few rounds of re-centring and re-distancing, which
 * converge because the projected size scales with 1/distance. `zoom` > 1
 * then moves in from that fit (a push-in).
 */
export function frameCamera(
  a: Lens,
  points: THREE.Vector3[],
  aspect: number,
  margin: number,
  persp: THREE.PerspectiveCamera,
  ortho: THREE.OrthographicCamera,
  zoom = 1,
): THREE.Camera {
  const dir = cameraDirection(a);
  const centre = new THREE.Vector3();
  points.forEach((p) => centre.add(p));
  centre.divideScalar(points.length);
  const fill = 1 - 2 * margin;

  if (a.focal === "ortho") {
    const fwd = dir.clone().negate();
    const right = new THREE.Vector3().crossVectors(fwd, AXIS.y).normalize();
    const up = new THREE.Vector3().crossVectors(right, fwd);
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const p of points) {
      const v = p.clone().sub(centre);
      const x = v.dot(right);
      const y = v.dot(up);
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    const halfH = Math.max((maxY - minY) / 2, (maxX - minX) / 2 / aspect) / fill / zoom;
    const target = centre.clone().addScaledVector(right, cx).addScaledVector(up, cy);
    ortho.left = -halfH * aspect;
    ortho.right = halfH * aspect;
    ortho.top = halfH;
    ortho.bottom = -halfH;
    ortho.near = 1;
    ortho.far = 200;
    ortho.position.copy(target).addScaledVector(dir, 100);
    ortho.up.set(0, 1, 0);
    ortho.lookAt(target);
    ortho.updateProjectionMatrix();
    ortho.updateMatrixWorld();
    return ortho;
  }

  // 35 mm-equivalent: the focal length covers 36 mm on the long side.
  const longFov = 2 * Math.atan(36 / (2 * a.focal));
  persp.fov = THREE.MathUtils.radToDeg(aspect >= 1 ? 2 * Math.atan(Math.tan(longFov / 2) / aspect) : longFov);
  persp.aspect = aspect;
  const target = centre.clone();
  let dist = 60;
  const place = () => {
    persp.near = Math.max(0.5, dist - 30);
    persp.far = dist + 30;
    persp.position.copy(target).addScaledVector(dir, dist);
    persp.up.set(0, 1, 0);
    persp.lookAt(target);
    persp.updateProjectionMatrix();
    persp.updateMatrixWorld();
  };
  const ndc = new THREE.Vector3();
  for (let i = 0; i < 24; i++) {
    place();
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const p of points) {
      ndc.copy(p).project(persp);
      minX = Math.min(minX, ndc.x);
      maxX = Math.max(maxX, ndc.x);
      minY = Math.min(minY, ndc.y);
      maxY = Math.max(maxY, ndc.y);
    }
    const halfH = dist * Math.tan(rad(persp.fov) / 2);
    const right = new THREE.Vector3().setFromMatrixColumn(persp.matrixWorld, 0);
    const up = new THREE.Vector3().setFromMatrixColumn(persp.matrixWorld, 1);
    target.addScaledVector(right, ((minX + maxX) / 2) * halfH * aspect).addScaledVector(up, ((minY + maxY) / 2) * halfH);
    dist *= Math.max((maxX - minX) / 2, (maxY - minY) / 2) / fill;
  }
  dist /= zoom;
  place();
  return persp;
}
