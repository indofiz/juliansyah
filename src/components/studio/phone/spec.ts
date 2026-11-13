/**
 * The studio phone, in real-world millimetres (buildPhone.ts converts to
 * centimetres, the scene unit). Generic and unbranded on purpose: no logo,
 * and no camera layout copied from a real model.
 */

export type FrontId = "pill" | "punch";
export type ColourwayId = "graphite" | "silver";

/** Shared by both fronts. The body radius is the display radius plus the border, so the curves run parallel. */
export const BODY = {
  width: 72,
  depth: 8,
  /** Rounded edge where the metal frame meets the front and back. */
  edge: 0.8,
  /** Black border round the display. */
  bezel: 1.8,
  displayRadius: 8,
} as const;

export type Cutout =
  | { kind: "pill"; width: number; height: number; centreFromTop: number }
  | { kind: "hole"; diameter: number; centreFromTop: number };

export type Front = {
  id: FrontId;
  label: string;
  /** Display width : height. */
  aspect: [number, number];
  cutout: Cutout;
};

export const FRONTS: Record<FrontId, Front> = {
  // 9:19.5 like 1290×2796 screenshots. The pill is 126×37 pt on a 430×932 pt
  // screen, centred on the status-bar row those screenshots are laid out for.
  pill: {
    id: "pill",
    label: "Pill · 9:19.5",
    aspect: [9, 19.5],
    cutout: { kind: "pill", width: 20, height: 5.9, centreFromTop: 6.2 },
  },
  punch: {
    id: "punch",
    label: "Punch-hole · 9:20",
    aspect: [9, 20],
    cutout: { kind: "hole", diameter: 3, centreFromTop: 4.6 },
  },
};

export type Colourway = {
  id: ColourwayId;
  label: string;
  /** Metal frame, buttons and lens rings (metalness 1, so this is the reflection colour). */
  frame: string;
  frameRoughness: number;
  /** Frosted back glass. */
  back: string;
  backRoughness: number;
  /** Glossy glass on the camera island. */
  island: string;
};

export const COLOURWAYS: Record<ColourwayId, Colourway> = {
  graphite: { id: "graphite", label: "Graphite", frame: "#70737a", frameRoughness: 0.28, back: "#3a3d43", backRoughness: 0.38, island: "#44474d" },
  silver: { id: "silver", label: "Silver", frame: "#e4e6e9", frameRoughness: 0.24, back: "#f0f1f2", backRoughness: 0.4, island: "#dcdee1" },
};

/** Buttons, ports and the back camera, in mm. */
export const DETAILS = {
  button: { protrusion: 0.5, thickness: 2.4 },
  volume: { centreFromTop: 40, length: 24 },
  power: { centreFromTop: 66, length: 14 },
  port: { width: 8.6, height: 2.7 },
  speaker: { count: 6, diameter: 1.1, pitch: 2.1, firstFromCentre: 8.5 },
  micFromCentre: -8.5,
  island: { width: 19, height: 38, radius: 7, inset: 6, raise: 1.1 },
  lens: { ring: 6.4, glass: 4.8, rise: 0.9, firstFromTop: 9.5, pitch: 14 },
  flash: { diameter: 3.4, fromTop: 33.5 },
} as const;
