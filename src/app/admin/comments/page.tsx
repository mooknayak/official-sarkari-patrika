// 🆕 नई फ़ाइल — इसे इसी पाथ पर बनाएं: src/app/admin/comments/page.tsx
//
// यह पेज सिर्फ़ आपके लिए है (सार्वजनिक नहीं) - यहाँ से आप हर पोस्ट पर आए सभी
// Comments को Real-time देख सकते हैं और उनका जवाब दे सकते हैं।
// ⚠️ Sanity Studio इससे बिल्कुल अलग है - Comments का Sanity से कोई लेना-देना नहीं,
// यह पूरा Firebase (Firestore + Auth) से चलता है।
//
// लॉगिन कैसे बनेगा: Firebase Console → Authentication → "Get Started" → Sign-in
// method में "Email/Password" Enable करें → Users टैब में खुद का Email-Password
// डालकर एक User बना लें - वही यहाँ Login करने के काम आएगा।

'use client'

import { useEffect, useState } from 'react'
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import { getFirestoreDb, getFirebaseAuth } from '@/lib/firebaseClientDb'

type CommentDoc = {
  id: string
  postSlug: string
  postTitle?: string
  name?: string
  message: string
  createdAt?: Timestamp
  reply?: { message: string; repliedAt?: Timestamp } | null
}

function formatTime(ts?: Timestamp) {
  if (!ts) return ''
  return ts.toDate().toLocaleString('hi-IN', { dateStyle: 'medium', timeStyle: 'short' })
}

export default function AdminCommentsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    const auth = getFirebaseAuth()
    if (!auth) {
      setAuthLoading(false)
      return
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setAuthLoading(false)
    })
    return () => unsub()
  }, [])

  if (authLoading) {
    return <div className="p-8 text-center text-sm text-slate-500">लोड हो रहा है...</div>
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-brand-blueDark mb-6">🔒 Admin - सभी Comments</h1>
      {user ? <CommentsDashboard /> : <LoginForm />}
    </div>
  )
}

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const auth = getFirebaseAuth()
    if (!auth) {
      setError('Firebase सेट नहीं है')
      return
    }
    setLoading(true)
    setError('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
      setError('Login विफल - Email/Password जाँचें')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleLogin} className="max-w-sm mx-auto space-y-3 border border-slate-200 rounded-lg p-6">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
        required
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brand-blue text-white text-sm font-semibold py-2 rounded-md hover:bg-brand-blueDark transition disabled:opacity-60"
      >
        {loading ? 'Login हो रहा है...' : 'Login करें'}
      </button>
    </form>
  )
}

function CommentsDashboard() {
  const [comments, setComments] = useState<CommentDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({})
  const [sendingId, setSendingId] = useState<string | null>(null)

  useEffect(() => {
    const db = getFirestoreDb()
    if (!db) {
      setLoading(false)
      return
    }
    const q = query(collection(db, 'comments'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        setComments(snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<CommentDoc, 'id'>) })))
        setLoading(false)
        setLoadError('')
      },
      (err) => {
        console.error('[Admin Comments] Firestore Error:', err.message)
        setLoadError(err.message || 'Comments लोड नहीं हो पाए')
        setLoading(false)
      }
    )
    return () => unsub()
  }, [])

  const handleReply = async (commentId: string) => {
    const db = getFirestoreDb()
    const text = replyDrafts[commentId]?.trim()
    if (!db || !text) return

    setSendingId(commentId)
    try {
      await updateDoc(doc(db, 'comments', commentId), {
        reply: { message: text, repliedAt: serverTimestamp() },
      })
      setReplyDrafts((prev) => ({ ...prev, [commentId]: '' }))
    } finally {
      setSendingId(null)
    }
  }

  const handleLogout = async () => {
    const auth = getFirebaseAuth()
    if (auth) await signOut(auth)
  }

  return (
    <div>
      <button
        onClick={handleLogout}
        className="text-xs text-slate-500 underline mb-4"
      >
        Logout करें
      </button>

      {loading ? (
        <p className="text-sm text-slate-400">लोड हो रहा है...</p>
      ) : loadError ? (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-3">
          <p className="font-semibold">⚠️ Comments लोड नहीं हो पाए</p>
          <p className="text-xs mt-1 break-words">{loadError}</p>
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-slate-400">अभी तक कोई Comment नहीं आया।</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((c) => (
            <li key={c.id} className="border border-slate-200 rounded-lg p-4">
              <div className="flex justify-between items-baseline flex-wrap gap-1">
                <span className="text-xs font-semibold text-brand-blue">{c.postTitle || c.postSlug}</span>
                <span className="text-[11px] text-slate-400">{formatTime(c.createdAt)}</span>
              </div>
              <p className="text-sm font-semibold text-slate-800 mt-2">{c.name || 'अज्ञात'}</p>
              <p className="text-sm text-slate-700 whitespace-pre-wrap break-words">{c.message}</p>

              {c.reply?.message ? (
                <div className="mt-3 ml-3 pl-3 border-l-2 border-green-500 bg-green-50 rounded-r-md p-2">
                  <p className="text-xs font-bold text-green-700">✅ आपका जवाब भेजा जा चुका है</p>
                  <p className="text-sm text-slate-700 mt-1">{c.reply.message}</p>
                </div>
              ) : (
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={replyDrafts[c.id] || ''}
                    onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [c.id]: e.target.value }))}
                    placeholder="जवाब लिखें..."
                    className="flex-1 border border-slate-300 rounded-md px-3 py-1.5 text-sm"
                  />
                  <button
                    onClick={() => handleReply(c.id)}
                    disabled={sendingId === c.id || !replyDrafts[c.id]?.trim()}
                    className="bg-brand-blue text-white text-xs font-semibold px-4 rounded-md hover:bg-brand-blueDark transition disabled:opacity-50"
                  >
                    भेजें
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
