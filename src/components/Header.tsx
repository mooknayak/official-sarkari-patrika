// ✏️ एडिट फ़ाइल — मौजूदा फाइल में बदलें: src/components/Header.tsx
import Link from 'next/link'
import Image from 'next/image'
import { client } from '@/sanity/lib/client'
import { SITE_SETTINGS_QUERY } from '@/sanity/lib/queries'

const NAV_ITEMS = [
  { title: 'होम', href: '/' },
  { title: 'Jobs', href: '/jobs' },
  { title: 'Admit Card', href: '/admit-card' },
  { title: 'Result', href: '/result' },
  { title: 'Answer Key', href: '/answer-key' },
  { title: 'Documents', href: '/documents' },
  { title: 'Important', href: '/sarkari-yojana' },
  { title: 'Organizations', href: '/organizations' },
]

export default async function Header() {
  const settings = await client.fetch(SITE_SETTINGS_QUERY).catch(() => null)
  const iconUrl = settings?.faviconUrl || settings?.siteLogoUrl
  const publisherName = settings?.publisherName || 'Official Sarkari Patrika'

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* 🆕 Hero बैंड - अब बिल्कुल Reference Banner जैसा: Gradient Background,
          Decorative Circles, बड़ा Seal, Domain Badge, नीचे Disclosure Strip */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-blue via-brand-blue to-brand-pinkAccent">
        {/* Decorative background circles */}
        <div className="absolute -top-10 right-10 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute bottom-0 left-0 w-52 h-52 rounded-full bg-white/5 -translate-x-1/3 translate-y-1/3" />

        <div className="relative max-w-5xl mx-auto px-4 py-5 md:py-7">
          <Link href="/" className="flex items-center gap-4 md:gap-6">
            {/* Seal Logo */}
            {iconUrl ? (
              <Image
                src={`${iconUrl}?w=200&h=200&fit=max&auto=format`}
                alt={publisherName}
                width={96}
                height={96}
                priority
                className="h-16 w-16 md:h-24 md:w-24 rounded-full object-contain bg-white p-1 flex-shrink-0 shadow-lg"
              />
            ) : (
              <div className="h-16 w-16 md:h-24 md:w-24 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-brand-blue font-extrabold text-base md:text-xl">OSP</span>
              </div>
            )}

            <div className="min-w-0">
              <h1 className="text-xl md:text-4xl font-extrabold tracking-wide leading-tight text-white">
                Official <span className="text-brand-pink">Sarkari</span> Patrika
              </h1>
              <p className="text-xs md:text-lg text-blue-50 mt-1 mb-2 md:mb-3">
                Sarkari Naukri, Admit Card &amp; Result Updates
              </p>
              {/* Domain badge */}
              <span className="inline-block bg-white text-brand-pinkAccent font-bold text-xs md:text-base px-3 py-1 md:px-4 md:py-1.5 rounded-full truncate max-w-full">
                {(process.env.NEXT_PUBLIC_SITE_URL || 'officialsarkaripatrika.com').replace(/^https?:\/\//, '')}
              </span>
            </div>
          </Link>
        </div>

        {/* Disclosure strip */}
        <div className="relative bg-brand-blueDark/80 text-center py-1.5 text-[10px] md:text-xs text-blue-100 font-medium tracking-wide">
          Independent Platform <span className="text-brand-pinkAccent">•</span> Not a Government Website
        </div>
      </div>

      {/* Menu Bar - Nav एक तरफ, Search दूसरी तरफ */}
      <div className="bg-brand-blueDark border-t border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          <nav className="flex items-center gap-4 overflow-x-auto text-sm font-medium text-white whitespace-nowrap">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-brand-pinkAccent transition">
                {item.title}
              </Link>
            ))}
          </nav>

          <form action="/search" method="GET" className="flex items-center bg-white/10 rounded-md px-2 py-1.5 flex-shrink-0">
            <input
              type="text"
              name="q"
              placeholder="Search..."
              className="bg-transparent text-white placeholder-blue-200 text-sm outline-none w-24 md:w-48"
            />
            <button type="submit" aria-label="Search" className="ml-1 text-white flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}
