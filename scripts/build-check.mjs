import { access, readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { analyzeIdea } from "../lib/analyzer.mjs";

const root = process.cwd();
const requiredFiles = [
  "index.html",
  "styles.css",
  "app.js",
  "api/analyze.js",
  "api/ai-coach.js",
  "api/recommendations.js",
  "api/papers/openalex.js",
  "api/papers/crossref.js",
  "api/mfds/cosmetic-ingredients.js",
  "lib/analyzer.mjs",
  "lib/ai-providers.mjs",
  "lib/csv-evidence.mjs",
  "lib/company-diagnosis.mjs",
  "lib/external-evidence.mjs",
  "lib/evidence-integrator.mjs",
  "lib/recommendation-service.mjs",
  "data/recommendation-catalog.js",
  "public/data/가축사육통계.csv",
  "public/data/방문판매업정보.csv",
  "public/data/제주특별자치도 서귀포시 감귤 생산 정보_20240513.csv",
  "public/data/제주특별자치도_품종별감귤생산현황_20241231.csv",
  "public/data/제주특별자치도 제주시_감귤생산및처리현황_20230604.csv",
  "public/data/한국수산자원공단_해조류(김) 데이터_20230109.csv",
  "public/data/한국수산자원공단_해조류(김 제외) 데이터_20230109.csv",
  "public/data/제주특별자치도_마을어장 생태환경 해조류 데이터_20221130.csv",
  "public/data/천연 식용색소 위생 표준(최종개정_ 2023년 3월 29일).pdf"
];

await Promise.all(requiredFiles.map((file) => access(join(root, file))));
const syntaxFiles = [
  "app.js",
  "data/catalog.js",
  "lib/analyzer.mjs",
  "lib/ai-providers.mjs",
  "lib/company-diagnosis.mjs",
  "lib/csv-evidence.mjs",
  "lib/external-evidence.mjs",
  "lib/evidence-integrator.mjs",
  "lib/recommendation-service.mjs",
  "data/recommendation-catalog.js",
  "api/analyze.js",
  "api/ai-coach.js",
  "api/recommendations.js",
  "api/papers/openalex.js",
  "api/papers/crossref.js",
  "api/mfds/cosmetic-ingredients.js",
  "scripts/import-seaweed-data.mjs",
  "scripts/recommendations-test.mjs",
  "scripts/dev-server.mjs"
];
for (const file of syntaxFiles) {
  const check = spawnSync(process.execPath, ["--check", join(root, file)], {
    encoding: "utf8"
  });
  if (check.status !== 0) throw new Error(check.stderr || `${file} syntax check 실패`);
}

const [html, appSource, css] = await Promise.all([
  readFile(join(root, "index.html"), "utf8"),
  readFile(join(root, "app.js"), "utf8"),
  readFile(join(root, "styles.css"), "utf8")
]);
const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
const staticSelectors = [
  ...appSource.matchAll(/querySelector\(["']#([A-Za-z0-9_-]+)["']\)/g)
].map((match) => match[1]);
const missingIds = [...new Set(staticSelectors.filter((id) => !ids.has(id)))];
if (missingIds.length) throw new Error(`HTML에 없는 id 선택자: ${missingIds.join(", ")}`);
const cssBraceBalance =
  [...css].filter((character) => character === "{").length -
  [...css].filter((character) => character === "}").length;
if (cssBraceBalance !== 0) throw new Error("styles.css 중괄호 개수가 맞지 않습니다.");

await Promise.all([
  import("../lib/ai-providers.mjs"),
  import("../lib/external-evidence.mjs"),
  import("../lib/evidence-integrator.mjs"),
  import("../lib/recommendation-service.mjs"),
  import("../api/analyze.js"),
  import("../api/ai-coach.js"),
  import("../api/recommendations.js"),
  import("../api/papers/openalex.js"),
  import("../api/papers/crossref.js"),
  import("../api/mfds/cosmetic-ingredients.js")
]);

const smoke = analyzeIdea("제주 감귤 부산물 기반 항산화 화장품 원료 개발", "화장품");
if (!Number.isFinite(smoke.scores.total) || smoke.extraction.categories[0] !== "화장품") {
  throw new Error("분석 엔진 smoke test 실패");
}

console.log(
  `Build check passed: ${requiredFiles.length} files, ${syntaxFiles.length} syntax checks, analysis ${smoke.scores.total}점`
);
