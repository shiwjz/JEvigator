export const INGREDIENTS = [
  "감귤 부산물",
  "만감류 부산물",
  "풋귤",
  "오디",
  "감태",
  "모자반",
  "톳",
  "다시마",
  "미역",
  "우뭇가사리",
  "파래",
  "곰피",
  "녹차",
  "백년초",
  "동백",
  "유채",
  "조릿대",
  "삼나무",
  "억새",
  "팔손이나무",
  "청보리",
  "고사리",
  "칡",
  "약콩",
  "흑돼지 부산물",
  "제주마 부산물",
  "벌꿀/프로폴리스",
  "화산암반수",
  "용암해수",
  "표고버섯"
];

export const FUNCTIONS = [
  "항산화",
  "항염",
  "미백",
  "주름개선/항노화",
  "보습",
  "피부장벽 강화/진정",
  "자외선 차단",
  "여드름/피지조절",
  "상처재생/재생촉진",
  "항균/항미생물",
  "항당뇨",
  "간기능 개선",
  "면역력 증진",
  "관절건강",
  "장건강",
  "피로회복",
  "콜레스테롤/혈행개선",
  "체지방감소/다이어트",
  "탈모방지/두피개선",
  "인지기능개선",
  "눈건강",
  "여성갱년기 건강",
  "남성건강",
  "스트레스 완화/수면개선",
  "뼈건강"
];

export const CATEGORIES = [
  "화장품",
  "건강기능식품",
  "펫푸드/펫케어",
  "기능성 식품/음료",
  "의약외품",
  "원료 소재 B2B 공급",
  "위생/세정용품",
  "사료첨가제",
  "친환경 소재/바이오 플라스틱",
  "농자재/친환경 비료"
];

export const RECOMMENDED_IDEAS = [
  {
    id: "green-citrus-cosmetic",
    bioType: "Green Bio",
    title: "감귤 부산물 항산화 화장품",
    description: "가공 부산물을 고부가 피부 소재로 전환",
    ingredient: "감귤 부산물",
    functions: ["항산화", "주름개선/항노화"],
    categories: ["화장품"],
    accent: "citrus"
  },
  {
    id: "green-tea-drink",
    bioType: "Green Bio",
    title: "녹차 피로회복 기능성 음료",
    description: "제주 녹차를 일상 섭취형 제품으로 확장",
    ingredient: "녹차",
    functions: ["피로회복", "항산화"],
    categories: ["기능성 식품/음료"],
    accent: "leaf"
  },
  {
    id: "green-cactus-cosmetic",
    bioType: "Green Bio",
    title: "백년초 피부 진정 화장품",
    description: "제주 자생 식물의 피부 진정 가능성 탐색",
    ingredient: "백년초",
    functions: ["피부장벽 강화/진정", "보습"],
    categories: ["화장품"],
    accent: "cactus"
  },
  {
    id: "blue-ecklonia-supplement",
    bioType: "Blue Bio",
    title: "감태 항산화 건강기능식품",
    description: "해양 폴리페놀 기반 기능성 소재 검토",
    ingredient: "감태",
    functions: ["항산화"],
    categories: ["건강기능식품"],
    accent: "ocean"
  },
  {
    id: "blue-hijiki-food",
    bioType: "Blue Bio",
    title: "톳 미네랄 기능성 식품",
    description: "제주 해조류의 영양 자원을 간편식에 적용",
    ingredient: "톳",
    functions: ["뼈건강"],
    categories: ["기능성 식품/음료"],
    accent: "ocean"
  },
  {
    id: "blue-kelp-food",
    bioType: "Blue Bio",
    title: "다시마 장건강 기능성 식품",
    description: "식이섬유 기반 장건강 제품 가능성 분석",
    ingredient: "다시마",
    functions: ["장건강"],
    categories: ["기능성 식품/음료"],
    accent: "ocean"
  },
  {
    id: "red-pork-cosmetic",
    bioType: "Red Bio",
    title: "흑돼지 부산물 콜라겐 화장품",
    description: "축산 부산물의 순환형 바이오 소재화",
    ingredient: "흑돼지 부산물",
    functions: ["주름개선/항노화", "보습"],
    categories: ["화장품"],
    accent: "coral"
  },
  {
    id: "red-horse-material",
    bioType: "Red Bio",
    title: "제주마 부산물 피부 보습 소재",
    description: "원료 소재 공급을 위한 효능 근거 검토",
    ingredient: "제주마 부산물",
    functions: ["보습"],
    categories: ["원료 소재 B2B 공급"],
    accent: "coral"
  },
  {
    id: "red-propolis-care",
    bioType: "Red Bio",
    title: "프로폴리스 구강케어 의약외품",
    description: "항균 기능을 구강 위생 제품으로 연결",
    ingredient: "벌꿀/프로폴리스",
    functions: ["항균/항미생물"],
    categories: ["의약외품"],
    accent: "honey"
  },
  {
    id: "white-citrus-plastic",
    bioType: "White Bio",
    title: "감귤 부산물 바이오 플라스틱",
    description: "제주 농산 부산물의 친환경 소재 전환",
    ingredient: "감귤 부산물",
    functions: [],
    categories: ["친환경 소재/바이오 플라스틱"],
    accent: "stone"
  },
  {
    id: "white-seaweed-cleaner",
    bioType: "White Bio",
    title: "해조류 기반 천연 세정용품",
    description: "해양 바이오 자원의 생활소재 활용",
    ingredient: "모자반",
    functions: ["항균/항미생물"],
    categories: ["위생/세정용품"],
    accent: "stone"
  },
  {
    id: "white-barley-fertilizer",
    bioType: "White Bio",
    title: "청보리 부산물 친환경 비료",
    description: "농산 자원의 지역 순환 모델 검토",
    ingredient: "청보리",
    functions: [],
    categories: ["농자재/친환경 비료"],
    accent: "stone"
  }
];

