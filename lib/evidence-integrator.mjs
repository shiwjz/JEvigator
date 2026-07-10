import { makeFallbackExplanation } from "./analyzer.mjs";

const clamp = (value, min = 0, max = 100) =>
  Math.round(Math.max(min, Math.min(max, value)));

const axisLabels = {
  technical: "기술성",
  market: "시장성",
  patentSafety: "특허안전성",
  supply: "공급안정성"
};

function recentPaperStats(paperEvidence) {
  const papers = paperEvidence.papers || [];
  const threshold = new Date().getFullYear() - 4;
  const years = papers.map((paper) => paper.year).filter(Number.isFinite);
  const sampledRecentCount = years.filter((year) => year >= threshold).length;
  return {
    recentCount: Number.isFinite(paperEvidence.recentTotalCount)
      ? paperEvidence.recentTotalCount
      : sampledRecentCount,
    sampledRecentCount,
    latestYear: years.length ? Math.max(...years) : null
  };
}

function technicalScore(result, papers) {
  const stats = recentPaperStats(papers);
  const hasLiveResults = papers.source !== "Fallback" && papers.totalCount > 0;
  const volume = hasLiveResults
    ? Math.min(90, 32 + Math.log10(papers.totalCount + 1) * 16)
    : papers.totalCount
      ? 48
      : 30;
  const recentRatio = Math.min(
    1,
    stats.recentCount / Math.max(1, papers.totalCount || papers.papers?.length || 0)
  );
  const literature = clamp(volume * 0.72 + (45 + recentRatio * 45) * 0.28);

  const hasFunction = result.extraction.functions.length > 0;
  const fit = result.classification.logicalFit.score;
  const maturity = clamp(42 + (hasFunction ? 16 : 0) + (hasLiveResults ? 10 : 0) + fit * 0.12);
  const standardProcessGroups = ["plant", "marine", "livestock", "bee", "fungi", "microbial"];
  const reproducibility = clamp(
    45 +
      (standardProcessGroups.includes(result.classification.ingredientGroup) ? 18 : 7) +
      (hasFunction ? 8 : 0) +
      fit * 0.1
  );
  const score = clamp(literature * 0.4 + maturity * 0.3 + reproducibility * 0.3);

  return { score, literature, maturity, reproducibility, ...stats };
}

function confirmedSources(external) {
  const confirmations = [];
  if (
    external.papers.source !== "Fallback" &&
    external.papers.status === "확인" &&
    external.papers.totalCount > 0
  ) {
    confirmations.push(external.papers.source);
  }
  if (external.csv.supply?.directness === "direct") {
    confirmations.push("제주 공공데이터 CSV");
  }
  if (
    external.csv.sources?.some(
      (source) => source.id === "seaweed-ecology" && source.status === "확인"
    )
  ) {
    confirmations.push("제주 해조류 생태 CSV");
  }
  if (external.mfds.matched) confirmations.push("식약처 원료성분정보");
  if (external.serp?.status === "확인" && external.serp.totalResults > 0) {
    confirmations.push("SERP 시장·특허 트렌드");
  }
  return [...new Set(confirmations)];
}

function recalculateDecisionSupport(result, scores) {
  const currentTotal = result.scores.total;
  const scenarios = result.decisionSupport.scenarios.map((scenario) => {
    const market =
      scenario.id === "current"
        ? scores.market
        : Math.max(0, Math.min(100, scenario.scores.market + (scores.market - result.scores.market)));
    const technical = scores.technical;
    const patentSafety = scenario.scores.patentSafety;
    const supply = scores.supply;
    const projected = Math.round(
      (technical * 0.3 +
        market * 0.25 +
        patentSafety * 0.2 +
        supply * 0.2 +
        result.classification.logicalFit.score * 0.05) *
        10
    ) / 10;
    return {
      ...scenario,
      scores: {
        technical,
        market,
        patentSafety,
        supply,
        total: scenario.id === "current" ? scores.total : projected
      }
    };
  });
  const best = [...scenarios].sort((a, b) => b.scores.total - a.scores.total)[0];
  return {
    ...result.decisionSupport,
    scenarios,
    action:
      best.id === "current"
        ? "현재 적용처의 추출공정·배합·효능 타깃을 더 구체화해 비교 근거를 보강하세요."
        : `${best.category} 적용처는 현재 조합보다 ${Math.max(
            0,
            best.scores.total - scores.total
          ).toFixed(1)}점 높은 비교 시나리오입니다. 실제 규제와 수요를 추가 확인하세요.`,
    recommendedScenarioId: best.id,
    previousTotal: currentTotal
  };
}

