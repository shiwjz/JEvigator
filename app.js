import { CATEGORIES } from "./data/catalog.js";
import { analyzeIdea, extractWithRules } from "./lib/analyzer.mjs";
import { assessCompanyProfile } from "./lib/company-diagnosis.mjs";
import { makeRecommendations } from "./lib/recommendation-service.mjs";

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

const bioMaterialGroups = [
  {
    id: "Green Bio",
    label: "그린바이오",
    title: "농업·식물 부산물 기반 소재",
    description: "감귤, 녹차, 당근 등 제주 농산 부산물을 기능성 원료로 전환합니다.",
    countLabel: "원료 4종 수록"
  },
  {
    id: "Blue Bio",
    label: "해양바이오",
    title: "해양 생물·해조류 기반 소재",
    description: "우뭇가사리, 모자반, 톳 등 해양 원료의 색소·미네랄·겔화 특성을 활용합니다.",
    countLabel: "원료 3종 수록"
  },
  {
    id: "Red Bio",
    label: "레드바이오",
    title: "동물성 부산물·고부가 소재",
    description: "제주 축산 부산물을 콜라겐, 펫푸드, 농업용 소재로 검토합니다.",
    countLabel: "원료 1종 수록"
  },
  {
    id: "White Bio",
    label: "화이트바이오",
    title: "친환경 공정·바이오 소재",
    description: "식물·해양 부산물을 포장재, 생분해 소재, 산업용 원료로 확장합니다.",
    countLabel: "원료 2종 수록"
  }
];

const recommendedMaterials = [
  {
    id: "mat-citrus-pomace",
    bioType: "Green Bio",
    canonical: "감귤박",
    name: "감귤 부산물",
    icon: "🍊",
    unusedRate: 47,
    annualAmount: "약 47.8만 톤",
    utilization: "중간",
    imageTone: "citrus",
    summary: "제주 감귤의 껍질, 씨, 과육 부산물에서 추출되는 천연 바이오 소재",
    components: [
      ["플라보노이드", "항산화 스토리", "감귤류에 풍부한 폴리페놀 계열로 항산화 콘셉트를 만들기 쉽습니다."],
      ["헤스페리딘", "피부 컨디셔닝", "감귤 껍질 기능성 원료 스토리의 핵심 성분으로 활용됩니다."],
      ["펙틴", "소재화/겔화", "식품·바이오필름·점증 소재로 확장 가능한 다당류입니다."],
      ["비타민 C", "브라이트닝 이미지", "직접 효능 표현보다 원료 스토리 보조 근거로 활용하기 좋습니다."],
      ["리모넨", "향·생활소재", "시트러스 향과 세정 보조 소재 콘셉트로 확장 가능합니다."]
    ],
    stats: { patents: 132, papers: 543, market: "3,200억원", cagr: "12%", score: 91 }
  },
  {
    id: "mat-citrus-peel",
    bioType: "Green Bio",
    canonical: "감귤 껍질",
    name: "감귤 껍질",
    icon: "🍊",
    unusedRate: 43,
    annualAmount: "약 12.4만 톤",
    utilization: "중간",
    imageTone: "citrus",
    summary: "감귤 과피를 건조·추출해 화장품, 식품 향미, 생활소재로 활용 가능한 원료",
    components: [
      ["헤스페리딘", "항산화", "감귤 껍질의 대표 기능성 스토리를 만드는 성분입니다."],
      ["나린진", "쓴맛·기능성", "식품 소재화 시 향미 조절과 기능 스토리에 함께 고려됩니다."],
      ["리모넨", "향료/세정", "시트러스 향 기반 제품 기획에 활용하기 좋습니다."],
      ["식이섬유", "일반식품", "블렌딩 티나 스낵 소재에서 원료 스토리를 보강합니다."]
    ],
    stats: { patents: 97, papers: 418, market: "2,400억원", cagr: "10%", score: 88 }
  },
  {
    id: "mat-green-tea",
    bioType: "Green Bio",
    canonical: "녹차 부산물",
    name: "녹차 부산물",
    icon: "🍵",
    unusedRate: 38,
    annualAmount: "약 5,100톤",
    utilization: "중간",
    imageTone: "leaf",
    summary: "녹차 가공 후 남는 잎·분말 부산물을 항산화, 진정, 펫케어 소재로 전환",
    components: [
      ["카테킨", "항산화", "녹차 연구 근거가 풍부해 기술성 설명이 쉽습니다."],
      ["폴리페놀", "피부 진정", "화장품·생활소재 콘셉트에 폭넓게 쓰입니다."],
      ["식물성 섬유", "농업용 소재", "발효 퇴비나 토양 보조재로 검토할 수 있습니다."]
    ],
    stats: { patents: 86, papers: 620, market: "2,900억원", cagr: "9%", score: 84 }
  },
  {
    id: "mat-carrot",
    bioType: "Green Bio",
    canonical: "당근 부산물",
    name: "당근 부산물",
    icon: "🥕",
    unusedRate: 52,
    annualAmount: "약 8,600톤",
    utilization: "낮음",
    imageTone: "carrot",
    summary: "당근 선별·가공 과정에서 나오는 부산물을 천연 색소, 식이섬유, 펫푸드로 활용",
    components: [
      ["베타카로틴", "천연 색소", "색감이 뚜렷해 MVP에서 차별성을 직관적으로 보여줍니다."],
      ["식이섬유", "장건강 스토리", "일반식품·펫푸드 소재로 설명하기 쉽습니다."],
      ["식물성 섬유질", "바이오 시트", "소재화 가능성은 있으나 물성 검증이 필요합니다."]
    ],
    stats: { patents: 34, papers: 128, market: "980억원", cagr: "8%", score: 79 }
  },
  {
    id: "mat-agar",
    bioType: "Blue Bio",
    canonical: "우뭇가사리",
    name: "우뭇가사리",
    icon: "🌊",
    unusedRate: 41,
    annualAmount: "약 1,900톤",
    utilization: "중간",
    imageTone: "ocean",
    summary: "한천과 겔화 특성을 활용해 젤 마스크, 비건 식품, 생분해 소재로 확장 가능한 해양 원료",
    components: [
      ["한천", "겔화/식감", "젤 마스크와 비건 젤리 소재의 핵심 물성입니다."],
      ["다당류", "보습 스토리", "화장품 제형에서 해양 보습 소재로 설명할 수 있습니다."],
      ["해양 미네랄", "프리미엄 원료", "해양 원료 이미지를 보조하는 스토리 요소입니다."]
    ],
    stats: { patents: 58, papers: 244, market: "1,450억원", cagr: "11%", score: 83 }
  },
  {
    id: "mat-sargassum",
    bioType: "Blue Bio",
    canonical: "모자반",
    name: "모자반",
    icon: "🌿",
    unusedRate: 55,
    annualAmount: "약 2,300톤",
    utilization: "낮음",
    imageTone: "ocean",
    summary: "제주 해조류 기반 미네랄·천연 색소·농업용 소재로 검토 가능한 Blue Bio 원료",
    components: [
      ["후코이단", "해양 기능성", "기능성 소재화 가능성은 있으나 표준화가 필요합니다."],
      ["알긴산", "점증/소재화", "식품·소재 분야로 확장 가능한 해조 다당류입니다."],
      ["미네랄", "건강 간식", "일반식품 스낵에서 원료 스토리를 만들기 좋습니다."]
    ],
    stats: { patents: 41, papers: 196, market: "1,120억원", cagr: "13%", score: 86 }
  },
  {
    id: "mat-hijiki",
    bioType: "Blue Bio",
    canonical: "톳",
    name: "톳",
    icon: "🌱",
    unusedRate: 36,
    annualAmount: "약 780톤",
    utilization: "중간",
    imageTone: "ocean",
    summary: "미네랄과 식이섬유 스토리가 강한 제주 해조 원료로 스낵·펫푸드·B2B 소재화 가능",
    components: [
      ["미네랄", "건강 간식", "스낵바나 일반식품 MVP에 활용하기 좋은 스토리입니다."],
      ["식이섬유", "장건강 이미지", "직접 기능성보다 원료 기반 건강 간식 메시지에 적합합니다."],
      ["해조 다당류", "소재화", "분말 B2B 소재로 확장할 때 표준화가 필요합니다."]
    ],
    stats: { patents: 27, papers: 173, market: "890억원", cagr: "7%", score: 78 }
  },
  {
    id: "mat-black-pork",
    bioType: "Red Bio",
    canonical: "흑돼지 부산물",
    name: "흑돼지 부산물",
    icon: "🐖",
    unusedRate: 49,
    annualAmount: "약 8,600톤",
    utilization: "중간",
    imageTone: "red",
    summary: "제주 흑돼지 부산물에서 콜라겐, 아미노산, 펫푸드 소재를 검토할 수 있는 동물성 원료",
    components: [
      ["콜라겐", "보습/탄력", "화장품과 펫푸드 관절 간식 스토리에 활용됩니다."],
      ["아미노산", "농업용 소재", "액비와 작물 생장 보조 소재로 검토할 수 있습니다."],
      ["단백질 분해물", "기능성 소재", "표준화와 냄새 관리가 사업화 핵심입니다."]
    ],
    stats: { patents: 39, papers: 112, market: "1,700억원", cagr: "9%", score: 76 }
  },
  {
    id: "mat-citrus-white",
    bioType: "White Bio",
    canonical: "감귤박",
    name: "감귤박 펙틴 소재",
    icon: "♻️",
    unusedRate: 47,
    annualAmount: "약 47.8만 톤",
    utilization: "중간",
    imageTone: "stone",
    summary: "감귤박의 펙틴과 섬유질을 바이오필름·친환경 포장 소재로 확장하는 화이트바이오 원료",
    components: [
      ["펙틴", "바이오필름", "친환경 포장재의 점착·필름 형성 소재로 검토됩니다."],
      ["셀룰로오스", "복합소재", "바이오폴리머 보강재로 확장 가능합니다."],
      ["리모넨", "향·소재", "생활소재와 패키징 스토리를 보조합니다."]
    ],
    stats: { patents: 64, papers: 205, market: "2,800억원", cagr: "14%", score: 82 }
  },
  {
    id: "mat-agar-white",
    bioType: "White Bio",
    canonical: "우뭇가사리",
    name: "우뭇가사리 한천 소재",
    icon: "⚗️",
    unusedRate: 41,
    annualAmount: "약 1,900톤",
    utilization: "중간",
    imageTone: "stone",
    summary: "한천의 필름·겔 특성을 생분해 캡슐, 소재 코팅, 바이오 시트로 검토하는 원료",
    components: [
      ["한천", "겔/필름", "캡슐과 코팅 소재의 기본 물성으로 활용 가능합니다."],
      ["다당류", "생분해 소재", "친환경 소재화 연구의 출발점이 됩니다."],
      ["해양 원료성", "Blue-White Bio 연계", "해양 원료를 산업 소재로 확장하는 차별성이 있습니다."]
    ],
    stats: { patents: 46, papers: 188, market: "1,950억원", cagr: "12%", score: 80 }
  }
];

const weightPresets = {
  default: { technical: 30, market: 25, patentSafety: 20, supply: 20 },
  cosmetic: { technical: 30, market: 25, patentSafety: 25, supply: 15 },
  health: { technical: 35, market: 20, patentSafety: 25, supply: 15 },
  pet: { technical: 30, market: 30, patentSafety: 20, supply: 15 }
};

