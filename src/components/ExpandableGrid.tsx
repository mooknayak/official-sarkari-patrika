'use client'

import { useState } from 'react'
import JobCard from './JobCard'

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

type ExpandableGridProps = {
  posts: Post[]
  initialCount?: number
  step?: number
}

const PER_PAGE = 12

export default function ExpandableGrid({ posts, initialCount = PER_PAGE }: ExpandableGridProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = initialCount || PER_PAGE
  const totalPages = Math.ceil(posts.length / perPage)

  const start = (currentPage - 1) * perPage
  const visible = posts.slice(start, start + perPage)

  const goToPage = (page: number) => {
    setCurrentPage(page)
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // सिर्फ 2 पेज तक होने पर सामान्य rendering, ज़्यादा होने पर छोटे नंबर दिखाना
  // जैसे: 1 2 3 ... 8 9 10 (शुरुआत, आस-पास, आखिर)
  const getPageNumbers = () => {
    const pages: (number | 'dots')[] = []
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i)
      } else if (pages[pages.length - 1] !== 'dots') {
        pages.push('dots')
      }
    }
    return pages
  }

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {visible.map((post) => (
          <JobCard
            key={post._id}
            title={post.title}
            slug={post.slug}
            category={post.category}
            status={post.status}
            organization={post.organization}
            updatedAt={post.updatedAt}
            isNew={post.isNew}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1.5 mt-6 flex-wrap">
          <button
            onClick={() => goToPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-sm rounded-md border border-slate-300 text-slate-600 disabled:opacity-40 hover:bg-brand-blueLight transition"
          >
            ← पिछला
          </button>

          {getPageNumbers().map((page, idx) =>
            page === 'dots' ? (
              <span key={`dots-${idx}`} className="px-1 text-slate-400 text-sm">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`w-9 h-9 text-sm rounded-md transition ${
                  page === currentPage
                    ? 'bg-brand-blue text-white font-bold'
                    : 'border border-slate-300 text-slate-600 hover:bg-brand-blueLight'
                }`}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 text-sm rounded-md border border-slate-300 text-slate-600 disabled:opacity-40 hover:bg-brand-blueLight transition"
          >
            अगला →
          </button>
        </div>
      )}
    </div>
  )
}
