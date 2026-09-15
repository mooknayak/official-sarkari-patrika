// 🆕 नई फ़ाइल — इसे इसी पाथ पर बनाएं: src/app/(site)/tools/percentage-calculator/page.tsx
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { SITE_SETTINGS_QUERY } from '@/sanity/lib/queries'
import AdPoolSlot from '@/components/AdPoolSlot'
import PercentageCalculatorClient from './PercentageCalculatorClient'

export const revalidate = 3600

export const metadata = {
  title: 'Percentage / CGPA Calculator | Official Sarkari Patrika',
  description: 'Marks से Percentage, या CGPA से Percentage तुरंत निकालें - फॉर्म भरते समय Eligibility जाँचने के लिए।',
}

export default async function PercentageCalculatorPage() {
  const settings = await client.fetch(SITE_SETTINGS_QUERY).catch(() => null)

  return (
    <div>
      <Link href="/tools" className="text-sm text-brand-blue hover:underline">
        ← सभी Tools
      </Link>
      <h1 className="text-xl font-bold text-brand-blueDark mt-2 mb-1">📊 Percentage / CGPA Calculator</h1>
      <p className="text-slate-600 text-sm mb-4">
        Marks से Percentage निकालिए, या CGPA को Percentage में बदलिए - दोनों तरीके नीचे उपलब्ध हैं।
      </p>

      <AdPoolSlot codes={settings?.toolsPageAdCodes} width={728} height={90} className="mb-6" />

      <PercentageCalculatorClient />
    </div>
  )
}
