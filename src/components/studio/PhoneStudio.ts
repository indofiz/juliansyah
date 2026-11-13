import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { BufferTarget, CanvasSource, Mp4OutputFormat, Output, QUALITY_VERY_HIGH, WebMOutputFormat, canEncodeVideo, getFirstEncodableVideoCodec } from "mediabunny";
import { CANVAS_ASPECT, angleById, angleQuaternion, frameCamera, type Lens, type Pose } from "./angles";
import { cssMatrix3d, squareToQuad, type Pt, type Quad } from "@/lib/homography";
import { applyColourway, buildPhone, createMaterials, disposeMaterials, setGlare, type PhoneMaterials, type PhoneModel } from "./phone/buildPhone";
import { COLOURWAYS, FRONTS, type ColourwayId, type FrontId } from "./phone/spec";
import { VIDEO_SIZES, presetById, type PresetContext, type VideoPreset, type VideoSize } from "./presets";
import { isTall, paintShot, seekVideos, shotSources, type ScreenShot, type ScreenSource } from "./screen";
import { studioEnvironment } from "./studioEnvironment";

export type Background = "transparent" | "dark" | "light";

/** "free" = drag to orbit, starting from the last preset. */
export const FREE_ANGLE = "free";

export type StudioState = {
  front: FrontId;
  colourway: ColourwayId;
  angle: string;
  /** Index into the loaded screens. */
  screen: number;
  /** Strength of the reflection on the front glass, 0–2. */
  glare: number;
  background: Background;
  /** Soft shadow under the phone in exports, 0–1. */
  shadow: number;
};

export const DEFAULT_STATE: StudioState = {
  front: "pill",
  colourway: "graphite",
  angle: "three-quarter-l",
  screen: 0,
  glare: 1,
  background: "transparent",
  shadow: 0.5,
};

/** The site's page colour, and a light grey for checking edges on white. */
export const BACKGROUNDS: Record<Exclude<Background, "transparent">, string> = { dark: "#0d0c0a", light: "#f2f1ee" };

/** Screen texture width; the height follows the front's aspect (1290 → 2796 for 9:19.5). */
const SCREEN_WIDTH = 1290;

/** Empty space round the phone, as a fraction of the canvas. */
const MARGIN = { normal: 0.08, crop: 0.05 };

/** Everything the camera needs for one picture. */
type View = { pose: Pose; lens: Lens; zoom: number; fit: THREE.Vector3[]; margin: number };

export type VideoOptions = {
  preset: string;
  size: VideoSize;
  fps: number;
  /** Draw at this multiple and scale down, for clean edges. */
  supersample: number;
  /** WebM (VP9) with a transparent background instead of MP4. */
  alpha: boolean;
  onProgress?: (done: number) => void;
};

export type ScreenMeta = {
  index: number;
  label: string;
  /** Direction the display's top points in the image: 0 up, 90 right… */
  top: number;
  aspectTarget: string;
  contentSize: { width: number; height: number };
  quadPx: Quad;
  quadNorm: Quad;
  bboxPx: [number, number, number, number];
  homography: number[][];
  cssMatrix3d: string;
  hasCutout: boolean;
  mask: string;
};

/**
 * Renders the studio phone. Plain three.js, outside React: the page only
 * mounts it and passes state in. Draws on demand, and runs a frame loop only
 * while a preview plays or a recording is on screen.
 */
