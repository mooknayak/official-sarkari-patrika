import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'About Official Sarkari Patrika - our mission, editorial process, and commitment to accurate government job information.',
}

export default function AboutUsPage() {
  return (
    <div className="prose max-w-none">
      <h1>About Us</h1>
      <p>
        Welcome to Official Sarkari Patrika, an independent digital information portal dedicated
        to helping job seekers across India stay informed about government employment
        opportunities.
      </p>

      <h2>Our Mission</h2>
      <p>
        Our mission is to deliver accurate and timely information about government jobs, admit
        cards, and results to the youth, students, and working population of India, especially
        those who have limited time or resources to navigate complex government websites. We
        believe that access to clear, reliable career information should not be a privilege but a
        basic convenience for every job-seeking citizen.
      </p>

      <h2>What We Do</h2>
      <p>
        Our editorial team monitors official notifications published by various Central and State
        Government departments, boards, and recruitment bodies on a daily basis. We then
        summarize this information in simple, well-organized language on this portal, so that
        important dates, eligibility criteria, and application procedures are available to users
        in one place, without having to search through multiple official websites.
      </p>
      <p>
        Each listing on this website covers essential details such as the recruiting
        organization, number of vacancies, eligibility requirements, application fee, important
        dates, and direct links to the relevant official notification. As a vacancy moves through
        its lifecycle, from job notification to admit card and finally to result, we update the
        same listing so that readers always find the latest status in one consistent place.
      </p>

      <h2>Our Editorial Process</h2>
      <p>
        Before any information is published, our team cross-checks the details against the
        official notification released by the concerned department. Where an official PDF or
        press release is available, our summaries are prepared directly from that source. We
        review and update listings as new information becomes available, such as exam date
        changes, admit card releases, or result announcements.
      </p>

      <h2>Our Commitment</h2>
      <ul>
        <li>
          <strong>Accuracy:</strong> Every piece of information is cross-verified with the
          official source before publication.
        </li>
        <li>
          <strong>Transparency:</strong> We clearly state that we are not a government entity, and
          we encourage readers to verify details on official websites before taking any action.
        </li>
        <li>
          <strong>Safety:</strong> We never ask users for Aadhaar numbers, bank details, passwords,
          or any sensitive personal documents.
        </li>
        <li>
          <strong>Accessibility:</strong> Our content is written in simple language and organized
          for quick reading on any device.
        </li>
      </ul>

      <h2>Meet the Founder</h2>
      <p>
        Official Sarkari Patrika is founded and maintained by Diwakar Kumar, who has been working
        in the computer software field since 2006, with dedicated professional experience in HTML
        and web development since 2010. This platform reflects his continued commitment to
        building simple, accessible, and reliable digital resources for the public.
      </p>

      <h2>Get in Touch</h2>
      <p>
        We welcome feedback, corrections, and suggestions from our readers. If you notice any
        outdated or incorrect information, please let us know through our Contact Us page, and our
        team will review and update it promptly.
      </p>

      <p>
        Official Sarkari Patrika strives to be a trusted companion in your career journey.
      </p>
    </div>
  )
}
