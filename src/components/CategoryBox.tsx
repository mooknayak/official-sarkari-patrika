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
      <div className="bg-brand-blue text-white px-4 py-2.5 flex items-center justify-between">
        <h2 className="font-bold text-sm tracking-wide">{title}</h2>
        <Link
          href={`/${categorySlug}`}
          className="text-xs text-brand-pink hover:text-white font-medium whitespace-nowrap"
        >
          View All →
        </Link>
      </div>

      <ul className="divide-y divide-blue-50 flex-1">
        {items.length === 0 && (
          <li className="px-4 py-8 text-sm text-slate-400 text-center">Updates coming soon</li>
        )}
        {visibleItems.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/${item.category || categorySlug}/${item.slug}`}
              className="flex items-start gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-brand-pink/40 hover:text-brand-blueDark transition leading-snug"
            >
              {item.isNew && (
                <span className="mt-0.5 flex-shrink-0 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded animate-pulse">
                  NEW
                </span>
              )}
              <span>{item.title}</span>
            </Link>
          </li>
        ))}
      </ul>

      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-center text-xs font-semibold text-brand-blue hover:bg-brand-blueLight py-2.5 border-t border-blue-50 transition"
        >
          {expanded ? '▲ Show Less' : `▼ Load More (${items.length - INITIAL_COUNT} more)`}
        </button>
      )}
    </div>
  )
}
