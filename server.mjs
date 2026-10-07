import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "public");
const port = Number(process.env.PORT || 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".png": "image/png",
  ".json": "application/json",
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", "http://localhost");
  let filePath = path.join(root, url.pathname === "/" ? "index.html" : url.pathname);
  if (!filePath.startsWith(root)) {
    res.writeHead(403).end("Forbidden");
    return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404).end("Not found");
      return;
    }
    res.writeHead(200, {
      "content-type": types[path.extname(filePath)] || "application/octet-stream",
    });
    res.end(data);
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Roblox IWA dev server en http://0.0.0.0:${port}`);
});
