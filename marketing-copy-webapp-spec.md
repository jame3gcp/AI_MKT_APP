# 마케팅 문구 자동화 웹앱 기능 명세서 (Next.js + OpenAI API, 추론형 관점)

## 1) 목표와 범위
- **목표**: 가치 제안(USP)을 입력하고, **타겟/플랫폼/어조/분량/목표** 등 옵션을 적용해 **정형 JSON**으로 마케팅 문구(헤드라인/본문/CTA/해시태그 등)와 A/B 변형을 생성.
- **성과 기준**:  
  1) 버튼 클릭 후 **JSON 스키마 일치** 출력,  
  2) 플랫폼 적합성(길이·형식) 사전 검증,  
  3) A/B **최대 5변형** 동시 생성,  
  4) 금지어/정책 위반 **가드레일** 반영.

---

## 2) 사용자 흐름 (요약)
1. **가치 제안 입력**  
2. **옵션 선택(타겟·플랫폼·톤·분량·목표 등)**  
3. **생성 버튼 클릭**  
4. 서버 라우트가 OpenAI API 호출  
5. **JSON 결과**를 뷰어에 표시(복사/다운로드)  
6. 필요 시 **플랫폼별 미세조정** 및 **A/B 변형 비교**.

---

## 3) 화면/컴포넌트 명세
### 3.1 입력 폼
- **가치 제안(필수)**: textarea(최소 10자, 권고 300자 이내)
- **타겟팅**
  - 성별: `남성/여성/모든 성별/비지정`
  - 연령대: `10대/20대 초/20대 후/30대/40대/50대+`
  - 퍼소나: `가성비/프리미엄/에코/얼리어답터/보수적/충성/잠재`
  - 구매여정: `인지/흥미/고려/전환/리텐션/리퍼럴`
- **플랫폼(복수 선택)**  
  `Instagram Feed/Reels, Facebook Feed, X, LinkedIn Post/Ad, YouTube Shorts, TikTok, Naver Blog, Kakao 채널, Email, 디스플레이 배너`
- **문체/스타일**
  - 어조: `친근/전문/권위/유머/긴박/감성/미니멀/설득`
  - 읽기 난이도: `초급/중급/고급`
  - 분량: `짧게/보통/길게` *(플랫폼 길이 가이드 자동 적용)*
  - 포맷 체크: `헤드라인/슬로건/본문/CTA/해시태그/이모지 사용`
  - 브랜드 보이스/금지어/필수어: `자유 입력`
  - 언어/로케일: 기본 `ko-KR`
- **성과 옵션**
  - 목표: `클릭/가입/장바구니/구매/앱설치/문의`
  - CTA 스타일: `직설/혜택강조/한정/FOMO/사회적증거/질문형`
  - A/B 변형 수: `1–5`
- **가드레일**
  - 금지 표현/민감 주제 체크, 플랫폼 정책 준수 모드
- **부가**
  - 해시태그 개수, 이모지 on/off
- **버튼**
  - `생성` / `초기화` / `샘플 불러오기`

### 3.2 결과 영역
- **JSON 뷰어**: 하이라이트·폴딩·복사
- **다운로드(.json)**
- **A/B 탭** 비교
- **플랫폼별 미세조정**(부분 재생성)

---

## 4) 출력 데이터 스키마 (계약)
```json
{
  "meta": {
    "locale": "ko-KR",
    "target": { "gender": "모든 성별", "age_range": "30대", "persona": "프리미엄 지향", "funnel": "전환" },
    "platforms": ["Instagram Reels", "LinkedIn Post"],
    "objective": "구매",
    "tone": "전문",
    "length": "보통",
    "generated_at": "ISO-8601"
  },
  "variants": [
    {
      "id": "A",
      "headline": "프리미엄이 일상을 바꾸는 순간",
      "body": "바쁜 하루에도 디테일을 놓치지 않는 당신에게...",
      "cta": "지금 만나보기",
      "hashtags": ["#프리미엄", "#일상업그레이드"],
      "emojis_used": true,
      "platform_fit": {
        "instagram": { "chars": 130, "policy_notes": [] },
        "linkedin": { "chars": 210, "policy_notes": [] }
      }
    }
  ],
  "guardrails": {
    "blocked_terms": [],
    "policy_warnings": []
  }
}
```

---

## 5) API 설계
### 5.1 엔드포인트
- `POST /api/generate`
  - **요청(body)**: §3.1의 입력 값 기반 JSON
  - **응답(200)**: §4 스키마와 일치하는 객체

### 5.2 서버 로직
- 입력 검증(Zod) → 프롬프트 구성 → OpenAI 호출(Structured/JSON 모드)  
- 플랫폼 길이·형식·금지어 검증 → 후처리  
- 스트리밍 지원 가능

---

## 6) 프롬프트 설계(핵심)
- **System**: 마케팅 카피 전문가 역할, 정책/길이/금지어 준수, JSON 스키마 출력
- **Policy/Brand**: 금지어·필수어·브랜드 톤
- **User**: 가치 제안 + 옵션 요약
- **Output Schema**: §4 구조

---

## 7) 플랫폼/옵션 권장값
- X: 280자 제한, 강한 CTA
- Instagram: 125자 권장, 해시태그 3–8
- LinkedIn: 150–300자 권장
- Email: 제목 35–50자, 프리헤더 40–70자
- 심리 트리거: 한정, FOMO, 사회적 증거, 손실회피 등

---

## 8) 오류/예외 처리
- 400: 검증 실패 → 상세 메시지
- 429: 레이트리밋 → 백오프
- 5xx: 재시도 및 사용자 안내
- 스키마 불일치: 자동 재시도 후 수동 수정 옵션

---

## 9) 비기능 요구사항
- 보안: API 키 서버 보관
- 성능: p95 < 2.5s, 최초 토큰 < 500ms
- 가용성: 재시도·백오프
- 관측성: 프롬프트/토큰/비용/에러 지표
- 접근성: 레이블/키보드 내비게이션

---

## 10) 폴더 구조 제안
```
/app
  /page.tsx
  /api/generate/route.ts
  /components
    ValuePropForm.tsx
    OptionsPanel.tsx
    JsonViewer.tsx
  /lib
    schema.ts
    platformRules.ts
    prompt.ts
```

---

## 11) 수용 기준
- 필수 입력/옵션 검증
- 생성 후 JSON 출력
- A/B 변형 생성
- 길이 초과 시 경고/자동 축약
- 금지어 경고 + 대체안

---

## 12) 샘플 요청/응답
**요청**
```json
{
  "valueProp": "출퇴근 시간을 절약하는 초경량 무선 이어폰",
  "targeting": { "gender": "모든 성별", "ageRange": "30대", "persona": "얼리어답터", "funnelStage": "전환" },
  "platforms": ["Instagram Reels", "LinkedIn Post"],
  "style": { "tone": "전문", "length": "보통", "readingLevel": "중급", "emoji": true, "hashtags": 5 },
  "objective": "구매",
  "constraints": { "mustInclude": ["배터리", "노이즈캔슬링"], "mustExclude": ["공짜"] },
  "abVariants": 2,
  "locale": "ko-KR"
}
```
**응답**: §4와 동일 구조
