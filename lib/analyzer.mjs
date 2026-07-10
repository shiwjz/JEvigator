import {
  CATEGORIES,
  CATEGORY_DEFINITIONS,
  CATEGORY_MARKET_BASE,
  EVIDENCE_PROFILES,
  FUNCTIONS,
  INGREDIENTS
} from "../data/catalog.js";

const synonymMap = {
  "귤": "감귤 부산물",
  "감귤 껍질": "감귤 부산물",
  "감귤박": "감귤 부산물",
  "시트러스": "감귤 부산물",
  "흑돼지 껍데기": "흑돼지 부산물",
  "돼지 껍데기": "흑돼지 부산물",
  "강아지": "펫푸드/펫케어",
  "반려동물": "펫푸드/펫케어",
  "영양제": "건강기능식품",
  "음료": "기능성 식품/음료",
  "스낵": "기능성 식품/음료",
  "세정제": "위생/세정용품",
  "비료": "농자재/친환경 비료",
  "바이오 플라스틱": "친환경 소재/바이오 플라스틱",
  "정수 필터": "친환경 소재/바이오 플라스틱",
  "흡착제": "친환경 소재/바이오 플라스틱",
  "바이오플라스틱": "친환경 소재/바이오 플라스틱",
  "수질정화": "수질정화/흡착",
  "여과": "수질정화/흡착",
  "업사이클링": "소재화/업사이클링",
  "천연 색소": "천연 색소/착색",
  "식용 색소": "천연 색소/착색",
  "콜라겐": "주름개선/항노화",
  "피부 진정": "피부장벽 강화/진정",
  "피부 장벽": "피부장벽 강화/진정",
  "면역": "면역력 증진",
  "항노화": "주름개선/항노화",
  "주름 개선": "주름개선/항노화",
  "장 건강": "장건강",
  "간 건강": "간기능 개선",
  "관절": "관절건강",
  "혈행 개선": "콜레스테롤/혈행개선",
  "다이어트": "체지방감소/다이어트",
  "두피": "탈모방지/두피개선",
  "눈 건강": "눈건강",
  "상처재생/재생촉진": "상처재생",
  "스트레스 완화": "스트레스완화/수면",
  "수면개선": "스트레스완화/수면"
};

const semanticFallbackTerms = [
  {
    terms: ["매생이", "김", "해조류", "해조류 부산물", "해양 미생물"],
    category: "해양자원/해조류"
  },
  {
    terms: ["당근", "양배추", "브로콜리", "마늘", "양파", "메밀", "감자", "비트", "땅콩", "알로에", "농산 부산물"],
    category: "농산물/식물성 자원"
  },
  {
    terms: ["유청", "우유 부산물", "계란껍질", "축산 부산물"],
    category: "축산 부산물"
  },
  {
    terms: ["유산균", "효모", "발효 미생물"],
    category: "미생물 자원"
  }
];

function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, Math.round(value)));
}

function normalizeExtraction(extraction = {}) {
  const ingredientText =
    typeof extraction.ingredient === "string" ? extraction.ingredient.trim().slice(0, 60) : "";
  const rawIngredientText =
    typeof extraction.rawIngredient === "string"
      ? extraction.rawIngredient.trim().slice(0, 60)
      : ingredientText;
  const ingredient = INGREDIENTS.includes(ingredientText) ? ingredientText : null;
  const ingredientCategoryHints = [
    "농산물/식물성 부산물",
    "농산물/식물성 자원",
    "해양자원/해조류",
    "축산 부산물",
    "양봉 유래 소재",
    "제주 수자원",
    "균류 자원",
    "미생물 자원",
    "광물/무기물/지질자원"
  ];
  const functions = Array.isArray(extraction.functions || extraction.function)
    ? [...new Set(extraction.functions || extraction.function)].filter((item) => FUNCTIONS.includes(item))
    : [];
  const categories = Array.isArray(extraction.categories || extraction.category)
    ? [...new Set(extraction.categories || extraction.category)].filter((item) => CATEGORIES.includes(item))
    : [];

  return {
    ingredient,
    rawIngredient: rawIngredientText || ingredient,
    ingredientCategoryHint: ingredientCategoryHints.includes(extraction.ingredientCategory)
      ? extraction.ingredientCategory
      : null,
    mappingReason:
      typeof extraction.mappingReason === "string"
        ? extraction.mappingReason.slice(0, 180)
        : "",
    mappingConfidence:
      typeof extraction.confidence === "number"
        ? Math.max(0, Math.min(1, extraction.confidence))
        : null,
    functions,
    categories,
    unknown: Array.isArray(extraction.unknown) ? extraction.unknown.slice(0, 5) : []
  };
}

