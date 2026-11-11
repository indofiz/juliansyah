import type { CSSProperties } from "react";
import { bentoArt } from "@/content/site";
import { theme } from "@/lib/theme";
import { Icon } from "../ui/Icon";

/*
 * Bento card illustrations. Each one is a small, fixed-size "stage" designed
 * in rem (see STAGE_SIZES); BentoFx scales it to fit its card. Everything that
 * moves is CSS in src/styles/bento.css, keyed off the card being hovered
 * (desktop) or in view (touch): `.bento-card:is(:hover, .is-active)`.
 */

/** Design size of each stage, in rem: [width, height]. */
export const STAGE_SIZES = {
  flutter: [27, 28],
  uiux: [27, 17],
  frontend: [27, 17],
  motion: [24, 9.5],
  perf: [24, 9.5],
} as const;

const F = bentoArt.flutter;
const U = bentoArt.uiux;
const FE = bentoArt.frontend;

const v = (vars: Record<string, string | number>) => vars as CSSProperties;

function Cursor() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" style={{ width: "1rem", height: "1rem" }} aria-hidden="true">
      <path d="M2.2 1.6 13.6 8.2 8.4 9.4 6.2 14.3Z" fill="currentColor" style={{ stroke: theme.accentInk }} strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}

function Landscape() {
  return (
    <>
      <span className="ls-sun" />
      <span className="ls-mtn ls-mtn--back" />
      <span className="ls-mtn" />
    </>
  );
}

/* ---------------------------------------------------------------- Flutter */
function DummyHome() {
  return (
    <div className="fl-screen">
      <div className="fl-appbar">
        <div>
          <small>{F.home.greeting}</small>
          <b>{F.home.title}</b>
        </div>
        <span className="fl-avatar" />
      </div>
      <div className="fl-search">
        <Icon name="search" size={9} /> {F.home.search}
      </div>
      <div className="fl-hero">
        <Landscape />
        <div className="fl-hero-text">
          <b>{F.home.hero}</b>
          <small>{F.home.heroSub}</small>
        </div>
      </div>
      <div className="fl-cats">
        {F.home.tabs.map((t, k) => (
          <span key={t} className={k === 0 ? "on" : ""}>
            {t}
          </span>
        ))}
      </div>
      <div className="fl-tile">
        <span className="fl-thumb" />
        <div>
          <b>{F.home.tile}</b>
          <small>{F.home.tileSub}</small>
        </div>
        <Icon name="heart" size={10} className="fl-fav" />
      </div>
    </div>
  );
}

function DummyDetail() {
  return (
    <div className="fl-screen fl-screen--detail">
      <div className="fl-detail-img">
        <Landscape />
        <span className="fl-round fl-round--l">
          <Icon name="arrowLeft" size={10} />
        </span>
        <span className="fl-round fl-round--r">
          <Icon name="heart" size={10} />
        </span>
      </div>
      <div className="fl-detail-body">
        <b>{F.detail.title}</b>
        <small>
          <Icon name="mapPin" size={8} /> {F.detail.place}
        </small>
        <i style={{ width: "100%" }} />
        <i style={{ width: "92%" }} />
        <i style={{ width: "68%" }} />
        <div className="fl-row">
          <div className="fl-price">
            <small>{F.detail.priceLabel}</small>
            <b>{F.detail.price}</b>
          </div>
          <span className="fl-cta">{F.detail.cta}</span>
        </div>
      </div>
    </div>
  );
}

export function ArtFlutter() {
  const real = F.screens.length >= 2;
  return (
    <div className="stage fl">
      <span className="fl-glow" />
      <div className="fl-chips">
        {F.platforms.map((p, k) => (
          <span key={p} style={v({ "--k": k })}>
            {p}
          </span>
        ))}
      </div>

      <div className="fl-device fl-back">
        <div className="fl-viewport">
          <div className="fl-ghost">
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
      </div>

      <div className="fl-device fl-main">
        <span className="fl-notch" />
        <div className="fl-viewport">
          <div className="fl-status">
            <span>{F.clock}</span>
            <span className="fl-status-icons">
              <i />
              <i />
              <i />
            </span>
          </div>
          <div className="fl-screens">
            {real ? (
              F.screens.slice(0, 2).map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={src} className="fl-shot" src={src} alt="" />
              ))
            ) : (
              <>
                <DummyHome />
                <DummyDetail />
              </>
            )}
          </div>
          {!real && (
            <nav className="fl-nav">
              <span className="on">
                <Icon name="home" size={11} />
              </span>
              <span>
                <Icon name="search" size={11} />
              </span>
              <span>
                <Icon name="heart" size={11} />
              </span>
              <span>
                <Icon name="user" size={11} />
              </span>
            </nav>
          )}
          <div className="fl-toast">
            <Icon name="zap" size={9} /> {F.toast}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- UI/UX */
