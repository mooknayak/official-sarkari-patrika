// ✏️ एडिट फ़ाइल — मौजूदा फाइल में बदलें: src/components/Footer.tsx
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { SITE_SETTINGS_QUERY } from '@/sanity/lib/queries'

const LEGAL_LINKS = [
  { title: 'Privacy Policy', href: '/privacy-policy' },
  { title: 'Terms & Conditions', href: '/terms-and-conditions' },
  { title: 'Disclaimer', href: '/disclaimer' },
  { title: 'About Us', href: '/about-us' },
  { title: 'Contact Us', href: '/contact-us' },
]

const SOCIAL_LABELS: Record<string, string> = {
  facebook: 'Facebook',
  twitter: 'Twitter / X',
  youtube: 'YouTube',
  telegram: 'Telegram',
  instagram: 'Instagram',
}

export default async function Footer() {
  const settings = await client.fetch(SITE_SETTINGS_QUERY).catch(() => null)
  const socialLinks: Record<string, string> = settings?.socialLinks || {}
  const activeSocial = Object.entries(socialLinks).filter(([, url]) => Boolean(url))

  return (
    <footer className="bg-brand-blueDark text-blue-100 mt-12">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-brand-pink border border-brand-pinkAccent rounded-lg p-3 text-center text-sm text-brand-blueDark font-medium mb-6">
          🔒 हम कभी भी Aadhaar, बैंक विवरण या OTP नहीं माँगते - 100% Free & No Document Upload Required
        </div>

        {activeSocial.length > 0 && (
          <nav className="flex flex-wrap justify-center gap-4 text-sm mb-4">
            {activeSocial.map(([key, url]) => (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-pinkAccent transition"
              >
                {SOCIAL_LABELS[key] || key}
              </a>
            ))}
          </nav>
        )}

        <nav className="flex flex-wrap justify-center gap-4 text-sm mb-4">
          {LEGAL_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-brand-pinkAccent transition">
              {link.title}
            </Link>
          ))}
        </nav>

        <p className="text-center text-xs text-blue-200">
          © {new Date().getFullYear()} {settings?.publisherName || 'Official Sarkari Patrika'}. यह एक
          स्वतंत्र सूचना पोर्टल है और किसी भी सरकारी विभाग से संबद्ध नहीं है।
        </p>
      </div>
    </footer>
  )
}
