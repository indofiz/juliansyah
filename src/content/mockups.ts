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

export const presensiStills = {
  front: {
    src: "/projects/presensi-pkp/phone-front.png",
    mask: "/projects/presensi-pkp/phone-front-mask.webp",
    width: 644,
    height: 1346,
    quad: [[17.982, 16.929], [623.586, 16.929], [623.586, 1329.071], [17.982, 1329.071]],
    screen: PHONE_SCREEN,
  },
} satisfies Record<string, DeviceStill>;
