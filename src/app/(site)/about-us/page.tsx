import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'About Official Sarkari Patrika — our mission and commitment',
}

export default function AboutUsPage() {
  return (
    <div className="prose max-w-none">
      <h1>About Us</h1>
      <p>Welcome to Official Sarkari Patrika.</p>

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

      <p>Official Sarkari Patrika strives to be a trusted companion in your career journey.</p>
    </div>
  )
}
