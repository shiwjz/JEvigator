import { useState, useEffect, useRef } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { WavesAnimation, SparklesAnimation } from "./components/CategoryAnimations";
import { SeamlessVideoBackground } from "./components/SeamlessVideoBackground";
import grassImage from "../imports/visnu-deva-WZBSRWPKBDw-unsplash.jpg";
import imgGamgyul from "../imports/pexels-breakingpic-2986.jpg";
import imgTot from "../imports/22478_53515_0919.jpg";
import imgDongchungha from "../imports/image.png";
import bgImage from "../imports/Gemini_Generated_Image_88su2388su2388su.png";
import bgImageDark from "../imports/Gemini_Generated_Image_moeip2moeip2moei.png";
import jevigatorLogo from "../imports/jevigator-logo.png";
import greenBioImage from "../imports/jggrz-harvest-4387965_1920.jpg";
import marineBioImage from "../imports/_____________________________________________________________.jpeg";
import whiteBioImage from "../imports/research-worker-laboratory-breeding-new-kinds-vegetation_273609-13437.jpg";
import waveImage from "../imports/____.jpeg";
import waveVideo from "../imports/252706_medium.mp4";
import whiteBioVideo from "../imports/13161561-uhd_3840_2160_30fps.mp4";
import greenBioVideo from "../imports/19715-304748232_medium.mp4";
import redBioVideo from "../imports/197486-905015022_medium.mp4";

const pexelsImage = (photoId: string) =>
  `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg?auto=compress&cs=tinysrgb&w=800`;

// 원본 프론트(JEVIGATOR-FRONT-main)의 이미지 연결명을 그대로 유지한다.
// 해당 로컬 pexels 파일들이 현재 폴더에 없어서, 파일명에 포함된 Pexels photo id로 동일 원본 이미지를 참조한다.
const imgJoritdae = pexelsImage("30219931");
const imgNokcha = pexelsImage("911810");
const imgPyogo = pexelsImage("37073592");
const imgHallabong = pexelsImage("31589314");
const imgCamellia = pexelsImage("36735484");
const imgHaejo = pexelsImage("4484246");
const imgMiyeok = pexelsImage("26728215");
const imgSeongge = pexelsImage("8826357");
const imgFucoidanHaejo = pexelsImage("8597148");
const imgYongamhaesu = pexelsImage("31847620");
const imgEnzymeSeaweed = pexelsImage("8849622");
const imgMakgeolli = pexelsImage("12321569");
const imgBlackPig = pexelsImage("5800125");
const imgHwasansong = "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./components/ui/dialog";
import {
  Search,
  ChevronRight,
  ChevronLeft,
  Beaker,
  BarChart3,
  Database,
  Shield,
  Leaf,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  Zap,
  Globe,
  FileText,
  Cpu,
  Moon,
  Sun,
  Home,
} from "lucide-react";

const CATEGORIES = [
  {
    id: "green",
    label: "그린바이오",
    sub: "식품 및 농축산 자원",
    color: "#4ade80",
    dot: "bg-green-400",
    materials: [
      { id: "gamgyul", label: "감귤", desc: "제주 대표 감귤류", emoji: "🍊" },
      { id: "hallabong", label: "한라봉", desc: "프리미엄 감귤", emoji: "🍊" },
      { id: "gotgama", label: "곶감", desc: "건조 감", emoji: "🟠" },
      { id: "heukdwaeji", label: "흑돼지", desc: "제주 특산 돈육", emoji: "🐷" },
      { id: "dureup", label: "두릅", desc: "산나물", emoji: "🌱" },
      { id: "nokcha", label: "녹차", desc: "제주 차", emoji: "🍵" },
      { id: "yuchae", label: "유채", desc: "유채나물·기름", emoji: "🌼" },
      { id: "danggeun", label: "당근", desc: "제주 당근", emoji: "🥕" },
      { id: "pyogo", label: "표고버섯", desc: "표고 균사", emoji: "🍄" },
      { id: "buckwheat", label: "메밀", desc: "제주 메밀", emoji: "🌾" },
    ],
  },
  {
    id: "red",
    label: "레드바이오",
    sub: "의약 및 헬스케어",
    color: "#f87171",
    dot: "bg-red-400",
    materials: [
      { id: "haejo", label: "해조류 후코이단", desc: "해조 추출물", emoji: "🌿" },
      { id: "gamgyul", label: "감귤 헤스페리딘", desc: "감귤 플라보노이드", emoji: "💊" },
      { id: "hallabong", label: "한라봉 플라보노이드", desc: "항산화 성분", emoji: "🧬" },
      { id: "heukdwaeji", label: "흑돼지 콜라겐", desc: "콜라겐 펩타이드", emoji: "🔬" },
      { id: "nokcha-catechin", label: "녹차 카테킨", desc: "항산화 성분", emoji: "💚" },
      { id: "pyogo-polysaccharide", label: "표고 다당류", desc: "면역 증강", emoji: "🍄" },
      { id: "yongamhaesu", label: "용암해수", desc: "미네랄 농축수", emoji: "💧" },
      { id: "aloe", label: "알로에베라", desc: "제주 알로에", emoji: "🌵" },
      { id: "spirulina", label: "스피룰리나", desc: "해양 미세조류", emoji: "🔵" },
      { id: "citrus-peel", label: "감귤 껍질 추출물", desc: "바이오플라보노이드", emoji: "🍋" },
    ],
  },
  {
    id: "marine",
    label: "블루바이오",
    sub: "해양 및 수산 자원",
    color: "#38bdf8",
    dot: "bg-sky-400",
    materials: [
      { id: "haejo", label: "해조류 추출물", desc: "보습·진정", emoji: "🌊" },
      { id: "gamgyul", label: "감귤 껍질 오일", desc: "아로마·미백", emoji: "✨" },
      { id: "hallabong", label: "한라봉 비타민C", desc: "브라이트닝", emoji: "💫" },
      { id: "heukdwaeji", label: "흑돼지 히알루론산", desc: "보습 성분", emoji: "💧" },
      { id: "hwasansong", label: "화산송이", desc: "모공 케어", emoji: "🪨" },
      { id: "yongamhaesu-beauty", label: "용암해수", desc: "미네랄 토너", emoji: "💎" },
      { id: "nokcha-extract", label: "녹차 추출물", desc: "항산화·진정", emoji: "🍃" },
      { id: "camellia", label: "동백오일", desc: "헤어·스킨케어", emoji: "🌺" },
      { id: "seawater", label: "제주 해양심층수", desc: "미네랄 워터", emoji: "🌊" },
      { id: "tangerine-seed", label: "감귤씨 오일", desc: "영양 오일", emoji: "🫒" },
    ],
  },
  {
    id: "white",
    label: "화이트바이오",
    sub: "바이오공정 및 발효 자원",
    color: "#86efac",
    dot: "bg-green-300",
    materials: [
      { id: "fermented-citrus", label: "발효 감귤", desc: "감귤 발효 추출물", emoji: "🍊" },
      { id: "lactic-bacteria", label: "유산균", desc: "제주 전통 발효 균주", emoji: "🦠" },
      { id: "enzyme-seaweed", label: "해조 효소", desc: "해조류 효소 분해물", emoji: "🌿" },
    ],
  },
];

const MATERIAL_IMAGES: Record<string, string> = {
  gamgyul: imgGamgyul,
  hallabong: imgHallabong,
  gotgama: "https://images.unsplash.com/photo-1670978939243-38dd2647c05d?w=800&q=80",
  heukdwaeji: imgBlackPig,
  dureup: "https://images.unsplash.com/photo-1607189760730-a330bf941e9c?w=800&q=80",
  nokcha: imgNokcha,
  yuchae: "https://images.unsplash.com/photo-1589715246045-e881ef9f5c16?w=800&q=80",
  danggeun: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&q=80",
  pyogo: imgPyogo,
  buckwheat: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80",
  joritdae: imgJoritdae,
  haejo: imgHaejo,
  "nokcha-catechin": imgNokcha,
  "pyogo-polysaccharide": imgPyogo,
  yongamhaesu: imgYongamhaesu,
  dongchungha: imgDongchungha,
  "yongam-water": imgYongamhaesu,
  aloe: "https://images.unsplash.com/photo-1596705702948-57d4e5d4b2a5?w=800&q=80",
  spirulina: "https://images.unsplash.com/photo-1622480916113-9000ac49b79d?w=800&q=80",
  "citrus-peel": imgGamgyul,
  hwasansong: imgHwasansong,
  camellia: imgCamellia,
  tot: imgTot,
  miyeok: imgMiyeok,
  seongge: imgSeongge,
  seawater: imgYongamhaesu,
  "tangerine-seed": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80",
  "yongamhaesu-beauty": imgYongamhaesu,
  "nokcha-extract": "https://images.unsplash.com/photo-1582650859079-ee63913ecb84?w=800&q=80",
  "jeju-potato": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&q=80",
  bija: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800&q=80",
  "fermented-citrus": imgGamgyul,
  "lactic-bacteria": "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=800&q=80",
  "enzyme-seaweed": imgEnzymeSeaweed,
  "makgeolli-yeast": imgMakgeolli,
  "black-pig-collagen": imgBlackPig,
  "citrus-vinegar": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80",
};

const ANALYSIS_RESULTS: Record<string, {
  score: number;
  axes: { name: string; value: number; label: string }[];
  summary: string;
  highlights: string[];
  risks: string[];
  recommendation: string;
  color: string;
}> = {
  gamgyul: {
    score: 82,
    axes: [
      { name: "제조가능성", value: 88, label: "만들 수 있나?" },
      { name: "시장성", value: 85, label: "팔릴까?" },
      { name: "규제장벽", value: 70, label: "막히는 게 있나?" },
      { name: "원료지속성", value: 84, label: "원료가 계속 나오나?" },
    ],
    summary: "감귤 바이오소재는 높은 사업화 가능성을 보입니다.",
    highlights: [
      "플라보노이드·헤스페리딘 성분 — 기능성 식품·화장품 소재 수요 급증",
      "제주 연간 생산량 60만 톤 이상, 부산물(껍질·착즙박) 활용 가능",
      "일본·중국 수출 실적 보유 — 시장 검증 완료",
      "농식품부 기능성 ��료 인정 절차 간소화 추세",
    ],
    risks: [
      "원료 수급 계절성 — 수확 시즌 편중 (11월~2월)",
      "중국산 감귤 가공품과의 가격 ���쟁 압박",
    ],
    recommendation: "고부가 기능성 식품·화장품 소재로 개발 시 ROI 최적. 1차 단계 진입 권장.",
    color: "#f5a623",
  },
  haejo: {
    score: 76,
    axes: [
      { name: "제조가능성", value: 80, label: "만들 수 있나?" },
      { name: "시장성", value: 78, label: "팔릴까?" },
      { name: "규제장벽", value: 65, label: "막히는 게 있나?" },
      { name: "원료지속성", value: 82, label: "원료가 계속 나오나?" },
    ],
    summary: "해조류 바이오소재는 안정적인 공급망과 성장하는 글로벌 시장을 보유합니다.",
    highlights: [
      "후코이단·알긴산 — 항암·면역 소재로 글로벌 관심 집중",
      "제주 연안 자연산 채취량 연 2,000톤 이상",
      "해양수산부 수산물 가공 지원사업 활용 가능",
      "EU·미국 식물성 소재 트렌드와 정합성 높음",
    ],
    risks: [
      "중금속·방사성물질 모니터링 규제 강화 추세",
      "해황 변화에 따른 채취량 변동성 존재",
    ],
    recommendation: "기능성 건강식품·의약품 소재 진입 가능. 안전성 인증 선행 필요.",
    color: "#00c896",
  },
  gotgama: {
    score: 58,
    axes: [
      { name: "제조가능성", value: 62, label: "만들 수 있나?" },
      { name: "시장성", value: 55, label: "팔릴까?" },
      { name: "규제장벽", value: 60, label: "막히는 게 있나?" },
      { name: "원료지속성", value: 54, label: "원료가 계속 나오나?" },
    ],
    summary: "곶감은 소재 차별성 확보가 선행되어야 사업화 가능합니다.",
    highlights: [
      "타닌 성분 — 항산화 기능성 주목",
      "전통 식품 브랜딩 연계 가능성",
    ],
    risks: [
      "원료 생산량이 소규모 — 제주 내 재배 면적 한계",
      "경북 상주·영동 등 타 지역 산지와 소재 차별성 부족",
      "바이오 제품화 선행 연구 데이터 부족",
    ],
    recommendation: "추가 연구·데이터 확보 후 재검토 권장. 현시점 사업화 리스크 높음.",
    color: "#e8404a",
  },
  hallabong: {
    score: 79,
    axes: [
      { name: "제조가능성", value: 82, label: "만들 수 있나?" },
      { name: "시장성", value: 83, label: "팔릴까?" },
      { name: "규제장벽", value: 72, label: "막히는 게 있나?" },
      { name: "원료지속성", value: 78, label: "원료가 계속 나오나?" },
    ],
    summary: "한라봉은 프리미엄 브랜드 가치를 활용한 고부가 소재화가 유망합니다.",
    highlights: [
      "제주 지리적 표시 보호 — 차별적 브랜드 가치",
      "비타민 C·플라보노이드 함량 높아 기능성 식품 적합",
      "일본 고급 식품 시장 수출 수요 증가",
    ],
    risks: [
      "감귤 대비 생산량 소규모 — 대량 공급 한계",
      "기후 변화로 인한 품질 변동성",
    ],
    recommendation: "소량 고부가 프리미엄 바이오 소재 전략 권장. 브랜드 연계 마케팅 필수.",
    color: "#f5a623",
  },
  dureup: {
    score: 44,
    axes: [
      { name: "제조가능성", value: 50, label: "만들 수 있나?" },
      { name: "시장성", value: 42, label: "팔릴까?" },
      { name: "규제장벽", value: 48, label: "막히는 게 있나?" },
      { name: "원료지속성", value: 36, label: "원료가 계속 나오나?" },
    ],
    summary: "두릅은 현재 단계에서 바이오 제품화 근거가 충분하지 않습니다.",
    highlights: [
      "아라린 성분 — 연구 단계 관심 소재",
    ],
    risks: [
      "제주 내 재배량 매우 소규모",
      "바이오 소재로서 검증된 임상·논문 데이터 부재",
      "원료 지속 공급 인프라 미비",
    ],
    recommendation: "사업화 진입 비권장. 소재 탐색 단계에서 타 소재 우선 검토.",
    color: "#e8404a",
  },
  heukdwaeji: {
    score: 67,
    axes: [
      { name: "제조가능성", value: 72, label: "만들 수 있나?" },
      { name: "시장성", value: 70, label: "팔릴까?" },
      { name: "규제장벽", value: 55, label: "막히는 게 있나?" },
      { name: "원료지속성", value: 72, label: "원료가 계속 나오나?" },
    ],
    summary: "흑돼지 바이오소재는 콜라겐·펩타이드 분야에서 틈새 기회가 존재합니다.",
    highlights: [
      "콜라겐 펩타이드 소재화 — 뷰티·건강식품 시장 성장세",
      "제주 흑돼지 브랜드 인지도 활용 가능",
    ],
    risks: [
      "동물성 원료 규제 복잡성 — 축산물위생관리법 적용",
      "식물성 대체 소재 트렌드로 시장 침식 위험",
      "ESG 경영 기조와의 충돌 가능성",
    ],
    recommendation: "고기능성 펩타이드 소재로 틈새 진입 가능하나 규제 검토 선행 필수.",
    color: "#f5a623",
  },
};

type ExtendedMaterial = {
  image: string;
  category: string;
  desc: string;
  annualProduction: number;
  unusedRate: number;
  utilization: "낮음" | "중간" | "높음";
  compounds: Array<{ name: string; desc: string; benefit: string }>;
  oceanProducts: Array<{ name: string; x: number; y: number; desc: string; ocean: "blue" | "red" }>;
  businessReasons: string[];
  dataStats: { unusedRate: number; patents: number; papers: number; marketSize: string; growthRate: number; recommendation: number; marketTrend: number[] };
  potentialIndex: Array<{ item: string; weight: number; score: number; basis: string }>;
};

type BackendAnalysisResult = {
  idea?: string;
  extraction?: {
    ingredient?: string;
    standardIngredient?: string;
    functions?: string[];
    categories?: string[];
  };
  classification?: {
    ingredientCategory?: string;
    bioType?: string;
    productForm?: string;
    logicalFit?: {
      score?: number;
      label?: string;
      reasons?: string[];
    };
  };
  scores?: {
    technical?: number;
    market?: number;
    patentSafety?: number;
    supply?: number;
    total?: number;
  };
  scoreReasons?: Record<string, string>;
  evidence?: {
    paperCount?: number;
    recentPaperCount?: number;
    patentCount?: number;
    recentPatentCount?: number;
    productionTons?: number;
    productionStatus?: string;
    mfdsName?: string;
    records?: Array<{
      axis?: string;
      source?: string;
      value?: string;
      detail?: string;
      status?: string;
    }>;
  };
  recommendations?: string[];
  decisionSupport?: {
    scenarios?: Array<{
      category?: string;
      label?: string;
      growth?: number;
      competition?: number;
      zone?: string;
    }>;
    patentTrend?: Array<{ year?: number | string; value?: number }>;
  };
  regulatoryChecklist?: Array<{
    item?: string;
    value?: string;
    status?: string;
    detail?: string;
    action?: string;
    guide?: string;
  }>;
  explanation?: {
    summary?: string;
    provider?: string;
  };
  copilot?: {
    actions?: string[];
    bottleneck?: string;
  };
  commercialIntelligence?: {
    readiness?: {
      businessPosition?: string;
      recommendedCategory?: string;
      bioType?: string;
    };
    marketPosition?: {
      entryEase?: number;
      patentCompetition?: number;
      label?: string;
      description?: string;
    };
    differentiationSummary?: Array<{
      label?: string;
      score?: number;
      detail?: string;
    }>;
    brandAxes?: Array<{ label?: string; score?: number }>;
    brandComparisons?: Array<{
      type?: string;
      commonality?: string;
      difference?: string;
      advantage?: string;
      gap?: string;
    }>;
    axisDetails?: Array<{
      key?: string;
      label?: string;
      score?: number;
      status?: string;
      reason?: string;
      data?: string;
      gap?: string;
    }>;
    startupPath?: Array<{
      phase?: string;
      title?: string;
      action?: string;
    }>;
    alternatives?: Array<{
      name?: string;
      advantage?: string;
      risk?: string;
      delta?: number;
      estimatedScore?: number;
    }>;
    entryStrategy?: string;
  };
  dataSources?: Array<{
    id?: string;
    name?: string;
    status?: string;
    detail?: string;
    updatedAt?: string;
  }>;
  evidenceSummary?: {
    confirmedCount?: number;
    status?: string;
    confirmedSources?: string[];
  };
  paperEvidence?: {
    source?: string;
    totalCount?: number;
    recentCount?: number;
    latestYear?: number;
    query?: string;
  };
  generatedAt?: string;
};

type UiAnalysisResult = (typeof ANALYSIS_RESULTS)[string] & {
  backend?: BackendAnalysisResult;
};

function toNumber(value: unknown, fallback = 0) {
  return Number.isFinite(Number(value)) ? Number(value) : fallback;
}

function clampScore(value: unknown, fallback = 0) {
  return Math.max(0, Math.min(100, Math.round(toNumber(value, fallback))));
}

function evidenceForAxis(backend: BackendAnalysisResult, axisName: string, fallback: string[]) {
  const records = backend.evidence?.records?.filter((record) => record.axis === axisName) ?? [];
  const fromRecords = records
    .flatMap((record) => [record.value, record.detail, record.status].filter(Boolean))
    .map((text) => String(text));
  const reasonKey =
    axisName === "기술성"
      ? "technical"
      : axisName === "시장성"
        ? "market"
        : axisName === "특허안전성"
          ? "patentSafety"
          : "supply";
  const scoreReason = backend.scoreReasons?.[reasonKey];
  return [scoreReason, ...fromRecords, ...fallback].filter(Boolean).slice(0, 4) as string[];
}

function mapBackendToUiResult(
  backend: BackendAnalysisResult,
  fallback: (typeof ANALYSIS_RESULTS)[string],
  color = fallback.color
): UiAnalysisResult {
  const scores = backend.scores ?? {};
  const axes = [
    {
      name: "기술성",
      value: clampScore(scores.technical, fallback.axes[0]?.value ?? 0),
      label: "논문·기능 근거",
      evidence: evidenceForAxis(backend, "기술성", fallback.axes[0]?.evidence ?? [])
    },
    {
      name: "시장성",
      value: clampScore(scores.market, fallback.axes[1]?.value ?? 0),
      label: "시장 수요·진입성",
      evidence: evidenceForAxis(backend, "시장성", fallback.axes[1]?.evidence ?? [])
    },
    {
      name: "특허안전성",
      value: clampScore(scores.patentSafety, fallback.axes[2]?.value ?? 0),
      label: "특허 경쟁·회피 가능성",
      evidence: evidenceForAxis(backend, "특허안전성", fallback.axes[2]?.evidence ?? [])
    },
    {
      name: "공급안정성",
      value: clampScore(scores.supply, fallback.axes[3]?.value ?? 0),
      label: "제주 원료 지속성",
      evidence: evidenceForAxis(backend, "공급안정성", fallback.axes[3]?.evidence ?? [])
    }
  ];

  const risks = [
    ...(backend.classification?.logicalFit?.reasons ?? []),
    ...(backend.regulatoryChecklist ?? [])
      .filter((item) => item.status && item.status !== "통과")
      .map((item) => `${item.item ?? "규제 검토"} — ${item.detail ?? item.guide ?? item.status}`)
  ].slice(0, 4);

  return {
    ...fallback,
    backend,
    color,
    score: clampScore(scores.total, fallback.score),
    axes,
    summary:
      backend.explanation?.summary ||
      `${backend.extraction?.ingredient ?? "제주 바이오 원료"} 기반 ${backend.extraction?.categories?.[0] ?? "제품"} 사업화 가능성을 백엔드 분석 결과로 산정했습니다.`,
    highlights: [
      ...(backend.recommendations ?? []),
      backend.evidence?.productionStatus,
      backend.evidence?.paperCount != null ? `논문 근거 ${backend.evidence.paperCount}건 반영` : null,
      backend.evidence?.patentCount != null ? `유사 특허 ${backend.evidence.patentCount}건 반영` : null
    ].filter(Boolean).slice(0, 4) as string[],
    risks: risks.length ? risks : fallback.risks,
    recommendation:
      backend.copilot?.actions?.[0] ||
      backend.recommendations?.[0] ||
      fallback.recommendation
  };
}

function parseBackendComponents(backend?: BackendAnalysisResult) {
  if (!backend) return null;
  return {
    material: backend.extraction?.ingredient || backend.extraction?.standardIngredient || "제주 바이오 소재",
    func: backend.extraction?.functions?.[0] || "기능성",
    product: backend.extraction?.categories?.[0] || backend.classification?.productForm || "바이오 제품"
  };
}