const state = {
  currentView: "home",
  currentFilter: "All",
  result: null,
  companyProfile: null,
  enterpriseDiagnosis: null,
  selectedScenarioId: "current",
  selectedMaterialId: null,
  weights: {
    technical: 30,
    market: 25,
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
  diagnosisForm: document.querySelector("#diagnosisForm"),
  diagnosisOutput: document.querySelector("#diagnosisOutput"),
  toast: document.querySelector("#toast")
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function businessText(value) {
  return String(value ?? "")
    .replaceAll("확인했습니다", "분석 반영")
    .replaceAll("추가 검증 필요", "보완 권장")
    .replaceAll("원문 검증 필요", "근거 요약 보기")
    .replaceAll("추가 확인 필요", "보완 항목")
    .replaceAll("확인 필요", "보완 항목")
    .replaceAll("검토 필요", "보완 권장")
    .replaceAll("자료 필요", "보완 권장")
    .replaceAll("전문가 검토", "제품화 경로 산정")
    .replaceAll("규격서 대조", "제품화 기준 반영")
    .replaceAll("API 실패로 캐시 사용", "시연 데이터 기반 분석")
    .replaceAll("API 실패", "시연 데이터 기반 분석")
    .replaceAll("불명확", "낮은 신뢰도")
    .replaceAll("추정", "AI 예측")
    .replaceAll("CSV", "공공데이터")
    .replaceAll("JEVI", "현재 아이템")
    .replaceAll("논문 API", "논문 근거")
    .replaceAll("OpenAlex / Crossref", "논문 근거")
    .replaceAll("OpenAlex", "논문 근거")
    .replaceAll("Crossref", "논문 근거")
    .replaceAll("식약처 API", "식약처 원료 DB")
    .replaceAll("브라우저 폴백", "시연 데이터 기반 분석")
    .replaceAll("근거 기반 폴백", "시연 데이터 기반 분석")
    .replaceAll("현재 확보 근거 기준", "활용 근거 요약")
    .replaceAll("해커톤 캐시 데이터", "시연 데이터 기반 분석")
    .replaceAll("원문 확인", "근거 요약 확인")
    .replaceAll("원문 검토", "근거 요약 검토")
    .replaceAll("KIPRIS 원문 검증이 필요합니다", "특허 회피 전략 수립을 권장합니다");
}

const clampPercent = (value) => Math.max(5, Math.min(95, Number(value) || 0));

const DEMO_PROFILES = {
  "citrus-cosmetic": {
    score: 77.6,
    readiness: {
      grade: "B+",
      businessPosition: "제주 부산물 클린뷰티 원료형",
      recommendedCategory: "세럼·마스크팩·크림",
      bioType: "Green Bio"
    },
    conclusionCards: [
      {
        label: "최종 판단",
        value: "제주 감귤 부산물 기반 클린뷰티 원료형으로 진입 적합"
      },
      {
        label: "가장 강한 차별성",
        value: "제주 감귤 부산물 + 항산화 기능 근거 + 클린뷰티 스토리"
      },
      {
        label: "다음 액션",
        value: "세럼/마스크팩 제형으로 MVP를 좁히고, 원료 스토리와 피부 컨디셔닝 메시지를 전면화"
      }
    ],
    evidence: {
      label: "시연 데이터 기반 분석",
      counts: { publicData: 3, paper: 28, mfds: 1, patent: 42, brandCases: 4 },
      items: [
        ["공공데이터", 3, "제주 원료 공급·생산 보조 근거"],
        ["논문 근거", 28, "항산화·피부 컨디셔닝 관련 연구 흐름"],
        ["식약처 원료 DB", 1, "화장품 원료 식별 및 제품화 판단"],
        ["특허 트렌드", 42, "키워드 기반 최근 5년 출원 신호"],
        ["유사 브랜드", 4, "브랜드 포지셔닝 비교 기준"]
      ]
    },
    differentiationSummary: [
      {
        key: "locality",
        label: "지역 원료 차별성",
        score: 92,
        status: "차별화 여지 높음",
        detail: "제주 감귤 부산물이라는 지역성과 자원순환 스토리가 강합니다."
      },
      {
        key: "evidence",
        label: "기능성 근거 차별성",
        score: 84,
        status: "제품화 경로 명확",
        detail: "항산화·피부 컨디셔닝 키워드와 화장품 제품군의 연결성이 높습니다."
      },
      {
        key: "story",
        label: "시장 스토리 차별성",
        score: 88,
        status: "진입 적합",
        detail: "클린뷰티, 업사이클링, 로컬 원료 트렌드와 결합하기 좋습니다."
      },
      {
        key: "productization",
        label: "제품화 가능성",
        score: 81,
        status: "시장 테스트 적합",
        detail: "세럼, 마스크팩, 크림 등 초기 MVP 제형으로 좁히기 쉽습니다."
      }
    ],
    marketPosition: {
      label: "준블루오션",
      entryEase: 72,
      patentCompetition: 58,
      description:
        "시장 진입 용이성은 높고 특허 경쟁 강도는 중간 수준입니다. 일반 항산화 화장품과 완전히 분리되지는 않지만, 제주 감귤 부산물과 클린뷰티 스토리를 결합하면 차별화 여지가 큽니다."
    },
    patentTrend: [
      { year: "2022", value: 5 },
      { year: "2023", value: 7 },
      { year: "2024", value: 8 },
      { year: "2025", value: 10 },
      { year: "2026", value: 12 }
    ],
    brandPositioning: {
      xLeft: "대중성",
      xRight: "프리미엄성",
      yTop: "기능성 근거 중심",
      yBottom: "원료 스토리 중심",
      axisSummary: "X축 대중성 ↔ 프리미엄성 · Y축 원료 스토리 중심 ↔ 기능성 근거 중심",
      points: [
        { label: "이니스프리", type: "대중 클린뷰티", mark: "INN", tone: "green", x: 55, y: 65 },
        { label: "제주 로컬 감귤 화장품", type: "로컬 원료 브랜드", mark: "JEJU", tone: "orange", x: 42, y: 58 },
        { label: "더마 기능성 브랜드", type: "고기능성 더마", mark: "DERMA", tone: "purple", x: 78, y: 88 },
        { label: "원료 B2B 소재형", type: "원료 공급형", mark: "B2B", tone: "navy", x: 62, y: 76 },
        { label: "현재 아이템", type: "제주 부산물 클린뷰티", mark: "ITEM", tone: "current", current: true, x: 68, y: 78 }
      ],
      insight:
        "현재 아이템은 일반 자연주의 화장품보다 기능성 근거가 강하고, 더마 기능성 브랜드보다 제주 원료 스토리와 자원순환 메시지가 강한 포지션입니다. 따라서 ‘제주 감귤 부산물 기반 클린뷰티 기능성 원료’로 포지셔닝하는 것이 적합합니다."
    },
    brandComparisons: [
      {
        type: "이니스프리",
        commonality: "제주 원료 이미지와 자연주의 화장품 스토리를 활용합니다.",
        difference: "대중 브랜드라 개별 원료 차별성이 분산될 수 있습니다.",
        advantage: "감귤 껍질 부산물과 항산화 기능을 직접 연결할 수 있습니다.",
        gap: "세럼·마스크팩 제형에서 원료 스토리를 더 선명하게 보여줘야 합니다."
      },
      {
        type: "제주 로컬 감귤 화장품",
        commonality: "제주 감귤/귤피 스토리를 공유합니다.",
        difference: "기능성 근거와 데이터 기반 리포트는 상대적으로 약할 수 있습니다.",
        advantage: "원료 스토리와 논문·공공데이터·원료 DB 기반 근거를 함께 제시할 수 있습니다.",
        gap: "원료명과 제형별 표현 범위를 제품화 단계에서 확정합니다."
      },
      {
        type: "더마 기능성 브랜드",
        commonality: "피부 개선과 기능성 메시지를 강조합니다.",
        difference: "지역 원료·자원순환 스토리는 상대적으로 약합니다.",
        advantage: "더마보다 초기 진입 부담이 낮고 제주 로컬 스토리가 강합니다.",
        gap: "의약적 표현 대신 피부 컨디셔닝 중심 메시지로 정리합니다."
      },
      {
        type: "원료 B2B 소재형",
        commonality: "원료 효능과 공급 안정성을 중요하게 봅니다.",
        difference: "소비자 브랜드 감성은 약할 수 있습니다.",
        advantage: "B2C 화장품과 B2B 원료 공급 양쪽으로 확장 가능합니다.",
        gap: "원료 표준화 자료와 공급 단위 설계가 필요합니다."
      }
    ],
    whatIf: [
      {
        name: "감귤 껍질 항산화 세럼",
        reason: "화장품이라는 넓은 제품군을 세럼으로 좁히면 기능 메시지와 타깃 고객이 명확해집니다.",
        risk: "세럼 시장은 경쟁이 강해 원료 스토리와 제형 차별화가 필요합니다.",
        score: 82.1,
        delta: 4.5,
        recommendation: "빠른 MVP 추천",
        situation: "초기 소비자 반응을 빠르게 확인하고 싶을 때"
      },
      {
        name: "감귤 부산물 마스크팩",
        reason: "제주 감귤 부산물 스토리를 시각적으로 전달하기 쉽고, 체험형 제품으로 시장 테스트가 용이합니다.",
        risk: "단가와 패키징 차별화가 약하면 일반 마스크팩과 섞일 수 있습니다.",
        score: 80.4,
        delta: 2.8,
        recommendation: "저위험 테스트용",
        situation: "짧은 기간에 시제품을 보여줘야 할 때"
      },
      {
        name: "감귤 추출물 원료 B2B 공급",
        reason: "원료 공급 안정성과 제주 지역 자원순환 스토리를 B2B 소재 사업으로 확장할 수 있습니다.",
        risk: "B2B 판로와 원료 표준화 자료가 필요합니다.",
        score: 83.7,
        delta: 6.1,
        recommendation: "R&D 지원사업 적합",
        situation: "단순 완제품보다 소재화/R&D 과제로 확장하고 싶을 때"
      }
    ],
    whatIfSummary:
      "현재 아이템의 기본 방향은 유지하되, 제품군을 ‘화장품’에서 세럼·마스크팩·원료 B2B로 좁히면 시장 진입 전략이 더 명확해집니다. 특히 원료 B2B 공급형은 R&D 지원사업 관점에서 기술·공급 근거를 강조하기 좋아 점수 향상 폭이 가장 큽니다.",
    regulatoryDecision: {
      title: "화장품 원료형 진입 가능성 높음",
      productPath: "화장품 원료형",
      riskLevel: "중간 이하",
      mvpFormats: ["세럼", "마스크팩", "크림"],
      rows: [
        {
          item: "원료 식별",
          result: "분석 반영",
          evidence: "감귤 껍질은 Citrus Unshiu Peel Extract 계열 원료군으로 분류했습니다.",
          guide: "원료 상세명은 제품화 단계에서 전성분명과 원료 규격서로 확정합니다."
        },
        {
          item: "제품화 경로",
          result: "제품화 가능성 높음",
          evidence: "항산화·피부 컨디셔닝 스토리와 화장품 제품군의 연결성이 높습니다.",
          guide: "초기 MVP는 세럼, 마스크팩, 크림 제형이 적합합니다."
        },
        {
          item: "표현 리스크",
          result: "리스크 중간 이하",
          evidence: "의약적 효능 표현보다 피부 보호·윤기·컨디셔닝 표현으로 설계하는 것이 안정적입니다.",
          guide: "‘치료’, ‘재생’, ‘질환 개선’ 표현은 피하고 원료 기반 스토리로 전개합니다."
        },
        {
          item: "사업화 판단",
          result: "초기 진입 적합",
          evidence: "클린뷰티, 제주 원료, 업사이클링 메시지를 결합할 수 있습니다.",
          guide: "고기능성 의약외품보다 클린뷰티 화장품 원료형으로 진입합니다."
        }
      ],
      summary:
        "감귤 껍질 유래 원료는 화장품 원료형 제품으로 진입하기 적합합니다. 초기에는 세럼·마스크팩·크림 형태로 시장 반응을 확인하고, 기능성 표현은 피부 컨디셔닝과 항산화 원료 스토리 중심으로 설계하는 것이 안정적입니다."
    }
  },
  "seaweed-snack": {
    score: 78.4,
    readiness: {
      grade: "B+",
      businessPosition: "제주 해조류 기능성 스낵 MVP",
      recommendedCategory: "기능성 스낵 MVP",
      bioType: "Blue Bio"
    },
    conclusionCards: [
      {
        label: "최종 판단",
        value: "제주 해조류 기반 기능성 스낵 MVP로 시장 테스트 적합"
      },
      {
        label: "가장 강한 차별성",
        value: "제주 해조류 + 천연 색소 + 미네랄/식이섬유 기반 건강 간식 스토리"
      },
      {
        label: "다음 액션",
        value: "건강기능식품 인증형보다 일반 기능성 스낵으로 먼저 진입하고, 색감/패키지/원료 스토리 강조"
      }
    ],
    evidence: {
      label: "시연 데이터 기반 분석",
      counts: { publicData: 2, paper: 18, mfds: 0, patent: 24, brandCases: 4 },
      items: [
        ["공공데이터", 2, "제주 해양·원료 보조 근거"],
        ["논문 근거", 18, "해조류 색소·미네랄·식이섬유 연구 흐름"],
        ["제품화 기준", 2, "식품/스낵 제품화 및 표시광고 리스크 반영"],
        ["특허 트렌드", 24, "키워드 기반 최근 5년 출원 신호"],
        ["유사 브랜드", 4, "브랜드 포지셔닝 비교 기준"]
      ]
    },
    differentiationSummary: [
      {
        key: "locality",
        label: "원료 스토리 차별성",
        score: 86,
        status: "차별화 여지 높음",
        detail: "제주 해조류 기반 Blue Bio 원료 스토리가 명확합니다."
      },
      {
        key: "snack",
        label: "기능성 스낵 차별성",
        score: 82,
        status: "시장 테스트 적합",
        detail: "천연 색소, 미네랄, 식이섬유를 결합한 건강 간식 포지션을 만들 수 있습니다."
      },
      {
        key: "entry",
        label: "시장 진입성",
        score: 79,
        status: "진입 적합",
        detail: "건강기능식품 인증형보다 일반 기능성 스낵 MVP로 빠르게 테스트할 수 있습니다."
      },
      {
        key: "expansion",
        label: "확장 가능성",
        score: 85,
        status: "제품화 경로 명확",
        detail: "스낵, 색소 분말, 원료 B2B 공급으로 확장 가능합니다."
      }
    ],
    marketPosition: {
      label: "블루오션 후보",
      entryEase: 68,
      patentCompetition: 42,
      description:
        "해조류 스낵 시장은 존재하지만, 제주 해조류와 천연 색소 기능성을 결합한 포지션은 경쟁 강도가 상대적으로 낮습니다. 일반 김스낵보다 프리미엄하고 건강기능식품보다 진입 부담이 낮은 틈새 시장을 노릴 수 있습니다."
    },
    patentTrend: [
      { year: "2022", value: 3 },
      { year: "2023", value: 4 },
      { year: "2024", value: 5 },
      { year: "2025", value: 5 },
      { year: "2026", value: 7 }
    ],
    brandPositioning: {
      xLeft: "일상 간식성",
      xRight: "기능성 강화",
      yTop: "프리미엄 건강식",
      yBottom: "대중 식품",
      axisSummary: "X축 일상 간식성 ↔ 기능성 강화 · Y축 대중 식품 ↔ 프리미엄 건강식",
      points: [
        { label: "일반 김스낵", type: "대중 해조 스낵", mark: "SNACK", tone: "slate", x: 26, y: 30 },
        { label: "gimMe Seaweed", type: "글로벌 김스낵", mark: "gimMe", tone: "green", x: 46, y: 48 },
        { label: "SeaSnax", type: "프리미엄 클린 스낵", mark: "SNAX", tone: "mint", x: 56, y: 66 },
        { label: "Ocean’s Halo", type: "해조 기반 식품 브랜드", mark: "HALO", tone: "navy", x: 68, y: 58 },
        { label: "현재 아이템", type: "제주 천연 색소 기능성 스낵", mark: "ITEM", tone: "current", current: true, x: 72, y: 76 }
      ],
      insight:
        "현재 아이템은 일반 김스낵보다 기능성·색소 활용성이 강하고, 건강기능식품보다 초기 진입 부담이 낮은 프리미엄 기능성 스낵 포지션입니다. 따라서 ‘제주 해조류 기반 천연 색소 기능성 스낵’으로 진입하고, 이후 색소 분말 또는 원료 B2B 소재로 확장하는 전략이 적합합니다."
    },
    brandComparisons: [
      {
        type: "일반 김스낵",
        commonality: "해조류를 간식으로 소비한다는 사용 맥락이 같습니다.",
        difference: "대중 간식 중심이라 천연 색소·미네랄 스토리는 약합니다.",
        advantage: "색감과 제주 원료 스토리로 프리미엄 기능성 스낵 포지션을 만들 수 있습니다.",
        gap: "맛과 식감 완성도를 빠르게 검증해야 합니다."
      },
      {
        type: "gimMe Seaweed",
        commonality: "건강한 해조류 스낵 이미지를 공유합니다.",
        difference: "글로벌 김스낵 브랜드로 지역 원료 스토리는 제한적입니다.",
        advantage: "제주 해조류와 천연 색소라는 로컬 차별성을 전면화할 수 있습니다.",
        gap: "패키지와 컬러 경험을 시각적으로 보여주는 MVP가 필요합니다."
      },
      {
        type: "SeaSnax",
        commonality: "클린 스낵과 프리미엄 건강 간식 문법을 공유합니다.",
        difference: "색소 소재화와 Blue Bio R&D 확장성은 상대적으로 약합니다.",
        advantage: "스낵 이후 색소 분말·B2B 소재로 확장할 수 있습니다.",
        gap: "색 안정성, 풍미, 원료 표준화 기준을 보완합니다."
      },
      {
        type: "Ocean’s Halo",
        commonality: "해조 기반 식품 브랜드라는 카테고리 접점이 있습니다.",
        difference: "완제품 식품 중심이라 천연 색소 기능을 전면화하지는 않습니다.",
        advantage: "천연 색소와 미네랄 스토리를 결합한 기능성 스낵 콘셉트가 선명합니다.",
        gap: "표시광고 표현은 일반 식품 범위에 맞춰 조정합니다."
      }
    ],
    whatIf: [
      {
        name: "해조류 천연 색소 컬러칩",
        reason: "천연 색소라는 시각적 차별성이 강해 일반 김스낵과 빠르게 구분됩니다.",
        risk: "색 안정성, 맛, 식감 설계가 중요합니다.",
        score: 82.2,
        delta: 3.8,
        recommendation: "소비자 테스트 추천",
        situation: "시연 영상이나 MVP에서 차별성을 직관적으로 보여주고 싶을 때"
      },
      {
        name: "해조류 미네랄 기능성 스낵바",
        reason: "미네랄·식이섬유 스토리를 건강 간식 포지션으로 확장할 수 있습니다.",
        risk: "기능성 표현은 표시광고 리스크를 고려해 조정해야 합니다.",
        score: 80.6,
        delta: 2.2,
        recommendation: "브랜드 확장형",
        situation: "건강 간식 시장으로 진입하고 싶을 때"
      },
      {
        name: "해조류 천연 색소 분말 B2B",
        reason: "스낵 완제품보다 원료 소재로 확장하면 식품·소재 기업 대상 B2B 사업화가 가능합니다.",
        risk: "색소 추출·표준화·납품 규격 설계가 필요합니다.",
        score: 84.1,
        delta: 5.7,
        recommendation: "R&D 확장 추천",
        situation: "Blue Bio 소재화 과제로 확장하고 싶을 때"
      }
    ],
    whatIfSummary:
      "해조류 아이템은 일반 스낵보다 ‘천연 색소’와 ‘미네랄 스토리’를 전면화할 때 차별성이 커집니다. 특히 천연 색소 분말 B2B는 완제품 경쟁을 피하면서 Blue Bio 소재화 전략으로 확장할 수 있어 R&D 과제화에 적합합니다.",
    regulatoryDecision: {
      title: "일반 기능성 스낵 MVP 진입 적합",
      productPath: "기능성 식품/스낵",
      riskLevel: "중간",
      mvpFormats: ["해조류 컬러칩", "미네랄 스낵바", "천연 색소 분말"],
      rows: [
        {
          item: "원료군",
          result: "분석 반영",
          evidence: "해조류, 톳, 모자반, 감태 계열 Blue Bio 원료로 분류했습니다.",
          guide: "원재료명과 함량을 중심으로 일반 식품 MVP를 설계합니다."
        },
        {
          item: "제품화 경로",
          result: "초기 시장 테스트 적합",
          evidence: "건강기능식품 인증형보다 일반 기능성 스낵 형태가 초기 진입에 유리합니다.",
          guide: "해조류 컬러칩, 미네랄 스낵바, 컬러 스낵 형태로 테스트합니다."
        },
        {
          item: "표시광고 리스크",
          result: "리스크 중간",
          evidence: "질병 예방·치료 표현은 제한하고, 원료·색소·영양 스토리 중심으로 설계합니다.",
          guide: "‘천연 색소’, ‘해조류 원료’, ‘식이섬유’, ‘미네랄 함유 원료 기반’ 표현을 활용합니다."
        },
        {
          item: "확장 판단",
          result: "확장성 높음",
          evidence: "스낵 완제품뿐 아니라 천연 색소 분말, 원료 B2B 공급으로 확장 가능합니다.",
          guide: "R&D 과제에서는 색소 추출·표준화·소재화 방향을 강조합니다."
        }
      ],
      summary:
        "해조류 아이템은 건강기능식품 인증형보다 일반 기능성 스낵 MVP로 먼저 진입하는 것이 안정적입니다. 천연 색소, 미네랄, 식이섬유 스토리를 중심으로 제품을 설계하고, 이후 색소 분말 또는 원료 B2B로 확장하는 전략이 적합합니다."
    }
  }
};

const AI_COACH_QUICK_QUESTIONS = [
  "이 아이템의 가장 큰 강점은?",
  "가장 먼저 보완할 부분은?",
  "브랜드 포지셔닝을 한 줄로 정리해줘",
  "R&D 지원사업에 넣으려면 무엇을 강조해야 해?"
];

const AI_COACH_FALLBACKS = {
  "citrus-cosmetic": {
    "이 아이템의 가장 큰 강점은?":
      "가장 큰 강점은 제주 감귤 부산물 스토리와 항산화·피부 컨디셔닝 기능을 동시에 가져갈 수 있다는 점입니다. 일반 자연주의 화장품보다 원료 스토리가 구체적이고, 더마 기능성 브랜드보다 초기 진입 부담이 낮습니다.",
    "가장 먼저 보완할 부분은?":
      "가장 먼저 제품군을 ‘화장품’에서 세럼, 마스크팩, 크림 중 하나로 좁히는 것이 좋습니다. 그래야 타깃 고객, 기능 메시지, 시제품 방향이 명확해집니다.",
    "브랜드 포지셔닝을 한 줄로 정리해줘":
      "제주 감귤 부산물을 활용한 클린뷰티 기능성 원료형 브랜드로 포지셔닝하는 것이 적합합니다.",
    "R&D 지원사업에 넣으려면 무엇을 강조해야 해?":
      "제주 감귤 부산물의 자원순환 가치, 항산화 기능 근거, 화장품 원료형 제품화 가능성, 지역 원료 공급 안정성을 강조하는 것이 좋습니다."
  },
  "seaweed-snack": {
    "이 아이템의 가장 큰 강점은?":
      "가장 큰 강점은 제주 해조류 원료 스토리와 천연 색소, 미네랄, 식이섬유를 결합해 일반 김스낵보다 프리미엄 기능성 스낵으로 포지셔닝할 수 있다는 점입니다.",
    "가장 먼저 보완할 부분은?":
      "가장 먼저 천연 색소를 시각적으로 보여줄 수 있는 컬러칩 또는 스낵바 형태로 MVP를 구체화하는 것이 좋습니다.",
    "브랜드 포지셔닝을 한 줄로 정리해줘":
      "제주 해조류 기반 천연 색소 기능성 스낵으로, 일반 간식보다 건강하고 건강기능식품보다 진입 부담이 낮은 포지션입니다.",
    "R&D 지원사업에 넣으려면 무엇을 강조해야 해?":
      "제주 해조류의 Blue Bio 원료성, 천연 색소 활용성, 미네랄·식이섬유 기반 건강 간식 스토리, 색소 분말 B2B 확장 가능성을 강조하는 것이 좋습니다."
  }
};

const AI_COACH_CALL_LIMIT = 2;

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
      ? recommendedMaterials
      : recommendedMaterials.filter((material) => material.bioType === state.currentFilter);
  const selected =
    recommendedMaterials.find((material) => material.id === state.selectedMaterialId) || visible[0];
  if (!state.selectedMaterialId || !visible.some((material) => material.id === state.selectedMaterialId)) {
    state.selectedMaterialId = selected?.id || null;
  }

  elements.ideaCount.textContent = `${visible.length}개 추천 원료`;
  elements.ideaGrid.classList.add("material-library");
  elements.ideaGrid.innerHTML = `
    <section class="bio-material-overview">
      ${bioMaterialGroups
        .filter((group) => state.currentFilter === "All" || group.id === state.currentFilter)
        .map(
          (group) => `
            <article style="--card-color:${bioColors[group.id]}">
              <span>${escapeHtml(group.label)}</span>
              <strong>${escapeHtml(group.title)}</strong>
              <p>${escapeHtml(group.description)}</p>
              <b>${escapeHtml(group.countLabel)}</b>
            </article>
          `
        )
        .join("")}
    </section>
    <section class="material-icon-grid">
      ${visible
        .map(
          (material) => `
            <button class="material-icon-card ${
              material.id === state.selectedMaterialId ? "active" : ""
            }" type="button" data-material-id="${material.id}" style="--card-color:${
              bioColors[material.bioType]
            }">
              <i aria-hidden="true">${material.icon}</i>
              <strong>${escapeHtml(material.name)}</strong>
              <span>미활용률 ${material.unusedRate}%</span>
            </button>
          `
        )
        .join("")}
    </section>
    ${selected ? renderMaterialDetail(selected) : ""}
  `;
}

