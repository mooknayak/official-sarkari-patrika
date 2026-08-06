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
    <div className="border border-blue-200 rounded-md overflow-hidden my-6">
      <h3 className="bg-brand-blue text-white text-center font-bold py-2 text-sm md:text-base tracking-wide">
        🔗 महत्वपूर्ण लिंक्स
      </h3>
      <div className="divide-y divide-blue-100">
        {links.map((link, idx) => (
          <a
            key={idx}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="flex items-center justify-between gap-3 px-3 py-2.5 hover:bg-brand-blueLight transition"
          >
            <span className="flex items-center gap-2 min-w-0">
              <span className="text-base shrink-0">{typeIcons[link.linkType || ''] || '🔗'}</span>
              <span className="font-semibold text-slate-800 text-sm md:text-base truncate">
                {link.label}
              </span>
            </span>
            <span className="shrink-0 bg-brand-pinkAccent text-white text-xs md:text-sm font-bold px-3 py-1.5 rounded-full">
              Click Here →
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
