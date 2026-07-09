# Jeju Bio R&D Navigator

제주 바이오 아이디어를 공공데이터 근거로 분석하는 해커톤 MVP입니다.

## 구현 기능

- 메인 화면의 두 진입 경로: 사용자 지정 AI 분석 / 아이디어 구상하기
- 고정 제품군 10개 중 사용자 선택을 우선 적용
- 자연어 아이디어에서 표준 원료, 원료군, Bio 분야, 기능 후보 추출
- Gemini 의미 매핑으로 동의어를 표준화하고 목록 밖 원료도 원문과 원료군 보존
- 원료-제품군 논리 적합성 평가, 감점 사유 및 점수 상한 적용
- 추가 검증 항목과 개선 추천 아이디어 제공
- Green, Blue, Red, White Bio 추천 아이디어 12개
- 기술성, 시장성, 특허안전성, 공급안정성 및 종합점수 계산
- 제품군별 성장성·경쟁밀도 포지셔닝 매트릭스와 피벗 비교
- 최근 5년 특허 출원 추이와 가중치 What-if 시뮬레이션
- 식약처 규제·인허가 체크리스트와 데이터 캐시 기준일
- 산업별 가중치 프리셋과 A4 가로형 PDF 근거 요약 출력
- 논문, 특허, 생산, 식약처 원료정보 근거 표시
- AI 결과 설명과 인쇄용 결과 리포트
- 외부 API가 없어도 작동하는 규칙 기반 및 캐시 데이터 폴백

## 로컬 실행

```bash
npm run dev
```

브라우저에서 `http://127.0.0.1:4173`을 엽니다.

## AI API 연결

`.env.example`을 참고해 서버 환경변수를 설정합니다. API 키는 `app.js`나 GitHub에 넣지 않습니다.

```bash
export GEMINI_API_KEY="..."
export ANTHROPIC_API_KEY="..."
npm run dev
```

- `GEMINI_API_KEY`: 사용자 문장을 표준 키워드 JSON으로 구조화
- `ANTHROPIC_API_KEY`: 서버에서 계산된 점수와 근거를 설명
- 키가 없거나 API 호출이 실패하면 규칙 기반 폴백으로 자동 전환

## 공공데이터 상태

현재 점수 근거는 해커톤 시연용 캐시 데이터입니다.

- ScienceON: 논문 수, 최근 5년 논문 수
- KIPRIS Plus: 유사 특허 수, 최근 특허 수
- 제주데이터허브: 생산량, 생산량 변동
- 식의약 데이터포털: 원료 표준명, CAS No., 제한사항
- AI Hub: API가 아니라 승인 후 다운로드하는 데이터셋 중심으로 활용

실시간 연동 시 `SCIENCEON_API_KEY`, `KIPRIS_API_KEY`, `MFDS_API_KEY`, `JEJU_DATA_API_KEY`를 서버 환경변수로 추가하고 `lib/ai-providers.mjs` 앞단에 데이터 수집 어댑터를 연결합니다.

## Vercel 배포

1. 이 폴더를 GitHub 저장소에 올립니다.
2. Vercel에서 `Add New Project`를 눌러 저장소를 가져옵니다.
3. Framework Preset은 `Other`, Build Command는 비워 둡니다.
4. Vercel 프로젝트의 `Settings > Environment Variables`에 API 키를 추가합니다.
5. Deploy를 누릅니다.

정적 화면은 루트에서, 분석 API는 `api/analyze.js`의 Vercel Function으로 배포됩니다.