export function extractWithRules(idea, preferredCategory = null) {
  const text = String(idea || "").trim();
  const lowered = text.toLowerCase();

  let ingredient = INGREDIENTS.find((item) => lowered.includes(item.toLowerCase())) || null;
  let rawIngredient = ingredient;
  let ingredientCategory = null;
  let functions = FUNCTIONS.filter((item) => lowered.includes(item.toLowerCase()));
  let categories = CATEGORIES.filter((item) => lowered.includes(item.toLowerCase()));

  Object.entries(synonymMap).forEach(([word, standard]) => {
    if (!lowered.includes(word.toLowerCase())) return;
    if (INGREDIENTS.includes(standard) && !ingredient) ingredient = standard;
    if (FUNCTIONS.includes(standard) && !functions.includes(standard)) functions.push(standard);
    if (CATEGORIES.includes(standard) && !categories.includes(standard)) categories.push(standard);
  });

  if (lowered.includes("화장") && !categories.includes("화장품")) categories.push("화장품");
  if (lowered.includes("반려동물 간식") && !categories.includes("펫푸드/펫케어")) {
    categories.push("펫푸드/펫케어");
  }
  if (lowered.includes("펫") || lowered.includes("강아지") || lowered.includes("반려동물")) {
    categories = categories.filter((item) => item !== "건강기능식품");
    if (!categories.includes("펫푸드/펫케어")) categories.push("펫푸드/펫케어");
  }
  if (!ingredient && lowered.includes("감귤")) ingredient = "감귤 부산물";
  if (ingredient) rawIngredient = ingredient;

  if (!ingredient) {
    for (const fallback of semanticFallbackTerms) {
      const matchedTerm = fallback.terms.find((term) => lowered.includes(term.toLowerCase()));
      if (!matchedTerm) continue;
      rawIngredient =
        lowered.includes(`${matchedTerm.toLowerCase()} 부산물`)
          ? `${matchedTerm} 부산물`
          : matchedTerm;
      ingredientCategory =
        rawIngredient.includes("부산물") && fallback.category === "농산물/식물성 자원"
          ? "농산물/식물성 부산물"
          : fallback.category;
      break;
    }
  }
  if (CATEGORIES.includes(preferredCategory)) categories = [preferredCategory];

  const primaryCategory = categories[0];
  if (!functions.length) {
    if (
      primaryCategory === "농자재/친환경 비료" &&
      /비료|토양|생장|농자재/.test(text)
    ) {
      functions.push("영양 보충");
    } else if (
      primaryCategory === "친환경 소재/바이오 플라스틱" &&
      /정수|필터|흡착|여과|수질/.test(text)
    ) {
      functions.push("수질정화/흡착");
    } else if (
      primaryCategory === "친환경 소재/바이오 플라스틱" &&
      /바이오\s*플라스틱|포장재|필름|복합소재|업사이클/.test(text)
    ) {
      functions.push("소재화/업사이클링");
    } else if (
      primaryCategory === "화장품" &&
      /감귤|풋귤|감태|녹차|백년초|동백/.test(text)
    ) {
      functions.push("항산화");
    } else if (
      primaryCategory === "건강기능식품" &&
      /감태|감귤|풋귤|녹차|백년초|프로폴리스/.test(text)
    ) {
      functions.push("항산화");
    } else if (
      primaryCategory === "위생/세정용품" &&
      /세정|위생|클리너|세척/.test(text)
    ) {
      functions.push("위생");
    } else if (
      primaryCategory === "펫푸드/펫케어" &&
      /영양제|간식|사료|영양/.test(text)
    ) {
      functions.push("영양 보충");
    } else if (
      primaryCategory === "의약외품" &&
      /구강|치약|가글/.test(text)
    ) {
      functions.push("구강 관리");
    }
  }

  return normalizeExtraction({
    ingredient,
    rawIngredient,
    ingredientCategory,
    functions,
    categories,
    unknown: ingredient || rawIngredient ? [] : text ? ["원료 확인 필요"] : []
  });
}

const ingredientGroups = {
  marine: ["감태", "모자반", "톳", "다시마", "미역", "우뭇가사리", "파래", "곰피"],
  plant: ["감귤 부산물", "만감류 부산물", "풋귤", "오디", "녹차", "백년초", "동백", "유채", "조릿대", "삼나무", "억새", "팔손이나무", "청보리", "고사리", "칡", "약콩"],
  livestock: ["흑돼지 부산물", "제주마 부산물"],
  bee: ["벌꿀", "프로폴리스"],
  water: ["화산암반수", "용암해수"],
  fungi: ["표고버섯"],
  microbial: [],
  mineral: ["화산재", "현무암", "송이", "화산석"]
};

