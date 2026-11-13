"use client";

import { useEffect, useRef, useState, type CSSProperties, type DragEvent, type ReactNode } from "react";
import { ANGLES } from "./angles";
import { BACKGROUNDS, DEFAULT_STATE, FREE_ANGLE, PhoneStudio, type Background, type StudioState, type VideoOptions } from "./PhoneStudio";
import { VIDEO_PRESETS, VIDEO_SIZES, type VideoSize } from "./presets";
import { COLOURWAYS, FRONTS, type ColourwayId, type FrontId } from "./phone/spec";

type Thumb = { name: string; url: string; kind: "image" | "video" };
type LibraryFiles = Awaited<ReturnType<PhoneStudio["renderLibrary"]>>;
type VideoSettings = Omit<VideoOptions, "onProgress">;

/** What automation (Playwright) and the console can drive. */
type StudioApi = {
  set(next: Partial<StudioState>): void;
  state(): StudioState;
  /** PNG data URL, `longEdge` px on the long side. */
  still(longEdge: number, supersample?: number): Promise<string>;
  library(longEdge: number, supersample?: number, crop?: boolean): Promise<{ id: string; master: string; mask: string; maskAlpha: string; glare: string; meta: unknown }>;
  /** Records and downloads a video; resolves with what was made. */
  video(settings: Partial<VideoSettings>): Promise<{ name: string; codec: string; frames: number; bytes: number; ms: number }>;
  play(preset: string, size: VideoSize): void;
  stop(): void;
};

declare global {
  interface Window {
    __studio?: StudioApi;
  }
}

type DirectoryPicker = () => Promise<FileSystemDirectoryHandle>;

const EXPORT_SIZES = [1200, 2400, 4096];
const DEFAULT_VIDEO: VideoSettings = { preset: "float-loop", size: "16:9", fps: 30, supersample: 2, alpha: false };

const blobToDataUrl = (b: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(b);
  });

