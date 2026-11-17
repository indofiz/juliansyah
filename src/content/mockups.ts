import type { DeviceStill } from "./types";

/**
 * Studio stills (docs/plans/phone-3d-on-site.md). Made in /studio: pill front,
 * graphite, glass 1.0, angle as named, "Library files" at 1600 px, cropped to
 * the phone. The numbers are the export JSON's canvas size and `quadPx`.
 * Re-export both files together if the phone changes. No glare image: the
 * sheen is drawn in CSS (.device-screen::after), which saves ~33 KB.
 * Other angles (e.g. three-quarter left, used on the card until 2026-11-16)
 * can be exported again from /studio.
 */

/** A 9:19.5 phone in points (430 × 932), the size content is laid out at. */
const PHONE_SCREEN = { width: 430, height: 932 };

/** An 11-inch tablet in portrait, in points (834 × 1194), like presensi-mobile's SHOT_DEVICE=tablet screenshots. */
const TABLET_SCREEN = { width: 834, height: 1194 };

export const presensiStills = {
  front: {
    src: "/projects/presensi-pkp/phone-front.png",
    mask: "/projects/presensi-pkp/phone-front-mask.webp",
    width: 644,
    height: 1346,
    quad: [[17.982, 16.929], [623.586, 16.929], [623.586, 1329.071], [17.982, 1329.071]],
    screen: PHONE_SCREEN,
  },
  // Studio front "tablet", graphite, front angle, library files at 1600 px, cropped (2026-11-16).
  tablet: {
    src: "/projects/presensi-pkp/tablet-front.png",
    mask: "/projects/presensi-pkp/tablet-front-mask.webp",
    width: 902,
    height: 1256,
    quad: [[36.569, 35.913], [863.705, 35.913], [863.705, 1220.087], [36.569, 1220.087]],
    screen: TABLET_SCREEN,
  },
} satisfies Record<string, DeviceStill>;
