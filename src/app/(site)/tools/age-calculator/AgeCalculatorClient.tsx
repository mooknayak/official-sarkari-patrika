// 🆕 नई फ़ाइल — इसे इसी पाथ पर बनाएं: src/app/(site)/tools/age-calculator/AgeCalculatorClient.tsx
'use client'

import { useState } from 'react'

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export default function AgeCalculatorClient() {
  const [dob, setDob] = useState('')
  const [asOn, setAsOn] = useState(todayStr())
  const [result, setResult] = useState<{ years: number; months: number; days: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  function calculate() {
    setError(null)
    setResult(null)
    if (!dob) {
      setError('कृपया जन्म तारीख डालिए।')
      return
    }
    const birth = new Date(dob)
    const cutoff = new Date(asOn)
    if (birth > cutoff) {
      setError('जन्म तारीख, Cut-off Date से बाद की नहीं हो सकती।')
      return
    }

    let years = cutoff.getFullYear() - birth.getFullYear()
    let months = cutoff.getMonth() - birth.getMonth()
    let days = cutoff.getDate() - birth.getDate()

    if (days < 0) {
      months -= 1
      const prevMonth = new Date(cutoff.getFullYear(), cutoff.getMonth(), 0)
      days += prevMonth.getDate()
    }
    if (months < 0) {
      years -= 1
      months += 12
    }

    setResult({ years, months, days })
  }

  return (
    <div className="bg-white border border-blue-100 rounded-lg p-4 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="text-sm text-slate-700">
          जन्म तारीख (Date of Birth)
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="mt-1 w-full border border-slate-200 rounded px-3 py-2 text-sm"
          />
        </label>
        <label className="text-sm text-slate-700">
          किस तारीख तक उम्र निकालनी है (Cut-off Date)
          <input
            type="date"
            value={asOn}
            onChange={(e) => setAsOn(e.target.value)}
            className="mt-1 w-full border border-slate-200 rounded px-3 py-2 text-sm"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={calculate}
        className="bg-brand-blue text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-brand-blueDark"
      >
        उम्र निकालिए
      </button>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {result && (
        <div className="bg-brand-blueLight border border-blue-100 rounded-lg p-4 text-center">
          <p className="text-sm text-slate-600 mb-1">
            {asOn} तक आपकी उम्र होगी:
          </p>
          <p className="text-2xl font-bold text-brand-blueDark">
            {result.years} वर्ष {result.months} महीना {result.days} दिन
          </p>
        </div>
      )}
    </div>
  )
}
