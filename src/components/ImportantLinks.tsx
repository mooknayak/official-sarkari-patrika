type Link = {
  label: string
  url: string
  linkType?: string
}

const typeIcons: Record<string, string> = {
  'Apply Online': '📝',
  'Download Admit Card': '🎫',
  'Check Result': '📊',
  'Official Notification': '📄',
  'Official Website': '🌐',
}

export default function ImportantLinks({ links }: { links?: Link[] }) {
  if (!links || links.length === 0) return null

  return (
    <section className="my-8 rounded-xl overflow-hidden shadow-lg border-2 border-brand-blue">
      <h2 className="bg-gradient-to-r from-brand-blue to-brand-blueDark text-white text-xl md:text-2xl font-bold px-5 py-4 flex items-center gap-2">
        🔗 महत्वपूर्ण लिंक्स
      </h2>
      <div className="divide-y divide-slate-100 bg-white">
        {links.map((link, idx) => (
          <a
            key={idx}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="flex items-center justify-between gap-3 px-5 py-4 hover:bg-brand-blueLight transition"
          >
            <span className="flex items-center gap-2 min-w-0">
              <span className="text-xl shrink-0">{typeIcons[link.linkType || ''] || '🔗'}</span>
              <span className="font-semibold text-slate-800 text-base md:text-lg truncate">
                {link.label}
              </span>
            </span>
            <span className="shrink-0 flex items-center gap-1 bg-brand-pinkAccent text-white text-sm font-bold px-4 py-2 rounded-full">
              Click Here →
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}