function productPointPosition(status, index) {
  const base = {
    "블루오션": [76, 70],
    "성장 시장": [70, 50],
    "경쟁 시장": [76, 28],
    "레드오션": [78, 16],
    "데이터 부족": [34, 66]
  }[status] || [42, 52];
  return {
    left: Math.max(10, Math.min(90, base[0] + index * 4 - 4)),
    top: Math.max(12, Math.min(88, base[1] + (index % 2 ? 5 : -5)))
  };
}

function materialRecommendations(material) {
  const result = makeRecommendations({
    bio_category: bioMaterialGroups.find((group) => group.id === material.bioType)?.label,
    raw_material: material.canonical,
    target_function: "",
    preferred_product_category: null
  });
  return result.ok ? result.payload.recommendations.slice(0, 4) : [];
}

function renderMaterialDetail(material) {
  const recommendations = materialRecommendations(material);
  return `
    <section class="material-detail-panel" style="--card-color:${bioColors[material.bioType]}">
      <div class="material-usage-block">
        <div class="material-photo material-photo-${material.imageTone}">
          <span>${material.icon}</span>
        </div>
        <div class="material-core-info">
          <span>원료 활용도</span>
          <h2>${escapeHtml(material.name)}</h2>
          <p>${escapeHtml(material.summary)}</p>
          <dl>
            <div><dt>연간 발생량</dt><dd>${escapeHtml(material.annualAmount)}</dd></div>
            <div><dt>미활용률</dt><dd>${material.unusedRate}%</dd></div>
            <div><dt>활용도</dt><dd>${escapeHtml(material.utilization)}</dd></div>
          </dl>
        </div>
      </div>

      <div class="material-subsection">
        <div class="material-section-title"><span>RAW MATERIAL PROPERTY</span><h3>원료 특성</h3></div>
        <div class="component-card-grid">
          ${material.components
            .map(
              ([name, effect, detail]) => `
                <article>
                  <div class="component-card-front">
                    <span>대표 성분</span>
                    <strong>${escapeHtml(name)}</strong>
                    <b>${escapeHtml(effect)}</b>
                  </div>
                  <p>${escapeHtml(detail)}</p>
                </article>
              `
            )
            .join("")}
        </div>
      </div>

      <div class="material-subsection">
        <div class="material-section-title"><span>BLUE / RED OCEAN MAP</span><h3>레드·블루오션 제품 포지셔닝</h3></div>
        <div class="material-ocean-layout">
          <div class="material-ocean-map">
            <div class="ocean-zone ocean-zone-red">레드오션</div>
            <div class="ocean-zone ocean-zone-growth">성장 시장</div>
            <div class="ocean-zone ocean-zone-unknown">데이터 부족</div>
            <div class="ocean-zone ocean-zone-blue">블루오션</div>
            <span class="ocean-axis-y">경쟁 강도 ↑</span>
            <span class="ocean-axis-x">시장 성장성 →</span>
            ${recommendations
              .map((item, index) => {
                const pos = productPointPosition(item.market_status, index);
                return `
                  <button
                    class="material-product-point"
                    type="button"
                    style="--point-left:${pos.left}%;--point-top:${pos.top}%"
                    data-recommendation-title="${escapeHtml(item.title)}"
                    data-recommendation-material="${escapeHtml(item.raw_material)}"
                    data-recommendation-function="${escapeHtml(item.target_function)}"
                    data-recommendation-category="${escapeHtml(item.product_category)}"
                  >
                    <span></span><b>${escapeHtml(item.product_type)}</b>
                  </button>
                `;
              })
              .join("")}
          </div>
          <div class="material-product-list">
            ${recommendations
              .map(
                (item) => `
                  <article>
                    <span>${escapeHtml(item.market_status)} · ${escapeHtml(item.rd_entry_level)}</span>
                    <strong>${escapeHtml(item.title)}</strong>
                    <p>${escapeHtml(item.one_line_summary)}</p>
                    <button
                      type="button"
                      data-recommendation-title="${escapeHtml(item.title)}"
                      data-recommendation-material="${escapeHtml(item.raw_material)}"
                      data-recommendation-function="${escapeHtml(item.target_function)}"
                      data-recommendation-category="${escapeHtml(item.product_category)}"
                    >이 제품 4축 분석 →</button>
                  </article>
                `
              )
              .join("")}
          </div>
        </div>
        <p class="material-reason-line">
          이 원료의 사업화 추천 이유: 경쟁 업체가 상대적으로 적은 제품군을 선택할 수 있고, 제주 원료 차별성·시장 성장성·특허 공백 가능성을 함께 검토할 수 있습니다.
        </p>
      </div>

      <div class="material-subsection">
        <div class="material-section-title"><span>DATA BASED SIGNAL</span><h3>데이터 기반 분석</h3></div>
        <div class="material-stats-grid">
          <article><span>미활용률</span><strong>${material.unusedRate}%</strong></article>
          <article><span>특허</span><strong>${Number(material.stats.patents).toLocaleString("ko-KR")}건</strong></article>
          <article><span>논문</span><strong>${Number(material.stats.papers).toLocaleString("ko-KR")}편</strong></article>
          <article><span>시장규모</span><strong>${escapeHtml(material.stats.market)}</strong></article>
          <article><span>연평균 성장률</span><strong>${escapeHtml(material.stats.cagr)}</strong></article>
          <article><span>추천도</span><strong>${material.stats.score}점</strong></article>
        </div>
      </div>

      <div class="material-subsection">
        <div class="material-section-title"><span>POTENTIAL INDEX</span><h3>원료 활용잠재 지수</h3></div>
        <div class="potential-index-table">
          <div><strong>평가항목</strong><strong>비중</strong><strong>근거</strong></div>
          <div><span>미활용성</span><b>25%</b><p>아직 활용이 적은 원료인가?</p></div>
          <div><span>시장성</span><b>25%</b><p>시장이 성장하고 있는가?</p></div>
          <div><span>경쟁도</span><b>20%</b><p>경쟁기업이 적은가?</p></div>
          <div><span>기술성</span><b>15%</b><p>연구 및 개발 가능성이 충분한가?</p></div>
          <div><span>사업성</span><b>15%</b><p>제품화와 판매가 가능한가?</p></div>
        </div>
        <p class="material-score-basis">
          점수는 미활용률, 내부 mock 특허·논문 건수, 시장규모, 성장률, 추천 제품군의 경쟁 강도와 제주 원료 차별성을 함께 반영한 시연 데이터 기반 분석입니다.
        </p>
      </div>
    </section>
  `;
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
      const status = score >= 80 ? "우수" : score >= 70 ? "양호" : score >= 60 ? "검토" : "보완";
      return `
        <article class="score-card" style="--score-color:${meta.color};--score-width:${score}%">
          <div class="score-card-header">
            <span>${meta.label}<i>${status}</i></span>
            <strong>${score}</strong>
          </div>
          <div class="score-bar" aria-hidden="true"><span></span></div>
          <p>${escapeHtml(businessText(reasons[key] || meta.detail))}</p>
          <a href="#evidenceSummary">근거 요약 보기 ↓</a>
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

function renderPositioning(support, position) {
  const diagnosis = position?.label || support.diagnosis;
  const rationale = position?.description || support.rationale;
  document.querySelector("#positioningDiagnosis").textContent = businessText(diagnosis);
  document.querySelector("#pivotDiagnosis").textContent = businessText(diagnosis);
  document.querySelector("#pivotRationale").textContent = businessText(rationale);
  document.querySelector("#pivotAction").textContent = businessText(support.action);

  document.querySelector("#matrixPoints").innerHTML = support.scenarios
    .map((scenario) => {
      const entryEase =
        scenario.id === "current" && position
          ? position.entryEase
          : Math.round(
              Number(scenario.scores.market || 0) * 0.62 +
                Number(scenario.scores.supply || 0) * 0.38
            );
      const patentCompetition =
        scenario.id === "current" && position
          ? position.patentCompetition
          : 100 - Number(scenario.scores.patentSafety || 0);
      const left = Math.max(7, Math.min(93, entryEase));
      const top = Math.max(8, Math.min(92, 100 - patentCompetition));
      return `
        <button
          class="matrix-point ${scenario.id === "current" ? "current" : ""}"
          style="--point-left:${left}%;--point-top:${top}%"
          data-scenario-id="${scenario.id}"
          type="button"
          aria-label="${scenario.label}, 시장 진입 용이성 ${entryEase}, 특허 경쟁 강도 ${patentCompetition}"
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
      ? "출원 증가세: 시장 관심 상승 · 경쟁 강도 중간"
      : "출원 흐름 안정: 핵심 키워드 중심의 회피 전략 권장";
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
  const logicalFit = state.result.classification?.logicalFit?.score || 0;
  const weighted = Math.min(
    100,
    entries.reduce(
      (sum, [key, value]) => sum + state.result.scores[key] * (value / 100),
      0
    ) + logicalFit * 0.05
  );
  document.querySelector("#simulatedScore").textContent = weighted.toFixed(1);
  document.querySelector("#weightTotal").textContent =
    totalWeight === 95
      ? "가변 가중치 95% + 논리적 적합성 5% · 감점/상한 적용 전"
      : `가변 가중치 ${totalWeight}% + 논리적 적합성 5% · 감점/상한 적용 전`;
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
  const decision = state.result?.regulatoryDecision;
  if (decision) {
    document.querySelector("#regulationJudgement").textContent = decision.summary;
    document.querySelector("#freshnessBadges").innerHTML = [
      ["제품화 경로", decision.productPath],
      ["리스크", decision.riskLevel],
      ["초기 MVP", decision.mvpFormats.join(" · ")]
    ]
      .map(
        ([label, value]) => `
          <span>
            ${escapeHtml(label)} <strong>${escapeHtml(value)}</strong>
          </span>
        `
      )
      .join("");
    document.querySelector("#regulationList").innerHTML = `
      <div class="regulation-table-row regulation-table-head">
        <span>판단 항목</span><span>결과</span><span>근거</span><span>실행 가이드</span>
      </div>
      ${decision.rows
        .map(
          (row) => `
            <div class="regulation-table-row">
              <strong>${escapeHtml(row.item)}</strong>
              <span>${escapeHtml(row.result)}</span>
              <p>${escapeHtml(row.evidence)}</p>
              <p>${escapeHtml(row.guide)}</p>
            </div>
          `
        )
        .join("")}
    `;
    return;
  }

  const statusLabels = {
    pass: "제품화 가능성 높음",
    review: "인허가 리스크 중간",
    needed: "보완 권장"
  };

  document.querySelector("#regulationList").innerHTML = checklist
    .map(
      (item) => `
        <div class="regulation-row">
          <span class="regulation-status ${item.status}">${statusLabels[item.status]}</span>
          <div><span>${escapeHtml(businessText(item.item))}</span><strong>${escapeHtml(businessText(item.value))}</strong></div>
          <p>${escapeHtml(businessText(item.action))}</p>
        </div>
      `
    )
    .join("");
  const summarizedFreshness = [
    ...new Map(
      freshness.map((item) => {
        const source = String(item.source || "");
        const label = /논문|OpenAlex|Crossref/i.test(source)
          ? "논문 근거"
          : /식약처|MFDS/i.test(source)
            ? "식약처 원료 DB"
            : /KIPRIS|특허/i.test(source)
              ? "특허 트렌드"
              : "공공데이터";
        return [label, { ...item, source: label }];
      })
    ).values()
  ];
  document.querySelector("#freshnessBadges").innerHTML = summarizedFreshness
    .map(
      (item) => `
        <span>
          ${escapeHtml(item.source)} <strong>${escapeHtml(businessText(item.updatedAt))}</strong>
        </span>
      `
    )
    .join("");

  const category = state.result?.extraction?.categories?.[0] || "";
  const judgement =
    category === "화장품"
      ? "화장품 원료 DB 기준으로 제품화 검토 가능성이 있습니다. 표준 원료명과 CAS No. 식별 결과, 사용제한 리스크를 함께 반영했습니다."
      : category === "건강기능식품"
        ? "기능성 표시 제품은 인허가 난이도가 높아, 초기에는 일반 기능성 식품·음료 형태의 MVP가 적합합니다."
        : category === "기능성 식품/음료" || /식품|스낵/.test(category)
          ? "식품 원료 사용 가능성을 중심으로 제품화 경로를 판단하며, 천연 색소와 기능성 표현의 표시광고 리스크를 반영했습니다."
          : category === "친환경 소재/바이오 플라스틱"
            ? "식약처 대상이 아닌 환경·산업소재 기준으로 제품화 경로를 분리해 판단했습니다."
            : "현재 제품군의 적용 규정과 제품화 경로를 기준으로 리스크를 구분했습니다.";
  document.querySelector("#regulationJudgement").textContent = judgement;
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
      : "AI 분류 보완 권장";
  document.querySelector("#resultIngredient").textContent = businessText(ingredientLabel);
  document.querySelector("#resultIngredientCategory").textContent = businessText(classification.ingredientCategory);
  document.querySelector("#resultBioType").textContent = businessText(classification.bioType);
  document.querySelector("#resultCategories").textContent = businessText(joinOrFallback(extraction.categories));
  document.querySelector("#resultProductForm").textContent = businessText(classification.productForm);
  document.querySelector("#resultFunctions").textContent = businessText(
    joinOrFallback(classification.functionCandidates, "기능 후보 보완 권장")
  );
  document.querySelector("#logicalFitLabel").textContent = businessText(classification.logicalFit.label);
  document.querySelector("#logicalFitScore").textContent = `${classification.logicalFit.score} / 100`;
  document.querySelector("#logicalFitReason").textContent =
    [
      classification.mappingReason
        ? `Gemini 매핑: ${classification.mappingReason}`
        : "",
      ...classification.logicalFit.reasons
    ]
      .filter(Boolean)
      .map(businessText)
      .join(" ");
  document.querySelector("#deductionList").innerHTML = scores.deductions.length
    ? scores.deductions.map((item) => `<li>${escapeHtml(businessText(item))}</li>`).join("")
    : "<li>적용된 감점 없음</li>";
  document.querySelector("#validationRequired").textContent = validation.required
    ? "보완 권장"
    : "근거 기반 적합";
  document.querySelector("#validationList").innerHTML = validation.items
    .map((item) => `<li>${escapeHtml(businessText(item))}</li>`)
    .join("");
  document.querySelector("#recommendationList").innerHTML = recommendations
    .map((item) => `<li>${escapeHtml(businessText(item))}</li>`)
    .join("");
}