function makeCopilot(result, external, scores) {
  const [weakestKey, weakestScore] = Object.entries({
    technical: scores.technical,
    market: scores.market,
    patentSafety: scores.patentSafety,
    supply: scores.supply
  }).sort((a, b) => a[1] - b[1])[0];

  const details = {
    technical: {
      cause:
        external.papers.source === "Fallback"
          ? "실시간 논문 검색이 연결되지 않아 효능 입증 수준과 최근 연구 흐름을 확인할 근거가 제한적입니다."
          : `논문 메타데이터는 확인됐지만, 인체적용시험 여부와 추출공정 재현성은 원문 검토가 필요합니다.`,
      actions: [
        "대표 논문 3건의 시험 단계와 원료 규격을 원문에서 확인",
        "추출·정제 공정을 표준 공정과 특수설비 공정으로 구분",
        "대학·연구기관과 효능 검증 범위 협의"
      ],
      duration: "문헌 검토 1~2주, 기초 시험 설계 4~8주"
    },
    market: {
      cause: "제품군 성장 가능성과 별개로 유사 콘셉트와 판매 채널의 실제 수요 근거가 아직 충분하지 않습니다.",
      actions: [
        "타깃 고객 10곳 인터뷰로 구매 기준과 가격대 확인",
        "유사 제품의 기능·제형·가격 비교표 작성",
        "현재 원료를 유지한 인접 적용처의 경쟁밀도 비교"
      ],
      duration: "고객 인터뷰와 경쟁제품 조사 2~4주"
    },
    patentSafety: {
      cause: "현재 특허 축은 KIPRIS 시연 캐시 기반이며 대표 청구항의 실질 중첩 여부를 확정할 수 없습니다.",
      actions: [
        "원료명+기능+제품군 조합으로 KIPRIS 검색식 확장",
        "상위 유사특허의 독립항을 공정·조성·용도로 분해",
        "변리사 1차 스크리닝과 공정 차별화 검토 병행"
      ],
      duration: "선행기술 정리 1~2주, 차별화·변리 검토 약 2~3개월"
    },
    supply: {
      cause: external.csv.supply
        ? `${external.csv.supply.description}. 다만 원료로 실제 회수 가능한 수율과 계약 물량은 별도 확인이 필요합니다.`
        : "현재 업로드된 제주 통계에서 이 원료와 직접 연결되는 생산·회수량 자료를 찾지 못했습니다.",
      actions: [
        "원료 공급처 3곳에서 월별 회수 가능량 확인",
        "건조·보관 손실과 추출 수율을 반영한 필요 원물량 계산",
        "계절 편차를 반영한 최소 재고와 공급계약 조건 설계"
      ],
      duration: "공급처 확인과 샘플 수율 검증 3~6주"
    }
  };

  return {
    bottleneck: axisLabels[weakestKey],
    score: weakestScore,
    ...details[weakestKey],
    notice: "AI 코파일럿은 다음 검토 순서를 정리하며 개발 여부를 결정하지 않습니다."
  };
}

