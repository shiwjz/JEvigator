import { RECOMMENDED_IDEAS } from "./data/catalog.js";
import { analyzeIdea, extractWithRules } from "./lib/analyzer.mjs";

const axisMeta = {
  technical: {
    label: "기술성",
    color: "#176b50",
    detail: "논문 수와 최근 연구 비율"
  },
  market: {
    label: "시장성",
    color: "#3272c9",
    detail: "제품군 활용성과 경쟁도"
  },
  patentSafety: {
    label: "특허안전성",
    color: "#c7525c",
    detail: "유사·최근 특허에 대한 안전 점수"
  },
  supply: {
    label: "공급안정성",
    color: "#ed7b2d",
    detail: "생산량과 연도별 변동성"
  }
};

const bioColors = {
  "Green Bio": "#3e8a57",
  "Blue Bio": "#3272c9",
  "Red Bio": "#c7525c",
  "White Bio": "#687773"
};

const state = {
  currentView: "home",
  currentFilter: "All",
  result: null
};

const elements = {
  ideaInput: document.querySelector("#ideaInput"),
  characterCount: document.querySelector("#characterCount"),
  ideaForm: document.querySelector("#ideaForm"),
  previewIngredient: document.querySelector("#previewIngredient"),
  previewFunctions: document.querySelector("#previewFunctions"),
  previewCategories: document.querySelector("#previewCategories"),
  ideaGrid: document.querySelector("#ideaGrid"),
  ideaCount: document.querySelector("#ideaCount"),
  bioTypeFilter: document.querySelector("#bioTypeFilter"),
  analysisDialog: document.querySelector("#analysisDialog"),
  analysisSteps: [...document.querySelectorAll("#analysisSteps li")],
  statusDialog: document.querySelector("#statusDialog"),
  toast: document.querySelector("#toast")
};

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  window.setTimeout(() => elements.toast.classList.remove("show"), 2200);
}

function navigate(viewName) {
  const target = document.querySelector(`[data-view="${viewName}"]`);
  if (!target) return;

  document.querySelectorAll("[data-view]").forEach((view) => {
    view.classList.toggle("active", view === target);
  });
  state.currentView = viewName;
  window.scrollTo({ top: 0, behavior: "instant" });
}

function joinOrFallback(values, fallback = "미지정") {
  return Array.isArray(values) && values.length ? values.join(", ") : fallback;
}

function updatePreview() {
  const idea = elements.ideaInput.value;
  const extraction = extractWithRules(idea);
  elements.characterCount.textContent = `${idea.length} / 300`;
  elements.previewIngredient.textContent = extraction.ingredient || "원료 확인 필요";
  elements.previewFunctions.textContent = joinOrFallback(extraction.functions);
  elements.previewCategories.textContent = joinOrFallback(extraction.categories);
}

function renderIdeas() {
  const visible =
    state.currentFilter === "All"
      ? RECOMMENDED_IDEAS
      : RECOMMENDED_IDEAS.filter((idea) => idea.bioType === state.currentFilter);

  elements.ideaCount.textContent = `${visible.length}개 아이디어`;
  elements.ideaGrid.innerHTML = visible
    .map(
      (idea) => `
        <article class="idea-card" style="--card-color:${bioColors[idea.bioType]}">
          <span class="bio-label">${idea.bioType}</span>
          <h2>${idea.title}</h2>
          <p>${idea.description}</p>
          <div class="idea-tags">
            <span>${idea.ingredient}</span>
            ${idea.functions.map((item) => `<span>${item}</span>`).join("")}
            ${idea.categories.map((item) => `<span>${item}</span>`).join("")}
          </div>
          <button type="button" data-idea-id="${idea.id}">이 아이디어 분석 →</button>
        </article>
      `
    )
    .join("");
}

function setLoadingStep(index) {
  elements.analysisSteps.forEach((step, stepIndex) => {
    step.classList.toggle("active", stepIndex === index);
    step.classList.toggle("done", stepIndex < index);
  });
}

function decisionFromScore(score) {
  if (score >= 80) return "우선 검토 가치가 높은 후보";
  if (score >= 70) return "보완 후 검토를 이어갈 후보";
  if (score >= 60) return "약점 축의 추가 검증 필요";
  return "초기 가설과 제품군 재검토 필요";
}

function renderScores(scores) {
  document.querySelector("#totalScore").textContent = Number(scores.total).toFixed(1);
  document.querySelector("#decisionLabel").textContent = decisionFromScore(scores.total);
  document.querySelector("#scoreGrid").innerHTML = Object.entries(axisMeta)
    .map(([key, meta]) => {
      const score = scores[key];
      return `
        <article class="score-card" style="--score-color:${meta.color};--score-width:${score}%">
          <div class="score-card-header">
            <span>${meta.label}</span>
            <strong>${score}</strong>
          </div>
          <div class="score-bar" aria-hidden="true"><span></span></div>
          <p>${meta.detail}</p>
        </article>
      `;
    })
    .join("");
}

function renderExplanation(explanation) {
  const groups = [
    ["강점", explanation.strengths],
    ["약점", explanation.weaknesses],
    ["개선 방향", explanation.improvements],
    ["추가 검토", explanation.review]
  ];

  document.querySelector("#aiSummary").textContent = explanation.summary;
  document.querySelector("#explanationGrid").innerHTML = groups
    .map(
      ([title, items]) => `
        <div class="explanation-group">
          <h3>${title}</h3>
          <ul>${(items || []).map((item) => `<li>${item}</li>`).join("")}</ul>
        </div>
      `
    )
    .join("");
}