function renderExplanation(explanation) {
  const groups = [
    ["강점", explanation.strengths],
    ["약점", explanation.weaknesses],
    ["개선 방향", explanation.improvements],
    ["보완 방향", explanation.review]
  ];

  document.querySelector("#aiSummary").textContent = businessText(explanation.summary);
  document.querySelector("#explanationGrid").innerHTML = groups
    .map(
      ([title, items]) => `
        <div class="explanation-group">
          <h3>${title}</h3>
          <ul>${(items || []).map((item) => `<li>${escapeHtml(businessText(item))}</li>`).join("")}</ul>
        </div>
      `
    )
    .join("");
}

function evidenceCounts(result) {
  if (result.demoProfile?.evidence?.counts) {
    return result.demoProfile.evidence.counts;
  }
  const sources = result.dataSources || [];
  const publicData = sources.filter(
    (source) =>
      !["papers", "mfds"].includes(source.id) &&
      source.status !== "비대상"
  ).length;
  const paper = Number(result.paperEvidence?.totalCount ?? result.evidence?.paperCount ?? 0);
  const mfds = Number(
    sources.some((source) => source.id === "mfds" && source.status === "확인") ||
      result.regulatoryChecklist?.some((item) => item.status === "pass")
  );
  const patent = Number(result.evidence?.patentCount || 0);
  return { publicData, paper, mfds, patent };
}

