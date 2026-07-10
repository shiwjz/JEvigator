import { searchCrossref } from "../../lib/external-evidence.mjs";

export default async function handler(request, response) {
  const query = typeof request.query?.query === "string" ? request.query.query.slice(0, 180) : "";
  if (!query) {
    response.status(400).json({ error: "query가 필요합니다." });
    return;
  }
  try {
    response.status(200).json(await searchCrossref(query));
  } catch (error) {
    response.status(502).json({
      error: "Crossref 조회 실패",
      detail: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
