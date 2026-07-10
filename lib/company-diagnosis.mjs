function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function assessCompanyProfile(profile = {}) {
  const factors = {
    operatingHistory:
      profile.companyStage === "established"
        ? 18
        : profile.companyStage === "early"
          ? 12
          : 6,
    ingredientReadiness:
      profile.hasIngredient === "secured"
        ? 22
        : profile.hasIngredient === "candidate"
          ? 12
          : 3,
    intellectualProperty: Math.min(20, number(profile.patentCount) * 8),
    rndExperience:
      profile.rndExperience === "government"
        ? 25
        : profile.rndExperience === "internal"
          ? 15
          : 3,
    marketEvidence:
      profile.marketResearch === "interview"
        ? 15
        : profile.marketResearch === "desk"
          ? 8
          : 2
  };
  const readiness = Object.values(factors).reduce((sum, value) => sum + value, 0);

  if (readiness < 40) {
    return {
      stage: "R&D 시작 준비",
      readiness,
      summary: "아이디어보다 먼저 원료 후보와 고객 문제를 좁히는 단계입니다.",
      actions: [
        "보유하거나 접근 가능한 제주 원료 후보 1~2개 확정",
        "원료로 해결할 고객 문제와 제품군을 한 문장으로 정의",
        "대학·연구기관 또는 지원기관과 기초 효능 검증 범위 상담"
      ],
      applicationGuidance: "정부 R&D 신청서 작성보다 원료·고객 문제의 기초 검증이 우선입니다."
    };
  }

  if (readiness < 70) {
    return {
      stage: "근거 구축",
      readiness,
      summary: "R&D 아이디어는 있으나 논문·특허·시장·공급 근거를 채워야 하는 단계입니다.",
      actions: [
        "4축 분석에서 가장 약한 근거의 원문과 통계 확인",
        "고객 인터뷰와 경쟁제품 비교로 시장 가설 검증",
        "선행특허와 기초 시험 범위를 정리해 협력기관 상담"
      ],
      applicationGuidance: "지원사업 검토 전 4축 근거와 TRL 현재 단계를 문서화하세요."
    };
  }

  return {
    stage: "사업화 검토",
    readiness,
    summary: "기초 R&D 경험을 바탕으로 제품 조합의 시장성과 차별성을 비교할 단계입니다.",
    actions: [
      "적용처별 포지셔닝과 특허 청구항 중첩 비교",
      "공급계약·원가·인허가 경로를 포함한 사업화 가설 검증",
      "누락 근거를 보완한 뒤 지원기관 또는 전문가 정밀 검토"
    ],
    applicationGuidance: "4축 근거와 피벗 시나리오를 활용해 사업화 우선순위를 검토하세요."
  };
}
