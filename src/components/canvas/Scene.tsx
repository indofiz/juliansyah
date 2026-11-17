"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import gsap from "gsap";
import { sceneState } from "@/lib/sceneState";
import { useAccent } from "@/lib/accent";
import { ParticleMorph, type ShapeSource } from "./ParticleMorph";

/**
 * What the particle cloud turns into in the about section.
 *  - portrait: your face, from a map made by `npm run portrait <photo>`
 *  - model:    any .glb in /public/models (its surface becomes particles)
 *  - default:  a torus knot
 * `height` is the portrait's size in world units, `depth` how deep the relief
 * is relative to that height, `brightness` how bright the dots are.
 */
const SHAPE: ShapeSource = {
  type: "portrait",
  url: "/portrait/portrait-map.png",
  height: 3.3,
  depth: 0.28,
  brightness: 1.1, // lower = dimmer, subtler dots (try 0.6–1.3)
  dotSpacing: 0.0064, // gap between dots as a fraction of the height; bigger = coarser halftone
};
// const SHAPE: ShapeSource = { type: "model", url: "/models/bull.glb" };

/** Resolution caps the scene steps down through if frames drop (bloom goes last). */
const DPR_STEPS = [1.75, 1.5, 1.25, 1];

type Tier = { count: number; steps: number[]; bloom: boolean };
type Quality = { step: number; bloom: boolean };

/** The pixel ratio a cap gives on this screen (never above the screen's own). */
const effectiveDpr = (cap: number) => Math.min(Math.max(1, window.devicePixelRatio || 1), cap);

/** True when WebGL runs on the CPU (no GPU acceleration): SwiftShader, llvmpipe… */
function softwareWebGL(): boolean {
  try {
    const gl = document.createElement("canvas").getContext("webgl");
    if (!gl) return true;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer);
  } catch {
    return true;
  }
}

/**
 * Starting quality. Every device with a GPU starts high, with particles by
 * screen size (42k, or 16k on screens ≤ 768px), pixel ratio up to 1.75 and
 * bloom; QualityGovernor lowers it only if this device actually drops frames.
 * CPU cores and memory aren't used: they say little about the GPU (a 4-thread
 * laptop runs the full scene fine). Without a GPU (software WebGL) it's 6k
 * particles at pixel ratio 1 and no bloom pass.
 */
function pickTier(): Tier {
  if (softwareWebGL()) return { count: 6000, steps: [1], bloom: false };
  const phone = window.matchMedia("(max-width: 768px)").matches;
  return { count: phone ? 16000 : 42000, steps: DPR_STEPS, bloom: true };
}

/**
 * Watches the real frame rate while the particles are on screen (after the
 * fly-in) and lowers quality if the device can't keep up: resolution first
 * (1.75× → 1.5× → 1.25× → 1×, below 48 fps), then the bloom pass (below
 * 28 fps at 1×, so a 30 fps cap like iOS Low Power Mode keeps the glow). A
 * step needs two slow 1.5 s windows in a row, so a one-off hitch doesn't
 * count, and quality never goes back up during a visit, so the picture can't
 * flicker between levels.
 */
function QualityGovernor({ steps, quality, onChange }: { steps: number[]; quality: Quality; onChange: (q: Quality) => void }) {
  const win = useRef({ time: 0, frames: 0, slow: 0, settle: 0.5 });
  useFrame((_, delta) => {
    const w = win.current;
    // Only measure what the visitor sees: particles shown and assembled.
    // After a pause (LoopGate) or a step, wait a moment before measuring.
    if (sceneState.opacity < 0.5 || sceneState.intro < 1) {
      Object.assign(w, { time: 0, frames: 0, slow: 0, settle: 0.5 });
      return;
    }
    if (w.settle > 0) {
      w.settle -= delta;
      return;
    }
    // A long frame counts, but only as 0.1 s, so one hitch can't trigger a step.
    w.time += Math.min(delta, 0.1);
    w.frames++;
    if (w.time < 1.5) return;

    const fps = w.frames / w.time;
    w.time = 0;
    w.frames = 0;
    const dpr = effectiveDpr(steps[quality.step]);
    const next = steps.findIndex((cap, i) => i > quality.step && effectiveDpr(cap) < dpr);
    const slow = next !== -1 ? fps < 48 : quality.bloom && fps < 28;
    w.slow = slow ? w.slow + 1 : 0;
    if (w.slow < 2) return;

    w.slow = 0;
    w.settle = 1;
    if (process.env.NODE_ENV !== "production") console.info(`[scene] ${fps.toFixed(0)} fps, lowering quality`);
    onChange(next !== -1 ? { ...quality, step: next } : { ...quality, bloom: false });
  });
  return null;
}

/**
 * Stops rendering while the particles are faded out (most of the page), and
 * starts again as soon as a section brings them back. The last frame stays
 * on the canvas, so the loop stops only once a frame has been drawn with the
 * particles hidden: after a jump (a reduced-motion cut, a value that skips
 * its fade) the frame before would be a visible globe, frozen on screen
 * while the page scrolls.
 */
function LoopGate() {
  const setFrameloop = useThree((s) => s.setFrameloop);
  // The particles' opacity in the last frame drawn (1 during the fly-in).
  const drawn = useRef(1);
  useFrame(() => {
    drawn.current = sceneState.intro < 1 ? 1 : sceneState.opacity;
  });
  useEffect(() => {
    let running = true;
    const check = () => {
      const hidden = sceneState.opacity <= 0.003 && sceneState.intro >= 1;
      const visible = !hidden || drawn.current > 0.003;
      if (visible !== running) {
        running = visible;
        setFrameloop(visible ? "always" : "never");
      }
    };
    gsap.ticker.add(check);
    return () => gsap.ticker.remove(check);
  }, [setFrameloop]);
  return null;
}

/**
 * While LoopGate has the loop stopped, the canvas keeps its last frame, so a
 * palette switch wouldn't reach the background colour (the page background
 * behind every section) until the particles return: draw one frame.
 */
function RepaintOnPalette({ id }: { id: string }) {
  const get = useThree((s) => s.get);
  const advance = useThree((s) => s.advance);
  useEffect(() => {
    if (get().frameloop === "never") advance(performance.now());
  }, [id, get, advance]);
  return null;
}

export default function Scene() {
  // This component only renders in the browser (see SceneCanvas), so window is safe here.
  const [tier] = useState(pickTier);
  const [quality, setQuality] = useState<Quality>(() => ({ step: 0, bloom: tier.bloom }));
  const palette = useAccent();

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const dpr = effectiveDpr(tier.steps[quality.step]);
    console.info(`[scene] ${tier.count / 1000}k particles, pixel ratio ${dpr}, bloom ${quality.bloom ? "on" : "off"}`);
  }, [tier, quality]);

  return (
    <Canvas
      className="webgl"
      dpr={[1, tier.steps[quality.step]]}
      camera={{ position: [0, 0, 4.2], fov: 40, near: 0.1, far: 50 }}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      eventSource={document.body}
      eventPrefix="client"
    >
      <color attach="background" args={[palette.scene.canvas]} />
      <ParticleMorph count={tier.count} shape={SHAPE} color={palette.rgb.accent} rimColor={palette.scene.rim} />
      <RepaintOnPalette id={palette.id} />
      <LoopGate />
      <QualityGovernor steps={tier.steps} quality={quality} onChange={setQuality} />
      {quality.bloom && (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={palette.scene.bloom} luminanceThreshold={0.22} luminanceSmoothing={0.35} radius={0.75} />
          <Vignette offset={0.25} darkness={0.75} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