function renderEnterpriseDiagnosis(diagnosis) {
  const container = document.querySelector("#enterpriseContext");
  if (!diagnosis) {
    container.hidden = true;
    return;
  }
  container.hidden = false;
  document.querySelector("#enterpriseStage").textContent = diagnosis.stage;
  document.querySelector("#enterpriseSummary").textContent = diagnosis.summary;
  document.querySelector("#enterpriseGuidance").textContent = diagnosis.applicationGuidance;
}

function renderCopilot(copilot, result) {
  const fallbackAxis = Object.entries(axisMeta)
    .map(([key, meta]) => [meta.label, result.scores[key]])
    .sort((a, b) => a[1] - b[1])[0];
  const resolved = copilot || {
    bottleneck: fallbackAxis[0],
    score: fallbackAxis[1],
    cause: "활용 근거 요약에서 가장 낮은 축을 우선 보완하는 것이 적합합니다.",
    actions: ["공공데이터와 근거 요약을 다시 점검", "분야별 전문가에게 1차 검토 요청"],
    duration: "근거 수집 후 산정",
    notice: "코파일럿은 다음 검토 순서를 정리하며 개발 여부를 결정하지 않습니다."
  };
  document.querySelector("#copilotBottleneck").textContent = resolved.bottleneck;
  document.querySelector("#copilotScore").textContent = `${resolved.score}점`;
  document.querySelector("#copilotCause").textContent = businessText(resolved.cause);
  document.querySelector("#copilotActions").innerHTML = resolved.actions
    .map((item) => `<li>${escapeHtml(businessText(item))}</li>`)
    .join("");
  document.querySelector("#copilotDuration").textContent = resolved.duration;
  document.querySelector("#copilotNotice").textContent = businessText(resolved.notice);
}

function fallbackCommercialIntelligence(result) {
  const score = result.scores.total;
  const ingredient = result.extraction.ingredient || "선택 원료";
  const category = result.extraction.categories[0] || "제품군 미지정";
  return {
    readiness: {
      score,
      grade: score >= 78 ? "B+" : score >= 68 ? "B" : "C+",
      businessPosition: "근거 보강형",
      recommendedCategory: category,
      bioType: result.classification.bioType
    },
    decomposition: {
      original: result.idea,
      ingredient,
      functions: result.extraction.functions,
      category
    },
    marketPosition: {
      entryEase: Math.round((result.scores.market + result.scores.supply) / 2),
      patentCompetition: 100 - result.scores.patentSafety,
      label: "준레드오션",
      description: "활용 근거 요약으로 시장 진입성과 특허 경쟁 강도를 산출한 AI 예측입니다."
    },
    differentiationSummary: [],
    differentiationAxes: [],
    brandAxes: [
      { label: "지역성", score: 60 },
      { label: "기능성 근거", score: result.scores.technical },
      { label: "시장 진입성", score: result.scores.market },
      { label: "규제 안정성", score: 50 }
    ],
    brandComparisons: [],
    axisDetails: Object.entries(axisMeta).map(([key, meta]) => ({
      key,
      label: meta.label,
      score: result.scores[key],
      status: result.scores[key] >= 70 ? "양호" : "보완",
      reason: result.scoreReasons[key] || meta.detail,
      data: "시연 데이터 기반 분석",
      gap: "핵심 근거 보완 권장"
    })),
    alternatives: result.decisionSupport.scenarios.map((scenario) => ({
      name: scenario.category,
      advantage: "동일 원료를 인접 제품군으로 확장",
      risk: "규제와 수요 재검증 필요",
      delta: Math.round((scenario.scores.total - score) * 10) / 10,
      estimatedScore: scenario.scores.total,
      situation: "현재 제품군의 경쟁밀도가 높을 때"
    })),
    startupPath: [
      { phase: "0-4주", title: "Evidence Lock", action: "핵심 근거와 원료 공급처 확정" },
      { phase: "1-3개월", title: "Prototype Validation", action: "시제품과 고객 반응 검증" },
      { phase: "3-6개월", title: "Go-to-Market Pilot", action: "소규모 판매·공급 실증" }
    ]
  };
}

function detectDemoProfile(result) {
  const extraction = result.extraction || {};
  const text = [
    result.idea,
    extraction.ingredient,
    extraction.rawIngredient,
    extraction.standardIngredient,
    ...(extraction.categories || []),
    ...(extraction.functions || [])
  ]
    .filter(Boolean)
    .join(" ");
  if (/감귤|귤|진피|시트러스/.test(text) && /화장품|피부|세럼|마스크팩|크림/.test(text)) {
    return { id: "citrus-cosmetic", profile: DEMO_PROFILES["citrus-cosmetic"] };
  }
  if (
    /해조류|해조|감태|김|미역|톳|모자반|다시마|파래|색소/.test(text) &&
    /스낵|간식|식품|음료|색소|착색|영양/.test(text)
  ) {
    return { id: "seaweed-snack", profile: DEMO_PROFILES["seaweed-snack"] };
  }
  return null;
}

function scenarioScoresFromPosition(baseScores, total, entryEase, patentCompetition) {
  const market = clampPercent(entryEase);
  const supply = clampPercent(entryEase + 4);
  const patentSafety = clampPercent(100 - patentCompetition);
  return {
    ...baseScores,
    total,
    market,
    supply,
    patentSafety
  };
}

