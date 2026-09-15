// 🆕 नई फ़ाइल — इसे इसी पाथ पर बनाएं: src/app/(site)/tools/page.tsx
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { SITE_SETTINGS_QUERY } from '@/sanity/lib/queries'
import AdPoolSlot from '@/components/AdPoolSlot'
import { TOOLS } from '@/lib/tools'

export const revalidate = 3600

export const metadata = {
  title: 'Official Tools - फॉर्म भरने के लिए ज़रूरी Tools | Official Sarkari Patrika',
  description:
    'Photo & Signature Resizer, Age Calculator, Percentage Calculator, JPG to PDF Converter - सभी सरकारी फॉर्म भरने के लिए ज़रूरी Tools एक जगह, बिल्कुल मुफ़्त।',
}

export default async function ToolsIndexPage() {
  const settings = await client.fetch(SITE_SETTINGS_QUERY).catch(() => null)

  return (
    <div>
      <div className="bg-brand-blueLight border border-blue-100 rounded-lg p-4 mb-6">
        <h1 className="text-xl font-bold text-brand-blueDark mb-1">🛠️ Official Tools</h1>
        <p className="text-slate-600 text-sm">
          सरकारी फॉर्म भरते समय जिन Tools की सबसे ज़्यादा ज़रूरत पड़ती है, वे सब यहाँ एक जगह - बिना
          Login, बिना कहीं Upload किए (सब कुछ आपके ही Device में होता है)।
        </p>
      </div>

      <AdPoolSlot codes={settings?.toolsPageAdCodes} width={728} height={90} className="mb-6" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TOOLS.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="bg-white border border-blue-100 rounded-lg p-4 hover:border-brand-blue hover:shadow-md transition flex items-start gap-3"
          >
            <div className="text-3xl shrink-0">{tool.icon}</div>
            <div>
              <div className="font-bold text-brand-blueDark">{tool.title}</div>
              <div className="text-sm text-slate-600 mt-1">{tool.description}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
