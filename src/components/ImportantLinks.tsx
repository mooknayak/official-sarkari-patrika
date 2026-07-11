type Link = {
  label: string
  url: string
  linkType?: string
}

export default function ImportantLinks({ links }: { links?: Link[] }) {
  if (!links || links.length === 0) return null

  return (
    <section className="my-6 border border-slate-200 rounded-lg overflow-hidden">
      <h2 className="bg-brand-blue text-white px-4 py-2 font-semibold">Important Links</h2>
      <div className="divide-y divide-slate-100">
        {links.map((link, idx) => (
          <a
            key={idx}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition"
          >
            <span className="font-medium text-slate-700">{link.label}</span>
            <span className="text-xs text-brand-pinkAccent font-semibold">{link.linkType} →</span>
          </a>
        ))}
      </div>
    </section>
  )
}
