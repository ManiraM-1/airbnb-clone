// Downloads the images and font listed in data/assets.txt from the reference into public/.
// Run: node scripts/fetch-assets.mjs   (Node 18+)
import { readFileSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";

const BASE = "https://airbnb-clone-umber-two.vercel.app";
const paths = readFileSync("data/assets.txt", "utf8").split("\n").map((s) => s.trim()).filter(Boolean);
let ok = 0, skipped = 0, failed = [];
for (const p of paths) {
  const out = join("public", p);
  if (existsSync(out)) { skipped++; continue; }
  try {
    const res = await fetch(BASE + p);
    if (!res.ok) throw new Error(res.status);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, Buffer.from(await res.arrayBuffer()));
    ok++;
  } catch (e) { failed.push(`${p} (${e.message})`); }
}
console.log(`downloaded ${ok}, already present ${skipped}, failed ${failed.length}`);
if (failed.length) { console.log(failed.join("\n")); process.exitCode = 1; }
