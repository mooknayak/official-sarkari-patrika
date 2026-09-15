// 🆕 नई फ़ाइल — इसे इसी पाथ पर बनाएं: src/app/(site)/tools/resume-builder/page.tsx
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { SITE_SETTINGS_QUERY } from '@/sanity/lib/queries'
import AdPoolSlot from '@/components/AdPoolSlot'
import ResumeBuilderClient from './ResumeBuilderClient'

export const revalidate = 3600

export const metadata = {
  title: 'Resume / CV Builder - मुफ़्त में Professional Resume बनाएं | Official Sarkari Patrika',
  description:
    'अपनी जानकारी भरिए और सेकंडों में एक साफ़-सुथरा, Professional Resume/CV बनाइए - सीधे PDF में Download कीजिए, कोई Login नहीं।',
}

export default async function ResumeBuilderPage() {
  const settings = await client.fetch(SITE_SETTINGS_QUERY).catch(() => null)

  return (
    <div>
      <Link href="/tools" className="text-sm text-brand-blue hover:underline">
        ← सभी Tools
      </Link>
      <h1 className="text-xl font-bold text-brand-blueDark mt-2 mb-1">📝 Resume / CV Builder</h1>
      <p className="text-slate-600 text-sm mb-4">
        नीचे अपनी जानकारी भरिए - दाईं तरफ़ (Mobile पर नीचे) आपका Resume Live बनता दिखेगा। पूरा होने
        पर &quot;Print / Save as PDF&quot; दबाकर PDF के रूप में Download कर लीजिए।
      </p>

      <AdPoolSlot codes={settings?.toolsPageAdCodes} width={728} height={90} className="mb-6" />

      <ResumeBuilderClient />
    </div>
  )
}
