/**
 * Particle morph shader.
 *
 * Every particle carries three target positions (aGlobe, aScatter, aShape).
 * uMorph (0 → 1 → 2) blends between them on the GPU, so tens of thousands of
 * particles animate with zero per-frame JavaScript work. aRandom staggers each
 * particle a little so they don't all move in lock-step.
 */
/**
 * 3D simplex noise (Stefan Gustavson / Ashima Arts, MIT licence). Drives the
 * "dancing" outer shell: smooth, slowly evolving bumps on a sphere.
 */
const simplexNoise = /* glsl */ `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }
`;

/**
 * Particle morph shader.
 *
 * Every particle carries three target positions (aGlobe, aScatter, aShape).
 * uMorph (0 → 1 → 2) blends between them on the GPU, so tens of thousands of
 * particles animate with zero per-frame JavaScript work. aRandom staggers each
 * particle a little so they don't all move in lock-step.
 *
 * Shell particles (aKind = 1) don't use a fixed radius: each frame their
 * radius is pushed in and out by layered noise, split into three strands, so
 * the outer layer wobbles ("dances") like the reference.
 *
 * How I work: the globe can also become one of four step icons (aStep1…4,
 * lib/stepIcons.ts). uStepW says how much of each shows; the globe gets the
 * rest. The cloud, portrait and floor stages run on top of that "home".
 */
