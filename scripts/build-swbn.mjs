import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const key = path.join(root, "keys", "iwa-ed25519.pem");
const dist = path.join(root, "dist");
fs.mkdirSync(dist, { recursive: true });

const dump = spawnSync("npx", ["wbn-dump-id", "-k", key], {
  cwd: root,
  encoding: "utf8",
});
if (dump.status !== 0) {
  console.error(dump.stderr || dump.stdout);
  process.exit(1);
}
const id = dump.stdout.trim();
const baseURL = `isolated-app://${id}/`;
console.log("Web Bundle ID:", id);
console.log("Origin:", baseURL);

const wbnPath = path.join(dist, "roblox-iwa.wbn");
const swbnPath = path.join(dist, "roblox-iwa.swbn");

const wbn = spawnSync(
  "npx",
  ["wbn", "--dir", "public", "--baseURL", baseURL, "--output", wbnPath, "--formatVersion", "b2"],
  { cwd: root, encoding: "utf8", stdio: "inherit" }
);
if (wbn.status !== 0) process.exit(wbn.status ?? 1);

const sign = spawnSync("npx", ["wbn-sign", "sign", wbnPath, key, "-o", swbnPath], {
  cwd: root,
  encoding: "utf8",
  stdio: "inherit",
});
if (sign.status !== 0) process.exit(sign.status ?? 1);

fs.writeFileSync(
  path.join(dist, "web-bundle-id.txt"),
  `${id}\n${baseURL}\n`
);
console.log("Wrote", swbnPath, fs.statSync(swbnPath).size, "bytes");
