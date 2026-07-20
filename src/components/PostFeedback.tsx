'use client'

import { useState } from 'react'

export default function PostFeedback({ slug }: { slug: string }) {
  const [voted, setVoted] = useState<'helpful' | 'not-helpful' | null>(null)
  const [loading, setLoading] = useState(false)

  const handleVote = async (type: 'helpful' | 'not-helpful') => {
    if (voted || loading) return
    setLoading(true)
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, type }),
      })
      if (res.ok) {
        setVoted(type)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="my-6 border border-blue-200 rounded-lg p-4 text-center">
      {voted ? (
        <p className="text-sm text-green-700 font-semibold">
          ✅ आपकी प्रतिक्रिया के लिए धन्यवाद!
        </p>
      ) : (
        <>
          <p className="text-sm font-semibold text-brand-blueDark mb-3">
            क्या यह जानकारी सही और उपयोगी लगी?
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => handleVote('helpful')}
              disabled={loading}
              className="flex items-center gap-2 border border-green-500 text-green-700 px-5 py-2 rounded-md text-sm font-semibold hover:bg-green-50 transition disabled:opacity-60"
            >
              👍 हाँ
            </button>
            <button
              onClick={() => handleVote('not-helpful')}
              disabled={loading}
              className="flex items-center gap-2 border border-red-400 text-red-600 px-5 py-2 rounded-md text-sm font-semibold hover:bg-red-50 transition disabled:opacity-60"
            >
              👎 नहीं
            </button>
          </div>
        </>
      )}
    </div>
  )
}
