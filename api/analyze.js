import { runAnalysis } from "../lib/ai-providers.mjs";

export default async function handler(request, response) {
  if (request.method && request.method !== "POST") {
    response.status(405).json({ error: "POST only" });
    return;
  }

  try {
    const body =
      typeof request.body === "string" ? JSON.parse(request.body || "{}") : request.body || {};
    const idea = typeof body.idea === "string" ? body.idea.slice(0, 300) : "";
    const extraction =
      body.extraction && typeof body.extraction === "object" ? body.extraction : null;
    const preferredCategory =
      typeof body.preferredCategory === "string" ? body.preferredCategory : null;
    const companyProfile =
      body.companyProfile && typeof body.companyProfile === "object"
        ? body.companyProfile
        : null;
    const result = await runAnalysis({
      idea,
      extraction,
      preferredCategory,
      companyProfile
    });
    response.status(200).json(result);
  } catch (error) {
    response.status(500).json({
      error: "분석을 완료하지 못했습니다.",
      detail: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
