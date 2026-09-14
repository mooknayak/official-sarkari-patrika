// 🆕 नई फ़ाइल — इसे इसी पाथ पर बनाएं: src/components/InterstitialAd.tsx
import { client } from '@/sanity/lib/client'
import { SITE_SETTINGS_QUERY } from '@/sanity/lib/queries'
import InterstitialAdClient from './InterstitialAdClient'

export default async function InterstitialAd() {
  const settings = await client.fetch(SITE_SETTINGS_QUERY).catch(() => null)
  const code = settings?.interstitialAdCode
  if (!code || !code.trim()) return null
  return <InterstitialAdClient code={code} />
}
