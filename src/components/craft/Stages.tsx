import { designToCode as d } from "@/content/site";
import { highlightDart } from "@/lib/highlight";
import { CheckInCard } from "./CheckInCard";

/*
 * The five stages of the design → code sequence. Each one fills its stage
 * (a CSS size container), so everything inside is sized in cqw.
 * Placeholders until the real artefacts from Presensi PKP replace them:
 * the sketch is drawn in SVG, the wireframe and design are HTML.
 */

/** Pencil sketch: wobbly strokes on dark paper. */
export function SketchStage() {
  return (
    <div className="st st-sketch">
      <svg viewBox="0 0 400 400" aria-hidden="true">
        <g transform="translate(-26 0)">
          <g className="pencil">
            {/* card outline */}
            <path d="M92 52 C160 47 250 49 309 53 C313 140 311 260 308 350 C230 354 160 352 90 349 C88 260 89 140 92 52 Z" />
            {/* header: greeting + time */}
            <path d="M112 78 C140 76 168 79 192 77" />
            <path d="M252 78 C266 77 278 79 290 78" />
            {/* map box with hatching */}
            <path d="M110 112 C170 109 230 111 291 113 C292 150 290 186 291 214 C230 216 170 215 109 213 C111 180 108 145 110 112 Z" />
            <path className="faint" d="M118 200 L150 120 M142 206 L178 118 M170 208 L206 116 M198 210 L232 117 M226 210 L258 118 M254 210 L284 124" />
            {/* geofence + pin */}
            <path className="dash" d="M200 130 C232 129 252 148 251 165 C250 186 228 200 200 199 C172 198 150 184 150 164 C151 146 170 131 200 130 Z" />
            <path d="M200 176 C192 166 192 156 200 152 C208 156 208 166 200 176 Z" />
            {/* status line */}
            <circle cx="118" cy="240" r="5" />
            <path d="M132 240 C170 238 210 241 246 239" />
            {/* button */}
            <path d="M112 280 C170 276 236 278 290 281 C294 296 292 312 289 324 C230 327 170 326 111 323 C108 308 109 294 112 280 Z" />
            {/* arrows to the notes */}
            <path className="faint" d="M318 96 C334 104 340 118 332 132" />
            <path className="faint" d="M326 168 C340 172 346 182 340 194" />
            <path className="faint" d="M300 300 C326 312 338 330 330 352" />
          </g>
          <text x="160" y="309" className="hand">
            {d.wireframe.button}
          </text>
          <text x="96" y="34" className="hand small">
            {d.sketch.title}
          </text>
          <text x="300" y="88" className="hand small">
            {d.sketch.notes[0]}
          </text>
          <text x="300" y="160" className="hand small">
            {d.sketch.notes[1]}
          </text>
          <text x="262" y="374" className="hand small">
            {d.sketch.notes[2]}
          </text>
        </g>
      </svg>
    </div>
  );
}

/** Greyscale wireframe with numbered annotations. */
export function WireframeStage() {
  return (
    <div className="st st-wire">
      <div className="wf-card">
        <div className="wf-row">
          <i className="wf-line" style={{ width: "40%" }} />
          <i className="wf-line" style={{ width: "18%" }} />
        </div>
        <i className="wf-line wf-line--sm" style={{ width: "55%" }} />
        <div className="wf-map">
          <span className="wf-tag">1 · {d.wireframe.map}</span>
        </div>
        <div className="wf-row wf-status">
          <i className="wf-dot" />
          <i className="wf-line" style={{ width: "50%" }} />
          <span className="wf-tag">2 · {d.wireframe.status}</span>
        </div>
        <div className="wf-btn">
          <span>{d.wireframe.button}</span>
          <span className="wf-tag">3</span>
        </div>
      </div>
    </div>
  );
}

/** High-fidelity design: the real card, still. */
export function DesignStage() {
  return (
    <div className="st st-design">
      <span className="st-design-grid" aria-hidden="true" />
      <CheckInCard />
    </div>
  );
}

/** The Flutter widget, highlighted at build time. */
export function CodeStage() {
  const lines = highlightDart(d.code);
  return (
    <div className="st st-code">
      <div className="code-tabs" aria-hidden="true">
        <span className="code-tab">{d.codeFile}</span>
      </div>
      <pre className="code" aria-label={`${d.codeFile}, Flutter widget source`}>
        <code>
          {lines.map((toks, i) => (
            <span className="code-line" key={i}>
              <span className="code-ln" aria-hidden="true">
                {i + 1}
              </span>
              {toks.map((t, k) =>
                t.kind === "plain" ? (
                  t.text
                ) : (
                  <span key={k} className={`tk-${t.kind}`}>
                    {t.text}
                  </span>
                ),
              )}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

/** The running component: the same card, working. */
export function RunningStage() {
  return (
    <div className="st st-running">
      <span className="st-running-glow" aria-hidden="true" />
      <CheckInCard interactive />
    </div>
  );
}

export const STAGES = {
  sketch: SketchStage,
  wireframe: WireframeStage,
  design: DesignStage,
  code: CodeStage,
  running: RunningStage,
} as const;
