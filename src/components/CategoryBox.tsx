'use client'

import { useState } from 'react'
import Link from 'next/link'

type Item = {
  title: string
  slug: string
  category?: string
  isNew?: boolean
}

type CategoryBoxProps = {
  title: string
  categorySlug: string
  items: Item[]
}

const INITIAL_COUNT = 5

export default function CategoryBox({ title, categorySlug, items }: CategoryBoxProps) {
  const [expanded, setExpanded] = useState(false)
  const visibleItems = expanded ? items : items.slice(0, INITIAL_COUNT)
  const hasMore = items.length > INITIAL_COUNT

  return (
    <div className="border border-blue-100 rounded-lg overflow-hidden bg-white flex flex-col h-full shadow-sm">
      <div className="bg-brand-blue text-white px-4 py-3">
        <h2 className="font-bold text-base tracking-wide whitespace-nowrap overflow-hidden text-ellipsis">
          {title}
        </h2>
        <div className="flex justify-end mt-1">
          <Link
            href={`/${categorySlug}`}
            className="text-xs text-brand-pink hover:text-white font-medium whitespace-nowrap"
          >
            View All &rarr;
          </Link>
        </div>
      </div>

      <ul className="divide-y divide-blue-200 flex-1">
        {items.length === 0 && (
          <li className="px-4 py-10 text-sm text-slate-400 text-center">Updates coming soon</li>
        )}
        {visibleItems.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/${item.category || categorySlug}/${item.slug}`}
              className="flex items-start gap-2 px-4 py-3 text-sm leading-snug hover:bg-brand-pink/40 transition"
            >
              {item.isNew && (
                <span className="mt-0.5 flex-shrink-0 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded animate-pulse">
                  NEW
                </span>
              )}
              <span className="link-glow underline underline-offset-2 hover:text-brand-pinkAccent">
                {item.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-center text-xs font-semibold text-brand-blue hover:bg-brand-blueLight py-3 border-t border-blue-50 transition mt-auto order-last"
        >
          {expanded ? '▲ Show Less' : `▼ Load More (${items.length - INITIAL_COUNT} more)`}
        </button>
      )}
    </div>
  )
}