const categoryCompatibility = {
  marine: CATEGORIES,
  plant: CATEGORIES,
  livestock: ["화장품", "원료 소재 B2B 공급", "펫푸드/펫케어", "의약외품", "사료첨가제"],
  bee: ["화장품", "건강기능식품", "기능성 식품/음료", "의약외품", "원료 소재 B2B 공급", "펫푸드/펫케어"],
  water: ["화장품", "원료 소재 B2B 공급", "위생/세정용품", "친환경 소재/바이오 플라스틱"],
  fungi: ["건강기능식품", "기능성 식품/음료", "원료 소재 B2B 공급", "사료첨가제", "농자재/친환경 비료"],
  microbial: CATEGORIES,
  mineral: ["친환경 소재/바이오 플라스틱", "농자재/친환경 비료", "위생/세정용품"]
};

function ingredientGroup(ingredient, hint = null) {
  const matched =
    Object.entries(ingredientGroups).find(([, items]) => items.includes(ingredient))?.[0] ||
    null;
  if (matched) return matched;
  const hintMap = {
    "농산물/식물성 부산물": "plant",
    "농산물/식물성 자원": "plant",
    "해양자원/해조류": "marine",
    "축산 부산물": "livestock",
    "양봉 유래 소재": "bee",
    "제주 수자원": "water",
    "균류 자원": "fungi",
    "미생물 자원": "microbial",
    "광물/무기물/지질자원": "mineral"
  };
  return hintMap[hint] || "unknown";
}

function ingredientCategoryLabel(group, ingredient) {
  if (group === "marine") return "해양자원/해조류";
  if (group === "plant") return ingredient?.includes("부산물") ? "농산물/식물성 부산물" : "농산물/식물성 자원";
  if (group === "livestock") return "축산 부산물";
  if (group === "bee") return "양봉 유래 소재";
  if (group === "water") return "제주 수자원";
  if (group === "fungi") return "균류 자원";
  if (group === "microbial") return "미생물 자원";
  if (group === "mineral") return "광물/무기물/지질자원";
  return "원료 분류 확인 필요";
}

function bioTypeFor(group, category) {
  if (group === "unknown") return "Bio 분야 확인 필요";
  if (["친환경 소재/바이오 플라스틱", "위생/세정용품", "농자재/친환경 비료"].includes(category)) {
    return "White Bio";
  }
  if (group === "mineral") return "White Bio (환경소재 연계)";
  if (group === "marine" || group === "water") return "Blue Bio";
  if (group === "livestock" || group === "bee") return "Red Bio";
  return "Green Bio";
}

function detectProductForm(idea, category) {
  const forms = CATEGORY_DEFINITIONS[category]?.forms || [];
  const detected = forms.find((form) => String(idea || "").includes(form));
  return detected || (forms.length ? `미지정 (예: ${forms.slice(0, 3).join(", ")})` : "세부 형태 미지정");
}

function makeClassification(idea, extraction) {
  const text = String(idea || "");
  const group = ingredientGroup(
    extraction.standardIngredient || extraction.ingredient,
    extraction.ingredientCategoryHint
  );
  const category = extraction.categories[0] || null;
  const allowedCategories = categoryCompatibility[group] || CATEGORIES;
  const reasons = [];
  const subTags = [];
  let score = 90;
  let contradictory = false;

  if (!extraction.ingredient) {
    score = 45;
    reasons.push("표준 원료가 확인되지 않아 원료-제품 연결을 검증할 수 없습니다.");
  }
  if (!category) {
    score = Math.min(score, 50);
    reasons.push("제품군이 지정되지 않아 적용 가능성을 판단하기 어렵습니다.");
  }
  if (category && !allowedCategories.includes(category)) {
    score = Math.min(score, 48);
    contradictory = true;
    reasons.push(`${ingredientCategoryLabel(group, extraction.ingredient)}과 ${category}의 직접 연결 근거가 약합니다.`);
  }
  if (text.includes("해양생물") && group === "livestock") {
    score = Math.min(score, 35);
    contradictory = true;
    reasons.push("적용 대상인 해양생물의 종과 사용 목적이 불명확해 축산 부산물과의 연결성이 낮습니다.");
  }

  const candidateFunctions = CATEGORY_DEFINITIONS[category]?.functions || [];
  if (
    extraction.functions.length &&
    candidateFunctions.length &&
    !extraction.functions.some((item) => candidateFunctions.includes(item))
  ) {
    score = Math.min(score, 58);
    reasons.push(`선택 기능이 ${category}의 주요 기능 후보와 직접 일치하지 않습니다.`);
  }

  if (/정수\s*필터|흡착|여과|수질정화/.test(text)) {
    subTags.push("정수 필터", "흡착", "여과", "수질정화");
  }

  if (!reasons.length) {
    reasons.push("원료 특성과 선택 제품군의 일반적인 활용 경로가 논리적으로 연결됩니다.");
  }

  return {
    ingredientCategory: ingredientCategoryLabel(group, extraction.ingredient),
    ingredientGroup: group,
    bioType: bioTypeFor(group, category),
    productForm: detectProductForm(text, category),
    functionCandidates: [
      ...new Set([
        ...extraction.functions,
        ...(CATEGORY_DEFINITIONS[category]?.functions || [])
      ])
    ].slice(0, 5),
    subTags,
    mappingReason: extraction.mappingReason || "",
    mappingConfidence: extraction.mappingConfidence,
    logicalFit: {
      score,
      label: score >= 80 ? "높음" : score >= 60 ? "보통" : "낮음",
      reasons,
      contradictory
    }
  };
}

