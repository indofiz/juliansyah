"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { sceneState } from "@/lib/sceneState";
import { theme } from "@/lib/theme";
import {
  buildGlobe,
  buildScatter,
  defaultShapeGeometry,
  geometryShape,
  loadLandMask,
  loadModelGeometry,
  loadPortraitShape,
  SHELL_RADIUS,
  type ShapeData,
} from "@/lib/particleShapes";
import { atmosphereFragment, atmosphereVertex, particleFragment, particleVertex } from "./shaders";

/** What the cloud morphs into in the about section. */
export type ShapeSource =
  | { type: "portrait"; url: string; height?: number; depth?: number; dotSpacing?: number; brightness?: number }
  | { type: "model"; url: string }
  | { type: "default" };

type Props = {
  count: number;
  shape?: ShapeSource;
  color?: string;
  rimColor?: string;
};

export function ParticleMorph({ count, shape: shapeSource = { type: "default" }, color = theme.particle, rimColor = theme.particleRim }: Props) {
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

  useEffect(() => {
    particleMaterial.uniforms.uColor.value.set(color);
    particleMaterial.uniforms.uRimColor.value.set(rimColor);
    atmosphereMaterial.uniforms.uColor.value.set(color);
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

  // Build all particle targets once, off the render loop.
  useEffect(() => {
    let cancelled = false;
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
      // (skipped with reduced motion: the globe is simply there).
      if (reduceMotion.current) sceneState.intro = 1;
      else gsap.fromTo(sceneState, { intro: 0 }, { intro: 1, duration: 2.6, ease: "power3.out", delay: 0.15 });
    })();
    return () => {
      cancelled = true;
    };
    // Re-run only when the shape source actually changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, JSON.stringify(shapeSource)]);

  useEffect(() => () => geometry?.dispose(), [geometry]);

  const tilt = useRef({ x: 0, y: 0 });
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
    const time = reduceMotion.current ? 0 : state.clock.elapsedTime;
    u.uTime.value = time;
    u.uPixelRatio.value = state.gl.getPixelRatio();
    u.uViewportScale.value = size.height / 900;

    // Intro overrides the morph until it finishes (only while in globe range).
    const introMorph = 1 - s.intro;
    u.uMorph.value = s.morph < 1 ? Math.max(s.morph, introMorph) : s.morph;
    u.uSink.value = s.sink;
    u.uGlobeSpin.value = s.globeSpin + time * 0.025;
    u.uShapeSpin.value = s.shapeSpin + Math.sin(time * 0.3) * 0.08;
    u.uOpacity.value = s.opacity;
    (u.uShapeY.value as THREE.Vector2).set(shapeMeta.current.minY, shapeMeta.current.maxY);
    u.uShapeBrightness.value = shapeMeta.current.brightness;

    atmo.uIntensity.value =
      s.opacity * (1 - THREE.MathUtils.smoothstep(u.uMorph.value, 0, 0.45)) * (1 - s.sink);

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

    // Subtle tilt toward the pointer. While the shape (portrait) is showing,
    // the whole-scene tilt eases off and the head itself turns a few degrees.
    const shapeMix = THREE.MathUtils.clamp(u.uMorph.value - 1, 0, 1);
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
