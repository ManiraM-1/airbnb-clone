// Compares horizontal ink bands (text lines, icons, boxes) between the reference and our capture
// inside a column, to find vertical/horizontal offsets independent of antialiasing.
// Usage: node scripts/compare-bands.mjs <state> x0,x1,y0,y1 [--lum 150]
import { readFileSync } from "node:fs";
import { PNG } from "pngjs";

const [state, box, ...rest] = process.argv.slice(2);
if (!state || !box) {
  console.error("usage: compare-bands.mjs <state> x0,x1,y0,y1 [--lum 150]");
  process.exit(1);
}
const [X0, X1, Y0, Y1] = box.split(",").map(Number);
const li = rest.indexOf("--lum");
const LUM = li === -1 ? 150 : Number(rest[li + 1]);

function bands(file) {
  const im = PNG.sync.read(readFileSync(file));
  const out = [];
  let cur = null;
  for (let y = Y0; y < Math.min(Y1, im.height); y++) {
    let x0 = Infinity, x1 = -1;
    for (let x = X0; x < X1; x++) {
      const i = (y * im.width + x) * 4;
      if (0.299 * im.data[i] + 0.587 * im.data[i + 1] + 0.114 * im.data[i + 2] < LUM) {
        x0 = Math.min(x0, x);
        x1 = Math.max(x1, x);
      }
    }
    if (x1 < 0) continue;
    if (cur && cur.y1 === y - 1) {
      cur.y1 = y;
      cur.x0 = Math.min(cur.x0, x0);
      cur.x1 = Math.max(cur.x1, x1);
    } else out.push((cur = { y0: y, y1: y, x0, x1 }));
  }
  return out.filter((b) => b.x1 - b.x0 > 3);
}

const ref = bands(`tests/reference/ref-${state}.png`);
const ours = bands(`tests/__output__/${state}.png`);
console.log(`bands: ref ${ref.length}, ours ${ours.length}`);
for (let i = 0; i < Math.max(ref.length, ours.length); i++) {
  const r = ref[i], o = ours[i];
  const fmt = (b) => (b ? `${b.y0}-${b.y1} x${b.x0}-${b.x1}` : "-").padEnd(24);
  const d = r && o ? [o.y0 - r.y0, o.y1 - r.y1, o.x0 - r.x0, o.x1 - r.x1] : null;
  const flag = d && d.some((v) => Math.abs(v) > 1) ? "  <<" : "";
  console.log(String(i).padStart(3), fmt(r), fmt(o), d ? `dy ${d[0]}/${d[1]} dx ${d[2]}/${d[3]}` : "", flag);
}
