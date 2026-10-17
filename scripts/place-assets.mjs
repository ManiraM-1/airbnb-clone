// Copies manually downloaded assets into public/ at the paths listed in data/assets.txt.
// Files are matched by file name, so the source folder can be flat.
// Run: node scripts/place-assets.mjs <source-folder>
import { readFileSync, mkdirSync, copyFileSync, existsSync } from "node:fs";
import { basename, dirname, join } from "node:path";

const source = process.argv[2];
if (!source) {
  console.error("usage: node scripts/place-assets.mjs <source-folder>");
  process.exit(1);
}
if (!existsSync(source)) {
  console.error(`source folder not found: ${source}`);
  process.exit(1);
}

const paths = readFileSync("data/assets.txt", "utf8").split("\n").map((s) => s.trim()).filter(Boolean);

const names = paths.map((p) => basename(p));
const dupes = names.filter((n, i) => names.indexOf(n) !== i);
if (dupes.length) {
  console.error(`assets.txt has duplicate file names, cannot match by name: ${[...new Set(dupes)].join(", ")}`);
  process.exit(1);
}

// A browser "save" of a blocked request gives an HTML page instead of the asset.
const looksLikeHtml = (file) => {
  const head = readFileSync(file).subarray(0, 64).toString("utf8").trimStart().toLowerCase();
  return head.startsWith("<!doctype html") || head.startsWith("<html");
};

let copied = 0;
const missing = [];
const invalid = [];
for (const p of paths) {
  const from = join(source, basename(p));
  if (!existsSync(from)) { missing.push(p); continue; }
  if (looksLikeHtml(from)) { invalid.push(p); continue; }
  const to = join("public", p);
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(from, to);
  copied++;
}

console.log(`copied ${copied} of ${paths.length}, missing ${missing.length}, invalid ${invalid.length}`);
if (missing.length) console.log(`missing:\n  ${missing.join("\n  ")}`);
if (invalid.length) console.log(`invalid (HTML, not the asset):\n  ${invalid.join("\n  ")}`);
if (missing.length || invalid.length) process.exitCode = 1;
