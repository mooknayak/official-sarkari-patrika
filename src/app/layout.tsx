import type { Metadata } from 'next'
import Script from 'next/script'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import './globals.css'

const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://officialsarkaripatrika.com'),
  title: {
    default: 'Official Sarkari Patrika - सरकारी नौकरी, प्रवेश पत्र और परिणाम',
    template: '%s | Official Sarkari Patrika',
  },
  description:
    'नवीनतम सरकारी नौकरी अधिसूचना, प्रवेश पत्र और परिणाम की सटीक व समय पर जानकारी।',
  alternates: {
    types: {
      'application/rss+xml': [{ url: '/rss.xml', title: 'Official Sarkari Patrika RSS Feed' }],
    },
  },
  // AdSense साइट-वेरिफिकेशन के लिए (जब आप Client ID डालेंगे तभी यह टैग दिखेगा)
  ...(ADSENSE_CLIENT_ID && {
    other: { 'google-adsense-account': ADSENSE_CLIENT_ID },
  }),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hi">
      <body>
        <GoogleAnalytics />
        {children}

        {/* AdSense Script - सिर्फ तभी लोड होगी जब NEXT_PUBLIC_ADSENSE_CLIENT_ID env variable सेट हो */}
        {ADSENSE_CLIENT_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  )
}
