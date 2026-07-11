import { client } from '@/sanity/lib/client'
import { HOMEPAGE_LATEST_QUERY, CATEGORY_LISTING_QUERY } from '@/sanity/lib/queries'
import JobCard from '@/components/JobCard'
import CategoryBox from '@/components/CategoryBox'

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

const BOXES = [
  { title: '🟢 Latest Jobs', slug: 'jobs' },
  { title: '🟡 Admit Card', slug: 'admit-card' },
  { title: '🔴 Result', slug: 'result' },
  { title: '🔵 Answer Key', slug: 'answer-key' },
  { title: '📘 Syllabus', slug: 'syllabus' },
  { title: '🎓 Admission', slug: 'admission' },
]

async function getBoxData() {
  const results = await Promise.all(
    BOXES.map((box) =>
      client.fetch(CATEGORY_LISTING_QUERY, { categorySlug: box.slug, start: 0, end: 5 })
    )
  )
  return BOXES.map((box, idx) => ({ ...box, items: results[idx] || [] }))
}

export default async function HomePage() {
  const [posts, boxes]: [Post[], any[]] = await Promise.all([
    client.fetch(HOMEPAGE_LATEST_QUERY),
    getBoxData(),
  ])

  return (
    <div>
      <div className="bg-brand-blueLight border border-blue-100 rounded-lg p-4 mb-6">
        <h1 className="text-xl font-bold text-brand-blueDark mb-1">
          Official Sarkari Patrika — नवीनतम सरकारी नौकरी, प्रवेश पत्र व परिणाम
        </h1>
        <p className="text-slate-600 text-sm">
          यहाँ आपको सभी सरकारी विभागों की ताज़ा भर्ती अधिसूचनाएँ, प्रवेश पत्र और परिणाम की सटीक और
          समय पर जानकारी मिलेगी।
        </p>
      </div>

      {/* 6-Box Category Grid — Sarkari Result मॉडल */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {boxes.map((box) => (
          <CategoryBox
            key={box.slug}
            title={box.title}
            categorySlug={box.slug}
            items={box.items.map((i: any) => ({ title: i.title, slug: i.slug, category: box.slug }))}
          />
        ))}
      </div>

      {/* नवीनतम अपडेट */}
      <h2 className="text-lg font-bold text-brand-blueDark mb-4 border-l-4 border-brand-pinkAccent pl-3">
        नवीनतम अपडेट
      </h2>

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
