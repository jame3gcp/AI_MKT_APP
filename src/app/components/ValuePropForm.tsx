import React, { useState, useEffect } from 'react';

export type ValuePropFormData = {
  valueProp: string;
  platforms: string[];
  abVariants: number;
};

type ValuePropFormProps = {
  onSubmit: (data: ValuePropFormData) => void;
  disabled?: boolean;
};

const PLATFORM_OPTIONS = [
  'Instagram Feed', 'Instagram Reels', 'Facebook Feed', 'X', 'LinkedIn Post', 'LinkedIn Ad',
  'YouTube Shorts', 'TikTok', 'Naver Blog', 'Kakao 채널', 'Email', '디스플레이 배너',
];

const SAMPLE_VALUE_PROPS = [
  '출퇴근 시간을 절약하는 초경량 무선 이어폰',
  '친환경 소재로 만든 프리미엄 텀블러',
  'AI로 맞춤 추천하는 스마트 쇼핑 플랫폼',
  '한 번의 클릭으로 예약 가능한 뷰티 서비스',
  '초고속 충전이 가능한 휴대용 배터리',
  '건강을 생각한 저칼로리 간편식',
  '실시간 번역이 가능한 스마트 통역기',
  '원터치로 제어하는 스마트 홈 조명',
  '프리미엄 원두로 내린 캡슐 커피',
  '반려동물을 위한 맞춤형 영양제',
  'AI 기반 이력서 자동 작성 서비스',
  '1분 만에 완성하는 온라인 명함 제작',
  '스마트폰으로 제어하는 무인 택배함',
  '여행자를 위한 실시간 환율 알림 앱',
  'B2B SaaS: 자동화된 회계 관리 솔루션',
  '디지털 노마드를 위한 글로벌 보험 서비스',
  '감성 사진을 위한 필름 카메라 앱',
  '친구와 함께하는 실시간 언어 교환 플랫폼',
  '프리랜서를 위한 계약/세금 자동화 서비스',
  'AI로 분석하는 맞춤형 피부 진단',
  '중고차 실매물 비교/견적 플랫폼',
  '반려동물 산책 대행 매칭 서비스',
  '스마트팜 IoT 원격 관리 시스템',
  '온라인 클래스 실시간 피드백 서비스',
  'MZ세대를 위한 감성 다이어리 앱',
  '기업용 ESG 경영 데이터 분석 솔루션',
  'AI 기반 실시간 주식/코인 알림 서비스',
  '노인 돌봄 로봇/헬스케어 서비스',
  '스마트워치 연동 건강관리 앱',
  '친환경 배송 패키징 구독 서비스',
];

export default function ValuePropForm({ onSubmit, disabled }: ValuePropFormProps) {
  const [valueProp, setValueProp] = useState('');
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [abVariants, setAbVariants] = useState(1);

  useEffect(() => {
    // 페이지 마운트 시마다 랜덤 샘플 문구 자동 입력
    const random = SAMPLE_VALUE_PROPS[Math.floor(Math.random() * SAMPLE_VALUE_PROPS.length)];
    setValueProp(random);
  }, []);

  const handlePlatformChange = (platform: string) => {
    setPlatforms(prev => prev.includes(platform)
      ? prev.filter(p => p !== platform)
      : [...prev, platform]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (valueProp.length < 10 || platforms.length === 0) return;
    onSubmit({ valueProp, platforms, abVariants });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-6 border rounded bg-white shadow-sm">
      <div>
        <label className="block text-sm font-medium mb-1">가치 제안 <span className="text-red-500">*</span></label>
        <textarea
          className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring min-h-[60px]"
          value={valueProp}
          onChange={e => setValueProp(e.target.value)}
          minLength={10}
          maxLength={300}
          required
          placeholder="최소 10자, 300자 이내로 입력하세요"
          disabled={disabled}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">플랫폼 <span className="text-red-500">*</span></label>
        <div className="flex flex-wrap gap-2">
          {PLATFORM_OPTIONS.map(option => (
            <label key={option} className="flex items-center gap-1 text-xs border rounded px-2 py-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={platforms.includes(option)}
                onChange={() => handlePlatformChange(option)}
                className="accent-blue-500"
                disabled={disabled}
              />
              {option}
            </label>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">A/B 변형 수 <span className="text-red-500">*</span></label>
        <input
          type="number"
          min={1}
          max={5}
          value={abVariants}
          onChange={e => setAbVariants(Number(e.target.value))}
          className="w-20 border rounded px-2 py-1 text-sm"
          required
          disabled={disabled}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white rounded px-4 py-2 font-semibold disabled:bg-gray-300"
        disabled={disabled || valueProp.length < 10 || platforms.length === 0}
      >
        {disabled ? '생성 중...' : '생성 요청'}
      </button>
    </form>
  );
}
