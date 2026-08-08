// ✏️ एडिट फ़ाइल — अब यह Firebase Firestore नहीं, बल्कि Sanity (हमारे /api/comments
// रूट के ज़रिए) इस्तेमाल करता है। पूरी Real-time जैसी Firestore listener की जगह
// यह हर 8 सेकंड में हल्के से नए Comments चेक करता रहता है — बिना किसी Extra
// Service के, Sanity के अंदर ही सब कुछ रहता है।

'use client'

import { useEffect, useRef, useState } from 'react'

type CommentDoc = {
  _id: string
  name?: string
  message: string
  createdAt?: string
  reply?: { message: string; repliedAt?: string } | null
}

function formatTime(iso?: string) {
  if (!iso) return ''
  return new Date(iso).toLocaleString('hi-IN', { dateStyle: 'medium', timeStyle: 'short' })
}

export default function CommentsSection({
  postSlug,
  postTitle,
}: {
  postSlug: string
  postTitle: string
}) {
  const [comments, setComments] = useState<CommentDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [loadError, setLoadError] = useState('')
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchComments = async (showLoading = false) => {
    if (showLoading) setLoading(true)
    try {
      const res = await fetch(`/api/comments?slug=${encodeURIComponent(postSlug)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Comments लोड नहीं हो पाए')
      setComments(data.comments || [])
      setLoadError('')
    } catch (err) {
      setLoadError((err as Error).message || 'Comments लोड नहीं हो पाए')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments(true)
    // हर 8 सेकंड में नए Comments/जवाब खुद-ब-खुद चेक होते रहेंगे
    pollRef.current = setInterval(() => fetchComments(false), 8000)
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postSlug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postSlug, postTitle, name, message }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Comment भेजने में समस्या हुई')
      setMessage('')
      fetchComments(false)
    } catch (err) {
      setError((err as Error).message || 'Comment भेजने में समस्या हुई')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mt-10 border-t border-blue-100 pt-6">
      <h2 className="text-lg font-bold text-brand-blueDark mb-4">
        💬 Comments {comments.length > 0 && `(${comments.length})`}
      </h2>

      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="आपका नाम (वैकल्पिक)"
          className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
          maxLength={60}
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="अपना सवाल या टिप्पणी लिखें..."
          className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm min-h-[80px]"
          maxLength={1000}
          required
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="bg-brand-blue text-white text-sm font-semibold px-5 py-2 rounded-md hover:bg-brand-blueDark transition disabled:opacity-60"
        >
          {submitting ? 'भेजा जा रहा है...' : 'Comment करें'}
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-slate-400">Comments लोड हो रहे हैं...</p>
      ) : loadError ? (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-3">
          <p className="font-semibold">⚠️ Comments लोड नहीं हो पाए</p>
          <p className="text-xs mt-1 break-words">{loadError}</p>
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-slate-400">अभी तक कोई Comment नहीं है - सबसे पहले आप करें!</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((c) => (
            <li key={c._id} className="border border-slate-100 rounded-lg p-3 bg-slate-50">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-sm text-brand-blueDark">{c.name || 'अज्ञात'}</span>
                <span className="text-[11px] text-slate-400">{formatTime(c.createdAt)}</span>
              </div>
              <p className="text-sm text-slate-700 mt-1 whitespace-pre-wrap break-words">{c.message}</p>

              {c.reply?.message && (
                <div className="mt-2 ml-3 pl-3 border-l-2 border-brand-blue bg-white rounded-r-md p-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-bold text-brand-blue">✅ Admin का जवाब</span>
                    <span className="text-[10px] text-slate-400">{formatTime(c.reply.repliedAt)}</span>
                  </div>
                  <p className="text-sm text-slate-700 mt-1 whitespace-pre-wrap break-words">
                    {c.reply.message}
                  </p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
