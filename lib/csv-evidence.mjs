import { readFile } from "node:fs/promises";
import { join } from "node:path";

const dataDirectory = join(process.cwd(), "public", "data");

const files = {
  livestock: "가축사육통계.csv",
  directSales: "방문판매업정보.csv",
  seogwipoCitrus: "제주특별자치도 서귀포시 감귤 생산 정보_20240513.csv",
  citrusVarieties: "제주특별자치도_품종별감귤생산현황_20241231.csv",
  jejuCitrusProcessing: "제주특별자치도 제주시_감귤생산및처리현황_20230604.csv",
  seaweedKim: "한국수산자원공단_해조류(김) 데이터_20230109.csv",
  seaweedOther: "한국수산자원공단_해조류(김 제외) 데이터_20230109.csv",
  seaweedEcology: "제주특별자치도_마을어장 생태환경 해조류 데이터_20221130.csv"
};

let evidenceCache;

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const next = text[index + 1];
    if (character === '"') {
      if (quoted && next === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && next === "\n") index += 1;
      row.push(field);
      if (row.some((value) => value !== "")) rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }

  const headers = rows.shift()?.map((header) => header.trim()) || [];
  return rows.map((values) =>
    Object.fromEntries(headers.map((header, index) => [header, values[index]?.trim() || ""]))
  );
}

async function loadCsv(fileName) {
  const buffer = await readFile(join(dataDirectory, fileName));
  let text;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(buffer);
  } catch {
    text = new TextDecoder("euc-kr").decode(buffer);
  }
  return parseCsv(text.replace(/^\uFEFF/, ""));
}

function numberValue(value) {
  const parsed = Number(String(value ?? "").replaceAll(",", "").trim());
  return Number.isFinite(parsed) ? parsed : 0;
}

function coefficientOfVariation(values) {
  const usable = values.filter((value) => Number.isFinite(value) && value > 0);
  if (usable.length < 2) return 0;
  const mean = usable.reduce((sum, value) => sum + value, 0) / usable.length;
  const variance =
    usable.reduce((sum, value) => sum + (value - mean) ** 2, 0) / usable.length;
  return mean ? (Math.sqrt(variance) / mean) * 100 : 0;
}

function sumFields(row, excludedFields) {
  return Object.entries(row).reduce((sum, [key, value]) => {
    return excludedFields.includes(key) ? sum : sum + numberValue(value);
  }, 0);
}

function aggregateCitrusVarieties(rows) {
  const productionRows = rows
    .filter((row) => row["구분"]?.includes("생산량"))
    .map((row) => ({
      year: numberValue(row["연도별"]),
      totalTons: sumFields(row, ["연도별", "구분", "데이터기준일자"]),
      updatedAt: row["데이터기준일자"]
    }))
    .sort((a, b) => b.year - a.year);
  const latest = productionRows[0] || { year: null, totalTons: 0, updatedAt: null };
  return {
    ...latest,
    variation: Math.round(
      coefficientOfVariation(productionRows.slice(0, 5).map((row) => row.totalTons)) * 10
    ) / 10
  };
}

function aggregateSeogwipoCitrus(rows) {
  const productionRows = rows.filter((row) => row["구분"] === "생산량");
  const latestYear = Math.max(...productionRows.map((row) => numberValue(row["연도"])));
  const latestRows = productionRows.filter(
    (row) => numberValue(row["연도"]) === latestYear
  );
  return {
    year: latestYear,
    totalTons: latestRows.reduce(
      (sum, row) =>
        sum +
        sumFields(row, ["연도", "읍면동", "구분", "데이터기준일"]),
      0
    ),
    districts: latestRows.length,
    updatedAt: latestRows[0]?.["데이터기준일"] || null
  };
}

function aggregateCitrusProcessing(rows) {
  const sorted = [...rows].sort(
    (a, b) => numberValue(b["연도별"]) - numberValue(a["연도별"])
  );
  const latest = sorted[0] || {};
  const productionTons =
    numberValue(latest["온주조생생산량(메트릭톤)"]) +
    numberValue(latest["온주중만생생산량(메트릭톤)"]) +
    numberValue(latest["만감류생산량(메트릭톤)"]);
  return {
    year: numberValue(latest["연도별"]) || null,
    areaHa: numberValue(latest["식부면적(ha)"]),
    productionTons,
    processingTons: numberValue(latest["가공처리량(메트릭톤)"]),
    outboundTons: numberValue(latest["생과반출량(메트릭톤)"]),
    updatedAt: latest["데이터기준일자"] || null
  };
}

