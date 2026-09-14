// 🆕 नई फ़ाइल — इसे इसी पाथ पर बनाएं: src/components/AdPoolSlot.tsx
//
// एक Placement में कई Network (Adsterra, Monetag, AdSense वग़ैरह) के Code एक
// साथ Pool में हो सकते हैं। यह Component हर बार Page Render होने पर उस Pool
// में से एक Code Random तरीके से चुनकर दिखाता है - ताकि समय के साथ सबको
// बराबर Traffic मिले और आप हर Network की अपनी Dashboard में CPM Compare कर
// सकें।
//
// नोट: यह पेज हर बार पूरी तरह नहीं, बल्कि करीब हर 1 घंटे में एक बार दोबारा
// Render होता है (Cache/ISR के कारण, Site तेज़ रखने के लिए) - इसलिए Random
// चुनाव भी उतनी ही बार बदलता है, हर अकेले Visitor पर नहीं। एक दिन/हफ़्ते के
// हिसाब से देखा जाए तो हर Network को फिर भी बराबर मौक़ा मिल जाता है।
import AdSlot from './AdSlot'

export default function AdPoolSlot({
  codes,
  width,
  height,
  className = '',
}: {
  codes?: (string | null | undefined)[] | null
  width?: number | string
  height?: number
  className?: string
}) {
  const valid = (codes || []).filter((c): c is string => !!c && c.trim().length > 0)
  if (valid.length === 0) return null

  const picked = valid[Math.floor(Math.random() * valid.length)]
  return <AdSlot code={picked} width={width} height={height} className={className} />
}