function download(blob: Blob, name: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

const stillId = (s: StudioState) => `phone-${s.front}-${s.colourway}-${s.angle}`;

/** The library JSON, in the same shape as the Codex mockup library's meta files. */
function libraryJson(id: string, s: StudioState, supersample: number, files: LibraryFiles) {
  return {
    id,
    device: "phone",
    source: "3d-studio",
    front: s.front,
    colourway: s.colourway,
    angle: s.angle,
    canvas: files.size,
    displayFacesCamera: files.meta.displayFacesCamera,
    screens: files.meta.screens.map((sc) => ({ ...sc, mask: `${id}.mask.png` })),
    files: { master: `${id}.png`, mask: `${id}.mask.png`, maskAlpha: `${id}.mask-alpha.png`, glare: `${id}.glare.png` },
    generation: { supersample, glare: s.glare, rendered: new Date().toISOString() },
  };
}

/**
 * Dev-only phone studio (docs/plans/phone-3d-mockup.md). Screens come from
 * dropped or chosen files (images or screen recordings), so nothing is
 * copied into the repo. Exports: PNG stills, library files (transparent
 * screen + mask + glare + corners JSON) and videos.
 */
export function Studio() {
  const stageRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<PhoneStudio | null>(null);
  const [state, setState] = useState<StudioState>(DEFAULT_STATE);
  const [thumbs, setThumbs] = useState<Thumb[]>([]);
  const [longEdge, setLongEdge] = useState(2400);
  const [crop, setCrop] = useState(true);
  const [video, setVideo] = useState<VideoSettings>(DEFAULT_VIDEO);
  const [previewing, setPreviewing] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    // A fresh canvas per mount: dispose() loses the old one's WebGL context,
    // and React's dev double-mount would otherwise reuse that dead canvas.
    const canvas = document.createElement("canvas");
    canvas.style.display = "block";
    stage.appendChild(canvas);
    let studio: PhoneStudio;
    try {
      studio = new PhoneStudio(canvas, DEFAULT_STATE);
    } catch (e) {
      canvas.remove();
      queueMicrotask(() => setStatus(`WebGL failed: ${(e as Error).message}`));
      return;
    }
    studioRef.current = studio;
    const ro = new ResizeObserver(([entry]) => studio.setViewport(entry.contentRect.width, entry.contentRect.height));
    ro.observe(stage);

    window.__studio = {
      set: (next) => {
        setState((s) => ({ ...s, ...next }));
        studio.set(next);
      },
      state: () => studio.current,
      still: async (edge, ss = 2) => {
        const { width, height } = studio.exportSize(edge);
        return blobToDataUrl(await studio.renderStill(width, height, ss));
      },
      library: async (edge, ss = 2, crop = false) => {
        const { width, height } = studio.exportSize(edge);
        const files = await studio.renderLibrary(width, height, ss, crop);
        const id = stillId(studio.current);
        return {
          id,
          master: await blobToDataUrl(files.master),
          mask: await blobToDataUrl(files.mask),
          maskAlpha: await blobToDataUrl(files.maskAlpha),
          glare: await blobToDataUrl(files.glare),
          meta: libraryJson(id, studio.current, ss, files),
        };
      },
      video: async (settings) => recordVideo(studio, { ...DEFAULT_VIDEO, ...settings }),
      play: (preset, size) => {
        studio.playPreset(preset, size);
        setPreviewing(true);
      },
      stop: () => {
        studio.stopPreset();
        setPreviewing(false);
      },
    };

    return () => {
      ro.disconnect();
      delete window.__studio;
      studioRef.current = null;
      studio.dispose();
      canvas.remove();
    };
  }, []);

  const update = (next: Partial<StudioState>) => {
    setState((s) => ({ ...s, ...next }));
    studioRef.current?.set(next);
  };

  const updateVideo = (next: Partial<VideoSettings>) => {
    const merged = { ...video, ...next };
    setVideo(merged);
    if (previewing) studioRef.current?.playPreset(merged.preset, merged.size);
  };

  const loadFiles = async (list: FileList | null) => {
    const files = Array.from(list ?? []).filter((f) => f.type.startsWith("image/") || f.type.startsWith("video/"));
    if (!files.length || !studioRef.current) return;
    try {
      await studioRef.current.setScreens(files);
    } catch (e) {
      setStatus((e as Error).message);
      return;
    }
    thumbs.forEach((t) => URL.revokeObjectURL(t.url));
    setThumbs(files.map((f) => ({ name: f.name, url: URL.createObjectURL(f), kind: f.type.startsWith("video/") ? "video" : "image" })));
    setState((s) => ({ ...s, screen: 0 }));
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    void loadFiles(e.dataTransfer.files);
  };

  const run = async (label: string, job: (studio: PhoneStudio) => Promise<string | void>) => {
    const studio = studioRef.current;
    if (!studio || studio.isBusy) return;
    setStatus(label);
    try {
      setStatus((await job(studio)) ?? null);
    } catch (e) {
      setStatus(`Failed: ${(e as Error).message}`);
    } finally {
      setProgress(null);
    }
  };

  const exportStill = () =>
    run("Rendering…", async (studio) => {
      const { width, height } = studio.exportSize(longEdge);
      download(await studio.renderStill(width, height), `${stillId(state)}.png`);
    });

  const exportLibrary = () =>
    run("Rendering library files…", async (studio) => {
      const { width, height } = studio.exportSize(longEdge);
      const files = await studio.renderLibrary(width, height, 2, crop);
      const id = stillId(state);
      const json = new Blob([JSON.stringify(libraryJson(id, state, 2, files), null, 2)], { type: "application/json" });
      const out: [string, Blob][] = [
        [`${id}.png`, files.master],
        [`${id}.mask.png`, files.mask],
        [`${id}.mask-alpha.png`, files.maskAlpha],
        [`${id}.glare.png`, files.glare],
        [`${id}.json`, json],
      ];
      const pick = (window as Window & { showDirectoryPicker?: DirectoryPicker }).showDirectoryPicker;
      if (pick) {
        // One folder pick instead of four downloads (Chrome).
        const dir = await pick();
        for (const [name, blob] of out) {
          const w = await (await dir.getFileHandle(name, { create: true })).createWritable();
          await w.write(blob);
          await w.close();
        }
        return `Saved ${out.length} files to “${dir.name}”.`;
      }
      out.forEach(([name, blob]) => download(blob, name));
    });

  const recordVideo = async (studio: PhoneStudio, settings: VideoSettings) => {
    const started = performance.now();
    setProgress(0);
    const result = await studio.exportVideo({ ...settings, onProgress: setProgress });
    const name = `phone-${settings.preset}-${settings.size.replace(":", "x")}-${settings.fps}fps.${result.ext}`;
    download(result.blob, name);
    setProgress(null);
    return { name, codec: result.codec, frames: result.frames, bytes: result.blob.size, ms: Math.round(performance.now() - started) };
  };

  const exportVideo = () =>
    run("Recording video…", async (studio) => {
      const r = await recordVideo(studio, video);
      return `${r.name}: ${r.frames} frames, ${(r.bytes / 1e6).toFixed(1)} MB, ${r.codec}, ${(r.ms / 1000).toFixed(0)} s`;
    });

  const togglePreview = () => {
    const studio = studioRef.current;
    if (!studio) return;
    if (previewing) studio.stopPreset();
    else studio.playPreset(video.preset, video.size);
    setPreviewing(!previewing);
  };

  const duration = studioRef.current?.presetDuration(video.preset);
  const stageBg = state.background === "transparent" ? styles.checker : { background: BACKGROUNDS[state.background] };

  return (
    <main id="main-content" style={styles.page} onDragOver={(e) => e.preventDefault()} onDrop={onDrop}>
      <aside style={styles.panel}>
        <div>
          <h1 style={styles.title}>Phone studio</h1>
          <p style={styles.hint}>Dev only. Drop screenshots or screen recordings anywhere on the page.</p>
        </div>

        <Section title="Screens">
          <input type="file" accept="image/*,video/*" multiple data-testid="screens" onChange={(e) => void loadFiles(e.target.files)} />
          {thumbs.length > 0 && (
            <div style={styles.thumbs}>
              {thumbs.map((t, i) => (
                <button
                  key={t.url}
                  type="button"
                  title={t.name}
                  onClick={() => update({ screen: i })}
                  style={{ ...styles.thumb, outline: i === state.screen ? "2px solid var(--accent)" : "1px solid var(--border)" }}
                >
                  {t.kind === "video" ? (
                    <video src={t.url} muted style={styles.thumbImg} />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element -- local object URL
                    <img src={t.url} alt={t.name} style={styles.thumbImg} />
                  )}
                </button>
              ))}
            </div>
          )}
        </Section>

        <Section title="Phone">
          <Select label="Front" value={state.front} onChange={(v) => update({ front: v as FrontId })} options={Object.values(FRONTS).map((f) => [f.id, f.label])} />
          <Select label="Colour" value={state.colourway} onChange={(v) => update({ colourway: v as ColourwayId })} options={Object.values(COLOURWAYS).map((c) => [c.id, c.label])} />
          <Range label="Glass reflection" value={state.glare} max={2} onChange={(glare) => update({ glare })} />
          <Select
            label="Background"
            value={state.background}
            onChange={(v) => update({ background: v as Background })}
            options={[
              ["transparent", "Transparent"],
              ["dark", "Site dark"],
              ["light", "Light"],
            ]}
          />
          <Range label="Shadow" value={state.shadow} max={1} onChange={(shadow) => update({ shadow })} />
        </Section>

        <Section title="Still">
          <Select
            label="Angle"
            value={state.angle}
            onChange={(v) => update({ angle: v })}
            options={[...ANGLES.map((a): [string, string] => [a.id, a.label]), [FREE_ANGLE, "Free · drag to orbit"]]}
          />
          <Select label="Size (long edge)" value={String(longEdge)} onChange={(v) => setLongEdge(Number(v))} options={EXPORT_SIZES.map((n) => [String(n), `${n} px`])} />
          <label style={{ ...styles.field, display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input type="checkbox" checked={crop} onChange={(e) => setCrop(e.target.checked)} />
            <span>Library files: crop to the phone</span>
          </label>
          <div style={styles.row}>
            <button type="button" className="btn btn-glow btn-sm" onClick={() => void exportStill()}>
              Export PNG
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => void exportLibrary()} title="Transparent screen, mask, glare and corners JSON">
              Library files
            </button>
          </div>
        </Section>

        <Section title="Video">
          <Select label="Preset" value={video.preset} onChange={(preset) => updateVideo({ preset })} options={VIDEO_PRESETS.map((p) => [p.id, p.label])} />
          <Select label="Shape" value={video.size} onChange={(v) => updateVideo({ size: v as VideoSize })} options={Object.entries(VIDEO_SIZES).map(([k, s]) => [k, `${k} · ${s.width}×${s.height}`])} />
          <div style={styles.row}>
            <Select label="Frame rate" value={String(video.fps)} onChange={(v) => updateVideo({ fps: Number(v) })} options={[["30", "30 fps"], ["60", "60 fps"]]} />
            <Select
              label="Format"
              value={video.alpha ? "webm" : "mp4"}
              onChange={(v) => updateVideo({ alpha: v === "webm" })}
              options={[
                ["mp4", "MP4"],
                ["webm", "WebM, transparent"],
              ]}
            />
          </div>
          {duration !== undefined && <p style={styles.hint}>{duration.toFixed(1)} s · {Math.round(duration * video.fps)} frames</p>}
          <div style={styles.row}>
            <button type="button" className="btn btn-ghost btn-sm" onClick={togglePreview}>
              {previewing ? "Stop preview" : "Preview"}
            </button>
            <button type="button" className="btn btn-glow btn-sm" onClick={() => void exportVideo()}>
              Export video
            </button>
          </div>
          {progress !== null && <progress value={progress} max={1} style={{ width: "100%" }} />}
        </Section>

        {status && (
          <p style={styles.status} role="status">
            {status}
          </p>
        )}
      </aside>

      <div ref={stageRef} style={{ ...styles.stage, ...stageBg }} />
    </main>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={styles.section}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      {children}
    </section>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <label style={styles.field}>
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={styles.select}>
        {options.map(([v, text]) => (
          <option key={v} value={v}>
            {text}
          </option>
        ))}
      </select>
    </label>
  );
}

