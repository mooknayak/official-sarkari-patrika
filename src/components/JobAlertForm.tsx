'use client'

import { useState } from 'react'

export default function JobAlertForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('success')
        setMessage(data.message)
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.message || 'कुछ गड़बड़ हो गई।')
      }
    } catch {
      setStatus('error')
      setMessage('नेटवर्क में समस्या आई, कृपया फिर से कोशिश करें।')
    }
  }

  return (
    <div className="bg-gradient-to-r from-brand-blue to-brand-blueDark rounded-lg p-5 text-white">
      <h2 className="font-bold text-lg mb-1">🔔 Job Alert पाएँ</h2>
      <p className="text-sm text-blue-100 mb-4">
        अपना ईमेल डालें और नई सरकारी नौकरी, प्रवेश पत्र व परिणाम की जानकारी सबसे पहले पाएँ।
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="अपना ईमेल डालें"
          className="flex-1 rounded-md px-3 py-2 text-sm text-slate-900 outline-none"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-brand-pinkAccent text-white text-sm font-semibold px-5 py-2 rounded-md hover:bg-pink-600 transition disabled:opacity-60 whitespace-nowrap"
        >
          {status === 'loading' ? 'भेज रहे हैं...' : 'Subscribe करें'}
        </button>
      </form>
      {message && (
        <p className={`text-xs mt-2 ${status === 'success' ? 'text-green-200' : 'text-red-200'}`}>
          {message}
        </p>
      )}
    </div>
  )
}
