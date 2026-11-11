"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// WebGL only exists in the browser, so the 3D scene is never server-rendered.
const Scene = dynamic(() => import("./canvas/Scene"), { ssr: false });

const FIRST_INPUT = ["pointermove", "pointerdown", "touchstart", "wheel", "keydown", "scroll"] as const;

/**
 * The scene (three.js + post-processing, the biggest script on the page)
 * starts on the visitor's first interaction, or 3 s after the page has
 * loaded if they don't interact. It never competes with the headline for
 * the first paint (LCP) or with hydration, and the particles' fly-in reads
 * as an intro either way.
 */
export function SceneCanvas() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let timer = 0;
    let idle = 0;
    const start = () => {
      cleanup();
      setReady(true);
    };
    const afterLoad = () => {
      timer = window.setTimeout(() => {
        // Safari has no requestIdleCallback.
        if (typeof window.requestIdleCallback === "function") idle = window.requestIdleCallback(start, { timeout: 1000 });
        else start();
      }, 3000);
    };
    const cleanup = () => {
      FIRST_INPUT.forEach((e) => window.removeEventListener(e, start));
      window.removeEventListener("load", afterLoad);
      window.clearTimeout(timer);
      if (idle) window.cancelIdleCallback(idle);
    };

    FIRST_INPUT.forEach((e) => window.addEventListener(e, start, { passive: true }));
    if (document.readyState === "complete") afterLoad();
    else window.addEventListener("load", afterLoad, { once: true });
    return cleanup;
  }, []);

  return (
    <div className="scene-layer" aria-hidden="true">
      {ready && <Scene />}
    </div>
  );
}
