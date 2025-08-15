import { InputType } from './schema';

// 시스템 프롬프트 템플릿
const SYSTEM_PROMPT = `당신은 마케팅 카피 전문가입니다. 정책, 길이, 금지어를 반드시 준수하며, 반드시 JSON 스키마로만 출력하세요.`;

// 정책/브랜드 프롬프트 템플릿
function getPolicyPrompt(constraints?: InputType['constraints']) {
  let prompt = '';
  if (constraints?.mustInclude?.length) {
    prompt += `반드시 포함할 단어: ${constraints.mustInclude.join(', ')}.\n`;
  }
  if (constraints?.mustExclude?.length) {
    prompt += `금지어: ${constraints.mustExclude.join(', ')}.\n`;
  }
  return prompt;
}

// 옵션 요약을 자연어로 풀어서 명확히 기술
function getOptionsSummary(input: InputType) {
  const t = input.targeting;
  const s = input.style;
  return [
    `타겟: ${t.ageRange} ${t.gender}, 퍼소나: ${t.persona}, 구매여정: ${t.funnelStage}`,
    `플랫폼: ${input.platforms.join(', ')}`,
    `어조: ${s.tone}, 분량: ${s.length}, 읽기 난이도: ${s.readingLevel}, 이모지: ${s.emoji ? '사용' : '미사용'}, 해시태그: ${s.hashtags ?? '기본값'}`,
    `성과 목표: ${input.objective}, CTA 스타일: ${input.objective}`
  ].join('\n');
}

// 유저 프롬프트 템플릿
function getUserPrompt(input: InputType) {
  return [
    `가치 제안: ${input.valueProp}`,
    getOptionsSummary(input),
    `아래 조건을 반드시 반영하여 작성하세요. 조건이 하나라도 누락되면 안 됩니다.`
  ].join('\n');
}

// 출력 스키마 안내 + 예시 JSON
const OUTPUT_SCHEMA_PROMPT = `
아래 예시와 완전히 동일한 JSON 구조로, 모든 필드를 반드시 채워서 반환하세요.\n반드시 JSON만 반환하세요.\n예시:\n{
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
반드시 위 구조와 동일하게, 입력값에 맞는 데이터를 채워서 JSON만 반환하세요.\nJSON 이외의 텍스트, 설명, 주석, 마크다운, 따옴표 등은 절대 포함하지 마세요.`;

// 최종 프롬프트 생성 함수
export function buildPrompt(input: InputType): string {
  return [
    SYSTEM_PROMPT,
    getPolicyPrompt(input.constraints),
    getUserPrompt(input),
    OUTPUT_SCHEMA_PROMPT,
  ].join('\n---\n');
}