function stableHash(text) {
  return [...String(text || "")].reduce(
    (hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0,
    2166136261
  );
}

function makeProxyProfile(ingredient, group) {
  const bases = {
    plant: [22, 12, 18, 7, 6800, 12.5],
    marine: [26, 15, 21, 8, 1700, 14.2],
    livestock: [17, 9, 16, 6, 4200, 11.8],
    bee: [28, 14, 24, 9, 380, 18.5],
    water: [16, 8, 13, 5, 9200, 9.8],
    fungi: [24, 13, 19, 7, 1300, 15.1],
    microbial: [31, 18, 27, 11, 720, 16.4],
    mineral: [13, 7, 11, 4, 5400, 10.7],
    unknown: [14, 7, 12, 4, 920, 17.5]
  };
  const base = bases[group] || bases.unknown;
  const seed = stableHash(ingredient);
  const offset = (shift, range) => ((seed >> shift) % range) - Math.floor(range / 2);
  return {
    paperCount: Math.max(4, base[0] + offset(0, 9)),
    recentPaperCount: Math.max(2, base[1] + offset(3, 5)),
    patentCount: Math.max(3, base[2] + offset(6, 11)),
    recentPatentCount: Math.max(1, base[3] + offset(9, 5)),
    productionTons: Math.max(80, base[4] + offset(12, 1201)),
    productionVariation: Math.max(5, Math.round((base[5] + offset(16, 41) / 10) * 10) / 10),
    mfdsName: `${ingredient || "선택 원료"} 표준명 검증 필요`,
    casNo: "확인 필요",
    restriction: "원료군 프록시 분석이며 실제 식약처 원료정보 대조 필요",
    evidenceMode: group === "unknown" ? "fallback" : "proxy",
    proxyLabel: `${ingredientCategoryLabel(group, ingredient)} 유사 원료군`
  };
}

function applyScoreCaps(scores, extraction, classification, profile) {
  const deductions = [];
  const caps = [];

  if (!extraction.functions.length) {
    caps.push(60);
    deductions.push("기능 미지정: 종합점수 최대 60점");
  }
  if (!extraction.categories.length) {
    caps.push(65);
    deductions.push("제품군 미지정: 종합점수 최대 65점");
  }
  if (!extraction.ingredient && !extraction.categories.length) {
    caps.push(50);
    deductions.push("원료와 제품군 모두 불명확: 종합점수 최대 50점");
  }
  if (classification.logicalFit.contradictory) {
    caps.push(55);
    deductions.push("원료-제품군 또는 적용 대상의 논리적 모순: 종합점수 최대 55점");
  }
  if (profile.evidenceMode === "fallback") {
    caps.push(60);
    deductions.push("검색·기능 근거 부족: 종합점수 최대 60점");
  }

  const fitPenalty = Math.max(0, 70 - classification.logicalFit.score) * 0.2;
  const evidencePenalty = profile.evidenceMode === "proxy" ? 6 : 0;
  if (evidencePenalty) {
    deductions.push("실데이터 미연동: 유사 원료군 프록시 보정 -6점");
  }
  const adjustedTotal = Math.max(
    0,
    Math.round((scores.total - fitPenalty - evidencePenalty) * 10) / 10
  );
  const appliedCap = caps.length ? Math.min(...caps) : 100;
  const total = Math.min(adjustedTotal, appliedCap);

  return {
    ...scores,
    rawTotal: scores.total,
    total,
    appliedCap: appliedCap < 100 ? appliedCap : null,
    deductions
  };
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

  const total = Math.round(
    (technical * 0.3 + market * 0.25 + patentSafety * 0.2 + supply * 0.2) * 10
  ) / 10;
  return { technical, market, patentSafety, supply, total };
}

function makeEvidence(extraction, profile, scores) {
  const ingredient = extraction.ingredient || "원료 미확정";
  const functionQuery = extraction.functions.length ? extraction.functions.join(", ") : "기능 미지정";
  const categoryQuery = extraction.categories.length ? extraction.categories.join(", ") : "제품군 미지정";
  const isProxy = profile.evidenceMode === "proxy";
  const recordStatus = isProxy ? "원료군 프록시" : profile.evidenceMode === "fallback" ? "근거 부족" : "데모 캐시";

  return {
    isProxy,
    proxyLabel: profile.proxyLabel || null,
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
        value: isProxy ? `연구근거 프록시 ${profile.paperCount}` : `논문 ${profile.paperCount}건`,
        detail: isProxy ? `최근성 프록시 ${profile.recentPaperCount}` : `최근 5년 ${profile.recentPaperCount}건`,
        status: recordStatus
      },
      {
        axis: "시장성",
        source: "제품군 기준표",
        query: categoryQuery,
        value: `기본점수 ${CATEGORY_MARKET_BASE[extraction.categories[0]] || 70}`,
        detail: `경쟁도 보정 후 ${scores.market}점`,
        status: isProxy ? "MVP 프록시" : "MVP 기준"
      },
      {
        axis: "특허안전성",
        source: "KIPRIS Plus",
        query: `${ingredient} + ${categoryQuery}`,
        value: isProxy ? `경쟁특허 프록시 ${profile.patentCount}` : `유사 특허 ${profile.patentCount}건`,
        detail: isProxy ? `최근성 프록시 ${profile.recentPatentCount}` : `최근 특허 ${profile.recentPatentCount}건`,
        status: recordStatus
      },
      {
        axis: "공급안정성",
        source: "제주데이터허브",
        query: ingredient,
        value: isProxy ? `공급규모 프록시 ${profile.productionTons}` : `생산 ${profile.productionTons.toLocaleString("ko-KR")}톤`,
        detail: `변동성 프록시 ${profile.productionVariation}%`,
        status: recordStatus
      },
      {
        axis: "보조 근거",
        source: "식의약 데이터포털",
        query: ingredient,
        value: profile.mfdsName,
        detail: profile.restriction,
        status: recordStatus
      }
    ]
  };
}

