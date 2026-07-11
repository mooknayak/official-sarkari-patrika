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

export default function ExpandableGrid({ posts, initialCount = 9, step = 9 }: ExpandableGridProps) {
  const [visibleCount, setVisibleCount] = useState(initialCount)
  const visible = posts.slice(0, visibleCount)
  const hasMore = visibleCount < posts.length
  const canCollapse = visibleCount > initialCount

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 order-1">
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

      {(hasMore || canCollapse) && (
        <div className="flex justify-center gap-3 mt-6 order-2">
          {hasMore && (
            <button
              onClick={() => setVisibleCount((v) => v + step)}
              className="bg-brand-blue text-white text-sm font-semibold px-5 py-2 rounded-md hover:bg-brand-blueDark transition"
            >
              Load More ▼
            </button>
          )}
          {canCollapse && (
            <button
              onClick={() => setVisibleCount(initialCount)}
              className="border border-brand-blue text-brand-blue text-sm font-semibold px-5 py-2 rounded-md hover:bg-brand-blueLight transition"
            >
              Show Less ▲
            </button>
          )}
        </div>
      )}
    </div>
  )
}