export function ArtUiux() {
  return (
    <div className="stage ux">
      <span className="ux-label">
        <Icon name="frame" size={9} /> {U.frame}
      </span>
      <div className="ux-frame">
        <div className="ux-bar">
          <i />
          <i />
        </div>
        <div className="ux-img">
          <span className="ux-img-hi">
            <Landscape />
          </span>
        </div>
        <div className="ux-lines">
          <i />
          <i />
          <i />
        </div>
        <div className="ux-btn">{U.button}</div>
        <span className="ux-guide">
          <em>{U.spacing}</em>
        </span>
      </div>
      <div className="ux-sel">
        <i />
        <i />
        <i />
        <i />
        <span>{U.size}</span>
      </div>

      <div className="ux-comment">{U.comment}</div>
      <div className="ux-cur ux-cur--client">
        <Cursor />
        <span>{U.client}</span>
      </div>
      <div className="ux-cur ux-cur--you">
        <Cursor />
        <span>{U.you}</span>
      </div>

      <div className="ux-tools">
        <span className="on">
          <Icon name="pointer" size={11} />
        </span>
        <span>
          <Icon name="frame" size={11} />
        </span>
        <span>
          <Icon name="square" size={11} />
        </span>
        <span>
          <Icon name="pen" size={11} />
        </span>
        <span>
          <Icon name="type" size={11} />
        </span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Front-end */
type Tok = [cls: string, text: string];
const CODE: Tok[][] = FE.code;
const CHAR_S = 0.0085; // seconds per typed character
const LINE_GAP_S = 0.05;

/** Typing schedule: each line starts when the previous one finishes. */
const LINES = CODE.reduce<{ toks: Tok[]; chars: number; delay: number; dur: number }[]>((acc, toks) => {
  const prev = acc[acc.length - 1];
  const chars = toks.reduce((a, [, t]) => a + t.length, 0);
  const delay = prev ? prev.delay + prev.dur + LINE_GAP_S : 0.15;
  acc.push({ toks, chars, delay, dur: Math.max(0.08, chars * CHAR_S) });
  return acc;
}, []);

export function ArtFrontend() {
  const lines = LINES;
  return (
    <div className="stage fe">
      <div className="fe-editor">
        <div className="fe-tabs">
          <span className="fe-dots">
            <i />
            <i />
            <i />
          </span>
          <span className="fe-tab on">{FE.tabs[0]}</span>
          <span className="fe-tab">{FE.tabs[1]}</span>
        </div>
        <div className="fe-code">
          {lines.map((l, i) => (
            <div className="fe-line" key={i}>
              <span className="ln">{i + 1}</span>
              <span
                className="fe-txt"
                style={v({ "--d": `${l.delay.toFixed(2)}s`, "--t": `${l.dur.toFixed(2)}s`, "--n": Math.max(2, l.chars) })}
              >
                {l.toks.map(([c, t], k) => (
                  <span key={k} className={c}>
                    {t}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="fe-prev">
        <div className="fe-bar">
          <span className="fe-dots">
            <i />
            <i />
            <i />
          </span>
          <span className="fe-url">
            <Icon name="lock" size={7} /> {FE.url}
          </span>
        </div>
        <div className="fe-page">
          <div className="fe-skel">
            <i />
            <i />
          </div>
          <div className="fe-btn">
            <span className="fe-btn-a">{FE.button}</span>
            <span className="fe-btn-b">
              <Icon name="check" size={10} /> {FE.done}
            </span>
            <span className="fe-ripple" />
          </div>
        </div>
      </div>
      <div className="fe-cur">
        <Cursor />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Motion */
export function ArtMotion() {
  return (
    <div className="stage mo">
      <div className="mo-graph">
        <div className="mo-plot">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 100 L100 0" className="mo-linear" />
            <path d="M0 100 C65 100 35 0 100 0" className="mo-curve" />
          </svg>
          <span className="mo-x">
            <span className="mo-dot" />
          </span>
        </div>
        <small>{bentoArt.motion.curve}</small>
      </div>
      <div className="mo-ui">
        <span className="mo-heart">
          {Array.from({ length: 8 }, (_, k) => (
            <i key={k} style={v({ "--a": `${k * 45}deg` })} />
          ))}
          <Icon name="heart" size={20} />
        </span>
        <span className="mo-toggle">
          <i />
        </span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Performance */
export function ArtPerf() {
  return (
    <div className="stage pf">
      {bentoArt.perf.map(({ label, score }, k) => (
        <div className="pf-item" key={label} style={v({ "--v": score, "--k": k })}>
          <div className="pf-ring">
            <svg viewBox="0 0 36 36" aria-hidden="true">
              <circle cx="18" cy="18" r="15.5" className="pf-track" pathLength={100} />
              <circle cx="18" cy="18" r="15.5" className="pf-arc" pathLength={100} strokeDasharray="100" strokeDashoffset={100 - score} />
            </svg>
            <span className="pf-num" />
          </div>
          <small>{label}</small>
        </div>
      ))}
    </div>
  );
}

export const ARTS = {
  flutter: ArtFlutter,
  uiux: ArtUiux,
  frontend: ArtFrontend,
  motion: ArtMotion,
  perf: ArtPerf,
} as const;
