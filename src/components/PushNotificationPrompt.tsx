'use client'

import { useState, useEffect } from 'react'

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export default function PushNotificationPrompt() {
  const [visible, setVisible] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (!VAPID_PUBLIC_KEY) return
    if (typeof window === 'undefined') return
    if (!('Notification' in window) || !('serviceWorker' in navigator)) return

    const dismissed = localStorage.getItem('osp_push_dismissed')
    if (Notification.permission === 'default' && !dismissed) {
      const timer = setTimeout(() => setVisible(true), 4000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAllow = async () => {
    if (!VAPID_PUBLIC_KEY) return
    setStatus('loading')
    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        setVisible(false)
        return
      }

      const registration = await navigator.serviceWorker.register('/sw.js')
      await navigator.serviceWorker.ready

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      })

      const res = await fetch('/api/push-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setErrorMsg(data.message || `Server Error (${res.status})`)
        setStatus('error')
        return
      }

      setStatus('done')
      setTimeout(() => setVisible(false), 1800)
    } catch (err) {
      setErrorMsg((err as Error).message || 'कुछ गड़बड़ हो गई')
      setStatus('error')
    }
  }

  const handleDismiss = () => {
    localStorage.setItem('osp_push_dismissed', 'true')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-50 bg-white border border-blue-200 rounded-lg shadow-xl p-4">
      {status === 'done' ? (
        <p className="text-sm text-green-700 font-semibold text-center py-2">
          ✅ Notification चालू हो गई! अब नई पोस्ट की जानकारी आपको तुरंत मिलेगी।
        </p>
      ) : status === 'error' ? (
        <div className="text-center py-2">
          <p className="text-sm text-red-700 font-semibold">⚠️ Subscribe नहीं हो पाया</p>
          <p className="text-xs text-red-500 mt-1 break-words">{errorMsg}</p>
          <button
            onClick={handleDismiss}
            className="mt-3 text-xs border border-slate-300 text-slate-600 px-4 py-1.5 rounded-md hover:bg-slate-50 transition"
          >
            बंद करें
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-start gap-3">
            <div className="text-2xl flex-shrink-0">🔔</div>
            <div>
              <h3 className="font-bold text-brand-blueDark text-sm">
                Job Alert Notification चालू करें
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                नई सरकारी नौकरी, प्रवेश पत्र व परिणाम की जानकारी सीधे अपने फोन पर पाएँ - चाहे
                वेबसाइट पर हों या नहीं।
              </p>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleAllow}
              disabled={status === 'loading'}
              className="flex-1 bg-brand-blue text-white text-sm font-semibold py-2 rounded-md hover:bg-brand-blueDark transition disabled:opacity-60"
            >
              {status === 'loading' ? 'चालू हो रहा है...' : 'Allow करें'}
            </button>
            <button
              onClick={handleDismiss}
              className="flex-1 border border-slate-300 text-slate-600 text-sm font-semibold py-2 rounded-md hover:bg-slate-50 transition"
            >
              अभी नहीं
            </button>
          </div>
        </>
      )}
    </div>
  )
}