export const particleVertex = /* glsl */ `
  uniform float uTime;
  uniform float uMorph;
  uniform float uSink;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uViewportScale;
  uniform float uGlobeSpin;
  uniform float uShapeSpin;
  uniform float uFloorY;
  uniform float uShellRadius;
  uniform float uShellAmp;
  uniform vec2 uShapeY;   // min / max y of the shape, for the shine sweep
  uniform vec2 uMouse;    // damped pointer → small yaw / pitch on the shape
  uniform float uShapeBrightness; // overall brightness of the shape (portrait)
  uniform vec4 uStepW;            // how much of each step icon shows (Discover, Design, Build, Launch)
  uniform float uIconBrightness;  // overall brightness of the step icons

  attribute vec3 aGlobe;
  attribute vec3 aScatter;
  attribute vec3 aShape;
  attribute vec4 aRandom;
  attribute float aKind; // 0 land, 1 shell, 2 ocean
  attribute float aShade; // 0–1 brightness of the shape point (photo brightness for the portrait)
  attribute vec4 aStep1;  // step icons: xyz = the particle's place, w = its brightness (0 = hidden)
  attribute vec4 aStep2;
  attribute vec4 aStep3;
  attribute vec4 aStep4;

  varying float vAlpha;
  varying float vGlow;
  varying float vShape;

  ${simplexNoise}

  vec3 rotateY(vec3 p, float a) {
    float c = cos(a), s = sin(a);
    return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
  }
  vec3 rotateX(vec3 p, float a) {
    float c = cos(a), s = sin(a);
    return vec3(p.x, c * p.y - s * p.z, s * p.y + c * p.z);
  }
  // Staggered 0→1 progress for one stage of the morph.
  float stage(float m, float start, float r) {
    float t = clamp((m - start - r * 0.35) / 0.65, 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t);
  }

  void main() {
    // Shape height 0 (bottom) → 1 (top): the shape builds up from the bottom.
    float yN = clamp((aShape.y - uShapeY.x) / max(uShapeY.y - uShapeY.x, 0.001), 0.0, 1.0);
    float t1 = stage(uMorph, 0.0, aRandom.x);                          // globe → cloud
    float t2 = stage(uMorph, 1.0, mix(aRandom.y, yN, 0.65));           // cloud → shape
    float isShell = 1.0 - step(0.5, abs(aKind - 1.0));

    // ---- Dancing shell ----------------------------------------------------
    vec3 base = aGlobe;
    if (isShell > 0.5) {
      vec3 dir = normalize(aGlobe);
      float strand = floor(aRandom.z * 3.0);          // three thin strands
      float t = uTime;
      // One shared low-frequency field shapes the whole shell (so the strands
      // wobble together as parallel lines), plus a little per-strand detail.
      float n1 = snoise(dir * 1.25 + vec3(0.0, t * 0.16, -t * 0.11));
      float n2 = snoise(dir * 2.6 + vec3(-t * 0.21, 3.7, t * 0.17));
      float breathe = 0.012 * sin(t * 0.8);
      float r = uShellRadius
        + uShellAmp * (n1 * 0.1 + n2 * 0.022)
        + (strand - 1.0) * 0.045 * (1.0 + 0.6 * n2)
        + (aRandom.w - 0.5) * 0.004
        + breathe;
      // Drift slowly along the surface, a little against the globe's spin.
      base = rotateY(dir, -t * 0.03) * r;
    }

    // Tilt toward the viewer so the northern hemisphere reads well. The shell
    // follows only part of the scroll-driven spin, so it moves independently.
    float spin = uGlobeSpin * mix(1.0, 0.35, isShell);
    vec3 globe = rotateX(rotateY(base, spin), 0.32);
    // Scroll spin plus a small turn toward the mouse.
    vec3 shape = rotateY(rotateX(aShape, uMouse.y), uShapeSpin + uMouse.x);
    vec3 cloud = rotateY(aScatter, uTime * 0.04);

    // ---- Step icons -------------------------------------------------------
    // iT: this particle's way from the globe to the icons, staggered like
    // the other stages. Among themselves the icons blend by their shares,
    // staggered too, so one icon turns straight into the next; halfway
    // between two the particles bow out a little, so it reads as one
    // dissolving into the other rather than collapsing. The share stagger is
    // smaller (at most 0.19) than the smallest leading share (0.25 with four
    // icons), so some icon always holds the particle. The icons face the
    // camera with a slow sway (±12°) and a small turn toward the mouse.
    float iconTotal = dot(uStepW, vec4(1.0));
    float iT = stage(iconTotal, 0.0, aRandom.x);
    vec4 share = uStepW / max(iconTotal, 0.0001);
    float rShare = aRandom.x * 0.55;
    vec4 sw = vec4(stage(share.x, 0.0, rShare), stage(share.y, 0.0, rShare), stage(share.z, 0.0, rShare), stage(share.w, 0.0, rShare));
    sw /= max(dot(sw, vec4(1.0)), 0.0001);
    vec4 icon = aStep1 * sw.x + aStep2 * sw.y + aStep3 * sw.z + aStep4 * sw.w;
    float between = clamp(2.0 * (1.0 - dot(sw, sw)), 0.0, 1.0);
    vec3 iconP = rotateY(rotateX(icon.xyz + aScatter * 0.12 * between, uMouse.y), sin(uTime * 0.35) * 0.21 + uMouse.x);

    vec3 home = mix(globe, iconP, iT);
    vec3 p = mix(home, cloud, t1);
    p = mix(p, shape, t2);

    // Gentle drift: tiny on the globe, larger while scattered as a cloud.
    float chaos = t1 * (1.0 - t2);
    vec3 drift = vec3(
      sin(uTime * 0.7 + aRandom.z * 6.2831),
      cos(uTime * 0.6 + aRandom.w * 6.2831),
      sin(uTime * 0.5 + aRandom.x * 6.2831)
    );
    p += drift * (0.003 + chaos * 0.09);

    // Sink: particles rain down onto a glowing floor, staggered by aRandom.z.
    float s = clamp(uSink * 1.6 - aRandom.z * 0.6, 0.0, 1.0);
    s = s * s * (3.0 - 2.0 * s);
    vec3 floorP = vec3(aScatter.x * 1.6, uFloorY + aRandom.y * aRandom.y * 0.35, aScatter.z * 1.3);
    p = mix(p, floorP, s);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    // ---- Lighting ---------------------------------------------------------
    // Key light from the top-left: bright rim and land there, dimmer toward
    // the bottom-right. Fresnel rim adds the glowing edge.
    vec3 n = normalize(normalMatrix * normalize(globe));
    float facing = dot(n, normalize(-mv.xyz));
    vec3 lightDir = normalize(vec3(-0.55, 0.7, 0.5));
    float light = smoothstep(-0.45, 0.9, dot(n, lightDir));
    float rim = pow(1.0 - clamp(facing, 0.0, 1.0), 3.0) * mix(0.15, 1.3, light);

    float surfaceAlpha = (aKind < 0.5 ? 1.0 : 0.28)
      * mix(0.06, 1.0, smoothstep(-0.25, 0.3, facing))
      * mix(0.3, 1.0, light);
    // Shell: strongest at the silhouette (where the strands read as lines),
    // faint across the face, like a soap bubble.
    float limb = pow(1.0 - abs(facing), 2.5);
    float shellAlpha = mix(0.1, 1.0, limb) * mix(0.45, 1.0, light);
    float alphaGlobe = mix(surfaceAlpha, shellAlpha, isShell);
    float alphaHome = mix(alphaGlobe, icon.w * uIconBrightness, iT);

    float alphaCloud = 0.35 + 0.5 * aRandom.w;
    float alphaShape = aShade * uShapeBrightness * mix(0.7, 1.0, smoothstep(-0.6, 0.5, shape.z));

    // Shine: a band of light sweeps up the shape from bottom to top, leaving
    // a short afterglow below it. One pass every ~5.5 s.
    float ph = fract(uTime / 5.5);
    float bandY = mix(-0.15, 1.15, ph);
    float d = yN - bandY;
    float band = exp(-d * d / 0.0025) + 0.3 * exp(-max(-d, 0.0) / 0.07) * step(d, 0.0);
    band *= smoothstep(0.0, 0.06, ph) * (1.0 - smoothstep(0.9, 1.0, ph));
    float shine = band * t2 * (1.0 - t1 * (1.0 - t2));

    // Halftone look (even, crisper dots) for the portrait and the icons.
    float halftone = max(t2, iT * (1.0 - t1));
    vShape = halftone;
    vAlpha = mix(mix(alphaHome, alphaCloud, t1), alphaShape, t2);
    vAlpha += shine * step(0.001, aShade) * (0.06 + 0.3 * aShade) * uShapeBrightness;
    vAlpha = mix(vAlpha, 0.55 + 0.45 * aRandom.w, s);
    float glowGlobe = mix(rim * 1.8, 0.2 + light * 0.25, isShell);
    vGlow = (1.0 - t1) * mix(glowGlobe, 0.03 + icon.w * 0.05, iT) + t2 * 0.02 + s * 0.3 + shine * aShade * 0.35;

    float sizeKind = isShell > 0.5 ? 0.8 : 1.0;
    // Shape dots are smaller and more even (halftone look); shine enlarges them.
    float size = uSize * mix(mix(0.55, 1.25, aRandom.w), 1.08, halftone) * mix(sizeKind, 1.0, max(t1, iT)) * (1.0 + shine * 0.15);
    gl_PointSize = size * uPixelRatio * uViewportScale / -mv.z;

    // Hidden particles (no dot in the icon or the portrait) go outside the
    // view once they've faded out, so the GPU skips them instead of drawing
    // thousands of invisible dots. Nothing visible ever gets this low: the
    // dimmest globe dots are about 0.005.
    if (vAlpha < 0.002) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
  }
`;

export const particleFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uRimColor;
  uniform float uOpacity;

  varying float vAlpha;
  varying float vGlow;
  varying float vShape;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    // Soft glowing dots for the globe/cloud, crisper halftone dots for the shape.
    float a = smoothstep(0.5, mix(0.05, 0.32, vShape), d) * vAlpha * uOpacity;
    // Values above 1.0 are what the bloom pass picks up as glow.
    vec3 col = mix(uColor, uRimColor, clamp(vGlow * 0.6, 0.0, 1.0)) * (1.0 + vGlow * 1.6);
    gl_FragColor = vec4(col, a);
  }
`;

/** Thin fresnel shell that gives the globe its continuous bright edge. */
export const atmosphereVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

export const atmosphereFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec3 n = normalize(vNormal);
    float f = 1.0 - max(dot(n, normalize(vView)), 0.0);
    // Same top-left key light as the particles: bright edge there, faint opposite.
    float light = smoothstep(-0.45, 0.9, dot(n, normalize(vec3(-0.55, 0.7, 0.5))));
    float i = (pow(f, 6.0) * 2.2 + pow(f, 2.0) * 0.05) * uIntensity * mix(0.18, 1.3, light);
    gl_FragColor = vec4(uColor * i, i);
  }
`;
