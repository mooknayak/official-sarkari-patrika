import { client } from '@/sanity/lib/client'
import { CATEGORY_LISTING_QUERY, CATEGORY_INFO_QUERY, STATUS_LISTING_QUERY } from '@/sanity/lib/queries'
import ExpandableGrid from '@/components/ExpandableGrid'
import type { Metadata } from 'next'

export const revalidate = 3600

type Props = {
  params: { category: string }
}

const STATUS_SLUG_MAP: Record<string, string[]> = {
  jobs: ['job'],
  'admit-card': ['admit_card'],
  result: ['result', 'final_selection'],
  'answer-key': ['answer_key'],
}

async function getPosts(category: string) {
  const isStatusDriven = category in STATUS_SLUG_MAP
  const posts = isStatusDriven
    ? await client.fetch(STATUS_LISTING_QUERY, {
        statusList: STATUS_SLUG_MAP[category],
        start: 0,
        end: 100,
      })
    : await client.fetch(CATEGORY_LISTING_QUERY, {
        categorySlug: category,
        start: 0,
        end: 100,
      })
  return posts
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const info = await client.fetch(CATEGORY_INFO_QUERY, { categorySlug: params.category })
  const posts = await getPosts(params.category)

  return {
    title: info?.title ? `${info.title} - Latest Updates` : 'Category',
    description: info?.description,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${params.category}`,
    },
    // जब तक इस category में कोई पोस्ट न हो, इसे Google में index न होने दें
    // ताकि "thin content" के तौर पर पेनल्टी न लगे
    robots: posts.length === 0 ? { index: false, follow: true } : { index: true, follow: true },
  }
}

export default async function CategoryPage({ params }: Props) {
  const info = await client.fetch(CATEGORY_INFO_QUERY, { categorySlug: params.category })
  const posts = await getPosts(params.category)

  const normalizedPosts = posts.map((p: any) => ({
    ...p,
    category: p.category || params.category,
  }))

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-blueDark mb-2">{info?.title || params.category}</h1>
      {info?.description && <p className="text-slate-600 mb-6">{info.description}</p>}

      {normalizedPosts.length === 0 ? (
        <p className="text-slate-500">इस category में अभी कोई पोस्ट उपलब्ध नहीं है।</p>
      ) : (
        <ExpandableGrid posts={normalizedPosts} initialCount={12} step={12} />
      )}
    </div>
  )
}
