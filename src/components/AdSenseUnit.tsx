// 🆕 नई फ़ाइल — इसे इसी पाथ पर बनाएं: src/components/AdSenseUnit.tsx
//
// ⚠️ ज़रूरी टेक्निकल कारण: Google AdSense अपने Ad Unit को हमेशा असली पेज के
// DOM में ही चलाना चाहता है (यह खुद ही अपना सुरक्षित iframe अंदर बना लेता है)।
// इसीलिए इसे हमारे `AdSlot` वाले sandbox iframe में नहीं डाला जा सकता - इसका
// अपना अलग, सीधा तरीका है। यही वजह है कि AdSense और Monetag दोनों साथ-साथ
// चल सकते हैं: दोनों अलग-अलग जगह (Slot) पर हैं, और दोनों का Rendering तरीका
// एक-दूसरे में हस्तक्षेप (interfere) नहीं करता।
'use client'

import { useEffect, useRef } from 'react'

export default function AdSenseUnit({
  clientId,
  slotId,
  height = 100,
}: {
  clientId?: string
  slotId?: string
  height?: number
}) {
  const pushedRef = useRef(false)

  useEffect(() => {
    if (!clientId || !slotId || pushedRef.current) return
    try {
      // @ts-ignore - adsbygoogle.js Script (root layout.tsx में) window पर यह Array बनाती है
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      pushedRef.current = true
    } catch {
      // AdSense Script अभी तक लोड नहीं हुई (या Approval अभी बाकी है) - चुपचाप छोड़ दें, पेज नहीं टूटेगा
    }
  }, [clientId, slotId])

  if (!clientId || !slotId) return null

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block', minHeight: height, width: '100%' }}
      data-ad-client={clientId}
      data-ad-slot={slotId}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  )
}
