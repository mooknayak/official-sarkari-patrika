// 🆕 नई फ़ाइल — इसे इसी पाथ पर बनाएं: src/app/(site)/tools/photo-signature-resizer/PhotoResizerClient.tsx
//
// यह पूरा Tool सिर्फ़ Browser के अपने Canvas API से काम करता है - कोई भी
// npm Library Install करने की ज़रूरत नहीं, कोई Server पर Image भेजनी नहीं
// पड़ती (इसलिए यह 100% Private/Safe भी है)।
'use client'

import { useState, useRef } from 'react'

type Preset = {
  label: string
  width: number
  height: number
  minKB: number
  maxKB: number
}

const PRESETS: Preset[] = [
  { label: 'फोटो (200×230px, 20–50 KB)', width: 200, height: 230, minKB: 20, maxKB: 50 },
  { label: 'हस्ताक्षर / Signature (140×60px, 10–20 KB)', width: 140, height: 60, minKB: 10, maxKB: 20 },
  { label: 'पासपोर्ट साइज़ फोटो (413×531px, 20–50 KB)', width: 413, height: 531, minKB: 20, maxKB: 50 },
]

export default function PhotoResizerClient() {
  const [presetIdx, setPresetIdx] = useState(0)
  const [useCustom, setUseCustom] = useState(false)
  const [customWidth, setCustomWidth] = useState(200)
  const [customHeight, setCustomHeight] = useState(230)
  const [customMaxKB, setCustomMaxKB] = useState(50)

  const [preview, setPreview] = useState<string | null>(null)
  const [resultKB, setResultKB] = useState<number | null>(null)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const activeWidth = useCustom ? customWidth : PRESETS[presetIdx].width
  const activeHeight = useCustom ? customHeight : PRESETS[presetIdx].height
  const activeMaxKB = useCustom ? customMaxKB : PRESETS[presetIdx].maxKB

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('कृपया सिर्फ़ Image File चुनें (JPG/PNG)।')
      return
    }
    setError(null)
    setProcessing(true)
    setPreview(null)
    setResultKB(null)

    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new window.Image()
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas')
          canvas.width = activeWidth
          canvas.height = activeHeight
          const ctx = canvas.getContext('2d')
          if (!ctx) throw new Error('Canvas not supported')

          // Cover-fit: Image को बीच से Crop करके पूरे तय Size में भरना, बिना खिंचे-टेढ़े हुए
          const scale = Math.max(activeWidth / img.width, activeHeight / img.height)
          const sw = activeWidth / scale
          const sh = activeHeight / scale
          const sx = (img.width - sw) / 2
          const sy = (img.height - sh) / 2
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, activeWidth, activeHeight)
          ctx.drawImage(img, sx, sy, sw, sh, 0, 0, activeWidth, activeHeight)

          // तय KB Size के अंदर आने तक Quality धीरे-धीरे कम करते जाना
          let quality = 0.92
          let dataUrl = canvas.toDataURL('image/jpeg', quality)
          let sizeKB = Math.round((dataUrl.length * 0.75) / 1024)
          let tries = 0
          while (sizeKB > activeMaxKB && quality > 0.08 && tries < 25) {
            quality -= 0.04
            dataUrl = canvas.toDataURL('image/jpeg', quality)
            sizeKB = Math.round((dataUrl.length * 0.75) / 1024)
            tries++
          }

          setPreview(dataUrl)
          setResultKB(sizeKB)
        } catch {
          setError('फ़ाइल Process करने में समस्या हुई, दोबारा कोशिश करें।')
        } finally {
          setProcessing(false)
        }
      }
      img.onerror = () => {
        setError('यह Image खोली नहीं जा सकी, कोई दूसरी फ़ाइल आज़माएँ।')
        setProcessing(false)
      }
      img.src = ev.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  function download() {
    if (!preview) return
    const a = document.createElement('a')
    a.href = preview
    a.download = `resized-${activeWidth}x${activeHeight}.jpg`
    a.click()
  }

  return (
    <div className="bg-white border border-blue-100 rounded-lg p-4 space-y-5">
      {/* Preset चुनना */}
      <div>
        <p className="text-sm font-semibold text-slate-700 mb-2">1️⃣ Size चुनिए</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {PRESETS.map((p, idx) => (
            <button
              key={p.label}
              type="button"
              onClick={() => {
                setPresetIdx(idx)
                setUseCustom(false)
              }}
              className={`text-xs font-semibold px-3 py-2 rounded-md border transition ${
                !useCustom && presetIdx === idx
                  ? 'bg-brand-blue text-white border-brand-blue'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-brand-blue'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setUseCustom(true)}
          className={`mt-2 text-xs font-semibold px-3 py-2 rounded-md border transition ${
            useCustom
              ? 'bg-brand-blue text-white border-brand-blue'
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-brand-blue'
          }`}
        >
          ✏️ खुद से Size डालूँगा (Custom)
        </button>

        {useCustom && (
          <div className="grid grid-cols-3 gap-2 mt-3">
            <label className="text-xs text-slate-600">
              चौड़ाई (px)
              <input
                type="number"
                value={customWidth}
                onChange={(e) => setCustomWidth(Number(e.target.value) || 1)}
                className="mt-1 w-full border border-slate-200 rounded px-2 py-1.5 text-sm"
              />
            </label>
            <label className="text-xs text-slate-600">
              ऊँचाई (px)
              <input
                type="number"
                value={customHeight}
                onChange={(e) => setCustomHeight(Number(e.target.value) || 1)}
                className="mt-1 w-full border border-slate-200 rounded px-2 py-1.5 text-sm"
              />
            </label>
            <label className="text-xs text-slate-600">
              Max KB
              <input
                type="number"
                value={customMaxKB}
                onChange={(e) => setCustomMaxKB(Number(e.target.value) || 1)}
                className="mt-1 w-full border border-slate-200 rounded px-2 py-1.5 text-sm"
              />
            </label>
          </div>
        )}
      </div>

      {/* Upload */}
      <div>
        <p className="text-sm font-semibold text-slate-700 mb-2">2️⃣ Photo चुनिए</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="block w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-brand-blue file:text-white file:text-sm file:font-semibold hover:file:bg-brand-blueDark"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {processing && <p className="text-sm text-slate-500">Process हो रहा है...</p>}

      {preview && (
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-2">3️⃣ नतीजा</p>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <img
              src={preview}
              alt="Resized preview"
              className="border border-slate-200 rounded-md"
              style={{ width: activeWidth, maxWidth: '100%', height: 'auto' }}
            />
            <div className="text-sm text-slate-600 space-y-2">
              <p>
                साइज़: <span className="font-semibold text-slate-800">{activeWidth}×{activeHeight}px</span>
              </p>
              <p>
                File Size:{' '}
                <span className="font-semibold text-slate-800">{resultKB} KB</span>
              </p>
              <button
                type="button"
                onClick={download}
                className="bg-brand-pinkAccent text-white text-sm font-bold px-4 py-2 rounded-full hover:opacity-90"
              >
                ⬇️ Download कीजिए
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
