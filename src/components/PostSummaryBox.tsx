// 🆕 नई फ़ाइल: src/components/PostSummaryBox.tsx
// पोस्ट के शीर्षक के ठीक नीचे "संक्षिप्त जानकारी" का बॉक्स।
// Sanity में पोस्ट के "📝 संक्षिप्त जानकारी" खाने से आता है। खाली हो तो कुछ नहीं दिखता।
// सिर्फ़ टेक्स्ट दिखाता है (कोई Link या HTML नहीं), इसलिए सुरक्षित है।
export default function PostSummaryBox({ text }: { text?: string }) {
  const paragraphs = (text || '')
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
  if (paragraphs.length === 0) return null

  return (
    <section
      aria-label="संक्षिप्त जानकारी"
      className="mb-5 rounded-xl border border-blue-100 border-l-4 border-l-brand-pinkAccent bg-gradient-to-br from-brand-blueLight to-white p-4 shadow-sm"
    >
      <div className="mb-2 flex items-center gap-2">
        <span
          aria-hidden="true"
          className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-blue text-sm text-white"
        >
          📝
        </span>
        <h2 className="text-sm font-bold tracking-wide text-brand-blueDark">संक्षिप्त जानकारी</h2>
      </div>
      <div className="space-y-2 text-[15px] leading-relaxed text-slate-700">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </section>
  )
}
