// 🆕 नई फ़ाइल — इसे इसी पाथ पर बनाएं: src/components/StickyBottomAdClient.tsx
'use client'

import { useState } from 'react'
import AdSlot from './AdSlot'

export default function StickyBottomAdClient({ code }: { code: string }) {
  const [closed, setClosed] = useState(false)
  if (closed) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-[0_-2px_12px_rgba(0,0,0,0.08)] py-1">
      <div className="relative max-w-sm mx-auto flex items-center justify-center">
        <button
          type="button"
          onClick={() => setClosed(true)}
          aria-label="विज्ञापन बंद करें"
          className="absolute -top-3 right-1 w-5 h-5 rounded-full bg-slate-700 text-white text-xs leading-none flex items-center justify-center shadow"
        >
          ✕
        </button>
        <AdSlot code={code} width={320} height={50} label="Sticky Advertisement" showLabel={false} />
      </div>
    </div>
  )
}
