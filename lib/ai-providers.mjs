import { CATEGORIES, FUNCTIONS, INGREDIENTS } from "../data/catalog.js";
import { calculateAnalysis, extractWithRules } from "./analyzer.mjs";
import { collectExternalEvidence } from "./external-evidence.mjs";
import { enrichWithExternalEvidence } from "./evidence-integrator.mjs";
import { assessCompanyProfile } from "./company-diagnosis.mjs";

async function fetchWithTimeout(url, options = {}, timeoutMs = 8500) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function parseJsonText(text) {
  const cleaned = String(text || "")
    .replace(/^```json\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  return JSON.parse(cleaned);
}

async function extractWithGemini(idea, preferredCategory = null) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GEMINI_MODEL || "gemini-3.5-flash";
  const prompt = [
    "너는 제주 바이오 R&D 플랫폼의 의미 기반 키워드 정규화기다.",
    "사용자의 다양한 일상 표현과 동의어를 이해해 원료, 원료군, 기능을 정규화한다.",
    "단순 문자열 일치만 하지 말고 의미가 같은 표현을 표준 원료로 연결한다.",
    "예: 귤껍질·진피·감귤박 -> 감귤 부산물, 돼지껍데기 -> 흑돼지 부산물, 화산송이 -> 송이.",
    "표준 목록에 정확한 대응 원료가 없더라도 원료를 미확인으로 버리지 않는다.",
    "이 경우 rawIngredient에는 원문 원료를 보존하고 ingredient는 null로 두며 ingredientCategory를 반드시 분류한다.",
    "예: 매생이 -> rawIngredient 매생이, ingredient null, ingredientCategory 해양자원/해조류.",
    "예: 당근 부산물 -> rawIngredient 당근 부산물, ingredient null, ingredientCategory 농산물/식물성 부산물.",
    "unknown은 원료 자체가 문장에서 전혀 식별되지 않을 때만 사용한다.",
    "기능은 반드시 표준 기능 목록의 표현으로 바꾼다.",
    "제품 목적이 기능을 명확히 내포하면 기능을 추론한다.",
    "예: 비료·작물 생장 -> 영양 보충, 정수 필터·흡착제 -> 수질정화/흡착, 세정 제품 -> 위생, 펫 영양제·간식 -> 영양 보충, 구강케어 -> 구강 관리.",
    "제품 목적이 명확한데 functions를 빈 배열로 두지 않는다.",
    "추측 근거가 약하면 confidence를 낮추되 가능한 원료군 분류는 수행한다.",
    "JSON만 출력한다.",
    `원료 목록: ${INGREDIENTS.join(", ")}`,
    "원료군 목록: 농산물/식물성 부산물, 농산물/식물성 자원, 해양자원/해조류, 축산 부산물, 양봉 유래 소재, 제주 수자원, 균류 자원, 미생물 자원, 광물/무기물/지질자원",
    `기능 목록: ${FUNCTIONS.join(", ")}`,
    `제품군 목록: ${CATEGORIES.join(", ")}`,
    preferredCategory
      ? `사용자가 미리 선택한 제품군은 "${preferredCategory}"이다. categories는 반드시 ["${preferredCategory}"]로 반환한다.`
      : "제품군이 명확하지 않으면 빈 배열로 반환한다.",
    `사용자 문장: ${idea}`,
    '반환 형식: {"rawIngredient":string|null,"ingredient":string|null,"ingredientCategory":string|null,"functions":string[],"categories":string[],"mappingReason":string,"confidence":number,"unknown":string[]}'
  ].join("\n");

  const endpoint =
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  const requestOptions = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-goog-api-key": apiKey
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            rawIngredient: { type: "STRING", nullable: true },
            ingredient: { type: "STRING", nullable: true },
            ingredientCategory: { type: "STRING", nullable: true },
            functions: { type: "ARRAY", items: { type: "STRING" } },
            categories: { type: "ARRAY", items: { type: "STRING" } },
            mappingReason: { type: "STRING" },
            confidence: { type: "NUMBER" },
            unknown: { type: "ARRAY", items: { type: "STRING" } }
          },
          required: [
            "rawIngredient",
            "ingredient",
            "ingredientCategory",
            "functions",
            "categories",
            "mappingReason",
            "confidence",
            "unknown"
          ]
        },
        temperature: 0
      }
    })
  };
  let response = await fetchWithTimeout(endpoint, requestOptions);
  if (response.status === 429 || response.status === 503) {
    await new Promise((resolve) => setTimeout(resolve, 650));
    response = await fetchWithTimeout(endpoint, requestOptions);
  }

  if (!response.ok) throw new Error(`Gemini API ${response.status}`);
  const payload = await response.json();
  return parseJsonText(payload.candidates?.[0]?.content?.parts?.[0]?.text);
}

async function explainWithClaude(result) {
  if (process.env.ENABLE_CLAUDE !== "true") return null;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const model = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001";
  const prompt = [
    "너는 바이오 R&D 의사결정 지원 AI다.",
    "아래 점수는 공공데이터 기반 서버 코드가 계산했다. 점수를 절대 변경하지 마라.",
    "근거가 부족하면 추가 검토 필요라고 작성한다.",
    "반드시 JSON만 출력한다.",
    '형식: {"summary":string,"strengths":string[],"weaknesses":string[],"improvements":string[],"review":string[]}',
    JSON.stringify({
      ingredient: result.extraction.ingredient,
      functions: result.extraction.functions,
      categories: result.extraction.categories,
      scores: result.scores,
      evidence: {
        paperCount: result.evidence.paperCount,
        recentPaperCount: result.evidence.recentPaperCount,
        patentCount: result.evidence.patentCount,
        productionStatus: result.evidence.productionStatus,
        restriction: result.evidence.restriction
      }
    })
  ].join("\n");

  const response = await fetchWithTimeout("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model,
      max_tokens: 900,
      temperature: 0.2,
      messages: [{ role: "user", content: prompt }]
    })
  });

  if (!response.ok) throw new Error(`Claude API ${response.status}`);
  const payload = await response.json();
  const text = payload.content?.find((block) => block.type === "text")?.text;
  return parseJsonText(text);
}

export async function runAnalysis({
  idea = "",
  extraction: suppliedExtraction = null,
  preferredCategory = null,
  companyProfile = null
}) {
  const providers = {
    keywordExtractor: "규칙 기반 폴백",
    resultExplainer: "근거 기반 폴백",
    publicData: "해커톤 캐시 데이터"
  };
  const warnings = [];
  let extraction = suppliedExtraction;

  if (!extraction) {
    try {
      extraction = await extractWithGemini(idea, preferredCategory);
      if (extraction) providers.keywordExtractor = "Gemini API";
    } catch (error) {
      warnings.push(`Gemini 연결 실패: ${error.message}`);
    }
  } else {
    providers.keywordExtractor = "추천 원료 JSON";
  }

  const resolvedExtraction = extraction || extractWithRules(idea, preferredCategory);
  if (CATEGORIES.includes(preferredCategory)) {
    resolvedExtraction.categories = [preferredCategory];
    providers.keywordExtractor += " + 선택 제품군 고정";
  }

  let result = calculateAnalysis({
    idea,
    extraction: resolvedExtraction
  });

  try {
    const externalEvidence = await collectExternalEvidence({
      idea,
      extraction: result.extraction
    });
    result = enrichWithExternalEvidence(result, externalEvidence);
    providers.publicData = `${externalEvidence.papers.source} + 제주 CSV + 식약처 서버 조회`;
  } catch (error) {
    warnings.push(`외부 근거 연결 실패: ${error.message}`);
  }

  try {
    const explanation = await explainWithClaude(result);
    if (explanation) {
      result.explanation = explanation;
      providers.resultExplainer = "Claude API";
    }
  } catch (error) {
    warnings.push(`Claude 연결 실패: ${error.message}`);
  }

  if (companyProfile && typeof companyProfile === "object") {
    result.enterpriseDiagnosis = assessCompanyProfile(companyProfile);
  }

  return { ...result, providers, warnings };
}
