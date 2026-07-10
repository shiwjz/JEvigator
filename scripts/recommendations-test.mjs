import assert from "node:assert/strict";
import { analyzeIdea } from "../lib/analyzer.mjs";
import { makeRecommendations } from "../lib/recommendation-service.mjs";

const result = makeRecommendations({
  bio_category: "그린바이오",
  raw_material: "감귤박",
  target_function: "항산화",
  preferred_product_category: null
});

assert.equal(result.ok, true, "감귤박 추천 API 서비스가 성공해야 합니다.");
const recommendations = result.payload.recommendations;

assert.ok(recommendations.length >= 3, "감귤박 입력 시 추천 결과가 3개 이상이어야 합니다.");
assert.ok(
  recommendations.every(
    (item) => item.recommendation_score >= 0 && item.recommendation_score <= 100
  ),
  "모든 추천 점수는 0~100 범위여야 합니다."
);

const sorted = [...recommendations].sort(
  (a, b) => b.recommendation_score - a.recommendation_score
);
assert.deepEqual(
  recommendations.map((item) => item.id),
  sorted.map((item) => item.id),
  "추천 결과는 recommendation_score 내림차순이어야 합니다."
);

for (const item of recommendations) {
  assert.ok(item.recommended_reason.length >= 3, `${item.id} 추천 이유 3개 이상 필요`);
  assert.ok(item.required_preparation.length >= 3, `${item.id} 준비사항 3개 이상 필요`);
  assert.ok(item.risk_factors.length >= 1, `${item.id} 위험요소 1개 이상 필요`);
  assert.ok(item.next_actions.length >= 3, `${item.id} 다음 행동 3개 이상 필요`);
}

const firstHardIndex = recommendations.findIndex((item) => item.rd_entry_level === "고난도");
const firstEntryIndex = recommendations.findIndex((item) =>
  ["입문", "초기"].includes(item.rd_entry_level)
);
assert.ok(
  firstHardIndex === -1 || firstEntryIndex === -1 || firstEntryIndex < firstHardIndex,
  "고난도 아이디어가 입문 및 초기 아이디어보다 우선 추천되면 안 됩니다."
);

const smoke = analyzeIdea("제주 감귤 부산물 기반 항산화 화장품 원료 개발", "화장품");
assert.equal(smoke.extraction.categories[0], "화장품", "기존 4축 분석 API 입력 구조가 유지되어야 합니다.");
assert.ok(Number.isFinite(smoke.scores.total), "기존 4축 분석 점수가 정상 산출되어야 합니다.");

const noKeyMock = makeRecommendations({
  raw_material: "감귤박"
});
assert.equal(noKeyMock.ok, true, "OpenAI API 키가 없어도 Mock 추천이 동작해야 합니다.");
assert.equal(noKeyMock.payload.evidence_level, "mock", "Mock 추천 evidence_level이 반환되어야 합니다.");

console.log("Recommendation tests passed");
