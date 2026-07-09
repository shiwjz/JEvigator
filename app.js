import { CATEGORIES, RECOMMENDED_IDEAS } from "./data/catalog.js";
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

const weightPresets = {
  default: { technical: 30, market: 30, patentSafety: 20, supply: 20 },
  cosmetic: { technical: 30, market: 30, patentSafety: 20, supply: 20 },
  health: { technical: 35, market: 20, patentSafety: 30, supply: 15 },
  pet: { technical: 30, market: 35, patentSafety: 20, supply: 15 }
};

const state = {
  currentView: "home",
  currentFilter: "All",
  result: null,
  selectedScenarioId: "current",
  weights: {
    technical: 30,
    market: 30,
    patentSafety: 20,
    supply: 20
  }
};

const elements = {
  ideaInput: document.querySelector("#ideaInput"),
  categorySelect: document.querySelector("#categorySelect"),
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
  const extraction = extractWithRules(idea, elements.categorySelect.value);
  elements.characterCount.textContent = `${idea.length} / 300`;
  elements.previewIngredient.textContent =
    extraction.ingredient || (idea ? "Gemini가 원료 표현을 의미 매핑합니다" : "입력 대기");
  elements.previewFunctions.textContent = extraction.functions.length
    ? extraction.functions.join(", ")
    : idea
      ? "Gemini가 기능 후보를 정규화합니다"
      : "입력 대기";
  elements.previewCategories.textContent =
    elements.categorySelect.value || "제품군을 먼저 선택하세요";
}

