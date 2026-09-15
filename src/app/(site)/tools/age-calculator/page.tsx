// 🆕 नई फ़ाइल — इसे इसी पाथ पर बनाएं: src/app/(site)/tools/age-calculator/page.tsx
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { SITE_SETTINGS_QUERY } from '@/sanity/lib/queries'
import AdPoolSlot from '@/components/AdPoolSlot'
import AgeCalculatorClient from './AgeCalculatorClient'

export const revalidate = 3600

export const metadata = {
  title: 'Age Calculator - सरकारी फॉर्म के लिए उम्र निकालें | Official Sarkari Patrika',
  description: 'जन्म तारीख और Cut-off Date डालकर सटीक उम्र (वर्ष-महीना-दिन) निकालें - भर्ती की Age Eligibility जाँचने के लिए।',
}

export default async function AgeCalculatorPage() {
  const settings = await client.fetch(SITE_SETTINGS_QUERY).catch(() => null)

  return (
    <div>
      <Link href="/tools" className="text-sm text-brand-blue hover:underline">
        ← सभी Tools
      </Link>
      <h1 className="text-xl font-bold text-brand-blueDark mt-2 mb-1">📅 Age Calculator</h1>
      <p className="text-slate-600 text-sm mb-4">
        अपनी जन्म तारीख डालिए और किस तारीख तक उम्र निकालनी है (जैसे भर्ती की Cut-off Date) वो चुनिए
        - सटीक वर्ष, महीना और दिन तुरंत मिल जाएगा।
      </p>

      <AdPoolSlot codes={settings?.toolsPageAdCodes} width={728} height={90} className="mb-6" />

      <AgeCalculatorClient />
    </div>
  )
}
