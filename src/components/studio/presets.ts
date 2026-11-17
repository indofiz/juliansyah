import type { Lens, Pose } from "./angles";
import type { ScreenShot } from "./screen";

/** What a preset knows about the loaded screens. */
export type PresetContext = {
  /** How many screens are loaded (0 = test card). */
  screens: number;
  /** The screen picked in the studio. */
  selected: number;
  /** The picked screen is a page taller than the display (a `_full` screenshot). */
  tall: boolean;
};

export type VideoFrame = { pose: Pose; zoom: number; shot: ScreenShot };

export type VideoPreset = {
  id: string;
  label: string;
  /** The last frame leads straight back into the first. */
  loop: boolean;
  lens: Lens;
  /**
   * Whether the framing makes room for the phone's lift. Off for the reveal,
   * so the phone can rise in from below the frame.
   */
  fitLift: boolean;
  duration(c: PresetContext): number;
  frame(t: number, c: PresetContext): VideoFrame;
};

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
/** 0 → 1 as t goes from a to b. */
const span = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const easeOut = (x: number) => 1 - (1 - x) ** 3;
const easeInOut = (x: number) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2);
const lerp = (a: number, b: number, x: number) => a + (b - a) * x;
const TAU = Math.PI * 2;

const SCREEN_SECONDS = 3;
const SLIDE_SECONDS = 0.55;

export const VIDEO_PRESETS: VideoPreset[] = [
  {
    id: "float-loop",
    label: "Float loop · 6 s",
    loop: true,
    lens: { elevation: 6, focal: 50 },
    fitLift: true,
    duration: () => 6,
    frame: (t, c) => {
      const w = (TAU * t) / 6;
      return {
        pose: { yaw: -22 + 6 * Math.sin(w), pitch: 2.5 * Math.cos(w), roll: -2 * Math.sin(w + Math.PI / 3), lift: 0.3 * Math.sin(w) },
        zoom: 1,
        shot: { kind: "show", index: c.selected },
      };
    },
  },
  {
    id: "turntable",
    label: "Turntable · 8 s",
    loop: true,
    lens: { elevation: 10, focal: 50 },
    fitLift: true,
    duration: () => 8,
    frame: (t, c) => ({ pose: { yaw: -20 + (360 * t) / 8 }, zoom: 1, shot: { kind: "show", index: c.selected } }),
  },
  {
    id: "hero-reveal",
    label: "Hero reveal · 5 s",
    loop: false,
    lens: { elevation: 6, focal: 50 },
    fitLift: false,
    duration: () => 5,
    frame: (t, c) => {
      // Rises in from below while turning from its back to three-quarter;
      // the screen switches on as it arrives, then a slow drift.
      const turn = easeOut(span(t, 0, 3.4));
      const rise = easeOut(span(t, 0, 2.4));
      const drift = Math.sin((TAU * Math.max(0, t - 3.4)) / 8);
      return {
        pose: { yaw: lerp(160, -22, turn) + 2 * drift, roll: lerp(8, 0, easeOut(span(t, 0, 3))), pitch: lerp(10, 0, turn), lift: lerp(-14, 0, rise) },
        zoom: 1,
        shot: { kind: "show", index: c.selected, power: easeOut(span(t, 2.6, 3.2)) },
      };
    },
  },
  {
    id: "screen-tour",
    label: "Screen tour · 3 s per screen",
    loop: false,
    lens: { elevation: 6, focal: 50 },
    fitLift: true,
    duration: (c) => Math.max(2, c.screens) * SCREEN_SECONDS,
    frame: (t, c) => {
      const T = Math.max(2, c.screens) * SCREEN_SECONDS;
      const n = Math.max(1, c.screens);
      const i = Math.min(n - 1, Math.floor(t / SCREEN_SECONDS));
      const into = t - i * SCREEN_SECONDS;
      const slideAt = SCREEN_SECONDS - SLIDE_SECONDS;
      const shot: ScreenShot =
        i < n - 1 && into > slideAt ? { kind: "slide", from: i, to: i + 1, p: easeInOut(span(into, slideAt, SCREEN_SECONDS)) } : { kind: "show", index: i };
      return { pose: { yaw: -18 + 3 * Math.sin((TAU * t) / T), lift: 0.15 * Math.sin((TAU * t) / T) }, zoom: lerp(1, 1.14, easeInOut(t / T)), shot };
    },
  },
  {
    id: "scroll",
    label: "Scroll a long page · 7 s",
    loop: false,
    lens: { elevation: 4, focal: 50 },
    fitLift: true,
    duration: () => 7,
    frame: (t, c) => ({
      pose: { yaw: -16 + 2 * Math.sin((TAU * t) / 14) },
      zoom: 1.04,
      shot: { kind: "show", index: c.selected, scroll: c.tall ? easeInOut(span(t, 0.8, 6.2)) : 0 },
    }),
  },
];

export const presetById = (id: string): VideoPreset => VIDEO_PRESETS.find((p) => p.id === id) ?? VIDEO_PRESETS[0];

/** Video shapes. */
export const VIDEO_SIZES = {
  "16:9": { width: 1920, height: 1080 },
  "9:16": { width: 1080, height: 1920 },
  "1:1": { width: 1080, height: 1080 },
} as const;
export type VideoSize = keyof typeof VIDEO_SIZES;
