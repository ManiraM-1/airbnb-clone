// Measures things in a screenshot (reference or ours) without a browser.
//
//   node scripts/inspect-png.mjs bbox  <png> <x,y,w,h> [--lum 200]
//       Bounding box, centre and darkest colour of "ink" (pixels darker than --lum) in the region.
//       Use a region around one element on a light background to get its rendered size/position.
//   node scripts/inspect-png.mjs pixel <png> <x,y> [<x,y> ...]
//       Exact colour (hex + alpha) at each point.
//   node scripts/inspect-png.mjs crop  <png> <x,y,w,h> <scale> <out.png>
//       Crop and enlarge (nearest neighbour) a region so it can be viewed up close.
import { readFileSync, writeFileSync } from "node:fs";
import { PNG } from "pngjs";

const [cmd, file, ...rest] = process.argv.slice(2);
const usage = () => {
  console.error("usage: inspect-png.mjs bbox <png> <x,y,w,h> [--lum 200] | pixel <png> <x,y>... | crop <png> <x,y,w,h> <scale> <out.png>");
  process.exit(1);
};
if (!cmd || !file) usage();

const img = PNG.sync.read(readFileSync(file));
const nums = (s) => s.split(",").map(Number);
const at = (x, y) => {
  const i = (y * img.width + x) * 4;
  return [img.data[i], img.data[i + 1], img.data[i + 2], img.data[i + 3]];
};
const hex = ([r, g, b]) => "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
const lum = ([r, g, b]) => 0.299 * r + 0.587 * g + 0.114 * b;

if (cmd === "bbox") {
  const [X, Y, W, H] = nums(rest[0] ?? usage());
  const li = rest.indexOf("--lum");
  const limit = li === -1 ? 200 : Number(rest[li + 1]);
  let x0 = Infinity, y0 = Infinity, x1 = -1, y1 = -1, n = 0, darkest = [255, 255, 255, 255];
  for (let y = Y; y < Math.min(Y + H, img.height); y++) {
    for (let x = X; x < Math.min(X + W, img.width); x++) {
      const p = at(x, y);
      if (lum(p) < lum(darkest)) darkest = p;
      if (lum(p) >= limit) continue;
      n++;
      x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
    }
  }
  if (!n) console.log("no ink in region");
  else
    console.log(
      `x ${x0}-${x1} (${x1 - x0 + 1}w)  y ${y0}-${y1} (${y1 - y0 + 1}h)  ` +
        `centre ${(x0 + x1) / 2},${(y0 + y1) / 2}  ink ${n}px  darkest ${hex(darkest)}`,
    );
} else if (cmd === "pixel") {
  if (!rest.length) usage();
  for (const p of rest) {
    const [x, y] = nums(p);
    const c = at(x, y);
    console.log(`${x},${y}  ${hex(c)}  alpha ${c[3]}`);
  }
} else if (cmd === "crop") {
  const [X, Y, W, H] = nums(rest[0] ?? usage());
  const scale = Number(rest[1]);
  const out = rest[2];
  if (!scale || !out) usage();
  const dst = new PNG({ width: W * scale, height: H * scale });
  for (let j = 0; j < H * scale; j++) {
    for (let i = 0; i < W * scale; i++) {
      const s = at(X + Math.floor(i / scale), Y + Math.floor(j / scale));
      dst.data.set(s, (j * W * scale + i) * 4);
    }
  }
  writeFileSync(out, PNG.sync.write(dst));
  console.log(`wrote ${out} (${W * scale}x${H * scale})`);
} else {
  usage();
}