export class PhoneStudio {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private persp = new THREE.PerspectiveCamera(30, 1, 1, 200);
  private ortho = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 200);
  private controls: OrbitControls;
  private env: THREE.WebGLRenderTarget;
  private screenCanvas: HTMLCanvasElement;
  private screenCtx: CanvasRenderingContext2D;
  private screenTexture: THREE.CanvasTexture;
  private paintedKey = "";
  private materials: PhoneMaterials;
  private mask = {
    black: new THREE.MeshBasicMaterial({ color: 0x000000, toneMapped: false }),
    white: new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }),
    // Writes 0 to colour and alpha: punches the screen out of the frame.
    hole: new THREE.MeshBasicMaterial({ blending: THREE.CustomBlending, blendSrc: THREE.ZeroFactor, blendDst: THREE.ZeroFactor }),
  };
  private phone: PhoneModel;
  private sources: ScreenSource[] = [];
  private sourcesVersion = 0;
  private state: StudioState;
  private freeFrom = DEFAULT_STATE.angle;
  private view = { width: 1, height: 1 };
  private preview: { preset: VideoPreset; size: VideoSize; start: number; fit: THREE.Vector3[] } | null = null;
  private raf = 0;
  private busy = false;

  constructor(canvas: HTMLCanvasElement, initial: StudioState) {
    this.state = { ...initial };
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.toneMapping = THREE.NeutralToneMapping;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);

    this.env = studioEnvironment(this.renderer);
    this.scene.environment = this.env.texture;
    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(-4, 6, 7);
    const rim = new THREE.DirectionalLight(0xffffff, 0.9);
    rim.position.set(5, 2, -7);
    this.scene.add(key, rim);

    this.screenCanvas = document.createElement("canvas");
    const ctx = this.screenCanvas.getContext("2d");
    if (!ctx) throw new Error("No 2D canvas");
    this.screenCtx = ctx;
    this.screenTexture = new THREE.CanvasTexture(this.screenCanvas);
    this.screenTexture.colorSpace = THREE.SRGBColorSpace;
    this.screenTexture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();

    this.materials = createMaterials(this.screenTexture);
    applyColourway(this.materials, COLOURWAYS[this.state.colourway]);
    setGlare(this.materials, this.state.glare, 0);
    this.phone = buildPhone(FRONTS[this.state.front], this.materials);
    this.scene.add(this.phone.group);

    this.controls = new OrbitControls(this.persp, canvas);
    this.controls.enableDamping = false;
    this.controls.enabled = false;
    this.controls.addEventListener("change", () => this.render());

    this.applyShadowPreview();
  }

  get current(): StudioState {
    return { ...this.state };
  }

  get screens(): { name: string; kind: ScreenSource["kind"] }[] {
    return this.sources.map((s) => ({ name: s.name, kind: s.kind }));
  }

  get isBusy() {
    return this.busy;
  }

  set(next: Partial<StudioState>) {
    const prev = this.state;
    this.state = { ...prev, ...next };
    const s = this.state;
    if (s.front !== prev.front) {
      this.scene.remove(this.phone.group);
      this.phone.dispose();
      this.phone = buildPhone(FRONTS[s.front], this.materials);
      this.scene.add(this.phone.group);
      this.paintedKey = "";
    }
    if (s.colourway !== prev.colourway) applyColourway(this.materials, COLOURWAYS[s.colourway]);
    if (s.shadow !== prev.shadow) this.applyShadowPreview();
    if (s.angle !== prev.angle) this.changeAngle(prev.angle, s.angle);
    this.syncLoop();
    this.layout();
  }

  /** Replaces the screens (images or recordings), keeping the order given. */
  async setScreens(files: File[]) {
    const loaded = await Promise.all(files.map(loadSource));
    this.sources.forEach(releaseSource);
    this.sources = loaded.filter((s): s is ScreenSource => Boolean(s));
    this.sourcesVersion++;
    this.state = { ...this.state, screen: 0 };
    this.syncLoop();
    this.render();
  }

  /** The space the live view may use, in CSS pixels. The canvas takes the picture's shape inside it. */
  setViewport(width: number, height: number) {
    this.view = { width: Math.max(1, width), height: Math.max(1, height) };
    this.layout();
  }

  // ---------------------------------------------------------------- preview

  /** Plays a video preset live, in real time, until stopped. */
  playPreset(id: string, size: VideoSize) {
    const preset = presetById(id);
    this.preview = { preset, size, start: performance.now(), fit: this.presetFit(preset) };
    this.layout();
    this.syncLoop();
  }

  stopPreset() {
    this.preview = null;
    this.layout();
    this.syncLoop();
  }

  get previewing() {
    return Boolean(this.preview);
  }

  /** Seconds a preset lasts with the screens loaded now. */
  presetDuration(id: string) {
    return presetById(id).duration(this.presetContext());
  }

  // ---------------------------------------------------------------- exports

  /** Export size for the current angle, `longEdge` px on the long side. */
  exportSize(longEdge: number) {
    const aspect = this.stillAspect();
    return aspect >= 1 ? { width: longEdge, height: Math.round(longEdge / aspect) } : { width: Math.round(longEdge * aspect), height: longEdge };
  }

  /** One PNG at `width × height`, with the chosen background and shadow. */
  async renderStill(width: number, height: number, supersample = 2): Promise<Blob> {
    return this.offscreen(width, height, supersample, async () => {
      const camera = this.stillCamera(width / height);
      this.paint(this.stillShot());
      this.renderer.render(this.scene, camera);
      const out = canvas2d(width, height);
      this.compose(out, this.state.background, this.state.shadow);
      return toPng(out.canvas);
    });
  }

  /**
   * The mockup-library version of the current still (same format as the
   * Codex library): the phone with a transparent screen, the screen mask, a
   * glare layer, and the screen's exact corners for warping content in.
   * Also an alpha version of the mask (white, alpha = screen), which is what
   * CSS `mask-image` needs. With `crop`, every file is cut to the phone's
   * outline and the corners move with it (for the website).
   */
  async renderLibrary(width: number, height: number, supersample = 2, crop = false) {
    return this.offscreen(width, height, supersample, async () => {
      const camera = this.stillCamera(width / height);
      const { screen, glass } = this.phone;
      const meshes: THREE.Mesh[] = [];
      this.phone.group.traverse((o) => o instanceof THREE.Mesh && meshes.push(o));
      const original = new Map(meshes.map((m) => [m, m.material]));
      const restore = () => {
        original.forEach((mat, m) => (m.material = mat));
        meshes.forEach((m) => (m.visible = true));
        this.renderer.setClearColor(0x000000, 0);
      };
      const grab = () => {
        const c = canvas2d(width, height);
        c.ctx.drawImage(this.renderer.domElement, 0, 0, width, height);
        return c;
      };
      try {
        // 1. Frame with the screen punched out (no glass: it would refill it).
        glass.visible = false;
        screen.material = this.mask.hole;
        this.renderer.render(this.scene, camera);
        const master = grab();

        // 2. Mask: white screen on black, cutout included as black.
        meshes.forEach((m) => (m.material = m === screen ? this.mask.white : this.mask.black));
        this.renderer.setClearColor(0x000000, 1);
        this.renderer.render(this.scene, camera);
        const mask = grab();

        // 3. Glare: only the glass reflection, as white with alpha, kept to the screen.
        restore();
        meshes.forEach((m) => (m.visible = m === glass));
        this.renderer.setClearColor(0x000000, 1);
        this.renderer.render(this.scene, camera);
        const glare = grab();
        const g = glare.ctx.getImageData(0, 0, width, height);
        const mk = mask.ctx.getImageData(0, 0, width, height).data;
        for (let i = 0; i < g.data.length; i += 4) {
          const a = Math.max(g.data[i], g.data[i + 1], g.data[i + 2]) * (mk[i] / 255);
          g.data[i] = g.data[i + 1] = g.data[i + 2] = 255;
          g.data[i + 3] = a;
        }
        glare.ctx.putImageData(g, 0, 0);
        restore();

        const maskAlpha = canvas2d(width, height);
        const ma = mask.ctx.getImageData(0, 0, width, height);
        for (let i = 0; i < ma.data.length; i += 4) {
          ma.data[i + 3] = ma.data[i];
          ma.data[i] = ma.data[i + 1] = ma.data[i + 2] = 255;
        }
        maskAlpha.ctx.putImageData(ma, 0, 0);

        let meta = this.screenMeta(camera, width, height);
        let layers = { master, mask, maskAlpha, glare };
        let size = { width, height };
        if (crop) {
          const box = alphaBox(master.ctx, width, height, 2);
          const cut = (c: { canvas: HTMLCanvasElement }) => {
            const out = canvas2d(box.w, box.h);
            out.ctx.drawImage(c.canvas, -box.x, -box.y);
            return out;
          };
          layers = { master: cut(master), mask: cut(mask), maskAlpha: cut(maskAlpha), glare: cut(glare) };
          size = { width: box.w, height: box.h };
          meta = {
            ...meta,
            screens: meta.screens.map((sc) => {
              const q = sc.quadPx;
              const shift = (p: Pt): Pt => [+(p[0] - box.x).toFixed(3), +(p[1] - box.y).toFixed(3)];
              return { ...sc, ...this.describeQuad({ tl: shift(q.tl), tr: shift(q.tr), br: shift(q.br), bl: shift(q.bl) }, box.w, box.h) };
            }),
          };
        }
        return {
          master: await toPng(layers.master.canvas),
          mask: await toPng(layers.mask.canvas),
          maskAlpha: await toPng(layers.maskAlpha.canvas),
          glare: await toPng(layers.glare.canvas),
          meta,
          size,
        };
      } finally {
        restore();
      }
    });
  }

  /** Records a video preset frame by frame (never drops frames) and returns the file. */
  async exportVideo(o: VideoOptions): Promise<{ blob: Blob; ext: string; codec: string; frames: number }> {
    const { width, height } = VIDEO_SIZES[o.size];
    const preset = presetById(o.preset);
    const ctx = this.presetContext();
    const frames = Math.round(preset.duration(ctx) * o.fps);

    const codec = o.alpha
      ? (await canEncodeVideo("vp9", { width, height, alpha: "keep" }))
        ? "vp9"
        : null
      : await getFirstEncodableVideoCodec(["avc", "hevc", "vp9", "av1"], { width, height });
    if (!codec) throw new Error(o.alpha ? "This browser can't encode VP9 with transparency." : "This browser can't encode MP4 video.");

    const target = new BufferTarget();
    const output = new Output({ format: o.alpha ? new WebMOutputFormat() : new Mp4OutputFormat({ fastStart: "in-memory" }), target });
    const out = canvas2d(width, height);
    const source = new CanvasSource(out.canvas, { codec, quality: QUALITY_VERY_HIGH, alpha: o.alpha ? "keep" : "discard" });
    output.addVideoTrack(source, { frameRate: o.fps });
    await output.start();

    const fit = this.presetFit(preset);
    const bg: Background = o.alpha ? "transparent" : this.state.background === "transparent" ? "dark" : this.state.background;
    const wasPreviewing = this.preview;
    this.preview = null;
    this.stopLoop();
    try {
      await this.offscreen(width, height, o.supersample, async () => {
        for (let i = 0; i < frames; i++) {
          const t = i / o.fps;
          const f = preset.frame(t, ctx);
          await seekVideos(this.sources, shotSources(f.shot), t);
          this.paint(f.shot, true);
          const camera = this.place({ pose: f.pose, lens: preset.lens, zoom: f.zoom, fit, margin: MARGIN.normal }, width / height);
          this.renderer.render(this.scene, camera);
          this.compose(out, bg, this.state.shadow);
          await source.add(t, 1 / o.fps);
          o.onProgress?.((i + 1) / frames);
        }
      });
      await output.finalize();
    } catch (e) {
      await output.cancel();
      throw e;
    } finally {
      this.preview = wasPreviewing;
      this.syncLoop();
    }
    const buffer = target.buffer;
    if (!buffer) throw new Error("The encoder produced no data.");
    return { blob: new Blob([buffer], { type: o.alpha ? "video/webm" : "video/mp4" }), ext: o.alpha ? "webm" : "mp4", codec, frames };
  }

  dispose() {
    cancelAnimationFrame(this.raf);
    this.controls.dispose();
    this.phone.dispose();
    disposeMaterials(this.materials);
    Object.values(this.mask).forEach((m) => m.dispose());
    this.screenTexture.dispose();
    this.sources.forEach(releaseSource);
    this.env.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }

  // ---------------------------------------------------------------- internals

  private presetContext(): PresetContext {
    const aspect = FRONTS[this.state.front].aspect;
    return { screens: this.sources.length, selected: this.state.screen, tall: isTall(this.sources[this.state.screen], aspect[1] / aspect[0]) };
  }

  /**
   * One framing for the whole clip, from the phone's outline at 72 moments,
   * so the camera holds still while the phone moves.
   */
  private presetFit(preset: VideoPreset): THREE.Vector3[] {
    const ctx = this.presetContext();
    const T = preset.duration(ctx);
    const pts: THREE.Vector3[] = [];
    const m = new THREE.Matrix4();
    for (let i = 0; i < 72; i++) {
      const { pose } = preset.frame((T * i) / 72, ctx);
      m.compose(new THREE.Vector3(0, preset.fitLift ? (pose.lift ?? 0) : 0, 0), angleQuaternion(pose), new THREE.Vector3(1, 1, 1));
      for (const p of this.phone.fitPoints) pts.push(p.clone().applyMatrix4(m));
    }
    return pts;
  }

  private changeAngle(prev: string, next: string) {
    if (next === FREE_ANGLE) {
      // Start orbiting from the picture that was on screen (isometric has no
      // perspective camera to start from, so those start at three-quarter).
      if (prev !== FREE_ANGLE) this.freeFrom = angleById(prev).focal === "ortho" ? "three-quarter-l" : prev;
      const size = this.renderer.getSize(new THREE.Vector2());
      this.stillCameraFor(this.freeFrom, size.x / size.y);
      // Orbit round the point on the view line nearest the phone's centre.
      const forward = this.persp.getWorldDirection(new THREE.Vector3());
      const along = this.phone.group.position.clone().sub(this.persp.position).dot(forward);
      this.controls.target.copy(this.persp.position).addScaledVector(forward, along);
      this.controls.enabled = true;
      this.controls.update();
    } else {
      this.controls.enabled = false;
    }
  }

  private stillAspect() {
    if (this.state.angle === FREE_ANGLE) return CANVAS_ASPECT.portrait;
    return CANVAS_ASPECT[angleById(this.state.angle).canvas];
  }

  private stillShot(): ScreenShot {
    return { kind: "show", index: this.state.screen };
  }

  /** Camera for a still: the preset's, or the orbit camera in free mode. */
  private stillCamera(aspect: number): THREE.Camera {
    if (this.state.angle === FREE_ANGLE) {
      this.applyPose(angleById(this.freeFrom));
      this.persp.aspect = aspect;
      this.persp.updateProjectionMatrix();
      return this.persp;
    }
    return this.stillCameraFor(this.state.angle, aspect);
  }

  private stillCameraFor(id: string, aspect: number): THREE.Camera {
    const angle = angleById(id);
    this.applyPose(angle);
    const local = angle.crop === "top" ? this.phone.fitPoints.filter((p) => p.y > 0) : this.phone.fitPoints;
    const fit = local.map((p) => p.clone().applyMatrix4(this.phone.group.matrixWorld));
    return frameCamera(angle, fit, aspect, angle.crop ? MARGIN.crop : MARGIN.normal, this.persp, this.ortho);
  }

  private applyPose(pose: Pose) {
    setGlare(this.materials, this.state.glare, pose.yaw ?? 0);
    const g = this.phone.group;
    g.quaternion.copy(angleQuaternion(pose));
    g.position.set(0, pose.lift ?? 0, 0);
    g.updateMatrixWorld(true);
  }

  private place(v: View, aspect: number): THREE.Camera {
    this.applyPose(v.pose);
    return frameCamera(v.lens, v.fit, aspect, v.margin, this.persp, this.ortho, v.zoom);
  }

  /** Repaints the display only when the picture on it changes (recordings always change). */
  private paint(shot: ScreenShot, force = false) {
    const [aw, ah] = FRONTS[this.state.front].aspect;
    const w = SCREEN_WIDTH;
    const h = Math.round((SCREEN_WIDTH * ah) / aw);
    const c = this.screenCanvas;
    if (c.width !== w || c.height !== h) {
      c.width = w;
      c.height = h;
      this.screenTexture.dispose(); // a new size needs a new GPU texture
      this.paintedKey = "";
    }
    const hasVideo = shotSources(shot).some((i) => this.sources[i % Math.max(1, this.sources.length)]?.kind === "video");
    const key = `${this.sourcesVersion}|${JSON.stringify(shot)}`;
    if (!force && !hasVideo && key === this.paintedKey) return;
    paintShot(this.screenCtx, w, h, this.sources, shot);
    this.paintedKey = key;
    this.screenTexture.needsUpdate = true;
  }

  /** Background, then a soft shadow from the phone's own outline, then the phone. */
  private compose(out: { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D }, bg: Background, shadow: number) {
    const { canvas, ctx } = out;
    const { width: w, height: h } = canvas;
    const src = this.renderer.domElement;
    ctx.clearRect(0, 0, w, h);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    if (bg !== "transparent") {
      ctx.fillStyle = BACKGROUNDS[bg];
      ctx.fillRect(0, 0, w, h);
    }
    if (shadow > 0) {
      const sil = silhouette(src, w, h);
      ctx.save();
      ctx.filter = `blur(${Math.round(Math.min(w, h) * 0.025)}px)`;
      ctx.globalAlpha = Math.min(1, shadow) * 0.65;
      ctx.drawImage(sil, 0, Math.round(h * 0.025));
      ctx.restore();
    }
    ctx.drawImage(src, 0, 0, w, h);
  }

  /** Runs `job` with the renderer at `width·ss × height·ss`, then puts the live view back. */
  private async offscreen<T>(width: number, height: number, ss: number, job: () => Promise<T>): Promise<T> {
    const r = this.renderer;
    const ratio = r.getPixelRatio();
    const size = r.getSize(new THREE.Vector2());
    this.busy = true;
    r.domElement.style.visibility = "hidden";
    r.setPixelRatio(1);
    r.setSize(Math.round(width * ss), Math.round(height * ss), false);
    try {
      return await job();
    } finally {
      r.setPixelRatio(ratio);
      r.setSize(size.x, size.y, false);
      r.domElement.style.visibility = "";
      this.busy = false;
      this.render();
    }
  }

  private screenMeta(camera: THREE.Camera, width: number, height: number): { screens: ScreenMeta[]; displayFacesCamera: boolean } {
    const g = this.phone.group;
    const toPx = (v: THREE.Vector3): Pt => {
      const p = v.clone().applyMatrix4(g.matrixWorld).project(camera);
      return [+(((p.x + 1) / 2) * width).toFixed(3), +(((1 - p.y) / 2) * height).toFixed(3)];
    };
    const c = this.phone.displayCorners;
    const quadPx: Quad = { tl: toPx(c.tl), tr: toPx(c.tr), br: toPx(c.br), bl: toPx(c.bl) };
    const centre = c.tl.clone().add(c.br).multiplyScalar(0.5).applyMatrix4(g.matrixWorld);
    const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(g.quaternion);
    const toCamera = camera instanceof THREE.OrthographicCamera ? camera.getWorldDirection(new THREE.Vector3()).negate() : camera.position.clone().sub(centre);
    const facing = normal.dot(toCamera) > 0;
    if (!facing) return { screens: [], displayFacesCamera: false };

    const [aw, ah] = FRONTS[this.state.front].aspect;
    return {
      displayFacesCamera: true,
      screens: [{ index: 1, label: "phone", aspectTarget: `${aw}:${ah}`, hasCutout: true, mask: "", ...this.describeQuad(quadPx, width, height) }],
    };
  }

  /** Everything about a screen that follows from its corners in a `width × height` picture. */
  private describeQuad(quadPx: Quad, width: number, height: number) {
    const norm = (p: Pt): Pt => [+(p[0] / width).toFixed(6), +(p[1] / height).toFixed(6)];
    const xs = [quadPx.tl[0], quadPx.tr[0], quadPx.br[0], quadPx.bl[0]];
    const ys = [quadPx.tl[1], quadPx.tr[1], quadPx.br[1], quadPx.bl[1]];
    const topMid = [(quadPx.tl[0] + quadPx.tr[0]) / 2, (quadPx.tl[1] + quadPx.tr[1]) / 2];
    const bottomMid = [(quadPx.bl[0] + quadPx.br[0]) / 2, (quadPx.bl[1] + quadPx.br[1]) / 2];
    const top = (THREE.MathUtils.radToDeg(Math.atan2(topMid[0] - bottomMid[0], -(topMid[1] - bottomMid[1]))) + 360) % 360;
    const H = squareToQuad(quadPx);
    const [aw, ah] = FRONTS[this.state.front].aspect;
    const content = { width: SCREEN_WIDTH, height: Math.round((SCREEN_WIDTH * ah) / aw) };
    return {
      top: +top.toFixed(2) % 360, // 359.999 rounds to 360, which is 0
      contentSize: content,
      quadPx,
      quadNorm: { tl: norm(quadPx.tl), tr: norm(quadPx.tr), br: norm(quadPx.br), bl: norm(quadPx.bl) },
      bboxPx: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)].map((n) => +n.toFixed(3)) as [number, number, number, number],
      homography: H.map((row) => row.map((n) => +n.toPrecision(12))),
      cssMatrix3d: cssMatrix3d(H, content.width, content.height),
    };
  }

  /** Live canvas: the picture's shape, as large as fits the viewport. */
  private layout() {
    const aspect = this.preview ? VIDEO_SIZES[this.preview.size].width / VIDEO_SIZES[this.preview.size].height : this.stillAspect();
    const { width, height } = this.view;
    const w = Math.min(width, height * aspect);
    this.renderer.setSize(Math.floor(w), Math.floor(w / aspect));
    this.applyShadowPreview();
    this.render();
  }

  private render = () => {
    if (this.busy) return;
    const size = this.renderer.getSize(new THREE.Vector2());
    const aspect = size.x / size.y;
    let camera: THREE.Camera;
    if (this.preview) {
      const { preset, fit, start } = this.preview;
      const ctx = this.presetContext();
      const T = preset.duration(ctx);
      const elapsed = (performance.now() - start) / 1000;
      const t = preset.loop ? elapsed % T : Math.min(elapsed % (T + 1), T);
      const f = preset.frame(t, ctx);
      this.paint(f.shot);
      camera = this.place({ pose: f.pose, lens: preset.lens, zoom: f.zoom, fit, margin: MARGIN.normal }, aspect);
    } else {
      this.paint(this.stillShot());
      camera = this.stillCamera(aspect);
    }
    this.renderer.render(this.scene, camera);
  };

  /** A frame loop only while something moves: a preview, or a recording on the display. */
  private syncLoop() {
    const needs = Boolean(this.preview) || this.sources[this.state.screen]?.kind === "video";
    this.stopLoop();
    if (!needs) return;
    this.sources.forEach((s) => s.kind === "video" && void s.video.play().catch(() => {}));
    const tick = () => {
      this.render();
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  /** Stops the frame loop and pauses recordings (exports seek them frame by frame). */
  private stopLoop() {
    cancelAnimationFrame(this.raf);
    this.sources.forEach((s) => s.kind === "video" && s.video.pause());
  }

  /** The live view's stand-in for the export shadow. */
  private applyShadowPreview() {
    const el = this.renderer.domElement;
    const h = el.clientHeight || 1;
    const s = this.state.shadow;
    el.style.filter = s > 0 ? `drop-shadow(0 ${Math.round(h * 0.025)}px ${Math.round(h * 0.025)}px rgba(0,0,0,${(0.65 * s).toFixed(2)}))` : "";
  }
}

// ------------------------------------------------------------------ helpers

function canvas2d(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: false });
  if (!ctx) throw new Error("No 2D canvas");
  return { canvas, ctx };
}

