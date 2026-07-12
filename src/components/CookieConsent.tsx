'use client'

import { useState, useEffect } from 'react'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('osp_cookie_consent')
    if (!consent) {
      setVisible(true)
    }
  }, [])

  const accept = () => {
    localStorage.setItem('osp_cookie_consent', 'accepted')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-brand-blueDark text-white px-4 py-4 shadow-lg">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center gap-3 justify-between">
        <p className="text-xs sm:text-sm text-blue-100 text-center sm:text-left">
          यह वेबसाइट आपके अनुभव को बेहतर बनाने और विज्ञापन दिखाने के लिए cookies का उपयोग करती है।
          साइट का उपयोग जारी रखने पर आप हमारी{' '}
          <a href="/privacy-policy" className="underline hover:text-brand-pink">
            Privacy Policy
          </a>{' '}
          से सहमत माने जाएँगे।
        </p>
        <button
          onClick={accept}
          className="bg-brand-pinkAccent text-white text-sm font-semibold px-5 py-2 rounded-md hover:bg-pink-600 transition flex-shrink-0 whitespace-nowrap"
        >
          Accept / स्वीकार करें
        </button>
      </div>
    </div>
  )
}
