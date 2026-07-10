import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import aiCoachHandler from "../api/ai-coach.js";
import recommendationsHandler from "../api/recommendations.js";
import { runAnalysis } from "../lib/ai-providers.mjs";
import {
  searchCrossref,
  searchMfdsIngredient,
  searchOpenAlex
} from "../lib/external-evidence.mjs";

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
  ".csv": "text/csv; charset=utf-8",
  ".pdf": "application/pdf",
  ".svg": "image/svg+xml; charset=utf-8",
  ".png": "image/png"
};

function resolvePath(url) {
  const cleanUrl = decodeURIComponent(url.split("?")[0]);
  if (cleanUrl.split("/").some((segment) => segment.startsWith("."))) {
    throw new Error("Hidden files are not public.");
  }
  const requested = cleanUrl === "/" ? "/index.html" : cleanUrl;
  const safePath = normalize(requested).replace(/^(\.\.[/\\])+/, "");
  const filePath = resolve(root, `.${safePath}`);
  if (!filePath.startsWith(`${resolve(root)}/`)) throw new Error("Invalid path.");
  return filePath;
}

function sendJson(response, status, payload) {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

async function runJsonHandler(handler, request, response, payload) {
  let statusCode = 200;
  await handler(
    { method: request.method, body: payload },
    {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        sendJson(response, statusCode, data);
      }
    }
  );
}

const server = createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url || "/", `http://${host}:${port}`);
    if (requestUrl.pathname.split("/").some((segment) => segment.startsWith("."))) {
      return sendJson(response, 404, { error: "Not found" });
    }

    if (requestUrl.pathname === "/api/papers/openalex") {
      const query = requestUrl.searchParams.get("query")?.slice(0, 180) || "";
      if (!query) return sendJson(response, 400, { error: "query가 필요합니다." });
      try {
        return sendJson(response, 200, await searchOpenAlex(query));
      } catch (error) {
        return sendJson(response, 502, {
          error: "OpenAlex 조회 실패",
          detail: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }

    if (requestUrl.pathname === "/api/papers/crossref") {
      const query = requestUrl.searchParams.get("query")?.slice(0, 180) || "";
      if (!query) return sendJson(response, 400, { error: "query가 필요합니다." });
      try {
        return sendJson(response, 200, await searchCrossref(query));
      } catch (error) {
        return sendJson(response, 502, {
          error: "Crossref 조회 실패",
          detail: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }

    if (requestUrl.pathname === "/api/mfds/cosmetic-ingredients") {
      const keyword = requestUrl.searchParams.get("keyword")?.slice(0, 80) || "";
      if (!keyword) return sendJson(response, 400, { error: "keyword가 필요합니다." });
      return sendJson(response, 200, await searchMfdsIngredient(keyword));
    }

    if (requestUrl.pathname === "/api/ai-coach") {
      let body = "";
      for await (const chunk of request) {
        body += chunk;
      }
      const payload = body ? JSON.parse(body) : {};
      return runJsonHandler(aiCoachHandler, request, response, payload);
    }

    if (requestUrl.pathname === "/api/recommendations") {
      let body = "";
      for await (const chunk of request) {
        body += chunk;
      }
      const payload = body ? JSON.parse(body) : {};
      return runJsonHandler(recommendationsHandler, request, response, payload);
    }

    if (request.url?.startsWith("/api/analyze")) {
      let body = "";
      for await (const chunk of request) {
        body += chunk;
      }

      const payload = body ? JSON.parse(body) : {};
      const result = await runAnalysis({
        idea: typeof payload.idea === "string" ? payload.idea.slice(0, 300) : "",
        extraction:
          payload.extraction && typeof payload.extraction === "object" ? payload.extraction : null,
        preferredCategory:
          typeof payload.preferredCategory === "string" ? payload.preferredCategory : null,
        companyProfile:
          payload.companyProfile && typeof payload.companyProfile === "object"
            ? payload.companyProfile
            : null
      });
      return sendJson(response, 200, result);
    }

    const filePath = resolvePath(request.url || "/");
    const body = await readFile(filePath);
    response.writeHead(200, {
      "content-type": types[extname(filePath)] || "application/octet-stream"
    });
    response.end(body);
  } catch {
    if (request.url?.startsWith("/api/")) {
      sendJson(response, 404, { error: "API route not found" });
      return;
    }
    const fallback = await readFile(join(root, "index.html"));
    response.writeHead(200, { "content-type": types[".html"] });
    response.end(fallback);
  }
});

server.listen(port, host, () => {
  console.log(`Jeju Bio R&D Navigator running at http://${host}:${port}`);
});
