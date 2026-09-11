// 🆕 नई फ़ाइल — इसे इसी पाथ पर बनाएं: src/components/ThirdPartyAdScript.tsx
//
// Sanity से आया कोई भी Ad Network Code (जैसे Media.net) यहाँ चलाया जाता है।
// ⚠️ ज़रूरी तकनीकी बात: अगर <script> टैग को सीधे HTML में डाल दिया जाए
// (dangerouslySetInnerHTML से), तो Browser सुरक्षा कारणों से उसे कभी नहीं चलाता।
// इसलिए यह Component खुद-ब-खुद हर <script> को अलग से पहचानकर, असली JavaScript
// <script> Element बनाकर Page में जोड़ता है - तभी वह ठीक से काम करता है।
'use client'

import { useEffect } from 'react'

export default function ThirdPartyAdScript({ code }: { code?: string }) {
  useEffect(() => {
    if (!code) return

    const container = document.createElement('div')
    container.innerHTML = code
    const scripts = Array.from(container.querySelectorAll('script'))
    const addedNodes: HTMLElement[] = []

    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script')
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value)
      })
      if (oldScript.textContent) newScript.textContent = oldScript.textContent
      document.head.appendChild(newScript)
      addedNodes.push(newScript)
    })

    // बाकी बचा (गैर-script) HTML जैसे <ins> Tag वगैरह, अगर Ad Network ने दिया हो
    const nonScriptHtml = container.innerHTML
    let nonScriptContainer: HTMLDivElement | null = null
    if (nonScriptHtml.trim()) {
      nonScriptContainer = document.createElement('div')
      nonScriptContainer.innerHTML = nonScriptHtml
      document.body.appendChild(nonScriptContainer)
    }

    return () => {
      addedNodes.forEach((n) => n.remove())
      nonScriptContainer?.remove()
    }
  }, [code])

  return null
}