const categorySignals = {
  "화장품": { growth: 72, competition: 78, patentFactor: 1 },
  "건강기능식품": { growth: 76, competition: 61, patentFactor: 0.78 },
  "펫푸드/펫케어": { growth: 84, competition: 34, patentFactor: 0.52 },
  "기능성 식품/음료": { growth: 69, competition: 57, patentFactor: 0.7 },
  "의약외품": { growth: 66, competition: 63, patentFactor: 0.82 },
  "원료 소재 B2B 공급": { growth: 64, competition: 46, patentFactor: 0.58 },
  "위생/세정용품": { growth: 62, competition: 49, patentFactor: 0.6 },
  "사료첨가제": { growth: 71, competition: 43, patentFactor: 0.56 },
  "친환경 소재/바이오 플라스틱": { growth: 88, competition: 38, patentFactor: 0.48 },
  "농자재/친환경 비료": { growth: 73, competition: 41, patentFactor: 0.5 }
};

function scenarioZone(growth, competition) {
  if (growth >= 70 && competition < 50) return "blue";
  if (growth >= 70 && competition >= 50) return "crowded";
  if (growth < 70 && competition >= 50) return "red";
  return "niche";
}

function makePatentTrend(recentPatentCount) {
  const years = [2022, 2023, 2024, 2025, 2026];
  const weights = [0.12, 0.16, 0.2, 0.24, 0.28];
  const values = weights.map((weight) => Math.max(0, Math.floor(recentPatentCount * weight)));
  let remainder = recentPatentCount - values.reduce((sum, value) => sum + value, 0);
  let index = values.length - 1;
  while (remainder > 0) {
    values[index] += 1;
    remainder -= 1;
    index = index === 0 ? values.length - 1 : index - 1;
  }

  return years.map((year, yearIndex) => ({ year, value: values[yearIndex] }));
}