function applyDemoProfile(result) {
  const detected = detectDemoProfile(result);
  if (!detected) return result;

  const { id, profile } = detected;
  const baseIntelligence = result.commercialIntelligence || fallbackCommercialIntelligence(result);
  const scores = {
    ...result.scores,
    total: profile.score
  };
  const marketPosition = {
    entryEase: profile.marketPosition.entryEase,
    patentCompetition: profile.marketPosition.patentCompetition,
    label: profile.marketPosition.label,
    description: profile.marketPosition.description
  };
  const alternatives = profile.whatIf.map((item) => ({
    ...item,
    advantage: item.reason,
    estimatedScore: item.score
  }));
  const currentScenario = {
    id: "current",
    label: "현재 아이템",
    category: baseIntelligence.readiness?.recommendedCategory || result.extraction.categories?.[0] || "현재 제품군",
    scores: scenarioScoresFromPosition(
      scores,
      profile.score,
      profile.marketPosition.entryEase,
      profile.marketPosition.patentCompetition
    )
  };
  const scenarioPoints = [
    currentScenario,
    ...profile.whatIf.map((item, index) => ({
      id: `demo-${index + 1}`,
      label: item.recommendation,
      category: item.name,
      scores: scenarioScoresFromPosition(
        scores,
        item.score,
        profile.marketPosition.entryEase + 2 + index * 3,
        Math.max(25, profile.marketPosition.patentCompetition - 3 + index * 2)
      )
    }))
  ];
  const commercialIntelligence = {
    ...baseIntelligence,
    readiness: {
      ...baseIntelligence.readiness,
      ...profile.readiness,
      score: profile.score
    },
    marketPosition,
    differentiationSummary: profile.differentiationSummary,
    differentiationAxes: profile.differentiationSummary,
    brandComparisons: profile.brandComparisons,
    alternatives,
    whatIfSummary: profile.whatIfSummary,
    conclusionCards: profile.conclusionCards,
    entryStrategy: profile.conclusionCards[2]?.value,
    startupPath: baseIntelligence.startupPath?.length
      ? baseIntelligence.startupPath
      : [
          { phase: "0-4주", title: "MVP Narrowing", action: profile.conclusionCards[2]?.value },
          { phase: "1-3개월", title: "Market Test", action: "소비자 반응과 가격 수용성을 작게 검증" },
          { phase: "3-6개월", title: "Evidence Package", action: "지원사업·파트너 제안용 근거 패키지 정리" }
        ]
  };

  return {
    ...result,
    demoProfileId: id,
    demoProfile: profile,
    scores,
    evidence: {
      ...(result.evidence || {}),
      patentCount: profile.evidence.counts.patent,
      recentPatentCount: Math.max(1, Math.round(profile.evidence.counts.patent * 0.42))
    },
    evidenceSummary: {
      ...(result.evidenceSummary || {}),
      status: profile.evidence.label
    },
    commercialIntelligence,
    decisionSupport: {
      ...(result.decisionSupport || {}),
      diagnosis: profile.marketPosition.label,
      rationale: profile.marketPosition.description,
      action: profile.whatIfSummary,
      recommendedScenarioId: "current",
      scenarios: scenarioPoints,
      patentTrend: profile.patentTrend
    },
    regulatoryDecision: profile.regulatoryDecision,
    recommendations: [
      profile.conclusionCards[2]?.value,
      ...(result.recommendations || []).filter(Boolean)
    ],
    copilot: {
      ...(result.copilot || {}),
      bottleneck: id === "citrus-cosmetic" ? "제형 구체화" : "MVP 제품 형태",
      score: id === "citrus-cosmetic" ? 81 : 79,
      cause:
        id === "citrus-cosmetic"
          ? "화장품 범위를 세럼·마스크팩으로 좁히면 메시지와 타깃 고객이 선명해집니다."
          : "일반 스낵 MVP로 먼저 검증하면 인증 부담을 낮추고 색감 차별성을 빠르게 보여줄 수 있습니다.",
      actions: [
        profile.conclusionCards[2]?.value,
        profile.whatIf[0]?.situation
      ].filter(Boolean),
      duration: "2~4주 MVP 구체화"
    }
  };
}

function brandPositioningFor(result, intelligence) {
  if (result.demoProfile?.brandPositioning) return result.demoProfile.brandPositioning;

  const category = result.extraction.categories[0] || "";
  const ingredient = result.extraction.ingredient || "";
  const axes = intelligence.differentiationAxes || [];
  const scoreOf = (key, fallback) =>
    Number(axes.find((axis) => axis.key === key)?.score ?? fallback);
  const locality = scoreOf("locality", 60);
  const evidence = scoreOf("evidence", result.scores.technical);
  const productization = scoreOf("productization", result.scores.market);
  const current = {
    label: "현재 아이템",
    type: "AI 추천 포지션",
    mark: "ITEM",
    tone: "current",
    current: true,
    x: clampPercent(34 + productization * 0.42),
    y: clampPercent(25 + evidence * 0.65)
  };

  if (category === "화장품") {
    if (/감귤|귤|진피|시트러스/.test(ingredient)) {
      return {
        xLeft: "대중성",
        xRight: "프리미엄성",
        yTop: "기능성 근거 중심",
        yBottom: "원료 스토리 중심",
        axisSummary: "X축 대중성 ↔ 프리미엄성 · Y축 원료 스토리 중심 ↔ 기능성 근거 중심",
        points: [
          { label: "이니스프리", type: "대중 클린뷰티", mark: "INN", tone: "green", x: 55, y: 65 },
          { label: "제주 로컬 감귤 화장품", type: "로컬 원료 브랜드", mark: "JEJU", tone: "orange", x: 42, y: 58 },
          { label: "더마 기능성 브랜드", type: "고기능성 더마", mark: "DERMA", tone: "purple", x: 78, y: 88 },
          { label: "원료 B2B 소재형", type: "원료 공급형", mark: "B2B", tone: "navy", x: 62, y: 76 },
          {
            ...current,
            type: "제주 부산물 클린뷰티",
            mark: "ITEM",
            x: 68,
            y: 78
          }
        ],
        insight:
          "현재 아이템은 일반 자연주의 화장품보다 기능성 근거가 강하고, 더마 기능성 브랜드보다 제주 원료 스토리와 자원순환 메시지가 강한 포지션입니다. ‘제주 감귤 부산물 기반 클린뷰티 기능성 원료’로 포지셔닝하는 것이 적합합니다."
      };
    }

    return {
      xLeft: "대중성",
      xRight: "프리미엄성",
      yTop: "기능성·효능 근거",
      yBottom: "자연주의·원료 스토리",
      axisSummary: "X축 대중성 ↔ 프리미엄성 · Y축 원료 스토리 중심 ↔ 기능성 근거 중심",
      points: [
        { label: "일반 자연주의", type: "대중 자연주의", mark: "NAT", tone: "green", x: 24, y: 34 },
        { label: "클린뷰티 유형", type: "클린뷰티", mark: "CLEAN", tone: "mint", x: 44, y: 60 },
        { label: "더마 기능성", type: "고기능성 더마", mark: "DERMA", tone: "purple", x: 80, y: 88 },
        { label: "원료 B2B", type: "원료 공급형", mark: "B2B", tone: "navy", x: 66, y: 76 },
        { label: "로컬 원료", type: "로컬 원료 브랜드", mark: "LOCAL", tone: "orange", x: 35, y: 56 },
        { ...current, type: "근거 기반 클린뷰티", mark: "ITEM" }
      ],
      insight: `본 아이템은 일반 자연주의 유형보다 지역 원료 스토리와 기능 근거를 함께 제시할 수 있고, 고기능성 더마 유형보다 초기 진입 부담이 낮은 위치입니다. ${locality >= 75 ? "지역 부산물 기반 클린뷰티 원료" : "근거 기반 클린뷰티"}로 포지셔닝하는 것이 적합합니다.`
    };
  }

  if (category === "친환경 소재/바이오 플라스틱") {
    return {
      xLeft: "원가 경쟁력",
      xRight: "고기능성",
      yTop: "ESG·자원순환 소재",
      yBottom: "일반 소재",
      axisSummary: "X축 원가 경쟁력 ↔ 고기능성 · Y축 일반 소재 ↔ ESG/자원순환 소재",
      points: [
        { label: "범용 소재", type: "일반 소재", mark: "GEN", tone: "slate", x: 22, y: 22 },
        { label: "저가 재생소재", type: "원가 경쟁형", mark: "REC", tone: "mint", x: 35, y: 48 },
        { label: "고기능 소재", type: "기능 강화형", mark: "TECH", tone: "purple", x: 82, y: 58 },
        { label: "ESG 소재", type: "자원순환형", mark: "ESG", tone: "green", x: 58, y: 82 },
        { label: "로컬 순환소재", type: "지역 순환형", mark: "LOCAL", tone: "orange", x: 44, y: 88 },
        { ...current, type: "로컬 ESG 소재", mark: "ITEM", y: clampPercent(25 + scoreOf("esg", 65) * 0.65) }
      ],
      insight: "현재 아이템은 범용 소재보다 자원순환 스토리가 뚜렷하고, 고기능 소재보다 지역 조달 차별성이 강한 위치입니다. 로컬 부산물 기반 ESG 소재로 우선 진입하는 전략이 적합합니다."
    };
  }

  return {
    xLeft: "일상 간식성",
    xRight: "기능성 강화",
    yTop: "프리미엄 건강식",
    yBottom: "대중 식품",
    axisSummary: "X축 일상 간식성 ↔ 기능성 강화 · Y축 대중 식품 ↔ 프리미엄 건강식",
    points: [
      { label: "일반 식품", type: "대중 식품", mark: "FOOD", tone: "slate", x: 20, y: 24 },
      { label: "클린라벨 유형", type: "클린 스낵", mark: "CLEAN", tone: "mint", x: 42, y: 58 },
      { label: "기능성 식품", type: "기능성 강화", mark: "FUNC", tone: "purple", x: 78, y: 76 },
      { label: "원료 B2B", type: "원료 공급형", mark: "B2B", tone: "navy", x: 70, y: 52 },
      { label: "로컬 식품", type: "지역 원료형", mark: "LOCAL", tone: "orange", x: 34, y: 44 },
      { ...current, type: "프리미엄 기능성 제품", mark: "ITEM" }
    ],
    insight: "현재 아이템은 일반 식품보다 기능 근거와 지역 원료 스토리가 강하고, 고기능성 제품보다 일상 소비 진입성이 높은 위치입니다. 로컬 원료 기반 프리미엄 기능성 제품으로 포지셔닝하는 것이 적합합니다."
  };
}

