// 🆕 नई फ़ाइल — इसे इसी पाथ पर बनाएं: src/components/InterstitialAdClient.tsx
//
// Interstitial/Vignette Ad को किसी Fixed-Size डिब्बे में नहीं बाँधा जा सकता
// (न बाँधना चाहिए) - इसका काम ही है पूरी स्क्रीन को थोड़ी देर के लिए ढकना,
// फिर अपने-आप Skip/Close होना। इसलिए इसे बाकी Banner Slots (AdSlot) जैसे
// किसी Container में Render नहीं करते - सीधे असली Page के DOM में, Network
// की अपनी Frequency-Capping Logic पर भरोसा करते हुए इंजेक्ट करते हैं (वही
// तय करती है कि हर Page पर दिखाना है या नहीं, ताकि User परेशान न हो)।
'use client'

import { useEffect, useRef } from 'react'

export default function InterstitialAdClient({ code }: { code?: string | null }) {
  const injectedRef = useRef(false)

  useEffect(() => {
    if (!code || !code.trim() || injectedRef.current) return
    injectedRef.current = true

    const temp = document.createElement('div')
    temp.innerHTML = code

    Array.from(temp.childNodes).forEach((node) => {
      if (node.nodeName === 'SCRIPT') {
        const oldScript = node as HTMLScriptElement
        const newScript = document.createElement('script')
        Array.from(oldScript.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value)
        })
        newScript.text = oldScript.text
        document.body.appendChild(newScript)
      } else {
        document.body.appendChild(node.cloneNode(true))
      }
    })
  }, [code])

  return null
}
