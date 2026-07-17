import { client } from '@/sanity/lib/client'
import { ALL_ORGANIZATIONS_QUERY } from '@/sanity/lib/queries'
import Link from 'next/link'
import type { Metadata } from 'next'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'सभी सरकारी संगठन (Organizations)',
  description: 'UPSC, SSC, Railway, Banking जैसे सभी सरकारी विभागों की भर्ती सूची एक ही जगह।',
}

export default async function OrganizationsIndexPage() {
  const organizations: { name: string; slug: string; postCount: number }[] = await client.fetch(
    ALL_ORGANIZATIONS_QUERY
  )

  return (
    <div>
      <h1 className="text-xl font-bold text-brand-blueDark mb-2">सभी सरकारी संगठन</h1>
      <p className="text-slate-600 text-sm mb-6">
        किसी भी संगठन पर टैप करके उसकी सभी नौकरी, प्रवेश पत्र और परिणाम की जानकारी देखें।
      </p>

      {organizations.length === 0 ? (
        <p className="text-slate-500">अभी कोई संगठन जोड़ा नहीं गया है।</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {organizations.map((org) => (
            <Link
              key={org.slug}
              href={`/organization/${org.slug}`}
              className="border border-blue-100 rounded-lg p-4 bg-white hover:border-brand-blue hover:shadow-md transition"
            >
              <h2 className="font-semibold link-glow underline underline-offset-2">{org.name}</h2>
              <p className="text-xs text-slate-400 mt-1">{org.postCount} पोस्ट</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
