"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// WebGL only exists in the browser, so the 3D scene is never server-rendered.
const Scene = dynamic(() => import("./canvas/Scene"), { ssr: false });

/**
 * The scene (three.js, ~0.5 MB of JS) mounts only once the page has loaded
 * and the main thread is idle, so it never competes with the headline for
 * the first paint (LCP). The particles then fly in and assemble the globe.
 */
export function SceneCanvas() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idle = 0;
    let timer = 0;
    const start = () => {
      // Safari has no requestIdleCallback.
      if (typeof window.requestIdleCallback === "function") idle = window.requestIdleCallback(() => setReady(true), { timeout: 1500 });
      else timer = setTimeout(() => setReady(true), 200) as unknown as number;
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      if (idle) window.cancelIdleCallback(idle);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="scene-layer" aria-hidden="true">
      {ready && <Scene />}
    </div>
  );
}