function renderCategoryOptions() {
  elements.categorySelect.insertAdjacentHTML(
    "beforeend",
    CATEGORIES.map((category) => `<option value="${category}">${category}</option>`).join("")
  );
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

function evidenceBalance(scores) {
  const values = Object.keys(axisMeta).map((key) => scores[key]);
  const strong = values.filter((value) => value >= 75).length;
  const weak = values.filter((value) => value < 65).length;
  const cap = scores.appliedCap ? ` · 점수 상한 ${scores.appliedCap} 적용` : "";
  return `근거 4개 중 ${strong}개 강함, ${weak}개 보완 필요${cap}`;
}

function renderScores(scores, reasons = {}) {
  document.querySelector("#totalScore").textContent = Number(scores.total).toFixed(1);
  document.querySelector("#decisionLabel").textContent = evidenceBalance(scores);
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
          <p>${reasons[key] || meta.detail}</p>
          <a href="#evidenceTable">원본 근거 보기 ↓</a>
        </article>
      `;
    })
    .join("");
}

function updateScenarioSelection(scenarioId) {
  const support = state.result?.decisionSupport;
  if (!support) return;
  const scenario =
    support.scenarios.find((item) => item.id === scenarioId) || support.scenarios[0];
  state.selectedScenarioId = scenario.id;

  document.querySelectorAll("[data-scenario-id]").forEach((item) => {
    item.classList.toggle("active", item.dataset.scenarioId === scenario.id);
  });
  document.querySelector("#projectedScore").textContent = scenario.scores.total.toFixed(1);
  const delta = Math.round((scenario.scores.total - state.result.scores.total) * 10) / 10;
  document.querySelector("#projectionDelta").textContent =
    scenario.id === "current"
      ? "현재 기준점"
      : `현재 대비 ${delta >= 0 ? "+" : ""}${delta.toFixed(1)}점`;
}

function renderPositioning(support) {
  document.querySelector("#positioningDiagnosis").textContent = support.diagnosis;
  document.querySelector("#pivotDiagnosis").textContent = support.diagnosis;
  document.querySelector("#pivotRationale").textContent = support.rationale;
  document.querySelector("#pivotAction").textContent = support.action;

  document.querySelector("#matrixPoints").innerHTML = support.scenarios
    .map((scenario) => {
      const left = Math.max(7, Math.min(93, 100 - scenario.competition));
      const top = Math.max(8, Math.min(92, 100 - scenario.growth));
      return `
        <button
          class="matrix-point ${scenario.id === "current" ? "current" : ""}"
          style="--point-left:${left}%;--point-top:${top}%"
          data-scenario-id="${scenario.id}"
          type="button"
          aria-label="${scenario.label}, 성장성 ${scenario.growth}, 경쟁밀도 ${scenario.competition}"
        >
          <span></span>
          <strong>${scenario.label}</strong>
        </button>
      `;
    })
    .join("");

  document.querySelector("#scenarioButtons").innerHTML = support.scenarios
    .map(
      (scenario) => `
        <button type="button" data-scenario-id="${scenario.id}">
          <span>${scenario.category}</span>
          <strong>${scenario.scores.total.toFixed(1)}</strong>
        </button>
      `
    )
    .join("");

  updateScenarioSelection("current");
}

function renderPatentTrend(trend) {
  const width = 520;
  const height = 190;
  const padding = { top: 22, right: 20, bottom: 35, left: 28 };
  const maxValue = Math.max(1, ...trend.map((item) => item.value));
  const xStep = (width - padding.left - padding.right) / Math.max(1, trend.length - 1);
  const yScale = (height - padding.top - padding.bottom) / maxValue;
  const points = trend.map((item, index) => ({
    ...item,
    x: padding.left + xStep * index,
    y: height - padding.bottom - item.value * yScale
  }));
  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");
  const first = trend[0]?.value || 0;
  const last = trend[trend.length - 1]?.value || 0;
  const trendLabel = last > first ? "출원 증가 추이" : last < first ? "출원 감소 추이" : "출원 보합";

  document.querySelector("#patentTrendSignal").textContent = trendLabel;
  document.querySelector("#patentTrendAction").textContent =
    last > first
      ? "최근 출원이 증가하고 있습니다. 제품 확정 전에 선행기술 조사를 앞당기세요."
      : "출원 건수는 안정적이지만 핵심 청구항 중첩 여부는 별도로 확인하세요.";
  document.querySelector("#patentChart").innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="최근 5년 유사 특허 출원 추이">
      <line x1="${padding.left}" y1="${height - padding.bottom}" x2="${width - padding.right}" y2="${height - padding.bottom}" class="chart-axis" />
      <polyline points="${polyline}" class="chart-line" />
      ${points
        .map(
          (point) => `
            <circle cx="${point.x}" cy="${point.y}" r="5" class="chart-dot" />
            <text x="${point.x}" y="${point.y - 12}" text-anchor="middle" class="chart-value">${point.value}</text>
            <text x="${point.x}" y="${height - 12}" text-anchor="middle" class="chart-year">${point.year}</text>
          `
        )
        .join("")}
    </svg>
  `;
}

function calculateWeightedScore() {
  if (!state.result) return;
  const entries = Object.entries(state.weights);
  const totalWeight = entries.reduce((sum, [, value]) => sum + value, 0);
  const weighted =
    totalWeight > 0
      ? entries.reduce((sum, [key, value]) => sum + state.result.scores[key] * value, 0) /
        totalWeight
      : 0;
  const cappedScore = Math.min(weighted, state.result.scores.appliedCap || 100);
  document.querySelector("#simulatedScore").textContent = cappedScore.toFixed(1);
  document.querySelector("#weightTotal").textContent =
    totalWeight === 100
      ? state.result.scores.appliedCap
        ? `가중치 합계 100% · 상한 ${state.result.scores.appliedCap}점 유지`
        : "가중치 합계 100%"
      : `가중치 합계 ${totalWeight}% · 자동 정규화${state.result.scores.appliedCap ? ` · 상한 ${state.result.scores.appliedCap}점` : ""}`;
}

function renderWeightSliders() {
  document.querySelector("#weightSliders").innerHTML = Object.entries(axisMeta)
    .map(
      ([key, meta]) => `
        <label class="weight-slider">
          <span><strong>${meta.label}</strong><b id="weightValue-${key}">${state.weights[key]}%</b></span>
          <input
            type="range"
            min="0"
            max="60"
            step="5"
            value="${state.weights[key]}"
            data-weight-key="${key}"
            aria-label="${meta.label} 가중치"
          />
        </label>
      `
    )
    .join("");
  calculateWeightedScore();
}

function applyWeightPreset(presetName) {
  state.weights = { ...(weightPresets[presetName] || weightPresets.default) };
  renderWeightSliders();
  document.querySelectorAll("[data-weight-preset]").forEach((button) => {
    button.classList.toggle("active", button.dataset.weightPreset === presetName);
  });
}

function renderRegulation(checklist, freshness) {
  const statusLabels = {
    pass: "확인",
    review: "검토 필요",
    needed: "자료 필요"
  };

  document.querySelector("#regulationList").innerHTML = checklist
    .map(
      (item) => `
        <div class="regulation-row">
          <span class="regulation-status ${item.status}">${statusLabels[item.status]}</span>
          <div><span>${item.item}</span><strong>${item.value}</strong></div>
          <p>${item.action}</p>
        </div>
      `
    )
    .join("");
  document.querySelector("#freshnessBadges").innerHTML = freshness
    .map(
      (item) => `
        <span title="${item.source} ${item.label}">
          ${item.source} <strong>${item.updatedAt}</strong>
        </span>
      `
    )
    .join("");
}

function renderClassification(result) {
  const { classification, extraction, validation, recommendations, scores } = result;
  const ingredientLabel = extraction.standardIngredient
    ? extraction.rawIngredient &&
      extraction.rawIngredient !== extraction.standardIngredient
      ? `${extraction.standardIngredient} (입력: ${extraction.rawIngredient})`
      : extraction.standardIngredient
    : extraction.ingredient
      ? `${extraction.ingredient} (원문 보존)`
      : "Gemini 재분석 필요";
  document.querySelector("#resultIngredient").textContent = ingredientLabel;
  document.querySelector("#resultIngredientCategory").textContent = classification.ingredientCategory;
  document.querySelector("#resultBioType").textContent = classification.bioType;
  document.querySelector("#resultCategories").textContent = joinOrFallback(extraction.categories);
  document.querySelector("#resultProductForm").textContent = classification.productForm;
  document.querySelector("#resultFunctions").textContent = joinOrFallback(
    classification.functionCandidates,
    "기능 후보 확인 필요"
  );
  document.querySelector("#logicalFitLabel").textContent = classification.logicalFit.label;
  document.querySelector("#logicalFitScore").textContent = `${classification.logicalFit.score} / 100`;
  document.querySelector("#logicalFitReason").textContent =
    [
      classification.mappingReason
        ? `Gemini 매핑: ${classification.mappingReason}`
        : "",
      ...classification.logicalFit.reasons
    ]
      .filter(Boolean)
      .join(" ");
  document.querySelector("#deductionList").innerHTML = scores.deductions.length
    ? scores.deductions.map((item) => `<li>${item}</li>`).join("")
    : "<li>적용된 감점 없음</li>";
  document.querySelector("#validationRequired").textContent = validation.required
    ? "추가 검증 필요"
    : "기본 검증 충족";
  document.querySelector("#validationList").innerHTML = validation.items
    .map((item) => `<li>${item}</li>`)
    .join("");
  document.querySelector("#recommendationList").innerHTML = recommendations
    .map((item) => `<li>${item}</li>`)
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
    `${new Date(result.generatedAt).toLocaleString("ko-KR")} 분석 완료 · ${result.providers?.keywordExtractor || "규칙 기반 폴백"}`;
  document.querySelector("#explanationProvider").textContent =
    result.providers?.resultExplainer || "근거 기반 폴백";

  state.selectedScenarioId = "current";
  renderClassification(result);
  renderScores(result.scores, result.scoreReasons);
  renderPositioning(result.decisionSupport);
  renderPatentTrend(result.decisionSupport.patentTrend);
  applyWeightPreset("default");
  renderExplanation(result.explanation);
  renderEvidence(result.evidence.records);
  renderRegulation(result.regulatoryChecklist, result.dataFreshness);
  renderFormulas(result.formulas);
  navigate("result");
}

async function startAnalysis({ idea, extraction = null, preferredCategory = null }) {
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
      body: JSON.stringify({ idea: fallbackIdea, extraction, preferredCategory })
    });
    if (!response.ok) throw new Error(`API ${response.status}`);
    const result = await response.json();
    await new Promise((resolve) => window.setTimeout(resolve, 1250));
    elements.analysisDialog.close();
    renderResult(result);
  } catch (error) {
    const fallback = analyzeIdea(fallbackIdea, preferredCategory);
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
elements.categorySelect.addEventListener("change", updatePreview);
elements.ideaForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const idea = elements.ideaInput.value.trim();
  const preferredCategory = elements.categorySelect.value;
  if (!preferredCategory) {
    showToast("분석할 제품군을 먼저 선택해주세요.");
    elements.categorySelect.focus();
    return;
  }
  if (idea.length < 8) {
    showToast("아이디어를 조금 더 구체적으로 적어주세요.");
    elements.ideaInput.focus();
    return;
  }
  startAnalysis({ idea, preferredCategory });
});