function updateRegulation(result, external) {
  const category = result.extraction.categories[0] || "제품군 미지정";
  const mfds = external.mfds;
  if (category === "기능성 식품/음료") {
    return [
      {
        item: "국내 식품원료 사용 가능 여부",
        value: "추가 확인 필요",
        status: "needed",
        action: "식품안전나라 원료 목록과 해조류 종별 식용 가능 범위 대조"
      },
      {
        item: "식품첨가물·착색료 분류",
        value: "제품 배합 전 분류 필요",
        status: "needed",
        action: "색소 추출물의 식품첨가물 해당 여부와 사용기준 확인"
      },
      {
        item: "기능성 표시·광고",
        value: "일반식품 표현 범위 검토",
        status: "review",
        action: "건강기능식품 오인 표현 없이 표시·광고 문구 설계"
      },
      {
        item: "해외 천연 식용색소 규격",
        value: external.csv.regulatoryReference
          ? "김색소·녹조류 클로로필 수록"
          : "참고자료 미연결",
        status: "review",
        action: external.csv.regulatoryReference
          ? "대만 규격 보조자료이며 대한민국 인허가 확인을 대체하지 않음"
          : "해외 규격 참고자료 추가"
      }
    ];
  }
  if (category === "건강기능식품") {
    return [
      {
        item: "기능성 원료 인정 여부",
        value: "추가 확인 필요",
        status: "needed",
        action: "고시형 또는 개별인정형 원료 해당 여부 검토"
      },
      {
        item: "안전성·일일섭취량",
        value: "원료 규격 확정 후 검토",
        status: "review",
        action: "중금속·미생물·섭취량 자료 확보"
      },
      {
        item: "기능성 표시·광고",
        value: "인정 기능 범위 내 표현 필요",
        status: "review",
        action: "인체적용시험 및 기능성 인정 문구 대조"
      }
    ];
  }
  if (category === "친환경 소재/바이오 플라스틱") {
    return [
      {
        item: "산업·환경소재 적용 기준",
        value: "용도별 별도 검토",
        status: "review",
        action: "식품접촉재·포장재·수처리 용도에 따른 시험기준 구분"
      },
      {
        item: "유해물질·용출 시험",
        value: "시제품 규격 확정 후 시험",
        status: "needed",
        action: "최종 적용처 기준으로 안전성 시험 설계"
      }
    ];
  }
  if (category !== "화장품") {
    return [
      {
        item: "적용 규제 체계",
        value: `${category} 별도 규제 검토`,
        status: "review",
        action: "화장품 원료 API 비대상"
      },
      {
        item: "식약처 화장품 원료성분 DB",
        value: "비대상",
        status: "review",
        action: "제품군별 원료 인정·안전 기준 확인"
      },
      {
        item: "사용제한 원료정보",
        value: "별도 API 추가 연동 예정",
        status: "review",
        action: "사업화 전 전문 검토 필요"
      }
    ];
  }

  return [
    {
      item: "식약처 표준 원료명",
      value: mfds.item?.name || "직접 일치 항목 미확인",
      status: mfds.matched ? "pass" : "needed",
      action: mfds.detail
    },
    {
      item: "CAS No.",
      value: mfds.item?.casNo || "추가 확인 필요",
      status: mfds.item?.casNo ? "pass" : "review",
      action: "혼합물·추출물 규격서와 대조"
    },
    {
      item: "사용제한·배합금지 원료정보",
      value: "제품 처방 확정 전 최종 대조 필요",
      status: "review",
      action: "화장품 안전기준 등에 관한 규정의 사용금지·사용제한 성분과 추출물 잔류용매 기준 확인"
    },
    {
      item: "기능성 화장품 해당성",
      value: "항산화 표현은 일반 효능/브랜딩 중심 검토",
      status: "review",
      action: "미백·주름개선·자외선차단 등 법정 기능성 표현으로 확장할 경우 기능성 심사/보고 경로 별도 검토"
    },
    {
      item: "표시·광고 클레임 리스크",
      value: "피부 개선·항산화 표현 수위 관리 필요",
      status: "needed",
      action: "질병 치료·세포 재생·의학적 효능처럼 오인될 수 있는 문구를 배제하고 인체적용/시험 근거 수준별 표현 가이드 작성"
    },
    {
      item: "원료 규격서·안전성 패키지",
      value: "MVP 전 필수 데이터룸",
      status: "needed",
      action: "INCI/국문 성분명, 추출용매, 함량 지표성분, 중금속·미생물·잔류농약·피부자극 시험 계획을 공급처 자료와 함께 확보"
    },
    {
      item: "국내외 제품화 경로",
      value: "국내 화장품 우선, 해외는 국가별 별도 검토",
      status: "review",
      action: "국내 책임판매업/제조업 구조를 먼저 설계하고 일본·미국·EU 수출 시 성분명, CPNP/MoCRA 등 현지 요건을 분리 검토"
    }
  ];
}

function scoreBand(score) {
  if (score >= 80) return { label: "우수", tone: "strong" };
  if (score >= 70) return { label: "양호", tone: "positive" };
  if (score >= 60) return { label: "검토", tone: "watch" };
  return { label: "보완", tone: "risk" };
}

