import React from 'react';

export type OptionsPanelValue = {
  targeting: {
    gender: string;
    ageRange: string;
    persona: string;
    funnelStage: string;
  };
  style: {
    tone: string;
    length: string;
    readingLevel: string;
    emoji: boolean;
    hashtags: number;
  };
  objective: string;
  ctaStyle: string;
  constraints: {
    mustInclude: string;
    mustExclude: string;
  };
};

type OptionsPanelProps = {
  value: OptionsPanelValue;
  onChange: (value: OptionsPanelValue) => void;
};

const GENDER = ['남성', '여성', '모든 성별', '비지정'];
const AGE = ['10대', '20대 초', '20대 후', '30대', '40대', '50대+'];
const PERSONA = ['가성비', '프리미엄', '에코', '얼리어답터', '보수적', '충성', '잠재'];
const FUNNEL = ['인지', '흥미', '고려', '전환', '리텐션', '리퍼럴'];
const TONE = ['친근', '전문', '권위', '유머', '긴박', '감성', '미니멀', '설득'];
const LENGTH = ['짧게', '보통', '길게'];
const READING = ['초급', '중급', '고급'];
const OBJECTIVE = ['클릭', '가입', '장바구니', '구매', '앱설치', '문의'];
const CTA_STYLE = ['직설', '혜택강조', '한정', 'FOMO', '사회적증거', '질문형'];

export default function OptionsPanel({ value, onChange }: OptionsPanelProps) {
  const handleChange = (field: string, subfield: string, v: any) => {
    if (field === 'targeting' || field === 'style' || field === 'constraints') {
      onChange({
        ...value,
        [field]: {
          ...value[field as keyof typeof value],
          [subfield]: v,
        },
      });
    } else {
      onChange({ ...value, [field]: v });
    }
  };

  return (
    <section className="flex flex-col gap-6 p-6 border rounded bg-white shadow-sm">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium mb-1">성별</label>
          <select className="w-full border rounded px-2 py-1 text-xs" value={value.targeting.gender} onChange={e => handleChange('targeting', 'gender', e.target.value)}>
            {GENDER.map(opt => <option key={opt}>{opt}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">연령대</label>
          <select className="w-full border rounded px-2 py-1 text-xs" value={value.targeting.ageRange} onChange={e => handleChange('targeting', 'ageRange', e.target.value)}>
            {AGE.map(opt => <option key={opt}>{opt}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">퍼소나</label>
          <select className="w-full border rounded px-2 py-1 text-xs" value={value.targeting.persona} onChange={e => handleChange('targeting', 'persona', e.target.value)}>
            {PERSONA.map(opt => <option key={opt}>{opt}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">구매여정</label>
          <select className="w-full border rounded px-2 py-1 text-xs" value={value.targeting.funnelStage} onChange={e => handleChange('targeting', 'funnelStage', e.target.value)}>
            {FUNNEL.map(opt => <option key={opt}>{opt}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium mb-1">어조</label>
          <select className="w-full border rounded px-2 py-1 text-xs" value={value.style.tone} onChange={e => handleChange('style', 'tone', e.target.value)}>
            {TONE.map(opt => <option key={opt}>{opt}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">분량</label>
          <select className="w-full border rounded px-2 py-1 text-xs" value={value.style.length} onChange={e => handleChange('style', 'length', e.target.value)}>
            {LENGTH.map(opt => <option key={opt}>{opt}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">읽기 난이도</label>
          <select className="w-full border rounded px-2 py-1 text-xs" value={value.style.readingLevel} onChange={e => handleChange('style', 'readingLevel', e.target.value)}>
            {READING.map(opt => <option key={opt}>{opt}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2 mt-5">
          <input type="checkbox" checked={value.style.emoji} onChange={e => handleChange('style', 'emoji', e.target.checked)} className="accent-blue-500" id="emoji" />
          <label htmlFor="emoji" className="text-xs">이모지 사용</label>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">해시태그 개수</label>
          <input type="number" min={0} max={10} value={value.style.hashtags} onChange={e => handleChange('style', 'hashtags', Number(e.target.value))} className="w-16 border rounded px-2 py-1 text-xs" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium mb-1">성과 목표</label>
          <select className="w-full border rounded px-2 py-1 text-xs" value={value.objective} onChange={e => handleChange('objective', '', e.target.value)}>
            {OBJECTIVE.map(opt => <option key={opt}>{opt}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">행동유도(CTA) 스타일</label>
          <select className="w-full border rounded px-2 py-1 text-xs" value={value.ctaStyle} onChange={e => handleChange('ctaStyle', '', e.target.value)}>
            {CTA_STYLE.map(opt => <option key={opt}>{opt}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium mb-1">필수 포함어(쉼표로 구분)</label>
          <input type="text" className="w-full border rounded px-2 py-1 text-xs" value={value.constraints.mustInclude} onChange={e => handleChange('constraints', 'mustInclude', e.target.value)} placeholder="예: 배터리,노이즈캔슬링" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">금지어(쉼표로 구분)</label>
          <input type="text" className="w-full border rounded px-2 py-1 text-xs" value={value.constraints.mustExclude} onChange={e => handleChange('constraints', 'mustExclude', e.target.value)} placeholder="예: 공짜,무료" />
        </div>
      </div>
    </section>
  );
}
