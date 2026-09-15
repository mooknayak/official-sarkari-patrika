// 🆕 नई फ़ाइल — इसे इसी पाथ पर बनाएं: src/app/(site)/tools/photo-signature-resizer/page.tsx
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { SITE_SETTINGS_QUERY } from '@/sanity/lib/queries'
import AdPoolSlot from '@/components/AdPoolSlot'
import PhotoResizerClient from './PhotoResizerClient'

export const revalidate = 3600

export const metadata = {
  title: 'Photo & Signature Resizer - फोटो साइज़ KB में बदलें | Official Sarkari Patrika',
  description:
    'सरकारी फॉर्म के लिए Photo और Signature को सही KB Size और Pixel Dimension में मुफ़्त में बदलें। कोई Upload नहीं, सब कुछ आपके फ़ोन में ही होता है।',
}

export default async function PhotoResizerPage() {
  const settings = await client.fetch(SITE_SETTINGS_QUERY).catch(() => null)

  return (
    <div>
      <Link href="/tools" className="text-sm text-brand-blue hover:underline">
        ← सभी Tools
      </Link>
      <h1 className="text-xl font-bold text-brand-blueDark mt-2 mb-1">🖼️ Photo & Signature Resizer</h1>
      <p className="text-slate-600 text-sm mb-4">
        अपनी Photo या Signature चुनिए, तय Pixel Size और KB Size में तुरंत Download कीजिए - कोई
        Server पर Upload नहीं होता, सब कुछ आपके ही Device में Process होता है।
      </p>

      <AdPoolSlot codes={settings?.toolsPageAdCodes} width={728} height={90} className="mb-6" />

      <PhotoResizerClient />
    </div>
  )
}