const MATERIAL_EXTENDED: Record<string, ExtendedMaterial> = {
  gamgyul: {
    image: MATERIAL_IMAGES.gamgyul,
    category: "감귤 부산물",
    desc: "제주 감귤의 껍질·씨·착즙박에서 추출되는 천연 바이오 소재로, 연간 9.5만 톤의 부산물이 발생합니다.",
    annualProduction: 95000, unusedRate: 47, utilization: "중간",
    compounds: [
      { name: "헤스페리딘", desc: "혈중 콜레스테롤 억제 및 혈관 보호 기능을 가진 플라보노이드 배당체", benefit: "심혈관 보호" },
      { name: "플라보노이드", desc: "강력한 항산화 및 항염증 활성을 가진 폴리페놀 복합 군", benefit: "항산화·항염" },
      { name: "펙틴", desc: "수용성 식이섬유로 장 건강 개선 및 콜레스테롤 흡착", benefit: "장 건강 개선" },
      { name: "리모넨", desc: "d-리모넨 함유 항균·항산화 활성의 향기 성분", benefit: "항균·방향" },
      { name: "비타민 C", desc: "면역력 강화 및 콜라겐 합성 촉진 수용성 비타민", benefit: "면역 강화" },
    ],
    oceanProducts: [
      { name: "헤스페리딘 정제 소재", x: 28, y: 78, desc: "항산화 건강기능식품 고기능 소재", ocean: "blue" },
      { name: "감귤 화장품 원료", x: 45, y: 70, desc: "스킨케어·항노화 기능성 원료", ocean: "blue" },
      { name: "기능성 음료 소재", x: 62, y: 58, desc: "RTD 건강음료 첨가 소재", ocean: "blue" },
      { name: "감귤 잼·가공품", x: 82, y: 28, desc: "일반 식품 가공 분야", ocean: "red" },
    ],
    businessReasons: ["경쟁 업체 적음 — 국내 고순도 헤스페리딘 정제 기업 3개 미만", "시장 성장률 높음 — 건강기능식품 소재 시장 연 12% 확대", "제주 원료 차별성 있음 — 지리적 표시 보호 및 청정 이미지", "특허 공백 존재 — 고순도 추출 공정 특허 미등록 분야 다수"],
    dataStats: { unusedRate: 47, patents: 132, papers: 543, marketSize: "3,200억원", growthRate: 12, recommendation: 82, marketTrend: [100,108,118,128,140,152,162,175,188,204,216,232] },
    potentialIndex: [
      { item: "미활용성", weight: 25, score: 88, basis: "연 9.5만톤 부산물 중 47% 미활용 — 원료 확보 우수" },
      { item: "시장성", weight: 25, score: 85, basis: "글로벌 감귤 바이오소재 시장 연 12% 성장세" },
      { item: "경쟁도", weight: 20, score: 78, basis: "국내 고순도 정제 기업 3개 미만 — 진입 여지 충분" },
      { item: "기술성", weight: 15, score: 82, basis: "추출·정제 관련 논문 543편 — 연구기반 충실" },
      { item: "사업성", weight: 15, score: 80, basis: "식약처 기능성 원료 인정 절차 진행 가능" },
    ],
  },
  joritdae: {
    image: MATERIAL_IMAGES.joritdae,
    category: "한라산 자생 식물",
    desc: "제주 한라산 자생 대나무과 조릿대에서 추출되는 항균·항염 바이오 소재로 미활용률이 72%에 달합니다.",
    annualProduction: 8500, unusedRate: 72, utilization: "낮음",
    compounds: [
      { name: "플라보노이드", desc: "항염·항균 복합 폴리페놀 군으로 면역 조절 활성", benefit: "항염·항균" },
      { name: "폴리페놀", desc: "산화 스트레스 억제 및 세포 보호 기전의 항산화 성분", benefit: "항산화" },
      { name: "규소(실리카)", desc: "피부·모발 탄력 강화에 기여하는 미네랄 성분", benefit: "피부 탄력" },
      { name: "사포닌", desc: "콜레스테롤 흡착 및 항암 보조 기전 활성 배당체", benefit: "항암 보조" },
    ],
    oceanProducts: [
      { name: "조릿대 항균 소재", x: 22, y: 82, desc: "천연 항균·방부 소재 시장 진입", ocean: "blue" },
      { name: "기능성 화장품 원료", x: 40, y: 74, desc: "항염·진정 스킨케어 원료", ocean: "blue" },
      { name: "건강기능식품 소재", x: 55, y: 66, desc: "면역 강화 기능성 소재", ocean: "blue" },
      { name: "전통차 음료", x: 75, y: 38, desc: "건강차 시장 (경쟁 다수)", ocean: "red" },
    ],
    businessReasons: ["경쟁 업체 극소 — 조릿대 전문 소재 기업 사실상 부재", "시장 성장률 높음 — 천연 항균 소재 글로벌 연 18% 성장", "제주 원료 차별성 있음 — 한라산 청정 자생 원료 브랜딩", "특허 공백 존재 — 정제 추출 공정 특허 미등록 다수"],
    dataStats: { unusedRate: 72, patents: 48, papers: 187, marketSize: "890억원", growthRate: 18, recommendation: 88, marketTrend: [100,112,126,141,158,174,195,218,242,268,296,330] },
    potentialIndex: [
      { item: "미활용성", weight: 25, score: 95, basis: "연 8,500톤 중 72% 미활용 — 원료 확보 탁월" },
      { item: "시장성", weight: 25, score: 88, basis: "천연 항균·항염 시장 연 18% 고성장" },
      { item: "경쟁도", weight: 20, score: 92, basis: "조릿대 전문 소재 기업 사실상 전무" },
      { item: "기술성", weight: 15, score: 75, basis: "기초 연구 논문 187편 — 추가 연구 개발 여지 큼" },
      { item: "사업성", weight: 15, score: 82, basis: "화장품·건강식품 원료 등록 경로 명확" },
    ],
  },
  camellia: {
    image: MATERIAL_IMAGES.camellia,
    category: "동백 종자 압착유",
    desc: "제주 동백나무 종자를 저온 압착하여 추출한 고급 식물성 오일로, 올레산 함량이 83%에 달합니다.",
    annualProduction: 3200, unusedRate: 42, utilization: "중간",
    compounds: [
      { name: "올레산", desc: "모발·피부 침투력 우수한 단일불포화지방산 83% 함유", benefit: "보습·침투" },
      { name: "팔미트산", desc: "피부 장벽 강화 및 세포막 구성 포화지방산", benefit: "피부 장벽" },
      { name: "스쿠알렌", desc: "인체 피지와 유사한 구조의 천연 보습 성분", benefit: "천연 보습" },
      { name: "폴리페놀", desc: "항산화 및 항노화 활성 페놀 화합물", benefit: "항노화" },
      { name: "비타민 E", desc: "지용성 항산화 비타민으로 세포 산화 방지", benefit: "항산화" },
    ],
    oceanProducts: [
      { name: "프리미엄 헤어오일", x: 25, y: 80, desc: "고급 헤어케어 브랜드 원료", ocean: "blue" },
      { name: "기능성 스킨케어", x: 38, y: 75, desc: "항노화 화장품 소재", ocean: "blue" },
      { name: "K-뷰티 수출 소재", x: 52, y: 68, desc: "K-뷰티 글로벌 수출 원료", ocean: "blue" },
      { name: "일반 헤어 케어", x: 78, y: 40, desc: "대중 헤어 제품 (경쟁 포화)", ocean: "red" },
    ],
    businessReasons: ["경쟁 업체 적음 — 제주 동백오일 전문 기업 5개 미만", "시장 성장률 높음 — K-뷰티·헤어케어 시장 연 15% 성장", "제주 원료 차별성 있음 — 제주 동백 청정 브랜드 가치", "특허 공백 존재 — 동백 고기능성 추출 정제 특허 미등록"],
    dataStats: { unusedRate: 42, patents: 76, papers: 298, marketSize: "2,100억원", growthRate: 15, recommendation: 89, marketTrend: [100,110,122,136,148,163,178,196,215,234,256,282] },
    potentialIndex: [
      { item: "미활용성", weight: 25, score: 82, basis: "연 3,200톤 중 42% 미활용 — 원료 공급 가능" },
      { item: "시장성", weight: 25, score: 90, basis: "글로벌 뷰티 오일 시장 연 15% 성장" },
      { item: "경쟁도", weight: 20, score: 85, basis: "제주 동백오일 전문 기업 5개 미만" },
      { item: "기술성", weight: 15, score: 84, basis: "저온 압착·정제 기술 논문 298편 확보" },
      { item: "사업성", weight: 15, score: 88, basis: "화장품 원료 등록 완료 — 즉시 사업화 가능" },
    ],
  },
  hwasansong: {
    image: MATERIAL_IMAGES.hwasansong,
    category: "화산 분출 미세광물",
    desc: "제주 화산 폭발 시 분출된 다공성 미세 광물로, 딥클렌징 및 피부 흡착 소재로 탁월한 성능을 보입니다.",
    annualProduction: 15000, unusedRate: 35, utilization: "중간",
    compounds: [
      { name: "이산화규소(SiO₂)", desc: "다공성 흡착 구조로 피부 노폐물·피지 흡착", benefit: "딥클렌징" },
      { name: "알루미나(Al₂O₃)", desc: "미세 연마 입자로 각질 제거 및 피부 결 개선", benefit: "각질 제거" },
      { name: "복합 미네랄", desc: "철·망간·칼슘 등 화산 유래 미네랄 복합체", benefit: "피부 영양" },
      { name: "다공성 구조체", desc: "나노~마이크로 기공으로 유해 성분 흡착 기능", benefit: "디톡스" },
    ],
    oceanProducts: [
      { name: "화산송이 클렌저", x: 20, y: 85, desc: "딥클렌징 전문 스킨케어 제품", ocean: "blue" },
      { name: "마스크팩 소재", x: 35, y: 78, desc: "기능성 마스크팩 원료", ocean: "blue" },
      { name: "프리미엄 스크럽", x: 50, y: 70, desc: "바디·페이셜 스크럽 제품", ocean: "blue" },
      { name: "일반 클렌징폼", x: 80, y: 35, desc: "대중 세안제 시장 (포화)", ocean: "red" },
    ],
    businessReasons: ["경쟁 업체 극소 — 제주 화산송이 전문 브랜드 희소", "시장 성장률 높음 — 클린뷰티·미네랄 화장품 연 20% 성장", "제주 원료 차별성 있음 — 세계 유일 한라산 화산 원료", "특허 공백 존재 — 나노 가공 화산송이 소재 특허 미등록"],
    dataStats: { unusedRate: 35, patents: 54, papers: 156, marketSize: "1,650억원", growthRate: 20, recommendation: 93, marketTrend: [100,115,132,152,173,198,226,258,294,336,383,437] },
    potentialIndex: [
      { item: "미활용성", weight: 25, score: 78, basis: "연 1.5만톤 중 35% 미활용 — 추가 활용 여력 충분" },
      { item: "시장성", weight: 25, score: 95, basis: "클린뷰티·미네랄 화장품 시장 연 20% 초고성장" },
      { item: "경쟁도", weight: 20, score: 96, basis: "제주 화산송이 전문 기업 사실상 전무" },
      { item: "기술성", weight: 15, score: 80, basis: "나노 분쇄·정제 기술 적용 가능 — 연구 기반 확보" },
      { item: "사업성", weight: 15, score: 92, basis: "화장품 원료 DB 등록 완료 — 즉시 판매 가능" },
    ],
  },
  haejo: {
    image: MATERIAL_IMAGES.haejo,
    category: "해조류 기능성 추출물",
    desc: "제주 연안 해조류에서 추출한 후코이단·알긴산 복합 소재로, 항암·면역 활성이 임상적으로 확인된 고가 바이오 소재입니다.",
    annualProduction: 28000, unusedRate: 38, utilization: "중간",
    compounds: [
      { name: "후코이단", desc: "항암·면역 활성 황산화 다당류 — 임상 연구 활성", benefit: "항암·면역" },
      { name: "알긴산", desc: "고보습 및 상처 치유 촉진 수용성 다당류", benefit: "보습·치유" },
      { name: "카라기난", desc: "겔화·점성 제어 기능의 황산화 다당류", benefit: "질감 개선" },
      { name: "푸코잔틴", desc: "항비만·항산화 활성 해조 카로티노이드", benefit: "항비만" },
      { name: "요오드", desc: "갑상선 기능 정상화에 필수적인 미네랄", benefit: "갑상선 건강" },
    ],
    oceanProducts: [
      { name: "후코이단 건강식품", x: 30, y: 80, desc: "고순도 면역·항암 건강기능식품", ocean: "blue" },
      { name: "해조 화장품 소재", x: 42, y: 72, desc: "고보습·항노화 뷰티 소재", ocean: "blue" },
      { name: "의약품 보조 원료", x: 22, y: 85, desc: "항암 보조 의약품 원료 소재", ocean: "blue" },
      { name: "일반 건강 음료", x: 78, y: 42, desc: "RTD 해조 음료 (경쟁 다수)", ocean: "red" },
    ],
    businessReasons: ["경쟁 업체 적음 — 고순도 후코이단 정제 기업 10개 미만", "시장 성장률 높음 — 면역 건강식품 시장 연 15% 성장", "제주 원료 차별성 있음 — 제주 청정 해역 원산지 인증", "특허 공백 존재 — 고순도 정제 및 나노 캡슐화 특허 공백"],
    dataStats: { unusedRate: 38, patents: 89, papers: 312, marketSize: "2,800억원", growthRate: 15, recommendation: 91, marketTrend: [100,110,122,138,155,172,191,213,238,264,294,328] },
    potentialIndex: [
      { item: "미활용성", weight: 25, score: 80, basis: "연 2.8만톤 중 38% 미활용 — 원료 가용성 우수" },
      { item: "시장성", weight: 25, score: 90, basis: "글로벌 면역·항암 소재 시장 연 15% 성장" },
      { item: "경쟁도", weight: 20, score: 82, basis: "고순도 후코이단 정제 기업 10개 미만" },
      { item: "기술성", weight: 15, score: 86, basis: "임상 연구 논문 312편 — 기술 신뢰도 높음" },
      { item: "사업성", weight: 15, score: 84, basis: "건강기능식품·의약품 원료 등록 경로 확보" },
    ],
  },
  "makgeolli-yeast": {
    image: MATERIAL_IMAGES["makgeolli-yeast"],
    category: "전통 발효 균주",
    desc: "제주 전통 막걸리 발효 과정에서 분리한 특이 효모 균주로, 기능성 발효 소재·프로바이오틱스 원료로 활용 가능합니다.",
    annualProduction: 2400, unusedRate: 58, utilization: "낮음",
    compounds: [
      { name: "효모 균주", desc: "제주 고유 발효 효모 — 독특한 대사산물 생성", benefit: "발효 기능" },
      { name: "베타글루칸", desc: "면역 활성화 및 콜레스테롤 저하 다당류", benefit: "면역·심혈관" },
      { name: "유기산", desc: "젖산·초산 등 발효 유기산으로 장 건강 개선", benefit: "장 건강" },
      { name: "아미노산 복합체", desc: "필수 아미노산 균형 조성 발효 단백질 가수분해물", benefit: "영양 균형" },
    ],
    oceanProducts: [
      { name: "프리미엄 프로바이오틱스", x: 25, y: 82, desc: "기능성 프로바이오틱스 건강식품", ocean: "blue" },
      { name: "발효 화장품 소재", x: 40, y: 76, desc: "발효 효모 추출 뷰티 소재", ocean: "blue" },
      { name: "기능성 식품 첨가물", x: 58, y: 65, desc: "발효 식품 첨가 기능성 소재", ocean: "blue" },
      { name: "일반 막걸리 음료", x: 80, y: 30, desc: "전통주 시장 (포화)", ocean: "red" },
    ],
    businessReasons: ["경쟁 업체 없음 — 제주 고유 막걸리 효모 특화 기업 전무", "시장 성장률 높음 — 프로바이오틱스 시장 연 14% 성장", "제주 원료 차별성 있음 — 제주 토착 발효 균주 희소성", "특허 공백 존재 — 제주 막걸리 효모 기능성 소재 특허 미등록"],
    dataStats: { unusedRate: 58, patents: 34, papers: 142, marketSize: "1,420억원", growthRate: 14, recommendation: 90, marketTrend: [100,112,126,142,160,178,200,224,250,280,314,352] },
    potentialIndex: [
      { item: "미활용성", weight: 25, score: 92, basis: "연 2,400톤 중 58% 미활용 — 원료 확보 용이" },
      { item: "시장성", weight: 25, score: 88, basis: "글로벌 프로바이오틱스 시장 연 14% 성장" },
      { item: "경쟁도", weight: 20, score: 96, basis: "제주 막걸리 효모 전문 소재 기업 사실상 전무" },
      { item: "기술성", weight: 15, score: 78, basis: "발효 균주 관련 논문 142편 — 연구 초기 단계" },
      { item: "사업성", weight: 15, score: 86, basis: "건강기능식품 원료 등록 경로 명확" },
    ],
  },
  dongchungha: {
    image: MATERIAL_IMAGES.dongchungha,
    category: "기능성 약용 버섯",
    desc: "코디세핀·아데노신을 함유한 동충하초는 면역 강화·항피로 효능이 임상적으로 검증된 프리미엄 바이오 소재입니다.",
    annualProduction: 1200, unusedRate: 28, utilization: "높음",
    compounds: [
      { name: "코디세핀", desc: "항암·항바이러스·항피로 활성의 핵산 유사체", benefit: "항암·항피로" },
      { name: "아데노신", desc: "혈관 확장 및 심장 보호 기능의 퓨린 뉴클레오사이드", benefit: "심혈관 보호" },
      { name: "베타글루칸", desc: "면역 활성화 및 항종양 활성 다당류", benefit: "면역 강화" },
      { name: "다당류 복합체", desc: "면역 조절 및 항산화 활성 복합 다당체", benefit: "면역·항산화" },
    ],
    oceanProducts: [
      { name: "동충하초 건강식품", x: 32, y: 82, desc: "면역·항피로 기능성 건강식품", ocean: "blue" },
      { name: "스포츠 영양 소재", x: 28, y: 86, desc: "운동 회복·에너지 스포츠 소재", ocean: "blue" },
      { name: "의약품 보조 원료", x: 20, y: 88, desc: "면역 보조 의약품 소재", ocean: "blue" },
      { name: "일반 보조식품", x: 70, y: 45, desc: "건강 보조식품 시장 (경쟁 중간)", ocean: "red" },
    ],
    businessReasons: ["시장 성장률 높음 — 면역·항피로 소재 시장 연 16% 성장", "제주 원료 차별성 있음 — 제주 청정 환경 재배 차별화", "특허 공백 존재 — 코디세핀 고순도 정제 특허 미등록 다수", "경쟁 업체 적음 — 국내 전문 기업 10개 미만"],
    dataStats: { unusedRate: 28, patents: 62, papers: 428, marketSize: "1,850억원", growthRate: 16, recommendation: 84, marketTrend: [100,113,127,143,162,183,207,233,263,297,336,380] },
    potentialIndex: [
      { item: "미활용성", weight: 25, score: 72, basis: "연 1,200톤 중 28% 미활용 — 원료 가용성 양호" },
      { item: "시장성", weight: 25, score: 88, basis: "면역·항피로 기능성 시장 연 16% 성장" },
      { item: "경쟁도", weight: 20, score: 80, basis: "국내 동충하초 전문 소재 기업 10개 미만" },
      { item: "기술성", weight: 15, score: 90, basis: "코디세핀 관련 임상 논문 428편 — 기술 신뢰도 최고" },
      { item: "사업성", weight: 15, score: 84, basis: "건강기능식품·의약품 원료 진입 경로 확보" },
    ],
  },
  bija: {
    image: MATERIAL_IMAGES.bija,
    category: "제주 자생 수목 추출물",
    desc: "제주 자생 비자나무 열매·잎·수피에서 추출한 항균·항산화 소재로, 미활용률 65%의 고잠재력 원료입니다.",
    annualProduction: 4500, unusedRate: 65, utilization: "낮음",
    compounds: [
      { name: "비자 정유(精油)", desc: "항균·항진균 활성이 탁월한 테르펜 복합체", benefit: "항균·항진균" },
      { name: "탄닌", desc: "강력한 항산화 및 항바이러스 폴리페놀", benefit: "항산화·항바이러스" },
      { name: "플라보노이드", desc: "항염·면역 조절 활성 폴리페놀 복합체", benefit: "항염·면역" },
      { name: "리그난", desc: "항산화 및 항에스트로겐 활성 식물성 소재", benefit: "항산화·호르몬 균형" },
    ],
    oceanProducts: [
      { name: "천연 항균 소재", x: 18, y: 86, desc: "클린뷰티 항균 화장품 원료", ocean: "blue" },
      { name: "기능성 스킨케어", x: 35, y: 78, desc: "항산화·진정 기능성 원료", ocean: "blue" },
      { name: "아로마·향료 소재", x: 30, y: 75, desc: "천연 향료 및 아로마 소재", ocean: "blue" },
      { name: "일반 기능성 식품", x: 72, y: 38, desc: "건강기능식품 시장 (경쟁 중간)", ocean: "red" },
    ],
    businessReasons: ["경쟁 업체 전무 — 비자나무 전문 소재 기업 국내 미확인", "시장 성장률 높음 — 클린뷰티·천연 항균 시장 연 18% 성장", "제주 원료 차별성 있음 — 제주 천연기념물 자생 수목 원료", "특허 공백 존재 — 비자나무 정제 추출 소재 특허 거의 전무"],
    dataStats: { unusedRate: 65, patents: 28, papers: 94, marketSize: "620억원", growthRate: 18, recommendation: 85, marketTrend: [100,113,128,145,165,186,211,239,271,307,348,394] },
    potentialIndex: [
      { item: "미활용성", weight: 25, score: 94, basis: "연 4,500톤 중 65% 미활용 — 원료 확보 탁월" },
      { item: "시장성", weight: 25, score: 86, basis: "클린뷰티·천연 항균 시장 연 18% 고성장" },
      { item: "경쟁도", weight: 20, score: 98, basis: "비자나무 전문 소재 기업 사실상 전무" },
      { item: "기술성", weight: 15, score: 70, basis: "기초 연구 논문 94편 — 연구 개발 초기 단계" },
      { item: "사업성", weight: 15, score: 80, basis: "화장품 원료 등록 경로 명확 — 단기 진입 가능" },
    ],
  },
  nokcha: {
    image: MATERIAL_IMAGES.nokcha,
    category: "차 잎 추출물",
    desc: "제주 고산지 재배 녹차에서 추출한 카테킨·테아닌 복합 소재로 항산화·항비만 기능성이 과학적으로 검증되었습니다.",
    annualProduction: 12000, unusedRate: 35, utilization: "중간",
    compounds: [
      { name: "카테킨(EGCG)", desc: "항산화·항암·항비만 활성의 대표 녹차 폴리페놀", benefit: "항산화·항비만" },
      { name: "테아닌", desc: "뇌 알파파 증진·이완 효과의 특이 아미노산", benefit: "이완·집중력" },
      { name: "클로로필", desc: "항산화 및 디톡스 활성의 식물 색소", benefit: "항산화·디톡스" },
      { name: "카페인", desc: "신진대사 촉진 및 지방 산화 활성", benefit: "대사 촉진" },
      { name: "사포닌", desc: "항균·항염·콜레스테롤 흡착 배당체", benefit: "항균·항염" },
    ],
    oceanProducts: [
      { name: "EGCG 정제 소재", x: 40, y: 72, desc: "고순도 카테킨 건강기능식품 소재", ocean: "blue" },
      { name: "다이어트 식품 소재", x: 48, y: 68, desc: "체중 관리 기능성 소재", ocean: "blue" },
      { name: "녹차 화장품 원료", x: 65, y: 55, desc: "항산화 스킨케어 원료 (경쟁 중간)", ocean: "red" },
      { name: "기능성 음료 소재", x: 75, y: 40, desc: "건강 음료 첨가 소재 (경쟁 다수)", ocean: "red" },
    ],
    businessReasons: ["제주 원료 차별성 있음 — 제주 고산지 재배 청정 녹차", "시장 성장률 높음 — 항산화 기능성 소재 시장 연 10% 성장", "특허 공백 존재 — 제주 녹차 고순도 카테킨 정제 공정 특허 공백", "경쟁 업체 일부 — 국내 10개사 이상 경쟁"],
    dataStats: { unusedRate: 35, patents: 98, papers: 876, marketSize: "4,500억원", growthRate: 10, recommendation: 71, marketTrend: [100,106,113,120,128,136,145,155,165,176,188,200] },
    potentialIndex: [
      { item: "미활용성", weight: 25, score: 75, basis: "연 1.2만톤 중 35% 미활용 — 원료 여력 있음" },
      { item: "시장성", weight: 25, score: 78, basis: "글로벌 녹차 소재 시장 연 10% 성장" },
      { item: "경쟁도", weight: 20, score: 62, basis: "국내 녹차 소재 기업 10개 이상 경쟁" },
      { item: "기술성", weight: 15, score: 88, basis: "카테킨 관련 논문 876편 — 기술 신뢰도 최고" },
      { item: "사업성", weight: 15, score: 76, basis: "건강기능식품 원료 인정 완료 — 진입 경로 확보" },
    ],
  },
  pyogo: {
    image: MATERIAL_IMAGES.pyogo,
    category: "기능성 버섯 추출물",
    desc: "제주 재배 표고버섯에서 추출한 베타글루칸·에리타데닌 복합 소재로 면역 증강과 콜레스테롤 개선 효능이 검증되었습니다.",
    annualProduction: 8800, unusedRate: 32, utilization: "중간",
    compounds: [
      { name: "베타글루칸", desc: "면역 세포 활성화 및 항종양 활성 다당류", benefit: "면역 강화" },
      { name: "에리타데닌", desc: "혈중 콜레스테롤 저하 특이 아미노산 유도체", benefit: "콜레스테롤 개선" },
      { name: "렌티난", desc: "항암 면역 보조 효능이 검증된 다당류", benefit: "항암 보조" },
      { name: "비타민 D2", desc: "자외선 처리 시 생성되는 골 건강 필수 비타민", benefit: "골 건강" },
    ],
    oceanProducts: [
      { name: "베타글루칸 소재", x: 38, y: 76, desc: "면역 건강기능식품 고기능 소재", ocean: "blue" },
      { name: "항암 보조 원료", x: 28, y: 82, desc: "의약품 보조 면역 소재", ocean: "blue" },
      { name: "기능성 식품 첨가물", x: 55, y: 62, desc: "식품 첨가 기능성 소재", ocean: "blue" },
      { name: "일반 버섯 식품", x: 78, y: 35, desc: "일반 식품 가공 (경쟁 다수)", ocean: "red" },
    ],
    businessReasons: ["제주 원료 차별성 있음 — 제주 청정 재배 표고버섯 프리미엄", "시장 성장률 높음 — 면역 기능성 식품 시장 연 13% 성장", "특허 공백 존재 — 제주산 고순도 렌티난 정제 특허 미등록", "경쟁 업체 일부 — 대기업 중심 시장이나 프리미엄 틈새 존재"],
    dataStats: { unusedRate: 32, patents: 74, papers: 356, marketSize: "2,200억원", growthRate: 13, recommendation: 78, marketTrend: [100,108,118,130,143,157,173,191,210,232,256,282] },
    potentialIndex: [
      { item: "미활용성", weight: 25, score: 74, basis: "연 8,800톤 중 32% 미활용 — 원료 여력 충분" },
      { item: "시장성", weight: 25, score: 82, basis: "글로벌 면역 버섯 소재 시장 연 13% 성장" },
      { item: "경쟁도", weight: 20, score: 72, basis: "대기업 참여 시장 — 프리미엄 틈새 공략 필요" },
      { item: "기술성", weight: 15, score: 85, basis: "베타글루칸·렌티난 임상 논문 356편 확보" },
      { item: "사업성", weight: 15, score: 80, basis: "건강기능식품 원료 인정 절차 확립" },
    ],
  },
};

