import { client } from '@/sanity/lib/client'
import { ORGANIZATION_INFO_QUERY, ORGANIZATION_POSTS_QUERY } from '@/sanity/lib/queries'
import ExpandableGrid from '@/components/ExpandableGrid'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const revalidate = 3600

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const org = await client.fetch(ORGANIZATION_INFO_QUERY, { orgSlug: params.slug })
  if (!org) return {}

  return {
    title: `${org.name} - सभी भर्ती, प्रवेश पत्र व परिणाम`,
    description: org.about || `${org.name} की सभी नवीनतम भर्ती, प्रवेश पत्र और परिणाम की जानकारी।`,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/organization/${params.slug}`,
    },
  }
}

export default async function OrganizationPage({ params }: Props) {
  const org = await client.fetch(ORGANIZATION_INFO_QUERY, { orgSlug: params.slug })
  if (!org) return notFound()

  const posts = await client.fetch(ORGANIZATION_POSTS_QUERY, { orgSlug: params.slug })

  return (
    <div>
      <div className="bg-brand-blueLight border border-blue-100 rounded-lg p-4 mb-6">
        <h1 className="text-xl font-bold text-brand-blueDark mb-1">{org.name}</h1>
        {org.about && <p className="text-slate-600 text-sm">{org.about}</p>}
        {org.website && (
          <a
            href={org.website}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="text-sm text-brand-pinkAccent underline mt-2 inline-block"
          >
            आधिकारिक वेबसाइट देखें →
          </a>
        )}
      </div>

      <h2 className="text-lg font-bold text-brand-blueDark mb-4 border-l-4 border-brand-pinkAccent pl-3">
        {org.name} - सभी पोस्ट
      </h2>

      {posts.length === 0 ? (
        <p className="text-slate-500">इस संगठन की अभी कोई पोस्ट उपलब्ध नहीं है।</p>
      ) : (
        <ExpandableGrid posts={posts} initialCount={12} step={12} />
      )}
    </div>
  )
}
