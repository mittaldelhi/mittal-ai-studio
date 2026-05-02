/* eslint-disable @typescript-eslint/no-require-imports */
const { createServer } = require("node:http");
const { createReadStream, existsSync } = require("node:fs");
const { extname, join, normalize } = require("node:path");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "0.0.0.0";
const port = Number(process.env.PORT || 3000);
const nextStaticRoot = join(__dirname, ".next", "static");
const staticContentTypes = {
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

function tryServeNextStatic(request, response) {
  if (!request.url || !request.url.startsWith("/_next/static/")) {
    return false;
  }

  const staticPath = decodeURIComponent(request.url.split("?")[0].replace("/_next/static/", ""));
  const filePath = normalize(join(nextStaticRoot, staticPath));

  if (!filePath.startsWith(nextStaticRoot) || !existsSync(filePath)) {
    return false;
  }

  response.writeHead(200, {
    "Cache-Control": "public, max-age=31536000, immutable",
    "Content-Type": staticContentTypes[extname(filePath)] || "application/octet-stream",
  });
  createReadStream(filePath).pipe(response);

  return true;
}

app.prepare().then(() => {
  createServer((request, response) => {
    if (tryServeNextStatic(request, response)) {
      return;
    }

    handle(request, response);
  }).listen(port, hostname, () => {
    console.log(`Mittal AI Studio ready on http://${hostname}:${port}`);
  });
});
