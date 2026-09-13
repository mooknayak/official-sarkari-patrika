// 🆕 नई फ़ाइल — इसे इसी पाथ पर बनाएं: src/components/AdUnit.tsx
import AdSlot from './AdSlot'
import AdSenseUnit from './AdSenseUnit'

export type AdUnitData = {
  network?: 'custom' | 'adsense'
  code?: string
  adSenseSlotId?: string
}

export default function AdUnit({
  unit,
  adsenseClientId,
  width = 300,
  height = 100,
}: {
  unit?: AdUnitData
  adsenseClientId?: string
  width?: number | string
  height?: number
}) {
  if (!unit) return null

  // 🟦 AdSense: असली DOM में (सुरक्षित, Google का अपना Sandbox अंदर ही है)
  if (unit.network === 'adsense') {
    if (!unit.adSenseSlotId) return null
    return (
      <div className="ad-slot">
        <p className="text-center text-[10px] tracking-widest text-slate-400 uppercase mb-1 select-none">
          विज्ञापन · Advertisement
        </p>
        <div className="mx-auto overflow-hidden" style={{ width, maxWidth: '100%' }}>
          <AdSenseUnit clientId={adsenseClientId} slotId={unit.adSenseSlotId} height={height} />
        </div>
      </div>
    )
  }

  // 🖥️ Monetag / Custom: हमारे sandbox iframe (AdSlot) में - Click Hijack से सुरक्षित
  return <AdSlot code={unit.code} width={width} height={height} />
}
