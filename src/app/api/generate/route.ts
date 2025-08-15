import { NextRequest, NextResponse } from 'next/server';
import { InputSchema, OutputType } from '@/app/lib/schema';
import { buildPrompt } from '@/app/lib/prompt';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: '서버 환경에 OpenAI API 키가 설정되어 있지 않습니다.' }, { status: 500 });
    }
    const body = await req.json();
    const parsed = InputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: '입력값 검증 실패', details: parsed.error.errors }, { status: 400 });
    }
    const input = parsed.data;
    const prompt = buildPrompt(input);

    // OpenAI API 호출
    const { OpenAI } = await import('openai');
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: '마케팅 카피 전문가로서 아래 프롬프트를 참고해 JSON만 반환하세요.' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 1024,
    });
    // 결과 파싱
    let result: OutputType | null = null;
    try {
      result = JSON.parse(completion.choices[0].message.content || '');
    } catch (e) {
      return NextResponse.json({ error: 'OpenAI 응답 파싱 오류', details: e.message, raw: completion.choices[0].message.content }, { status: 502 });
    }
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: '서버 오류', details: JSON.stringify(e, Object.getOwnPropertyNames(e)) }, { status: 500 });
  }
}