function renderBrandMap(container, map) {
  const tones = new Set(["green", "orange", "purple", "navy", "mint", "slate", "current"]);
  container.innerHTML = `
    <span class="brand-axis-label brand-y-top">${escapeHtml(map.yTop)}</span>
    <span class="brand-axis-label brand-y-bottom">${escapeHtml(map.yBottom)}</span>
    <span class="brand-axis-label brand-x-left">${escapeHtml(map.xLeft)}</span>
    <span class="brand-axis-label brand-x-right">${escapeHtml(map.xRight)}</span>
    <div class="brand-map-cross" aria-hidden="true"></div>
    <div class="brand-map-points">
      ${map.points
        .map((point) => {
          const tone = tones.has(point.tone) ? point.tone : "slate";
          const renderedY = clampPercent(100 - Number(point.y));
          return `
            <i class="brand-map-point brand-map-point--${tone} ${point.current ? "current" : ""}"
               style="--brand-x:${clampPercent(Number(point.x))}%;--brand-y:${renderedY}%">
              <span class="brand-logo-mark">${escapeHtml(point.mark || point.label.slice(0, 4))}</span>
              <b>${escapeHtml(point.label)}</b>
              <small>${escapeHtml(point.type || "")}</small>
            </i>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderBrandPositioning(result, intelligence) {
  const map = brandPositioningFor(result, intelligence);
  renderBrandMap(document.querySelector("#brandPositioningMap"), map);
  const detailMap = document.querySelector("#brandPositioningDetailMap");
  if (detailMap) renderBrandMap(detailMap, map);
  const axisSummary = document.querySelector("#brandPositioningAxisSummary");
  if (axisSummary) axisSummary.textContent = map.axisSummary;
  document.querySelector("#brandPositioningInsight").textContent = map.insight;
  document.querySelector("#brandDetailInsight").textContent =
    `AI 예측 · 시연 데이터 기반 분석. ${map.insight}`;
}

function renderCommercialIntelligence(result) {
  const intelligence =
    result.commercialIntelligence || fallbackCommercialIntelligence(result);
  const decomposition = intelligence.decomposition;
  document.querySelector("#dashboardOriginal").textContent =
    `“${decomposition.original || result.idea}”`;
  document.querySelector("#dashboardIngredient").textContent = businessText(decomposition.ingredient);
  document.querySelector("#dashboardFunctions").textContent = businessText(
    joinOrFallback(decomposition.functions)
  );
  document.querySelector("#dashboardCategory").textContent = businessText(decomposition.category);
  document.querySelector("#dashboardGrade").textContent = intelligence.readiness.grade;
  document.querySelector("#dashboardPosition").textContent =
    businessText(intelligence.readiness.businessPosition);
  document.querySelector("#dashboardRecommendedCategory").textContent =
    businessText(intelligence.readiness.recommendedCategory);
  document.querySelector("#dashboardBioType").textContent =
    businessText(intelligence.readiness.bioType);
  const conclusionCards =
    intelligence.conclusionCards || [
      { label: "최종 판단", value: intelligence.readiness.businessPosition },
      {
        label: "가장 강한 차별성",
        value:
          intelligence.differentiationSummary?.[0]?.detail ||
          "차별화 포인트를 제품 메시지로 전환할 수 있습니다."
      },
      {
        label: "다음 액션",
        value:
          intelligence.entryStrategy ||
          result.recommendations?.[0] ||
          "MVP 제품 형태를 좁혀 시장 반응을 확인"
      }
    ];
  document.querySelector("#dashboardConclusionGrid").innerHTML = conclusionCards
    .map(
      (card) => `
        <article>
          <span>${escapeHtml(card.label)}</span>
          <strong>${escapeHtml(businessText(card.value))}</strong>
        </article>
      `
    )
    .join("");

  const position = intelligence.marketPosition;
  document.querySelector("#marketEntryEase").textContent = position.entryEase;
  document.querySelector("#patentCompetition").textContent = position.patentCompetition;
  document.querySelector("#dashboardPositionLabel").textContent = businessText(position.label);
  document.querySelector("#dashboardPositionInsight").textContent = businessText(position.description);
  const point = document.querySelector("#dashboardPositionPoint");
  point.style.setProperty("--position-left", `${Math.max(5, Math.min(95, position.entryEase))}%`);
  point.style.setProperty(
    "--position-top",
    `${Math.max(5, Math.min(95, 100 - position.patentCompetition))}%`
  );

  document.querySelector("#differentiationSummary").innerHTML =
    intelligence.differentiationSummary.length
      ? intelligence.differentiationSummary
          .map(
            (item) => `
              <div>
                <span>${escapeHtml(businessText(item.label))}</span>
                <strong>${item.score}</strong>
                <i>${escapeHtml(businessText(item.status))}</i>
              </div>
            `
          )
          .join("")
      : "<p>AI 예측으로 제품화 차별 포인트를 정리했습니다.</p>";

  renderBrandPositioning(result, intelligence);

  const counts = evidenceCounts(result);
  const evidenceByAxis = {
    technical: `논문 근거 ${counts.paper.toLocaleString("ko-KR")}건`,
    market: `공공데이터 ${counts.publicData.toLocaleString("ko-KR")}건`,
    patentSafety: `특허 트렌드 ${counts.patent.toLocaleString("ko-KR")}건`,
    supply: `공공데이터 ${counts.publicData.toLocaleString("ko-KR")}건`
  };

  document.querySelector("#axisDetailList").innerHTML = intelligence.axisDetails
    .map(
      (axis) => `
        <article class="axis-detail" style="--axis-color:${axisMeta[axis.key]?.color || "#176b50"}">
          <div class="axis-detail-score">
            <span>${escapeHtml(axis.label)}</span>
            <strong>${axis.score}</strong>
            <i>${escapeHtml(axis.status)}</i>
          </div>
          <div><span>판단 이유</span><p>${escapeHtml(businessText(axis.reason))}</p></div>
          <div><span>근거 요약</span><p>${escapeHtml(evidenceByAxis[axis.key] || "활용 근거 요약")}</p></div>
          <div><span>사용 근거 수</span><p>${Number(
            axis.key === "technical"
              ? counts.paper
              : axis.key === "patentSafety"
                ? counts.patent
                : counts.publicData
          ).toLocaleString("ko-KR")}건</p></div>
          <div><span>보완 항목</span><p>${escapeHtml(businessText(axis.gap))}</p></div>
          <a href="#evidenceSummary">근거 요약 보기 ↓</a>
        </article>
      `
    )
    .join("");

  document.querySelector("#brandComparisonTable").innerHTML = `
    <div class="report-table-row report-table-head">
      <span>비교 유형</span><span>공통점</span><span>차이점</span><span>내 아이템의 우위</span><span>보완 방향</span>
    </div>
    ${intelligence.brandComparisons
      .map(
        (item) => `
          <div class="report-table-row">
            <strong>${escapeHtml(businessText(item.type))}</strong>
            <span>${escapeHtml(businessText(item.commonality))}</span>
            <span>${escapeHtml(businessText(item.difference))}</span>
            <span>${escapeHtml(businessText(item.advantage))}</span>
            <span>${escapeHtml(businessText(item.gap))}</span>
          </div>
        `
      )
      .join("")}
  `;

  document.querySelector("#differentiationDetailList").innerHTML =
    intelligence.differentiationAxes
      .map(
        (axis) => `
          <article style="--detail-score:${axis.score}%">
            <div><span>${escapeHtml(axis.label)}</span><strong>${axis.score}</strong></div>
            <i><b></b></i>
            <p>${escapeHtml(businessText(axis.detail))}</p>
          </article>
        `
      )
      .join("");

  document.querySelector("#whatIfTable").innerHTML = `
    <div class="report-table-row report-table-head">
      <span>전략 시나리오</span><span>점수가 오르는 이유</span><span>새로 생기는 리스크</span><span>예상 점수</span><span>추천 판단</span>
    </div>
    ${intelligence.alternatives
      .map(
        (item) => `
          <div class="report-table-row">
            <strong>${escapeHtml(businessText(item.name))}</strong>
            <span>${escapeHtml(businessText(item.reason || item.advantage))}</span>
            <span>${escapeHtml(businessText(item.risk))}</span>
            <span class="score-delta ${item.delta >= 0 ? "positive" : "negative"}">
              ${Number(item.estimatedScore || item.score).toFixed(1)}점 <small>${item.delta >= 0 ? "+" : ""}${Number(item.delta).toFixed(1)}</small>
            </span>
            <span><b>${escapeHtml(businessText(item.recommendation || "확장 옵션"))}</b><br>${escapeHtml(businessText(item.situation))}</span>
          </div>
        `
      )
      .join("")}
  `;
  document.querySelector("#whatIfSummary").textContent = businessText(
    intelligence.whatIfSummary ||
      "대체안은 현재 아이디어를 버리는 선택지가 아니라, 제품군을 구체화했을 때의 점수 향상 시나리오입니다."
  );

  document.querySelector("#startupPath").innerHTML = intelligence.startupPath
    .map(
      (step) => `
        <div>
          <span>${escapeHtml(step.phase)}</span>
          <strong>${escapeHtml(step.title)}</strong>
          <p>${escapeHtml(businessText(step.action))}</p>
        </div>
      `
    )
    .join("");

  const recentRatio = result.evidence.patentCount
    ? Math.round((result.evidence.recentPatentCount / Math.max(1, result.evidence.patentCount)) * 100)
    : 0;
  document.querySelector("#patentDetailHeadline").textContent =
    `${position.label} · 특허 경쟁 강도 ${position.patentCompetition}`;
  document.querySelector("#patentDetailText").textContent =
    `최근 출원 증가세가 있어 시장 관심은 높습니다. 유사 특허 ${result.evidence.patentCount}건 중 최근 출원은 ${result.evidence.recentPatentCount}건(약 ${recentRatio}%)이며, 특허안전성에는 경쟁 신호가 반영되었습니다. 원료 스토리, 제형, 기능 키워드에서 회피·차별화 전략을 권장합니다.`;

  document.querySelector("#overviewOriginal").textContent = result.idea;
  document.querySelector("#overviewBusinessPosition").textContent = businessText(position.label);
  document.querySelector("#overviewEntryStrategy").textContent = businessText(
    intelligence.entryStrategy || result.recommendations?.[0] || "우선 제품군 중심의 MVP 진입"
  );

  const strongest = [...(intelligence.differentiationAxes || [])].sort(
    (a, b) => b.score - a.score
  )[0];
  document.querySelector("#founderRecommendedCategory").textContent =
    businessText(intelligence.readiness.recommendedCategory);
  document.querySelector("#founderStrongestDifferentiator").textContent =
    strongest ? `${businessText(strongest.label)} ${strongest.score}점` : "제품화 가능성";
  document.querySelector("#founderFirstAction").textContent = businessText(
    result.copilot?.actions?.[0] || result.recommendations?.[0] || "핵심 근거와 MVP 사양 확정"
  );
}

function renderSourceEvidence(result) {
  const summary = result.evidenceSummary;
  const counts = evidenceCounts(result);
  document.querySelector("#evidenceStatus").textContent =
    businessText(summary?.status || "시연 데이터 기반 분석");
  document.querySelector("#evidenceStatusDashboard").textContent =
    businessText(summary?.status || "시연 데이터 기반 분석");
  const items =
    result.demoProfile?.evidence?.items || [
      ["공공데이터", counts.publicData, "지역 원료·공급·시장 보조 근거"],
      ["논문 근거", counts.paper, "기능성과 최근 연구 흐름"],
      ["식약처 원료 DB", counts.mfds, "표준 원료 식별 및 제품화 판단"],
      ["특허 트렌드", counts.patent, "키워드 기반 최근 5년 출원 신호"]
    ];
  document.querySelector("#evidenceSummaryGrid").innerHTML = items
    .map(
      ([label, count, detail]) => `
        <article>
          <span>${label}</span>
          <strong>${Number(count).toLocaleString("ko-KR")}건</strong>
          <p>${detail}</p>
        </article>
      `
    )
    .join("");
}

function renderAlgorithm(result) {
  const formulas = result.formulas || {};
  const labels = {
    technical: "기술성",
    market: "시장성",
    patentSafety: "특허안전성",
    supply: "공급안정성",
    total: "종합점수"
  };
  document.querySelector("#algorithmFormulaList").innerHTML = Object.entries(formulas)
    .map(
      ([key, formula]) => `
        <div class="formula-item">
          <strong>${labels[key]}</strong>
          <span>${formula}</span>
        </div>
      `
    )
    .join("");

  const counts = evidenceCounts(result);
  document.querySelector("#algorithmEvidenceSummary").textContent = result.demoProfile?.evidence?.items
    ? result.demoProfile.evidence.items
        .map(([label, count]) => `${label} ${Number(count).toLocaleString("ko-KR")}건`)
        .join(" · ")
    : `공공데이터 ${counts.publicData}건 · 논문 근거 ${counts.paper.toLocaleString("ko-KR")}건 · 식약처 원료 DB ${counts.mfds}건 · 특허 트렌드 ${counts.patent}건`;
  const why = [
    `기술성 ${result.scores.technical}점: 기술성은 논문 근거와 기능 키워드 일치도를 반영해 산정되었습니다.`,
    `시장성 ${result.scores.market}점: 시장성은 제품군 적합성과 초기 진입 가능성을 반영했습니다.`,
    `특허안전성 ${result.scores.patentSafety}점: 특허안전성은 최근 출원 흐름과 경쟁 강도를 반영했습니다.`,
    `공급안정성 ${result.scores.supply}점: 공급안정성은 제주 원료 공공데이터와 원료 활용 가능성을 반영했습니다.`,
    `논리적 적합성 ${result.classification?.logicalFit?.score ?? 0}점: 논리적 적합성은 원료·기능·제품군의 연결성을 기준으로 산정했습니다.`
  ];
  if (result.scores.deductions?.length) {
    why.push(
      `보완 필요 감점: ${result.scores.deductions.map(businessText).join(" · ")}`
    );
  } else {
    why.push("보완 필요 감점: 적용 항목 없음");
  }
  document.querySelector("#algorithmWhyList").innerHTML = why
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");
}

function currentCoachProfileId(result = state.result) {
  if (!result) return "default";
  if (result.demoProfileId) return result.demoProfileId;
  const text = [
    result.idea,
    result.extraction?.ingredient,
    ...(result.extraction?.categories || []),
    ...(result.extraction?.functions || [])
  ]
    .filter(Boolean)
    .join(" ");
  if (/감귤|귤|진피|시트러스/.test(text) && /화장품|피부|세럼|마스크팩|크림/.test(text)) {
    return "citrus-cosmetic";
  }
  if (/해조류|해조|감태|김|미역|톳|모자반|다시마|파래|색소|스낵/.test(text)) {
    return "seaweed-snack";
  }
  return "default";
}

function clipCoachAnswer(answer) {
  const text = businessText(String(answer || "").trim());
  return text.length > 700 ? `${text.slice(0, 697)}...` : text;
}

function buildCoachReportContext(result = state.result) {
  if (!result) return {};
  const intelligence = result.commercialIntelligence || fallbackCommercialIntelligence(result);
  const strongest = [...(intelligence.differentiationAxes || [])].sort(
    (a, b) => Number(b.score || 0) - Number(a.score || 0)
  )[0];
  return {
    itemName: result.idea || "분석 아이템",
    ingredient: result.extraction?.ingredient || result.extraction?.standardIngredient || "",
    function: joinOrFallback(result.extraction?.functions || [], ""),
    productCategory: joinOrFallback(result.extraction?.categories || [], ""),
    score: Number(result.scores?.total || 0),
    marketPosition: intelligence.marketPosition?.label || result.decisionSupport?.diagnosis || "",
    strongestDifferentiation:
      strongest?.detail || strongest?.label || document.querySelector("#founderStrongestDifferentiator")?.textContent || "",
    recommendedAction:
      result.copilot?.actions?.[0] ||
      intelligence.entryStrategy ||
      result.recommendations?.[0] ||
      ""
  };
}

function fallbackCoachAnswer(question, result = state.result) {
  const profileId = currentCoachProfileId(result);
  const fallbackSet = AI_COACH_FALLBACKS[profileId] || {};
  const exactQuestion = AI_COACH_QUICK_QUESTIONS.find((item) => item === question);
  if (exactQuestion && fallbackSet[exactQuestion]) return clipCoachAnswer(fallbackSet[exactQuestion]);

  if (/강점|장점|차별/.test(question)) {
    return clipCoachAnswer(
      fallbackSet["이 아이템의 가장 큰 강점은?"] ||
        "가장 큰 강점은 원료 스토리와 제품화 방향을 함께 설명할 수 있다는 점입니다. 현재 리포트의 차별성 항목을 중심으로 고객에게 이해되는 메시지를 먼저 정리하는 것이 좋습니다."
    );
  }
  if (/보완|먼저|우선|리스크/.test(question)) {
    return clipCoachAnswer(
      fallbackSet["가장 먼저 보완할 부분은?"] ||
        "가장 먼저 제품 형태와 타깃 고객을 좁히는 것이 좋습니다. 그래야 기능 메시지, 시제품 범위, 근거 보완 방향이 분명해집니다."
    );
  }
  if (/브랜드|포지셔닝|한 줄/.test(question)) {
    return clipCoachAnswer(
      fallbackSet["브랜드 포지셔닝을 한 줄로 정리해줘"] ||
        "현재 아이템은 지역 원료 스토리와 기능 근거를 결합한 초기 시장 테스트형 바이오 제품으로 포지셔닝하는 것이 적합합니다."
    );
  }
  if (/R&D|지원사업|과제|강조/.test(question)) {
    return clipCoachAnswer(
      fallbackSet["R&D 지원사업에 넣으려면 무엇을 강조해야 해?"] ||
        "R&D 지원사업에서는 지역 원료성, 기능 근거, 제품화 가능성, 공급 안정성, 후속 확장성을 중심으로 강조하는 것이 좋습니다."
    );
  }

  const context = buildCoachReportContext(result);
  return clipCoachAnswer(
    `${context.itemName || "현재 아이템"}은 ${context.marketPosition || "초기 사업화 검토"} 포지션입니다. 지금은 아이디어를 넓히기보다 제품 형태와 첫 고객을 좁히고, ${context.strongestDifferentiation || "가장 강한 차별성"}을 전면 메시지로 정리하는 것이 좋습니다. 다음 액션은 ${context.recommendedAction || "MVP 기준과 보완 근거를 정리하는 것"}입니다.`
  );
}

function appendCoachMessage(role, text, { loading = false } = {}) {
  const messages = document.querySelector("#aiCoachMessages");
  const message = document.createElement("div");
  message.className = `ai-coach-message ${role}${loading ? " loading" : ""}`;
  message.textContent = clipCoachAnswer(text);
  messages.append(message);
  messages.scrollTop = messages.scrollHeight;
  return message;
}

function resetAiCoach(result) {
  const messages = document.querySelector("#aiCoachMessages");
  if (!messages) return;
  messages.innerHTML = "";
  const context = buildCoachReportContext(result);
  appendCoachMessage(
    "assistant",
    `${context.itemName || "현재 분석 결과"}에 대해 질문해 주세요. 사업화 방향, 브랜드 포지셔닝, R&D 보완 전략 중심으로 답변하겠습니다.`
  );
  const input = document.querySelector("#aiCoachInput");
  if (input) input.value = "";
}

async function requestAiCoachAnswer(question) {
  const context = buildCoachReportContext();
  const callCount = Number(sessionStorage.getItem("aiCoachCallCount") || "0");
  if (callCount >= AI_COACH_CALL_LIMIT) {
    return fallbackCoachAnswer(question);
  }

  sessionStorage.setItem("aiCoachCallCount", String(callCount + 1));
  try {
    const response = await fetch("/api/ai-coach", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ question, reportContext: context })
    });
    if (!response.ok) throw new Error("coach unavailable");
    const payload = await response.json();
    if (!payload?.answer) throw new Error("empty coach answer");
    return clipCoachAnswer(payload.answer);
  } catch {
    return fallbackCoachAnswer(question);
  }
}

