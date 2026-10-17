// Pixel-diffs our captures (tests/__output__/{state}.png) against the manual reference
// screenshots (tests/reference/ref-{state}.png).
//
// Usage:
//   node scripts/compare-screenshots.mjs <state...|all> [--region x,y,w,h] [--threshold 0.1]
//
// --region crops both images to the same page-pixel box before comparing (one section only)
// and also writes the two crops so they can be viewed side by side.
// Writes tests/__output__/diff-{state}[-{region}].png. Report only: exits 0 unless a file is missing.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const STATES = ["full", "top", "sticky-nav", "tour-top", "tour-bedroom", "viewer-4", "amenities"];
const OUT = "tests/__output__";
const REF = "tests/reference";

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? undefined : args.splice(i, 2)[1];
};
const regionArg = flag("--region");
const threshold = Number(flag("--threshold") ?? 0.1);
const states = args.includes("all") || args.length === 0 ? STATES : args;

const unknown = states.filter((s) => !STATES.includes(s));
if (unknown.length) {
  console.error(`unknown state(s): ${unknown.join(", ")}. Known: ${STATES.join(", ")}`);
  process.exit(1);
}

let region;
if (regionArg) {
  region = regionArg.split(",").map(Number);
  if (region.length !== 4 || region.some((n) => !Number.isInteger(n) || n < 0)) {
    console.error("--region must be x,y,w,h in whole pixels");
    process.exit(1);
  }
}

const crop = (img, x, y, w, h) => {
  const out = new PNG({ width: w, height: h });
  PNG.bitblt(img, out, x, y, w, h, 0, 0);
  return out;
};

mkdirSync(OUT, { recursive: true });
let missing = false;
for (const state of states) {
  const oursPath = `${OUT}/${state}.png`;
  const refPath = `${REF}/ref-${state}.png`;
  if (!existsSync(oursPath) || !existsSync(refPath)) {
    console.log(`${state}: missing ${!existsSync(oursPath) ? oursPath : refPath}`);
    missing = true;
    continue;
  }
  const ours = PNG.sync.read(readFileSync(oursPath));
  const ref = PNG.sync.read(readFileSync(refPath));
  const sizeNote =
    ours.width !== ref.width || ours.height !== ref.height
      ? ` SIZE DIFFERS ours ${ours.width}x${ours.height} vs ref ${ref.width}x${ref.height}`
      : "";

  let [x, y, w, h] = region ?? [0, 0, Math.min(ours.width, ref.width), Math.min(ours.height, ref.height)];
  w = Math.min(w, ours.width - x, ref.width - x);
  h = Math.min(h, ours.height - y, ref.height - y);
  if (w <= 0 || h <= 0) {
    console.log(`${state}: region is outside one of the images${sizeNote}`);
    continue;
  }

  const a = crop(ours, x, y, w, h);
  const b = crop(ref, x, y, w, h);
  const diff = new PNG({ width: w, height: h });
  const changed = pixelmatch(a.data, b.data, diff.data, w, h, { threshold });

  const tag = region ? `-${x}_${y}_${w}x${h}` : "";
  writeFileSync(`${OUT}/diff-${state}${tag}.png`, PNG.sync.write(diff));
  if (region) {
    writeFileSync(`${OUT}/crop-ours-${state}${tag}.png`, PNG.sync.write(a));
    writeFileSync(`${OUT}/crop-ref-${state}${tag}.png`, PNG.sync.write(b));
  }
  const pct = ((changed / (w * h)) * 100).toFixed(2);
  console.log(`${state}${tag}: ${changed} of ${w * h} px differ (${pct}%)${sizeNote}  -> ${OUT}/diff-${state}${tag}.png`);
}
if (missing) process.exitCode = 1;
