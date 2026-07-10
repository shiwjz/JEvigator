# Jeju Bio R&D Navigator

제주 바이오 아이디어를 공공데이터 근거로 분석하는 해커톤 MVP입니다.

## 구현 기능

- 5문항 라이트 기업진단과 단계별 다음 행동
- 기업진단 → 4축 분석 → 포지셔닝 → AI 코파일럿의 성장형 흐름
- 상단 Executive Dashboard + 하단 10개 섹션 Evidence Report
- 입력 분해, R&D Readiness 등급, 시장 진입성×특허 경쟁 포지션 맵
- 지역성·기능성·시장 진입성·규제 안정성 브랜드 경쟁력 4축
- 차별성 감사, 브랜드 포지션 유형 비교, 대체 아이템 What-if, Venture Launch Path
- 점수 산정 기준 모달과 계산 근거 추적
- 고정 제품군 10개 중 사용자 선택을 우선 적용
- 자연어 아이디어에서 표준 원료, 원료군, Bio 분야, 기능 후보 추출
- Gemini 의미 매핑으로 동의어를 표준화하고 목록 밖 원료도 원문과 원료군 보존
- 원료-제품군 논리 적합성 평가, 감점 사유 및 점수 상한 적용
- 추가 검증 항목과 인접 적용처 비교
- Green, Blue, Red, White Bio 추천 아이디어 12개
- 기술성, 시장성, 특허안전성, 공급안정성 및 종합점수 계산
- OpenAlex 우선, Crossref 백업 방식의 실제 논문 검색
- 제주 감귤·축산·방문판매 CSV 기반 공급 및 채널 보조 근거
- 제주 마을어장 43개 정점 생태환경과 해조류 양식 표본 기반 지역·공급 보조 근거
- 천연 식용색소 위생표준은 대만 규격 참고자료로만 표시하고 국내 규제와 분리
- 화장품 선택 시 식약처 원료성분정보 서버 조회
- 출처별 확인/보조/추가 검증/API 실패 상태 표시
- 제품군별 성장성·경쟁밀도 포지셔닝 매트릭스와 피벗 비교
- 가장 약한 축의 원인, 다음 행동, 예상기간을 표시하는 기준 기반 코파일럿
- 최근 5년 특허 출원 추이와 가중치 What-if 시뮬레이션
- 산업별 가중치 프리셋과 A4 가로형 PDF 근거 요약 출력
- What-if는 실제 슬라이더 비율을 사용해 감점·상한 적용 전 민감도 원점수 표시
- 외부 API가 없어도 작동하는 규칙 기반 및 캐시 데이터 폴백

## 로컬 실행

```bash
npm run dev
```

브라우저에서 `http://127.0.0.1:4173`을 엽니다.

배포 전 검증:

```bash
npm run build
```

## 서버 환경변수

`.env.example`을 참고합니다. API 키는 `app.js`, GitHub, 브라우저 저장소에 넣지 않습니다.

```bash
export GEMINI_API_KEY="..."
export MFDS_API_KEY="..."
export OPENALEX_API_KEY="..."
export CROSSREF_MAILTO="contact@example.com"
npm run dev
```

- `GEMINI_API_KEY`: 사용자 문장을 표준 키워드 JSON으로 구조화
- `MFDS_API_KEY`: 식약처 화장품 원료성분정보 조회
- `OPENALEX_API_KEY`: OpenAlex 논문 검색용 무료 키
- `CROSSREF_MAILTO`: OpenAlex 실패 시 사용하는 Crossref polite pool 연락처
- `ENABLE_CLAUDE=false`: 유료 Claude 호출 차단. 현재 코파일럿은 기준 기반으로 작동
- 키가 없거나 호출이 실패해도 규칙 및 데모 캐시로 자동 전환

## 공공데이터 상태

- 논문: OpenAlex 실시간 조회, 실패 시 Crossref, 최종 실패 시 대표 캐시
- 공급: `public/data`의 실제 감귤·축산·해조류 CSV
- 규제: `MFDS_API_KEY`가 있을 때 식약처 화장품 원료성분정보 실시간 조회
- 특허: 현재 KIPRIS 시연 캐시. 라이브 검색은 `KIPRIS_API_KEY`와 서비스 규격 추가 필요
- 사용제한 원료정보: 현재 원료성분 API와 별개이므로 추가 연동 예정으로 표시

핵심 시연 시나리오:

- `감귤 껍질로 피부에 좋은 항산화 화장품을 만들고싶어요`
- 추천 아이디어 `제주 해조류 천연 색소 기능성 스낵`

기본 종합점수:

`기술성 30% + 시장성 25% + 특허안전성 20% + 공급안정성 20% + 논리적 적합성 5% - 보완 필요 감점`

서버 API:

- `POST /api/analyze`
- `GET /api/papers/openalex?query=...`
- `GET /api/papers/crossref?query=...`
- `GET /api/mfds/cosmetic-ingredients?keyword=...`

## Vercel 배포

1. 이 폴더를 GitHub 저장소에 올립니다.
2. Vercel에서 `Add New Project`를 눌러 저장소를 가져옵니다.
3. Framework Preset은 `Other`, Build Command는 `npm run build`로 설정합니다.
4. Vercel 프로젝트의 `Settings > Environment Variables`에 API 키를 추가합니다.
5. Deploy를 누릅니다.

정적 화면은 루트에서, `api` 폴더의 분석·논문·식약처 경로는 Vercel Functions로 배포됩니다.