async function sendAiCoachQuestion(question) {
  const normalized = String(question || "").trim().slice(0, 300);
  if (!normalized) {
    showToast("질문을 입력해주세요.");
    return;
  }

  appendCoachMessage("user", normalized);
  const input = document.querySelector("#aiCoachInput");
  const sendButton = document.querySelector("#aiCoachSendButton");
  if (input) input.value = "";
  if (sendButton) sendButton.disabled = true;
  const loadingMessage = appendCoachMessage("assistant", "AI 사업화 코치가 분석 중입니다...", {
    loading: true
  });

  const answer = await requestAiCoachAnswer(normalized);
  loadingMessage.classList.remove("loading");
  loadingMessage.textContent = answer;
  loadingMessage.scrollIntoView({ block: "nearest" });
  if (sendButton) sendButton.disabled = false;
  if (input) input.focus();
}

function renderResult(rawResult) {
  const result = applyDemoProfile(rawResult);
  state.result = result;
  const extraction = result.extraction;
  const title =
    result.idea ||
    `${extraction.ingredient || "제주 바이오 원료"} ${joinOrFallback(extraction.functions, "")} ${joinOrFallback(extraction.categories, "")}`;

  document.querySelector("#resultTitle").textContent = title;
  document.querySelector("#resultTimestamp").textContent = businessText(
    `${new Date(result.generatedAt).toLocaleString("ko-KR")} 분석 완료 · ${result.providers?.keywordExtractor || "규칙 기반 분석"}`
  );
  document.querySelector("#explanationProvider").textContent =
    businessText(result.providers?.resultExplainer || "활용 근거 요약");

  state.selectedScenarioId = "current";
  renderEnterpriseDiagnosis(result.enterpriseDiagnosis || state.enterpriseDiagnosis);
  renderClassification(result);
  renderScores(result.scores, result.scoreReasons);
  renderCommercialIntelligence(result);
  renderPositioning(
    result.decisionSupport,
    (result.commercialIntelligence || fallbackCommercialIntelligence(result)).marketPosition
  );
  renderPatentTrend(result.decisionSupport.patentTrend);
  applyWeightPreset("default");
  renderExplanation(result.explanation);
  renderCopilot(result.copilot, result);
  renderSourceEvidence(result);
  renderRegulation(result.regulatoryChecklist, result.dataFreshness);
  renderAlgorithm(result);
  resetAiCoach(result);
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
      body: JSON.stringify({
        idea: fallbackIdea,
        extraction,
        preferredCategory,
        companyProfile: state.companyProfile
      })
    });
    if (!response.ok) throw new Error(`API ${response.status}`);
    const result = await response.json();
    await new Promise((resolve) => window.setTimeout(resolve, 1250));
    elements.analysisDialog.close();
    renderResult(result);
  } catch (error) {
    const fallback = analyzeIdea(fallbackIdea, preferredCategory);
    fallback.providers = {
      keywordExtractor: extraction ? "추천 원료 JSON" : "브라우저 폴백",
      resultExplainer: "근거 기반 폴백",
      publicData: "해커톤 캐시 데이터"
    };
    if (state.companyProfile) {
      fallback.enterpriseDiagnosis = assessCompanyProfile(state.companyProfile);
    }
    await new Promise((resolve) => window.setTimeout(resolve, 900));
    elements.analysisDialog.close();
    renderResult(fallback);
    showToast("서버 연결 없이 데모 데이터로 분석했습니다.");
  } finally {
    timers.forEach(window.clearTimeout);
  }
}

elements.diagnosisForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const profile = Object.fromEntries(new FormData(elements.diagnosisForm).entries());
  profile.patentCount = Number(profile.patentCount || 0);
  state.companyProfile = profile;
  state.enterpriseDiagnosis = assessCompanyProfile(profile);
  const diagnosis = state.enterpriseDiagnosis;
  document.querySelector("#diagnosisStage").textContent = diagnosis.stage;
  document.querySelector("#diagnosisSummary").textContent = diagnosis.summary;
  document.querySelector("#diagnosisActions").innerHTML = diagnosis.actions
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");
  document.querySelector("#diagnosisGuidance").textContent = diagnosis.applicationGuidance;
  elements.diagnosisOutput.hidden = false;
  elements.diagnosisOutput.scrollIntoView({ behavior: "smooth", block: "center" });
});

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
  state.selectedMaterialId = null;
  elements.bioTypeFilter.querySelectorAll("button").forEach((item) => {
    item.classList.toggle("active", item === button);
  });
  renderIdeas();
});

elements.ideaGrid.addEventListener("click", (event) => {
  const materialButton = event.target.closest("[data-material-id]");
  if (materialButton) {
    state.selectedMaterialId = materialButton.dataset.materialId;
    renderIdeas();
    return;
  }

  const recommendationButton = event.target.closest("[data-recommendation-title]");
  if (!recommendationButton) return;
  startAnalysis({
    idea: recommendationButton.dataset.recommendationTitle,
    extraction: {
      ingredient: recommendationButton.dataset.recommendationMaterial,
      functions: [recommendationButton.dataset.recommendationFunction].filter(Boolean),
      categories: [recommendationButton.dataset.recommendationCategory].filter(Boolean),
      unknown: []
    }
  });
});

document.querySelector("#statusButton").addEventListener("click", () => elements.statusDialog.showModal());
document.querySelector("#closeStatusButton").addEventListener("click", () => elements.statusDialog.close());
document.querySelector("#algorithmButton").addEventListener("click", () =>
  document.querySelector("#algorithmDialog").showModal()
);
document.querySelector("#closeAlgorithmButton").addEventListener("click", () =>
  document.querySelector("#algorithmDialog").close()
);
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

document.querySelector("#aiCoachQuickQuestions").addEventListener("click", (event) => {
  const button = event.target.closest("[data-ai-coach-question]");
  if (!button) return;
  sendAiCoachQuestion(button.dataset.aiCoachQuestion);
});

document.querySelector("#aiCoachForm").addEventListener("submit", (event) => {
  event.preventDefault();
  sendAiCoachQuestion(document.querySelector("#aiCoachInput").value);
});

renderCategoryOptions();
renderIdeas();
updatePreview();
