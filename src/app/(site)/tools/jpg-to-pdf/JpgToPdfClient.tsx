// 🆕 नई फ़ाइल — इसे इसी पाथ पर बनाएं: src/app/(site)/tools/jpg-to-pdf/JpgToPdfClient.tsx
//
// यह Tool किसी npm PDF Library का इस्तेमाल नहीं करता (ताकि कोई नई
// Dependency Install न करनी पड़े) - इसकी जगह Browser के अपने बने-बनाए
// "Print to PDF" Feature का इस्तेमाल करता है। हर Photo को एक अलग "Print
// Page" पर भरकर दिखाया जाता है, फिर User Print Dialog में "Save as PDF"
// चुनकर उसे PDF के रूप में Save कर लेता है - यह तरीका बहुत सारी Free
// Online Websites पर भी इस्तेमाल होता है, 100% भरोसेमंद है।
'use client'

import { useState } from 'react'

export default function JpgToPdfClient() {
  const [images, setImages] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setError(null)

    const readers = files.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          if (!file.type.startsWith('image/')) {
            reject(new Error('not-image'))
            return
          }
          const reader = new FileReader()
          reader.onload = (ev) => resolve(ev.target?.result as string)
          reader.onerror = () => reject(new Error('read-error'))
          reader.readAsDataURL(file)
        })
    )

    Promise.allSettled(readers).then((results) => {
      const ok = results
        .filter((r): r is PromiseFulfilledResult<string> => r.status === 'fulfilled')
        .map((r) => r.value)
      if (ok.length === 0) {
        setError('कृपया सिर्फ़ Image File चुनें (JPG/PNG)।')
        return
      }
      setImages((prev) => [...prev, ...ok])
    })
  }

  function removeImage(idx: number) {
    setImages((prev) => prev.filter((_, i) => i !== idx))
  }

  function handlePrint() {
    if (images.length === 0) {
      setError('पहले कम-से-कम एक Photo चुनिए।')
      return
    }
    window.print()
  }

  return (
    <div className="bg-white border border-blue-100 rounded-lg p-4 space-y-4 print:hidden">
      <div>
        <p className="text-sm font-semibold text-slate-700 mb-2">1️⃣ Photo(s) चुनिए</p>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
          className="block w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-brand-blue file:text-white file:text-sm file:font-semibold hover:file:bg-brand-blueDark"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {images.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-2">
            2️⃣ {images.length} Photo चुनी गई - क्रम यही रहेगा PDF में
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {images.map((src, idx) => (
              <div key={idx} className="relative border border-slate-200 rounded-md overflow-hidden">
                <img src={src} alt={`Page ${idx + 1}`} className="w-full h-24 object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center"
                  aria-label="हटाएँ"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handlePrint}
        className="bg-brand-pinkAccent text-white text-sm font-bold px-5 py-2.5 rounded-full hover:opacity-90"
      >
        🖨️ Print / Save as PDF
      </button>

      {/* यही हिस्सा सिर्फ़ Print के वक़्त दिखता है - हर Photo अपने अलग Page पर */}
      <div className="hidden print:block">
        {images.map((src, idx) => (
          <div
            key={idx}
            style={{
              pageBreakAfter: idx < images.length - 1 ? 'always' : 'auto',
              width: '100%',
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={`Page ${idx + 1}`} style={{ maxWidth: '100%', maxHeight: '100%' }} />
          </div>
        ))}
      </div>
    </div>
  )
}
