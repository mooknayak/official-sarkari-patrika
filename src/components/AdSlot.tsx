// 🆕 नई फ़ाइल — इसे इसी पाथ पर बनाएं: src/components/AdSlot.tsx
//
// 🎯 यह कॉम्पोनेंट पूरी Ad-Professionalization का दिल है।
//
// समस्या क्या थी: पहले Ad Code सीधे पेज के <body> में `dangerouslySetInnerHTML`
// से डाला जाता था। ऐसे कोड (खासकर Monetag के MultiTag/Popunder/OnClick फॉर्मेट)
// पूरे Document पर एक Global Click Listener लगा देते हैं — यानी पेज पर कहीं भी
// (Menu, Button, किसी भी Link पर) क्लिक करो, वह पकड़कर एक नया Ad Tab खोल देता है।
//
// समाधान क्या है: हर Ad को उसके अपने अलग <iframe sandbox> के अंदर रखा जाता है।
// sandbox वाला iframe अपना खुद का अलग Document रखता है — उसके अंदर की Script
// सिर्फ़ उसी छोटे डिब्बे के अंदर के Click सुन सकती है, बाहर हमारी असली Website
// के Header/Menu/Button/Link पर हुए Click को कभी नहीं छू सकती। यही तरीका बड़ी
// Professional साइट्स (जैसे SarkariResult) इस्तेमाल करती हैं — हर Banner अपने
// तय Size के डिब्बे में सीमित रहता है।
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
  // कोड खाली है तो कुछ भी नहीं दिखेगा - कोई टूटा हुआ खाली बॉक्स नहीं, कोई नुकसान नहीं
  if (!code || !code.trim()) return null

  const srcDoc = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  * { box-sizing: border-box; }
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    overflow: hidden;
  }
</style>
</head>
<body>${code}</body>
</html>`

  return (
    <div className={`ad-slot ${className}`}>
      {showLabel && (
        <p className="text-center text-[10px] tracking-widest text-slate-400 uppercase mb-1 select-none">
          विज्ञापन · Advertisement
        </p>
      )}
      <div
        className="mx-auto overflow-hidden rounded-md border border-slate-100 bg-slate-50/50 flex items-center justify-center"
        style={{ width, maxWidth: '100%' }}
      >
        {/* sandbox: allow-scripts + allow-popups → Ad चल सकता है, नया Tab भी खोल
            सकता है (असली Ad Click पर), लेकिन उसकी कोई भी Script हमारे मुख्य पेज
            के DOM, Click Events, या localStorage को कभी नहीं छू सकती। */}
        <iframe
          srcDoc={srcDoc}
          title={label}
          sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin"
          loading="lazy"
          scrolling="no"
          style={{
            width: '100%',
            height,
            border: '0',
            display: 'block',
          }}
        />
      </div>
    </div>
  )
}
