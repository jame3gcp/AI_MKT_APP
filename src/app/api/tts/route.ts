import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response('API 키 없음', { status: 500 });
    }
    const { text } = await req.json();
    if (!text) {
      return new Response('text 필드 필요', { status: 400 });
    }
    const { OpenAI } = await import('openai');
    const openai = new OpenAI({ apiKey });
    const audio = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'nova',
      input: text,
      response_format: 'mp3',
    });
    const buffer = Buffer.from(await audio.arrayBuffer());
    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'inline; filename="speech.mp3"',
      },
    });
  } catch (e: any) {
    return new Response('TTS 변환 오류: ' + (e.message || e.toString()), { status: 500 });
  }
}