function makeDecisionSupport(extraction, profile, scores, classification) {
  const currentCategory = extraction.categories[0] || "원료 소재 B2B 공급";
  const candidatePool =
    currentCategory === "사료첨가제"
      ? [currentCategory, "펫푸드/펫케어", "원료 소재 B2B 공급"]
      : classification.ingredientGroup === "mineral"
      ? [currentCategory, "친환경 소재/바이오 플라스틱", "위생/세정용품", "농자재/친환경 비료"]
      : classification.ingredientGroup === "livestock"
        ? [currentCategory, "원료 소재 B2B 공급", "펫푸드/펫케어", "화장품"]
        : [currentCategory, currentCategory === "화장품" ? "펫푸드/펫케어" : "화장품", "건강기능식품", "펫푸드/펫케어"];
  const candidateCategories = [...new Set(candidatePool)].slice(0, 3);

  const scenarios = candidateCategories.map((category, index) => {
    const signal = categorySignals[category] || { growth: 65, competition: 50, patentFactor: 0.7 };
    const circularBonus = extraction.ingredient?.includes("부산물") ? 5 : 0;
    const market =
      index === 0
        ? scores.market
        : clamp((CATEGORY_MARKET_BASE[category] || 70) - signal.competition * 0.08 + circularBonus);
    const patentSafety =
      index === 0
        ? scores.patentSafety
        : clamp(
            100 -
              (profile.patentCount * signal.patentFactor * 0.65 +
                profile.recentPatentCount * signal.patentFactor * 0.75)
          );
    const calculatedTotal = Math.round(
      (scores.technical * 0.3 +
        market * 0.25 +
        patentSafety * 0.2 +
        scores.supply * 0.2 +
        classification.logicalFit.score * 0.05) *
        10
    ) / 10;
    const total = category === currentCategory ? scores.total : calculatedTotal;

    return {
      id: category === currentCategory ? "current" : `pivot-${index}`,
      category,
      label: category === currentCategory ? `${category} (현재)` : category,
      growth: signal.growth,
      competition: signal.competition,
      zone: scenarioZone(signal.growth, signal.competition),
      scores: {
        technical: scores.technical,
        market,
        patentSafety,
        supply: scores.supply,
        total
      }
    };
  });

  const competitionValues = scenarios.map((scenario) => scenario.competition);
  const competitionSpread = Math.max(...competitionValues) - Math.min(...competitionValues);
  const bestScenario = [...scenarios].sort((a, b) => b.scores.total - a.scores.total)[0];
  const isApplicationProblem = competitionSpread >= 20;

  return {
    scenarios,
    diagnosis: isApplicationProblem ? "아이템(적용처) 경쟁 문제" : "원료 자체 경쟁 문제",
    rationale: isApplicationProblem
      ? `같은 원료라도 제품군에 따라 경쟁밀도가 ${competitionSpread}p 차이 납니다. 원료를 버리기보다 적용처 피벗이 유효합니다.`
      : "제품군을 바꿔도 경쟁밀도 차이가 작습니다. 원료 차별화나 새로운 활성물질 탐색이 우선입니다.",
    action:
      bestScenario.id === "current"
        ? "현재 제품군을 유지하고 추출공정·배합·효능 타깃을 구체화하세요."
        : `${bestScenario.category} 방향을 우선 피벗 후보로 검토하면 예상 종합점수 ${bestScenario.scores.total}점입니다.`,
    recommendedScenarioId: bestScenario.id,
    patentTrend: makePatentTrend(profile.recentPatentCount)
  };
}

function makeRegulatoryChecklist(extraction, profile) {
  const category = extraction.categories[0] || "제품군 미지정";
  return [
    {
      item: "식약처 표준 원료명",
      value: profile.mfdsName,
      status:
        profile.mfdsName.includes("확인") || profile.mfdsName.includes("필요")
          ? "needed"
          : "pass",
      action:
        profile.mfdsName.includes("확인") || profile.mfdsName.includes("필요")
          ? "표준명 매칭 필요"
          : "표준명 후보 확인"
    },
    {
      item: "CAS No.",
      value: profile.casNo,
      status: profile.casNo.includes("확인") || profile.casNo.includes("미지정") ? "review" : "pass",
      action: "혼합물·추출물 규격서 대조"
    },
    {
      item: "사용제한·주의사항",
      value: profile.restriction,
      status: "review",
      action: "제품 배합 전 전문가 검토"
    },
    {
      item: "제품군 적합성",
      value: category,
      status: extraction.categories.length ? "review" : "needed",
      action: `${category} 인허가 경로 확인`
    }
  ];
}

