import Link from 'next/link'

const LEGAL_LINKS = [
  { title: 'Privacy Policy', href: '/privacy-policy' },
  { title: 'Terms & Conditions', href: '/terms-and-conditions' },
  { title: 'Disclaimer', href: '/disclaimer' },
  { title: 'About Us', href: '/about-us' },
  { title: 'Contact Us', href: '/contact-us' },
]

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-slate-300 mt-12">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-brand-green/20 border border-brand-green rounded-lg p-3 text-center text-sm text-white mb-6">
          🔒 हम कभी भी Aadhaar, बैंक विवरण या OTP नहीं माँगते — 100% Free & No Document Upload Required
        </div>

        <nav className="flex flex-wrap justify-center gap-4 text-sm mb-4">
          {LEGAL_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-white transition">
              {link.title}
            </Link>
          ))}
        </nav>

        <p className="text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Official Sarkari Patrika. यह एक स्वतंत्र सूचना पोर्टल है और किसी भी
          सरकारी विभाग से संबद्ध नहीं है।
        </p>
      </div>
    </footer>
  )
}
