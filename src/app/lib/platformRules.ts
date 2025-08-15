// 플랫폼별 길이 가이드, 금지어, 정책 위반 검증 유틸리티

export const PLATFORM_RULES = {
  X: { maxChars: 280 },
  Instagram: { maxChars: 125, hashtagMin: 3, hashtagMax: 8 },
  LinkedIn: { minChars: 150, maxChars: 300 },
  Email: { subjectMin: 35, subjectMax: 50, preheaderMin: 40, preheaderMax: 70 },
  // ... 기타 플랫폼 추가
};

export function checkLength(platform: string, text: string): { valid: boolean; warning?: string } {
  // 플랫폼별 길이 가이드에 따라 텍스트 길이 검증
  // 실제 구현은 상세 요구에 따라 추가
  return { valid: true };
}

export function checkForbiddenWords(text: string, forbiddenWords: string[]): { blocked: string[] } {
  // 금지어 포함 여부 검증
  const blocked = forbiddenWords.filter(word => text.includes(word));
  return { blocked };
}

export function checkPolicy(text: string, platform: string): { warnings: string[] } {
  // 플랫폼별 정책 위반 검증 (예시)
  // 실제 구현은 정책 DB/리스트에 따라 추가
  return { warnings: [] };
}
