import { CATEGORIES, FUNCTIONS, INGREDIENTS } from "../data/catalog.js";
import { calculateAnalysis, extractWithRules } from "./analyzer.mjs";

function parseJsonText(text) {
  const cleaned = String(text || "")
    .replace(/^```json\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  return JSON.parse(cleaned);
}

async function extractWithGemini(idea) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GEMINI_MODEL || "gemini-3.5-flash";
  const prompt = [
    "너는 제주 바이오 R&D 플랫폼의 키워드 추출기다.",
    "사용자의 문장에서 원료, 기능, 제품군을 추출한다.",
    "반드시 제공된 표준 목록에서만 선택하고 목록 밖 표현은 unknown에 넣는다.",
    "추측하지 말고 JSON만 출력한다.",
    `원료 목록: ${INGREDIENTS.join(", ")}`,
    `기능 목록: ${FUNCTIONS.join(", ")}`,
    `제품군 목록: ${CATEGORIES.join(", ")}`,
    `사용자 문장: ${idea}`,
    '반환 형식: {"ingredient":string|null,"functions":string[],"categories":string[],"unknown":string[]}'
  ].join("\n");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0
        }
      })
    }
  );

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

  const response = await fetch("https://api.anthropic.com/v1/messages", {
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

export async function runAnalysis({ idea = "", extraction: suppliedExtraction = null }) {
  const providers = {
    keywordExtractor: "규칙 기반 폴백",
    resultExplainer: "근거 기반 폴백",
    publicData: "해커톤 캐시 데이터"
  };
  const warnings = [];
  let extraction = suppliedExtraction;

  if (!extraction) {
    try {
      extraction = await extractWithGemini(idea);
      if (extraction) providers.keywordExtractor = "Gemini API";
    } catch (error) {
      warnings.push(`Gemini 연결 실패: ${error.message}`);
    }
  } else {
    providers.keywordExtractor = "추천 아이디어 JSON";
  }

  const result = calculateAnalysis({
    idea,
    extraction: extraction || extractWithRules(idea)
  });

  try {
    const explanation = await explainWithClaude(result);
    if (explanation) {
      result.explanation = explanation;
      providers.resultExplainer = "Claude API";
    }
  } catch (error) {
    warnings.push(`Claude 연결 실패: ${error.message}`);
  }

  return { ...result, providers, warnings };
}
