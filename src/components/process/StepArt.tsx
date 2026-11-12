import type { CSSProperties, JSX, ReactNode } from "react";
import type { ProcessStep } from "@/content/types";

/*
 * The illustrations on the How I work globe, one per step. Line art on a
 * 120×120 grid, painted with the accent tokens (sections.css, "Step art").
 *
 * Each one draws itself in when its step lights up (.played, set by
 * ScrollFx), then keeps one small loop going. Without .played, and with
 * reduced motion, every shape simply sits in its finished state.
 *
 * Classes (sa- = step art):
 *   sa-draw   stroke draws on (needs pathLength={1})
 *   sa-fade / sa-pop / sa-grow / sa-rise / sa-cursor   other entrances
 *   sa-gone   fades out (the wireframe's X once the design is in)
 *   --t       when it starts, in seconds after the step lights up
 *   paint: sa-hot (amber stroke), sa-dim, sa-thin, sa-bold, sa-card (dark
 *   fill), sa-soft (amber tint), sa-solid (amber), sa-cream, sa-ink (dark
 *   check mark on amber)
 * Every shape is a <path>: Safari only honours pathLength on paths.
 */

/** Start time (and index for staggered loops) as CSS variables. */
const at = (t: number, i?: number) => ({ "--t": `${t}s`, ...(i === undefined ? {} : { "--i": i }) }) as CSSProperties;

