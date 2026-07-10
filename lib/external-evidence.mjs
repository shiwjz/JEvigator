import { getCsvEvidence } from "./csv-evidence.mjs";

const PAPER_TIMEOUT_MS = 5500;
const MFDS_TIMEOUT_MS = 6500;
const CURRENT_YEAR = new Date().getFullYear();

const ingredientTerms = [
  [/감귤박|감귤 부산물|귤껍질|진피/, "citrus peel byproduct"],
  [/감귤|풋귤/, "citrus extract"],
  [/감태/, "Ecklonia cava"],
  [/모자반/, "Sargassum"],
  [/톳/, "hijiki seaweed"],
  [/다시마/, "kelp"],
  [/미역/, "wakame seaweed"],
  [/매생이/, "Capsosiphon fulvescens"],
  [/해조류/, "seaweed pigment"],
  [/흑돼지|돼지.*껍|돼지 부산물/, "porcine collagen"],
  [/제주마|말 부산물/, "horse derived material"],
  [/화산재|화산송이|송이|현무암|화산석/, "volcanic ash"],
  [/당근/, "carrot byproduct"],
  [/유산균/, "lactic acid bacteria"],
  [/녹차/, "green tea"],
  [/백년초/, "Opuntia ficus-indica"],
  [/동백/, "Camellia japonica"],
  [/프로폴리스/, "propolis"],
  [/벌꿀|꿀/, "honey"],
  [/표고버섯/, "shiitake mushroom"],
  [/용암해수|화산암반수/, "Jeju mineral water"]
];

const categoryTerms = {
  "화장품": "cosmetic",
  "건강기능식품": "functional food",
  "펫푸드/펫케어": "pet health",
  "기능성 식품/음료": "functional food beverage",
  "의약외품": "antimicrobial hygiene",
  "원료 소재 B2B 공급": "bioactive ingredient",
  "위생/세정용품": "cleaning antimicrobial material",
  "사료첨가제": "feed additive",
  "친환경 소재/바이오 플라스틱": "bioplastic biomaterial",
  "농자재/친환경 비료": "fertilizer plant growth"
};

const functionTerms = {
  "항산화": "antioxidant",
  "항염": "anti-inflammatory",
  "미백": "skin whitening",
  "주름개선/항노화": "anti-aging",
  "보습": "moisturizing",
  "피부장벽 강화/진정": "skin barrier soothing",
  "자외선 차단": "UV protection",
  "여드름/피지조절": "acne sebum",
  "상처재생": "wound healing",
  "항균/항미생물": "antimicrobial",
  "항당뇨": "antidiabetic",
  "간기능 개선": "liver function",
  "면역력 증진": "immune",
  "관절건강": "joint health",
  "장건강": "gut health",
  "피로회복": "anti-fatigue",
  "콜레스테롤/혈행개선": "cholesterol circulation",
  "체지방감소/다이어트": "anti-obesity",
  "탈모방지/두피개선": "hair growth scalp",
  "인지기능개선": "cognitive function",
  "눈건강": "eye health",
  "스트레스완화/수면": "stress sleep",
  "수질정화/흡착": "water filtration adsorption",
  "영양 보충": "nutrition",
  "위생": "hygiene",
  "구강 관리": "oral care",
  "소재화/업사이클링": "upcycling biomaterial",
  "천연 색소/착색": "natural food color pigment"
};

