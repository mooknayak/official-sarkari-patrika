// 🆕 नई फ़ाइल — इसे इसी पाथ पर बनाएं: src/components/StickyBottomAd.tsx
import { client } from '@/sanity/lib/client'
import { SITE_SETTINGS_QUERY } from '@/sanity/lib/queries'
import StickyBottomAdClient from './StickyBottomAdClient'

export default async function StickyBottomAd() {
  const settings = await client.fetch(SITE_SETTINGS_QUERY).catch(() => null)
  const code = settings?.stickyBottomBannerCode
  if (!code || !code.trim()) return null
  return <StickyBottomAdClient code={code} />
}
