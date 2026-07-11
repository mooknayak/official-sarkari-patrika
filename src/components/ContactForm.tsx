'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Contact Form - ${name}`)
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)
    window.location.href = `mailto:officialsarkaripatrika@gmail.com?subject=${subject}&body=${body}`
  }

  return (
    <form onSubmit={handleSubmit} className="not-prose flex flex-col gap-4 max-w-md mt-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
        <textarea
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
        />
      </div>
      <button
        type="submit"
        className="bg-brand-blue text-white rounded-md px-4 py-2 text-sm font-semibold hover:bg-brand-pinkAccent transition w-fit"
      >
        Send Message
      </button>
    </form>
  )
}
