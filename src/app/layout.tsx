// ✏️ एडिट फ़ाइल — मौजूदा फाइल में बदलें: src/app/layout.tsx
import type { Metadata } from 'next'
import Script from 'next/script'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import { client } from '@/sanity/lib/client'
import { SITE_SETTINGS_QUERY } from '@/sanity/lib/queries'
import './globals.css'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://officialsarkaripatrika.com'

// Website Settings (Sanity) पूरी साइट में हर पेज पर चाहिए (Favicon, Verification,
// Organization Schema के लिए), इसलिए यहीं एक बार fetch करके नीचे metadata और
// JSON-LD दोनों में इस्तेमाल किया गया है।
async function getSiteSettings() {
  return client.fetch(SITE_SETTINGS_QUERY).catch(() => null)
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  // Studio में डाला हुआ AdSense ID हमेशा env variable से ऊपर प्राथमिकता में रहता है
  const adsenseId = settings?.adsensePublisherId || process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID
  const faviconUrl = settings?.faviconUrl || settings?.siteLogoUrl

  return {
    metadataBase: new URL(SITE_URL),
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
    // 🆕 पूरी साइट के लिए Default Open Graph/Twitter Image - Homepage, Category
    // पेज, या कोई भी पेज जहाँ अपनी खुद की Metadata सेट नहीं है, उसे शेयर करने पर
    // अब हमेशा यह Branded Thumbnail दिखेगा (WhatsApp, Facebook, Telegram वगैरह में)
    openGraph: {
      siteName: settings?.publisherName || 'Official Sarkari Patrika',
      locale: 'hi_IN',
      type: 'website',
      images: [{ url: '/og-default.png', width: 1200, height: 630, alt: settings?.publisherName || 'Official Sarkari Patrika' }],
    },
    twitter: {
      card: 'summary_large_image',
      images: ['/og-default.png'],
    },
    // Website Settings में अपलोड किया Favicon/Logo - Search Result और Browser Tab दोनों में दिखेगा
    ...(faviconUrl && {
      icons: {
        icon: [
          { url: `${faviconUrl}?w=32&h=32&fit=max&auto=format`, sizes: '32x32', type: 'image/png' },
          { url: `${faviconUrl}?w=192&h=192&fit=max&auto=format`, sizes: '192x192', type: 'image/png' },
        ],
        apple: `${faviconUrl}?w=180&h=180&fit=max&auto=format`,
      },
    }),
    // Google/Bing Search Console Verification - Website Settings से (कोई अलग HTML फ़ाइल अपलोड करने की ज़रूरत नहीं)
    verification: {
      google: settings?.googleSiteVerification || undefined,
      other: settings?.bingSiteVerification
        ? { 'msvalidate.01': settings.bingSiteVerification }
        : undefined,
    },
    // AdSense साइट-वेरिफिकेशन के लिए (जब आप Client ID डालेंगे तभी यह टैग दिखेगा)
    ...(adsenseId && {
      other: { 'google-adsense-account': adsenseId },
    }),
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSiteSettings()
  const adsenseId = settings?.adsensePublisherId || process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID

  // 🌐 पूरी साइट के लिए एक बार Organization Schema - Google Knowledge Panel,
  // Search Result में Logo और Sitelinks Search Box दिखाने में मदद करता है।
  const socialLinks = settings?.socialLinks || {}
  const sameAs = Object.values(socialLinks).filter(Boolean)
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings?.publisherName || 'Official Sarkari Patrika',
    url: SITE_URL,
    ...(settings?.siteLogoUrl && { logo: settings.siteLogoUrl }),
    ...(sameAs.length > 0 && { sameAs }),
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: settings?.publisherName || 'Official Sarkari Patrika',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <html lang="hi">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <GoogleAnalytics />
        {children}

        {/* AdSense Script - सिर्फ तभी लोड होगी जब Client ID (Studio या env) सेट हो */}
        {adsenseId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  )
}