function renderEvidence(records) {
  document.querySelector("#evidenceTable").innerHTML = records
    .map(
      (record) => `
        <div class="evidence-row">
          <span>${record.axis}</span>
          <span class="evidence-source">${record.source}</span>
          <span>${record.query}</span>
          <span class="evidence-value">${record.value}</span>
          <span>${record.detail}</span>
          <span><i class="record-status">${record.status}</i></span>
        </div>
      `
    )
    .join("");
}

function renderFormulas(formulas) {
  const labels = {
    technical: "기술성",
    market: "시장성",
    patentSafety: "특허안전성",
    supply: "공급안정성",
    total: "종합점수"
  };
  document.querySelector("#formulaList").innerHTML = Object.entries(formulas)
    .map(
      ([key, formula]) => `
        <div class="formula-item">
          <strong>${labels[key]}</strong>
          <span>${formula}</span>
        </div>
      `
    )
    .join("");
}

function renderResult(result) {
  state.result = result;
  const extraction = result.extraction;
  const title =
    result.idea ||
    `${extraction.ingredient || "제주 바이오 원료"} ${joinOrFallback(extraction.functions, "")} ${joinOrFallback(extraction.categories, "")}`;

  document.querySelector("#resultTitle").textContent = title;
  document.querySelector("#resultTimestamp").textContent =
    `${new Date(result.generatedAt).toLocaleString("ko-KR")} 분석 완료`;
  document.querySelector("#resultIngredient").textContent = extraction.ingredient || "확인 필요";
  document.querySelector("#resultFunctions").textContent = joinOrFallback(extraction.functions);
  document.querySelector("#resultCategories").textContent = joinOrFallback(extraction.categories);
  document.querySelector("#resultMode").textContent = result.providers?.keywordExtractor || "규칙 기반 폴백";
  document.querySelector("#explanationProvider").textContent =
    result.providers?.resultExplainer || "근거 기반 폴백";

  renderScores(result.scores);
  renderExplanation(result.explanation);
  renderEvidence(result.evidence.records);
  renderFormulas(result.formulas);
  navigate("result");
}

async function startAnalysis({ idea, extraction = null }) {
  const fallbackIdea =
    idea ||
    `${extraction?.ingredient || ""} ${joinOrFallback(extraction?.functions, "")} ${joinOrFallback(extraction?.categories, "")}`.trim();
  elements.analysisDialog.showModal();
  setLoadingStep(0);

  const timers = [
    window.setTimeout(() => setLoadingStep(1), 420),
    window.setTimeout(() => setLoadingStep(2), 820),
    window.setTimeout(() => setLoadingStep(3), 1180)
  ];

  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ idea: fallbackIdea, extraction })
    });
    if (!response.ok) throw new Error(`API ${response.status}`);
    const result = await response.json();
    await new Promise((resolve) => window.setTimeout(resolve, 1250));
    elements.analysisDialog.close();
    renderResult(result);
  } catch (error) {
    const fallback = analyzeIdea(fallbackIdea);
    fallback.providers = {
      keywordExtractor: extraction ? "추천 아이디어 JSON" : "브라우저 폴백",
      resultExplainer: "근거 기반 폴백",
      publicData: "해커톤 캐시 데이터"
    };
    await new Promise((resolve) => window.setTimeout(resolve, 900));
    elements.analysisDialog.close();
    renderResult(fallback);
    showToast("서버 연결 없이 데모 데이터로 분석했습니다.");
  } finally {
    timers.forEach(window.clearTimeout);
  }
}

document.querySelectorAll("[data-go]").forEach((button) => {
  button.addEventListener("click", () => navigate(button.dataset.go));
});

document.querySelector("#homeButton").addEventListener("click", () => navigate("home"));

elements.ideaInput.addEventListener("input", updatePreview);
elements.ideaForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const idea = elements.ideaInput.value.trim();
  if (idea.length < 8) {
    showToast("아이디어를 조금 더 구체적으로 적어주세요.");
    elements.ideaInput.focus();
    return;
  }
  startAnalysis({ idea });
});

document.querySelectorAll("[data-example]").forEach((button) => {
  button.addEventListener("click", () => {
    elements.ideaInput.value = button.dataset.example;
    updatePreview();
    elements.ideaInput.focus();
  });
});

elements.bioTypeFilter.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  state.currentFilter = button.dataset.filter;
  elements.bioTypeFilter.querySelectorAll("button").forEach((item) => {
    item.classList.toggle("active", item === button);
  });
  renderIdeas();
});

elements.ideaGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-idea-id]");
  if (!button) return;
  const idea = RECOMMENDED_IDEAS.find((item) => item.id === button.dataset.ideaId);
  if (!idea) return;
  startAnalysis({
    idea: idea.title,
    extraction: {
      ingredient: idea.ingredient,
      functions: idea.functions,
      categories: idea.categories,
      unknown: []
    }
  });
});

document.querySelector("#statusButton").addEventListener("click", () => elements.statusDialog.showModal());
document.querySelector("#closeStatusButton").addEventListener("click", () => elements.statusDialog.close());
document.querySelector("#printButton").addEventListener("click", () => window.print());
document.querySelector("#shareButton").addEventListener("click", async () => {
  if (!state.result) return;
  const result = state.result;
  const text = [
    result.idea,
    `종합점수 ${result.scores.total}`,
    ...Object.entries(axisMeta).map(([key, meta]) => `${meta.label} ${result.scores[key]}점`),
    result.explanation.summary
  ].join("\n");

  try {
    await navigator.clipboard.writeText(text);
    showToast("분석 결과를 복사했습니다.");
  } catch {
    showToast("브라우저에서 복사를 허용하지 않았습니다.");
  }
});

renderIdeas();
updatePreview();