let silCache: { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } | null = null;

/** The phone's outline in black, at `w × h`. */
function silhouette(src: CanvasImageSource, w: number, h: number) {
  if (!silCache || silCache.canvas.width !== w || silCache.canvas.height !== h) silCache = canvas2d(w, h);
  const { canvas, ctx } = silCache;
  ctx.globalCompositeOperation = "source-over";
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(src, 0, 0, w, h);
  ctx.globalCompositeOperation = "source-in";
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = "source-over";
  return canvas;
}

/** The box round every pixel with alpha, plus `pad` px, inside the canvas. */
function alphaBox(ctx: CanvasRenderingContext2D, width: number, height: number, pad: number) {
  const d = ctx.getImageData(0, 0, width, height).data;
  let x0 = width;
  let y0 = height;
  let x1 = -1;
  let y1 = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (d[(y * width + x) * 4 + 3] === 0) continue;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
  if (x1 < 0) return { x: 0, y: 0, w: width, h: height };
  const x = Math.max(0, x0 - pad);
  const y = Math.max(0, y0 - pad);
  return { x, y, w: Math.min(width, x1 + pad + 1) - x, h: Math.min(height, y1 + pad + 1) - y };
}

const toPng = (c: HTMLCanvasElement) =>
  new Promise<Blob>((resolve, reject) => c.toBlob((b) => (b ? resolve(b) : reject(new Error("PNG encoding failed"))), "image/png"));

async function loadSource(file: File): Promise<ScreenSource | null> {
  if (file.type.startsWith("image/")) return { kind: "image", name: file.name, image: await createImageBitmap(file) };
  if (!file.type.startsWith("video/")) return null;
  const video = document.createElement("video");
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = "auto";
  video.src = URL.createObjectURL(file);
  await new Promise<void>((resolve, reject) => {
    video.addEventListener("loadeddata", () => resolve(), { once: true });
    video.addEventListener("error", () => reject(new Error(`Can't play ${file.name}`)), { once: true });
  });
  return { kind: "video", name: file.name, video };
}

function releaseSource(s: ScreenSource) {
  if (s.kind === "image") s.image.close();
  else {
    s.video.pause();
    URL.revokeObjectURL(s.video.src);
  }
}