document.querySelectorAll("[data-example]").forEach((button) => {
  button.addEventListener("click", () => {
    elements.ideaInput.value = button.dataset.example;
    elements.categorySelect.value = button.dataset.category || "";
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
document.querySelector("#positioningMatrix").addEventListener("click", (event) => {
  const point = event.target.closest("[data-scenario-id]");
  if (point) updateScenarioSelection(point.dataset.scenarioId);
});
document.querySelector("#scenarioButtons").addEventListener("click", (event) => {
  const button = event.target.closest("[data-scenario-id]");
  if (button) updateScenarioSelection(button.dataset.scenarioId);
});
document.querySelector("#weightSliders").addEventListener("input", (event) => {
  const slider = event.target.closest("[data-weight-key]");
  if (!slider) return;
  const key = slider.dataset.weightKey;
  state.weights[key] = Number(slider.value);
  document.querySelector(`#weightValue-${key}`).textContent = `${slider.value}%`;
  document.querySelectorAll("[data-weight-preset]").forEach((button) => {
    button.classList.remove("active");
  });
  calculateWeightedScore();
});
document.querySelector("#resetWeights").addEventListener("click", () => {
  applyWeightPreset("default");
});
document.querySelector("#weightPresets").addEventListener("click", (event) => {
  const button = event.target.closest("[data-weight-preset]");
  if (button) applyWeightPreset(button.dataset.weightPreset);
});
document.querySelector("#shareButton").addEventListener("click", async () => {
  if (!state.result) return;
  const result = state.result;
  const text = [
    result.idea,
    `원료 분류: ${result.classification.ingredientCategory} / ${result.classification.bioType}`,
    `제품군: ${joinOrFallback(result.extraction.categories)} / 적합성 ${result.classification.logicalFit.label} ${result.classification.logicalFit.score}점`,
    `종합점수 ${result.scores.total}`,
    ...Object.entries(axisMeta).map(([key, meta]) => `${meta.label} ${result.scores[key]}점`),
    ...(result.scores.deductions.length
      ? result.scores.deductions.map((item) => `감점: ${item}`)
      : ["감점: 없음"]),
    result.explanation.summary
  ].join("\n");

  try {
    await navigator.clipboard.writeText(text);
    showToast("분석 결과를 복사했습니다.");
  } catch {
    showToast("브라우저에서 복사를 허용하지 않았습니다.");
  }
});

renderCategoryOptions();
renderIdeas();
updatePreview();