function Svg({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}

/** 01 Discover: the call (bubble + live waveform) becomes the written scope:
 *  a document with a row each for users, goals and deadline, signed off. */
function DiscoverArt() {
  const doc = "M62 56 H100 Q106 56 106 62 V104 Q106 110 100 110 H62 Q56 110 56 104 V62 Q56 56 62 56 Z";
  const bars = ["M25 31 V37", "M32 27 V41", "M39 24 V44", "M46 28 V40", "M53 31 V37"];
  return (
    <Svg>
      <g transform="translate(-2 -4)">
        <path className="sa-draw" pathLength={1} style={at(0)} d="M20 16 H58 Q66 16 66 24 V44 Q66 52 58 52 H34 L22 62 L24 52 H20 Q12 52 12 44 V24 Q12 16 20 16 Z" />
        {bars.map((d, i) => (
          <g key={d} className="sa-wave" style={at(0, i)}>
            <path className="sa-draw sa-hot" pathLength={1} style={at(0.35 + i * 0.05)} d={d} />
          </g>
        ))}

        <path className="sa-fade sa-card" style={at(0.6)} d={doc} />
        <path className="sa-draw" pathLength={1} style={at(0.6)} d={doc} />
        <path className="sa-draw sa-bold" pathLength={1} style={at(0.9)} d="M64 66 H84" />
        {/* users */}
        <path className="sa-draw sa-thin" pathLength={1} style={at(1)} d="M63.8 75.5 a2.2 2.2 0 1 0 4.4 0 a2.2 2.2 0 1 0 -4.4 0" />
        <path className="sa-draw sa-thin" pathLength={1} style={at(1.05)} d="M62 81.5 Q62 78.2 66 78.2 Q70 78.2 70 81.5" />
        <path className="sa-draw sa-thin sa-dim" pathLength={1} style={at(1.1)} d="M76 78 H98" />
        {/* goals */}
        <path className="sa-draw sa-thin" pathLength={1} style={at(1.15)} d="M62 90 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0" />
        <path className="sa-pop sa-solid" style={at(1.3)} d="M64.8 90 a1.2 1.2 0 1 0 2.4 0 a1.2 1.2 0 1 0 -2.4 0" />
        <path className="sa-draw sa-thin sa-dim" pathLength={1} style={at(1.25)} d="M76 90 H94" />
        {/* deadline */}
        <path className="sa-draw sa-thin" pathLength={1} style={at(1.3)} d="M62 102 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0" />
        <path className="sa-draw sa-thin" pathLength={1} style={at(1.4)} d="M66 99.6 V102 H68.2" />
        <path className="sa-draw sa-thin sa-dim" pathLength={1} style={at(1.4)} d="M76 102 H90" />
        {/* signed off */}
        <g className="sa-pop" style={at(1.65)}>
          <path className="sa-solid" d="M95 56 a9 9 0 1 0 18 0 a9 9 0 1 0 -18 0" />
          <path className="sa-ink" d="M99.5 56 L102.8 59.3 L108.5 52.8" />
        </g>
      </g>
    </Svg>
  );
}

/** 02 Design: tokens first (swatches), a wireframe on a phone, the same
 *  screen in those colours, then a cursor clicks through it. */
function DesignArt() {
  const phone = "M33 10 H59 Q68 10 68 19 V101 Q68 110 59 110 H33 Q24 110 24 101 V19 Q24 10 33 10 Z";
  const header = "M33 24 H59 Q62 24 62 27 Q62 30 59 30 H33 Q30 30 30 27 Q30 24 33 24 Z";
  const image = "M33 36 H59 Q62 36 62 39 V57 Q62 60 59 60 H33 Q30 60 30 57 V39 Q30 36 33 36 Z";
  const button = "M35 86 H57 Q62 86 62 91 Q62 96 57 96 H35 Q30 96 30 91 Q30 86 35 86 Z";
  return (
    <Svg>
      <g transform="translate(2 0)">
        <path className="sa-fade sa-card" style={at(0)} d={phone} />
        <path className="sa-draw" pathLength={1} style={at(0)} d={phone} />
        <path className="sa-draw sa-thin" pathLength={1} style={at(0.3)} d="M41 16.5 H51" />
        {/* the design system's tokens */}
        <path className="sa-pop sa-solid" style={at(0.45)} d="M81 34 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0" />
        <path className="sa-pop sa-cream" fillOpacity={0.75} style={at(0.55)} d="M81 52 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0" />
        <path className="sa-pop" style={at(0.65)} d="M81 70 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0" />
        {/* wireframe */}
        <path className="sa-draw sa-thin sa-dim" pathLength={1} style={at(0.5)} d={header} />
        <path className="sa-draw sa-thin sa-dim" pathLength={1} style={at(0.6)} d={image} />
        <g className="sa-gone" style={at(1.35)}>
          <path className="sa-draw sa-thin sa-dim" pathLength={1} style={at(0.75)} d="M31.5 37.5 L60.5 58.5 M60.5 37.5 L31.5 58.5" />
        </g>
        <path className="sa-draw sa-thin sa-dim" pathLength={1} style={at(0.8)} d="M30 68 H56" />
        <path className="sa-draw sa-thin sa-dim" pathLength={1} style={at(0.85)} d="M30 75 H48" />
        <path className="sa-draw sa-thin sa-dim" pathLength={1} style={at(0.9)} d={button} />
        {/* the same screen, designed */}
        <path className="sa-fade sa-cream" fillOpacity={0.75} style={at(1.3)} d={header} />
        <path className="sa-fade sa-soft" style={at(1.4)} d={image} />
        <path className="sa-fade sa-solid" fillOpacity={0.55} style={at(1.5)} d="M30 57 L40 48 L46 53 L53 46 L62 55 V57 Q62 60 59 60 H33 Q30 60 30 57 Z" />
        <path className="sa-fade sa-cream" style={at(1.5)} d="M35 43 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0" />
        <path className="sa-fade sa-solid" style={at(1.6)} d={button} />
        {/* click through it */}
        <path className="sa-ripple sa-hot sa-thin" d="M36 91 a10 10 0 1 0 20 0 a10 10 0 1 0 -20 0" />
        <g transform="translate(51 91)">
          <g className="sa-cursor" style={at(1.8)}>
            <g className="sa-tap">
              <path className="sa-card sa-thin" d="M0 0 L0 15 L4 11.5 L7 18 L10 16.6 L7 10.3 L12 10.3 Z" />
            </g>
          </g>
        </g>
      </g>
    </Svg>
  );
}

/** 03 Build: code in a browser (React / Next.js) and the same card on a
 *  phone (Flutter), joined by one shared token; a test build passes. */
function BuildArt() {
  const browser = "M14 16 H80 Q86 16 86 22 V72 Q86 78 80 78 H14 Q8 78 8 72 V22 Q8 16 14 16 Z";
  const phone = "M73 40 H93 Q100 40 100 47 V101 Q100 108 93 108 H73 Q66 108 66 101 V47 Q66 40 73 40 Z";
  const card = "M75 52 H91 Q94 52 94 55 V67 Q94 70 91 70 H75 Q72 70 72 67 V55 Q72 52 75 52 Z";
  return (
    <Svg>
      <g transform="translate(5 -2)">
        <path className="sa-draw" pathLength={1} style={at(0)} d={browser} />
        <path className="sa-draw sa-thin" pathLength={1} style={at(0.25)} d="M8 27 H86" />
        <path
          className="sa-fade sa-cream"
          style={at(0.3)}
          d="M13.1 21.5 a1.4 1.4 0 1 0 2.8 0 a1.4 1.4 0 1 0 -2.8 0 M18.1 21.5 a1.4 1.4 0 1 0 2.8 0 a1.4 1.4 0 1 0 -2.8 0 M23.1 21.5 a1.4 1.4 0 1 0 2.8 0 a1.4 1.4 0 1 0 -2.8 0"
        />
        {/* code */}
        <path className="sa-draw sa-hot" pathLength={1} style={at(0.4)} d="M16 37 H22" />
        <path className="sa-draw sa-thin" pathLength={1} style={at(0.5)} d="M26 37 H46" />
        <path className="sa-draw sa-thin" pathLength={1} style={at(0.6)} d="M22 46 H40" />
        <path className="sa-pop sa-solid" style={at(0.75)} d="M42.8 46 a2.4 2.4 0 1 0 4.8 0 a2.4 2.4 0 1 0 -4.8 0" />
        <path className="sa-draw sa-thin" pathLength={1} style={at(0.7)} d="M22 55 H50" />
        <path className="sa-draw sa-thin" pathLength={1} style={at(0.8)} d="M16 64 H30" />
        <path className="sa-caret sa-hot sa-thin" d="M54.5 51 V59" />
        {/* the same card on a phone */}
        <path className="sa-fade sa-card" style={at(0.8)} d={phone} />
        <path className="sa-draw" pathLength={1} style={at(0.8)} d={phone} />
        <path className="sa-draw sa-thin" pathLength={1} style={at(1)} d="M79 45.5 H87" />
        <path className="sa-fade sa-soft" style={at(1.1)} d={card} />
        <path className="sa-draw sa-thin" pathLength={1} style={at(1.05)} d={card} />
        <path className="sa-pop sa-solid" style={at(1.2)} d="M75.1 57.5 a2.4 2.4 0 1 0 4.8 0 a2.4 2.4 0 1 0 -4.8 0" />
        <path className="sa-draw sa-thin" pathLength={1} style={at(1.15)} d="M72 78 H94" />
        <path className="sa-draw sa-thin sa-dim" pathLength={1} style={at(1.2)} d="M72 85 H88" />
        {/* one token, two platforms */}
        <g className="sa-fade" style={at(1.3)}>
          <path className="sa-flow sa-hot sa-thin" d="M48.5 46 C58 46 64 57.5 74 57.5" />
        </g>
        {/* a test build */}
        <path className="sa-draw sa-thin" pathLength={1} style={at(1.2)} d="M12 90 H48 Q52 90 52 94 Q52 98 48 98 H12 Q8 98 8 94 Q8 90 12 90 Z" />
        <path className="sa-grow sa-solid" style={at(1.4)} d="M12 92 H48 Q50 92 50 94 Q50 96 48 96 H12 Q10 96 10 94 Q10 92 12 92 Z" />
        <g className="sa-pop" style={at(2.25)}>
          <path className="sa-solid" d="M53 94 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0" />
          <path className="sa-ink sa-thin" d="M56 94 L58.2 96.2 L62 91.8" />
        </g>
      </g>
    </Svg>
  );
}

/** 04 Launch: tested on a real device (phone + check), released (a rocket
 *  takes off from it), looked after (a live heartbeat). */
function LaunchArt() {
  const phone = "M25 50 H45 Q52 50 52 57 V103 Q52 110 45 110 H25 Q18 110 18 103 V57 Q18 50 25 50 Z";
  const app = "M31 66 H39 Q43 66 43 70 V78 Q43 82 39 82 H31 Q27 82 27 78 V70 Q27 66 31 66 Z";
  const heartbeat = "M60 98 H70 L74 90 L79 106 L84 86 L88 98 H100";
  const stars = ["M62 16 V24 M58 20 H66", "M108 48 V54 M105 51 H111", "M46 22 V27 M43.5 24.5 H48.5"];
  return (
    <Svg>
      <g transform="translate(-3 -3)">
        <path className="sa-fade sa-card" style={at(0)} d={phone} />
        <path className="sa-draw" pathLength={1} style={at(0)} d={phone} />
        <path className="sa-draw sa-thin" pathLength={1} style={at(0.25)} d="M31 55.5 H39" />
        <path className="sa-fade sa-soft" style={at(0.35)} d={app} />
        <path className="sa-draw sa-thin" pathLength={1} style={at(0.3)} d={app} />
        <path className="sa-draw sa-thin sa-dim" pathLength={1} style={at(0.4)} d="M27 90 H43" />
        <path className="sa-draw sa-thin sa-dim" pathLength={1} style={at(0.45)} d="M27 96 H38" />
        {/* tested on a real device */}
        <g className="sa-pop" style={at(0.6)}>
          <path className="sa-solid" d="M44 52 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0" />
          <path className="sa-ink" d="M48 52 L51 55 L56.5 49" />
        </g>
        {/* released */}
        <g className="sa-fade" style={at(0.85)}>
          <path className="sa-flow sa-thin sa-hot" d="M33 44 C36 28 54 30 67 47" />
        </g>
        <g transform="translate(86 32) rotate(40) scale(1.15)">
          <g className="sa-rise" style={at(0.9)}>
            <g className="sa-bob">
              <path className="sa-flame sa-solid" d="M-4 10 Q0 22 4 10 Z" />
              <path className="sa-card" d="M0 -20 C7.5 -13 8.5 -2 7 8 H-7 C-8.5 -2 -7.5 -13 0 -20 Z" />
              <path className="sa-thin" d="M-7 1 L-12.5 10 L-7 8 M7 1 L12.5 10 L7 8" />
              <path className="sa-hot sa-thin" d="M-3.2 -6 a3.2 3.2 0 1 0 6.4 0 a3.2 3.2 0 1 0 -6.4 0" />
            </g>
          </g>
        </g>
        {stars.map((d, i) => (
          <path key={d} className="sa-twinkle sa-thin" style={at(0, i)} d={d} />
        ))}
        {/* looked after once it's live */}
        <path className="sa-draw sa-dim" pathLength={1} style={at(1.5)} d={heartbeat} />
        <path className="sa-beat sa-hot" pathLength={1} d={heartbeat} />
        <path className="sa-live sa-solid" d="M102.4 98 a2.6 2.6 0 1 0 5.2 0 a2.6 2.6 0 1 0 -5.2 0" />
        <path className="sa-pop sa-solid" style={at(1.9)} d="M102.4 98 a2.6 2.6 0 1 0 5.2 0 a2.6 2.6 0 1 0 -5.2 0" />
      </g>
    </Svg>
  );
}

/** Step id (site.ts → howIWork.steps) → its illustration. */
export const STEP_ART: Record<ProcessStep["id"], () => JSX.Element> = {
  discover: DiscoverArt,
  design: DesignArt,
  build: BuildArt,
  launch: LaunchArt,
};
