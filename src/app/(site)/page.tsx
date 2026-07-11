import { client } from '@/sanity/lib/client'
import { HOMEPAGE_LATEST_QUERY } from '@/sanity/lib/queries'
import JobCard from '@/components/JobCard'

export const revalidate = 3600

type Post = {
  _id: string
  title: string
  slug: string
  status: string
  category: string
  organization?: string
  updatedAt?: string
}

export default async function HomePage() {
  const posts: Post[] = await client.fetch(HOMEPAGE_LATEST_QUERY)

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy mb-2">
        Official Sarkari Patrika — नवीनतम सरकारी नौकरी, प्रवेश पत्र व परिणाम
      </h1>
      <p className="text-slate-600 mb-6">
        यहाँ आपको सभी सरकारी विभागों की ताज़ा भर्ती अधिसूचनाएँ, प्रवेश पत्र और परिणाम की सटीक और
        समय पर जानकारी मिलेगी।
      </p>

      {posts.length === 0 ? (
        <p className="text-slate-500">फिलहाल कोई पोस्ट उपलब्ध नहीं है। कृपया Sanity Studio से पोस्ट जोड़ें।</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {posts.map((post) => (
            <JobCard
              key={post._id}
              title={post.title}
              slug={post.slug}
              category={post.category}
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
