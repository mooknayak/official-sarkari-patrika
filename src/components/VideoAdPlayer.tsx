// 🆕 नई फ़ाइल — इसे इसी पाथ पर बनाएं: src/components/VideoAdPlayer.tsx
//
// Video Ads के लिए कोई npm Library Install करने की ज़रूरत नहीं - Google खुद
// एक Free, Official "IMA SDK" (Interactive Media Ads) देता है, जो हर बड़े Ad
// Network (AdSense for Video, Monetag Video, वग़ैरह) के VAST Tag के साथ काम
// करता है। यहाँ बस Sanity से मिला हुआ VAST Tag URL इसमें डाल दिया जाता है।
'use client'

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'

export default function VideoAdPlayer({ vastTagUrl }: { vastTagUrl?: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const adContainerRef = useRef<HTMLDivElement | null>(null)
  const [sdkReady, setSdkReady] = useState(false)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    if (!sdkReady || !vastTagUrl || !videoRef.current || !adContainerRef.current) return

    // @ts-ignore - imasdk.googleapis.com/js/sdkloader/ima3.js से मिलती है
    const google = (window as any).google
    if (!google?.ima) return

    const adDisplayContainer = new google.ima.AdDisplayContainer(adContainerRef.current, videoRef.current)
    const adsLoader = new google.ima.AdsLoader(adDisplayContainer)
    let adsManager: any = null

    const onAdsManagerLoaded = (adsManagerLoadedEvent: any) => {
      adsManager = adsManagerLoadedEvent.getAdsManager(videoRef.current)
      adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, () => setFinished(true))
      adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, () => setFinished(true))
      try {
        adDisplayContainer.initialize()
        const width = videoRef.current?.clientWidth || 640
        const height = videoRef.current?.clientHeight || 360
        adsManager.init(width, height, google.ima.ViewMode.NORMAL)
        adsManager.start()
      } catch {
        setFinished(true)
      }
    }

    adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, onAdsManagerLoaded)
    adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, () => setFinished(true))

    const adsRequest = new google.ima.AdsRequest()
    adsRequest.adTagUrl = vastTagUrl
    adsRequest.linearAdSlotWidth = videoRef.current.clientWidth || 640
    adsRequest.linearAdSlotHeight = videoRef.current.clientHeight || 360
    adsRequest.nonLinearAdSlotWidth = videoRef.current.clientWidth || 640
    adsRequest.nonLinearAdSlotHeight = 150

    adsLoader.requestAds(adsRequest)

    return () => {
      try {
        adsManager?.destroy()
      } catch {
        // ignore
      }
    }
  }, [sdkReady, vastTagUrl])

  // VAST Tag नहीं है, या Ad ख़त्म हो चुका है - Player ग़ायब हो जाता है, कोई खाली काला बॉक्स नहीं रहता
  if (!vastTagUrl || finished) return null

  return (
    <>
      <Script
        src="https://imasdk.googleapis.com/js/sdkloader/ima3.js"
        strategy="afterInteractive"
        onLoad={() => setSdkReady(true)}
      />
      <p className="text-center text-[10px] tracking-widest text-slate-400 uppercase mb-1 select-none">
        विज्ञापन · Advertisement
      </p>
      <div className="relative w-full max-w-2xl mx-auto aspect-video bg-black rounded-md overflow-hidden mb-6">
        <video ref={videoRef} className="w-full h-full" playsInline />
        <div ref={adContainerRef} className="absolute inset-0" />
      </div>
    </>
  )
}
