// ✏️ एडिट फ़ाइल — मौजूदा फाइल में बदलें: src/app/(site)/about-us/page.tsx
// Professional About Us पेज (Google AdSense की समीक्षा के लिहाज़ से: साफ़ पहचान, सच्चा परिचय,
// संपादकीय तरीका, पारदर्शिता, विज्ञापन की जानकारी और संपर्क)। करीब 90% English, 10% Hindi।
// Sanity → Website Settings → "👥 हमारी टीम" से Team Members अब भी दिखेंगे (पहले जैसा)।
// ⚠️ इसमें जो भी वाक्य हैं, वे आपकी असली प्रक्रिया से मेल खाने चाहिए। सच न हो तो बदल दीजिए।
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { SITE_SETTINGS_QUERY } from '@/sanity/lib/queries'

// हर 1 घंटे में ताज़ा (Sanity में Team बदलने पर पेज खुद अपडेट हो जाता है)
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'About Official Sarkari Patrika: an independent information portal for government jobs, admit cards, results and answer keys in India. Learn about our mission, how we work and our commitments.',
}

type TeamMember = {
  name: string
  role: string
  bio?: string
  photoUrl?: string
}

const OFFERINGS = [
  { icon: '📢', title: 'Government Job Notifications', text: 'Vacancies, eligibility, important dates, application fee and how to apply.' },
  { icon: '🪪', title: 'Admit Cards & Exam Updates', text: 'Exam dates, city intimation slips and admit card download information.' },
  { icon: '📊', title: 'Results & Answer Keys', text: 'Results, cut-off marks, merit lists and answer key updates.' },
  { icon: '🛠️', title: 'Guides & Free Tools', text: 'Document guides, photo and signature resizer, JPG to PDF, age and percentage calculators.' },
]

const STEPS = [
  { title: 'Monitor', text: 'We follow official notifications and department websites.' },
  { title: 'Simplify', text: 'We summarise the key details in simple, well-organised language.' },
  { title: 'Link', text: 'We include official links wherever they are available.' },
  { title: 'Update', text: 'We update or correct a post when new information or an error report arrives.' },
]

const COMMITMENTS = [
  { title: 'Accuracy', text: 'We aim to check every post against the official source before publishing it.' },
  { title: 'Transparency', text: 'We are an independent portal. We are not a government website, and the word "Official" in our name does not mean government status.' },
  { title: 'Safety', text: 'We never ask for Aadhaar, bank details or OTP, and we never charge for jobs, admit cards or results.' },
  { title: 'Advertising', text: 'This website may show advertisements from third-party networks such as Google AdSense. Ads are kept separate from our content and do not decide what we publish.' },
]