function Range({ label, value, max, onChange }: { label: string; value: number; max: number; onChange: (v: number) => void }) {
  return (
    <label style={styles.field}>
      <span>
        {label} · {value.toFixed(1)}
      </span>
      <input type="range" min={0} max={max} step={0.1} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}

const styles: Record<string, CSSProperties> = {
  page: { display: "grid", gridTemplateColumns: "19rem 1fr", height: "100svh", background: "var(--bg)", color: "var(--text)" },
  panel: { display: "flex", flexDirection: "column", gap: "1.25rem", padding: "1.25rem", overflowY: "auto", borderRight: "1px solid var(--border)", background: "var(--surface)" },
  title: { fontSize: "1.25rem", fontWeight: 600 },
  hint: { fontSize: "0.8125rem", color: "var(--muted)" },
  section: { display: "grid", gap: "0.75rem", paddingTop: "1rem", borderTop: "1px solid var(--border)" },
  sectionTitle: { fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" },
  field: { display: "grid", gap: "0.375rem", fontSize: "0.8125rem", color: "var(--muted)", flex: 1 },
  select: { padding: "0.5rem", borderRadius: "0.5rem", background: "var(--surface-2)", color: "var(--text)", border: "1px solid var(--border)" },
  row: { display: "flex", gap: "0.5rem", alignItems: "end", flexWrap: "wrap" },
  thumbs: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem" },
  thumb: { padding: 0, borderRadius: "0.375rem", overflow: "hidden", background: "none", cursor: "pointer" },
  thumbImg: { display: "block", width: "100%", aspectRatio: "9 / 19.5", objectFit: "cover" },
  stage: { position: "relative", display: "grid", placeItems: "center", minWidth: 0, minHeight: 0, overflow: "hidden" },
  checker: {
    backgroundColor: "#1a1a1a",
    backgroundImage: "linear-gradient(45deg, #222 25%, transparent 25%, transparent 75%, #222 75%), linear-gradient(45deg, #222 25%, transparent 25%, transparent 75%, #222 75%)",
    backgroundSize: "24px 24px",
    backgroundPosition: "0 0, 12px 12px",
  },
  status: { fontSize: "0.8125rem", color: "var(--text)", padding: "0.625rem 0.75rem", borderRadius: "0.5rem", background: "var(--surface-2)" },
};
