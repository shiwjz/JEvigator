const ANTHROPIC_MESSAGES_URL = "https://api.anthropic.com/v1/messages";
const DEFAULT_ANTHROPIC_MODEL = "claude-3-5-haiku-20241022";

const SYSTEM_PROMPT = `너는 초기 제주 바이오 창업자를 위한 AI 사업화 코치다.
점수를 새로 만들지 말고, 이미 계산된 리포트 결과를 바탕으로 설명한다.
답변은 사업자가 바로 판단할 수 있게 명확하게 작성한다.
근거 없는 확정 표현은 피하되, 결론은 분명하게 제시한다.
규제·인허가 관련 내용은 제품화 경로와 리스크 관리 관점으로 설명한다.
답변은 한국어로 작성한다.
답변은 700자 이내로 작성한다.`;

function parseBody(body) {
  if (!body) return {};
  return typeof body === "string" ? JSON.parse(body || "{}") : body;
}

function sanitizeText(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function sanitizeContext(reportContext) {
  const context = reportContext && typeof reportContext === "object" ? reportContext : {};
  return {
    itemName: sanitizeText(context.itemName, 160),
    ingredient: sanitizeText(context.ingredient, 80),
    function: sanitizeText(context.function, 120),
    productCategory: sanitizeText(context.productCategory, 120),
    score: Number.isFinite(Number(context.score)) ? Number(context.score) : null,
    marketPosition: sanitizeText(context.marketPosition, 80),
    strongestDifferentiation: sanitizeText(context.strongestDifferentiation, 240),
    recommendedAction: sanitizeText(context.recommendedAction, 240)
  };
}

function clipAnswer(answer) {
  const text = sanitizeText(answer, 700);
  return text.length > 700 ? text.slice(0, 700) : text;
}

function extractAnthropicText(payload) {
  const content = Array.isArray(payload?.content) ? payload.content : [];
  return content
    .map((part) => (part?.type === "text" ? part.text : ""))
    .filter(Boolean)
    .join("\n")
    .trim();
}

export default async function handler(request, response) {
  if (request.method && request.method !== "POST") {
    response.status(405).json({ error: "POST only" });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    response.status(503).json({ error: "AI coach unavailable" });
    return;
  }

  try {
    const body = parseBody(request.body);
    const question = sanitizeText(body.question, 300);
    if (!question) {
      response.status(400).json({ error: "question is required" });
      return;
    }

    const reportContext = sanitizeContext(body.reportContext);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 18000);
    const anthropicResponse = await fetch(ANTHROPIC_MESSAGES_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || DEFAULT_ANTHROPIC_MODEL,
        max_tokens: 900,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `현재 리포트 context:
${JSON.stringify(reportContext, null, 2)}

사용자 질문:
${question}`
          }
        ]
      })
    });
    clearTimeout(timeout);

    if (!anthropicResponse.ok) {
      response.status(502).json({ error: "AI coach unavailable" });
      return;
    }

    const payload = await anthropicResponse.json();
    const answer = clipAnswer(extractAnthropicText(payload));
    if (!answer) {
      response.status(502).json({ error: "AI coach unavailable" });
      return;
    }

    response.status(200).json({ answer });
  } catch {
    response.status(502).json({ error: "AI coach unavailable" });
  }
}
