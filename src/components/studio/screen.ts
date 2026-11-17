/** What a loaded screen file is: a still or a recording. */
export type ScreenSource =
  | { kind: "image"; name: string; image: ImageBitmap }
  | { kind: "video"; name: string; video: HTMLVideoElement };

/**
 * What the display shows in one frame.
 *  - show: one screen; `scroll` 0–1 moves down a page taller than the
 *    display; `power` 0–1 fades it up from black (switching on)
 *  - slide: a push transition from one screen to the next, `p` 0–1
 */
export type ScreenShot =
  | { kind: "show"; index: number; scroll?: number; power?: number }
  | { kind: "slide"; from: number; to: number; p: number };

const size = (s: ScreenSource) =>
  s.kind === "image" ? { w: s.image.width, h: s.image.height } : { w: s.video.videoWidth || 1, h: s.video.videoHeight || 1 };

const pixels = (s: ScreenSource): CanvasImageSource => (s.kind === "image" ? s.image : s.video);

/** True when the source is taller than the display, so `scroll` has somewhere to go. */
export function isTall(s: ScreenSource | undefined, aspect: number): boolean {
  if (!s) return false;
  const { w, h } = size(s);
  return h / w > aspect + 0.05;
}

/** Width-fit and scrolled when taller than the display; otherwise cover, centred. */
function drawSource(ctx: CanvasRenderingContext2D, s: ScreenSource, w: number, h: number, scroll = 0) {
  const { w: iw, h: ih } = size(s);
  const fitWidth = w / iw;
  if (ih * fitWidth > h + 1) {
    const dh = ih * fitWidth;
    ctx.drawImage(pixels(s), 0, -(dh - h) * scroll, w, dh);
    return;
  }
  const scale = Math.max(w / iw, h / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  ctx.drawImage(pixels(s), (w - dw) / 2, (h - dh) / 2, dw, dh);
}

/** Paints one frame of the display into a `w × h` canvas. */
export function paintShot(ctx: CanvasRenderingContext2D, w: number, h: number, sources: ScreenSource[], shot: ScreenShot) {
  ctx.save();
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);
  if (!sources.length) {
    drawTestCard(ctx, w, h);
  } else if (shot.kind === "show") {
    const src = sources[shot.index % sources.length];
    ctx.globalAlpha = shot.power ?? 1;
    drawSource(ctx, src, w, h, shot.scroll ?? 0);
  } else {
    // Like a navigation push: the old screen drifts left and dims, the new
    // one slides in from the right with a soft shadow on its leading edge.
    const p = shot.p;
    ctx.save();
    ctx.translate(-w * 0.3 * p, 0);
    drawSource(ctx, sources[shot.from % sources.length], w, h);
    ctx.fillStyle = `rgba(0,0,0,${0.3 * p})`;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
    ctx.save();
    ctx.translate(w * (1 - p), 0);
    ctx.shadowColor = "rgba(0,0,0,0.35)";
    ctx.shadowBlur = w * 0.05;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);
    ctx.shadowColor = "transparent";
    drawSource(ctx, sources[shot.to % sources.length], w, h);
    ctx.restore();
  }
  ctx.restore();
}

/** Indexes of the sources a shot draws. */
export const shotSources = (shot: ScreenShot) => (shot.kind === "show" ? [shot.index] : [shot.from, shot.to]);

/** Seeks recordings to `t` (looping) and waits for the frame, so exports are frame-exact. */
export async function seekVideos(sources: ScreenSource[], indexes: number[], t: number) {
  await Promise.all(
    indexes.map((i) => {
      const s = sources[i % sources.length];
      if (s?.kind !== "video") return;
      const v = s.video;
      const target = v.duration ? t % v.duration : 0;
      if (Math.abs(v.currentTime - target) < 1e-4) return;
      return new Promise<void>((resolve) => {
        v.addEventListener("seeked", () => resolve(), { once: true });
        v.currentTime = target;
      });
    }),
  );
}

export function drawTestCard(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, "#232a38");
  g.addColorStop(1, "#0b0e14");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 3;
  for (let i = 1; i < 8; i++) {
    ctx.beginPath();
    ctx.moveTo((w * i) / 8, 0);
    ctx.lineTo((w * i) / 8, h);
    ctx.moveTo(0, (h * i) / 16);
    ctx.lineTo(w, (h * i) / 16);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.textAlign = "center";
  ctx.font = `600 ${Math.round(w * 0.065)}px system-ui, sans-serif`;
  ctx.fillText("Drop screenshots", w / 2, h * 0.48);
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.font = `${Math.round(w * 0.04)}px system-ui, sans-serif`;
  ctx.fillText(`${w} × ${h}`, w / 2, h * 0.53);
}