export default async function AboutUsPage() {
  const settings = await client.fetch(SITE_SETTINGS_QUERY).catch(() => null)
  const team: TeamMember[] = settings?.teamMembers || []
  const siteName = settings?.publisherName || 'Official Sarkari Patrika'

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      {/* Hero */}
      <header className="rounded-2xl bg-gradient-to-br from-brand-blue to-brand-blueDark px-6 py-8 text-white">
        <h1 className="text-2xl font-bold md:text-3xl">About {siteName}</h1>
        <p className="mt-2 text-sm leading-relaxed text-blue-100 md:text-base">
          An independent information portal that brings government job notifications, admit cards, results and answer
          keys to job seekers across India in simple language.
        </p>
        <ul className="mt-4 flex flex-wrap gap-2 text-xs font-medium">
          <li className="rounded-full bg-white/15 px-3 py-1">Independent Portal</li>
          <li className="rounded-full bg-white/15 px-3 py-1">Free to Use</li>
          <li className="rounded-full bg-white/15 px-3 py-1">Not a Government Website</li>
        </ul>
      </header>

      {/* Mission */}
      <section aria-labelledby="mission">
        <h2 id="mission" className="mb-2 border-l-4 border-brand-pinkAccent pl-3 text-xl font-bold text-brand-blueDark">
          Our Mission
        </h2>
        <p className="leading-relaxed text-slate-700">
          Our mission is to deliver accurate and timely information about government jobs, admit cards and results to
          the youth, students and working population of India, especially those who have limited time or resources to
          navigate complex government websites. सही जानकारी, सही समय पर।
        </p>
      </section>

      {/* Founder */}
      <section aria-labelledby="founder">
        <h2 id="founder" className="mb-3 border-l-4 border-brand-pinkAccent pl-3 text-xl font-bold text-brand-blueDark">
          Founder&apos;s Note
        </h2>
        <div className="flex gap-4 rounded-xl border border-blue-100 bg-brand-blueLight p-5">
          <div
            aria-hidden="true"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-blue text-lg font-bold text-white"
          >
            DK
          </div>
          <div>
            <p className="font-semibold text-brand-blueDark">Diwakar Kumar</p>
            <p className="text-sm font-medium text-brand-pinkAccent">Founder</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              {siteName} was founded by Diwakar Kumar, who has been working in the computer and technology field since
              2010, with hands-on experience in HTML and website development. Driven by a passion for making government
              job information accessible and easy to understand for everyone, he started this platform to help students
              and job seekers across India find clear and reliable information in one place, without having to navigate
              through multiple complex official websites.
            </p>
          </div>
        </div>
      </section>

      {/* What we publish */}
      <section aria-labelledby="publish">
        <h2 id="publish" className="mb-3 border-l-4 border-brand-pinkAccent pl-3 text-xl font-bold text-brand-blueDark">
          What We Publish
        </h2>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {OFFERINGS.map((o) => (
            <li key={o.title} className="flex gap-3 rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
              <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-blueLight text-xl">
                {o.icon}
              </span>
              <div>
                <h3 className="font-semibold text-brand-blueDark">{o.title}</h3>
                <p className="mt-0.5 text-sm leading-relaxed text-slate-600">{o.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* How we work */}
      <section aria-labelledby="how">
        <h2 id="how" className="mb-3 border-l-4 border-brand-pinkAccent pl-3 text-xl font-bold text-brand-blueDark">
          How We Work
        </h2>
        <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex gap-3 rounded-xl border border-blue-100 bg-white p-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-pink text-sm font-bold text-brand-pinkAccent">
                {i + 1}
              </span>
              <div>
                <h3 className="font-semibold text-brand-blueDark">{s.title}</h3>
                <p className="mt-0.5 text-sm leading-relaxed text-slate-600">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Commitments */}
      <section aria-labelledby="commitments">
        <h2 id="commitments" className="mb-3 border-l-4 border-brand-pinkAccent pl-3 text-xl font-bold text-brand-blueDark">
          Our Commitments
        </h2>
        <dl className="divide-y divide-blue-100 rounded-xl border border-blue-100 bg-white">
          {COMMITMENTS.map((c) => (
            <div key={c.title} className="p-4">
              <dt className="font-semibold text-brand-blueDark">{c.title}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-slate-600">{c.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Team (Sanity) */}
      {team.length > 0 && (
        <section aria-labelledby="team">
          <h2 id="team" className="mb-3 border-l-4 border-brand-pinkAccent pl-3 text-xl font-bold text-brand-blueDark">
            Our Team
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {team.map((member, idx) => (
              <div key={idx} className="flex items-start gap-3 rounded-lg border border-blue-100 bg-white p-4">
                {member.photoUrl ? (
                  <Image
                    src={member.photoUrl}
                    alt={member.name}
                    width={64}
                    height={64}
                    className="h-16 w-16 flex-shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-brand-blueLight text-lg font-bold text-brand-blueDark">
                    {member.name?.charAt(0) || '?'}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-brand-blueDark">{member.name}</p>
                  <p className="text-sm font-medium text-brand-pinkAccent">{member.role}</p>
                  {member.bio && <p className="mt-1 text-sm text-slate-600">{member.bio}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      <section aria-labelledby="contact" className="rounded-xl border border-brand-pink bg-brand-pink/40 p-5 text-center">
        <h2 id="contact" className="text-lg font-bold text-brand-blueDark">
          Found a mistake or have feedback?
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Tell us and we will review it. आपकी राय हमारे लिए महत्वपूर्ण है।
        </p>
        <Link
          href="/contact-us"
          className="mt-3 inline-block rounded-full bg-brand-pinkAccent px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Contact Us
        </Link>
        <p className="mt-4 text-xs text-slate-500">
          <Link href="/privacy-policy" className="underline">Privacy Policy</Link> ·{' '}
          <Link href="/terms-and-conditions" className="underline">Terms &amp; Conditions</Link> ·{' '}
          <Link href="/disclaimer" className="underline">Disclaimer</Link>
        </p>
      </section>
    </div>
  )
}
