import Link from 'next/link'

const NAV_ITEMS = [
  { title: 'होम', href: '/' },
  { title: 'Jobs', href: '/jobs' },
  { title: 'Admit Card', href: '/admit-card' },
  { title: 'Result', href: '/result' },
  { title: 'Answer Key', href: '/answer-key' },
]

export default function Header() {
  return (
    <header className="bg-brand-navy text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Official <span className="text-brand-saffron">Sarkari</span> Patrika
        </Link>
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-brand-saffron transition">
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
      {/* Mobile nav */}
      <nav className="md:hidden flex overflow-x-auto gap-4 px-4 pb-3 text-sm">
        {NAV_ITEMS.map((item) => (
          <Link key={item.href} href={item.href} className="whitespace-nowrap hover:text-brand-saffron">
            {item.title}
          </Link>
        ))}
      </nav>
    </header>
  )
}
