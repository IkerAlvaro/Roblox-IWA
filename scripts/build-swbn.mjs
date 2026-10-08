import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { BundleBuilder } from "wbn";

const root = path.resolve(import.meta.dirname, "..");
const key = path.join(root, "keys", "iwa-ed25519.pem");
const dist = path.join(root, "dist");
const pub = path.join(root, "public");
fs.mkdirSync(dist, { recursive: true });

const dump = spawnSync("npx", ["wbn-dump-id", "-k", key], { cwd: root, encoding: "utf8" });
if (dump.status !== 0) {
  console.error(dump.stderr || dump.stdout);
  process.exit(1);
}
const id = dump.stdout.trim();
const origin = `isolated-app://${id}`;
console.log("Web Bundle ID:", id);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".png": "image/png",
  ".json": "application/json",
};

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const builder = new BundleBuilder("b2");
for (const file of walk(pub)) {
  const rel = "/" + path.relative(pub, file).split(path.sep).join("/");
  const body = fs.readFileSync(file);
  const headers = { "Content-Type": types[path.extname(file)] || "application/octet-stream" };
  if (rel.endsWith("manifest.webmanifest")) {
    headers["Content-Type"] = "application/manifest+json";
  }
  builder.addExchange(origin + rel, 200, headers, body);
  if (rel === "/index.html") {
    builder.addExchange(origin + "/", 200, { "Content-Type": "text/html; charset=utf-8" }, body);
  }
  if (rel === "/.well-known/manifest.webmanifest") {
    builder.addExchange(origin + "/manifest.webmanifest", 200, { "Content-Type": "application/manifest+json" }, body);
    builder.addExchange(origin + "/.well-known/manifest.json", 200, { "Content-Type": "application/manifest+json" }, body);
  }
}

const wbnPath = path.join(dist, "roblox-iwa.wbn");
const swbnPath = path.join(dist, "roblox-iwa.swbn");
fs.writeFileSync(wbnPath, builder.createBundle());

const sign = spawnSync("npx", ["wbn-sign", "sign", wbnPath, key, "-o", swbnPath], {
  cwd: root,
  encoding: "utf8",
  stdio: "inherit",
});
if (sign.status !== 0) process.exit(sign.status ?? 1);
fs.writeFileSync(path.join(dist, "web-bundle-id.txt"), `${id}\n${origin}/\n`);
console.log("Wrote", swbnPath, fs.statSync(swbnPath).size, "bytes");
