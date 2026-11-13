"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { sceneState, showStepIcon } from "@/lib/sceneState";
import { STEP_IDS, stepTarget, type StepId } from "@/lib/stepScenes";
import type { StepArtRequest, StepArtResult } from "./stepArt.worker";
import {
  buildGlobe,
  buildScatter,
  defaultShapeGeometry,
  geometryShape,
  KIND_HALO,
  loadLandMask,
  loadModelGeometry,
  loadPortraitShape,
  SHELL_RADIUS,
  type ShapeData,
} from "@/lib/particleShapes";
import { atmosphereFragment, atmosphereVertex, particleFragment, particleVertex } from "./shaders";

/**
 * The globe's own slow spin, in radians per second, on top of the scroll
 * spin: one turn about every 80 s, west to east like the real Earth. The
 * outer shell follows a third of it, so it drifts against the land.
 */
const GLOBE_SPIN_SPEED = 0.08;

/** Brightness of the How I work step pictures (lower = dimmer dots). */
const ICON_BRIGHTNESS = 1;

/** Runs `fn` when the browser is idle (Safari has no requestIdleCallback). */
const whenIdle = (fn: () => void) =>
  typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(fn, { timeout: 1500 }) : window.setTimeout(fn, 50);

/** What the cloud morphs into in the about section. */
export type ShapeSource =
  | { type: "portrait"; url: string; height?: number; depth?: number; dotSpacing?: number; brightness?: number }
  | { type: "model"; url: string }
  | { type: "default" };

type Props = {
  count: number;
  shape?: ShapeSource;
  /** Particle and glow colour (the palette's accent). */
  color: string;
  /** Bright rim and highlight colour of the particles. */
  rimColor: string;
};

