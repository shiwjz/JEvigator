import {
  MATERIAL_ALIASES,
  MATERIAL_BIO_CATEGORY,
  MATERIAL_DEFAULTS,
  MOCK_RECOMMENDATION_CATALOG
} from "../data/recommendation-catalog.js";

export const RECOMMENDATION_WEIGHTS = Object.freeze({
  startup_fit_score: 0.2,
  technical_ease_score: 0.15,
  prototype_ease_score: 0.1,
  supply_score: 0.1,
  research_evidence_score: 0.1,
  government_rd_fit_score: 0.1,
  market_score: 0.1,
  commercialization_score: 0.05,
  patent_entry_score: 0.05,
  jeju_relevance_score: 0.05
});

const GRADE_RULES = [
  [85, "매우 적합"],
  [70, "적합"],
  [55, "검토 필요"],
  [0, "초기 기업 비추천"]
];

const RD_LEVEL_PRIORITY = {
  "입문": 0,
  "초기": 1,
  "중간": 2,
  "고난도": 3
};

const BIO_CATEGORY_ALIASES = {
  "green bio": "그린바이오",
  "green": "그린바이오",
  "그린": "그린바이오",
  "그린바이오": "그린바이오",
  "blue bio": "해양바이오",
  "blue": "해양바이오",
  "블루": "해양바이오",
  "해양": "해양바이오",
  "해양바이오": "해양바이오",
  "red bio": "레드바이오",
  "red": "레드바이오",
  "레드": "레드바이오",
  "레드바이오": "레드바이오",
  "white bio": "화이트바이오",
  "white": "화이트바이오",
  "화이트": "화이트바이오",
  "화이트바이오": "화이트바이오"
};

const DATA_WARNING = "현재 결과는 데모용 내부 데이터와 규칙 기반 평가를 포함합니다.";

const clampScore = (value) => Math.max(0, Math.min(100, Number(value) || 0));

function roundOne(value) {
  return Math.round(value * 10) / 10;
}

function normalizeText(value) {
  return String(value || "").trim();
}

function normalizeKey(value) {
  return normalizeText(value).replace(/\s+/g, "").toLowerCase();
}

export function normalizeBioCategory(value) {
  const key = normalizeText(value).toLowerCase();
  return BIO_CATEGORY_ALIASES[key] || normalizeText(value) || null;
}

export function resolveRawMaterial(rawMaterial) {
  const normalized = normalizeKey(rawMaterial);
  if (!normalized) return null;
  for (const [canonical, aliases] of Object.entries(MATERIAL_ALIASES)) {
    if (aliases.some((alias) => normalizeKey(alias) === normalized)) return canonical;
  }
  for (const [canonical, aliases] of Object.entries(MATERIAL_ALIASES)) {
    if (aliases.some((alias) => normalized.includes(normalizeKey(alias)))) return canonical;
  }
  return null;
}

export function recommendationGrade(score) {
  const matched = GRADE_RULES.find(([threshold]) => score >= threshold);
  return matched?.[1] || "초기 기업 비추천";
}

export function calculateRecommendationScore(candidate) {
  const technicalEaseScore = 100 - clampScore(candidate.technical_difficulty_score);
  const prototypeEaseScore = 100 - clampScore(candidate.prototype_difficulty_score);
  const patentEntryScore =
    candidate.patent_entry_score != null
      ? clampScore(candidate.patent_entry_score)
      : 100 - clampScore(candidate.patent_competition_score);

  const score =
    clampScore(candidate.startup_fit_score) * RECOMMENDATION_WEIGHTS.startup_fit_score +
    technicalEaseScore * RECOMMENDATION_WEIGHTS.technical_ease_score +
    prototypeEaseScore * RECOMMENDATION_WEIGHTS.prototype_ease_score +
    clampScore(candidate.supply_score) * RECOMMENDATION_WEIGHTS.supply_score +
    clampScore(candidate.research_evidence_score) *
      RECOMMENDATION_WEIGHTS.research_evidence_score +
    clampScore(candidate.government_rd_fit_score) *
      RECOMMENDATION_WEIGHTS.government_rd_fit_score +
    clampScore(candidate.market_score) * RECOMMENDATION_WEIGHTS.market_score +
    clampScore(candidate.commercialization_score) *
      RECOMMENDATION_WEIGHTS.commercialization_score +
    patentEntryScore * RECOMMENDATION_WEIGHTS.patent_entry_score +
    clampScore(candidate.jeju_relevance_score) * RECOMMENDATION_WEIGHTS.jeju_relevance_score;

  return {
    recommendation_score: roundOne(clampScore(score)),
    patent_entry_score: roundOne(patentEntryScore),
    technical_ease_score: roundOne(technicalEaseScore),
    prototype_ease_score: roundOne(prototypeEaseScore)
  };
}

