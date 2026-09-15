// 🆕 नई फ़ाइल — इसे इसी पाथ पर बनाएं: src/app/(site)/tools/jpg-to-pdf/page.tsx
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { SITE_SETTINGS_QUERY } from '@/sanity/lib/queries'
import AdPoolSlot from '@/components/AdPoolSlot'
import JpgToPdfClient from './JpgToPdfClient'

export const revalidate = 3600

export const metadata = {
  title: 'JPG to PDF Converter - फोटो को PDF बनाएं | Official Sarkari Patrika',
  description: 'फॉर्म में Upload करने के लिए Photo/Document की Image को मुफ़्त में PDF में बदलें।',
}

export default async function JpgToPdfPage() {
  const settings = await client.fetch(SITE_SETTINGS_QUERY).catch(() => null)

  return (
    <div>
      <Link href="/tools" className="text-sm text-brand-blue hover:underline">
        ← सभी Tools
      </Link>
      <h1 className="text-xl font-bold text-brand-blueDark mt-2 mb-1">📄 JPG to PDF Converter</h1>
      <p className="text-slate-600 text-sm mb-4">
        एक या कई Photo चुनिए, फिर नीचे &quot;Print / Save as PDF&quot; दबाइए - खुलने वाले Print
        Dialog में &quot;Destination&quot; या &quot;Printer&quot; की जगह <b>Save as PDF</b> चुनकर
        Save कर लीजिए।
      </p>

      <AdPoolSlot codes={settings?.toolsPageAdCodes} width={728} height={90} className="mb-6" />

      <JpgToPdfClient />
    </div>
  )
}