export const CATEGORY_MARKET_BASE = {
  "화장품": 74,
  "건강기능식품": 77,
  "펫푸드/펫케어": 82,
  "기능성 식품/음료": 76,
  "의약외품": 70,
  "원료 소재 B2B 공급": 72,
  "위생/세정용품": 69,
  "사료첨가제": 71,
  "친환경 소재/바이오 플라스틱": 84,
  "농자재/친환경 비료": 75
};

export const EVIDENCE_PROFILES = {
  "감귤 부산물": {
    paperCount: 28,
    recentPaperCount: 15,
    patentCount: 42,
    recentPatentCount: 17,
    productionTons: 478500,
    productionVariation: 7.8,
    mfdsName: "Citrus Unshiu Peel Extract",
    casNo: "미지정/혼합물",
    restriction: "제품 유형별 원료 규격 확인 필요"
  },
  "풋귤": {
    paperCount: 21,
    recentPaperCount: 13,
    patentCount: 19,
    recentPatentCount: 9,
    productionTons: 3100,
    productionVariation: 12.4,
    mfdsName: "Citrus Unshiu Fruit Extract",
    casNo: "미지정/혼합물",
    restriction: "식품·화장품 적용 규격 별도 확인"
  },
  "감태": {
    paperCount: 34,
    recentPaperCount: 19,
    patentCount: 31,
    recentPatentCount: 12,
    productionTons: 1250,
    productionVariation: 15.2,
    mfdsName: "Ecklonia Cava Extract",
    casNo: "미지정/혼합물",
    restriction: "추출물 규격과 섭취 안전성 확인 필요"
  },
  "톳": {
    paperCount: 18,
    recentPaperCount: 9,
    patentCount: 14,
    recentPatentCount: 5,
    productionTons: 780,
    productionVariation: 18.1,
    mfdsName: "Hizikia Fusiforme Extract",
    casNo: "미지정/혼합물",
    restriction: "무기비소 등 원료 안전성 검토 필요"
  },
  "다시마": {
    paperCount: 39,
    recentPaperCount: 18,
    patentCount: 36,
    recentPatentCount: 11,
    productionTons: 2200,
    productionVariation: 13.6,
    mfdsName: "Laminaria Japonica Extract",
    casNo: "미지정/혼합물",
    restriction: "요오드 함량과 제품 규격 확인 필요"
  },
  "녹차": {
    paperCount: 63,
    recentPaperCount: 27,
    patentCount: 57,
    recentPatentCount: 20,
    productionTons: 5100,
    productionVariation: 9.5,
    mfdsName: "Camellia Sinensis Leaf Extract",
    casNo: "84650-60-2",
    restriction: "카페인 및 카테킨 섭취량 확인 필요"
  },
  "백년초": {
    paperCount: 16,
    recentPaperCount: 8,
    patentCount: 11,
    recentPatentCount: 4,
    productionTons: 690,
    productionVariation: 16.4,
    mfdsName: "Opuntia Ficus-Indica Extract",
    casNo: "90082-21-6",
    restriction: "부위·추출법별 안전성 자료 확인 필요"
  },
  "흑돼지 부산물": {
    paperCount: 11,
    recentPaperCount: 7,
    patentCount: 13,
    recentPatentCount: 5,
    productionTons: 8600,
    productionVariation: 8.7,
    mfdsName: "Hydrolyzed Collagen",
    casNo: "92113-31-0",
    restriction: "동물성 원료 추적성과 위생 규격 확인 필요"
  },
  "제주마 부산물": {
    paperCount: 8,
    recentPaperCount: 5,
    patentCount: 7,
    recentPatentCount: 3,
    productionTons: 240,
    productionVariation: 19.8,
    mfdsName: "Horse Oil",
    casNo: "미지정/혼합물",
    restriction: "동물성 원료 추적성과 사용 부위 확인 필요"
  },
  "벌꿀/프로폴리스": {
    paperCount: 46,
    recentPaperCount: 20,
    patentCount: 38,
    recentPatentCount: 14,
    productionTons: 340,
    productionVariation: 21.5,
    mfdsName: "Propolis Extract",
    casNo: "9009-62-5",
    restriction: "알레르기와 제품 유형별 함량 기준 확인 필요"
  }
};

export const DEFAULT_EVIDENCE_PROFILE = {
  paperCount: 14,
  recentPaperCount: 7,
  patentCount: 12,
  recentPatentCount: 4,
  productionTons: 920,
  productionVariation: 17.5,
  mfdsName: "표준 원료명 매칭 필요",
  casNo: "확인 필요",
  restriction: "식약처 원료정보 추가 검토 필요"
};
