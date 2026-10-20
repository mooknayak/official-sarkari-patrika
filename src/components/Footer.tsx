// ✏️ एडिट फ़ाइल — मौजूदा फाइल में बदलें: src/components/Footer.tsx
//
// 🎨 नया Footer (आधुनिक, कई Column वाला, Hierarchy के लिए तैयार)
//   • बायीं तरफ़ Brand + परिचय + Social बटन
//   • दायीं तरफ़ Link के समूह (Explore / Free Tools / Company & Legal)
//   • नीचे Trust पट्टी और Copyright
// 🧩 Hierarchy (Parent → Child) के लिए: नीचे FOOTER_GROUPS में किसी Link में
//    children: [{ title, href }] जोड़ दीजिए - वह उसके नीचे अंदर की तरफ़ सरककर दिखेगा।
//    नया समूह चाहिए तो FOOTER_GROUPS में एक और { title, links } जोड़ दीजिए।
// ✅ पहले की सभी चीज़ें वैसी ही हैं: Footer Banner Ad, Sanity के Footer Links और Social Links,
//    और Legal Panel (Organization Chart)।
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { SITE_SETTINGS_QUERY } from '@/sanity/lib/queries'
import LegalPanel from '@/components/LegalPanel'
import AdPoolSlot from '@/components/AdPoolSlot'

type FooterLink = { title: string; href: string; children?: FooterLink[] }
type FooterGroup = { title: string; links: FooterLink[] }

const DEFAULT_FOOTER_LINKS: FooterLink[] = [
  { title: 'Privacy Policy', href: '/privacy-policy' },
  { title: 'Terms & Conditions', href: '/terms-and-conditions' },
  { title: 'Disclaimer', href: '/disclaimer' },
  { title: 'About Us', href: '/about-us' },
  { title: 'Contact Us', href: '/contact-us' },
]

// 🧭 Footer के स्थिर समूह (नया Link या समूह जोड़ने के लिए यहीं बदलाव करें)
const FOOTER_GROUPS: FooterGroup[] = [
  {
    title: 'Explore',
    links: [
      { title: 'Latest Jobs', href: '/jobs' },
      { title: 'Admit Card', href: '/admit-card' },
      { title: 'Result', href: '/result' },
      { title: 'Answer Key', href: '/answer-key' },
      { title: 'Documents', href: '/documents' },
      { title: 'Important', href: '/sarkari-yojana' },
    ],
  },
  {
    title: 'Free Tools',
    links: [
      { title: 'Photo & Signature Resizer', href: '/tools/photo-signature-resizer' },
      { title: 'Age Calculator', href: '/tools/age-calculator' },
      { title: 'Percentage / CGPA Calculator', href: '/tools/percentage-calculator' },
      { title: 'JPG to PDF Converter', href: '/tools/jpg-to-pdf' },
      { title: 'Resume / CV Builder', href: '/tools/resume-builder' },
    ],
  },
]

const SOCIAL_LABELS: Record<string, string> = {
  whatsapp: 'WhatsApp',
  telegram: 'Telegram',
  facebook: 'Facebook',
  youtube: 'YouTube',
  instagram: 'Instagram',
  twitter: 'Twitter / X',
}
const SOCIAL_ORDER = ['whatsapp', 'telegram', 'facebook', 'youtube', 'instagram', 'twitter']

function FooterAnchor({ link }: { link: FooterLink }) {
  const cls = 'text-sm text-blue-100/80 transition hover:text-white'
  return link.href?.startsWith('http') ? (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className={cls}>
      {link.title}
    </a>
  ) : (
    <Link href={link.href} className={cls}>
      {link.title}
    </Link>
  )
}

function LinkList({ links }: { links: FooterLink[] }) {
  return (
    <ul className="space-y-2">
      {links.map((l) => (
        <li key={l.href + l.title}>
          <FooterAnchor link={l} />
          {l.children && l.children.length > 0 && (
            <ul className="mt-2 space-y-1.5 border-l border-white/15 pl-3">
              {l.children.map((c) => (
                <li key={c.href + c.title}>
                  <FooterAnchor link={c} />
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  )
}

export default async function Footer() {
  const settings = await client.fetch(SITE_SETTINGS_QUERY).catch(() => null)
  const socialLinks: Record<string, string> = settings?.socialLinks || {}
  const activeSocial = Object.entries(socialLinks)
    .filter(([, url]) => typeof url === 'string' && /^https:\/\//i.test(url))
    .sort(([a], [b]) => {
      const ia = SOCIAL_ORDER.indexOf(a)
      const ib = SOCIAL_ORDER.indexOf(b)
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib)
    })
  const footerLinks: FooterLink[] =
    settings?.footerLinks && settings.footerLinks.length > 0 ? settings.footerLinks : DEFAULT_FOOTER_LINKS
  const siteName = settings?.publisherName || 'Official Sarkari Patrika'

  const groups: FooterGroup[] = [...FOOTER_GROUPS, { title: 'Company & Legal', links: footerLinks }]

  return (
    <footer className="mt-12 bg-brand-blueDark text-blue-100">
      {/* 4️⃣ Footer Banner - किनारे तक, सफ़ेद पट्टी पर (गहरे Background पर Ad ठीक से नहीं दिखता) */}
      {settings?.footerBannerCodes?.length > 0 && (
        <div className="bg-white py-3">
          <div className="mx-auto max-w-5xl">
            <AdPoolSlot codes={settings.footerBannerCodes} width={728} height={90} />
          </div>
        </div>
      )}

      <div className="h-1 bg-gradient-to-r from-brand-pinkAccent via-brand-blue to-brand-pinkAccent" />

      <div className="mx-auto max-w-5xl px-4 pb-6 pt-10">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2">
            <p className="text-lg font-bold text-white">{siteName}</p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-blue-100/80">
              An independent information portal for government jobs, admit cards, results and answer keys in India.
            </p>
            <ul className="mt-3 flex flex-wrap gap-2 text-[11px] font-medium">
              <li className="rounded-full border border-white/15 px-2.5 py-1">Independent Portal</li>
              <li className="rounded-full border border-white/15 px-2.5 py-1">Not a Government Website</li>
            </ul>

            {activeSocial.length > 0 && (
              <nav aria-label="Social links" className="mt-5 flex flex-wrap gap-2">
                {activeSocial.map(([key, url]) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-white/20 px-3.5 py-1.5 text-xs font-medium text-white transition hover:border-white/40 hover:bg-white/10"
                  >
                    {SOCIAL_LABELS[key] || key}
                  </a>
                ))}
              </nav>
            )}
          </div>

          {/* Link groups */}
          {groups.map((g) => (
            <nav key={g.title} aria-label={g.title} className="col-span-1">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/60">{g.title}</p>
              <LinkList links={g.links} />
            </nav>
          ))}
        </div>

        {/* Trust strip */}
        <div className="mt-10 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-center text-sm text-blue-50">
          🔒 We never ask for Aadhaar, bank details or OTP · 100% Free &amp; No Document Upload Required
          <span className="block text-xs text-blue-200/80">हम कभी आधार, बैंक विवरण या OTP नहीं माँगते।</span>
        </div>

        {/* Legal Panel - Organization Chart (Founder → Departments) */}
        <LegalPanel founder={settings?.legalPanel?.founder} departments={settings?.legalPanel?.departments} />

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-5 text-xs text-blue-200/80 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
          <p>
            Independent information portal; not affiliated with any government department. यह एक स्वतंत्र सूचना
            पोर्टल है।
          </p>
        </div>
      </div>
    </footer>
  )
}
