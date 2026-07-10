import { searchMfdsIngredient } from "../../lib/external-evidence.mjs";

export default async function handler(request, response) {
  const keyword =
    typeof request.query?.keyword === "string" ? request.query.keyword.slice(0, 80) : "";
  if (!keyword) {
    response.status(400).json({ error: "keyword가 필요합니다." });
    return;
  }
  response.status(200).json(await searchMfdsIngredient(keyword));
}
