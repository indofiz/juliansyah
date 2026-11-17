// Lists English lines in src/content/site.ts with no Indonesian in
// src/content/site.id.ts, and dictionary entries no line uses any more
// (usually an English line that was edited after it was translated).
//
//   npm run i18n:check            exits 1 if anything is missing or stale
//   npm run i18n:check -- --json  the missing lines as a JSON object, ready to fill in
//
// Runs site.ts with Node's type stripping; extensionless relative imports
// ("./mockups") are resolved to .ts by the hook below.
import { register } from "node:module";

register(
  "data:text/javascript," +
    encodeURIComponent(`
      export async function resolve(specifier, context, next) {
        try { return await next(specifier, context); }
        catch (e) {
          if (specifier.startsWith(".") && !/\\.[a-z]+$/.test(specifier)) return next(specifier + ".ts", context);
          throw e;
        }
      }`),
);

const { content } = await import("../src/content/site.ts");
const { id, unchanged } = await import("../src/content/site.id.ts");

// Not words to translate: identifiers, names and numbers (same as content/locale.ts
// skips, plus names that read the same in every language).
const skipKeys = new Set([
  "slug", "id", "icon", "kind", "frame", "tail", "platforms", "src", "mask", "glare", "poster", "webm", "mp4", "captions", "href",
  "name", "first", "second", "city", "region", "timeZone", "utcOffset", "client", "store", "checked", "year", "number",
]);
const isWords = (s) => /\p{L}/u.test(s) && !s.startsWith("TODO:") && !/^(https?:|mailto:|\/)/.test(s) && !/^[\w.+-]+@[\w.-]+$/.test(s);

const lines = new Map(); // English line → where it's used
(function walk(value, path, key) {
  if (typeof value === "string") {
    if (!skipKeys.has(key) && isWords(value) && !lines.has(value)) lines.set(value, path);
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => walk(v, `${path}[${i}]`, key));
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) walk(v, path ? `${path}.${k}` : k, k);
  }
})(content, "", "");

const same = new Set(unchanged);
const missing = [...lines].filter(([en]) => !(en in id) && !same.has(en));
const used = (s) => {
  let found = false;
  (function walk(v) {
    if (found) return;
    if (typeof v === "string") found = v === s;
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  })(content);
  return found;
};
const stale = [...Object.keys(id), ...unchanged].filter((en) => !used(en));

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(Object.fromEntries(missing.map(([en]) => [en, ""])), null, 2));
  process.exit(0);
}

for (const [en, where] of missing) console.log(`missing  ${where}\n         ${JSON.stringify(en)}`);
for (const en of stale) console.log(`stale    ${JSON.stringify(en)} (no English line matches it any more)`);
console.log(`\n${lines.size} lines · ${lines.size - missing.length} translated or unchanged · ${missing.length} missing · ${stale.length} stale`);
process.exit(missing.length || stale.length ? 1 : 0);
