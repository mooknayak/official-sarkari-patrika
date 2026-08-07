// 🆕 नई फ़ाइल — इसे इसी पाथ पर बनाएं: src/components/CommentsSection.tsx
//
// पोस्ट पेज के नीचे यह दिखेगा - विज़िटर यहाँ Comment कर सकते हैं, और यह
// Real-time अपडेट होता है (किसी और का Comment आते ही, बिना Refresh किए दिखेगा)।
// डेटा Sanity में नहीं, बल्कि Firebase Firestore में Store होता है।

'use client'

import { useEffect, useState } from 'react'
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { getFirestoreDb } from '@/lib/firebaseClientDb'

type CommentDoc = {
  id: string
  name?: string
  message: string
  createdAt?: Timestamp
  reply?: { message: string; repliedAt?: Timestamp } | null
}

function formatTime(ts?: Timestamp) {
  if (!ts) return ''
  return ts.toDate().toLocaleString('hi-IN', { dateStyle: 'medium', timeStyle: 'short' })
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
  const [dbReady, setDbReady] = useState(false)

  useEffect(() => {
    const db = getFirestoreDb()
    if (!db) {
      setLoading(false)
      return
    }
    setDbReady(true)

    const q = query(
      collection(db, 'comments'),
      where('postSlug', '==', postSlug),
      orderBy('createdAt', 'desc')
    )

    // 🔴 Real-time Listener - जैसे ही Firestore में कोई नया Comment या Reply आता है,
    // यह तुरंत यहाँ अपने-आप अपडेट हो जाता है, बिना Page Refresh किए
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setComments(
          snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<CommentDoc, 'id'>) }))
        )
        setLoading(false)
      },
      () => setLoading(false)
    )

    return () => unsubscribe()
  }, [postSlug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    const db = getFirestoreDb()
    if (!db) {
      setError('Comment System अभी उपलब्ध नहीं है')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      await addDoc(collection(db, 'comments'), {
        postSlug,
        postTitle,
        name: name.trim() || 'अज्ञात',
        message: message.trim().slice(0, 1000),
        createdAt: serverTimestamp(),
        reply: null,
      })
      setMessage('')
    } catch (err) {
      setError((err as Error).message || 'Comment भेजने में समस्या हुई')
    } finally {
      setSubmitting(false)
    }
  }

  if (!dbReady && !loading) return null // Firebase सेट नहीं है तो यह Section दिखेगा ही नहीं

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
      ) : comments.length === 0 ? (
        <p className="text-sm text-slate-400">अभी तक कोई Comment नहीं है - सबसे पहले आप करें!</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((c) => (
            <li key={c.id} className="border border-slate-100 rounded-lg p-3 bg-slate-50">
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
