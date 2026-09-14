// इसी पाथ पर मौजूद फ़ाइल को इस पूरे कोड से बदल दें: src/components/AdSlot.tsx
//
// 🔧 ज़रूरी सुधार (14 सितंबर की जाँच के बाद):
// पहले हर Ad को <iframe sandbox> के अंदर Isolate किया गया था। इससे Click-Hijack
// की समस्या तो हल हुई, लेकिन Monetag जैसे Networks अपने Script में एक
// "Anti-Fraud" जाँच रखते हैं — वे चेक करते हैं कि वे किसी दूसरे iframe के अंदर
// "नेस्टेड" होकर तो नहीं चल रहे (fake-impression फ्रॉड रोकने के लिए)। हमारा
// Sandbox iframe ठीक यही था, इसलिए Script ख़ुद को रोक लेता था और कभी कोई Ad
// Request भेजता ही नहीं था (Monetag Dashboard में "0 Requests" इसी वजह से)।
//
// अब समाधान: Ad Script सीधे असली पेज के DOM में डाला जाता है (Sandbox हटाया
// गया), जिससे Network सामान्य रूप से Request भेज पाए। Click-Hijack से बचाव अब
// "सही Ad Format चुनने" से होता है — सिर्फ़ Monetag का "In-Page Push (Banner)"
// Format इस्तेमाल करें (यह ख़ुद कहता है: "doesn't occupy any space on your
// website, doesn't affect your UX"), कभी भी Multitag/Onclick(Popunder) कोड इन
// Fields में न डालें - वही असली Click-Hijack का कारण था, Sandbox की कमी नहीं।
'use client'

import { useEffect, useRef } from 'react'

type AdSlotProps = {
  code?: string | null
  width?: number | string
  height?: number | string
  className?: string
  label?: string
  showLabel?: boolean
}

export default function AdSlot({
  code,
  width = '100%',
  height = 100,
  className = '',
  label = 'Advertisement',
  showLabel = true,
}: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const injectedRef = useRef(false)

  useEffect(() => {
    if (!code || !code.trim() || !containerRef.current || injectedRef.current) return
    injectedRef.current = true

    const container = containerRef.current
    // दिए गए Ad Code को अस्थायी रूप से Parse करते हैं ताकि उसमें मौजूद
    // <script> Tag ढूँढ सकें - सीधे innerHTML से Script कभी नहीं चलती,
    // इसलिए हर <script> को दोबारा असली Script Element के रूप में बनाना
    // ज़रूरी है, तभी Browser उसे Execute करता है।
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
        container.appendChild(newScript)
      } else {
        container.appendChild(node.cloneNode(true))
      }
    })
  }, [code])

  // कोड खाली है तो कुछ भी नहीं दिखेगा - कोई टूटा हुआ खाली बॉक्स नहीं, कोई नुकसान नहीं
  if (!code || !code.trim()) return null

  return (
    <div className={`ad-slot ${className}`}>
      {showLabel && (
        <p className="text-center text-[10px] tracking-widest text-slate-400 uppercase mb-1 select-none">
          विज्ञापन · Advertisement
        </p>
      )}
      <div
        ref={containerRef}
        className="mx-auto overflow-hidden rounded-md border border-slate-100 bg-slate-50/50 flex items-center justify-center"
        style={{ width, maxWidth: '100%', minHeight: height }}
      />
    </div>
  )
}

