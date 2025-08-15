import { z } from 'zod';

// 입력 폼 데이터 타입
export const TargetingSchema = z.object({
  gender: z.string(),
  ageRange: z.string(),
  persona: z.string(),
  funnelStage: z.string(),
});

export const StyleSchema = z.object({
  tone: z.string(),
  length: z.string(),
  readingLevel: z.string(),
  emoji: z.boolean().optional(),
  hashtags: z.number().optional(),
});

export const ConstraintsSchema = z.object({
  mustInclude: z.array(z.string()).optional(),
  mustExclude: z.array(z.string()).optional(),
});

export const InputSchema = z.object({
  valueProp: z.string().min(10),
  targeting: TargetingSchema,
  platforms: z.array(z.string()).min(1),
  style: StyleSchema,
  objective: z.string(),
  constraints: ConstraintsSchema.optional(),
  abVariants: z.number().min(1).max(5),
  locale: z.string().default('ko-KR'),
});

export type InputType = z.infer<typeof InputSchema>;

// 출력 JSON 스키마 타입
export const OutputSchema = z.object({
  meta: z.object({
    locale: z.string(),
    target: z.object({
      gender: z.string(),
      age_range: z.string(),
      persona: z.string(),
      funnel: z.string(),
    }),
    platforms: z.array(z.string()),
    objective: z.string(),
    tone: z.string(),
    length: z.string(),
    generated_at: z.string(),
  }),
  variants: z.array(z.object({
    id: z.string(),
    headline: z.string(),
    body: z.string(),
    cta: z.string(),
    hashtags: z.array(z.string()),
    emojis_used: z.boolean(),
    platform_fit: z.record(z.string(), z.object({
      chars: z.number(),
      policy_notes: z.array(z.string()),
    })),
  })),
  guardrails: z.object({
    blocked_terms: z.array(z.string()),
    policy_warnings: z.array(z.string()),
  }),
});

export type OutputType = z.infer<typeof OutputSchema>;
