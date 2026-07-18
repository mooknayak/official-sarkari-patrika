import Link from 'next/link'

type TrendingPost = {
  title: string
  slug: string
  category: string
  status: string
}

// 6 अलग-अलग जीवंत रंग - बिल्कुल Sarkari Exam जैसे मॉडल के लिए
const COLORS = [
  'bg-red-600',
  'bg-orange-500',
  'bg-fuchsia-600',
  'bg-blue-600',
  'bg-amber-700',
  'bg-emerald-700',
]

export default function TrendingBoxes({ posts }: { posts: TrendingPost[] }) {
  if (!posts || posts.length === 0) return null

  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold text-brand-blueDark mb-3 flex items-center gap-1.5">
        🔥 सबसे ज़्यादा देखी जा रही पोस्ट
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {posts.map((post, idx) => (
          <Link
            key={post.slug}
            href={`/${post.category}/${post.slug}`}
            className={`${COLORS[idx % COLORS.length]} text-white rounded-lg p-4 flex items-center justify-center text-center font-bold text-sm leading-snug min-h-[92px] shadow-md hover:opacity-90 hover:scale-[1.02] transition`}
          >
            {post.title}
          </Link>
        ))}
      </div>
    </section>
  )
}