export function ParticleMorph({ count, shape: shapeSource = { type: "default" }, color, rimColor }: Props) {
  const group = useRef<THREE.Group>(null);
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  // Per-shape values the frame loop copies into uniforms.
  const shapeMeta = useRef({ minY: -1.3, maxY: 1.3, brightness: 1 });

  // Materials are created exactly once (useState initializer) and updated in
  // place every frame. Writing to the same object the renderer uses avoids
  // stale-uniform bugs when React re-renders.
  const [particleMaterial] = useState(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: particleVertex,
        fragmentShader: particleFragment,
        uniforms: {
          uTime: { value: 0 },
          uMorph: { value: 0 },
          uSink: { value: 0 },
          uSize: { value: 11 },
          uPixelRatio: { value: 1 },
          uViewportScale: { value: 1 },
          uGlobeSpin: { value: 0 },
          uShapeSpin: { value: 0 },
          uFloorY: { value: -1.55 },
          uShellRadius: { value: SHELL_RADIUS },
          uShellAmp: { value: 1 },
          uShapeY: { value: new THREE.Vector2(-1.3, 1.3) },
          uMouse: { value: new THREE.Vector2() },
          uShapeBrightness: { value: 1 },
          uStepW: { value: new THREE.Vector4() },
          uIconBrightness: { value: ICON_BRIGHTNESS },
          uFlowDir: { value: new THREE.Vector2(0, -1) },
          uDabDir: { value: new THREE.Vector2(0, -1) },
          uSpinPivot: { value: new THREE.Vector3() },
          uSpinAxis: { value: new THREE.Vector3(0, 0, 1) },
          uOpacity: { value: 1 },
          uColor: { value: new THREE.Color() },
          uRimColor: { value: new THREE.Color() },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
  );

  const [atmosphereMaterial] = useState(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: atmosphereVertex,
        fragmentShader: atmosphereFragment,
        uniforms: { uColor: { value: new THREE.Color() }, uIntensity: { value: 1 } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
  );

  // Palette colours. The first ones are set at once; switching palette fades
  // the particles to the new colours (at once with reduced motion). A switch
  // mid-fade starts from wherever the colours are.
  const colorsSet = useRef(false);
  useEffect(() => {
    const targets: [THREE.Color, string][] = [
      [particleMaterial.uniforms.uColor.value, color],
      [particleMaterial.uniforms.uRimColor.value, rimColor],
      [atmosphereMaterial.uniforms.uColor.value, color],
    ];
    if (!colorsSet.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      colorsSet.current = true;
      for (const [current, next] of targets) current.set(next);
      return;
    }
    const from = targets.map(([current]) => current.clone());
    const to = targets.map(([, next]) => new THREE.Color(next));
    const fade = { t: 0 };
    const tween = gsap.to(fade, {
      t: 1,
      duration: 0.6,
      ease: "power2.inOut",
      onUpdate: () => targets.forEach(([current], i) => current.lerpColors(from[i], to[i], fade.t)),
    });
    return () => {
      tween.kill();
    };
  }, [color, rimColor, particleMaterial, atmosphereMaterial]);

  useEffect(
    () => () => {
      particleMaterial.dispose();
      atmosphereMaterial.dispose();
    },
    [particleMaterial, atmosphereMaterial],
  );

  // Reduced motion: no fly-in, and the time-driven drift, spin and shine
  // stand still (the shaders read a frozen clock).
  const reduceMotion = useRef(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => (reduceMotion.current = mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Development: keys 1–4 show a step picture anywhere on the page, even
  // where the scroll keeps the earth (`pictures` 0); 0 hands back to the
  // scroll (in How I work, the next scroll in the step track restores its
  // picture).
  const devPictures = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const onKey = (e: KeyboardEvent) => {
      if (!/^[0-4]$/.test(e.key) || e.metaKey || e.ctrlKey || e.altKey) return;
      if ((e.target as HTMLElement | null)?.closest?.("input, textarea, select, [contenteditable]")) return;
      devPictures.current = e.key !== "0";
      if (devPictures.current) showStepIcon(STEP_IDS[Number(e.key) - 1]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // How far each step picture has faded in once built (0–1); until then the
  // globe stands in for it.
  const ready = useRef<Record<StepId, number>>({ discover: 0, design: 0, build: 0, launch: 0 });

  // Build all particle targets once, off the render loop.
  useEffect(() => {
    let cancelled = false;
    let worker: Worker | null = null;
    const fades = ready.current;
    const built = new Set<StepId>();
    gsap.killTweensOf(fades);
    for (const id of STEP_IDS) fades[id] = 0;
    (async () => {
      const mask = await loadLandMask("/textures/earth-mask.png");
      const globe = buildGlobe(count, mask);
      const scatter = buildScatter(count);

      let shape: ShapeData | null = null;
      try {
        if (shapeSource.type === "portrait") {
          shape = await loadPortraitShape(shapeSource.url, count, shapeSource);
        } else if (shapeSource.type === "model") {
          shape = geometryShape(await loadModelGeometry(shapeSource.url), count);
        }
      } catch (err) {
        console.warn(`[ParticleMorph] Could not load the shape, using the default.`, err);
      }
      shape ??= geometryShape(defaultShapeGeometry(), count);

      const random = new Float32Array(count * 4);
      for (let i = 0; i < random.length; i++) random[i] = Math.random();

      if (cancelled) return;
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(globe.positions, 3));
      g.setAttribute("aGlobe", new THREE.BufferAttribute(globe.positions, 3));
      g.setAttribute("aScatter", new THREE.BufferAttribute(scatter, 3));
      g.setAttribute("aShape", new THREE.BufferAttribute(shape.positions, 3));
      g.setAttribute("aShade", new THREE.BufferAttribute(shape.shade, 1));
      shapeMeta.current = {
        minY: shape.minY,
        maxY: shape.maxY,
        brightness: shapeSource.type === "portrait" ? (shapeSource.brightness ?? 1.1) : 1,
      };
      g.setAttribute("aRandom", new THREE.BufferAttribute(random, 4));
      g.setAttribute("aKind", new THREE.BufferAttribute(globe.kinds, 1));
      setGeometry(g);

      // Intro: particles fly in from the cloud and assemble the globe
      // (skipped with reduced motion: the globe is simply there). Landing
      // where a step picture shows (How I work, About: a reload there, a
      // #process link), it waits for that picture, so they assemble into
      // it, not the earth.
      let introStarted = false;
      const startIntro = () => {
        if (introStarted || cancelled) return;
        introStarted = true;
        if (reduceMotion.current) sceneState.intro = 1;
        else gsap.fromTo(sceneState, { intro: 0 }, { intro: 1, duration: 2.6, ease: "power3.out", delay: 0.15 });
      };
      const waitFor = sceneState.pictures > 0.5 ? sceneState.iconTarget : null;
      if (waitFor) window.setTimeout(startIntro, 2500);
      else startIntro();

      // The How I work step pictures, built in a worker (a ray per dot,
      // ~0.1–0.5 s a picture), Discover first. Without workers, one per
      // idle moment on the main thread. The picture uses the globe's land
      // and ocean particles; the shell's (the last ones) become its haze.
      const shellStart = globe.kinds.indexOf(KIND_HALO);
      const usable = shellStart === -1 ? count : shellStart;
      const u = particleMaterial.uniforms;
      const receive = ({ id, data, flow, dab, spin }: StepArtResult) => {
        if (cancelled) return;
        built.add(id);
        g.setAttribute(`aStep${STEP_IDS.indexOf(id) + 1}`, new THREE.BufferAttribute(data, 4));
        if (flow) (u.uFlowDir.value as THREE.Vector2).set(...flow).normalize();
        if (dab) (u.uDabDir.value as THREE.Vector2).set(...dab).normalize();
        if (spin) {
          (u.uSpinPivot.value as THREE.Vector3).set(...spin.pivot);
          (u.uSpinAxis.value as THREE.Vector3).set(...spin.axis).normalize();
        }
        // Fade in, so a picture that's already wanted doesn't pop in over
        // the globe; at once if the intro was waiting for it.
        if (id === waitFor && !introStarted) {
          fades[id] = 1;
          startIntro();
        } else {
          gsap.to(fades, { [id]: 1, duration: reduceMotion.current ? 0 : 0.9, ease: "power2.inOut" });
        }
      };
      const onMainThread = (order: StepId[]) => {
        const [id, ...rest] = order;
        if (!id || cancelled) return;
        whenIdle(() => {
          if (cancelled) return;
          receive({ id, ...stepTarget(id, count, { usable }) });
          onMainThread(rest);
        });
      };
      try {
        worker = new Worker(new URL("./stepArt.worker.ts", import.meta.url));
        worker.onmessage = (e: MessageEvent<StepArtResult>) => receive(e.data);
        worker.onerror = () => {
          worker?.terminate();
          onMainThread(STEP_IDS.filter((id) => !built.has(id)));
        };
        worker.postMessage({ count, usable, order: [...STEP_IDS] } satisfies StepArtRequest);
      } catch {
        onMainThread([...STEP_IDS]);
      }
    })();
    return () => {
      cancelled = true;
      worker?.terminate();
      gsap.killTweensOf(fades);
    };
    // Re-run only when the shape source actually changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, JSON.stringify(shapeSource)]);

  useEffect(() => () => geometry?.dispose(), [geometry]);

  const tilt = useRef({ x: 0, y: 0 });
  const clock = useRef(0);
  const points = useRef<THREE.Points>(null);
  const atmosphere = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g || !points.current || !atmosphere.current) return;
    const s = sceneState;
    // Write through the rendered objects so we always touch the live uniforms.
    const u = (points.current.material as THREE.ShaderMaterial).uniforms;
    const atmo = (atmosphere.current.material as THREE.ShaderMaterial).uniforms;
    const { size, viewport } = state;
    // Our own clock: R3F's restarts at 0 whenever LoopGate resumes the loop,
    // which would snap the spin, shine and shell back. A long frame advances
    // it by at most 0.1 s, so motion never jumps.
    if (!reduceMotion.current) clock.current += Math.min(delta, 0.1);
    const time = reduceMotion.current ? 0 : clock.current;
    u.uTime.value = time;
    u.uPixelRatio.value = state.gl.getPixelRatio();
    u.uViewportScale.value = size.height / 900;

    // Intro overrides the morph until it finishes (only while in globe range).
    const introMorph = 1 - s.intro;
    u.uMorph.value = s.morph < 1 ? Math.max(s.morph, introMorph) : s.morph;
    u.uSink.value = s.sink;
    u.uGlobeSpin.value = s.globeSpin + time * GLOBE_SPIN_SPEED;
    u.uShapeSpin.value = s.shapeSpin + Math.sin(time * 0.3) * 0.08;
    u.uOpacity.value = s.opacity;
    (u.uShapeY.value as THREE.Vector2).set(shapeMeta.current.minY, shapeMeta.current.maxY);
    u.uShapeBrightness.value = shapeMeta.current.brightness;
    // A picture shows only where the scroll allows it (`pictures`); one that
    // isn't built yet shows as the globe.
    const allowed = devPictures.current ? 1 : THREE.MathUtils.clamp(s.pictures, 0, 1);
    const [w1, w2, w3, w4] = STEP_IDS.map((id) => s.icons[id] * ready.current[id] * allowed);
    const iconTotal = w1 + w2 + w3 + w4;
    (u.uStepW.value as THREE.Vector4).set(w1, w2, w3, w4);

    // The glowing atmosphere belongs to the globe: it fades as the globe
    // dissolves, sinks or becomes a step icon.
    atmo.uIntensity.value =
      s.opacity * (1 - THREE.MathUtils.smoothstep(u.uMorph.value, 0, 0.45)) * (1 - s.sink) * (1 - iconTotal);

    // Skip drawing entirely while the particles are faded out.
    points.current.visible = s.opacity > 0.003;
    atmosphere.current.visible = atmo.uIntensity.value > 0.003;

    // Size relative to the viewport: by height on wide screens, shrinking on
    // narrower desktop shapes (4:3) and fitting the width on portrait/mobile.
    // The hero glass bars (.hero-bars --r) mirror this: min(100vh, 62.5vw).
    const fit = viewport.aspect >= 1 ? Math.min(1, viewport.aspect / 1.6) : Math.min(1, viewport.width / 3.4);
    const mobile = viewport.aspect < 0.8;
    g.position.x = s.x * (viewport.width / 2) * (mobile ? 0.35 : 1);
    g.position.y = s.y * (viewport.height / 2);
    g.scale.setScalar(s.scale * fit);

    // Subtle tilt toward the pointer. While the shape (portrait) or a step
    // icon is showing, the whole-scene tilt eases off and the shape itself
    // turns a few degrees.
    const shapeMix = Math.max(THREE.MathUtils.clamp(u.uMorph.value - 1, 0, 1), iconTotal);
    const sceneTilt = 1 - 0.9 * shapeMix;
    tilt.current.x = THREE.MathUtils.damp(tilt.current.x, -state.pointer.y * 0.12 * sceneTilt, 3, delta);
    tilt.current.y = THREE.MathUtils.damp(tilt.current.y, state.pointer.x * 0.18 * sceneTilt, 3, delta);
    g.rotation.set(tilt.current.x, tilt.current.y, 0);
    const mouse = u.uMouse.value as THREE.Vector2;
    mouse.x = THREE.MathUtils.damp(mouse.x, state.pointer.x * 0.12, 2.5, delta); // yaw  ≈ ±7°
    mouse.y = THREE.MathUtils.damp(mouse.y, -state.pointer.y * 0.06, 2.5, delta); // pitch ≈ ±3.5°
  });

  return (
    <group ref={group}>
      {geometry && <points ref={points} geometry={geometry} material={particleMaterial} frustumCulled={false} />}
      {geometry && (
        <mesh ref={atmosphere} scale={1.005} material={atmosphereMaterial}>
          <sphereGeometry args={[1, 64, 64]} />
        </mesh>
      )}
    </group>
  );
}