function makeRecommendations(idea, extraction, classification, decisionSupport) {
  const text = String(idea || "");
  if (
    classification.ingredientGroup === "livestock" &&
    text.includes("해양생물")
  ) {
    return [
      "흑돼지 콜라겐 기반 화장품 소재",
      "펫 피부/모질 영양제",
      "콜라겐 원료 소재 B2B 공급"
    ];
  }

  const recommendations = [];
  const category = extraction.categories[0];
  if (!extraction.functions.length && category) {
    const functions = (CATEGORY_DEFINITIONS[category]?.functions || []).slice(0, 3);
    if (functions.length) recommendations.push(`${category} 기능 후보 구체화: ${functions.join(", ")}`);
  }
  if (classification.ingredientGroup === "mineral") {
    recommendations.push("정수 필터·흡착제용 환경소재 성능 검증");
  }

  const recommendedScenario = decisionSupport.scenarios.find(
    (scenario) => scenario.id === decisionSupport.recommendedScenarioId
  );
  if (recommendedScenario?.id !== "current") {
    recommendations.push(
      `${extraction.ingredient || "선택 원료"} 기반 ${recommendedScenario.category} 피벗 검토`
    );
  }
  recommendations.push("추출공정·배합·적용 대상을 구체화해 특허 검색식을 다시 실행");
  return [...new Set(recommendations)].slice(0, 4);
}

function makeValidationStatus(extraction, classification, profile) {
  const items = [];
  if (!extraction.ingredient) items.push("표준 원료 확인");
  if (extraction.ingredient && !extraction.standardIngredient) {
    items.push("원문 원료와 표준 원료 목록의 매핑 검증");
  }
  if (!extraction.functions.length) items.push("주요 기능 선택");
  if (!extraction.categories.length) items.push("제품군 선택");
  if (classification.logicalFit.score < 80) items.push("원료-제품군 적합성 검증");
  if (profile.evidenceMode) items.push("논문·특허 원문 근거 추가");
  if (classification.subTags.length) items.push(`${classification.subTags.join(", ")} 성능시험`);
  items.push("식약처 제한사항 및 인허가 경로 확인");
  return {
    required: items.length > 1,
    items: [...new Set(items)]
  };
}

export function makeFallbackExplanation(
  extraction,
  scores,
  evidence,
  classification = null,
  recommendations = []
) {
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

  const hasCap = Boolean(scores.appliedCap);
  const hasAdjustment = scores.deductions.length > 0;
  return {
    summary: hasCap
      ? `${ingredientWithParticle} 활용한 ${category} 아이디어는 원점수 ${scores.rawTotal}점이지만, ${scores.deductions.join(", ")} 규칙이 적용되어 최종 ${scores.total}점입니다.`
      : hasAdjustment
        ? `${ingredientWithParticle} 활용한 ${category} 아이디어는 원점수 ${scores.rawTotal}점에서 데이터 신뢰도 보정을 반영해 ${scores.total}점입니다. 원료군과 제품군의 방향성은 비교할 수 있지만 실제 공공데이터 확인이 필요합니다.`
      : `${ingredientWithParticle} 활용한 ${category} 아이디어의 종합점수는 ${scores.total}점입니다. ${strongest[0]}이 가장 강한 근거이며, ${weakest[0]}은 추가 확인이 필요합니다.`,
    strengths: [
      `${strongest[0]} ${strongest[1]}점으로 네 축 중 가장 높습니다.`,
      evidence.isProxy
        ? `${evidence.proxyLabel} 프록시를 사용해 축별 상대 점수를 계산했습니다.`
        : `공공데이터 샘플에서 논문 ${evidence.paperCount}건, 최근 5년 자료 ${evidence.recentPaperCount}건이 확인됩니다.`
    ],
    weaknesses: hasAdjustment
      ? [
          ...scores.deductions,
          ...(classification?.logicalFit?.score < 80
            ? classification.logicalFit.reasons
            : []
          ).slice(0, 1)
        ]
      : [
          `${weakest[0]} ${weakest[1]}점이 네 근거 중 가장 낮습니다.`,
          `유사 특허 ${evidence.patentCount}건은 실제 청구항 단위의 추가 검토가 필요합니다.`
        ],
    improvements: recommendations.length
      ? recommendations.slice(0, 3)
      : [
          "원료 단독 주장보다 추출 공정, 배합 조성 또는 적용 대상을 구체화하세요.",
          "점수가 낮은 축을 보완할 수 있도록 제품군 변경 시나리오를 함께 비교하세요."
        ],
    review: [
      evidence.restriction,
      ...(evidence.isProxy
        ? ["현재 원료는 유사 원료군 프록시이며 실제 API 검색 결과로 교체해야 합니다."]
        : []),
      "현재 수치는 해커톤 시연용 캐시 데이터이며 실제 출원·사업화 전 원문 확인이 필요합니다."
    ]
  };
}

