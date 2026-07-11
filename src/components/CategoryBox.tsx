import Link from 'next/link'

type Item = {
  title: string
  slug: string
  category?: string
}

type CategoryBoxProps = {
  title: string
  categorySlug: string
  items: Item[]
}

export default function CategoryBox({ title, categorySlug, items }: CategoryBoxProps) {
  return (
    <div className="border border-blue-100 rounded-lg overflow-hidden bg-white flex flex-col h-full">
      <div className="bg-brand-blue text-white px-4 py-2 flex items-center justify-between">
        <h2 className="font-bold text-sm">{title}</h2>
        <Link
          href={`/${categorySlug}`}
          className="text-xs text-brand-pink hover:text-white font-medium"
        >
          सभी देखें →
        </Link>
      </div>
      <ul className="divide-y divide-blue-50 flex-1">
        {items.length === 0 && (
          <li className="px-4 py-4 text-sm text-slate-400">जल्द ही अपडेट होगा</li>
        )}
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/${item.category || categorySlug}/${item.slug}`}
              className="block px-4 py-2 text-sm text-slate-700 hover:bg-brand-pink/40 hover:text-brand-blueDark transition leading-snug"
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