function makeMarketPosition(result, scores) {
  const entryEase = clamp(scores.market * 0.62 + scores.supply * 0.38);
  const patentCompetition = clamp(100 - scores.patentSafety);
  const patentRecord = result.evidence.records.find(
    (record) => record.axis === "특허안전성"
  );
  const patentIsFallback = /캐시|프록시/.test(patentRecord?.status || "");
  let label = "준레드오션";
  if (entryEase < 58) label = "장기 R&D형";
  else if (entryEase >= 72 && patentCompetition < 35) label = "블루오션 후보";
  else if (entryEase >= 66 && patentCompetition < 52) label = "준블루오션";
  else if (patentCompetition >= 70) label = "레드오션";
  if (label === "블루오션 후보" && patentIsFallback) label = "준블루오션";

  const description =
    label === "블루오션 후보"
      ? "시장 진입 여건과 공급 기반이 비교적 양호하고 특허 경쟁은 낮은 편입니다. 초기 고객 검증이 핵심입니다."
      : label === "준블루오션"
        ? patentIsFallback
          ? "시장 진입성은 양호하고 특허 경쟁 신호는 낮지만, 현재 특허 데이터가 시연 캐시이므로 블루오션 확정 전 KIPRIS 원문 검증이 필요합니다."
          : "진입 가능성은 양호하나 일부 선행 권리가 존재합니다. 제품 규격과 채널을 좁히면 차별화 여지가 있습니다."
        : label === "장기 R&D형"
          ? "시장 진입 전에 효능·공정·규제 근거를 더 축적해야 하는 장기 검증형 포지션입니다."
          : label === "레드오션"
            ? "시장 관심과 출원 밀도가 모두 높아 공정·조성·표적 고객 중 하나 이상의 명확한 차별화가 필요합니다."
            : "시장 진입성은 확보되어 있으나 관련 출원이 일부 존재해, 선행기술과 제품 콘셉트의 차별화가 필요한 포지션입니다.";

  return { entryEase, patentCompetition, label, description };
}