export function calculateAnalysis({ idea = "", extraction = {} }) {
  const normalized = normalizeExtraction(extraction);
  const ruled = extractWithRules(idea);
  const standardIngredient = normalized.ingredient || ruled.ingredient || null;
  const resolvedIngredient =
    standardIngredient || normalized.rawIngredient || ruled.rawIngredient || null;
  const resolved = {
    ingredient: resolvedIngredient,
    standardIngredient,
    rawIngredient: normalized.rawIngredient || ruled.rawIngredient || resolvedIngredient,
    ingredientCategoryHint:
      normalized.ingredientCategoryHint || ruled.ingredientCategoryHint || null,
    mappingReason: normalized.mappingReason || ruled.mappingReason || "",
    mappingConfidence:
      normalized.mappingConfidence ?? ruled.mappingConfidence ?? null,
    functions: normalized.functions.length ? normalized.functions : ruled.functions,
    categories: normalized.categories.length ? normalized.categories : ruled.categories,
    unknown: [
      ...new Set([...normalized.unknown, ...ruled.unknown].filter((item) => {
        return !(resolvedIngredient && item === "원료 확인 필요");
      }))
    ]
  };
  const classification = makeClassification(idea, resolved);
  const profile =
    EVIDENCE_PROFILES[resolved.standardIngredient || resolved.ingredient] ||
    makeProxyProfile(resolved.ingredient, classification.ingredientGroup);
  const baseScores = makeScores(resolved, profile);
  baseScores.total = Math.round(
    (baseScores.technical * 0.3 +
      baseScores.market * 0.25 +
      baseScores.patentSafety * 0.2 +
      baseScores.supply * 0.2 +
      classification.logicalFit.score * 0.05) *
      10
  ) / 10;
  const scores = applyScoreCaps(baseScores, resolved, classification, profile);
  const evidence = makeEvidence(resolved, profile, scores);
  const decisionSupport = makeDecisionSupport(resolved, profile, scores, classification);
  const recommendations = makeRecommendations(idea, resolved, classification, decisionSupport);
  const validation = makeValidationStatus(resolved, classification, profile);

  return {
    idea,
    extraction: resolved,
    classification,
    scores,
    scoreReasons:
      profile.evidenceMode
        ? {
            technical: `${profile.proxyLabel} 연구근거 프록시`,
            market: `${resolved.categories[0] || "제품군"} 기본점수와 경쟁도 보정`,
            patentSafety: `${profile.proxyLabel} 경쟁특허 프록시`,
            supply: `${profile.proxyLabel} 공급규모·변동성 프록시`
          }
        : {
            technical: `논문 ${profile.paperCount}건 중 최근 5년 ${profile.recentPaperCount}건`,
            market: `${resolved.categories[0] || "제품군"} 기본점수와 경쟁도 보정`,
            patentSafety: `유사 특허 ${profile.patentCount}건, 최근 출원 ${profile.recentPatentCount}건`,
            supply: `연 생산 ${profile.productionTons.toLocaleString("ko-KR")}톤, 변동계수 ${profile.productionVariation}%`
          },
    evidence,
    decisionSupport,
    validation,
    recommendations,
    regulatoryChecklist: makeRegulatoryChecklist(resolved, profile),
    dataFreshness: [
      { source: "ScienceON", label: "논문 캐시", updatedAt: "2026-07-09" },
      { source: "KIPRIS Plus", label: "특허 캐시", updatedAt: "2026-07-09" },
      { source: "제주데이터허브", label: "생산통계 캐시", updatedAt: "2026-07-09" },
      { source: "식의약 데이터포털", label: "원료정보 캐시", updatedAt: "2026-07-09" }
    ],
    explanation: makeFallbackExplanation(
      resolved,
      scores,
      evidence,
      classification,
      recommendations
    ),
    formulas: {
      technical: "논문 수 정규화 점수 60% + 최근 5년 연구 비율 점수 40%",
      market: "제품군 기본점수 - 특허 경쟁도 보정 + 순환자원 보너스",
      patentSafety: "100 - (유사 특허 수 감점 + 최근 특허 수 가중 감점)",
      supply: "생산량 점수 50% + 생산 변동성 역점수 30% + 부산물 활용성 20%",
      total: "기술성 30% + 시장성 25% + 특허안전성 20% + 공급안정성 20% + 논리적 적합성 5% - 보완 필요 감점"
    },
    generatedAt: new Date().toISOString()
  };
}

export function analyzeIdea(idea, preferredCategory = null) {
  return calculateAnalysis({
    idea,
    extraction: extractWithRules(idea, preferredCategory)
  });
}
