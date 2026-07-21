'use client'

import { useState } from 'react'

type AIFaqAssistantProps = {
  postTitle?: string
  postContext?: string
  heading?: string
  placeholder?: string
  suggestions?: string[]
}

export default function AIFaqAssistant({
  postTitle,
  postContext,
  heading = '🤖 AI से इस पोस्ट के बारे में पूछें',
  placeholder = 'अपना सवाल यहाँ लिखें...',
  suggestions = ['आवेदन कैसे करें?', 'योग्यता क्या है?', 'अंतिम तिथि क्या है?'],
}: AIFaqAssistantProps) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const suggestedQuestions = suggestions

  const askQuestion = async (q: string) => {
    if (!q.trim()) return
    setStatus('loading')
    setAnswer('')
    setErrorMsg('')
    try {
      const res = await fetch('/api/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, postTitle, postContext }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.message || 'जवाब नहीं मिल पाया।')
        setStatus('error')
        return
      }
      setAnswer(data.answer)
      setStatus('idle')
    } catch {
      setErrorMsg('नेटवर्क में समस्या आई।')
      setStatus('error')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    askQuestion(question)
  }

  return (
    <section className="my-6 border border-blue-200 rounded-lg overflow-hidden">
      <h2 className="bg-brand-blue text-white px-4 py-2 font-semibold flex items-center gap-1.5">
        {heading}
      </h2>
      <div className="p-4">
        <div className="flex flex-wrap gap-2 mb-3">
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              onClick={() => {
                setQuestion(q)
                askQuestion(q)
              }}
              className="text-xs border border-brand-blue text-brand-blue px-3 py-1.5 rounded-full hover:bg-brand-blueLight transition"
            >
              {q}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={placeholder}
            className="flex-1 border border-slate-300 rounded-md px-3 py-2 text-sm outline-none"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-brand-pinkAccent text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-pink-600 transition disabled:opacity-60 whitespace-nowrap"
          >
            {status === 'loading' ? '...' : 'पूछें'}
          </button>
        </form>

        {status === 'loading' && (
          <p className="text-xs text-slate-400 mt-3">AI जवाब सोच रहा है...</p>
        )}

        {answer && (
          <div className="mt-3 bg-brand-blueLight border border-blue-200 rounded-md p-3 text-sm text-slate-700 leading-relaxed">
            {answer}
          </div>
        )}

        {status === 'error' && (
          <p className="text-xs text-red-500 mt-3">⚠️ {errorMsg}</p>
        )}

        <p className="text-[11px] text-slate-400 mt-3">
          ⚠️ यह AI जवाब सिर्फ सहायता के लिए है, आवेदन से पहले आधिकारिक अधिसूचना अवश्य जाँच लें।
        </p>
      </div>
    </section>
  )
}
