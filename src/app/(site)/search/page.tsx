import { client } from '@/sanity/lib/client'
import { SEARCH_QUERY } from '@/sanity/lib/queries'
import ExpandableGrid from '@/components/ExpandableGrid'
import type { Metadata } from 'next'

type Props = {
  searchParams: { q?: string }
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const q = searchParams.q?.trim() || ''
  return {
    title: q ? `Search results for "${q}"` : 'Search',
    robots: { index: false, follow: true },
  }
}

export default async function SearchPage({ searchParams }: Props) {
  const query = searchParams.q?.trim() || ''
  const results = query ? await client.fetch(SEARCH_QUERY, { searchTerm: query }) : []

  return (
    <div>
      <h1 className="text-xl font-bold text-brand-blueDark mb-4">
        खोज परिणाम {query && <span className="text-slate-500 font-normal"> - &quot;{query}&quot;</span>}
      </h1>

      {!query && (
        <p className="text-slate-500">कृपया ऊपर दिए गए Search बॉक्स में कुछ लिखकर खोजें।</p>
      )}

      {query && results.length === 0 && (
        <p className="text-slate-500">इस keyword से कोई पोस्ट नहीं मिली। कोई और शब्द आज़माएँ।</p>
      )}

      {results.length > 0 && (
        <ExpandableGrid
          posts={results.map((r: any, idx: number) => ({
            _id: r.slug + idx,
            title: r.title,
            slug: r.slug,
            category: r.category,
            status: r.status,
          }))}
          initialCount={12}
          step={12}
        />
      )}
    </div>
  )
}
