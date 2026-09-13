import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CookieConsent from '@/components/CookieConsent'
import PushNotificationPrompt from '@/components/PushNotificationPrompt'
import StickyBottomAd from '@/components/StickyBottomAd'

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      {/* pb-16: नीचे की जगह ताकि 3️⃣ Sticky Bottom Banner किसी कंटेंट के ऊपर न चढ़े */}
      <main className="min-h-screen max-w-5xl mx-auto px-4 py-6 pb-16">{children}</main>
      <Footer />
      <CookieConsent />
      <PushNotificationPrompt />
      {/* 3️⃣ Sticky Bottom Banner - Sanity → Website Settings → 💰 AdSense से मैनेज होता है */}
      <StickyBottomAd />
    </>
  )
}
