import { client } from '@/sanity/lib/client'
import { HOMEPAGE_LATEST_QUERY, CATEGORY_LISTING_QUERY, STATUS_LISTING_QUERY } from '@/sanity/lib/queries'
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
  isNew?: boolean
}

const BOXES = [
  { title: '🟢 Latest Jobs', slug: 'jobs', type: 'status' as const, value: ['job'] },
  { title: '🟡 Admit Card', slug: 'admit-card', type: 'status' as const, value: ['admit_card'] },
  { title: '🔴 Result', slug: 'result', type: 'status' as const, value: ['result', 'final_selection'] },
  { title: '🔵 Answer Key', slug: 'answer-key', type: 'status' as const, value: ['answer_key'] },
  { title: '📄 Documents', slug: 'documents', type: 'category' as const, value: ['documents'] },
  { title: '📌 Important', slug: 'sarkari-yojana', type: 'category' as const, value: ['sarkari-yojana'] },
]

async function getBoxData() {
  const results = await Promise.all(
    BOXES.map((box) =>
      box.type === 'status'
        ? client.fetch(STATUS_LISTING_QUERY, { statusList: box.value, start: 0, end: 15 })
        : client.fetch(CATEGORY_LISTING_QUERY, { categorySlug: box.value[0], start: 0, end: 15 })
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
          Official Sarkari Patrika - नवीनतम सरकारी नौकरी, प्रवेश पत्र व परिणाम
        </h1>
        <p className="text-slate-600 text-sm">
          यहाँ आपको सभी सरकारी विभागों की ताज़ा भर्ती अधिसूचनाएँ, प्रवेश पत्र और परिणाम की सटीक और
          समय पर जानकारी मिलेगी।
        </p>
      </div>

      {/* 6-Box Category Grid - मोबाइल पर 2 कॉलम, डेस्कटॉप पर 3 कॉलम, सभी बॉक्स बराबर ऊँचाई के */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-10 items-stretch">
        {boxes.map((box) => (
          <CategoryBox
            key={box.slug}
            title={box.title}
            categorySlug={box.slug}
            items={box.items.map((i: any) => ({
              title: i.title,
              slug: i.slug,
              category: i.category || box.value[0],
              isNew: i.isNew,
            }))}
          />
        ))}
      </div>

      {/* नवीनतम अपडेट - सिर्फ सबसे लेटेस्ट 1 पोस्ट */}
      <h2 className="text-lg font-bold text-brand-blueDark mb-4 border-l-4 border-brand-pinkAccent pl-3">
        नवीनतम अपडेट
      </h2>

      {posts.length === 0 ? (
        <p className="text-slate-500">फिलहाल कोई पोस्ट उपलब्ध नहीं है। कृपया Sanity Studio से पोस्ट जोड़ें।</p>
      ) : (
        <div className="max-w-sm">
          <JobCard
            title={posts[0].title}
            slug={posts[0].slug}
            category={posts[0].category}
            status={posts[0].status}
            organization={posts[0].organization}
            updatedAt={posts[0].updatedAt}
            isNew={posts[0].isNew}
          />
        </div>
      )}
    </div>
  )
}