const demoPaperEvidence = [
  {
    pattern: /감귤.*화장품|화장품.*감귤/,
    query: "citrus extract cosmetic",
    papers: [
      {
        title: "Citrus-derived compounds and their cosmetic applications",
        year: 2022,
        doi: null,
        citedBy: null,
        journal: "시연용 캐시"
      }
    ]
  },
  {
    pattern: /감귤박.*(플라스틱|소재)|(플라스틱|소재).*감귤박/,
    query: "citrus peel byproduct bioplastic",
    papers: [
      {
        title: "Valorization of citrus peel waste for biodegradable materials",
        year: 2023,
        doi: null,
        citedBy: null,
        journal: "시연용 캐시"
      }
    ]
  },
  {
    pattern: /감태/,
    query: "Ecklonia cava functional food",
    papers: [
      {
        title: "Bioactive compounds and functional properties of Ecklonia cava",
        year: 2024,
        doi: null,
        citedBy: null,
        journal: "시연용 캐시"
      }
    ]
  },
  {
    pattern: /흑돼지|돼지.*콜라겐/,
    query: "porcine collagen cosmetic",
    papers: [
      {
        title: "Porcine collagen as a biomaterial for skin applications",
        year: 2021,
        doi: null,
        citedBy: null,
        journal: "시연용 캐시"
      }
    ]
  },
  {
    pattern: /화산재|화산송이|화산석/,
    query: "volcanic ash water filtration adsorption",
    papers: [
      {
        title: "Adsorption performance of volcanic materials in water treatment",
        year: 2023,
        doi: null,
        citedBy: null,
        journal: "시연용 캐시"
      }
    ]
  }
];

function limitedText(value, maxLength = 180) {
  return String(value || "").trim().slice(0, maxLength);
}

function plainText(value, maxLength = 300) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function paperYear(value) {
  const year = Number(value);
  return Number.isFinite(year) && year > 1800 && year <= CURRENT_YEAR + 1 ? year : null;
}

