/**
 * Records a web page scrolling, for a Selected work card's hover video or a
 * case study's hero video.
 *
 *   node scripts/record-scroll.mjs <url> <tour.json> <out.mp4>
 *   node scripts/record-scroll.mjs <url> <tour.json> <still.png>
 *
 * With a .png it takes a 2× still of the top of the page instead, prepared
 * the same way: the frame the video starts and ends on, for `screens[0]`.
 *
 * Needs agent-browser (npm i -g agent-browser && agent-browser install) and
 * ffmpeg on PATH. Serve the site first, e.g. `npx serve -l 4173 <folder>`.
 *
 * tour.json:
 *   {
 *     "viewport": [1440, 900],   CSS pixels
 *     "scale": 0.6667,           device pixel ratio: the video is viewport × scale. Below 1
 *                                keeps the 1440 layout with fewer pixels; at 1440×900 × 1
 *                                agent-browser's encoder falls behind on an Intel Mac
 *     "fps": 30,
 *     "settle": 3000,            ms to wait after load, so intro animations finish
 *     "stops": [                 in order; the first frame is the page at the top
 *       { "hold": 900 },
 *       { "to": "#about", "ms": 1400, "hold": 900 },
 *       { "to": "end", "ms": 900, "hold": 1200 },
 *       { "to": 0, "ms": 2000, "hold": 800 }
 *     ]
 *   }
 * `to` is a CSS selector (scrolls to its top), a number of pixels, or "end".
 * End the tour back at 0, so the first and last frames match and the loop
 * has no jump.
 *
 * The scroll runs in real time, so reveal animations that play once on a
 * timer show as they would for a visitor. Lazy images are switched to eager
 * before recording, so none pop in on camera.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const [url, tourPath, out] = process.argv.slice(2);
if (!url || !tourPath || !out) {
  console.error("usage: node scripts/record-scroll.mjs <url> <tour.json> <out.mp4>");
  process.exit(1);
}
const tour = JSON.parse(fs.readFileSync(tourPath, "utf8"));
const [width, height] = tour.viewport ?? [1440, 900];
const still = out.endsWith(".png");
const scale = still ? 2 : (tour.scale ?? 1);
const fps = tour.fps ?? 30;
const SESSION = ["--session", "record-scroll"];

const ab = (args, input) =>
  execFileSync("agent-browser", [...SESSION, ...args], { input, encoding: "utf8", stdio: ["pipe", "pipe", "inherit"] }).trim();
const evalJs = (js) => {
  const raw = ab(["eval", "--stdin"], js);
  try {
    return JSON.parse(JSON.parse(raw));
  } catch {
    return raw;
  }
};
const launch = (windowHeight) =>
  ab([
    "--args",
    `--force-device-scale-factor=${scale},--window-size=${width},${windowHeight},--hide-scrollbars`,
    "open",
    url,
  ]);

try {
  ab(["close"]);
} catch {
  /* nothing open */
}

// The window includes some browser chrome even headless: measure it, then
// relaunch so the page itself is exactly width × height.
launch(height);
const inner = evalJs("JSON.stringify(innerHeight)");
if (inner !== height) {
  ab(["close"]);
  launch(height + (height - inner));
}
const size = evalJs("JSON.stringify([innerWidth, innerHeight, devicePixelRatio])");
console.log(`viewport ${size.join(" × ")}`);

// Hide the scrollbar, load every image now, wait for fonts.
evalJs(`(async () => {
  const s = document.createElement("style");
  s.textContent = "html{scrollbar-width:none}html::-webkit-scrollbar{display:none}";
  document.head.append(s);
  document.querySelectorAll('img[loading="lazy"]').forEach((img) => (img.loading = "eager"));
  await document.fonts.ready;
  await Promise.all([...document.images].map((img) => img.complete || new Promise((r) => (img.onload = img.onerror = r))));
  return JSON.stringify(document.images.length);
})()`);
ab(["wait", String(tour.settle ?? 3000)]);

if (still) {
  evalJs("scrollTo(0, 0)");
  ab(["screenshot", path.resolve(out)]);
  ab(["close"]);
  console.log(`still → ${out}`);
  process.exit(0);
}

// The tour runs in the page, so its timing doesn't depend on CLI round trips.
const tourJs = `(() => {
  const stops = ${JSON.stringify(tour.stops)};
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const max = () => document.documentElement.scrollHeight - innerHeight;
  const target = (to) =>
    to === "end" ? max()
    : typeof to === "number" ? to
    : Math.round(document.querySelector(to).getBoundingClientRect().top + scrollY);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const glide = (to, ms) => new Promise((r) => {
    const from = scrollY, end = Math.min(Math.max(target(to), 0), max()), t0 = performance.now();
    const step = (now) => {
      const t = Math.min((now - t0) / ms, 1);
      scrollTo(0, from + (end - from) * ease(t));
      t < 1 ? requestAnimationFrame(step) : r();
    };
    requestAnimationFrame(step);
  });
  window.__tourDone = false;
  setTimeout(async () => {
    for (const s of stops) {
      if (s.to !== undefined) await glide(s.to, s.ms ?? 1200);
      await wait(s.hold ?? 0);
    }
    window.__tourDone = true;
  }, 0);
  return "started";
})()`;

const total = tour.stops.reduce((n, s) => n + (s.ms ?? (s.to !== undefined ? 1200 : 0)) + (s.hold ?? 0), 0);
fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
evalJs("scrollTo(0, 0)");
ab(["record", "start", path.resolve(out), "--fps", String(fps)]);
evalJs(tourJs);
ab(["wait", "--fn", "window.__tourDone === true", "--timeout", String(total + 15000)]);
console.log(ab(["record", "stop", "--json"]));
ab(["close"]);
console.log(`tour ${(total / 1000).toFixed(1)} s → ${out}`);