function aggregateLivestock(rows) {
  const sorted = [...rows].sort((a, b) => {
    const yearDifference = numberValue(b["연도"]) - numberValue(a["연도"]);
    if (yearDifference) return yearDifference;
    return numberValue(b["분기"]) - numberValue(a["분기"]);
  });
  const latest = sorted[0] || {};
  return {
    year: numberValue(latest["연도"]) || null,
    quarter: latest["분기"] || null,
    totalHeads: numberValue(latest["총사육두수"]),
    farms: numberValue(latest["낙농가수"]),
    variation: Math.round(
      coefficientOfVariation(
        sorted.slice(0, 8).map((row) => numberValue(row["총사육두수"]))
      ) * 10
    ) / 10
  };
}

function aggregateDirectSales(rows) {
  const activeRows = rows.filter((row) => row["영업상태명"]?.includes("영업/정상"));
  const latestDate = rows
    .map((row) => row["데이터갱신일자"])
    .filter(Boolean)
    .sort()
    .at(-1);
  return {
    totalBusinesses: rows.length,
    activeBusinesses: activeRows.length,
    updatedAt: latestDate?.slice(0, 10) || null
  };
}

function aggregateSeaweedProduction(rows) {
  const species = {};
  for (const row of rows) {
    const name = row["품종명"] || "기타 해조류";
    if (!species[name]) species[name] = { records: 0, production: 0, sales: 0 };
    species[name].records += 1;
    species[name].production += numberValue(row["생산량"]);
    species[name].sales += numberValue(row["판매량"]);
  }
  return {
    records: rows.length,
    totalProduction: Object.values(species).reduce(
      (sum, item) => sum + item.production,
      0
    ),
    totalSales: Object.values(species).reduce((sum, item) => sum + item.sales, 0),
    species
  };
}

function aggregateSeaweedKim(rows) {
  const productionFields = [
    "생산량_유리사상체",
    "생산량_해상채묘용 패각사상체",
    "생산량_육상채묘용 패각사상체_패",
    "생산량_육상채묘용 패각사상체_책(김발)"
  ];
  const activeRecords = rows.filter((row) =>
    productionFields.some((field) => numberValue(row[field]) > 0)
  ).length;
  return { records: rows.length, activeRecords };
}

function aggregateSeaweedEcology(rows) {
  const years = rows.map((row) => numberValue(row["측정 연도"])).filter(Boolean);
  const stations = new Set(rows.map((row) => row["정점명"]).filter(Boolean));
  const summarize = (pattern) => {
    const matches = rows.filter((row) => pattern.test(row["종(국명)"] || ""));
    const biomass = matches
      .map((row) => numberValue(row["단위면적당생물량"]))
      .filter((value) => value > 0);
    return {
      observations: matches.length,
      stations: new Set(matches.map((row) => row["정점명"]).filter(Boolean)).size,
      biomassMeasurements: biomass.length,
      averageBiomass: biomass.length
        ? Math.round(
            (biomass.reduce((sum, value) => sum + value, 0) / biomass.length) * 10
          ) / 10
        : 0
    };
  };
  return {
    records: rows.length,
    fromYear: years.length ? Math.min(...years) : null,
    toYear: years.length ? Math.max(...years) : null,
    stations: stations.size,
    ecklonia: summarize(/감태/),
    wakame: summarize(/미역/),
    sargassum: summarize(/모자반/),
    greenAlgae: summarize(/파래/)
  };
}

async function loadAllEvidence() {
  if (!evidenceCache) {
    evidenceCache = Promise.all([
      loadCsv(files.livestock),
      loadCsv(files.directSales),
      loadCsv(files.seogwipoCitrus),
      loadCsv(files.citrusVarieties),
      loadCsv(files.jejuCitrusProcessing),
      loadCsv(files.seaweedKim),
      loadCsv(files.seaweedOther),
      loadCsv(files.seaweedEcology)
    ]).then(
      ([
        livestock,
        directSales,
        seogwipoCitrus,
        citrusVarieties,
        processing,
        seaweedKim,
        seaweedOther,
        seaweedEcology
      ]) => ({
        livestock: aggregateLivestock(livestock),
        directSales: aggregateDirectSales(directSales),
        seogwipoCitrus: aggregateSeogwipoCitrus(seogwipoCitrus),
        citrusVarieties: aggregateCitrusVarieties(citrusVarieties),
        citrusProcessing: aggregateCitrusProcessing(processing),
        seaweedKim: aggregateSeaweedKim(seaweedKim),
        seaweedProduction: aggregateSeaweedProduction(seaweedOther),
        seaweedEcology: aggregateSeaweedEcology(seaweedEcology)
      })
    );
  }
  return evidenceCache;
}

