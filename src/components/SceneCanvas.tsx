"use client";

import dynamic from "next/dynamic";

// WebGL only exists in the browser, so the 3D scene is never server-rendered.
const Scene = dynamic(() => import("./canvas/Scene"), { ssr: false });

export function SceneCanvas() {
  return (
    <div className="scene-layer" aria-hidden="true">
      <Scene />
    </div>
  );
}
