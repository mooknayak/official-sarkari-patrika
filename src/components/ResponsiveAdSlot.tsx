// 🆕 नई फ़ाइल — इसे इसी पाथ पर बनाएं: src/components/ResponsiveAdSlot.tsx
//
// Desktop और Mobile के लिए अलग-अलग Ad Code होने पर, सही वाला दिखाने के लिए।
//
// ⚠️ ज़रूरी वजह: पहले एक Custom Script `window.innerWidth` पढ़कर खुद तय करती
// थी कि 728×90 दिखाना है या 320×50 - लेकिन यह सिर्फ़ Page Load के समय एक बार
// चलती है (Screen घुमाने/Resize करने पर दोबारा नहीं चलती), और हमारे अपने
// AdSlot वाले Scale-to-fit Logic से भी टकरा जाती थी (दोनों साथ Size बदलने की
// कोशिश करते, इसलिए Ad ठीक से Screen नहीं पकड़ पाता था)।
//
// समाधान: अब कोई JavaScript Width-Check नहीं। सिर्फ़ CSS Media Query
// (Tailwind का md: breakpoint, 768px) तय करता है कि कौन-सा Ad दिखेगा - यह
// हमेशा सही रहता है, Resize/Rotate पर भी अपने-आप सही Ad दिखा देता है, और
// AdSlot के Scale Logic से कभी नहीं टकराता क्योंकि हर एक अपने ही असली Size
// (Design Width) के साथ Render होता है।
import AdSlot from './AdSlot'

export default function ResponsiveAdSlot({
  desktopCode,
  desktopWidth = 728,
  desktopHeight = 90,
  mobileCode,
  mobileWidth = 320,
  mobileHeight = 50,
  className = '',
}: {
  desktopCode?: string | null
  desktopWidth?: number
  desktopHeight?: number
  mobileCode?: string | null
  mobileWidth?: number
  mobileHeight?: number
  className?: string
}) {
  // अगर किसी एक Screen का Code खाली है, तो दूसरे वाले Code को ही Fallback
  // की तरह इस्तेमाल कर लेते हैं (AdSlot उसे खुद ही उस Screen के हिसाब से
  // Proportionally छोटा/बड़ा दिखा देगा) - इससे कभी भी दोनों जगह पूरी तरह
  // खाली नहीं रहेंगी, भले ही सिर्फ़ एक Code भरा हो।
  const mCode = mobileCode || desktopCode
  const mWidth = mobileCode ? mobileWidth : desktopWidth
  const mHeight = mobileCode ? mobileHeight : desktopHeight

  const dCode = desktopCode || mobileCode
  const dWidth = desktopCode ? desktopWidth : mobileWidth
  const dHeight = desktopCode ? desktopHeight : mobileHeight

  if (!mCode && !dCode) return null

  return (
    <div className={className}>
      <div className="block md:hidden">
        <AdSlot code={mCode} width={mWidth} height={mHeight} />
      </div>
      <div className="hidden md:block">
        <AdSlot code={dCode} width={dWidth} height={dHeight} />
      </div>
    </div>
  )
}