function citrusSupplyScore(data) {
  const productionScore = Math.min(
    92,
    (Math.log10(data.citrusVarieties.totalTons + 1) / 6) * 100
  );
  const stabilityScore = Math.max(35, 100 - data.citrusVarieties.variation * 3);
  const processingRatio = data.citrusProcessing.productionTons
    ? data.citrusProcessing.processingTons / data.citrusProcessing.productionTons
    : 0;
  const processingScore = Math.min(90, processingRatio * 500);
  return Math.round(
    productionScore * 0.45 + stabilityScore * 0.3 + processingScore * 0.25
  );
}

function livestockSupplyScore(data) {
  const volumeScore = Math.min(
    80,
    (Math.log10(data.livestock.totalHeads + 1) / 6) * 85
  );
  const stabilityScore = Math.max(40, 100 - data.livestock.variation * 4);
  return Math.min(72, Math.round(volumeScore * 0.55 + stabilityScore * 0.45));
}

function seaweedSupplyScore(data) {
  const productionScore = Math.min(
    78,
    40 + Math.log10(data.seaweedProduction.totalProduction + 1) * 6
  );
  const regionalPresenceScore = Math.min(90, 45 + data.seaweedEcology.stations);
  return Math.min(76, Math.round(productionScore * 0.55 + regionalPresenceScore * 0.45));
}

