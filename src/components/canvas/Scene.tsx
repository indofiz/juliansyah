"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { ParticleMorph, type ShapeSource } from "./ParticleMorph";

/**
 * What the particle cloud turns into in the services section.
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

export default function Scene() {
  // This component only renders in the browser (see SceneCanvas), so window is
  // safe here. Fewer particles on small / low-power screens.
  const [count] = useState(() => (window.matchMedia("(max-width: 768px)").matches ? 16000 : 42000));

  return (
    <Canvas
      className="webgl"
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 4.2], fov: 40, near: 0.1, far: 50 }}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      eventSource={document.body}
      eventPrefix="client"
    >
      <color attach="background" args={["#020604"]} />
      <ParticleMorph count={count} shape={SHAPE} />
      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur intensity={1.15} luminanceThreshold={0.22} luminanceSmoothing={0.35} radius={0.75} />
        <Vignette offset={0.25} darkness={0.75} />
      </EffectComposer>
    </Canvas>
  );
}
