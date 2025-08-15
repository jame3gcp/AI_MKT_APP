import React, { useRef, useState } from 'react';

export type JsonViewerProps = {
  data: any;
  abCount: number;
  activeTab: number;
  onTabChange: (idx: number) => void;
};

export default function JsonViewer({ data, abCount, activeTab, onTabChange }: JsonViewerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioLoading, setAudioLoading] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  };
  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'marketing-copy.json';
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleSpeak = async () => {
    if (!data.body) return;
    setAudioLoading(true);
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: data.body }),
      });
      if (!res.ok) throw new Error('TTS 변환 실패');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
      }
    } catch (e: any) {
      alert(e.message || '음성 변환 오류');
    } finally {
      setAudioLoading(false);
    }
  };
  const isEmpty =
    !data?.headline && !data?.body && !data?.cta &&
    (!Array.isArray(data?.hashtags) || data.hashtags.length === 0);
  return (
    <section className="flex flex-col gap-2 p-6 border rounded bg-white shadow-sm">
      <div className="flex gap-2 mb-2 items-center">
        {[...Array(abCount)].map((_, i) => (
          <button
            key={i}
            className={`px-3 py-1 rounded text-xs font-semibold border ${activeTab === i ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => onTabChange(i)}
          >
            {String.fromCharCode(65 + i)}
          </button>
        ))}
        <div className="flex-1" />
        <button onClick={handleCopy} className="text-xs px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200">복사</button>
        <button onClick={handleDownload} className="text-xs px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200">다운로드</button>
        <button
          onClick={handleSpeak}
          className="text-xs px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200 flex items-center"
          disabled={audioLoading || !data.body}
          title="본문 음성 듣기"
        >
          {audioLoading ? (
            <span className="w-4 h-4 animate-spin border-2 border-blue-400 border-t-transparent rounded-full inline-block" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9v6h4l5 5V4l-5 5H9z" />
            </svg>
          )}
        </button>
        <audio ref={audioRef} hidden />
      </div>
      {isEmpty ? (
        <div className="text-gray-400 text-center py-8">생성된 결과가 없습니다.</div>
      ) : (
        <ul className="text-sm leading-6 space-y-2">
          <li><b>헤드라인:</b> {data.headline || <span className="text-gray-400">내용 없음</span>}</li>
          <li><b>본문:</b> {data.body || <span className="text-gray-400">내용 없음</span>}</li>
          <li><b>행동유도(CTA):</b> {data.cta || <span className="text-gray-400">내용 없음</span>}</li>
          <li><b>해시태그:</b> {Array.isArray(data.hashtags) && data.hashtags.length > 0 ? data.hashtags.join(' ') : <span className="text-gray-400">내용 없음</span>}</li>
          <li><b>이모지 사용:</b> {data.emojis_used ? 'O' : 'X'}</li>
          {data.platform_fit && (
            <li>
              <b>플랫폼별 길이/정책:</b>
              <ul className="ml-4 list-disc">
                {Object.entries(data.platform_fit).map(([platform, fit]: any) => (
                  <li key={platform}>
                    <b>{platform}:</b> {fit.chars}자
                    {fit.policy_notes && fit.policy_notes.length > 0 && (
                      <span> (정책: {fit.policy_notes.join(', ')})</span>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          )}
        </ul>
      )}
    </section>
  );
}