export async function getCsvEvidence({ ingredient = "", category = "" }) {
  try {
    const data = await loadAllEvidence();
    const ingredientText = String(ingredient);
    const isCitrus = /감귤|풋귤|귤박|진피|시트러스/.test(ingredientText);
    const isLivestock = /흑돼지|돼지|축산|콜라겐|젤라틴|제주마/.test(
      ingredientText
    );
    const isSeaweed = /해조류|김|감태|모자반|톳|다시마|미역|파래|곰피/.test(
      ingredientText
    );
    const channelCategories = [
      "화장품",
      "건강기능식품",
      "기능성 식품/음료",
      "펫푸드/펫케어"
    ];
    const usesDirectSales = channelCategories.includes(category);

    const sources = [
      {
        id: "citrus-processing",
        name: "제주시 감귤생산및처리현황 CSV",
        status: isCitrus ? "확인" : "비대상",
        updatedAt: data.citrusProcessing.updatedAt,
        detail: isCitrus
          ? `${data.citrusProcessing.year}년 생산 ${data.citrusProcessing.productionTons.toLocaleString("ko-KR")}톤, 가공처리 ${data.citrusProcessing.processingTons.toLocaleString("ko-KR")}톤`
          : "감귤 계열 원료에 사용"
      },
      {
        id: "citrus-varieties",
        name: "제주 품종별감귤생산현황 CSV",
        status: isCitrus ? "확인" : "비대상",
        updatedAt: data.citrusVarieties.updatedAt,
        detail: isCitrus
          ? `${data.citrusVarieties.year}년 품종 합계 ${data.citrusVarieties.totalTons.toLocaleString("ko-KR")}톤`
          : "감귤 계열 원료에 사용"
      },
      {
        id: "seogwipo-citrus",
        name: "서귀포시 감귤 생산 정보 CSV",
        status: isCitrus ? "확인" : "비대상",
        updatedAt: data.seogwipoCitrus.updatedAt,
        detail: isCitrus
          ? `${data.seogwipoCitrus.year}년 ${data.seogwipoCitrus.districts}개 읍면동 생산량 집계`
          : "감귤 계열 원료에 사용"
      },
      {
        id: "livestock",
        name: "가축사육통계 CSV",
        status: isLivestock ? "보조 근거" : "비대상",
        updatedAt: isLivestock
          ? `${data.livestock.year} ${data.livestock.quarter}`
          : null,
        detail: isLivestock
          ? `총사육두수 ${data.livestock.totalHeads.toLocaleString("ko-KR")}두. 흑돼지 전용 통계가 아닌 축산 보조 근거`
          : "축산 부산물 원료에 사용"
      },
      {
        id: "direct-sales",
        name: "방문판매업정보 CSV",
        status: usesDirectSales ? "보조 근거" : "비대상",
        updatedAt: data.directSales.updatedAt,
        detail: usesDirectSales
          ? `정상 영업 ${data.directSales.activeBusinesses.toLocaleString("ko-KR")}개소. 판매 채널 존재 가능성만 반영`
          : "방문판매 가능 제품군에만 사용"
      },
      {
        id: "seaweed-production",
        name: "한국수산자원공단 해조류(김 제외) CSV",
        status: isSeaweed ? "보조 근거" : "비대상",
        updatedAt: "2023-01-09",
        detail: isSeaweed
          ? `양식 표본 ${data.seaweedProduction.records}건, 생산량 합계 ${data.seaweedProduction.totalProduction.toLocaleString("ko-KR")} (원자료 단위 준용)`
          : "해조류 계열 원료에 사용"
      },
      {
        id: "seaweed-ecology",
        name: "제주 마을어장 생태환경 해조류 CSV",
        status: isSeaweed ? "확인" : "비대상",
        updatedAt: "2022-11-30",
        detail: isSeaweed
          ? `${data.seaweedEcology.fromYear}-${data.seaweedEcology.toYear}년 ${data.seaweedEcology.stations}개 정점, 감태 ${data.seaweedEcology.ecklonia.observations.toLocaleString("ko-KR")}건 관측`
          : "제주 해조류 지역성·생태 분포 확인에 사용"
      },
      {
        id: "seaweed-kim",
        name: "한국수산자원공단 해조류(김) CSV",
        status: isSeaweed ? "보조 근거" : "비대상",
        updatedAt: "2023-01-09",
        detail: isSeaweed
          ? `김 종자생산 조사 ${data.seaweedKim.records}건 중 생산 기록 ${data.seaweedKim.activeRecords}건`
          : "김 계열 원료에 사용"
      }
    ];

    return {
      loaded: true,
      supply: isCitrus
        ? {
            directness: "direct",
            score: citrusSupplyScore(data),
            productionTons: data.citrusVarieties.totalTons,
            processingTons: data.citrusProcessing.processingTons,
            variation: data.citrusVarieties.variation,
            description: `${data.citrusVarieties.year}년 제주 감귤 생산 ${data.citrusVarieties.totalTons.toLocaleString("ko-KR")}톤과 ${data.citrusProcessing.year}년 가공처리 ${data.citrusProcessing.processingTons.toLocaleString("ko-KR")}톤을 직접 근거로 사용`
          }
        : isLivestock
          ? {
              directness: "support",
              score: livestockSupplyScore(data),
              totalHeads: data.livestock.totalHeads,
              variation: data.livestock.variation,
              description: `${data.livestock.year}년 ${data.livestock.quarter} 축산 통계 기반 보조 근거. 흑돼지 전용 여부 추가 검증 필요`
            }
          : isSeaweed
            ? {
                directness: "support",
                score: seaweedSupplyScore(data),
                productionAmount: data.seaweedProduction.totalProduction,
                observations: data.seaweedEcology.records,
                stations: data.seaweedEcology.stations,
                variation: null,
                description: `수산자원공단 비김 해조류 양식 표본 ${data.seaweedProduction.records}건과 제주 마을어장 ${data.seaweedEcology.stations}개 정점 생태조사를 결합한 보조 근거. 감태 ${data.seaweedEcology.ecklonia.observations.toLocaleString("ko-KR")}건 관측, 원료 회수 가능량은 추가 검증 필요`
              }
          : null,
      market: usesDirectSales
        ? {
            directness: "support",
            scoreAdjustment: data.directSales.activeBusinesses > 0 ? 2 : 0,
            activeBusinesses: data.directSales.activeBusinesses,
            description: `제주 방문판매 정상 영업 ${data.directSales.activeBusinesses.toLocaleString("ko-KR")}개소를 채널 보조 신호로만 반영`
          }
        : null,
      sources,
      regulatoryReference:
        isSeaweed && category === "기능성 식품/음료"
          ? {
              name: "천연 식용색소 위생 표준",
              jurisdiction: "대만",
              status: "보조 근거",
              updatedAt: "2023-03-29",
              detail:
                "김색소(피코에리트린)와 녹조류 유래 클로로필 수록. 국내 식품 규정이 아닌 해외 규격 참고자료",
              url: `/public/data/${encodeURIComponent("천연 식용색소 위생 표준(최종개정_ 2023년 3월 29일).pdf")}`
            }
          : null
    };
  } catch (error) {
    return {
      loaded: false,
      supply: null,
      market: null,
      sources: Object.values(files).map((name) => ({
        name,
        status: "API 실패로 캐시 사용",
        updatedAt: null,
        detail: error instanceof Error ? error.message : "CSV load failed"
      }))
    };
  }
}
