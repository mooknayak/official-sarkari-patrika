// 🆕 नई फ़ाइल — इसे इसी पाथ पर बनाएं: src/app/manifest.ts
// (यह फ़ाइल पहले गलती से डिलीट हो गई थी, अब वापस बनाई गई है + अब Icon भी
// Website Settings में अपलोड किए Logo/Favicon से अपने-आप बनता है, कोई static
// फ़ाइल अपलोड करने की ज़रूरत नहीं)

import type { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'
import { SITE_SETTINGS_QUERY } from '@/sanity/lib/queries'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await client.fetch(SITE_SETTINGS_QUERY).catch(() => null)
  const iconSource = settings?.faviconUrl || settings?.siteLogoUrl

  // Sanity का Image URL Builder असली फ़ाइल को अलग-अलग साइज़ में तुरंत (on-the-fly)
  // बना देता है, इसलिए अलग-अलग resolution की PNG फ़ाइलें खुद अपलोड करने की ज़रूरत नहीं।
  const icons = iconSource
    ? [
        { src: `${iconSource}?w=192&h=192&fit=max&auto=format`, sizes: '192x192', type: 'image/png', purpose: 'any' as const },
        { src: `${iconSource}?w=512&h=512&fit=max&auto=format`, sizes: '512x512', type: 'image/png', purpose: 'any' as const },
        { src: `${iconSource}?w=192&h=192&fit=max&auto=format`, sizes: '192x192', type: 'image/png', purpose: 'maskable' as const },
        { src: `${iconSource}?w=512&h=512&fit=max&auto=format`, sizes: '512x512', type: 'image/png', purpose: 'maskable' as const },
      ]
    : []

  return {
    name: settings?.publisherName
      ? `${settings.publisherName} - सरकारी नौकरी, प्रवेश पत्र और परिणाम`
      : 'Official Sarkari Patrika - सरकारी नौकरी, प्रवेश पत्र और परिणाम',
    short_name: settings?.publisherName || 'Sarkari Patrika',
    description: 'नवीनतम सरकारी नौकरी अधिसूचना, प्रवेश पत्र और परिणाम की सटीक व समय पर जानकारी।',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0B3D91',
    lang: 'hi',
    icons,
  }
}
