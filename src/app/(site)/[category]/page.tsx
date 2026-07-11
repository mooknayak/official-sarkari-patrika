import { client } from '@/sanity/lib/client'
import { CATEGORY_LISTING_QUERY, CATEGORY_INFO_QUERY } from '@/sanity/lib/queries'
import JobCard from '@/components/JobCard'
import type { Metadata } from 'next'

export const revalidate = 3600

type Props = {
  params: { category: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const info = await client.fetch(CATEGORY_INFO_QUERY, { categorySlug: params.category })
  return {
    title: info?.title ? `${info.title} - Latest Updates` : 'Category',
    description: info?.description,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${params.category}`,
    },
  }
}

export default async function CategoryPage({ params }: Props) {
  const info = await client.fetch(CATEGORY_INFO_QUERY, { categorySlug: params.category })
  const posts = await client.fetch(CATEGORY_LISTING_QUERY, {
    categorySlug: params.category,
    start: 0,
    end: 50,
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy mb-2">{info?.title || params.category}</h1>
      {info?.description && <p className="text-slate-600 mb-6">{info.description}</p>}

      {posts.length === 0 ? (
        <p className="text-slate-500">इस category में अभी कोई पोस्ट उपलब्ध नहीं है।</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {posts.map((post: any) => (
            <JobCard
              key={post._id}
              title={post.title}
              slug={post.slug}
              category={params.category}
              status={post.status}
              organization={post.organization}
              updatedAt={post.updatedAt}
            />
          ))}
        </div>
      )}
    </div>
  )
}
