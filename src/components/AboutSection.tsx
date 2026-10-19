// 🆕 नई फ़ाइल: src/components/AboutSection.tsx
// Homepage पर "हमारे बारे में" सेक्शन। Sanity → Website Settings → "ℹ️ Homepage - हमारे बारे में"
// से बदला जा सकता है। कुछ भी न भरा हो तो नीचे वाला सही, सामान्य Default दिखता है।
type Point = { icon?: string; title?: string; text?: string }

const DEFAULT_HEADING = 'Official Sarkari Patrika के बारे में'

const DEFAULT_INTRO = [
  'Official Sarkari Patrika एक स्वतंत्र सूचना पोर्टल है, जहाँ सरकारी नौकरी की भर्ती अधिसूचनाएँ, एडमिट कार्ड, परिणाम, उत्तर कुंजी (Answer Key), ज़रूरी दस्तावेज़ों की गाइड और सरकारी योजनाओं की जानकारी एक ही जगह सरल हिंदी में मिलती है।',
  'हमारा प्रयास है कि उम्मीदवारों को आवेदन की अंतिम तारीख, पात्रता, आवेदन शुल्क और आवेदन की प्रक्रिया जैसी ज़रूरी बातें साफ़ और समझने लायक रूप में मिलें। नई जानकारी आने पर संबंधित पोस्ट अपडेट की जाती हैं।',
]

const DEFAULT_POINTS: Point[] = [
  { icon: '📢', title: 'भर्ती अधिसूचनाएँ', text: 'विभिन्न विभागों की नई भर्तियों में पद, पात्रता, ज़रूरी तारीख़ें और आवेदन की जानकारी।' },
  { icon: '🪪', title: 'एडमिट कार्ड व परीक्षा सूचना', text: 'परीक्षा की तारीख़, परीक्षा शहर की सूचना और प्रवेश पत्र से जुड़ी जानकारी।' },
  { icon: '📊', title: 'परिणाम व उत्तर कुंजी', text: 'परिणाम, कट-ऑफ़, मेरिट सूची और उत्तर कुंजी से जुड़ी जानकारी।' },
  { icon: '🛠️', title: 'मुफ़्त टूल्स व गाइड', text: 'फ़ोटो-हस्ताक्षर का आकार बदलने, JPG से PDF बनाने जैसे टूल और ज़रूरी दस्तावेज़ बनवाने की गाइड।' },
]

const DEFAULT_NOTE =
  'सूचना: Official Sarkari Patrika एक स्वतंत्र पोर्टल है और किसी सरकारी विभाग से संबद्ध नहीं है। आवेदन या भुगतान से पहले संबंधित विभाग की आधिकारिक अधिसूचना और वेबसाइट ज़रूर जाँच लें। हम कभी आपसे आधार, बैंक विवरण या OTP नहीं माँगते।'

export default function AboutSection({
  enabled,
  heading,
  intro,
  points,
  note,
}: {
  enabled?: boolean
  heading?: string
  intro?: string
  points?: Point[]
  note?: string
}) {
  if (enabled === false) return null

  const paragraphs = intro?.trim()
    ? intro.split(/\n{1,}/).map((p) => p.trim()).filter(Boolean)
    : DEFAULT_INTRO
  const cards = (points && points.length > 0 ? points : DEFAULT_POINTS).filter((p) => p.title && p.text)

  return (
    <section
      aria-labelledby="about-heading"
      className="mt-12 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm md:p-7"
    >
      <h2
        id="about-heading"
        className="mb-3 border-l-4 border-brand-pinkAccent pl-3 text-lg font-bold text-brand-blueDark md:text-xl"
      >
        {heading?.trim() || DEFAULT_HEADING}
      </h2>

      <div className="space-y-3 text-[15px] leading-relaxed text-slate-700">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {cards.length > 0 && (
        <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {cards.map((c, i) => (
            <li key={i} className="rounded-xl border border-blue-100 bg-brand-blueLight p-4">
              <p className="mb-1 flex items-center gap-2 font-semibold text-brand-blueDark">
                {c.icon && <span aria-hidden="true">{c.icon}</span>}
                <span>{c.title}</span>
              </p>
              <p className="text-sm leading-relaxed text-slate-600">{c.text}</p>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-5 rounded-lg border border-brand-pink bg-brand-pink/40 p-3 text-xs leading-relaxed text-slate-700">
        {note?.trim() || DEFAULT_NOTE}
      </p>
    </section>
  )
}