async function fetchWithTimeout(url, timeoutMs, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export function buildPaperQuery({ idea = "", ingredient = "", category = "", functions = [] }) {
  const sourceText = `${ingredient} ${idea}`;
  const ingredientTerm =
    ingredientTerms.find(([pattern]) => pattern.test(sourceText))?.[1] ||
    limitedText(ingredient || idea, 80);
  const categoryTerm = categoryTerms[category] || "";
  const functionTerm = functions
    .map((item) => functionTerms[item])
    .filter(Boolean)
    .slice(0, 2)
    .join(" ");
  return [ingredientTerm, categoryTerm, functionTerm].filter(Boolean).join(" ").trim();
}

export async function searchOpenAlex(query) {
  const safeQuery = limitedText(query);
  if (!safeQuery) throw new Error("검색어가 비어 있습니다.");

  const url = new URL("https://api.openalex.org/works");
  url.searchParams.set("search", safeQuery);
  url.searchParams.set("per_page", "5");
  url.searchParams.set(
    "select",
    "id,doi,display_name,publication_year,cited_by_count,primary_location"
  );
  if (process.env.OPENALEX_API_KEY) {
    url.searchParams.set("api_key", process.env.OPENALEX_API_KEY);
  }

  const recentUrl = new URL(url);
  recentUrl.searchParams.set("per_page", "1");
  recentUrl.searchParams.set(
    "filter",
    `publication_year:${CURRENT_YEAR - 4}-${CURRENT_YEAR}`
  );
  recentUrl.searchParams.set("select", "id");
  const requestOptions = {
    headers: { "user-agent": "JejuBioRNDNavigator/1.0" }
  };
  const [response, recentResponse] = await Promise.all([
    fetchWithTimeout(url, PAPER_TIMEOUT_MS, requestOptions),
    fetchWithTimeout(recentUrl, PAPER_TIMEOUT_MS, requestOptions)
  ]);
  if (!response.ok) throw new Error(`OpenAlex API ${response.status}`);
  const payload = await response.json();
  const recentPayload = recentResponse.ok ? await recentResponse.json() : null;
  const papers = (payload.results || []).map((item) => ({
    title: plainText(item.display_name, 300) || "제목 미상",
    year: paperYear(item.publication_year),
    doi: item.doi ? String(item.doi).replace(/^https?:\/\/doi\.org\//, "") : null,
    citedBy: Number.isFinite(item.cited_by_count) ? item.cited_by_count : null,
    journal: limitedText(item.primary_location?.source?.display_name, 140) || null,
    url: item.doi || item.primary_location?.landing_page_url || item.id || null
  }));

  return {
    totalCount: Number(payload.meta?.count) || papers.length,
    recentTotalCount: Number(recentPayload?.meta?.count) || 0,
    source: "OpenAlex",
    status: papers.length ? "확인" : "추가 검증 필요",
    query: safeQuery,
    papers
  };
}

export async function searchCrossref(query) {
  const safeQuery = limitedText(query);
  if (!safeQuery) throw new Error("검색어가 비어 있습니다.");

  const url = new URL("https://api.crossref.org/works");
  url.searchParams.set("query", safeQuery);
  url.searchParams.set("rows", "5");
  if (process.env.CROSSREF_MAILTO) {
    url.searchParams.set("mailto", process.env.CROSSREF_MAILTO);
  }
  const response = await fetchWithTimeout(url, PAPER_TIMEOUT_MS, {
    headers: {
      "user-agent": `JejuBioRNDNavigator/1.0${
        process.env.CROSSREF_MAILTO ? ` (mailto:${process.env.CROSSREF_MAILTO})` : ""
      }`
    }
  });
  if (!response.ok) throw new Error(`Crossref API ${response.status}`);
  const payload = await response.json();
  const message = payload.message || {};
  const papers = (message.items || []).map((item) => {
    const year =
      item.published?.["date-parts"]?.[0]?.[0] ||
      item["published-print"]?.["date-parts"]?.[0]?.[0] ||
      item["published-online"]?.["date-parts"]?.[0]?.[0];
    return {
      title: limitedText(item.title?.[0], 300) || "제목 미상",
      year: paperYear(year),
      doi: item.DOI || null,
      citedBy: Number.isFinite(item["is-referenced-by-count"])
        ? item["is-referenced-by-count"]
        : null,
      journal: limitedText(item["container-title"]?.[0] || item.publisher, 140) || null,
      url: item.URL || (item.DOI ? `https://doi.org/${item.DOI}` : null)
    };
  });

  return {
    totalCount: Number(message["total-results"]) || papers.length,
    source: "Crossref",
    status: papers.length ? "확인" : "추가 검증 필요",
    query: safeQuery,
    papers
  };
}

function paperFallback(query, idea) {
  const match = demoPaperEvidence.find((item) => item.pattern.test(`${idea} ${query}`));
  return {
    totalCount: match ? match.papers.length : 0,
    source: "Fallback",
    status: "API 실패로 캐시 사용",
    query: match?.query || query,
    papers: match?.papers || []
  };
}

export async function searchPapers(query, idea = "") {
  const failures = [];
  try {
    const result = await searchOpenAlex(query);
    if (result.totalCount > 0 && result.papers.length) return { ...result, failures };
    failures.push("OpenAlex 검색 결과 0건");
  } catch (error) {
    failures.push(error instanceof Error ? error.message : "OpenAlex 연결 실패");
  }

  try {
    const result = await searchCrossref(query);
    if (result.totalCount > 0 && result.papers.length) return { ...result, failures };
    failures.push("Crossref 검색 결과 0건");
  } catch (error) {
    failures.push(error instanceof Error ? error.message : "Crossref 연결 실패");
  }
  return { ...paperFallback(query, idea), failures };
}

function flattenRecords(value, records = []) {
  if (Array.isArray(value)) {
    value.forEach((item) => flattenRecords(item, records));
  } else if (value && typeof value === "object") {
    const scalarEntries = Object.entries(value).filter(
      ([, item]) => typeof item !== "object" || item === null
    );
    if (scalarEntries.length >= 2) records.push(Object.fromEntries(scalarEntries));
    Object.values(value).forEach((item) => flattenRecords(item, records));
  }
  return records;
}

function xmlItems(text) {
  const blocks = [...String(text).matchAll(/<item>([\s\S]*?)<\/item>/gi)].map(
    (match) => match[1]
  );
  return blocks.map((block) =>
    Object.fromEntries(
      [...block.matchAll(/<([A-Za-z0-9_]+)>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/\1>/g)].map(
        ([, key, value]) => [key, value.replace(/<[^>]+>/g, "").trim()]
      )
    )
  );
}

function pickField(record, patterns) {
  const entry = Object.entries(record || {}).find(([key]) =>
    patterns.some((pattern) => pattern.test(key))
  );
  return entry?.[1] ? limitedText(entry[1], 500) : null;
}

function normalizeMfdsRecord(record) {
  return {
    name: pickField(record, [/INGR.*KOR/i, /KOR.*NAME/i, /원료.*명/i, /성분.*명/i]),
    englishName: pickField(record, [/INGR.*ENG/i, /ENG.*NAME/i, /영문.*명/i]),
    casNo: pickField(record, [/CAS/i]),
    definition: pickField(record, [/ORIGIN/i, /DEFINITION/i, /기원/i, /정의/i]),
    synonym: pickField(record, [/SYNONYM/i, /이명/i])
  };
}

function mfdsMatchScore(item, keyword) {
  const normalizedKeyword = String(keyword).replace(/\s|부산물|추출물|껍질/g, "").toLowerCase();
  const text = [item.name, item.englishName, item.synonym, item.definition]
    .filter(Boolean)
    .join(" ")
    .replace(/\s/g, "")
    .toLowerCase();
  if (!normalizedKeyword || !text) return 0;
  if (text.includes(normalizedKeyword)) return 3;
  const pieces = normalizedKeyword.split(/[/,()]/).filter((piece) => piece.length >= 2);
  return pieces.some((piece) => text.includes(piece)) ? 1 : 0;
}

export async function searchMfdsIngredient(keyword) {
  const safeKeyword = limitedText(keyword, 80);
  const apiKey = process.env.MFDS_API_KEY;
  if (!apiKey) {
    return {
      source: "식약처 화장품 원료성분정보 API",
      status: "추가 검증 필요",
      matched: false,
      query: safeKeyword,
      item: null,
      detail: "MFDS_API_KEY 미설정: 표준 원료명 추가 확인 필요"
    };
  }

  const params = new URLSearchParams({
    pageNo: "1",
    numOfRows: "100",
    type: "json",
    _type: "json"
  });
  const endpoint =
    "https://apis.data.go.kr/1471000/CsmtcsIngdCpntInfoService01/" +
    `getCsmtcsIngdCpntInfoService01?serviceKey=${apiKey}&${params}`;

  try {
    const response = await fetchWithTimeout(endpoint, MFDS_TIMEOUT_MS);
    if (!response.ok) throw new Error(`식약처 API ${response.status}`);
    const text = await response.text();
    let records = [];
    try {
      records = flattenRecords(JSON.parse(text));
    } catch {
      records = xmlItems(text);
    }
    const normalized = records
      .map(normalizeMfdsRecord)
      .filter((item) => item.name || item.englishName || item.casNo);
    const item = normalized
      .map((value) => ({ value, score: mfdsMatchScore(value, safeKeyword) }))
      .sort((a, b) => b.score - a.score)[0];
    const matched = Boolean(item?.score);
    return {
      source: "식약처 화장품 원료성분정보 API",
      status: matched ? "확인" : "추가 검증 필요",
      matched,
      query: safeKeyword,
      item: matched ? item.value : null,
      detail: matched
        ? `표준 원료명 ${item.value.name || item.value.englishName}${
            item.value.casNo ? `, CAS No. ${item.value.casNo}` : ""
          }`
        : "검색 결과에서 직접 일치하는 표준 원료명을 찾지 못함"
    };
  } catch (error) {
    return {
      source: "식약처 화장품 원료성분정보 API",
      status: "API 실패로 캐시 사용",
      matched: false,
      query: safeKeyword,
      item: null,
      detail: error instanceof Error ? error.message : "식약처 API 연결 실패"
    };
  }
}

export async function collectExternalEvidence({ idea, extraction }) {
  const ingredient = extraction.ingredient || extraction.rawIngredient || "";
  const category = extraction.categories?.[0] || "";
  const query = buildPaperQuery({
    idea,
    ingredient,
    category,
    functions: extraction.functions || []
  });

  const [csv, papers, mfds] = await Promise.all([
    getCsvEvidence({ ingredient, category }),
    searchPapers(query, idea),
    category === "화장품"
      ? searchMfdsIngredient(ingredient)
      : Promise.resolve({
          source: "식약처 화장품 원료성분정보 API",
          status: "비대상",
          matched: false,
          query: ingredient,
          item: null,
          detail: `${category || "현재 제품군"}은 화장품 원료 API 대상이 아니며 별도 규제 검토 필요`
        })
  ]);

  return { query, csv, papers, mfds };
}