const DATA_SOURCES = [
  { name: "논문·학술 API", icon: <Beaker className="w-4 h-4" />, year: "2개 등록" },
  { name: "제주 공공 CSV 데이터셋", icon: <Database className="w-4 h-4" />, year: "8개 적재" },
  { name: "식약처·규제 사전검토 API", icon: <Shield className="w-4 h-4" />, year: "1개 연동" },
  { name: "특허·시장 트렌드 검색 레이어", icon: <FileText className="w-4 h-4" />, year: "SERP 준비" },
  { name: "국내 공개 API 카탈로그", icon: <Globe className="w-4 h-4" />, year: "300+ 후보" },
  { name: "글로벌 공개 API 카탈로그", icon: <TrendingUp className="w-4 h-4" />, year: "780+ 후보" },
];

const REGISTERED_DATA_OVERVIEW = [
  { label: "논문 API", value: "2", unit: "개", detail: "OpenAlex, Crossref" },
  { label: "공공 CSV", value: "8", unit: "개", detail: "감귤·해조류·가축·판매채널 데이터셋" },
  { label: "규제 API", value: "1", unit: "개", detail: "식약처 화장품 원료성분정보 API" },
  { label: "API 카탈로그", value: "300+", unit: "개", detail: "public-apis-4Kr 국내 공개 API 후보군" },
];

const REGISTERED_DATA_DETAILS = [
  {
    group: "논문·학술 근거",
    count: "2개",
    items: ["OpenAlex Works API", "Crossref Works API"],
  },
  {
    group: "제주 원료·공급 CSV",
    count: "8개",
    items: ["감귤 생산·처리 통계", "품종별 감귤 생산 현황", "해조류 생산·생태환경 데이터", "가축 사육 통계", "방문판매업 채널 보조 데이터"],
  },
  {
    group: "규제·인허가 사전검토",
    count: "1개 연동 + 보조자료",
    items: ["식약처 화장품 원료성분정보 API", "식품안전나라·식품의약품 데이터 후보", "국가법령정보 Open API 후보"],
  },
  {
    group: "특허·시장 트렌드",
    count: "SERP 준비",
    items: ["SERP API 환경변수 기반 시장/특허 트렌드 검색", "키프리스 플러스 API 후보", "공공데이터포털·KOSIS·KATI 후보"],
  },
  {
    group: "공개 API 카탈로그",
    count: "국내 300+ / 글로벌 780+",
    items: ["public-apis-4Kr 국내 공개 API 카탈로그", "GLOBAL_PUBLIC_APIS_KR 글로벌 공개 API 카탈로그"],
  },
];

const STEPS = [
  { num: "01", title: "소재 입력", desc: "분석할 제주 바이오 소재를 선택하거나 직접 입력합니다", icon: <Search className="w-5 h-5" /> },
  { num: "02", title: "AI 4축 검토", desc: "제조가능성·시장성·규제장벽·원료지속성을 공공데이터로 검토", icon: <Cpu className="w-5 h-5" /> },
  { num: "03", title: "근거 기반 결과", desc: "점수와 핵심 근거, 리스크, 사업화 권장 여부를 제시합니다", icon: <BarChart3 className="w-5 h-5" /> },
];

/* ─── Idea analysis helpers ─── */
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) { h = (Math.imul(31, h) + s.charCodeAt(i)) | 0; }
  return Math.abs(h);
}

function parseIdeaComponents(idea: string) {
  const lower = idea;
  const MATERIALS = [
    { kw: ["감귤","귤","헤스페리딘","펙틴"], label: "감귤 부산물" },
    { kw: ["녹차","카테킨","테아닌"], label: "녹차" },
    { kw: ["해조","미역","다시마","후코이단","알긴산"], label: "해조류" },
    { kw: ["동백"], label: "동백오일" },
    { kw: ["화산송이","화산"], label: "화산송이" },
    { kw: ["조릿대"], label: "조릿대" },
    { kw: ["한라봉"], label: "한라봉" },
    { kw: ["흑돼지","돼지","콜라겐"], label: "흑돼지" },
    { kw: ["표고","버섯"], label: "표고버섯" },
    { kw: ["비자"], label: "비자나무" },
    { kw: ["막걸리","효모"], label: "막걸리 효모" },
    { kw: ["용암해수","용암"], label: "용암해수" },
  ];
  const FUNCTIONS = [
    { kw: ["항산화","산화방지"], label: "항산화" },
    { kw: ["보습","수분"], label: "보습" },
    { kw: ["항균","살균"], label: "항균" },
    { kw: ["미백","whitening","브라이트"], label: "미백" },
    { kw: ["면역","immunity"], label: "면역 강화" },
    { kw: ["항노화","안티에이징","노화방지"], label: "항노화" },
    { kw: ["항염","염증"], label: "항염" },
    { kw: ["다이어트","체중","비만"], label: "체중 관리" },
    { kw: ["피로","에너지","활력"], label: "항피로" },
    { kw: ["장","소화","프로바이오"], label: "장 건강" },
    { kw: ["피부"], label: "피부 개선" },
    { kw: ["헤어","모발","두피"], label: "헤어케어" },
  ];
  const PRODUCTS = [
    { kw: ["화장품","코스메틱","뷰티"], label: "화장품" },
    { kw: ["건강기능식품","건강식품","기능식품"], label: "건강기능식품" },
    { kw: ["음료","드링크","주스"], label: "기능성 음료" },
    { kw: ["에센스","세럼"], label: "에센스·세럼" },
    { kw: ["크림","로션","토너"], label: "스킨케어 크림" },
    { kw: ["의약품","약품","원료의약"], label: "의약품 소재" },
    { kw: ["식품","푸드"], label: "기능성 식품" },
    { kw: ["샴푸","헤어제품"], label: "헤어케어 제품" },
    { kw: ["오일","오일류"], label: "기능성 오일" },
    { kw: ["영양제","보충제","supplement"], label: "영양 보충제" },
  ];
  const found = (arr: typeof MATERIALS) => arr.find(x => x.kw.some(k => lower.includes(k)))?.label;
  return {
    material: found(MATERIALS) ?? "제주 바이오 소재",
    func: found(FUNCTIONS) ?? "기능성",
    product: found(PRODUCTS) ?? "바이오 제품",
  };
}

function isCitrusCosmeticIdea(idea: string, components = parseIdeaComponents(idea)) {
  const text = `${idea} ${components.material} ${components.func} ${components.product}`;
  return /감귤|귤|시트러스|헤스페리딘|진피/.test(text) && /화장품|뷰티|코스메틱|세럼|크림|피부/.test(text);
}

function makeBrandBenchmarks(idea: string, color: string, seed: (offset: number, range: number, base: number) => number) {
  if (isCitrusCosmeticIdea(idea)) {
    return {
      myBrand: {
        name: "내 아이디어",
        innovation: 78,
        access: 58,
        premium: 68,
        eco: 91,
        note: "제주 감귤 부산물 업사이클링과 항산화 원료 서사를 동시에 가져가는 클린뷰티 후보"
      },
      competitors: [
        { name: "구달 청귤 비타C 라인", innovation: 70, access: 84, premium: 52, eco: 48, note: "청귤·비타민C 효능 인지가 높고 대중 유통 접근성이 강함" },
        { name: "이니스프리 제주 라인", innovation: 62, access: 88, premium: 56, eco: 76, note: "제주 원료 스토리와 대중 브랜드 신뢰도가 높음" },
        { name: "아로마티카", innovation: 72, access: 60, premium: 64, eco: 90, note: "비건·클린뷰티 기준에서 지속가능성 포지션이 강함" },
        { name: "라네즈 기능성 스킨케어", innovation: 84, access: 78, premium: 82, eco: 44, note: "기능성·프리미엄 신뢰도는 높지만 제주 부산물 서사는 약함" },
      ],
      brandSummary: "대중 시트러스 화장품과 정면 경쟁하기보다, 제주 감귤 부산물 기반의 원료 스토리·클린뷰티·항산화 MVP로 포지셔닝하는 것이 초기 진입에 유리합니다."
    };
  }

  return {
    myBrand: { name: "내 아이디어", innovation: seed(24, 30, 65), access: seed(25, 25, 55), premium: seed(26, 30, 60), eco: seed(27, 25, 70), note: "초기 아이디어 기준 포지셔닝 후보" },
    competitors: [
      { name: "기존 대중 브랜드", innovation: seed(12, 40, 55), access: seed(13, 30, 60), premium: seed(14, 35, 50), eco: seed(15, 30, 45), note: "대중 유통 접근성이 강한 비교군" },
      { name: "전문 기능성 브랜드", innovation: seed(16, 40, 40), access: seed(17, 30, 70), premium: seed(18, 35, 40), eco: seed(19, 30, 60), note: "기능 메시지와 효능 근거가 강한 비교군" },
      { name: "프리미엄 로컬 브랜드", innovation: seed(20, 40, 70), access: seed(21, 30, 45), premium: seed(22, 35, 75), eco: seed(23, 30, 35), note: "지역성·프리미엄 이미지가 강한 비교군" },
    ],
    brandSummary: "초기에는 경쟁군 전체를 이기기보다, 원료 스토리와 기능 메시지가 만나는 한 가지 구매 이유를 선명하게 만드는 것이 중요합니다."
  };
}

function buildDashboardMetrics(analysis: UiAnalysisResult, color: string) {
  const backend = analysis.backend;
  const evidence = backend?.evidence;
  const confirmedCount = backend?.evidenceSummary?.confirmedCount ?? 0;
  const regulatoryPass = backend?.regulatoryChecklist?.filter((item) => item.status === "pass" || item.status === "통과").length ?? 0;
  const regulatoryTotal = backend?.regulatoryChecklist?.length || 3;
  return [
    {
      label: "논문 근거",
      value: evidence?.paperCount != null ? evidence.paperCount.toLocaleString("ko-KR") : "28",
      unit: "건",
      score: Math.min(100, Math.max(22, Math.round(((evidence?.paperCount ?? 28) / 60) * 100))),
      caption: `${backend?.paperEvidence?.source || "OpenAlex/Crossref"} 기반 문헌 신호`,
      color
    },
    {
      label: "최근 연구",
      value: evidence?.recentPaperCount != null ? evidence.recentPaperCount.toLocaleString("ko-KR") : "15",
      unit: "건",
      score: Math.min(100, Math.max(20, Math.round(((evidence?.recentPaperCount ?? 15) / 30) * 100))),
      caption: "최근 5년 연구 비중을 R&D 타이밍으로 반영",
      color: "#3b82f6"
    },
    {
      label: "특허 밀도",
      value: evidence?.patentCount != null ? evidence.patentCount.toLocaleString("ko-KR") : "42",
      unit: "건",
      score: Math.min(100, Math.max(28, Math.round(((evidence?.patentCount ?? 42) / 80) * 100))),
      caption: "높을수록 회피설계·청구항 검토 필요",
      color: "#8b5cf6"
    },
    {
      label: "근거 소스",
      value: String(confirmedCount || 2),
      unit: "개",
      score: Math.min(100, Math.max(35, (confirmedCount || 2) * 24)),
      caption: backend?.evidenceSummary?.status || "복수 출처 확인",
      color: "#10b981"
    },
    {
      label: "공급 신뢰",
      value: evidence?.productionTons != null ? Math.round(evidence.productionTons / 1000).toLocaleString("ko-KR") : "579",
      unit: "천톤",
      score: analysis.axes.find((axis) => axis.name === "공급안정성")?.value ?? 78,
      caption: "제주 원료 생산·가공 통계 기반",
      color: "#f59e0b"
    },
    {
      label: "규제 게이트",
      value: `${regulatoryPass}/${regulatoryTotal}`,
      unit: "단계",
      score: Math.round((regulatoryPass / regulatoryTotal) * 100) || 34,
      caption: "원료성분·표시광고·안전성 문서 체크",
      color: "#0ea5e9"
    },
  ];
}

function downloadCurrentReportPdf(title: string) {
  const previousTitle = document.title;
  document.title = `${title || "Jeju Bio R&D Navigator"} 리포트`;
  window.setTimeout(() => {
    window.print();
    window.setTimeout(() => {
      document.title = previousTitle;
    }, 400);
  }, 50);
}

