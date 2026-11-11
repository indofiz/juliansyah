"use client";

import { useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import gsap from "gsap";
import { sceneState } from "@/lib/sceneState";
import { theme } from "@/lib/theme";
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

type Tier = { count: number; dpr: [number, number] };

/**
 * Particle budget per device:
 *  - low-end (≤ 4 CPU cores, ≤ 4 GB memory, or Save-Data on): 8k, pixel ratio 1
 *  - small screens (≤ 768px): 16k
 *  - everything else: 42k
 */
function pickTier(): Tier {
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  const lowEnd = (nav.hardwareConcurrency || 8) <= 4 || (nav.deviceMemory ?? 8) <= 4 || Boolean(nav.connection?.saveData);
  if (lowEnd) return { count: 8000, dpr: [1, 1] };
  if (window.matchMedia("(max-width: 768px)").matches) return { count: 16000, dpr: [1, 1.75] };
  return { count: 42000, dpr: [1, 1.75] };
}

/**
 * Stops rendering while the particles are faded out (most of the page), and
 * starts again as soon as a section brings them back. The last frame, an
 * empty background, stays on the canvas.
 */
function LoopGate() {
  const setFrameloop = useThree((s) => s.setFrameloop);
  useEffect(() => {
    let running = true;
    const check = () => {
      const visible = sceneState.opacity > 0.003 || sceneState.intro < 1;
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

export default function Scene() {
  // This component only renders in the browser (see SceneCanvas), so window is safe here.
  const [tier] = useState(pickTier);

  return (
    <Canvas
      className="webgl"
      dpr={tier.dpr}
      camera={{ position: [0, 0, 4.2], fov: 40, near: 0.1, far: 50 }}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      eventSource={document.body}
      eventPrefix="client"
    >
      <color attach="background" args={[theme.canvasBg]} />
      <ParticleMorph count={tier.count} shape={SHAPE} />
      <LoopGate />
      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur intensity={1.15} luminanceThreshold={0.22} luminanceSmoothing={0.35} radius={0.75} />
        <Vignette offset={0.25} darkness={0.75} />
      </EffectComposer>
    </Canvas>
  );
}
