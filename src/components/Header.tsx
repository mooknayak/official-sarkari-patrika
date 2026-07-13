import Link from 'next/link'

const NAV_ITEMS = [
  { title: 'होम', href: '/' },
  { title: 'Jobs', href: '/jobs' },
  { title: 'Admit Card', href: '/admit-card' },
  { title: 'Result', href: '/result' },
  { title: 'Answer Key', href: '/answer-key' },
  { title: 'Documents', href: '/documents' },
  { title: 'Important', href: '/sarkari-yojana' },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* बड़ा Hero बैंड - नाम व डोमेन */}
      <div className="bg-gradient-to-b from-brand-blue to-brand-blueDark text-white text-center py-6 px-4">
        <Link href="/">
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-wide">
            Official <span className="text-brand-pink">Sarkari</span> Patrika
          </h1>
        </Link>
        <p className="text-xs md:text-sm text-blue-100 mt-1 tracking-widest uppercase">
          officialsarkaripatrika.com
        </p>
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