function validateRequest(input) {
  const rawMaterial = normalizeText(input.raw_material || input.rawMaterial);
  if (!rawMaterial) {
    return { ok: false, error: "raw_material is required" };
  }
  return { ok: true, rawMaterial };
}

function ensureList(value, fallback = []) {
  return Array.isArray(value) ? value.filter(Boolean) : fallback;
}

function buildRecommendation(candidate, material, input, index) {
  const defaults = MATERIAL_DEFAULTS[material] || {};
  const merged = {
    ...defaults,
    ...candidate
  };
  const computed = calculateRecommendationScore(merged);
  const bioCategory =
    normalizeBioCategory(input.bio_category) || MATERIAL_BIO_CATEGORY[material] || "데이터 부족";

  return {
    id: merged.id || `idea-${String(index + 1).padStart(3, "0")}`,
    title: merged.title,
    raw_material: material,
    bio_category: bioCategory,
    product_category: merged.product_category,
    product_type: merged.product_type,
    target_function: normalizeText(input.target_function) || merged.target_function,
    one_line_summary: merged.one_line_summary,
    recommendation_score: computed.recommendation_score,
    recommendation_grade: recommendationGrade(computed.recommendation_score),
    startup_fit_score: clampScore(merged.startup_fit_score),
    technical_difficulty_score: clampScore(merged.technical_difficulty_score),
    prototype_difficulty_score: clampScore(merged.prototype_difficulty_score),
    supply_score: clampScore(merged.supply_score),
    research_evidence_score: clampScore(merged.research_evidence_score),
    government_rd_fit_score: clampScore(merged.government_rd_fit_score),
    market_score: clampScore(merged.market_score),
    commercialization_score: clampScore(merged.commercialization_score),
    patent_entry_score: computed.patent_entry_score,
    jeju_relevance_score: clampScore(merged.jeju_relevance_score),
    market_status: merged.market_status || "데이터 부족",
    rd_entry_level: merged.rd_entry_level || "초기",
    estimated_rd_period: merged.estimated_rd_period || "3~6개월",
    evidence_level: merged.evidence_level || "mock",
    data_warning: DATA_WARNING,
    recommended_reason: ensureList(merged.recommended_reason).slice(0, 5),
    required_preparation: ensureList(merged.required_preparation).slice(0, 5),
    risk_factors: ensureList(merged.risk_factors, ["초기 검증 데이터가 부족할 수 있습니다."]).slice(0, 4),
    next_actions: ensureList(merged.next_actions).slice(0, 5),
    analysis_basis: {
      formula:
        "startup_fit_score*0.20 + technical_ease_score*0.15 + prototype_ease_score*0.10 + supply_score*0.10 + research_evidence_score*0.10 + government_rd_fit_score*0.10 + market_score*0.10 + commercialization_score*0.05 + patent_entry_score*0.05 + jeju_relevance_score*0.05",
      technical_ease_score: computed.technical_ease_score,
      prototype_ease_score: computed.prototype_ease_score,
      weight_version: "startup-rd-fit-v1"
    }
  };
}

function uniqueRecommendations(recommendations) {
  const seen = new Set();
  return recommendations.filter((item) => {
    const key = `${item.title}::${item.product_category}::${item.product_type}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function filterAndRank(recommendations, input) {
  void input;
  return recommendations
    .sort((a, b) => {
      if (b.recommendation_score !== a.recommendation_score) {
        return b.recommendation_score - a.recommendation_score;
      }
      return (RD_LEVEL_PRIORITY[a.rd_entry_level] ?? 99) - (RD_LEVEL_PRIORITY[b.rd_entry_level] ?? 99);
    })
    .slice(0, 5);
}

export function makeRecommendations(input = {}) {
  const validation = validateRequest(input);
  if (!validation.ok) {
    return {
      ok: false,
      status: 400,
      error: validation.error
    };
  }

  const material = resolveRawMaterial(validation.rawMaterial);
  if (!material) {
    return {
      ok: false,
      status: 404,
      error: "지원하는 원료 데이터가 없습니다.",
      data_warning: DATA_WARNING
    };
  }

  const sourceCandidates = MOCK_RECOMMENDATION_CATALOG[material] || [];
  const recommendations = filterAndRank(
    uniqueRecommendations(
      sourceCandidates.map((candidate, index) =>
        buildRecommendation(candidate, material, input, index)
      )
    ),
    input
  );

  return {
    ok: true,
    status: 200,
    payload: {
      input: {
        bio_category:
          normalizeBioCategory(input.bio_category) || MATERIAL_BIO_CATEGORY[material] || null,
        raw_material: material,
        target_function: normalizeText(input.target_function) || null,
        preferred_product_category: normalizeText(input.preferred_product_category) || null
      },
      recommendations,
      recommendation_count: recommendations.length,
      generated_at: new Date().toISOString(),
      evidence_level: recommendations.some((item) => item.evidence_level === "partial")
        ? "partial"
        : "mock",
      data_warning: DATA_WARNING
    }
  };
}
