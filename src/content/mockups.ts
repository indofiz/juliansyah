import type { DeviceStill } from "./types";

/**
 * Studio stills (docs/plans/phone-3d-on-site.md). Made in /studio: pill front,
 * graphite, glass 1.0, angle as named, "Library files" at 1600 px, cropped to
 * the phone. The numbers are the export JSON's canvas size and `quadPx`.
 * Re-export both files together if the phone changes. No glare image: the
 * sheen is drawn in CSS (.device-screen::after), which saves ~33 KB.
 */

/** A 9:19.5 phone in points (430 × 932), the size content is laid out at. */
const PHONE_SCREEN = { width: 430, height: 932 };

export const presensiStills = {
  threeQuarter: {
    src: "/projects/presensi-pkp/phone-three-quarter-l.png",
    mask: "/projects/presensi-pkp/phone-three-quarter-l-mask.webp",
    width: 575,
    height: 1345,
    quad: [[10.453, 56.653], [531.308, 12.784], [511.614, 1343.337], [30.211, 1228.266]],
    screen: PHONE_SCREEN,
  },
  front: {
    src: "/projects/presensi-pkp/phone-front.png",
    mask: "/projects/presensi-pkp/phone-front-mask.webp",
    width: 644,
    height: 1346,
    quad: [[17.982, 16.929], [623.586, 16.929], [623.586, 1329.071], [17.982, 1329.071]],
    screen: PHONE_SCREEN,
  },
} satisfies Record<string, DeviceStill>;
