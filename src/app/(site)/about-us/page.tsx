// ✏️ एडिट फ़ाइल — मौजूदा फाइल में बदलें: src/app/(site)/about-us/page.tsx
// 🆕 अब यह पेज Sanity से Team Members (Founder, Editorial, Legal) खींचकर एक
// "Our Team" सेक्शन भी दिखाता है - Sanity → Website Settings → "👥 हमारी टीम"
// से पूरी तरह Control होता है। कोई Team Member न जोड़ें तो यह सेक्शन दिखेगा ही नहीं।
import type { Metadata } from 'next'
import Image from 'next/image'
import { client } from '@/sanity/lib/client'
import { SITE_SETTINGS_QUERY } from '@/sanity/lib/queries'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'About Official Sarkari Patrika — our mission and commitment',
}

type TeamMember = {
  name: string
  role: string
  bio?: string
  photoUrl?: string
}

export default async function AboutUsPage() {
  const settings = await client.fetch(SITE_SETTINGS_QUERY).catch(() => null)
  const team: TeamMember[] = settings?.teamMembers || []

  return (
    <div className="prose max-w-none">
      <h1>About Us</h1>
      <p>Welcome to {settings?.publisherName || 'Official Sarkari Patrika'}.</p>

      <h2>Our Mission</h2>
      <p>
        Our mission is to deliver accurate and timely information about government jobs, admit
        cards, and results to the youth, students, and working population of India — especially
        those who have limited time or resources to navigate complex government websites.
      </p>

      <h2>What We Do</h2>
      <p>
        Our team monitors official notifications from various Central and State Government
        departments on a daily basis and presents them in simple, well-organized language on this
        portal — so that important dates, eligibility criteria, and application procedures are
        available to users in one place.
      </p>

      <h2>Our Commitment</h2>
      <ul>
        <li>Accuracy: Every piece of information is cross-verified with the official source before publication.</li>
        <li>Transparency: We clearly state that we are not a government entity.</li>
        <li>Safety: We never ask for sensitive documents.</li>
      </ul>

      <p>{settings?.publisherName || 'Official Sarkari Patrika'} strives to be a trusted companion in your career journey.</p>

      {team.length > 0 && (
        <>
          <h2>Our Team</h2>
          <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {team.map((member, idx) => (
              <div
                key={idx}
                className="flex gap-3 items-start border border-blue-100 rounded-lg p-4 bg-white"
              >
                {member.photoUrl ? (
                  <Image
                    src={member.photoUrl}
                    alt={member.name}
                    width={64}
                    height={64}
                    className="rounded-full object-cover w-16 h-16 flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-brand-blueLight flex items-center justify-center text-brand-blueDark font-bold text-lg flex-shrink-0">
                    {member.name?.charAt(0) || '?'}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-brand-blueDark m-0">{member.name}</p>
                  <p className="text-sm text-brand-pinkAccent font-medium m-0">{member.role}</p>
                  {member.bio && <p className="text-sm text-slate-600 mt-1 mb-0">{member.bio}</p>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
