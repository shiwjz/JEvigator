import {
  CATEGORIES,
  CATEGORY_MARKET_BASE,
  DEFAULT_EVIDENCE_PROFILE,
  EVIDENCE_PROFILES,
  FUNCTIONS,
  INGREDIENTS
} from "../data/catalog.js";

const synonymMap = {
  "귤": "감귤 부산물",
  "감귤 껍질": "감귤 부산물",
  "감귤박": "감귤 부산물",
  "시트러스": "감귤 부산물",
  "프로폴리스": "벌꿀/프로폴리스",
  "강아지": "펫푸드/펫케어",
  "반려동물": "펫푸드/펫케어",
  "영양제": "건강기능식품",
  "음료": "기능성 식품/음료",
  "세정제": "위생/세정용품",
  "비료": "농자재/친환경 비료",
  "바이오 플라스틱": "친환경 소재/바이오 플라스틱",
  "콜라겐": "주름개선/항노화",
  "피부 진정": "피부장벽 강화/진정",
  "면역": "면역력 증진",
  "항노화": "주름개선/항노화"
};

function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, Math.round(value)));
}

function normalizeExtraction(extraction = {}) {
  const ingredient = INGREDIENTS.includes(extraction.ingredient) ? extraction.ingredient : null;
  const functions = Array.isArray(extraction.functions || extraction.function)
    ? [...new Set(extraction.functions || extraction.function)].filter((item) => FUNCTIONS.includes(item))
    : [];
  const categories = Array.isArray(extraction.categories || extraction.category)
    ? [...new Set(extraction.categories || extraction.category)].filter((item) => CATEGORIES.includes(item))
    : [];

  return {
    ingredient,
    functions,
    categories,
    unknown: Array.isArray(extraction.unknown) ? extraction.unknown.slice(0, 5) : []
  };
}

export function extractWithRules(idea) {
  const text = String(idea || "").trim();
  const lowered = text.toLowerCase();

  let ingredient = INGREDIENTS.find((item) => lowered.includes(item.toLowerCase())) || null;
  let functions = FUNCTIONS.filter((item) => lowered.includes(item.toLowerCase()));
  let categories = CATEGORIES.filter((item) => lowered.includes(item.toLowerCase()));

  Object.entries(synonymMap).forEach(([word, standard]) => {
    if (!lowered.includes(word.toLowerCase())) return;
    if (INGREDIENTS.includes(standard) && !ingredient) ingredient = standard;
    if (FUNCTIONS.includes(standard) && !functions.includes(standard)) functions.push(standard);
    if (CATEGORIES.includes(standard) && !categories.includes(standard)) categories.push(standard);
  });

  if (lowered.includes("화장") && !categories.includes("화장품")) categories.push("화장품");
  if (lowered.includes("펫") || lowered.includes("강아지") || lowered.includes("반려동물")) {
    categories = categories.filter((item) => item !== "건강기능식품");
    if (!categories.includes("펫푸드/펫케어")) categories.push("펫푸드/펫케어");
  }
  if (!ingredient && lowered.includes("감귤")) ingredient = "감귤 부산물";

  return normalizeExtraction({
    ingredient,
    functions,
    categories,
    unknown: ingredient ? [] : text ? ["원료 확인 필요"] : []
  });
}

function makeScores(extraction, profile) {
  const paperVolume = Math.min(100, 50 + Math.log10(profile.paperCount + 1) * 25);
  const recentRatio = profile.paperCount ? profile.recentPaperCount / profile.paperCount : 0;
  const researchFreshness = 60 + recentRatio * 40;
  const technical = clamp(paperVolume * 0.6 + researchFreshness * 0.4);

  const category = extraction.categories[0] || "원료 소재 B2B 공급";
  const marketBase = CATEGORY_MARKET_BASE[category] || 70;
  const competitionPenalty = Math.min(profile.patentCount * 0.17, 10);
  const circularBonus =
    extraction.ingredient?.includes("부산물") ||
    category === "친환경 소재/바이오 플라스틱" ||
    category === "농자재/친환경 비료"
      ? 5
      : 0;
  const market = clamp(marketBase - competitionPenalty + circularBonus);

  const patentPenalty = profile.patentCount * 0.65 + profile.recentPatentCount * 0.75;
  const patentSafety = clamp(100 - patentPenalty);

  const productionVolume = Math.min(86, (Math.log10(profile.productionTons + 1) / 5.7) * 100);
  const stability = Math.max(0, 100 - profile.productionVariation * 2.2);
  const byproductPotential = extraction.ingredient?.includes("부산물") ? 100 : 65;
  const supply = clamp(productionVolume * 0.5 + stability * 0.3 + byproductPotential * 0.2);

  const total = Math.round((technical * 0.3 + market * 0.3 + patentSafety * 0.2 + supply * 0.2) * 10) / 10;
  return { technical, market, patentSafety, supply, total };
}