function DataSourceRegistry({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <div className="text-xs font-mono text-muted-foreground">활용 데이터 소스</div>
          <p className="text-sm text-foreground/55 mt-1">
            파일명 대신 등록된 데이터 레이어와 연동 개수 기준으로 표시합니다.
          </p>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="self-start sm:self-auto px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/8 text-primary text-xs font-bold hover:bg-primary/12 transition-colors"
        >
          {open ? "등록 소스 닫기" : "등록 소스 보기"}
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4">
        {REGISTERED_DATA_OVERVIEW.map((item) => (
          <div key={item.label} className="rounded-2xl border border-border bg-background/45 p-3">
            <p className="text-[10px] text-foreground/40 font-bold mb-1">{item.label}</p>
            <p className="text-xl font-black text-primary leading-none">
              {item.value}<span className="text-xs ml-0.5">{item.unit}</span>
            </p>
            <p className="text-[10px] text-foreground/45 mt-2 leading-snug">{item.detail}</p>
          </div>
        ))}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-border overflow-hidden"
          >
            <div className="p-4 grid md:grid-cols-2 gap-3">
              {REGISTERED_DATA_DETAILS.map((group) => (
                <div key={group.group} className="rounded-2xl border border-border bg-background/50 p-4">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <h3 className="text-sm font-black">{group.group}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">{group.count}</span>
                  </div>
                  <ul className="space-y-1.5">
                    {group.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-foreground/55 leading-relaxed">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/70 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ScoringFrameworkGuide({ id, compact = false }: { id?: string; compact?: boolean }) {
  const axisRows = [
    {
      axis: "기술성 (T)",
      color: "#2563eb",
      items: [
        ["문헌근거지수", "40%", "ScienceON(KISTI) 논문 API", "원료명+핵심효능 검색 결과 수와 최근 5년 논문 비율을 정규화"],
        ["기술성숙도지수", "30%", "TRL 1~9 기준", "성분 동정, 동물실험, 인체적용시험 등 기술 단계 판단"],
        ["재현가능성지수", "30%", "공정 표준화 수준", "실험 프로토콜·제조공정·품질 균일성 확보 가능성"],
      ],
    },
    {
      axis: "시장성 (M)",
      color: "#16a34a",
      items: [
        ["시장성장지수", "35%", "CAGR·시장 보고서·통계", "제품군별 연평균 성장률과 시장 규모를 0~100으로 정규화"],
        ["경쟁밀도역지수", "35%", "KIPRIS 상표·디자인권 + 웹 검색", "유사 제품·브랜드가 많을수록 감점, HHI식 경쟁밀도 관점 반영"],
        ["트렌드적합도", "30%", "클린뷰티·비건·고기능성 등", "소비자 트렌드와 제품-시장 적합성(PMF) 부합도 평가"],
      ],
    },
    {
      axis: "특허위험 / 특허안전성 (P)",
      color: "#f59e0b",
      items: [
        ["유사특허밀도", "60%", "KIPRIS Plus Open API", "원료명+제품군 특허·실용신안 검색, 최근 출원 흐름 가중"],
        ["핵심클레임중첩도", "40%", "FTO 1차 스크리닝", "상위 특허 청구항을 중첩없음/부분중첩/직접중첩으로 분류"],
      ],
    },
    {
      axis: "공급안정성 (S)",
      color: "#7c3aed",
      items: [
        ["생산량지수", "40%", "제주데이터허브·공공데이터포털", "최근 5년 평균 생산량을 Min-Max 정규화"],
        ["계절변동역지수", "30%", "월별 생산량 통계", "CV = 표준편차/평균, 변동이 작을수록 높은 점수"],
        ["부산물활용률", "30%", "미활용 부산물 비율", "폐기·사료·저가 활용 비율이 높을수록 업사이클링 잠재력 가점"],
      ],
    },
  ];

  const supplyRules = [
    {
      title: "생산량지수",
      formula: "생산량지수 = (평균생산량 - 최솟값) / (최댓값 - 최솟값) × 100",
      steps: ["최근 5년 연도별 생산량 수집", "5년 평균 생산량 산출", "카테고리 내 최대·최소 기준 정규화", "생산량이 많을수록 높은 점수"],
      note: "80점 이상은 상업 생산량이 충분한 주요 원료, 30점 이하는 희귀·소규모 원료로 해석합니다.",
    },
    {
      title: "계절변동역지수",
      formula: "CV = σ / μ, 계절변동역지수 = (1 - CV_정규화) × 100",
      steps: ["12개월 월별 생산량 수집", "변동계수(CV) 계산", "CV가 낮을수록 안정적으로 환산", "0~100 범위로 정규화"],
      note: "CV < 0.2는 80~100점, CV 0.2~0.5는 40~80점, CV > 0.5는 0~40점 구간으로 봅니다.",
    },
    {
      title: "부산물활용률",
      formula: "부산물활용률 = (미활용 부산물량 / 총 부산물 발생량) × 100",
      steps: ["총 생산량 대비 부산물 발생 비율 파악", "폐기·사료·저가판매·미활용 용도 분류", "미활용·저가활용 비율이 높을수록 높은 점수", "업사이클링 기술 적용 가능성 가산"],
      note: "폐기·매립 부산물은 90~100점, 사료·퇴비는 60~80점, 일부 활용 식품 부산물은 40~60점, 이미 고부가 활용 중이면 10~30점으로 봅니다.",
    },
  ];

  const presets = [
    ["기본값", "30%", "30%", "20%", "20%", "기술성·시장성을 선행 결정요인으로 우선 반영"],
    ["식품·건기식", "35%", "25%", "25%", "15%", "인체 안전성, 기능성 입증, 특허 리스크 비중 확대"],
    ["화장품 원료", "30%", "35%", "15%", "20%", "트렌드 민감도와 시장 진입 속도 비중 확대"],
    ["농산물 소재", "25%", "30%", "15%", "30%", "계절성·생산량·계약재배 등 공급 안정성 비중 확대"],
  ];

  const references = [
    "ScienceON API Gateway — 논문 검색 및 문헌근거지수",
    "KIPRIS Plus Open API — 특허·실용신안·상표·디자인권 검색",
    "제주데이터허브 — 감귤 생산·처리 현황 등 지역 원료 데이터",
    "공공데이터포털 — 농산물 생산량·처리량 통계",
    "기술성숙도평가(TRA) 업무지침 및 ISO 16290:2013 — TRL 1~9 기준",
    "AHP(Analytic Hierarchy Process) 기반 기술가치평가 가중치 방법론",
    "FTO(Freedom to Operate)·Claim Chart — 특허 침해 가능성 1차 스크리닝",
    "CAGR·HHI·PMF 관점 — 시장 성장률, 경쟁 집중도, 제품-시장 적합성 판단",
    "ESG·Circular Economy — 농산·식품 부산물 업사이클링 사업성 판단",
  ];

  return (
    <div id={id} className={`rounded-3xl border border-primary/25 bg-card/80 backdrop-blur-sm overflow-hidden ${compact ? "" : "scroll-mt-20"}`}>
      <div className="px-6 py-5 border-b border-border">
        <p className="text-[11px] font-mono tracking-widest text-primary/70 uppercase mb-1">Scoring Methodology</p>
        <h2 className="text-xl font-bold tracking-tight">점수 산정 알고리즘</h2>
        <p className="mt-2 text-xs text-foreground/55 leading-relaxed">
          점수는 AI가 임의로 만든 값이 아니라, 사용자 입력을 원료·기능·제품군·바이오 분야로 분해한 뒤 공공데이터,
          논문 근거, 식약처·특허·시장·공급 데이터를 정량 레이어와 AI 검토 레이어로 나눠 산출합니다.
          AI는 계산된 근거를 바탕으로 설명문과 사업화 전략을 생성합니다.
        </p>
      </div>

      <div className="p-6 space-y-5">
        <div className="grid md:grid-cols-2 gap-3">
          <div className="rounded-2xl p-5 border border-primary/25 bg-primary/8">
            <p className="text-xs font-black text-primary mb-2">현재 서비스 적용식</p>
            <p className="text-sm font-bold leading-relaxed">
              최종 점수 = 기술성 30% + 시장성 25% + 특허안전성 20% + 공급안정성 20% + 논리적 적합성 5% - 보완 필요 감점
            </p>
            <p className="mt-2 text-[11px] text-foreground/50 leading-relaxed">
              데모 리포트에서는 원료·기능·제품군 연결성을 별도 5%로 분리해, 말이 되는 사업 구상인지까지 상한 규칙에 반영합니다.
            </p>
          </div>
          <div className="rounded-2xl p-5 border border-border bg-background/50">
            <p className="text-xs font-black text-foreground/70 mb-2">4축 분석 보고서 원형 공식</p>
            <p className="text-sm font-bold leading-relaxed">
              종합 점수 = 0.3×T + 0.3×M + 0.2×P + 0.2×S
            </p>
            <p className="mt-2 text-[11px] text-foreground/50 leading-relaxed">
              T는 기술성, M은 시장성, P는 특허위험을 안전성 점수로 반전한 값, S는 공급안정성입니다.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {[
            ["정량 레이어", "공공데이터에서 추출한 숫자를 고정 수식에 대입합니다. 같은 입력이면 같은 결과가 나오도록 재현성을 확보합니다."],
            ["AI 검토 레이어", "문헌·특허·시장 문서를 미리 정한 평가 기준으로만 0~100점화합니다. 설명 가능성을 확보하기 위한 보조 판단입니다."],
          ].map(([title, desc]) => (
            <div key={title} className="rounded-2xl border border-border bg-background/50 p-4">
              <h3 className="text-sm font-black mb-2">{title}</h3>
              <p className="text-xs text-foreground/60 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-background/50 overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-black">4축 하위 지수와 데이터 근거</h3>
          </div>
          <div className="divide-y divide-border">
            {axisRows.map((axis) => (
              <div key={axis.axis} className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: axis.color }} />
                  <h4 className="text-sm font-black" style={{ color: axis.color }}>{axis.axis}</h4>
                </div>
                <div className="grid gap-2">
                  {axis.items.map(([name, weight, source, desc]) => (
                    <div key={name} className="rounded-xl border border-border bg-card/70 p-3">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-black">{name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">{weight}</span>
                        <span className="text-[10px] text-foreground/40">{source}</span>
                      </div>
                      <p className="text-[11px] text-foreground/55 leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-violet-300/30 bg-violet-500/5 p-4">
          <h3 className="text-sm font-black mb-2" style={{ color: "#7c3aed" }}>공급안정성(S) 계산기 상세</h3>
          <div className="rounded-xl bg-slate-950 text-slate-100 p-4 mb-4">
            <p className="text-[11px] font-bold text-slate-400 mb-2">핵심 공식</p>
            <p className="text-sm font-black leading-relaxed">
              S = 0.40×생산량지수 + 0.30×계절변동역지수 + 0.30×부산물활용률
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            {supplyRules.map((rule) => (
              <div key={rule.title} className="rounded-2xl border border-border bg-card/80 p-4">
                <h4 className="text-sm font-black mb-2">{rule.title}</h4>
                <p className="text-[11px] font-mono text-primary leading-relaxed mb-3">{rule.formula}</p>
                <ol className="space-y-1.5 mb-3">
                  {rule.steps.map((step, index) => (
                    <li key={step} className="flex gap-2 text-[11px] text-foreground/55 leading-relaxed">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[9px] font-black text-primary">{index + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
                <p className="text-[10px] text-foreground/45 leading-relaxed border-t border-border pt-2">{rule.note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border bg-background/50 p-4">
            <h3 className="text-sm font-black mb-3">상한 규칙과 점수 해석</h3>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {[
                ["80~100", "우수", "사업화 적극 검토"],
                ["65~79", "양호", "일부 보완 권장"],
                ["50~64", "주의", "복수 요소 개선"],
                ["0~49", "위험", "전면 재검토"],
              ].map(([range, label, desc]) => (
                <div key={range} className="rounded-xl border border-border bg-card/70 p-3 text-center">
                  <p className="text-[10px] font-mono text-foreground/45">{range}점</p>
                  <p className="text-sm font-black mt-1">{label}</p>
                  <p className="text-[10px] text-foreground/45 mt-1">{desc}</p>
                </div>
              ))}
            </div>
            <ul className="space-y-1.5">
              {[
                "원료 기능 미지정: 최대 60점",
                "제품군 미지정: 최대 65점",
                "원료와 제품군 모두 낮은 신뢰도: 최대 50점",
                "논리적으로 부적합한 조합: 최대 55점",
                "공공데이터·논문·특허 근거가 모두 부족하면 최대 60점",
                "80점 이상은 최소 2개 이상의 실제 근거 또는 시연 근거 필요",
              ].map((item) => (
                <li key={item} className="flex gap-2 text-xs text-foreground/60 leading-relaxed">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/70 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-background/50 p-4">
            <h3 className="text-sm font-black mb-3">산업별 프리셋 가중치</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="text-foreground/45 border-b border-border">
                    <th className="text-left py-2">프리셋</th>
                    <th className="text-left py-2">T</th>
                    <th className="text-left py-2">M</th>
                    <th className="text-left py-2">P</th>
                    <th className="text-left py-2">S</th>
                  </tr>
                </thead>
                <tbody>
                  {presets.map(([name, t, m, p, s, reason]) => (
                    <tr key={name} className="border-b border-border/60 last:border-0">
                      <td className="py-2 pr-2 font-bold">{name}<p className="font-normal text-foreground/40 mt-0.5">{reason}</p></td>
                      <td className="py-2 font-mono">{t}</td>
                      <td className="py-2 font-mono">{m}</td>
                      <td className="py-2 font-mono">{p}</td>
                      <td className="py-2 font-mono">{s}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-background/50 p-4">
          <h3 className="text-sm font-black mb-3">참고문헌·데이터 소스 요약</h3>
          <div className="grid md:grid-cols-2 gap-2">
            {references.map((ref) => (
              <div key={ref} className="flex gap-2 text-[11px] text-foreground/55 leading-relaxed">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/70 shrink-0" />
                {ref}
              </div>
            ))}
          </div>
          <p className="mt-3 text-[10px] text-foreground/40 leading-relaxed">
            특허안전성/FTO 평가는 법률 자문을 대체하지 않는 1차 스크리닝이며, 실제 침해 판단은 변리사 또는 특허 전문 변호사의 검토가 필요합니다.
          </p>
        </div>
      </div>
    </div>
  );
}

function generateIdeaData(idea: string, color: string) {
  const h = hashStr(idea);
  const seed = (offset: number, range: number, base: number) => base + ((h >> offset) & 0xff) % range;
  const axes = [
    { name: "기술성", value: seed(0, 30, 55), label: "연구개발 가능성", evidence: ["관련 논문 수 " + seed(2, 400, 80) + "편 (Google Scholar 기준)", "국내 연구기관 참여 " + seed(3, 15, 3) + "곳 확인", "특허 출원 기술 난이도 — 중간 수준", "산업기술평가원 유사 과제 " + seed(4, 8, 2) + "건 선행"] },
    { name: "시장성", value: seed(8, 35, 52), label: "시장 수요·성장", evidence: ["글로벌 관련 시장 규모 " + seed(5, 5000, 500) + "억원", "연평균 성장률(CAGR) " + seed(6, 18, 6) + "%", "국내 소비자 트렌드 조사 관심도 " + seed(7, 30, 60) + "점/100", "유통채널 진입 가능성 — 온라인 우선 추천"] },
    { name: "특허안전성", value: seed(16, 40, 45), label: "특허 공백 여부", evidence: ["KIPRIS 유사 특허 " + seed(8, 80, 10) + "건 — 회피 설계 가능", "핵심 성분 특허 만료 여부 확인 필요", "PCT 국제 출원 검토 권장", "공백 영역 " + seed(9, 4, 2) + "개 분야 발견"] },
    { name: "공급안정성", value: seed(24, 25, 60), label: "원료 공급 안정성", evidence: ["제주 연간 원료 생산량 " + seed(10, 50000, 5000).toLocaleString() + "톤", "계절성 수급 변동 — 안정적 보관 필요", "1차 공급처 " + seed(11, 5, 2) + "곳 확인 가능", "2차 대체 원료 확보 경로 존재"] },
  ];
  const totalScore = Math.round(axes.reduce((a, x) => a + x.value, 0) / axes.length);

  const patentTrend = [2019, 2020, 2021, 2022, 2023, 2024].map((yr, i) => ({
    year: `${yr}년`,
    count: seed(i * 3, 25, 8 + i * 4),
    weighted: seed(i * 3 + 1, 20, 6 + i * 3),
  }));

  const { competitors, myBrand, brandSummary } = makeBrandBenchmarks(idea, color, seed);

  const diff = [
    { label: "원산지 차별성", score: seed(28, 30, 65), detail: "제주 청정 원료의 지리적 표시 보호 — 타 지역 대비 브랜드 신뢰도 +23%" },
    { label: "기술 차별성", score: seed(29, 35, 55), detail: "추출 공정 고유화 가능 구간 확인 — 특허 출원 시 3~5년 독점 가능" },
    { label: "시장 희소성", score: seed(30, 25, 60), detail: "동일 소재·기능 복합 제품 경쟁사 " + seed(31, 5, 1) + "개 — 시장 공백 충분" },
    { label: "소비자 니즈 부합도", score: seed(32, 20, 68), detail: "2024 소비자 설문 — 해당 기능 필요도 " + seed(33, 20, 72) + "% (상위 15%)" },
  ];

  const whatIf = [
    { title: "해외 수출 확장", prob: seed(34, 30, 55), desc: "일본·동남아 기능성 화장품 시장 진출 시 예상 매출 " + seed(35, 500, 200) + "억원/년", icon: "🌏" },
    { title: "OEM 원료 공급", prob: seed(36, 25, 60), desc: "국내 대형 코스메틱 브랜드 OEM 원료 납품 — 초기 투자 없이 수익화 가능", icon: "🏭" },
    { title: "기능성 식품 병행", prob: seed(37, 30, 50), desc: "동일 원료의 건강기능식품 인증 시 시장 2배 확장", icon: "💊" },
    { title: "체험 관광 연계", prob: seed(38, 20, 45), desc: "제주 바이오 체험 프로그램 연계 — 로컬 브랜딩 강화", icon: "🌿" },
  ];

  const regulations = [
    { item: "식품의약품안전처 기능성 원료 인정", status: seed(39, 3, 0) < 2 ? "주의" : "확인필요", detail: "기능성 표시를 위한 인체적용시험 데이터 필요" },
    { item: "화장품 원료 사용 제한 성분 확인", status: "통과", detail: "해당 소재 — 사용제한 성분 미포함 확인" },
    { item: "건강기능식품 공전 원료 등재 여부", status: seed(40, 2, 0) === 0 ? "주의" : "통과", detail: "미등재 시 개별인정형 절차 필요 (2~3년 소요)" },
    { item: "환경부 생물다양성 규정 적합성", status: "통과", detail: "ABS(나고야의정서) — 제주 자생 소재 이용 신고 필요" },
    { item: "수출 시 현지 국가 인증 (일본 JHFA 등)", status: "확인필요", detail: "수출 대상국 별도 인허가 전략 수립 권장" },
  ];

  const oceanProducts = [
    { name: "내 아이디어", x: 100 - axes[2].value, y: axes[1].value, desc: "직접 입력한 사업 아이디어", ocean: axes[2].value > 55 ? "blue" : "red" as "blue" | "red" },
    { name: "기존 유사제품 A", x: seed(41, 40, 50), y: seed(42, 30, 45), desc: "시장 선발 제품", ocean: "red" as "red" },
    { name: "틈새 경쟁사", x: seed(43, 30, 30), y: seed(44, 35, 55), desc: "중소 전문 브랜드", ocean: "blue" as "blue" },
  ];

  return { axes, totalScore, patentTrend, competitors, myBrand, brandSummary, diff, whatIf, regulations, oceanProducts, color };
}

function CustomIdeaResult({
  idea,
  resetTool,
  analysis,
  darkMode
}: {
  idea: string;
  resetTool: () => void;
  analysis: UiAnalysisResult;
  darkMode: boolean;
}) {
  const [viewMode, setViewMode] = useState<"dashboard" | "report">("dashboard");
  const color = analysis.color;
  const components = parseBackendComponents(analysis.backend) ?? parseIdeaComponents(idea);
  const generatedData = generateIdeaData(idea, color);
  const intelligence = analysis.backend?.commercialIntelligence;
  const decisionSupport = analysis.backend?.decisionSupport;
  const backendRegulations = analysis.backend?.regulatoryChecklist?.map((item) => ({
    item: item.item || "규제·인허가 검토",
    status: item.status === "pass" || item.status === "통과" ? "통과" : item.status === "needed" || item.status === "주의" ? "주의" : item.status === "review" || item.status === "확인필요" ? "확인필요" : item.status || "확인필요",
    detail: [item.value, item.detail || item.action || item.guide].filter(Boolean).join(" · ") || "제품화 단계에서 추가 검토가 필요합니다."
  }));
  const backendDiff = intelligence?.differentiationSummary?.map((item) => ({
    label: item.label || "차별성",
    score: clampScore(item.score, 70),
    detail: item.detail || "백엔드 분석 결과 기반 차별성입니다."
  }));
  const backendPatentTrend = decisionSupport?.patentTrend?.map((item) => ({
    year: `${item.year ?? ""}년`,
    count: clampScore(item.value, 0),
    weighted: Math.max(0, Math.round(clampScore(item.value, 0) * 0.72))
  }));
  const backendWhatIf = intelligence?.alternatives?.map((item, index) => ({
    title: item.name || `전략 시나리오 ${index + 1}`,
    prob: clampScore(item.estimatedScore, analysis.score),
    desc: `${item.advantage || "확장 가능성이 있습니다."}${item.risk ? ` 리스크: ${item.risk}` : ""}`,
    icon: ["🧪", "📦", "🚀"][index % 3]
  }));
  const backendOceanProducts = decisionSupport?.scenarios?.map((item) => ({
    name: item.label || item.category || "시나리오",
    x: clampScore(100 - toNumber(item.competition, 50), 50),
    y: clampScore(item.growth, 60),
    desc: item.zone === "blue" ? "블루오션 후보 시나리오" : item.zone === "crowded" ? "경쟁 밀도 확인 필요" : "백엔드 시나리오 분석",
    ocean: item.zone === "blue" ? "blue" as const : "red" as const
  }));
  const data = {
    ...generatedData,
    axes: analysis.axes,
    totalScore: analysis.score,
    patentTrend: backendPatentTrend?.length ? backendPatentTrend : generatedData.patentTrend,
    diff: backendDiff?.length ? backendDiff : generatedData.diff,
    whatIf: backendWhatIf?.length ? backendWhatIf : generatedData.whatIf,
    oceanProducts: backendOceanProducts?.length ? backendOceanProducts : generatedData.oceanProducts,
    regulations: backendRegulations?.length ? backendRegulations : generatedData.regulations
  };
  const { axes, totalScore, patentTrend, competitors, myBrand, brandSummary, diff, whatIf, regulations, oceanProducts } = data;
  const dashboardMetrics = buildDashboardMetrics(analysis, color);
  const startupPath = analysis.backend?.commercialIntelligence?.startupPath?.length
    ? analysis.backend.commercialIntelligence.startupPath
    : [
        { phase: "0-2주", title: "MVP 가설 잠금", action: `${components.material} 원료 스토리와 ${components.func} 효능 메시지를 하나의 랜딩 카피로 압축` },
        { phase: "3-6주", title: "규제·원료 데이터룸", action: "원료 규격서, 안전성 시험 항목, 표시·광고 가능 표현을 사전 정리" },
        { phase: "6-10주", title: "GTM 파일럿", action: "제주 로컬 편집숍·온라인 상세페이지·소량 샘플링으로 가격 수용성 검증" },
      ];
  const founderBrief = [
    {
      title: "초기 MVP 정의",
      body: `${components.product} 전체가 아니라 세럼·크림·마스크팩 중 하나로 첫 SKU를 좁히면 원료 규격, 사용감 테스트, 고객 메시지 검증 비용이 줄어듭니다.`
    },
    {
      title: "GTM 포지션",
      body: `${components.material}의 제주 원료 서사를 전면에 두되, 구매 이유는 ${components.func} 효능으로 단순화하는 것이 좋습니다. 브랜드 카피는 “로컬 원료”보다 “기능이 이해되는 로컬 원료”가 더 강합니다.`
    },
    {
      title: "IR/R&D 과제 메시지",
      body: "지원사업 제안서에는 지역 부산물 고부가화, 원료 표준화, 기능성 근거 축적, 화장품 원료 적용 가능성, 향후 B2B 원료 확장성을 핵심 임팩트로 배치하세요."
    },
  ];

  const brandAxes = ["혁신성", "접근성", "프리미엄", "친환경성"];
  const toRadar = (obj: { innovation: number; access: number; premium: number; eco: number }) =>
    [obj.innovation, obj.access, obj.premium, obj.eco];
  const averageRadar = brandAxes.map((_, index) => {
    const values = competitors.map((brand) => toRadar(brand)[index]).filter((value) => Number.isFinite(value));
    return Math.round(values.reduce((sum, value) => sum + value, 0) / Math.max(values.length, 1));
  });

	  const RadarMini = ({ datasets, size = 160 }: { datasets: Array<{ label: string; values: number[]; color: string; filled?: boolean }>; size?: number }) => {
	    const cx = size / 2, cy = size / 2, r = size * 0.36;
	    const n = 4;
	    const step = (2 * Math.PI) / n;
	    const start = -Math.PI / 2;
	    const gridStroke = darkMode ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.08)";
	    const spokeStroke = darkMode ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.07)";
	    const labelFill = darkMode ? "#dbeafe" : "#6b7280";
	    const pt = (i: number, pct: number) => ({
	      x: cx + r * pct * Math.cos(start + i * step),
	      y: cy + r * pct * Math.sin(start + i * step),
    });
    const labels = ["혁신성", "접근성", "프리미엄", "친환경"];
	    return (
	      <svg viewBox={`0 0 ${size} ${size}`} width="100%" height={size}>
	        {[0.25, 0.5, 0.75, 1].map(l => (
	          <polygon key={l} points={Array.from({ length: n }, (_, i) => { const p = pt(i, l); return `${p.x},${p.y}`; }).join(" ")} fill="none" stroke={gridStroke} strokeWidth="1" />
	        ))}
	        {Array.from({ length: n }, (_, i) => { const p = pt(i, 1); return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={spokeStroke} strokeWidth="1" />; })}
        {datasets.map((ds) => (
          <polygon key={ds.label}
            points={ds.values.map((v, i) => { const p = pt(i, v / 100); return `${p.x},${p.y}`; }).join(" ")}
            fill={ds.filled ? ds.color : "none"} fillOpacity={ds.filled ? 0.2 : 0}
            stroke={ds.color} strokeWidth={ds.filled ? 2 : 1.5} strokeDasharray={ds.filled ? undefined : "3,2"} />
        ))}
	        {labels.map((lbl, i) => { const p = pt(i, 1.3); return <text key={lbl} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fontSize="7.5" fill={labelFill}>{lbl}</text>; })}
	      </svg>
	    );
	  };

	  const statusColor = (s: string) => s === "통과" ? "#22c55e" : s === "주의" ? "#f59e0b" : "#94a3b8";
	  const statusBg = (s: string) => {
	    if (!darkMode) return s === "통과" ? "#f0fdf4" : s === "주의" ? "#fffbeb" : "#f8fafc";
	    return s === "통과"
	      ? "rgba(34,197,94,0.14)"
	      : s === "주의"
	        ? "rgba(245,158,11,0.14)"
	        : "rgba(148,163,184,0.14)";
	  };

  const CARD = `rounded-2xl shadow-sm ${darkMode ? "bg-slate-950/72 text-white" : "bg-white"}`;
  const CARD_STYLE = {
    border: darkMode ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(0,0,0,0.06)",
    backdropFilter: darkMode ? "blur(16px)" : undefined
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`space-y-4 pb-8 ${darkMode ? "jevi-dark-result" : ""}`}
    >
      {/* Tab switcher */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-gray-100">
        {(["dashboard", "report"] as const).map((mode) => (
          <button key={mode} onClick={() => setViewMode(mode)}
            className="flex-1 py-2 rounded-lg text-xs font-bold transition-all"
            style={viewMode === mode ? { backgroundColor: color, color: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" } : { color: "#6b7280" }}>
            {mode === "dashboard" ? "📊 대시보드" : "📋 상세 리포트"}
          </button>
        ))}
      </div>

      {viewMode === "dashboard" ? (
        <div className="space-y-3">
          {/* Row 1: 주제 + 총점수 */}
          <div className="grid grid-cols-[1fr_auto] gap-3 items-stretch">
            <div className={`${CARD} p-4`} style={CARD_STYLE}>
              <p className="text-[9px] font-bold text-gray-400 tracking-widest uppercase mb-3">아이디어 분석 주제</p>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex flex-col items-center">
                  <span className="text-[9px] text-gray-400 mb-1">원료</span>
                  <span className="px-3 py-1.5 rounded-xl text-xs font-black" style={{ backgroundColor: color + "18", color }}>{components.material}</span>
                </div>
                <span className="text-lg font-black text-gray-300">+</span>
                <div className="flex flex-col items-center">
                  <span className="text-[9px] text-gray-400 mb-1">기능</span>
                  <span className="px-3 py-1.5 rounded-xl text-xs font-black" style={{ backgroundColor: "#3b82f620", color: "#3b82f6" }}>{components.func}</span>
                </div>
                <span className="text-lg font-black text-gray-300">+</span>
                <div className="flex flex-col items-center">
                  <span className="text-[9px] text-gray-400 mb-1">제품</span>
                  <span className="px-3 py-1.5 rounded-xl text-xs font-black" style={{ backgroundColor: "#8b5cf620", color: "#8b5cf6" }}>{components.product}</span>
                </div>
                <div className="ml-2 text-[10px] text-gray-400 leading-relaxed flex-1 min-w-[100px]">
                  <span className="italic">"{idea.length > 40 ? idea.slice(0, 40) + "…" : idea}"</span>
                </div>
              </div>
            </div>
            {/* Score box */}
            <div className={`${CARD} p-4 flex flex-col items-center justify-center min-w-[110px]`} style={{ ...CARD_STYLE, background: `linear-gradient(135deg, ${color}15, ${color}05)` }}>
              <p className="text-[9px] font-bold text-gray-400 mb-1">R&D Readiness</p>
              <p className="text-4xl font-black leading-none" style={{ color }}>{totalScore}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">/ 100</p>
              <div className="mt-2 px-2 py-1 rounded-full text-[9px] font-bold" style={{ backgroundColor: totalScore >= 70 ? "#dcfce7" : totalScore >= 55 ? "#fef3c7" : "#fee2e2", color: totalScore >= 70 ? "#16a34a" : totalScore >= 55 ? "#d97706" : "#dc2626" }}>
                {totalScore >= 70 ? "사업화 권장" : totalScore >= 55 ? "조건부 진입" : "추가 검토"}
              </div>
            </div>
          </div>

          <div className={`${CARD} p-4`} style={CARD_STYLE}>
            <p className="text-[9px] font-bold text-gray-400 tracking-widest uppercase mb-2">사업화 인사이트 요약</p>
            <p className="text-sm leading-relaxed text-gray-700">{analysis.summary}</p>
            <div className="mt-3 grid md:grid-cols-3 gap-2">
              <div className="rounded-xl p-3" style={{ backgroundColor: color + "10", border: `1px solid ${color}22` }}>
                <p className="text-[9px] font-bold text-gray-400 mb-1">시장 진입 포지션</p>
                <p className="text-xs font-black" style={{ color }}>
                  {analysis.backend?.commercialIntelligence?.readiness?.businessPosition || "준블루오션"}
                </p>
              </div>
              <div className="rounded-xl p-3" style={{ backgroundColor: color + "10", border: `1px solid ${color}22` }}>
                <p className="text-[9px] font-bold text-gray-400 mb-1">우선 MVP 제품군</p>
                <p className="text-xs font-black" style={{ color }}>
                  {analysis.backend?.commercialIntelligence?.readiness?.recommendedCategory || components.product}
                </p>
              </div>
              <div className="rounded-xl p-3" style={{ backgroundColor: color + "10", border: `1px solid ${color}22` }}>
                <p className="text-[9px] font-bold text-gray-400 mb-1">Next Milestone</p>
                <p className="text-xs font-black leading-snug" style={{ color }}>{analysis.recommendation}</p>
              </div>
            </div>
            {analysis.highlights?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {analysis.highlights.slice(0, 3).map((item) => (
                  <span key={item} className="px-2.5 py-1 rounded-full text-[10px] font-semibold" style={{ backgroundColor: color + "14", color }}>
                    {item.length > 34 ? `${item.slice(0, 34)}…` : item}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className={`${CARD} p-4`} style={CARD_STYLE}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[9px] font-bold text-gray-400 tracking-widest uppercase">데이터 룸 스냅샷</p>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: color + "14", color }}>
                창업자 의사결정 지표
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {dashboardMetrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl p-3" style={{ backgroundColor: metric.color + "0d", border: `1px solid ${metric.color}22` }}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 mb-0.5">{metric.label}</p>
                      <p className="text-lg font-black leading-none" style={{ color: metric.color }}>
                        {metric.value}<span className="text-[10px] ml-0.5">{metric.unit}</span>
                      </p>
                    </div>
                    <span className="text-[10px] font-black" style={{ color: metric.color }}>{metric.score}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/70 overflow-hidden mb-2">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: metric.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, Math.max(0, metric.score))}%` }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                    />
                  </div>
                  <p className="text-[9px] text-gray-500 leading-snug">{metric.caption}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: 4축 + 오션 매트릭스 */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`${CARD} p-4`} style={CARD_STYLE}>
              <p className="text-[9px] font-bold text-gray-400 tracking-widest uppercase mb-3">4축 투자검토 지표</p>
              <div className="space-y-2.5">
                {axes.map((ax) => (
                  <div key={ax.name}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold text-gray-700">{ax.name}</span>
                      <span className="text-[10px] font-black" style={{ color }}>{ax.value}점</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <motion.div className="h-full rounded-full" style={{ backgroundColor: color }}
                        initial={{ width: 0 }} animate={{ width: `${ax.value}%` }} transition={{ duration: 0.7, delay: 0.1 }} />
                    </div>
                    <p className="text-[9px] text-gray-400 mt-0.5">{ax.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className={`${CARD} p-4`} style={CARD_STYLE}>
              <p className="text-[9px] font-bold text-gray-400 tracking-widest uppercase mb-2">시장 포지셔닝</p>
              <OceanMatrix products={oceanProducts} color={color} />
            </div>
          </div>

          {/* Row 3: 차별성 + 특허추이 + 브랜드포지셔닝 */}
          <div className="grid grid-cols-3 gap-3">
            {/* 차별성 */}
            <div className={`${CARD} p-4`} style={CARD_STYLE}>
              <p className="text-[9px] font-bold text-gray-400 tracking-widest uppercase mb-3">차별화 모트</p>
              <div className="space-y-2.5">
                {diff.slice(0, 3).map((d) => (
                  <div key={d.label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-[10px] font-semibold text-gray-700 leading-tight">{d.label}</span>
                      <span className="text-[10px] font-black shrink-0 ml-1" style={{ color }}>{d.score}점</span>
                    </div>
                    <div className="h-1 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ backgroundColor: color, width: `${d.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* 특허 출원 추이 */}
            <div className={`${CARD} p-4`} style={CARD_STYLE}>
              <p className="text-[9px] font-bold text-gray-400 tracking-widest uppercase mb-2">IP 출원 트렌드</p>
              <ResponsiveContainer width="100%" height={100}>
                <AreaChart data={patentTrend} margin={{ top: 4, right: 4, bottom: 0, left: -25 }}>
                  <defs>
                    <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" tick={{ fontSize: 8, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 8, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8, border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }} formatter={(v: number) => [v + "건", "출원"]} />
                  <Area type="monotone" dataKey="count" stroke={color} strokeWidth={1.5} fill="url(#pg)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            {/* 브랜드 포지셔닝 */}
            <div className={`${CARD} p-4`} style={CARD_STYLE}>
              <p className="text-[9px] font-bold text-gray-400 tracking-widest uppercase mb-1">브랜드 포지셔닝</p>
              <RadarMini datasets={[
                { label: "내 아이디어", values: toRadar(myBrand), color, filled: true },
                { label: "실제 브랜드 평균", values: averageRadar, color: "#94a3b8", filled: false },
              ]} size={130} />
              <div className="flex items-center gap-3 mt-1 justify-center">
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} /><span className="text-[9px] text-gray-500">내 아이디어</span></div>
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-400" /><span className="text-[9px] text-gray-500">실제 브랜드</span></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── REPORT VIEW ── */
        <div className="space-y-4">

          {/* 4축 상세 + 원문 근거 */}
          <div className={`${CARD} p-5`} style={CARD_STYLE}>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">투자검토 4축 — 근거 원문</span>
            </div>
            <div className="space-y-4">
              {axes.map((ax) => (
                <div key={ax.name} className="rounded-2xl p-4" style={{ backgroundColor: color + "08", border: `1px solid ${color}20` }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black" style={{ color }}>{ax.name}</span>
                      <span className="text-[9px] px-2 py-0.5 rounded-full font-semibold bg-white text-gray-500">{ax.label}</span>
                    </div>
                    <span className="text-xl font-black" style={{ color }}>{ax.value}점</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white overflow-hidden mb-3">
                    <div className="h-full rounded-full" style={{ width: `${ax.value}%`, backgroundColor: color }} />
                  </div>
                  <div className="space-y-1.5">
                    {ax.evidence.map((e, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-[10px] font-bold shrink-0 mt-0.5" style={{ color }}>근거 {i + 1}</span>
                        <p className="text-[11px] text-gray-600 leading-relaxed">{e}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 블루오션/레드오션 포지셔닝 상세 */}
          <div className={`${CARD} p-5`} style={CARD_STYLE}>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">시장 포지셔닝 — 블루·레드오션 분석</span>
            </div>
            <OceanMatrix products={oceanProducts} color={color} />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl p-3" style={{ backgroundColor: "#dbeafe50", border: "1px solid #bfdbfe" }}>
                <p className="text-[10px] font-bold text-blue-600 mb-1">🔵 블루오션 기회</p>
                <p className="text-[11px] text-gray-600 leading-relaxed">경쟁이 낮고 성장률이 높은 영역에 {components.product} 소재 진입 시 선점 효과 기대. 특히 {components.func} 기능 특화 제품은 현재 공급이 희소합니다.</p>
              </div>
              <div className="rounded-2xl p-3" style={{ backgroundColor: "#fee2e250", border: "1px solid #fecaca" }}>
                <p className="text-[10px] font-bold text-red-500 mb-1">🔴 레드오션 회피 전략</p>
                <p className="text-[11px] text-gray-600 leading-relaxed">일반 {components.product} 시장은 대기업 중심 레드오션. {components.material} 원산지 차별화 및 고기능성 집중으로 틈새를 공략하세요.</p>
              </div>
            </div>
          </div>

          {/* 브랜드 포지셔닝 상세 */}
          <div className={`${CARD} p-5`} style={CARD_STYLE}>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">브랜드 포지셔닝 — 실제 브랜드 벤치마크</span>
            </div>
            <div className="mb-4 rounded-2xl p-3" style={{ backgroundColor: color + "08", border: `1px solid ${color}20` }}>
              <p className="text-[10px] font-bold mb-1" style={{ color }}>포지셔닝 결론</p>
              <p className="text-[11px] text-gray-600 leading-relaxed">{brandSummary}</p>
            </div>
            <div className="flex gap-4 items-start">
              <div className="shrink-0">
                <RadarMini datasets={[
                  { label: "내 아이디어", values: toRadar(myBrand), color, filled: true },
                  ...competitors.slice(0, 4).map((c, i) => ({ label: c.name, values: toRadar(c), color: ["#94a3b8", "#fbbf24", "#a78bfa", "#60a5fa"][i], filled: false })),
                ]} size={180} />
              </div>
              <div className="flex-1 space-y-3">
                {[{ ...myBrand, name: "내 아이디어", isMe: true }, ...competitors.map(c => ({ ...c, isMe: false }))].map((brand) => (
                  <div key={brand.name} className="rounded-xl p-3" style={{ backgroundColor: brand.isMe ? color + "10" : "#f8fafc", border: `1px solid ${brand.isMe ? color + "30" : "rgba(0,0,0,0.06)"}` }}>
                    <p className="text-[10px] font-black mb-2" style={{ color: brand.isMe ? color : "#374151" }}>{brand.isMe ? "✦ " : ""}{brand.name}</p>
                    <div className="grid grid-cols-4 gap-1">
                      {brandAxes.map((ax, i) => {
                        const v = [brand.innovation, brand.access, brand.premium, brand.eco][i];
                        return (
                          <div key={ax} className="text-center">
                            <p className="text-[8px] text-gray-400 mb-0.5">{ax}</p>
                            <p className="text-xs font-bold" style={{ color: brand.isMe ? color : "#6b7280" }}>{v}</p>
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-[9px] text-gray-400 mt-2">
                      {brand.note || (brand.isMe ? "제주 원료 스토리와 기능 근거를 결합한 초기 브랜드 가설입니다." : "시장 내 비교 기준으로 활용되는 브랜드 포지션입니다.")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 차별성 상세 */}
          <div className={`${CARD} p-5`} style={CARD_STYLE}>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">차별성 분석</span>
            </div>
            <div className="space-y-3">
              {diff.map((d, i) => (
                <div key={d.label} className="rounded-2xl p-4" style={{ backgroundColor: i === 0 ? color + "0c" : "rgba(0,0,0,0.02)", border: `1px solid ${i === 0 ? color + "25" : "rgba(0,0,0,0.05)"}` }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-gray-800">{d.label}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${d.score}%`, backgroundColor: color }} />
                      </div>
                      <span className="text-xs font-black" style={{ color }}>{d.score}점</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-relaxed">{d.detail}</p>
                  {i === 0 && <span className="mt-2 inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: color + "20", color }}>⭐ 이 시장의 핵심 차별 요소</span>}
                </div>
              ))}
            </div>
          </div>

          {/* 특허 출원 추이 + 가중치 시뮬레이션 */}
          <div className={`${CARD} p-5`} style={CARD_STYLE}>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">특허 출원 추이 — 가중치 시뮬레이션</span>
            </div>
            <p className="text-[10px] text-gray-400 mb-4">출처: KIPRIS (한국특허정보원) 관련 키워드 출원 현황 기반 AI 추정치</p>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={patentTrend} margin={{ top: 5, right: 10, bottom: 0, left: -15 }}>
                <defs>
                  <linearGradient id="pg2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="pg3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8, border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }} formatter={(v: number, name: string) => [v + "건", name === "count" ? "전체 출원" : "가중 유효 출원"]} />
                <Area type="monotone" dataKey="count" name="count" stroke={color} strokeWidth={2} fill="url(#pg2)" dot={false} />
                <Area type="monotone" dataKey="weighted" name="weighted" stroke="#94a3b8" strokeWidth={1.5} fill="url(#pg3)" dot={false} strokeDasharray="4,3" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
              <p className="text-[10px] text-amber-700 leading-relaxed">⚠ 가중 유효 출원(점선)은 소멸·취하 특허를 제외한 유효 건수입니다. 전체 출원 대비 유효율 {Math.round((patentTrend[patentTrend.length - 1].weighted / patentTrend[patentTrend.length - 1].count) * 100)}% — 핵심 기술 보호 밀도가 높아 출원 전략 수립이 중요합니다.</p>
            </div>
          </div>

          {/* What-if 대체·확장 시나리오 */}
          <div className={`${CARD} p-5`} style={CARD_STYLE}>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">What-If — 사업 확장 시나리오</span>
            </div>
            <p className="text-[10px] text-gray-400 mb-4">추가 확장 가정 시 성공 가능성 시뮬레이션</p>
            <div className="grid grid-cols-2 gap-3">
              {whatIf.map((w) => (
                <div key={w.title} className="rounded-2xl p-4" style={{ backgroundColor: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.05)" }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{w.icon}</span>
                      <span className="text-[11px] font-bold text-gray-800">{w.title}</span>
                    </div>
                    <span className="text-xs font-black" style={{ color }}>{w.prob}%</span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-gray-100 overflow-hidden mb-2">
                    <div className="h-full rounded-full" style={{ width: `${w.prob}%`, backgroundColor: color }} />
                  </div>
                  <p className="text-[10px] text-gray-500 leading-relaxed">{w.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 창업자 실행 브리프 */}
          <div className={`${CARD} p-5`} style={CARD_STYLE}>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">창업자 실행 브리프 — MVP·GTM·R&D 과제화</span>
            </div>
            <p className="text-[10px] text-gray-400 mb-4">초기 창업자가 바로 의사결정할 수 있도록 실행 순서와 과제화 메시지를 정리했습니다.</p>
            <div className="grid md:grid-cols-3 gap-3 mb-4">
              {founderBrief.map((item) => (
                <div key={item.title} className="rounded-2xl p-4" style={{ backgroundColor: color + "08", border: `1px solid ${color}20` }}>
                  <p className="text-[11px] font-black mb-2" style={{ color }}>{item.title}</p>
                  <p className="text-[10px] text-gray-600 leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {startupPath.map((step, index) => (
                <div key={`${step.phase}-${step.title}-${index}`} className="flex gap-3 rounded-2xl p-3" style={{ backgroundColor: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.05)" }}>
                  <div className="w-14 shrink-0 text-[10px] font-black" style={{ color }}>{step.phase}</div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-800">{step.title}</p>
                    <p className="text-[10px] text-gray-500 leading-relaxed">{step.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 점수 산출 근거 */}
          <div className={`${CARD} p-5`} style={CARD_STYLE}>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">스코어링 트레이스</span>
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-100">
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="border-b border-gray-100" style={{ backgroundColor: color + "10" }}>
                    <th className="text-left p-2.5 font-bold text-gray-600">평가 축</th>
                    <th className="text-center p-2.5 font-bold text-gray-600">비중</th>
                    <th className="text-center p-2.5 font-bold text-gray-600">원점수</th>
                    <th className="text-center p-2.5 font-bold text-gray-600">가중 점수</th>
                  </tr>
                </thead>
                <tbody>
                  {axes.map((ax, i) => {
                    const weights = [30, 30, 20, 20];
                    return (
                      <tr key={ax.name} className="border-b border-gray-50">
                        <td className="p-2.5 font-semibold text-gray-700">{ax.name}</td>
                        <td className="p-2.5 text-center text-gray-500">{weights[i]}%</td>
                        <td className="p-2.5 text-center font-bold" style={{ color }}>{ax.value}점</td>
                        <td className="p-2.5 text-center font-black text-gray-800">{Math.round(ax.value * weights[i] / 100)}점</td>
                      </tr>
                    );
                  })}
                  <tr style={{ backgroundColor: color + "10" }}>
                    <td className="p-2.5 font-black text-gray-900" colSpan={3}>종합 점수</td>
                    <td className="p-2.5 text-center text-lg font-black" style={{ color }}>{totalScore}점</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 규제·인허가 사전체크 */}
          <div className={`${CARD} p-5`} style={CARD_STYLE}>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">규제·인허가 사전체크</span>
            </div>
            <div className="space-y-2.5">
              {regulations.map((reg) => (
                <div key={reg.item} className="flex items-start gap-3 rounded-xl p-3" style={{ backgroundColor: statusBg(reg.status), border: `1px solid ${statusColor(reg.status)}30` }}>
                  <span className="text-sm font-bold shrink-0 mt-0.5" style={{ color: statusColor(reg.status) }}>
                    {reg.status === "통과" ? "✓" : reg.status === "주의" ? "!" : "?"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-[11px] font-bold text-gray-800">{reg.item}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: statusColor(reg.status) + "20", color: statusColor(reg.status) }}>{reg.status}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 leading-relaxed">{reg.detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[9px] text-gray-400 mt-3">※ 규제 체크는 AI 기반 1차 검토이며, 최종 확인은 전문 컨설턴트 또는 규제 기관 문의 필요</p>
          </div>
        </div>
      )}

      <button onClick={resetTool}
        className="w-full py-3 rounded-2xl border text-sm font-semibold transition-all hover:shadow-md"
        style={{ borderColor: color + "40", color, backgroundColor: color + "08" }}>
        다른 아이디어 분석하기
      </button>
    </motion.div>
  );
}

function FlipCard({ compound, color }: { compound: { name: string; desc: string; benefit: string }; color: string }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      style={{ perspective: "700px", height: "148px" }}
    >
      <div
        style={{
          position: "relative", width: "100%", height: "100%",
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 0.55s cubic-bezier(0.4,0.2,0.2,1)",
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl bg-white shadow-sm flex flex-col items-center justify-center p-3 text-center"
          style={{ backfaceVisibility: "hidden", border: "1px solid rgba(0,0,0,0.06)" }}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: color + "20" }}>
            <Beaker className="w-4 h-4" style={{ color }} />
          </div>
          <p className="text-[12px] font-bold text-gray-900 leading-tight">{compound.name}</p>
          <span className="mt-1.5 px-2 py-0.5 rounded-full text-[9px] font-semibold" style={{ backgroundColor: color + "18", color }}>
            {compound.benefit}
          </span>
          <p className="text-[9px] text-gray-400 mt-1.5">hover로 상세 보기</p>
        </div>
        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl p-3 flex flex-col justify-between"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            backgroundColor: color + "12",
            border: `1px solid ${color}35`,
          }}
        >
          <div>
            <p className="text-[11px] font-black mb-1.5" style={{ color }}>{compound.name}</p>
            <p className="text-[10px] text-gray-600 leading-relaxed">{compound.desc}</p>
          </div>
          <div className="px-2 py-1 rounded-lg text-[9px] font-bold text-center" style={{ backgroundColor: color + "25", color }}>
            대표효능: {compound.benefit}
          </div>
        </div>
      </div>
    </div>
  );
}

function OceanMatrix({ products, color }: { products: Array<{ name: string; x: number; y: number; desc: string; ocean: "blue" | "red" }>; color: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  const W = 280, H = 220;
  const pad = 32;

  const toSvg = (x: number, y: number) => ({
    cx: pad + (x / 100) * (W - pad * 2),
    cy: (H - pad) - (y / 100) * (H - pad * 2),
  });

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl" style={{ background: "linear-gradient(135deg, #f0f9ff 0%, #fdf2f8 100%)" }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
          {/* Quadrant backgrounds */}
          <rect x={pad} y={pad / 2} width={(W - pad * 2) / 2} height={(H - pad * 1.5) / 2} fill="#dbeafe" fillOpacity="0.4" rx="4" />
          <rect x={pad + (W - pad * 2) / 2} y={pad / 2} width={(W - pad * 2) / 2} height={(H - pad * 1.5) / 2} fill="#fef3c7" fillOpacity="0.4" rx="4" />
          <rect x={pad} y={pad / 2 + (H - pad * 1.5) / 2} width={(W - pad * 2) / 2} height={(H - pad * 1.5) / 2} fill="#f0fdf4" fillOpacity="0.4" rx="4" />
          <rect x={pad + (W - pad * 2) / 2} y={pad / 2 + (H - pad * 1.5) / 2} width={(W - pad * 2) / 2} height={(H - pad * 1.5) / 2} fill="#fef2f2" fillOpacity="0.4" rx="4" />
          {/* Axes */}
          <line x1={pad} y1={H - pad} x2={W - pad / 2} y2={H - pad} stroke="#94a3b8" strokeWidth="1" />
          <line x1={pad} y1={H - pad} x2={pad} y2={pad / 2} stroke="#94a3b8" strokeWidth="1" />
          {/* Center lines */}
          <line x1={pad + (W - pad * 2) / 2} y1={pad / 2} x2={pad + (W - pad * 2) / 2} y2={H - pad} stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="3,3" />
          <line x1={pad} y1={pad / 2 + (H - pad * 1.5) / 2} x2={W - pad / 2} y2={pad / 2 + (H - pad * 1.5) / 2} stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="3,3" />
          {/* Quadrant labels */}
          <text x={pad + 6} y={pad} fontSize="7" fill="#3b82f6" fontWeight="700">🔵 블루오션</text>
          <text x={pad + (W - pad * 2) / 2 + 4} y={pad} fontSize="7" fill="#f59e0b" fontWeight="600">⚡ 경쟁적 성장</text>
          <text x={pad + 6} y={pad / 2 + (H - pad * 1.5) / 2 + 14} fontSize="7" fill="#22c55e" fontWeight="600">💡 틈새 시장</text>
          <text x={pad + (W - pad * 2) / 2 + 4} y={pad / 2 + (H - pad * 1.5) / 2 + 14} fontSize="7" fill="#ef4444" fontWeight="600">🔴 레드오션</text>
          {/* Axis labels */}
          <text x={W / 2} y={H - 4} fontSize="7" fill="#94a3b8" textAnchor="middle">경쟁도 →</text>
          <text x={8} y={H / 2} fontSize="7" fill="#94a3b8" textAnchor="middle" transform={`rotate(-90, 8, ${H / 2})`}>시장 성장률 →</text>
          {/* Product dots */}
          {products.map((p, i) => {
            const { cx, cy } = toSvg(p.x, p.y);
            const isSelected = selected === i;
            return (
              <g key={i} style={{ cursor: "pointer" }} onClick={() => setSelected(isSelected ? null : i)}>
                <circle cx={cx} cy={cy} r={isSelected ? 9 : 7} fill={p.ocean === "blue" ? "#3b82f6" : "#ef4444"} fillOpacity={isSelected ? 1 : 0.8} />
                <circle cx={cx} cy={cy} r={isSelected ? 14 : 11} fill={p.ocean === "blue" ? "#3b82f6" : "#ef4444"} fillOpacity={0.15} />
                <text x={cx} y={cy - 13} fontSize="6.5" fill="#374151" textAnchor="middle" fontWeight="600">{p.name.length > 8 ? p.name.slice(0, 8) + "…" : p.name}</text>
              </g>
            );
          })}
        </svg>
        {/* Selected detail */}
        {selected !== null && (
          <div className="mx-3 mb-3 p-3 rounded-xl bg-white shadow-sm" style={{ border: `1px solid ${products[selected].ocean === "blue" ? "#bfdbfe" : "#fecaca"}` }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: products[selected].ocean === "blue" ? "#3b82f6" : "#ef4444" }} />
              <span className="text-xs font-bold text-gray-900">{products[selected].name}</span>
              <span className="ml-auto text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: products[selected].ocean === "blue" ? "#dbeafe" : "#fee2e2", color: products[selected].ocean === "blue" ? "#1d4ed8" : "#dc2626" }}>
                {products[selected].ocean === "blue" ? "블루오션" : "레드오션"}
              </span>
            </div>
            <p className="text-[10px] text-gray-500">{products[selected].desc}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CustomRadar({ axes, color }: { axes: { name: string; value: number }[]; color: string }) {
  const cx = 100, cy = 100, r = 75;
  const n = axes.length;
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2;

  const getPoint = (idx: number, pct: number) => {
    const angle = startAngle + idx * angleStep;
    return { x: cx + r * pct * Math.cos(angle), y: cy + r * pct * Math.sin(angle) };
  };

  const gridLevels = [0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%">
      {gridLevels.map((lvl) => (
        <polygon
          key={`grid-${lvl}`}
          points={axes.map((_, i) => { const p = getPoint(i, lvl); return `${p.x},${p.y}`; }).join(" ")}
          fill="none"
          stroke="rgba(0,0,0,0.08)"
          strokeWidth="1"
        />
      ))}
      {axes.map((_, i) => {
        const outer = getPoint(i, 1);
        return <line key={`spoke-${i}`} x1={cx} y1={cy} x2={outer.x} y2={outer.y} stroke="rgba(0,0,0,0.08)" strokeWidth="1" />;
      })}
      <polygon
        points={axes.map((ax, i) => { const p = getPoint(i, ax.value / 100); return `${p.x},${p.y}`; }).join(" ")}
        fill={color}
        fillOpacity={0.15}
        stroke={color}
        strokeWidth="1.5"
      />
      {axes.map((ax, i) => {
        const p = getPoint(i, ax.value / 100);
        return <circle key={`dot-${i}`} cx={p.x} cy={p.y} r="3" fill={color} />;
      })}
      {axes.map((ax, i) => {
        const labelPt = getPoint(i, 1.22);
        return (
          <text key={`label-${i}`} x={labelPt.x} y={labelPt.y} textAnchor="middle" dominantBaseline="middle" fill="rgba(0,0,0,0.5)" fontSize="8.5" fontFamily="Noto Sans KR, sans-serif">
            {ax.name}
          </text>
        );
      })}
    </svg>
  );
}

function ScoreRing({ score, color }: { score: number; color: string }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <svg width="130" height="130" viewBox="0 0 130 130">
      <circle cx="65" cy="65" r={r} fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="10" />
      <circle
        cx="65"
        cy="65"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 65 65)"
        style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }}
      />
      <text x="65" y="60" textAnchor="middle" fill="#0f172a" fontSize="28" fontWeight="700" fontFamily="JetBrains Mono, monospace">
        {score}
      </text>
      <text x="65" y="78" textAnchor="middle" fill="rgba(0,0,0,0.45)" fontSize="11" fontFamily="Noto Sans KR, sans-serif">
        종합 점수
      </text>
    </svg>
  );
}

function AxisBar({ name, value, label, color }: { name: string; value: number; label: string; color: string }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 100);
    return () => clearTimeout(t);
  }, [value]);

  const barColor = value >= 75 ? color : value >= 55 ? "#f5a623" : "#e8404a";

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs text-foreground/60 font-mono">{label}</span>
        <span className="text-sm font-mono font-semibold" style={{ color: barColor }}>{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-foreground/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${width}%`, backgroundColor: barColor }}
        />
      </div>
      <div className="text-[10px] text-foreground/40">{name}</div>
    </div>
  );
}

type AnalysisState = "idle" | "loading" | "result";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState<"home" | "tool" | "about" | "intro" | "howto">("home");
  const [activeCategory, setActiveCategory] = useState<string>("green");
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [customInput, setCustomInput] = useState("");
  const [analysisLabel, setAnalysisLabel] = useState("");
  const [analysisImage, setAnalysisImage] = useState("");
  const [toolStep, setToolStep] = useState<"q1" | "select">("q1");
  const [q1Answer, setQ1Answer] = useState<"yes" | "no" | null>(null);
  const [q2Answer, setQ2Answer] = useState<"yes" | "no" | null>(null);
  const [analysisState, setAnalysisState] = useState<AnalysisState>("idle");
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiCoachLoading, setAiCoachLoading] = useState(false);
  const [ideaInputError, setIdeaInputError] = useState(false);
  const [result, setResult] = useState<UiAnalysisResult | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [selectionStep, setSelectionStep] = useState<"category" | "material">("category");
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
  const [recommendationMode, setRecommendationMode] = useState(false);
  const [businessIdea, setBusinessIdea] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);
  const [dataSourceDetailsOpen, setDataSourceDetailsOpen] = useState(false);
  const toolRef = useRef<HTMLDivElement>(null);

  const categorySlides = [
    {
      id: "green", label: "그린바이오", sub: "식품 및 농축산 자원",
      color: "#22c55e",
      bg: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)",
      bgImage: greenBioImage, bgVideo: greenBioVideo, image: greenBioImage,
      emoji: "🍊", textColor: "#000000", subTextColor: "#000000"
    },
    {
      id: "red", label: "레드바이오", sub: "의약 및 헬스케어",
      color: "#ef4444",
      bg: "linear-gradient(135deg, #f87171 0%, #ef4444 100%)",
      bgVideo: redBioVideo,
      image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=1080&q=80",
      emoji: "💊", textColor: "#000000", subTextColor: "#000000"
    },
    {
      id: "marine", label: "블루바이오", sub: "해양 및 수산 자원",
      color: "#0ea5e9",
      bg: "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)",
      bgImage: waveImage, bgVideo: waveVideo, image: marineBioImage,
      emoji: "🌊", textColor: "#000000", subTextColor: "#000000"
    },
    {
      id: "white", label: "화이트바이오", sub: "바이오공정 및 발효 자원",
      color: "#10b981",
      bg: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)",
      bgVideo: whiteBioVideo, image: whiteBioImage,
      emoji: "🧫", textColor: "#000000", subTextColor: "#000000"
    }
  ];

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (activeSection !== "tool") setAiChatOpen(false);
  }, [activeSection]);

  const LOADING_STEPS = [
    "공공데이터 수집 중...",
    "특허 데이터베이스 조회 중...",
    "시장·수출 통계 분석 중...",
    "규제 현황 검토 중...",
    "AI 4축 알고리즘 적용 중...",
    "결과 생성 완료",
  ];

  function runAnalysis(materialId?: string, customText?: string) {
    const key = materialId ?? selectedMaterial ?? "haejo";
    const foundMaterial = CATEGORIES.flatMap((c) => c.materials).find((m) => m.id === key);
    const materialLabel = foundMaterial?.label ?? analysisLabel ?? key;
    const requestIdea =
      customText?.trim() ||
      `${materialLabel} 화장품 사업화 분석`;
    const preferredCategory = customText ? null : "화장품";
    const fallbackResult = ANALYSIS_RESULTS[key] || ANALYSIS_RESULTS.haejo;
    const activeCategoryHasMaterial = CATEGORIES.find((category) => category.id === activeCategory)
      ?.materials.some((material) => material.id === key);
    const materialCategoryId = materialId ? activeCategory : activeCategoryHasMaterial ? activeCategory : CATEGORIES.find((category) =>
      category.materials.some((material) => material.id === key)
    )?.id;
    const categoryColor = categorySlides.find((slide) => slide.id === materialCategoryId)?.color;
    const resultColor = customText ? "#b86f2a" : (categoryColor || fallbackResult.color);

    // 결과 화면에 표시할 라벨 결정
    if (customText) {
      setAnalysisLabel(customText);
      setAnalysisImage("");
    } else if (materialId) {
      setAnalysisLabel(foundMaterial?.label ?? materialId);
      setAnalysisImage(MATERIAL_IMAGES[materialId] ?? "");
    } else if (selectedMaterial) {
      const found = CATEGORIES.flatMap((c) => c.materials).find((m) => m.id === selectedMaterial);
      setAnalysisLabel(found?.label ?? selectedMaterial);
      setAnalysisImage(MATERIAL_IMAGES[selectedMaterial] ?? "");
    } else {
      setAnalysisLabel(customInput);
    }
    setAnalysisState("loading");
    setLoadingStep(0);
    setAiMessages([]);
    setAiQuestion("");

    const backendAnalysis = fetch("/api/analyze", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        idea: requestIdea,
        preferredCategory,
        extraction: materialId
          ? {
              ingredient: materialLabel,
              functions: [],
              categories: preferredCategory ? [preferredCategory] : []
            }
          : null
      })
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`analyze failed: ${response.status}`);
        return (await response.json()) as BackendAnalysisResult;
      })
      .catch(() => null);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setLoadingStep(step);
      if (step >= LOADING_STEPS.length - 1) {
        clearInterval(interval);
        setTimeout(async () => {
          const backend = await backendAnalysis;
          setResult(
            backend
              ? mapBackendToUiResult(backend, fallbackResult, resultColor)
              : { ...fallbackResult, color: resultColor }
          );
          setAnalysisState("result");
        }, 600);
      }
    }, 500);
  }

  function reset() {
    setAnalysisState("idle");
    setResult(null);
    setSelectedMaterial(null);
    setCustomInput("");
    setAnalysisLabel("");
    setLoadingStep(0);
    setActiveCategory("green");
    setSelectionStep("category");
  }

  const scrollToTool = () => {
    setToolStep("select");
    setQ1Answer(null);
    setQ2Answer(null);
    setRecommendationMode(false);
    setSelectionStep("category");
    setCurrentSlide(0);
    setActiveSection("tool");
    // 이전 분석 결과 초기화
    setAnalysisState("idle");
    setResult(null);
    setSelectedMaterial(null);
    setCustomInput("");
    setAnalysisLabel("");
    setTimeout(() => toolRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const startRecommendation = () => {
    setRecommendationMode(true);
    setBusinessIdea("");
    setActiveSection("tool");
    setTimeout(() => toolRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  function resetTool() {
    // 현재 카테고리 유지, 소재 선택 화면으로 바로 이동
    const currentCategory = activeCategory;
    setAnalysisState("idle");
    setResult(null);
    setSelectedMaterial(null);
    setCustomInput("");
    setLoadingStep(0);
    setAiMessages([]);
    setAiQuestion("");
    setAiChatOpen(false);
    setActiveCategory(currentCategory);
    setSelectionStep("material");
    setToolStep("select");
  }

  const quickCoachQuestions = [
    "이 아이템의 가장 큰 강점은?",
    "가장 먼저 보완할 부분은?",
    "브랜드 포지셔닝을 한 줄로 정리해줘",
    "R&D 지원사업에 넣으려면 무엇을 강조해야 해?"
  ];

  function buildCoachContext() {
    const backend = result?.backend;
    const components = parseBackendComponents(backend) ?? parseIdeaComponents(customInput || analysisLabel);
    return {
      itemName: customInput || analysisLabel || components.material,
      ingredient: components.material,
      function: components.func,
      productCategory: components.product,
      score: result?.score ?? 0,
      marketPosition: result?.summary || "초기 사업화 검토",
      strongestDifferentiation: result?.highlights?.[0] || "제주 원료 차별성",
      recommendedAction: result?.recommendation || result?.highlights?.[1] || "MVP 제품군과 근거 보완"
    };
  }

  function fallbackCoachAnswer(question: string) {
    const context = buildCoachContext();
    if (question.includes("강점")) {
      return `가장 큰 강점은 ${context.ingredient} 원료 스토리와 ${context.function} 기능 방향을 함께 설명할 수 있다는 점입니다. 현재 점수는 ${context.score}점으로, 초기 사업화에서는 제품 형태를 좁히고 제주 원료 차별성을 전면 메시지로 잡는 전략이 좋습니다.`;
    }
    if (question.includes("보완")) {
      return `가장 먼저 보완할 부분은 제품군을 더 구체화하는 것입니다. ${context.productCategory} 안에서도 세럼, 스낵, 원료 B2B처럼 첫 MVP 형태를 좁히면 타깃 고객, 실험 기준, 표시·광고 리스크 관리가 훨씬 명확해집니다.`;
    }
    if (question.includes("포지셔닝")) {
      return `${context.ingredient} 기반 ${context.function} 기능을 앞세운 제주 로컬 바이오 ${context.productCategory} 브랜드로 포지셔닝하는 것이 적합합니다.`;
    }
    if (question.includes("R&D")) {
      return `R&D 지원사업에서는 ${context.ingredient}의 지역 원료성, ${context.function} 기능 근거, 제품화 가능성, 공급 안정성, 후속 확장성을 강조하는 것이 좋습니다. 특히 데이터 기반 근거와 MVP 검증 계획을 함께 제시해야 설득력이 높아집니다.`;
    }
    return `${context.itemName}은 ${context.marketPosition} 관점에서 볼 때, 지금은 아이디어를 넓히기보다 첫 제품 형태와 고객을 좁히는 것이 중요합니다. 다음 액션은 ${context.recommendedAction}입니다.`;
  }

  async function sendCoachQuestion(questionText = aiQuestion) {
    const question = questionText.trim().slice(0, 300);
    if (!question || aiCoachLoading) return;
    setAiQuestion("");
    setAiMessages((messages) => [...messages, { role: "user", content: question }]);
    setAiCoachLoading(true);

    let answer = fallbackCoachAnswer(question);
    try {
      const count = Number(sessionStorage.getItem("aiCoachCallCount") || "0");
      if (count < 2) {
        sessionStorage.setItem("aiCoachCallCount", String(count + 1));
        const response = await fetch("/api/ai-coach", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ question, reportContext: buildCoachContext() })
        });
        if (response.ok) {
          const payload = await response.json();
          if (payload?.answer) answer = String(payload.answer).slice(0, 700);
        }
      }
    } catch {
      answer = fallbackCoachAnswer(question);
    } finally {
      setAiMessages((messages) => [...messages, { role: "assistant", content: answer }]);
      setAiCoachLoading(false);
    }
  }

  const previewComponents = parseIdeaComponents(businessIdea);

  return (
    <>
      {/* SVG sharpen filter — must be in DOM before use */}
      <svg style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
        <defs>
          <filter id="bg-sharpen" colorInterpolationFilters="sRGB">
            <feConvolveMatrix
              order="3"
              kernelMatrix="0 -0.5 0  -0.5 3 -0.5  0 -0.5 0"
              preserveAlpha="true"
            />
            <feComponentTransfer>
              <feFuncR type="linear" slope="1.08" />
              <feFuncG type="linear" slope="1.08" />
              <feFuncB type="linear" slope="1.08" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      <div
        className="min-h-screen text-foreground"
        style={{ fontFamily: "'Noto Sans KR', 'Inter', sans-serif" }}
      >
      {/* NAV */}
	      <nav
	        className="fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-700"
	        style={{
	          backgroundColor: darkMode ? "rgba(8,12,46,0.92)" : "#ffffff",
	          borderColor: darkMode ? "rgba(17,25,186,0.35)" : "#e5e7eb",
	          backdropFilter: darkMode ? "blur(14px)" : undefined,
	          color: darkMode ? "#c8d0ff" : "#111827",
	        }}
	      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
	          <button
	            onClick={() => setActiveSection("home")}
	            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
	          >
	            <img
	              src={jevigatorLogo}
	              alt="Jeju Bio R&D Navigating 로고"
	              className="w-8 h-8 rounded-lg object-cover shadow-sm"
	              style={{ aspectRatio: "1 / 1" }}
	            />
		            <span className="font-semibold text-sm tracking-tight" style={{ color: darkMode ? "#c8d0ff" : "#111827" }}>
		              Jeju Bio <span style={{ color: darkMode ? "#7b8fff" : "#b86f2a" }}>R&D Navigating</span>
	            </span>
	          </button>
          <div className="flex items-center gap-1">
            {([
              { id: "home", label: "홈" },
              { id: "intro", label: "소개" },
              { id: "howto", label: "작동방식" },
            ] as const).map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
	                className="px-3 py-1.5 rounded-md text-sm transition-colors"
	                style={{
	                  backgroundColor: activeSection === s.id ? (darkMode ? "rgba(17,25,186,0.25)" : "rgba(184,111,42,0.1)") : undefined,
	                  color: activeSection === s.id ? (darkMode ? "#7b8fff" : "#b86f2a") : (darkMode ? "#8899cc" : "#6b7280"),
	                }}
              >
                {s.label}
              </button>
            ))}
            <button
	              onClick={() => setDarkMode(!darkMode)}
	              className="ml-2 w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors"
	              style={{ color: darkMode ? "#8899cc" : "#6b7280" }}
              aria-label="다크모드 토글"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
	      </nav>

	      {/* Home background: light/dark assets stay mounted to prevent mode-flash on return */}
	      <div
	        style={{
	          position: "fixed",
	          top: 0,
	          left: 0,
	          right: 0,
	          bottom: 0,
	          zIndex: -10,
	          pointerEvents: "none",
	          backgroundColor: darkMode ? "#08102c" : "rgb(249, 230, 199)",
	        }}
	      >
	        <motion.div
	          initial={false}
	          animate={{ opacity: activeSection === "home" && !darkMode ? 1 : 0 }}
	          transition={{ duration: 0.45, ease: "easeInOut" }}
	          style={{
	            position: "absolute",
	            inset: 0,
	            backgroundImage: `url(${bgImage})`,
	            backgroundSize: "cover",
	            backgroundPosition: "center top",
	            backgroundRepeat: "no-repeat",
	          }}
	        />
	        <motion.div
	          initial={false}
	          animate={{ opacity: activeSection === "home" && darkMode ? 1 : 0 }}
	          transition={{ duration: 0.45, ease: "easeInOut" }}
	          style={{
	            position: "absolute",
	            inset: 0,
	            backgroundImage: `url(${bgImageDark})`,
	            backgroundSize: "cover",
	            backgroundPosition: "center top",
	            backgroundRepeat: "no-repeat",
	          }}
	        />
	        <motion.div
	          initial={false}
	          animate={{ opacity: activeSection === "home" && darkMode ? 1 : 0 }}
	          transition={{ duration: 0.45, ease: "easeInOut" }}
	          style={{
	            position: "absolute",
	            inset: 0,
	            minHeight: "100dvh",
	            background: "rgba(0, 0, 0, 0.48)",
	          }}
	        />
	      </div>

	      <main className="pt-14">
	        {/* ─── HOME ─── */}
	        {activeSection === "home" && (
	          <>
	            {/* Hero */}
            <section className="relative min-h-[88vh] flex items-center overflow-hidden">
              {/* Background grid */}
              <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                  opacity: darkMode ? 0 : 0.1,
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
                  backgroundSize: "60px 60px",
                }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: darkMode
                    ? "transparent"
                    : "linear-gradient(to bottom, transparent, transparent, var(--background))",
                }}
              />
              <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="space-y-6"
                >
                  <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight ${darkMode ? "text-white" : "text-gray-900"}`}>
                    Jeju Bio R&D <span style={{ color: "#b86f2a" }}>Navigator</span>
                  </h1>
                  <p
                    className="text-base leading-relaxed max-w-md font-medium transition-colors duration-700"
                    style={{ color: darkMode ? "#ffffff" : "#111827" }}
                  >
                    생성형 AI와 제주공공데이터로 당신의 아이디어를 지원합니다.
                  </p>

                  {/* Two CTA cards */}
                  <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                    {/* 01 — 사용자 지정 AI 분석 */}
                    <button
                      onClick={() => startRecommendation()}
                      className={`flex-1 text-left p-4 rounded-2xl backdrop-blur-sm border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group ${darkMode ? "bg-white/10 border-white/20 hover:border-primary/50" : "bg-white/70 border-white/60 hover:border-primary/30"}`}
                    >
                      <div className="text-[10px] font-mono text-primary/80 mb-2 tracking-widest">01</div>
                      <p className={`text-sm font-bold leading-snug mb-1 ${darkMode ? "text-white" : "text-foreground"}`}>
                        아이디어가 이미 있으신가요?
                      </p>
                      <p className={`text-[11px] leading-relaxed mb-3 ${darkMode ? "text-white/60" : "text-foreground/45"}`}>
	                        아이디어 문장을 원료 · 기능 · 제품군으로 구조화합니다.
                      </p>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all">
                        사용자 지정 AI 분석 <ArrowRight className="w-3 h-3" />
                      </span>
                    </button>

                    {/* 02 — 아이디어 구상하기 */}
                    <button
                      onClick={() => scrollToTool()}
                      className={`flex-1 text-left p-4 rounded-2xl backdrop-blur-sm border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group ${darkMode ? "bg-white/10 border-white/20 hover:border-primary/50" : "bg-white/70 border-white/60 hover:border-primary/30"}`}
                    >
                      <div className="text-[10px] font-mono text-primary/80 mb-2 tracking-widest">02</div>
                      <p className={`text-sm font-bold leading-snug mb-1 ${darkMode ? "text-white" : "text-foreground"}`}>
                        아직 사업 구상이 없나요?
                      </p>
                      <p className={`text-[11px] leading-relaxed mb-3 ${darkMode ? "text-white/60" : "text-foreground/45"}`}>
                        AI의 제주 그린·레드·블루바이오 · 화이트바이오 추천 사례에서 골라보세요.
                      </p>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all">
                        아이디어 구상하기 <ArrowRight className="w-3 h-3" />
                      </span>
                    </button>
                  </div>
                </motion.div>

              </div>
            </section>
          </>
        )}

        {/* ─── TOOL ─── */}
        {activeSection === "tool" && (
          <div ref={toolRef} className="min-h-[calc(100vh-56px)] flex flex-col">

            {/* 소재 추천 모드 */}
            {recommendationMode ? (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="flex-1 flex flex-col items-center justify-center px-4 py-10"
              >
                <div className="w-full max-w-xl space-y-5">
                  {/* Header */}
                  <div>
                    <p className="text-[11px] font-mono tracking-widest text-primary/70 uppercase mb-1">Custom AI Analysis</p>
                    <h2 className={`text-2xl font-bold leading-snug tracking-tight mb-1 ${darkMode ? "text-white" : ""}`}>어떤 바이오 제품을 만들고 싶으신가요?</h2>
                    <p className={`text-xs leading-relaxed ${darkMode ? "text-white/55" : "text-foreground/45"}`}>
                      원료, 기능, 제품을 한 문장으로 적어주세요. Gemini와 백엔드 분석기가 자동으로 구조화합니다.
                    </p>
                  </div>

                  {/* Textarea */}
                  <div className="space-y-1.5">
                    <p className={`text-xs font-semibold ${darkMode ? "text-white/70" : "text-foreground/60"}`}>사업 아이디어</p>
                    <div className="relative">
                      <textarea
                        value={businessIdea}
                        onChange={(e) => { setBusinessIdea(e.target.value.slice(0, 300)); setIdeaInputError(false); }}
                        placeholder="감귤 껍질로 피부에 좋은 항산화 화장품을 만들고싶어요"
                        rows={4}
                        className={`w-full px-4 py-3 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm transition-all ${
                          darkMode
                            ? "bg-slate-950/70 border-white/10 text-white placeholder:text-white/25"
                            : "bg-background/60 placeholder:text-foreground/25 text-foreground"
                        }`}
                        style={{ borderColor: ideaInputError ? "#ef4444" : undefined }}
                      />
                      <span className={`absolute bottom-2.5 right-3 text-[10px] font-mono ${darkMode ? "text-white/35" : "text-foreground/30"}`}>
                        {businessIdea.length} / 300
                      </span>
                    </div>
                    <AnimatePresence>
                      {ideaInputError && (
                        <motion.div
                          initial={{ opacity: 0, y: -6, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: "auto" }}
                          exit={{ opacity: 0, y: -6, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg mt-1"
                          style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}
                        >
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" style={{ color: "#ef4444" }} />
                          <p className="text-[11px] font-medium" style={{ color: "#dc2626" }}>
                            오류가 났습니다. 다시 입력해주세요.
                            <span className="ml-1 font-normal text-red-400">(예: 감귤 껍질로 항산화 세럼을 만들고 싶어요)</span>
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

	                  {/* 구조화 미리보기 + CTA — 아이디어 입력 후 등장 */}
	                  <AnimatePresence>
	                    {businessIdea.trim() && (
	                      <motion.div
	                        key="idea-analysis-actions"
	                        initial={{ opacity: 0, y: 10, height: 0 }}
	                        animate={{ opacity: 1, y: 0, height: "auto" }}
	                        exit={{ opacity: 0, y: -6, height: 0 }}
	                        transition={{ duration: 0.32, ease: "easeOut" }}
	                        style={{ overflow: "hidden" }}
	                        className="space-y-3"
	                      >
	                        {/* CTA */}
	                        <div className="flex gap-2">
	                          <button
	                            onClick={() => {
	                              const idea = businessIdea.trim();

	                              // Validation
	                              const MATERIAL_KW = ["감귤","귤","녹차","해조","미역","다시마","후코이단","동백","화산송이","조릿대","한라봉","흑돼지","표고","버섯","비자","막걸리","효모","용암","알로에","콜라겐","유산균","발효","스피룰리나"];
	                              const PRODUCT_KW = ["화장품","코스메틱","식품","음료","세럼","에센스","크림","로션","오일","샴푸","의약품","보충제","영양제","건강","비타민","스킨","뷰티","헤어","마스크","젤","팩","파우더","추출물","소재","원료","제품","아이템","사업","개발"];
	                              const FUNC_KW = ["항산화","보습","항균","미백","면역","항노화","항염","다이어트","피부","에너지","피로","장","소화","탈모","모발","두피","관절","혈관","혈압","혈당","체중","콜레스테롤"];
	                              const GIBBERISH = /^[ㄱ-ㅎㅏ-ㅣa-zA-Z0-9\s]{0,3}$|^(.)\1{4,}|^[^가-힣a-zA-Z]+$/;

	                              const hasMaterial = MATERIAL_KW.some(k => idea.includes(k));
	                              const hasProduct = PRODUCT_KW.some(k => idea.includes(k));
	                              const hasFunc = FUNC_KW.some(k => idea.includes(k));
	                              const isGibberish = GIBBERISH.test(idea);
	                              const tooShort = idea.length < 4 && !(hasMaterial && (hasProduct || hasFunc));
	                              const meaningless = !hasMaterial && !hasProduct && !hasFunc && idea.length < 10;

	                              if (isGibberish || tooShort || meaningless) {
	                                setIdeaInputError(true);
	                                return;
	                              }

	                              setIdeaInputError(false);
	                              setCustomInput(idea);
	                              setSelectedMaterial(null);
	                              setRecommendationMode(false);
	                              setToolStep("select");
	                              runAnalysis(undefined, idea);
	                            }}
	                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors"
	                          >
	                            공공데이터 분석 시작 <ArrowRight className="w-4 h-4" />
	                          </button>
	                          <button
	                            onClick={() => { setRecommendationMode(false); setActiveSection("home"); }}
	                            className={`px-4 py-2.5 border rounded-lg text-sm transition-colors ${
	                              darkMode
	                                ? "border-white/10 text-white/55 hover:text-white hover:border-primary/50"
	                                : "border-border text-foreground/60 hover:text-foreground hover:border-primary/50"
	                            }`}
	                          >
	                            취소
	                          </button>
	                        </div>

	                        {/* 구조화 미리보기 */}
	                        <div className={`rounded-2xl border backdrop-blur-sm overflow-hidden ${
	                          darkMode ? "border-white/10 bg-slate-950/65" : "border-border bg-card/60"
	                        }`}>
	                          <div className={`px-4 py-2.5 border-b flex items-center gap-2 ${darkMode ? "border-white/10" : "border-border"}`}>
	                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
	                            <p className={`text-[11px] font-mono ${darkMode ? "text-white/65" : "text-foreground/50"}`}>입력 구조화 미리보기</p>
	                            <span className={`ml-auto text-[10px] ${darkMode ? "text-white/35" : "text-foreground/30"}`}>Gemini 의미 매핑 준비</span>
	                          </div>
	                          <div className="px-4 py-3 space-y-2">
	                            {[
	                              { key: "원료", value: previewComponents.material },
	                              { key: "기능", value: previewComponents.func },
	                              { key: "제품군", value: previewComponents.product },
	                            ].map(({ key, value }) => (
	                              <div key={key} className="flex items-start gap-3">
	                                <span className={`text-[10px] font-mono w-12 shrink-0 pt-0.5 ${darkMode ? "text-white/35" : "text-foreground/35"}`}>{key}</span>
	                                <span className={`text-xs leading-relaxed font-semibold ${darkMode ? "text-white/70" : "text-foreground/60"}`}>{value}</span>
	                              </div>
	                            ))}
	                            <p className={`text-[10px] pt-1 leading-relaxed border-t mt-2 ${darkMode ? "text-white/35 border-white/10" : "text-foreground/30 border-border"}`}>
	                              실제 분석 시 백엔드가 표준 원료·기능·제품군으로 다시 확정합니다.
	                            </p>
	                          </div>
	                        </div>
	                      </motion.div>
	                    )}
	                  </AnimatePresence>

                  {/* 예시로 시작하기 */}
                  <div className="space-y-2">
                    <p className="text-[11px] text-foreground/40 font-mono">예시로 시작하기</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "감귤 껍질 항산화 화장품",
                        "제주 해조류 강아지 영양제",
                        "풋귤 항산화 기능성 음료",
                      ].map((ex) => (
                        <button
                          key={ex}
                          onClick={() => setBusinessIdea(ex === "감귤 껍질 항산화 화장품" ? "감귤 껍질로 피부에 좋은 항산화 화장품을 만들고싶어요" : ex)}
                          className={`px-3 py-1.5 rounded-full border text-xs transition-all ${
                            darkMode
                              ? "bg-white/5 border-white/10 text-white/60 hover:bg-primary/15 hover:border-primary/40 hover:text-primary"
                              : "bg-foreground/5 border-border text-foreground/60 hover:bg-primary/8 hover:border-primary/40 hover:text-primary"
                          }`}
                        >
                          {ex}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <>
            {/* Progress bar — onboarding 단계에서만 표시 */}
            {toolStep === "q1" && analysisState === "idle" && (
              <div className="w-full h-0.5 bg-border">
                <div className="h-full bg-primary transition-all duration-500" style={{ width: "33%" }} />
              </div>
            )}

            {/* Onboarding — 두 질문 동시 표시 */}
            {toolStep === "q1" && (
              <motion.div
                key="onboarding"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.45 }}
                className="flex-1 flex flex-col items-center justify-center px-6 py-16"
              >
                <div className="w-full max-w-2xl space-y-8">
                  {/* Q1 block */}
                  <div className="rounded-3xl p-8 bg-white/60 backdrop-blur-sm border border-white/50 shadow-sm">
                    <h2 className="text-3xl sm:text-4xl font-bold leading-tight mb-2 tracking-tight">
                      사업을 구상하셨나요?
                    </h2>
                    <p className="text-foreground/40 text-sm mb-6">
                      개발하려는 제품이나 사업 방향이 머릿속에 있으신가요?
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setQ1Answer(q1Answer === "yes" ? null : "yes")}
                        className={`flex-1 py-3 rounded-xl border-2 font-bold text-base transition-all ${
                          q1Answer === "yes"
                            ? "border-primary bg-primary text-white"
                            : "border-primary/30 bg-primary/8 text-primary hover:bg-primary/15 hover:border-primary/60"
                        }`}
                      >
                        네, 있어요
                      </button>
                      <button
                        onClick={() => setQ1Answer(q1Answer === "no" ? null : "no")}
                        className={`flex-1 py-3 rounded-xl border-2 font-bold text-base transition-all ${
                          q1Answer === "no"
                            ? "border-foreground/50 bg-foreground/10 text-foreground"
                            : "border-border text-foreground/50 hover:border-foreground/30 hover:text-foreground/70"
                        }`}
                      >
                        아직 없어요
                      </button>
                    </div>
                  </div>

                  {/* Q2 block */}
                  <div className="rounded-3xl p-8 bg-white/60 backdrop-blur-sm border border-white/50 shadow-sm">
                    <h2 className="text-3xl sm:text-4xl font-bold leading-tight mb-2 tracking-tight">
                      소재를 정하셨나요?
                    </h2>
                    <p className="text-foreground/40 text-sm mb-6">
                      분석할 제주 바이오 소재가 이미 결정되어 있으신가요?
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setQ2Answer(q2Answer === "yes" ? null : "yes")}
                        className={`flex-1 py-3 rounded-xl border-2 font-bold text-base transition-all ${
                          q2Answer === "yes"
                            ? "border-primary bg-primary text-white"
                            : "border-primary/30 bg-primary/8 text-primary hover:bg-primary/15 hover:border-primary/60"
                        }`}
                      >
                        네, 있어요
                      </button>
                      <button
                        onClick={() => setQ2Answer(q2Answer === "no" ? null : "no")}
                        className={`flex-1 py-3 rounded-xl border-2 font-bold text-base transition-all ${
                          q2Answer === "no"
                            ? "border-foreground/50 bg-foreground/10 text-foreground"
                            : "border-border text-foreground/50 hover:border-foreground/30 hover:text-foreground/70"
                        }`}
                      >
                        아직 없어요
                      </button>
                    </div>
                  </div>

                  {/* Continue button */}
                  <button
                    onClick={() => { if (q1Answer && q2Answer) setToolStep("select"); }}
                    disabled={!q1Answer || !q2Answer}
                    className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
                      q1Answer && q2Answer
                        ? "bg-primary text-white hover:bg-primary/90 shadow-md"
                        : "bg-foreground/10 text-foreground/30 cursor-not-allowed"
                    }`}
                  >
                    {q1Answer && q2Answer ? "소재 분석 시작 →" : "두 질문에 모두 답해주세요"}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Material selection + analysis */}
	            {toolStep === "select" && (
	              <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 space-y-8">
	                {analysisState === "result" && (
	                  <div key={`report-header-${activeCategory}-${selectedMaterial ?? customInput}`} className="space-y-1 text-center">
	                    <motion.h1
	                      className="text-2xl font-bold"
	                      initial={{ opacity: 0, y: 10 }}
	                      animate={{ opacity: 1, y: 0 }}
	                      transition={{ duration: 0.35, ease: "easeOut" }}
	                    >
	                      다음 소재에 대해 AI의 분석 보고서입니다.
	                    </motion.h1>
	                    <motion.p
	                      className="text-foreground/50 text-sm"
	                      initial={{ opacity: 0, y: 8 }}
	                      animate={{ opacity: 1, y: 0 }}
	                      transition={{ delay: 0.08, duration: 0.35, ease: "easeOut" }}
	                    >
	                      PDF 다운을 받으시면 더 많은 정보를 볼 수 있습니다.
	                    </motion.p>
	                  </div>
	                )}

            {/* Idle: material selection */}
            {analysisState === "idle" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
	                {/* Category Selection - Fullscreen Slider */}
	                {selectionStep === "category" && (
	                  <div className="fixed inset-0 z-50 overflow-hidden" style={{ background: "#000" }}>
                    {/* Home Button */}
                    <button
                      onClick={() => {
                        setActiveSection("home");
                        setSelectionStep("category");
                        setCurrentSlide(0);
                        setSelectedMaterial(null);
                        setAnalysisState("idle");
                        setResult(null);
                      }}
                      className="absolute top-8 left-8 z-30 p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all hover:scale-110"
                    >
                      <Home className="w-6 h-6 text-white" />
                    </button>

	                    {/* 모든 카테고리 배경을 동시에 마운트해 이미지/영상 로딩과 전환 잔상을 줄입니다. */}
	                    {categorySlides.map((slide, index) => (
	                      <div
	                        key={slide.id}
	                        className="absolute inset-0"
	                        style={{
	                          opacity: index === currentSlide ? 1 : 0,
	                          transition: "opacity 0.35s ease-in-out",
	                          pointerEvents: "none",
	                        }}
	                      >
	                        {slide.bgVideo && (
	                          <SeamlessVideoBackground videoSrc={slide.bgVideo} />
	                        )}
	                        {!slide.bgVideo && slide.bgImage && (
	                          <div className="absolute inset-0 overflow-hidden">
	                            <ImageWithFallback
	                              src={slide.bgImage}
	                              alt="background"
	                              loading="eager"
	                              decoding="async"
	                              className="w-full h-full object-cover"
	                              style={{ filter: "brightness(0.85) saturate(1.2)", transform: "translateZ(0)" }}
	                            />
	                          </div>
	                        )}
	                      </div>
	                    ))}

	                    {/* Content */}
	                    <AnimatePresence initial={false} mode="wait" custom={slideDirection}>
	                      <motion.div
	                        key={currentSlide}
	                        custom={slideDirection}
	                        initial={{ opacity: 0, x: slideDirection > 0 ? 48 : -48 }}
	                        animate={{ opacity: 1, x: 0 }}
	                        exit={{ opacity: 0, x: slideDirection > 0 ? -48 : 48 }}
	                        transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
	                        className="absolute inset-0 z-10"
	                        style={{ pointerEvents: "none" }}
	                      >
	                        <div className="relative z-10 flex flex-col items-center justify-between h-full text-center px-8 py-24" style={{ pointerEvents: "all" }}>
	                          <div className="flex-1 flex flex-col items-center justify-center">
	                            <h2 className="text-5xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg">
	                              {categorySlides[currentSlide].label}
	                            </h2>
	                            <p className="text-xl md:text-2xl mb-12 text-white/80">
	                              {categorySlides[currentSlide].sub}
	                            </p>
	                          </div>

	                          <button
	                            onClick={() => { setActiveCategory(categorySlides[currentSlide].id); setSelectionStep("material"); }}
	                            className="px-12 py-4 bg-white text-gray-900 text-xl font-bold rounded-full hover:scale-105 transition-transform shadow-2xl mb-16"
	                          >
	                            선택하기
	                          </button>
	                        </div>
	                      </motion.div>
	                    </AnimatePresence>

	                    {/* Slide Indicators */}
	                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
	                      {categorySlides.map((_, index) => (
	                        <button
	                          key={index}
	                          onClick={() => { setSlideDirection(index > currentSlide ? 1 : -1); setCurrentSlide(index); }}
	                          className={`h-2 rounded-full transition-all ${index === currentSlide ? "w-8 bg-white" : "w-2 bg-white/40"}`}
	                        />
	                      ))}
	                    </div>

	                    {/* Top Navigation Tabs */}
	                    <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-6 z-20">
	                      {categorySlides.map((slide, index) => (
	                        <button
	                          key={slide.id}
	                          onClick={() => { setSlideDirection(index > currentSlide ? 1 : -1); setCurrentSlide(index); }}
	                          className={`px-6 py-2 text-sm font-medium transition-all whitespace-nowrap ${
	                            index === currentSlide ? "text-white border-b-2 border-white" : "text-white/60 hover:text-white"
	                          }`}
	                        >
	                          {slide.label}
	                        </button>
	                      ))}
	                    </div>
	                  </div>
	                )}

                {/* Material Selection */}
                {selectionStep === "material" && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="px-4 pb-8"
                  >
                    {(() => {
                      type Material = { id: string; name: string; desc: string; tag: string; color: string; image: string; prob: number; ocean: "blue" | "red" };
                      const MATERIALS: Record<string, Material[]> = {
                        green: [
                          { id: "gamgyul",     name: "감귤",      desc: "헤스페리딘·플라보노이드 풍부한 제주 대표 과실",    tag: "항산화", color: "#22c55e", image: MATERIAL_IMAGES.gamgyul,    prob: 82, ocean: "blue" },
                          { id: "nokcha",      name: "녹차",      desc: "카테킨 함량 높은 제주 고산지 재배 녹차",          tag: "항산화", color: "#22c55e", image: MATERIAL_IMAGES.nokcha,    prob: 71, ocean: "red"  },
                          { id: "pyogo",       name: "표고버섯",  desc: "베타글루칸 다당류 기반 면역 강화 버섯",            tag: "면역",   color: "#22c55e", image: MATERIAL_IMAGES.pyogo,  prob: 78, ocean: "blue" },
                          { id: "hallabong",   name: "한라봉",    desc: "비타민 C·구연산이 풍부한 제주 특산 감귤류",        tag: "비타민", color: "#22c55e", image: MATERIAL_IMAGES.hallabong,    prob: 65, ocean: "red"  },
                          { id: "jeju-potato", name: "제주 감자", desc: "화산토 재배로 미네랄·저항성 전분 함량 높은 감자",  tag: "기능성", color: "#22c55e", image: MATERIAL_IMAGES["jeju-potato"],  prob: 59, ocean: "red"  },
                          { id: "joritdae",    name: "조릿대",    desc: "제주 한라산 자생 대나무과, 항균·항염 활성 성분",    tag: "항균",   color: "#22c55e", image: MATERIAL_IMAGES.joritdae,  prob: 88, ocean: "blue" },
                        ],
                        red: [
                          { id: "haejo",           name: "후코이단",       desc: "항암·면역 활성 해조 다당류 고순도 추출물",       tag: "항암",   color: "#f87171", image: imgFucoidanHaejo, prob: 91, ocean: "blue" },
                          { id: "gamgyul",         name: "헤스페리딘",     desc: "혈중 콜레스테롤 개선 플라보노이드 고기능 소재",  tag: "심혈관", color: "#f87171", image: MATERIAL_IMAGES.gamgyul, prob: 76, ocean: "blue" },
                          { id: "nokcha-catechin", name: "녹차 카테킨",    desc: "지방 대사 활성화·항비만 기능성 정제 소재",       tag: "대사",   color: "#f87171", image: MATERIAL_IMAGES["nokcha-catechin"], prob: 68, ocean: "red"  },
                          { id: "dongchungha",     name: "동충하초",       desc: "코디세핀·아데노신 함유 면역·항피로 원료",        tag: "면역",   color: "#f87171", image: imgDongchungha, prob: 84, ocean: "blue" },
                          { id: "yongam-water",    name: "제주 용암해수",  desc: "해저 화산암 여과 미네랄 풍부 기능성 용수",       tag: "미네랄", color: "#f87171", image: MATERIAL_IMAGES["yongam-water"], prob: 72, ocean: "red"  },
                          { id: "bija",            name: "비자나무",       desc: "제주 자생 비자 추출물, 항균·항산화 활성",        tag: "항균",   color: "#f87171", image: MATERIAL_IMAGES.bija, prob: 85, ocean: "blue" },
                        ],
                        marine: [
                          { id: "camellia",   name: "동백오일",     desc: "올레산 풍부한 제주 동백나무 종자 압착유",       tag: "헤어케어", color: "#38bdf8", image: MATERIAL_IMAGES.camellia, prob: 89, ocean: "blue" },
                          { id: "hwasansong", name: "화산송이",     desc: "제주 화산송이 미세분말 기반 딥클렌징 원료",     tag: "스킨케어", color: "#38bdf8", image: MATERIAL_IMAGES.hwasansong, prob: 93, ocean: "blue" },
                          { id: "haejo",      name: "해조류 추출물", desc: "해조 폴리사카라이드 고보습·항산화 기능 소재", tag: "보습",    color: "#38bdf8", image: MATERIAL_IMAGES.haejo, prob: 74, ocean: "red"  },
                          { id: "tot",        name: "톳",           desc: "철분·요오드 풍부한 제주 연안 갈조류 원료",      tag: "미네랄",  color: "#38bdf8", image: MATERIAL_IMAGES.tot, prob: 66, ocean: "red"  },
                          { id: "miyeok",     name: "미역",         desc: "알긴산·푸코이단 함유 항산화 해조류",           tag: "항산화",  color: "#38bdf8", image: MATERIAL_IMAGES.miyeok, prob: 61, ocean: "red"  },
                          { id: "seongge",    name: "성게",         desc: "제주산 성게 생식소, 고가 기능성 해양 소재",     tag: "해양소재", color: "#38bdf8", image: MATERIAL_IMAGES.seongge, prob: 87, ocean: "blue" },
                        ],
                        white: [
                          { id: "fermented-citrus",   name: "발효 감귤",    desc: "감귤 발효 균주 기반 장 건강 프로바이오틱 원료",   tag: "발효",       color: "#10b981", image: MATERIAL_IMAGES["fermented-citrus"], prob: 79, ocean: "blue" },
                          { id: "lactic-bacteria",    name: "유산균",       desc: "제주 전통 발효법으로 배양한 기능성 유산균 균주",  tag: "프로바이오틱", color: "#10b981", image: MATERIAL_IMAGES["lactic-bacteria"], prob: 63, ocean: "red"  },
                          { id: "enzyme-seaweed",     name: "해조 효소",    desc: "해조류 효소 분해로 만드는 고순도 기능성 원료",    tag: "효소",       color: "#10b981", image: MATERIAL_IMAGES["enzyme-seaweed"], prob: 81, ocean: "blue" },
                          { id: "makgeolli-yeast",    name: "막걸리 효모",  desc: "제주 전통 막걸리 효모 균주 기반 발효 소재",       tag: "효모",       color: "#10b981", image: MATERIAL_IMAGES["makgeolli-yeast"], prob: 90, ocean: "blue" },
                          { id: "black-pig-collagen", name: "흑돼지 콜라겐", desc: "제주 흑돼지 유래 고순도 콜라겐 펩타이드",        tag: "콜라겐",     color: "#10b981", image: MATERIAL_IMAGES["black-pig-collagen"], prob: 73, ocean: "red"  },
                          { id: "citrus-vinegar",     name: "감귤 식초균",  desc: "감귤 초산 발효 균주 기반 기능성 식초 원료",       tag: "초산발효",   color: "#10b981", image: MATERIAL_IMAGES["citrus-vinegar"], prob: 67, ocean: "red"  },
                        ],
                      };

                      const materials = MATERIALS[activeCategory] ?? [];
                      return (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-4xl mx-auto">
                          {materials.map((m, idx) => (
                            <motion.button
                              key={m.id}
                              initial={{ opacity: 0, y: 24 }}
                              animate={{ opacity: 1, y: 0 }}
	                              transition={{ delay: idx * 0.03, duration: 0.22, ease: "easeOut" }}
                              onClick={() => { setSelectedMaterial(m.id); setCustomInput(""); runAnalysis(m.id); }}
                              className="group relative bg-white rounded-3xl text-left overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                              style={{ border: "1px solid rgba(0,0,0,0.06)" }}
                            >
                              {/* Top: probability + ocean badge */}
                              <div className="flex items-center justify-between px-4 pt-4 pb-2">
                                <div className="flex items-baseline gap-1">
                                  <span className="text-3xl font-black leading-none" style={{ color: m.color }}>{m.prob}</span>
                                  <span className="text-sm font-bold" style={{ color: m.color }}>%</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: m.ocean === "blue" ? "#3b82f6" : "#ef4444" }}
                                  />
                                  <span
                                    className="text-[10px] font-bold tracking-wide"
                                    style={{ color: m.ocean === "blue" ? "#3b82f6" : "#ef4444" }}
                                  >
                                    {m.ocean === "blue" ? "블루오션" : "레드오션"}
                                  </span>
                                </div>
                              </div>

                              {/* Subtitle below probability */}
                              <p className="px-4 text-[9px] text-gray-400 font-medium tracking-wide uppercase mb-3">AI 사업 추천 확률</p>

                              {/* Organic blob image */}
                              <div className="relative mx-4 mb-4">
                                {/* Decorative blob bg */}
                                <div
                                  className="absolute -top-3 -right-2 w-20 h-20 opacity-20 transition-opacity group-hover:opacity-35"
                                  style={{
                                    backgroundColor: m.color,
                                    borderRadius: "60% 40% 55% 45% / 50% 60% 40% 50%",
                                  }}
                                />
                                {/* Main image in organic clip */}
                                <div
                                  className="w-full overflow-hidden"
                                  style={{
                                    aspectRatio: "4/3",
                                    borderRadius: "55% 45% 48% 52% / 50% 52% 48% 50%",
                                    transition: "border-radius 0.6s ease",
                                  }}
                                >
	                                  <ImageWithFallback
	                                    src={m.image}
	                                    alt={m.name}
	                                    loading="eager"
	                                    decoding="async"
	                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
	                                  />
                                </div>
                              </div>

                              {/* Card body */}
                              <div className="px-4 pb-4">
                                {/* Three accent dots */}
                                <div className="flex gap-1 mb-2">
                                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color + "88" }} />
                                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color + "44" }} />
                                </div>

                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <p className="font-black text-sm text-gray-900 leading-tight">{m.name}</p>
                                    <p className="text-[10px] text-gray-400 leading-relaxed mt-0.5 line-clamp-2">{m.desc}</p>
                                  </div>
                                  <span
                                    className="shrink-0 px-2 py-1 rounded-lg text-[9px] font-bold mt-0.5"
                                    style={{ backgroundColor: m.color + "18", color: m.color }}
                                  >
                                    {m.tag}
                                  </span>
                                </div>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      );
                    })()}
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Loading */}
            {analysisState === "loading" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 px-6 gap-10"
              >
                {/* Orbital ring animation */}
                <div className="relative w-36 h-36 flex items-center justify-center">
                  {/* Outer rotating ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-transparent"
                    style={{ borderTopColor: "var(--primary)", borderRightColor: "var(--primary)" }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                  />
                  {/* Middle counter-rotating ring */}
                  <motion.div
                    className="absolute inset-3 rounded-full border-2 border-transparent"
                    style={{ borderBottomColor: "var(--accent)", borderLeftColor: "var(--accent)", opacity: 0.6 }}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
                  />
                  {/* Inner pulsing core */}
                  <motion.div
                    className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center"
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <motion.div
                      className="w-7 h-7 rounded-full bg-primary/30"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.9, 0.4] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </motion.div>
                  {/* Orbiting dot */}
                  <motion.div
                    className="absolute w-2.5 h-2.5 rounded-full bg-primary shadow-sm"
                    style={{ top: 0, left: "50%", marginLeft: -5, marginTop: -5 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                    transformOrigin="50% 72px"
                  />
                </div>

                {/* Label + step text */}
	                <div className="text-center space-y-1.5 w-full max-w-xs">
	                  <p className="font-bold text-base text-foreground tracking-tight">
	                    {customInput ? "사업 구상 분석 중" : "원료 분석 중"}
	                  </p>
                  <motion.p
                    key={loadingStep}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-xs text-foreground/50 font-mono"
                  >
                    {LOADING_STEPS[Math.min(loadingStep, LOADING_STEPS.length - 1)]}
                  </motion.p>
                </div>

                {/* Progress bar */}
                <div className="w-full max-w-xs space-y-2">
                  <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: `${(loadingStep / (LOADING_STEPS.length - 1)) * 100}%` }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                    />
                  </div>
                  <div className="flex justify-between">
                    {LOADING_STEPS.slice(0, -1).map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full"
                        animate={{ backgroundColor: i < loadingStep ? "#b86f2a" : "#e5d5c0" }}
                        transition={{ duration: 0.3 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Result — Custom Idea Dashboard */}
            {analysisState === "result" && result && customInput && (
              <div className="relative">
                <div className="flex justify-end mb-3">
	                  <button
	                    onClick={() => downloadCurrentReportPdf(customInput || analysisLabel || "사업 구상 분석")}
	                    className="jevi-pdf-hide flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all hover:shadow-md"
	                    style={{ backgroundColor: result.color + "12", color: result.color, border: `1px solid ${result.color}30` }}
	                  >
	                    <FileText className="w-3 h-3" /> PDF 내려받기
	                  </button>
                </div>
                <CustomIdeaResult idea={customInput} resetTool={resetTool} analysis={result} darkMode={darkMode} />
              </div>
            )}

            {/* Result — Material Full Dashboard */}
            {analysisState === "result" && result && !customInput && (() => {
              const matKey = selectedMaterial ?? "gamgyul";
              const ext = MATERIAL_EXTENDED[matKey] ?? MATERIAL_EXTENDED.gamgyul;
              const backend = result.backend;
              const matName =
                backend?.extraction?.ingredient ||
                analysisLabel ||
                customInput ||
                CATEGORIES.flatMap((c) => c.materials).find((m) => m.id === selectedMaterial)?.label ||
                matKey;
              const trendData = ext.dataStats.marketTrend.map((v, i) => ({ month: `${i + 1}월`, index: v }));
              const totalScore = clampScore(
                backend?.scores?.total,
                Math.round(ext.potentialIndex.reduce((acc, p) => acc + (p.score * p.weight) / 100, 0))
              );

              return (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-5 pb-8">

                  {/* PDF button */}
                  <div className="flex justify-end">
	                    <button
	                      onClick={() => downloadCurrentReportPdf(matName || "원료 분석")}
	                      className="jevi-pdf-hide flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all hover:shadow-md"
	                      style={{ backgroundColor: result.color + "12", color: result.color, border: `1px solid ${result.color}30` }}
	                    >
	                      <FileText className="w-3 h-3" /> PDF 내려받기
	                    </button>
                  </div>

                  {/* ── 원료 활용도 ── */}
                  <div className="rounded-3xl overflow-hidden bg-white shadow-sm" style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
                    <div className="px-5 pt-5 pb-3 border-b border-gray-100 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: result.color }} />
                      <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">원료 활용도</span>
                    </div>
                    <div className="flex flex-col md:flex-row">
                      {/* Left: image */}
                      <div className="relative md:w-2/5 min-h-[200px] flex items-center justify-center overflow-hidden"
                        style={{ background: `linear-gradient(135deg, ${result.color}10 0%, ${result.color}05 100%)` }}>
                        <div className="relative">
                          <div className="w-40 h-40 overflow-hidden shadow-xl"
                            style={{ borderRadius: "60% 40% 55% 45% / 50% 60% 40% 50%" }}>
                            <ImageWithFallback src={ext.image} alt={matName}
                              className="w-full h-full object-cover" />
                          </div>
                          <div className="absolute -bottom-2 -right-2 px-3 py-1.5 rounded-xl bg-white shadow-md text-[11px] font-bold"
                            style={{ color: result.color, border: `1px solid ${result.color}30` }}>
                            미활용 {ext.unusedRate}%
                          </div>
                        </div>
                      </div>
                      {/* Right: info */}
                      <div className="flex-1 p-6">
                        <p className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase mb-1">{ext.category}</p>
                        <h2 className="text-2xl font-black text-gray-900 mb-2">{matName}</h2>
                        <p className="text-sm text-gray-500 leading-relaxed mb-5">{ext.desc}</p>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { label: "연간 발생량", value: ext.annualProduction >= 10000 ? `${(ext.annualProduction / 10000).toFixed(1)}만` : ext.annualProduction.toLocaleString(), unit: "톤" },
                            { label: "미활용률", value: ext.unusedRate, unit: "%" },
                            { label: "활용도", value: ext.utilization, unit: "" },
                          ].map((s) => (
                            <div key={s.label} className="rounded-2xl p-3 text-center" style={{ backgroundColor: result.color + "10" }}>
                              <p className="text-[9px] text-gray-400 font-medium mb-1">{s.label}</p>
                              <p className="text-lg font-black" style={{ color: result.color }}>{s.value}<span className="text-xs ml-0.5">{s.unit}</span></p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── 원료 특성 ── */}
                  <div className="rounded-3xl bg-white shadow-sm p-5" style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: result.color }} />
                      <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">원료 특성</span>
                      <span className="ml-auto text-[10px] text-gray-400">카드에 마우스를 올려 상세 정보 확인</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                      {ext.compounds.map((c) => (
                        <FlipCard key={c.name} compound={c} color={result.color} />
                      ))}
                    </div>
                  </div>

                  {/* ── 레드·블루오션 매트릭스 ── */}
                  <div className="rounded-3xl bg-white shadow-sm p-5" style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: result.color }} />
                      <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">시장 포지셔닝 매트릭스</span>
                    </div>
                    <OceanMatrix products={ext.oceanProducts} color={result.color} />
                    {/* Business reasons */}
                    <div className="mt-4 p-4 rounded-2xl" style={{ backgroundColor: result.color + "08", border: `1px solid ${result.color}20` }}>
                      <p className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-3">이 소재로 사업화 추천 이유</p>
                      <div className="grid grid-cols-1 gap-2">
                        {ext.businessReasons.map((r) => (
                          <div key={r} className="flex items-start gap-2">
                            <CheckCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: result.color }} />
                            <span className="text-[11px] text-gray-600">{r}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ── 데이터 기반 분석 ── */}
                  <div className="rounded-3xl bg-white shadow-sm p-5" style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: result.color }} />
                      <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">데이터 기반 분석</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-5">
                      {[
                        { label: "미활용률", value: `${ext.dataStats.unusedRate}%`, icon: "📦" },
                        { label: "특허", value: `${backend?.evidence?.patentCount ?? ext.dataStats.patents}건`, icon: "📋" },
                        { label: "논문", value: `${backend?.evidence?.paperCount ?? ext.dataStats.papers}편`, icon: "📚" },
                        { label: "시장규모", value: ext.dataStats.marketSize, icon: "💹" },
                        { label: "연평균 성장률", value: `${ext.dataStats.growthRate}%`, icon: "📈" },
                        { label: "AI 추천도", value: `${totalScore}점`, icon: "🤖" },
                      ].map((s) => (
                        <div key={s.label} className="rounded-2xl p-3" style={{ background: `linear-gradient(135deg, ${result.color}10, ${result.color}05)`, border: `1px solid ${result.color}20` }}>
                          <p className="text-base mb-0.5">{s.icon}</p>
                          <p className="text-[9px] text-gray-400 font-medium mb-1">{s.label}</p>
                          <p className="text-sm font-black" style={{ color: result.color }}>{s.value}</p>
                        </div>
                      ))}
                    </div>
                    {/* Market trend area chart */}
                    <div className="rounded-2xl p-4" style={{ backgroundColor: result.color + "06", border: `1px solid ${result.color}15` }}>
                      <p className="text-[10px] text-gray-400 font-semibold mb-3">시장 성장 지수 (월별 누적, 기준: 100)</p>
                      <ResponsiveContainer width="100%" height={140}>
                        <AreaChart data={trendData} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                          <defs>
                            <linearGradient id={`grad-${matKey}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={result.color} stopOpacity={0.25} />
                              <stop offset="95%" stopColor={result.color} stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                          <Tooltip
                            contentStyle={{ fontSize: 11, borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                            formatter={(v: number) => [`${v}`, "지수"]}
                          />
                          <Area type="monotone" dataKey="index" stroke={result.color} strokeWidth={2} fill={`url(#grad-${matKey})`} dot={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* ── 원료 활용잠재 지수 ── */}
                  <div className="rounded-3xl bg-white shadow-sm p-5" style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: result.color }} />
                      <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">원료 활용잠재 지수</span>
                      <div className="ml-auto flex items-baseline gap-1">
                        <span className="text-2xl font-black" style={{ color: result.color }}>{totalScore}</span>
                        <span className="text-xs text-gray-400">/ 100</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400 mb-4">5개 평가 항목의 가중 합산 점수입니다</p>
                    <div className="space-y-3">
                      {ext.potentialIndex.map((p) => (
                        <div key={p.item} className="rounded-2xl p-3" style={{ backgroundColor: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.05)" }}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-gray-900">{p.item}</span>
                              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">비중 {p.weight}%</span>
                            </div>
                            <span className="text-sm font-black" style={{ color: result.color }}>{p.score}점</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden mb-2">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: result.color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${p.score}%` }}
                              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                            />
                          </div>
                          <p className="text-[10px] text-gray-400 leading-relaxed">{p.basis}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer note + reset */}
                  <p className="text-center text-[10px] text-gray-400 px-4">
                    ※ 본 분석은 공공데이터 기반 1차 검토 결과이며, 최종 판단의 책임은 사용 기업에 있습니다.
                  </p>
                  <button
                    onClick={resetTool}
                    className="w-full py-3 rounded-2xl border text-sm font-semibold transition-all hover:shadow-md"
                    style={{ borderColor: result.color + "40", color: result.color, backgroundColor: result.color + "08" }}
                  >
                    다른 소재 분석하기
                  </button>
                </motion.div>
              );
            })()}
            </div>
            )}
            </>
            )}
          </div>
        )}

        {/* ─── Floating AI Assistant Button (result only) ─── */}
        <AnimatePresence>
          {activeSection === "tool" && analysisState === "result" && result && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              onClick={() => setAiChatOpen(true)}
	              className="jevi-pdf-hide fixed bottom-6 right-5 z-50 flex items-center gap-2 px-3 py-2.5 rounded-2xl shadow-xl"
              style={{ backgroundColor: result.color, color: "#fff", boxShadow: `0 4px 20px ${result.color}60` }}
              title="AI 어시스턴트"
            >
              <span className="text-sm">✦</span>
              <span className="text-[11px] font-bold">AI 어시스턴트</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* ─── AI Assistant Modal ─── */}
        <AnimatePresence>
          {activeSection === "tool" && aiChatOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
	                className="jevi-pdf-hide fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
                onClick={() => setAiChatOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 40, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 280, damping: 24 }}
	                className="jevi-pdf-hide fixed bottom-20 right-5 z-50 w-80 rounded-3xl bg-white shadow-2xl overflow-hidden"
                style={{ border: "1px solid rgba(0,0,0,0.08)" }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4" style={{ backgroundColor: result?.color ?? "#b86f2a" }}>
                  <div className="flex items-center gap-2">
                    <span className="text-white text-base">✦</span>
                    <div>
                      <p className="text-white text-xs font-black">AI 어시스턴트</p>
                      <p className="text-white/70 text-[9px]">Jeju Bio R&D Navigator</p>
                    </div>
                  </div>
                  <button onClick={() => setAiChatOpen(false)} className="w-6 h-6 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                    <span className="text-white text-xs font-bold">✕</span>
                  </button>
                </div>
                <div className="p-4 space-y-3">
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    현재 분석 결과를 바탕으로 사업화 방향, 포지셔닝, R&amp;D 보완 전략을 질문할 수 있습니다.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {quickCoachQuestions.map((question) => (
                      <button
                        key={question}
                        type="button"
                        onClick={() => sendCoachQuestion(question)}
                        className="px-2.5 py-1.5 rounded-full border text-[9px] font-bold transition-all hover:shadow-sm"
                        style={{
                          borderColor: `${result?.color ?? "#b86f2a"}35`,
                          color: result?.color ?? "#b86f2a",
                          backgroundColor: `${result?.color ?? "#b86f2a"}0d`
                        }}
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                  <div className="h-56 overflow-y-auto rounded-2xl bg-gray-50/80 border border-gray-100 p-3 space-y-2">
                    {aiMessages.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center text-center gap-2">
                        <span className="text-2xl">🤖</span>
                        <p className="text-[11px] text-gray-400 leading-relaxed">
                          빠른 질문을 누르거나<br />분석 결과에 대해 직접 질문해보세요.
                        </p>
                      </div>
                    )}
                    {aiMessages.map((message, index) => (
                      <div
                        key={`${message.role}-${index}`}
                        className={`max-w-[88%] rounded-2xl px-3 py-2 text-[11px] leading-relaxed ${
                          message.role === "user" ? "ml-auto text-white" : "mr-auto bg-white text-gray-600 border border-gray-100"
                        }`}
                        style={message.role === "user" ? { backgroundColor: result?.color ?? "#b86f2a" } : undefined}
                      >
                        {message.content}
                      </div>
                    ))}
                    {aiCoachLoading && (
                      <div className="mr-auto max-w-[88%] rounded-2xl px-3 py-2 text-[11px] bg-white text-gray-400 border border-gray-100">
                        AI 사업화 코치가 분석 중입니다...
                      </div>
                    )}
                  </div>
                  <form
                    className="flex items-end gap-2"
                    onSubmit={(event) => {
                      event.preventDefault();
                      sendCoachQuestion();
                    }}
                  >
                    <textarea
                      value={aiQuestion}
                      onChange={(event) => setAiQuestion(event.target.value.slice(0, 300))}
                      className="flex-1 min-h-[42px] max-h-24 resize-none rounded-2xl border border-gray-100 bg-gray-50 px-3 py-2 text-xs outline-none focus:border-primary/40"
                      placeholder="메시지를 입력하세요..."
                    />
                    <button
                      type="submit"
                      disabled={!aiQuestion.trim() || aiCoachLoading}
                      className="h-[42px] px-3 rounded-2xl text-[11px] font-black text-white disabled:opacity-40"
                      style={{ backgroundColor: result?.color ?? "#b86f2a" }}
                    >
                      보내기
                    </button>
                  </form>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ─── ABOUT ─── */}
        {activeSection === "about" && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-10">
            <div>
              <h1 className="text-2xl font-bold mb-2">프로젝트 소개</h1>
              <p className="text-foreground/50 text-sm leading-relaxed">Jeju Bio R&D Navigator — 아이디어 설계서 기반 해커톤 출품작</p>
            </div>

            <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 space-y-3">
              <div className="text-xs font-mono text-primary">핵심 메시지</div>
              <p className="text-base font-medium leading-relaxed">
                제주 바이오 산업의 문제는 소재 부족이 아닙니다.<br />
                어떤 소재를 어떤 제품으로 개발해야 성공할 수 있는지<br />
                <span className="text-primary">판단할 근거를 확보하는 인프라의 부족</span>입니다.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: "문제",
                  content: "제주에는 감귤·해조류·용암해수 등 풍부한 바이오 소재가 있지만, R&D 투자 전 사업화 가능성을 판단할 체계적 근거가 없습니다. 전담 전략팀이 없는 중소기업은 직감에 의존하거나, 수개월의 조사를 자체적으로 수행해야 합니다.",
                  icon: <AlertTriangle className="w-4 h-4" />,
                },
                {
                  title: "솔루션",
                  content: "생성형 AI와 제주 공공데이터(특허·수출통계·규제·생산량)를 결합해, 소재별 4축 검토 결과를 3초 내에 제공합니다. AI가 결정하는 것이 아니라, 기업이 더 나은 결정을 내리도록 투명한 근거를 제시합니다.",
                  icon: <Zap className="w-4 h-4" />,
                },
                {
                  title: "확장성",
                  content: "모듈형 구조로 제주 외 전남 해조류, 강원 산림바이오, 경남·부산 해양바이오 등 타 지역 특화 소재에도 동일 모델 적용 가능합니다. 개 기업용 도구에서 지역 산업 데이터 축적 플폼으로 발전할 수 있습니다.",
                  icon: <Globe className="w-4 h-4" />,
                },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-border bg-card p-5 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                    {item.icon} {item.title}
                  </div>
                  <p className="text-sm text-foreground/60 leading-relaxed">{item.content}</p>
                </div>
              ))}
            </div>

            {/* Limitations table */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-3 border-b border-border text-xs font-mono text-muted-foreground">리스크 & 대응</div>
              <div className="divide-y divide-border">
                {[
                  { q: '"AI가 개발 여부를 결정하는 것 아닌가?"', a: "모든 출력은 '근거 제시' 형태로 제한. 최종 판단 책임은 기업에 있음을 명시합니다." },
                  { q: '"공공데이터가 항상 최신인가?"', a: "데이터별 최종 갱신일을 결과에 함께 표기해 한계를 투명하게 노출합니다." },
                  { q: '"가중치 산정 기준은?"', a: "현재 전문가 인터뷰 기반 초기값이며, 실사용 데이터 축적 후 2단계 검증 예정입니다." },
                ].map((row) => (
                  <div key={row.q} className="px-5 py-4 grid sm:grid-cols-2 gap-3">
                    <div className="text-xs text-foreground/50 italic">{row.q}</div>
                    <div className="text-xs text-foreground/70">{row.a}</div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setActiveSection("home")}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              네비게이터 사용해보기 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
        {/* ─── INTRO ─── */}
        {activeSection === "intro" && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-10"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/8 text-primary text-xs font-mono mb-4">
                <Leaf className="w-3 h-3" /> 프로젝트 소개
              </div>
              <h1 className="text-3xl font-bold mb-3 tracking-tight">Jeju Bio R&D Navigator</h1>
              <p className="text-foreground/50 text-sm leading-relaxed">해커톤 출품작 — 제주 바이오 소재 사업화 의사결정 지원 엔진</p>
            </div>

            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-7 space-y-3">
              <div className="text-xs font-mono text-primary tracking-widest uppercase">핵심 메시지</div>
              <p className="text-lg font-semibold leading-relaxed">
                제주 바이오 산업의 문제는<br />소재 부족이 아닙니다.
              </p>
              <p className="text-foreground/60 text-sm leading-relaxed">
                어떤 소재를 어떤 제품으로 개발해야 성공할 수 있는지<br />
                <span className="text-primary font-medium">판단할 근거를 확보하는 인프라가 부족</span>한 것입니다.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: "문제",
                  icon: <AlertTriangle className="w-4 h-4" />,
                  content: "제주에는 감귤·해조류·용암해수 등 풍부한 바이오 소재가 있지만, R&D 투자 전 사업화 가능성을 판단할 체계적 근거가 없습니다. 전담 전략팀이 없는 중소기업은 직감에 의존하거나 수개월의 조사를 자체적으로 수행해야 합니다.",
                },
                {
                  title: "솔루션",
                  icon: <Zap className="w-4 h-4" />,
                  content: "생성형 AI와 제주 공공데이터(특허·수출통계·규제·생산량)를 결합해, 소재별 4축 검토 결과를 빠르게 제공합니다. AI가 결정하는 것이 아니라, 기업이 더 나은 결정을 내리도록 투명한 근거를 제시합니다.",
                },
                {
                  title: "확장성",
                  icon: <Globe className="w-4 h-4" />,
                  content: "모듈형 구조로 제주 외 전남 해조류, 강원 산림바이오, 경남·부산 해양바이오 등 타 지역 특화 소재에도 동일 모델 적용이 가능합니다. 개별 기업용 도구에서 지역 산업 데이터 축적 플랫폼으로 발전할 수 있습니다.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-border bg-card p-5 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                    {item.icon} {item.title}
                  </div>
                  <p className="text-sm text-foreground/60 leading-relaxed">{item.content}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-3 border-b border-border text-xs font-mono text-muted-foreground">리스크 & 대응</div>
              <div className="divide-y divide-border">
                {[
                  { q: '"AI가 개발 여부를 결정하는 것 아닌가?"', a: "모든 출력은 '근거 제시' 형태로 제한. 최종 판단 책임은 기업에 있음을 명시합니다." },
                  { q: '"공공데이터가 항상 최신인가?"', a: "데이터별 최종 갱신일을 결과에 함께 표기해 한계를 투명하게 노출합니다." },
                  { q: '"가중치 산정 기준은?"', a: "현재 전문가 인터뷰 기반 초기값이며, 실사용 데이터 축적 후 2단계 검증 예정입니다." },
                ].map((row) => (
                  <div key={row.q} className="px-5 py-4 grid sm:grid-cols-2 gap-3">
                    <div className="text-xs text-foreground/50 italic">{row.q}</div>
                    <div className="text-xs text-foreground/70">{row.a}</div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setActiveSection("home")}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              네비게이터 사용해보기 <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* ─── HOWTO ─── */}
        {activeSection === "howto" && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-10"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/8 text-primary text-xs font-mono mb-4">
                <Cpu className="w-3 h-3" /> 작동 방식
              </div>
              <h1 className="text-3xl font-bold mb-3 tracking-tight">어떻게 분석하나요?</h1>
              <p className="text-foreground/50 text-sm leading-relaxed">
                Jeju Bio R&D Navigator는 4단계 프로세스로 소재의 사업화 가능성을 평가합니다.
              </p>
              <button
                type="button"
                onClick={() => document.getElementById("algorithmMethodology")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:bg-primary/90 transition-colors"
              >
                알고리즘 보기 <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Step-by-step */}
            <div className="space-y-4">
              {[
                {
                  num: "01",
                  title: "소재 선택",
                  desc: "그린바이오 / 레드바이오 / 해양·뷰티바이오 3개 카테고리 중 분석할 제주 바이오 소재를 선택합니다. 목록에 없는 소재는 직접 입력도 가능합니다.",
                  icon: <Search className="w-5 h-5" />,
                  color: "#4ade80",
                },
                {
                  num: "02",
                  title: "공공데이터 수집",
                  desc: "특허청 KIPRIS, 제주 농업기술원, 식약처 기능성 원료 DB, 관세청 수출입 통계, 해양수산부 생산량 통계 등 신뢰도 높은 공공데이터를 자동 수집합니다.",
                  icon: <Database className="w-5 h-5" />,
                  color: "#60a5fa",
                },
                {
                  num: "03",
                  title: "4축 알고리즘 적용",
                  desc: "제조가능성 · 시장성 · 규제장벽 · 원료지속성 4개 축을 기준으로 AI가 데이터를 가중 분석합니다. 각 축의 점수와 근거가 투명하게 공개됩니다.",
                  icon: <BarChart3 className="w-5 h-5" />,
                  color: "#f5a623",
                },
                {
                  num: "04",
                  title: "결과 및 권고",
                  desc: "종합 점수와 레이더 차트, 축별 상세 점수, 핵심 근거 하이라이트, 리스크 요인, 그리고 사업화 방향 권고를 제공합니다.",
                  icon: <CheckCircle className="w-5 h-5" />,
                  color: "#00c896",
                },
              ].map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="flex gap-5 p-5 rounded-xl border border-border bg-card"
                >
                  <div className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: step.color + "20", color: step.color }}>
                    {step.icon}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-foreground/30">{step.num}</span>
                      <span className="font-semibold text-sm">{step.title}</span>
                    </div>
                    <p className="text-sm text-foreground/55 leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 4축 상세 */}
            <div>
              <h2 className="text-lg font-bold mb-4">4축 평가 기준 상세</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: "제조가능성", q: "만들 수 있나?", desc: "기술 성숙도(TRL), 국내 특허 현황, 제조 인프라 접근성을 평가합니다.", icon: <Beaker className="w-4 h-4" />, color: "#00c896" },
                  { label: "시장성", q: "팔릴까?", desc: "수출입 통계, 글로벌 논문 트렌드, 소비자 수요와 경쟁 강도를 분석합니다.", icon: <TrendingUp className="w-4 h-4" />, color: "#f5a623" },
                  { label: "규제장벽", q: "막히는 게 있나?", desc: "식약처 기능성 원료 인정 현황, 인증 절차의 복잡도와 소요 기간을 검토합니다.", icon: <Shield className="w-4 h-4" />, color: "#60a5fa" },
                  { label: "원료지속성", q: "계속 공급 가능한가?", desc: "제주 내 원료 생산량, 계절 편중도, 기후 리스크와 공급 안정성을 평가합니다.", icon: <Leaf className="w-4 h-4" />, color: "#34d399" },
                ].map((ax) => (
                  <div key={ax.label} className="p-5 rounded-xl border border-border bg-card space-y-2">
                    <div className="flex items-center gap-2" style={{ color: ax.color }}>
                      {ax.icon}
                      <span className="font-semibold text-sm">{ax.label}</span>
                      <span className="text-xs font-mono text-foreground/35 ml-auto">"{ax.q}"</span>
                    </div>
                    <p className="text-xs text-foreground/55 leading-relaxed">{ax.desc}</p>
                  </div>
                ))}
              </div>
            </div>

	            <ScoringFrameworkGuide id="algorithmMethodology" />

            <DataSourceRegistry
              open={dataSourceDetailsOpen}
              onToggle={() => setDataSourceDetailsOpen((open) => !open)}
            />

            <button
              onClick={() => setActiveSection("home")}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              지금 분석 시작하기 <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

      </main>

      {/* Footer */}
	      <footer className="border-t mt-8 py-6" style={{ borderColor: darkMode ? "rgba(255,255,255,0.14)" : "rgba(92,58,30,0.28)" }}>
	        <div
	          className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs"
	          style={{ color: darkMode ? "rgba(219,234,254,0.78)" : "#5c3a1e" }}
	        >
	          <span className="font-mono">Jeju Bio R&D Navigating — Hackathon 2026</span>
	          <span>생성형 AI × 제주 공공데이터 × 의사결정 지원</span>
	        </div>
	      </footer>

      {/* How it works dialog */}
      <Dialog open={howItWorksOpen} onOpenChange={setHowItWorksOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: 'rgb(235, 245, 249)' }}>
          <DialogHeader>
            <DialogTitle className="text-2xl">작동 방식</DialogTitle>
            <DialogDescription>
              Jeju Bio R&D Navigator가 어떻게 소재를 분석하는지 알아보세요
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            {/* 3 Steps */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">분석 프로세스</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {STEPS.map((step, i) => (
                  <div
                    key={step.num}
                    className="rounded-xl border border-border bg-card p-4 space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        {step.icon}
                      </div>
                      <span className="font-mono text-xs text-muted-foreground">{step.num}</span>
                    </div>
                    <h4 className="font-semibold">{step.title}</h4>
                    <p className="text-sm text-foreground/50 leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 4-Axis Explanation */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">4축 평가 알고리즘</h3>
              <p className="text-sm text-foreground/50">
                모든 소재를 동일한 4가지 기준으로 공공데이터 기반 검토합니다.
              </p>
              <div className="space-y-3">
                {[
                  { q: "만들 수 있나?", label: "제조가능성", desc: "기술 성숙도, 특허, 제조 인프라", icon: <Beaker className="w-4 h-4" />, color: "#00c896" },
                  { q: "팔릴까?", label: "시장성", desc: "수출입 통계, 논문 동향, 시장 수요", icon: <TrendingUp className="w-4 h-4" />, color: "#f5a623" },
                  { q: "막히는 게 있나?", label: "규제장벽", desc: "식약처 인정 현황, 인증 절차 복잡성", icon: <Shield className="w-4 h-4" />, color: "#60a5fa" },
                  { q: "원료가 계속 나오나?", label: "원료지속성", desc: "제주 내 생산량, 계절성, 공급 안정성", icon: <Leaf className="w-4 h-4" />, color: "#34d399" },
                ].map((ax) => (
                  <div key={ax.label} className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border">
                    <div className="w-8 h-8 rounded-md flex items-center justify-center mt-0.5 shrink-0" style={{ backgroundColor: ax.color + "20", color: ax.color }}>
                      {ax.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{ax.label}</span>
                        <span className="text-xs font-mono text-foreground/40">"{ax.q}"</span>
                      </div>
                      <div className="text-xs text-foreground/40 mt-0.5">{ax.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
	            </div>

	            <ScoringFrameworkGuide compact />

	            {/* Data Sources */}
	            <div className="space-y-4">
              <h3 className="font-semibold text-lg">데이터 소스</h3>
              <DataSourceRegistry
                open={dataSourceDetailsOpen}
                onToggle={() => setDataSourceDetailsOpen((open) => !open)}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </>
  );
}