function makeCommercialIntelligence(result, external, scores, decisionSupport) {
  const ingredient = result.extraction.ingredient || "선택 원료";
  const category = result.extraction.categories[0] || "제품군 미지정";
  const isCitrus = /감귤|풋귤/.test(ingredient);
  const isSeaweed = /해조류|김|감태|모자반|톳|다시마|미역|파래|곰피/.test(
    ingredient
  );
  const marketPosition = makeMarketPosition(result, scores);
  const regulatoryScore =
    category === "화장품"
      ? external.mfds.matched
        ? 84
        : 58
      : external.csv.regulatoryReference
        ? 64
        : 55;
  const locality = isCitrus
    ? external.csv.supply?.directness === "direct"
      ? 92
      : 78
    : isSeaweed
      ? external.csv.sources?.some(
          (source) => source.id === "seaweed-ecology" && source.status === "확인"
        )
        ? 89
        : 74
      : 66;
  const esg = /부산물/.test(ingredient) ? 94 : isSeaweed ? 78 : 64;
  const productization = clamp(
    scores.technical * 0.45 + marketPosition.entryEase * 0.35 + regulatoryScore * 0.2
  );
  const differentiationAxes = [
    {
      key: "locality",
      label: "지역 원료 차별성",
      score: locality,
      detail: isCitrus
        ? "제주 감귤 생산·가공 통계로 원산지와 순환자원 서사를 수치화할 수 있습니다."
        : isSeaweed
          ? "제주 43개 마을어장 정점의 생태 관측으로 지역 자원성을 설명할 수 있습니다."
          : "지역 원료의 생산지·공급망 증빙을 추가하면 차별성이 강화됩니다."
    },
    {
      key: "evidence",
      label: "기능성 근거 차별성",
      score: scores.technical,
      detail: `${external.papers.source} 논문 검색과 기능 키워드 적합성을 기반으로 산출했습니다.`
    },
    {
      key: "esg",
      label: "ESG·업사이클링 스토리",
      score: esg,
      detail: /부산물/.test(ingredient)
        ? "폐기·저활용 부산물을 고부가 원료로 전환하는 순환경제 서사가 명확합니다."
        : "지역 생물자원의 지속가능한 조달과 생태 모니터링을 사업 스토리로 연결할 수 있습니다."
    },
    {
      key: "productization",
      label: "제품화 가능성",
      score: productization,
      detail: "기술성, 시장 진입성, 규제 준비도의 복합 지표입니다."
    },
    {
      key: "entry",
      label: "초기 시장 진입성",
      score: marketPosition.entryEase,
      detail: "제품군 시장성 및 공급 기반을 결합한 초기 진입 지표입니다."
    }
  ];
  const brandAxes = [
    { label: "지역성", score: locality },
    { label: "기능성 근거", score: scores.technical },
    { label: "시장 진입성", score: marketPosition.entryEase },
    { label: "규제 안정성", score: regulatoryScore }
  ];
  const differentiationSummary = differentiationAxes.slice(0, 4).map((axis) => ({
    ...axis,
    status: scoreBand(axis.score).label
  }));
  const grade =
    scores.total >= 85
      ? "A"
      : scores.total >= 78
        ? "B+"
        : scores.total >= 68
          ? "B"
          : scores.total >= 58
            ? "C+"
            : "C";
  const recommendedScenario =
    decisionSupport.scenarios.find(
      (scenario) => scenario.id === decisionSupport.recommendedScenarioId
    ) || decisionSupport.scenarios[0];

  const comparisonTypes =
    category === "화장품"
      ? ["일반 항산화 화장품", "비건·클린뷰티 브랜드", "고기능성 화장품", "원료 B2B 소재"]
      : ["일반 기능성 스낵", "클린라벨 식품", "천연 색소 원료 B2B", "기능성 음료형"];
  const brandComparisons = comparisonTypes.map((type, index) => ({
    type,
    commonality:
      index === 0
        ? "소비자가 이해하기 쉬운 기능 효익을 전면에 제시"
        : "천연 원료와 기능성 스토리를 제품 가치로 활용",
    difference:
      isCitrus
        ? "제주 감귤 부산물의 생산·가공 통계를 원료 서사와 연결"
        : "제주 해조류 생태 관측과 천연 색소 기능을 동시에 연결",
    advantage:
      index >= 2
        ? "소비재와 B2B 원료 사업을 병행할 수 있는 확장성"
        : "지역성·기능성·지속가능성을 하나의 제품 내러티브로 통합",
    gap:
      index === 0
        ? "가격 수용성과 반복구매 의향 검증"
        : index === 2
          ? "원료 규격서·색가·안정성·최소주문수량 확정"
          : "표시·광고와 선행특허 정밀 검토"
  }));

  const alternatives = isCitrus
    ? [
        {
          name: "제주 감귤 껍질 항산화 세럼",
          advantage: "기능 전달이 직관적이고 기존 화장품 공정을 활용하기 쉬움",
          risk: "항산화 화장품 경쟁과 유사 특허 밀도가 높음",
          delta: 2.1,
          situation: "빠른 소비자 테스트가 필요할 때"
        },
        {
          name: "감귤박 바이오 플라스틱 포장재",
          advantage: "업사이클링 서사와 B2B 공급계약 가능성",
          risk: "물성·용출·양산 원가 검증 필요",
          delta: 0.8,
          situation: "ESG 조달 수요를 공략할 때"
        },
        {
          name: "감귤 추출물 원료 B2B 공급",
          advantage: "다수 브랜드로 확장 가능한 반복 매출 구조",
          risk: "표준화 규격과 효능 데이터 패키지 필요",
          delta: 3.4,
          situation: "자체 브랜드보다 원료 사업 역량이 강할 때"
        }
      ]
    : isSeaweed
      ? [
          {
            name: "제주 해조류 천연 색소 스낵",
            advantage: "시각적 차별성과 제주 로컬푸드 서사가 명확",
            risk: "가열·광·pH에 따른 색 안정성 검증 필요",
            delta: 1.6,
            situation: "관광·로컬 편집숍에서 빠르게 테스트할 때"
          },
          {
            name: "해조류 색소 원료 B2B 공급",
            advantage: "스낵·음료·소스 제조사로 고객군 확장 가능",
            risk: "색가, 중금속, 미생물, 배치 편차 규격화 필요",
            delta: 3.1,
            situation: "추출·표준화 기술을 핵심 역량으로 삼을 때"
          },
          {
            name: "제주 해조류 기능성 음료",
            advantage: "간편 섭취와 관광 기념품 채널 확장",
            risk: "풍미 마스킹과 침전 안정성 보완 필요",
            delta: -0.9,
            situation: "액상 제조 파트너와 유통 채널이 있을 때"
          }
        ]
      : decisionSupport.scenarios.slice(0, 3).map((scenario) => ({
          name: `${ingredient} 기반 ${scenario.category}`,
          advantage: "동일 원료와 핵심 공정을 재사용할 수 있음",
          risk: "제품군별 규제와 고객 수요 재검증 필요",
          delta: Math.round((scenario.scores.total - scores.total) * 10) / 10,
          situation: "현재 적용처의 경쟁밀도가 높을 때"
        }));

  const axisDetails = Object.entries(axisLabels).map(([key, label]) => {
    const score = scores[key];
    const record = result.evidence.records.find((item) => item.axis === label);
    return {
      key,
      label,
      score,
      status: scoreBand(score).label,
      reason:
        key === "technical"
          ? `${external.papers.totalCount.toLocaleString("ko-KR")}건의 논문 검색 결과와 최근 연구 비중, 기능 적합성을 종합했습니다.`
          : key === "market"
            ? "제품군 성장성, 경쟁밀도, 판매 채널 보조 신호를 종합했습니다."
            : key === "patentSafety"
              ? "유사·최근 특허 캐시를 기반으로 하며 청구항 정밀 검토가 필요합니다."
              : external.csv.supply?.description ||
                "원료 생산량과 회수 가능량의 직접 통계가 추가로 필요합니다.",
      data: record
        ? `${record.source} · ${record.value}`
        : "현재 연결된 근거 없음",
      gap:
        key === "technical"
          ? "대표 논문의 시험 단계와 원료 규격 원문 확인"
          : key === "market"
            ? "타깃 고객 인터뷰와 가격 수용성 검증"
            : key === "patentSafety"
              ? "KIPRIS 실시간 검색과 독립항 중첩 검토"
              : "월별 회수량·추출수율·공급계약 확인"
    };
  });

  return {
    readiness: {
      score: scores.total,
      grade,
      businessPosition: marketPosition.label,
      recommendedCategory: recommendedScenario.category,
      bioType: result.classification.bioType
    },
    decomposition: {
      original: result.idea,
      ingredient,
      functions: result.extraction.functions,
      category
    },
    marketPosition,
    differentiationSummary,
    differentiationAxes,
    brandAxes,
    brandComparisons,
    axisDetails,
    alternatives: alternatives.map((item) => ({
      ...item,
      estimatedScore: Math.max(
        0,
        Math.min(100, Math.round((scores.total + item.delta) * 10) / 10)
      )
    })),
    startupPath: [
      {
        phase: "0-4주",
        title: "Evidence Lock",
        action: "대표 논문·규제·원료 공급처를 확정하고 핵심 가설을 한 장으로 정리"
      },
      {
        phase: "1-3개월",
        title: "Prototype Validation",
        action: "시제품의 효능·색 안정성·원가·고객 반응을 최소 단위로 검증"
      },
      {
        phase: "3-6개월",
        title: "Go-to-Market Pilot",
        action: "제주 로컬 채널 또는 B2B 파트너와 소규모 판매·공급 계약을 시험"
      }
    ],
    entryStrategy: decisionSupport.action
  };
}

