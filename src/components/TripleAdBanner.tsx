// 🆕 नई फ़ाइल — इसे इसी पाथ पर बनाएं: src/components/TripleAdBanner.tsx
//
// SarkariResult के "महत्वपूर्ण लिंक्स" सेक्शन के ठीक ऊपर जैसे एक साथ 3 Banner
// एक Row में दिखते हैं - वही Layout यहाँ Sanity के 3 अलग-अलग फ़ील्ड
// (contentBannerLeft/Center/Right) से बनता है। Mobile पर ये तीनों नीचे-नीचे
// (Stack) हो जाते हैं, Desktop पर एक Row में साथ-साथ।
import AdSlot from './AdSlot'

export default function TripleAdBanner({
  left,
  center,
  right,
}: {
  left?: string | null
  center?: string | null
  right?: string | null
}) {
  if (!left && !center && !right) return null

  return (
    <div className="my-6 grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
      <AdSlot code={left} width={300} height={100} label="Advertisement 1" />
      <AdSlot code={center} width={300} height={100} label="Advertisement 2" />
      <AdSlot code={right} width={300} height={100} label="Advertisement 3" />
    </div>
  )
}
