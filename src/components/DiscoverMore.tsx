'use client'

import { useState } from 'react'

type Panel = {
  title: string
  content: string
}

const DEFAULT_PANELS: Panel[] = [
  {
    title: '📢 Recruitment Alerts',
    content:
      'Official Sarkari Patrika पर हर सरकारी भर्ती की जानकारी उसी दिन अपडेट की जाती है जिस दिन आधिकारिक अधिसूचना जारी होती है। नई भर्ती, प्रवेश पत्र और परिणाम की सूचना सबसे पहले पाने के लिए हमारी वेबसाइट को नियमित रूप से देखें, या "Job Alert" पॉप-अप में Allow करके Notification चालू करें।',
  },
  {
    title: '💼 Latest Government Jobs',
    content:
      'ऊपर दिए गए Jobs, Admit Card, Result, Answer Key जैसे बॉक्स में जाकर आप Central और State Government की सभी नवीनतम भर्तियाँ एक ही जगह देख सकते हैं। हर पोस्ट में योग्यता, आयु सीमा, आवेदन शुल्क और महत्वपूर्ण तिथियों की पूरी जानकारी विस्तार से दी जाती है।',
  },
  {
    title: '📘 Exam Study Guides',
    content:
      'परीक्षा की तैयारी के लिए ज़रूरी है कि आप Syllabus और Exam Pattern समय रहते जान लें। हर भर्ती पोस्ट में जहाँ उपलब्ध हो, वहाँ Syllabus और Important Links सेक्शन में सीधा लिंक दिया जाता है। आधिकारिक वेबसाइट से पूरा Syllabus डाउनलोड करके तैयारी शुरू करें।',
  },
]

export default function DiscoverMore({ panels = DEFAULT_PANELS }: { panels?: Panel[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="mb-8 border border-blue-100 rounded-lg overflow-hidden bg-white">
      <div className="bg-brand-blueLight px-4 py-2.5 border-b border-blue-100">
        <h2 className="font-bold text-brand-blueDark text-sm">Discover more</h2>
      </div>
      <div className="divide-y divide-blue-50">
        {panels.map((panel, idx) => (
          <div key={idx}>
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-brand-blueLight/50 transition"
            >
              <span className="font-semibold text-sm text-brand-blueDark">{panel.title}</span>
              <span className="text-slate-400 text-lg flex-shrink-0">
                {openIndex === idx ? '▲' : '›'}
              </span>
            </button>
            {openIndex === idx && (
              <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed">
                {panel.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
