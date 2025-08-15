'use client';

import React, { useState } from 'react';
import ValuePropForm, { ValuePropFormData } from './components/ValuePropForm';
import OptionsPanel, { OptionsPanelValue } from './components/OptionsPanel';
import JsonViewer from './components/JsonViewer';

const DEFAULT_OPTIONS: OptionsPanelValue = {
  targeting: { gender: '모든 성별', ageRange: '30대', persona: '프리미엄', funnelStage: '전환' },
  style: { tone: '전문', length: '보통', readingLevel: '중급', emoji: true, hashtags: 3 },
  objective: '구매',
  ctaStyle: '직설',
  constraints: { mustInclude: '', mustExclude: '' },
};

export default function HomePage() {
  const [form, setForm] = useState<ValuePropFormData | null>(null);
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const handleFormSubmit = (data: ValuePropFormData) => {
    setForm(data);
    setResult(null);
    setError(null);
    setActiveTab(0);
    fetchResult(data, options);
  };

  const fetchResult = async (form: ValuePropFormData, opts: OptionsPanelValue) => {
    setLoading(true);
    setError(null);
    try {
      const body = {
        valueProp: form.valueProp,
        platforms: form.platforms,
        abVariants: form.abVariants,
        targeting: opts.targeting,
        style: opts.style,
        objective: opts.objective,
        constraints: {
          mustInclude: opts.constraints.mustInclude.split(',').map(s => s.trim()).filter(Boolean),
          mustExclude: opts.constraints.mustExclude.split(',').map(s => s.trim()).filter(Boolean),
        },
        locale: 'ko-KR',
      };
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err);
        setLoading(false);
        return;
      }
      const json = await res.json();
      setResult(json);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-4 flex flex-col gap-8">
      {loading && (
        <div className="fixed top-0 left-0 w-full bg-blue-50 text-blue-700 text-center py-2 z-50 shadow">
          <span className="inline-block align-middle mr-2 animate-spin border-2 border-blue-400 border-t-transparent rounded-full w-4 h-4"></span>
          생성 중... 잠시만 기다려주세요.
        </div>
      )}
      <ValuePropForm onSubmit={handleFormSubmit} disabled={loading} />
      <OptionsPanel value={options} onChange={setOptions} />
      {error && (
        <div className="text-red-500 whitespace-pre-wrap">
          {typeof error === 'string' ? error : (
            <>
              {error.error && <div>{error.error}</div>}
              {error.details && <div><b>details:</b> {typeof error.details === 'string' ? error.details : JSON.stringify(error.details, null, 2)}</div>}
              {error.raw && <div><b>raw:</b> {typeof error.raw === 'string' ? error.raw : JSON.stringify(error.raw, null, 2)}</div>}
            </>
          )}
        </div>
      )}
      {result && result.variants && (
        <JsonViewer
          data={result.variants[activeTab]}
          abCount={result.variants.length}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      )}
      <div className="mt-8 text-gray-400 text-sm">OpenAI API 키는 서버 환경변수로 안전하게 관리됩니다.</div>
    </main>
  );
}
