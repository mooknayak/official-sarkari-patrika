import AdUnit, { type AdUnitData } from './AdUnit'

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

export default function ImportantLinks({
  links,
  ads,
  adsenseClientId,
}: {
  links?: Link[]
  ads?: AdUnitData[]
  adsenseClientId?: string
}) {
  if (!links || links.length === 0) return null

  // 🆕 हर Link Row के बगल में एक Ad - Sanity के "importantLinksAds" में जितने
  // भी Ad जोड़े गए हों, वो बारी-बारी (Round-Robin) हर Row पर लग जाते हैं। यही
  // वजह है कि जितनी ज़्यादा Link Rows, उतने ही ज़्यादा Ad एक साथ दिखते हैं -
  // बिल्कुल SarkariResult वाला Pattern।
  const hasAds = ads && ads.length > 0

  return (
    <div className="border border-blue-200 rounded-md overflow-hidden my-6">
      <h3 className="bg-brand-blue text-white text-center font-bold py-2 text-sm md:text-base tracking-wide">
        🔗 महत्वपूर्ण लिंक्स
      </h3>
      <div className="divide-y divide-blue-100">
        {links.map((link, idx) => (
          <div key={idx}>
            <a
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
            {hasAds && (
              <div className="px-3 py-2 bg-slate-50/60 border-t border-blue-50">
                <AdUnit unit={ads![idx % ads!.length]} adsenseClientId={adsenseClientId} width={300} height={90} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