function makeEvidence(extraction, profile, scores) {
  const ingredient = extraction.ingredient || "원료 미확정";
  const functionQuery = extraction.functions.length ? extraction.functions.join(", ") : "기능 미지정";
  const categoryQuery = extraction.categories.length ? extraction.categories.join(", ") : "제품군 미지정";

  return {
    paperCount: profile.paperCount,
    recentPaperCount: profile.recentPaperCount,
    patentCount: profile.patentCount,
    recentPatentCount: profile.recentPatentCount,
    productionTons: profile.productionTons,
    productionVariation: profile.productionVariation,
    productionStatus:
      profile.productionVariation <= 10
        ? "최근 생산 변동이 비교적 안정적"
        : profile.productionVariation <= 18
          ? "계절성과 연도별 변동 관리 필요"
          : "공급 계약과 재고 계획 우선 검토",
    mfdsName: profile.mfdsName,
    casNo: profile.casNo,
    restriction: profile.restriction,
    records: [
      {
        axis: "기술성",
        source: "ScienceON",
        query: `${ingredient} + ${functionQuery}`,
        value: `논문 ${profile.paperCount}건`,
        detail: `최근 5년 ${profile.recentPaperCount}건`,
        status: "데모 캐시"
      },
      {
        axis: "시장성",
        source: "제품군 기준표",
        query: categoryQuery,
        value: `기본점수 ${CATEGORY_MARKET_BASE[extraction.categories[0]] || 70}`,
        detail: `경쟁도 보정 후 ${scores.market}점`,
        status: "MVP 기준"
      },
      {
        axis: "특허안전성",
        source: "KIPRIS Plus",
        query: `${ingredient} + ${categoryQuery}`,
        value: `유사 특허 ${profile.patentCount}건`,
        detail: `최근 특허 ${profile.recentPatentCount}건`,
        status: "데모 캐시"
      },
      {
        axis: "공급안정성",
        source: "제주데이터허브",
        query: ingredient,
        value: `생산 ${profile.productionTons.toLocaleString("ko-KR")}톤`,
        detail: `변동계수 ${profile.productionVariation}%`,
        status: "데모 캐시"
      },
      {
        axis: "보조 근거",
        source: "식의약 데이터포털",
        query: ingredient,
        value: profile.mfdsName,
        detail: profile.restriction,
        status: "데모 캐시"
      }
    ]
  };
}

export function makeFallbackExplanation(extraction, scores, evidence) {
  const ingredient = extraction.ingredient || "선택 원료";
  const category = extraction.categories[0] || "제품";
  const lastCharacter = ingredient.charCodeAt(ingredient.length - 1);
  const hasFinalConsonant =
    lastCharacter >= 0xac00 && lastCharacter <= 0xd7a3 && (lastCharacter - 0xac00) % 28 !== 0;
  const ingredientWithParticle = `${ingredient}${hasFinalConsonant ? "을" : "를"}`;
  const strongest = Object.entries({
    기술성: scores.technical,
    시장성: scores.market,
    특허안전성: scores.patentSafety,
    공급안정성: scores.supply
  }).sort((a, b) => b[1] - a[1])[0];
  const weakest = Object.entries({
    기술성: scores.technical,
    시장성: scores.market,
    특허안전성: scores.patentSafety,
    공급안정성: scores.supply
  }).sort((a, b) => a[1] - b[1])[0];

  return {
    summary: `${ingredientWithParticle} 활용한 ${category} 아이디어의 종합점수는 ${scores.total}점입니다. ${strongest[0]}이 가장 강한 근거이며, ${weakest[0]}은 사업화 전에 보완 검토가 필요합니다.`,
    strengths: [
      `${strongest[0]} ${strongest[1]}점으로 네 축 중 가장 높습니다.`,
      `공공데이터 샘플에서 논문 ${evidence.paperCount}건, 최근 5년 자료 ${evidence.recentPaperCount}건이 확인됩니다.`
    ],
    weaknesses: [
      `${weakest[0]} ${weakest[1]}점이 종합점수의 주요 제약입니다.`,
      `유사 특허 ${evidence.patentCount}건은 실제 청구항 단위의 추가 검토가 필요합니다.`
    ],
    improvements: [
      "원료 단독 주장보다 추출 공정, 배합 조성 또는 적용 대상을 구체화하세요.",
      "점수가 낮은 축을 보완할 수 있도록 제품군 변경 시나리오를 함께 비교하세요."
    ],
    review: [
      evidence.restriction,
      "현재 수치는 해커톤 시연용 캐시 데이터이며 실제 출원·사업화 전 원문 확인이 필요합니다."
    ]
  };
}

export function calculateAnalysis({ idea = "", extraction = {} }) {
  const normalized = normalizeExtraction(extraction);
  const resolved = normalized.ingredient ? normalized : extractWithRules(idea);
  const profile = EVIDENCE_PROFILES[resolved.ingredient] || DEFAULT_EVIDENCE_PROFILE;
  const scores = makeScores(resolved, profile);
  const evidence = makeEvidence(resolved, profile, scores);

  return {
    idea,
    extraction: resolved,
    scores,
    evidence,
    explanation: makeFallbackExplanation(resolved, scores, evidence),
    formulas: {
      technical: "논문 수 정규화 점수 60% + 최근 5년 연구 비율 점수 40%",
      market: "제품군 기본점수 - 특허 경쟁도 보정 + 순환자원 보너스",
      patentSafety: "100 - (유사 특허 수 감점 + 최근 특허 수 가중 감점)",
      supply: "생산량 점수 50% + 생산 변동성 역점수 30% + 부산물 활용성 20%",
      total: "기술성 30% + 시장성 30% + 특허안전성 20% + 공급안정성 20%"
    },
    generatedAt: new Date().toISOString()
  };
}

export function analyzeIdea(idea) {
  return calculateAnalysis({ idea, extraction: extractWithRules(idea) });
}
