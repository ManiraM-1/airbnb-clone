// Builds submission.zip from the project sources, assets, tests and AI-workflow files.
// Dependency-free (Node >= 22 for zlib.crc32) so it behaves the same on Windows, macOS and Linux.
// Usage: npm run zip
import { readdirSync, readFileSync, statSync, writeFileSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { crc32, deflateRawSync } from "node:zlib";

const ROOT = process.cwd();
const OUT = "submission.zip";

const INCLUDE = [
  "app", "components", "hooks", "lib", "public", "data", "tests", "scripts", ".claude", "docs",
  "CLAUDE.md", "AGENTS.md", "SPEC.md", "README.md", "PROMPTS.md",
  "package.json", "package-lock.json", "tsconfig.json", "next.config.ts", "eslint.config.mjs",
  "playwright.config.ts", ".gitignore", ".gitattributes",
];
const EXCLUDE = new Set([
  "node_modules", ".next", "test-results", "playwright-report",
  "tests/__output__", "tests/__inspect__", ".claude/scheduled_tasks.lock", ".claude/settings.local.json",
]);

function collect(path, files) {
  const rel = relative(ROOT, path).split(sep).join("/");
  if (EXCLUDE.has(rel) || EXCLUDE.has(rel.split("/")[0])) return;
  const st = statSync(path);
  if (st.isDirectory()) {
    for (const name of readdirSync(path).sort()) collect(join(path, name), files);
  } else if (st.isFile()) {
    files.push({ rel, path, mtime: st.mtime });
  }
}

function dosDateTime(d) {
  const time = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1);
  const date = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
  return { time, date };
}

const files = [];
for (const entry of INCLUDE) {
  const p = join(ROOT, entry);
  if (existsSync(p)) collect(p, files);
}

const chunks = [];
const central = [];
let offset = 0;
for (const f of files) {
  const raw = readFileSync(f.path);
  const deflated = deflateRawSync(raw, { level: 9 });
  const stored = deflated.length >= raw.length;
  const body = stored ? raw : deflated;
  const name = Buffer.from(f.rel, "utf8");
  const crc = crc32(raw);
  const { time, date } = dosDateTime(f.mtime);

  const local = Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50, 0);
  local.writeUInt16LE(20, 4); // version needed
  local.writeUInt16LE(0x0800, 6); // UTF-8 names
  local.writeUInt16LE(stored ? 0 : 8, 8);
  local.writeUInt16LE(time, 10);
  local.writeUInt16LE(date, 12);
  local.writeUInt32LE(crc, 14);
  local.writeUInt32LE(body.length, 18);
  local.writeUInt32LE(raw.length, 22);
  local.writeUInt16LE(name.length, 26);
  chunks.push(local, name, body);

  const cen = Buffer.alloc(46);
  cen.writeUInt32LE(0x02014b50, 0);
  cen.writeUInt16LE(20, 4); // version made by
  cen.writeUInt16LE(20, 6);
  cen.writeUInt16LE(0x0800, 8);
  cen.writeUInt16LE(stored ? 0 : 8, 10);
  cen.writeUInt16LE(time, 12);
  cen.writeUInt16LE(date, 14);
  cen.writeUInt32LE(crc, 16);
  cen.writeUInt32LE(body.length, 20);
  cen.writeUInt32LE(raw.length, 24);
  cen.writeUInt16LE(name.length, 28);
  cen.writeUInt32LE(offset, 42);
  central.push(cen, name);

  offset += local.length + name.length + body.length;
}

const cenSize = central.reduce((n, b) => n + b.length, 0);
const end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50, 0);
end.writeUInt16LE(files.length, 8);
end.writeUInt16LE(files.length, 10);
end.writeUInt32LE(cenSize, 12);
end.writeUInt32LE(offset, 16);

const zip = Buffer.concat([...chunks, ...central, end]);
writeFileSync(OUT, zip);
console.log(`${OUT}: ${files.length} files, ${(zip.length / 1024 / 1024).toFixed(1)} MB`);
