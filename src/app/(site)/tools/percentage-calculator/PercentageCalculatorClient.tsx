// 🆕 नई फ़ाइल — इसे इसी पाथ पर बनाएं: src/app/(site)/tools/percentage-calculator/PercentageCalculatorClient.tsx
'use client'

import { useState } from 'react'

export default function PercentageCalculatorClient() {
  const [mode, setMode] = useState<'marks' | 'cgpa'>('marks')

  // Marks Mode
  const [obtained, setObtained] = useState('')
  const [total, setTotal] = useState('')

  // CGPA Mode
  const [cgpa, setCgpa] = useState('')
  const [multiplier, setMultiplier] = useState('9.5')

  const marksPercentage =
    obtained && total && Number(total) > 0 ? ((Number(obtained) / Number(total)) * 100).toFixed(2) : null

  const cgpaPercentage = cgpa ? (Number(cgpa) * Number(multiplier || '9.5')).toFixed(2) : null

  return (
    <div className="bg-white border border-blue-100 rounded-lg p-4 space-y-5">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode('marks')}
          className={`text-sm font-semibold px-4 py-2 rounded-full border transition ${
            mode === 'marks'
              ? 'bg-brand-blue text-white border-brand-blue'
              : 'bg-slate-50 text-slate-700 border-slate-200'
          }`}
        >
          Marks से %
        </button>
        <button
          type="button"
          onClick={() => setMode('cgpa')}
          className={`text-sm font-semibold px-4 py-2 rounded-full border transition ${
            mode === 'cgpa'
              ? 'bg-brand-blue text-white border-brand-blue'
              : 'bg-slate-50 text-slate-700 border-slate-200'
          }`}
        >
          CGPA से %
        </button>
      </div>

      {mode === 'marks' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="text-sm text-slate-700">
            प्राप्त अंक (Obtained Marks)
            <input
              type="number"
              value={obtained}
              onChange={(e) => setObtained(e.target.value)}
              className="mt-1 w-full border border-slate-200 rounded px-3 py-2 text-sm"
              placeholder="जैसे 450"
            />
          </label>
          <label className="text-sm text-slate-700">
            कुल अंक (Total Marks)
            <input
              type="number"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              className="mt-1 w-full border border-slate-200 rounded px-3 py-2 text-sm"
              placeholder="जैसे 500"
            />
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="text-sm text-slate-700">
            CGPA
            <input
              type="number"
              step="0.01"
              value={cgpa}
              onChange={(e) => setCgpa(e.target.value)}
              className="mt-1 w-full border border-slate-200 rounded px-3 py-2 text-sm"
              placeholder="जैसे 8.4"
            />
          </label>
          <label className="text-sm text-slate-700">
            Multiplier (आमतौर पर 9.5)
            <input
              type="number"
              step="0.1"
              value={multiplier}
              onChange={(e) => setMultiplier(e.target.value)}
              className="mt-1 w-full border border-slate-200 rounded px-3 py-2 text-sm"
            />
          </label>
        </div>
      )}

      {mode === 'marks' && marksPercentage && (
        <div className="bg-brand-blueLight border border-blue-100 rounded-lg p-4 text-center">
          <p className="text-sm text-slate-600 mb-1">आपका Percentage है:</p>
          <p className="text-2xl font-bold text-brand-blueDark">{marksPercentage}%</p>
        </div>
      )}

      {mode === 'cgpa' && cgpaPercentage && (
        <div className="bg-brand-blueLight border border-blue-100 rounded-lg p-4 text-center">
          <p className="text-sm text-slate-600 mb-1">आपका अनुमानित Percentage है:</p>
          <p className="text-2xl font-bold text-brand-blueDark">{cgpaPercentage}%</p>
          <p className="text-xs text-slate-500 mt-1">
            (Board के हिसाब से Multiplier अलग हो सकता है - अपने Board की Official Conversion Formula
            से एक बार ज़रूर मिला लें)
          </p>
        </div>
      )}
    </div>
  )
}