export function enrichWithExternalEvidence(result, external) {
  const tech = technicalScore(result, external.papers);
  const market = clamp(result.scores.market + (external.csv.market?.scoreAdjustment || 0));
  const supply = external.csv.supply?.score ?? result.scores.supply;
  const scores = {
    ...result.scores,
    technical: tech.score,
    market,
    supply
  };
  const rawTotal = Math.round(
    (scores.technical * 0.3 +
      scores.market * 0.25 +
      scores.patentSafety * 0.2 +
      scores.supply * 0.2 +
      result.classification.logicalFit.score * 0.05) *
      10
  ) / 10;

  const deductions = result.scores.deductions.filter(
    (item) =>
      !item.includes("실데이터 미연동") &&
      !item.includes("검색·기능 근거 부족") &&
      !item.includes("논문·공공데이터 근거")
  );
  const caps = [];
  if (!result.extraction.functions.length) caps.push(60);
  if (!result.extraction.categories.length) caps.push(65);
  if (!result.extraction.ingredient && !result.extraction.categories.length) caps.push(50);
  if (result.classification.logicalFit.contradictory) caps.push(55);

  const confirmations = confirmedSources(external);
  if (!confirmations.length) {
    caps.push(60);
    deductions.push("공공데이터·API·논문 직접 근거 부족: 종합점수 최대 60점");
  }

  const semanticConditions = [
    result.classification.ingredientGroup !== "unknown",
    result.extraction.categories.length > 0,
    result.extraction.functions.length > 0,
    result.classification.logicalFit.score >= 70
  ].filter(Boolean).length;
  if (rawTotal >= 80 && (semanticConditions < 4 || confirmations.length < 2)) {
    caps.push(79);
    deductions.push("80점 이상 조건 미충족: 명확한 분류 4개와 확인된 데이터 출처 2개 필요");
  }
  if (external.csv.supply?.directness === "support") {
    deductions.push(
      /해조류/.test(external.csv.supply.description)
        ? "해조류 생산·생태 통계는 지역성 및 공급 가능성의 보조 근거이며 실제 회수 가능량은 추가 검증 필요"
        : "축산 통계는 해당 원료 전용 자료가 아니므로 공급 보조 근거로만 반영"
    );
  }

  const appliedCap = caps.length ? Math.min(...caps) : null;
  scores.rawTotal = rawTotal;
  scores.appliedCap = appliedCap;
  scores.total = Math.min(rawTotal, appliedCap || 100);
  scores.deductions = [...new Set(deductions)];

  const paperStats = recentPaperStats(external.papers);
  const evidence = {
    ...result.evidence,
    isProxy: external.papers.source === "Fallback" && !external.csv.supply,
    proxyLabel:
      external.papers.source === "Fallback" ? "논문 API 캐시" : `${external.papers.source} 검색 결과`,
    paperCount: external.papers.totalCount,
    recentPaperCount: paperStats.recentCount,
    productionTons:
      external.csv.supply?.productionTons ||
      external.csv.supply?.productionAmount ||
      external.csv.supply?.totalHeads ||
      result.evidence.productionTons,
    productionVariation:
      external.csv.supply?.variation ?? result.evidence.productionVariation,
    productionStatus:
      external.csv.supply?.description || "직접 연결되는 제주 생산 통계 추가 확인 필요",
    mfdsName: external.mfds.item?.name || external.mfds.detail,
    casNo: external.mfds.item?.casNo || "추가 확인 필요",
    restriction: "사용제한 원료정보는 별도 API 추가 연동 및 전문가 검토 필요",
    records: [
      {
        axis: "기술성",
        source: external.papers.source,
        query: external.papers.query,
        value: `검색 ${external.papers.totalCount.toLocaleString("ko-KR")}건`,
        detail: `대표 결과 최근 ${paperStats.latestYear || "연도 미확인"}, 표본 최근 5년 ${paperStats.recentCount}건`,
        status: external.papers.status
      },
      {
        axis: "시장성",
        source: "방문판매업정보 CSV",
        query: result.extraction.categories[0] || "제품군 미지정",
        value: external.csv.market
          ? `정상 영업 ${external.csv.market.activeBusinesses.toLocaleString("ko-KR")}개소`
          : "직접 시장근거로 미사용",
        detail: external.csv.market?.description || "시장 직접 지표가 아닌 판매 채널 보조 자료",
        status: external.csv.market ? "보조 근거" : "비대상"
      },
      result.evidence.records.find((record) => record.axis === "특허안전성"),
      {
        axis: "공급안정성",
        source: external.csv.supply
          ? external.csv.supply.directness === "direct"
            ? "제주 감귤 공공데이터 CSV"
            : /해조류/.test(external.csv.supply.description)
              ? "해조류 생산·생태환경 CSV"
              : "가축사육통계 CSV"
          : "제주 공공데이터 CSV",
        query: result.extraction.ingredient || "원료 미확정",
        value: external.csv.supply ? `${external.csv.supply.score}점 근거` : "직접 통계 없음",
        detail:
          external.csv.supply?.description ||
          "업로드 데이터와 직접 연결되지 않아 원료별 공급자료 추가 필요",
        status: external.csv.supply
          ? external.csv.supply.directness === "direct"
            ? "확인"
            : "보조 근거"
          : "추가 검증 필요"
      },
      {
        axis: "규제 사전 체크",
        source: external.mfds.source,
        query: external.mfds.query,
        value: external.mfds.matched ? "표준 원료명 확인" : "직접 일치 미확인",
        detail: external.mfds.detail,
        status: external.mfds.status
      },
      external.csv.regulatoryReference
        ? {
            axis: "해외 규격 참고",
            source: external.csv.regulatoryReference.name,
            query: result.extraction.ingredient || "해조류",
            value: `${external.csv.regulatoryReference.jurisdiction} 기준`,
            detail: external.csv.regulatoryReference.detail,
            status: external.csv.regulatoryReference.status
          }
        : null
    ].filter(Boolean)
  };

  const decisionSupport = recalculateDecisionSupport(result, scores);
  const copilot = makeCopilot(result, external, scores);
  const dataSources = [
    {
      id: "papers",
      name: `${external.papers.source} 논문 검색`,
      status: external.papers.status,
      detail: `검색식: ${external.papers.query}`,
      updatedAt: new Date().toISOString().slice(0, 10)
    },
    ...external.csv.sources,
    ...(external.csv.regulatoryReference
      ? [
          {
            id: "food-color-reference",
            ...external.csv.regulatoryReference
          }
        ]
      : []),
    {
      id: "mfds",
      name: external.mfds.source,
      status: external.mfds.status,
      detail: external.mfds.detail,
      updatedAt: new Date().toISOString().slice(0, 10)
    },
    {
      id: "serp-trends",
      name: "SERP API 시장·특허 트렌드 검색",
      status: external.serp?.status || "환경변수 미설정",
      detail: external.serp?.detail || "SERP_API_KEY 설정 시 활성화",
      updatedAt: new Date().toISOString().slice(0, 10)
    }
  ];
  const regulatoryChecklist = updateRegulation(result, external);
  const dataFreshness = dataSources
    .filter((source) => source.status !== "비대상")
    .map((source) => ({
      source: source.name,
      label: source.status,
      updatedAt: source.updatedAt || "기준일 확인"
    }));
  const scoreReasons = {
    technical: `문헌 ${tech.literature} · 성숙도 ${tech.maturity} · 재현성 ${tech.reproducibility}`,
    market: external.csv.market
      ? `${result.extraction.categories[0]} 기준 + 판매 채널 보조 ${external.csv.market.scoreAdjustment}점`
      : result.scoreReasons.market,
    patentSafety: result.scoreReasons.patentSafety,
    supply: external.csv.supply?.description || "직접 연결되는 제주 공급 통계 추가 확인 필요"
  };
  const recommendations = result.recommendations;
  const commercialIntelligence = makeCommercialIntelligence(
    { ...result, evidence },
    external,
    scores,
    decisionSupport
  );
  const enriched = {
    ...result,
    scores,
    scoreReasons,
    evidence,
    decisionSupport,
    copilot,
    regulatoryChecklist,
    dataFreshness,
    dataSources,
    paperEvidence: {
      ...external.papers,
      latestYear: paperStats.latestYear,
      recentCount: paperStats.recentCount
    },
    supplyEvidence: external.csv.supply,
    regulatoryReference: external.csv.regulatoryReference,
    commercialIntelligence,
    evidenceSummary: {
      confirmedSources: confirmations,
      confirmedCount: confirmations.length,
      semanticConditions,
      status:
        confirmations.length >= 2
          ? "복수 출처 확인"
          : confirmations.length === 1
            ? "단일 출처 확인·추가 검증 필요"
            : "API 실패 또는 직접 근거 부족"
    },
    recommendations,
    formulas: {
      technical: "문헌근거지수 40% + 기술성숙도지수 30% + 재현가능성지수 30%",
      market: "시장성장지수 35% + 경쟁밀도역지수 35% + 트렌드적합도 30%",
      patentSafety: "100 - (유사특허밀도 60% + 핵심클레임중첩도 40%)",
      supply: "생산량지수 40% + 계절변동역지수 30% + 부산물활용률 30%",
      total: "기술성 30% + 시장성 25% + 특허안전성 20% + 공급안정성 20% + 논리적 적합성 5% - 보완 필요 감점"
    }
  };
  enriched.explanation = makeFallbackExplanation(
    enriched.extraction,
    enriched.scores,
    enriched.evidence,
    enriched.classification,
    enriched.recommendations
  );
  enriched.explanation.review = [
    ...enriched.explanation.review.filter((item) => !item.includes("해커톤 시연용 캐시")),
    `${enriched.evidenceSummary.confirmedCount}개 외부 근거 출처 확인. 점수는 1차 검토 보조용입니다.`
  ];
  return enriched;
}
