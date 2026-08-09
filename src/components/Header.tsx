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

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* Hero बैंड - Logo और नाम अब बाईं तरफ़, एक साथ (Sarkari Result जैसा) */}
      <div className="bg-gradient-to-b from-brand-blue to-brand-blueDark text-white py-4 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            {iconUrl ? (
              <Image
                src={`${iconUrl}?w=140&h=140&fit=max&auto=format`}
                alt={settings?.publisherName || 'Official Sarkari Patrika'}
                width={64}
                height={64}
                priority
                className="h-12 w-12 md:h-16 md:w-16 rounded-full object-contain bg-white p-1 flex-shrink-0"
              />
            ) : (
              <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                <span className="text-brand-blue font-extrabold text-sm md:text-lg">OSP</span>
              </div>
            )}
            <div>
              <h1 className="text-lg md:text-3xl font-extrabold tracking-wide leading-tight">
                Official <span className="text-brand-pink">Sarkari</span> Patrika
              </h1>
              <p className="text-[10px] md:text-sm text-blue-100 tracking-widest uppercase">
                officialsarkaripatrika.com
              </p>
            </div>
          </Link>
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
