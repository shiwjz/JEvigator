import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { runAnalysis } from "../lib/ai-providers.mjs";

const root = process.cwd();
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "127.0.0.1";

try {
  const envText = await readFile(join(root, ".env"), "utf8");
  envText.split(/\r?\n/).forEach((line) => {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match || process.env[match[1]]) return;
    process.env[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, "");
  });
} catch {
  // Environment variables may also be provided directly by Vercel.
}

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".png": "image/png"
};

function resolvePath(url) {
  const cleanUrl = decodeURIComponent(url.split("?")[0]);
  const requested = cleanUrl === "/" ? "/index.html" : cleanUrl;
  const safePath = normalize(requested).replace(/^(\.\.[/\\])+/, "");
  return join(root, safePath);
}

const server = createServer(async (request, response) => {
  try {
    if (request.url?.startsWith("/api/analyze")) {
      let body = "";
      for await (const chunk of request) {
        body += chunk;
      }

      const payload = body ? JSON.parse(body) : {};
      const result = await runAnalysis({
        idea: typeof payload.idea === "string" ? payload.idea.slice(0, 300) : "",
        extraction:
          payload.extraction && typeof payload.extraction === "object" ? payload.extraction : null
      });
      response.writeHead(200, { "content-type": "application/json; charset=utf-8" });
      response.end(JSON.stringify(result));
      return;
    }

    const filePath = resolvePath(request.url || "/");
    const body = await readFile(filePath);
    response.writeHead(200, {
      "content-type": types[extname(filePath)] || "application/octet-stream"
    });
    response.end(body);
  } catch {
    const fallback = await readFile(join(root, "index.html"));
    response.writeHead(200, { "content-type": types[".html"] });
    response.end(fallback);
  }
});

server.listen(port, host, () => {
  console.log(`Jeju Bio R&D Navigator running at http://${host}:${port}`);
});
