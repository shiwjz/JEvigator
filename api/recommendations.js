import { makeRecommendations } from "../lib/recommendation-service.mjs";

export default async function handler(request, response) {
  if (request.method && request.method !== "POST") {
    response.status(405).json({ error: "POST only" });
    return;
  }

  try {
    const body =
      typeof request.body === "string" ? JSON.parse(request.body || "{}") : request.body || {};
    const result = makeRecommendations({
      bio_category: body.bio_category,
      raw_material: body.raw_material,
      target_function: body.target_function,
      preferred_product_category: body.preferred_product_category
    });

    if (!result.ok) {
      response.status(result.status).json({
        error: result.error,
        data_warning: result.data_warning
      });
      return;
    }

    response.status(200).json(result.payload);
  } catch (error) {
    response.status(500).json({
      error: "추천 아이디어를 생성하지 못했습니다.",
      detail: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
