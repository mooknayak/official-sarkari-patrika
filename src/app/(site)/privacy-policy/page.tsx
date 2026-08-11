// ✏️ एडिट फ़ाइल — मौजूदा फाइल में बदलें: src/app/(site)/privacy-policy/page.tsx
// 🆕 Google AdSense Approval के लिए ज़रूरी सभी Disclosures जोड़ी गईं - Cookies,
// DART Cookie, Personalized Ads Opt-Out Link, Children's Privacy (COPPA),
// Data Rights वगैरह। "Last updated" अब असली आज की तारीख अपने-आप दिखाएगा।
import type { Metadata } from 'next'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy of Official Sarkari Patrika',
}

export default function PrivacyPolicyPage() {
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="prose max-w-none">
      <h1>Privacy Policy</h1>
      <p>
        Thank you for visiting Official Sarkari Patrika (officialsarkaripatrika.com). Your privacy
        is important to us. This Privacy Policy explains what information we collect, how we use
        it, and the choices you have.
      </p>

      <h2>1. Information We Collect</h2>
      <ul>
        <li>
          We do not request or store sensitive personal or government documents such as Aadhaar
          numbers, bank details, or passwords from our users.
        </li>
        <li>
          When you fill out the Contact Us form, we only receive your name, email address, and
          message.
        </li>
        <li>
          Standard analytics tools (such as Google Analytics) may automatically collect
          non-personal data, including browser type, approximate location, pages visited, and
          session duration.
        </li>
      </ul>

      <h2>2. Cookies and Google AdSense</h2>
      <p>
        This website uses Google AdSense, a third-party advertising service provided by Google.
        Google, as a third-party vendor, uses cookies (including the DART cookie) to serve ads to
        our visitors based on their visit to this site and other sites on the internet.
      </p>
      <ul>
        <li>
          Google&apos;s use of advertising cookies enables it and its partners to serve ads to our
          users based on their visit to this site and/or other sites on the Internet.
        </li>
        <li>
          You may opt out of personalized advertising by visiting{' '}
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
            Google Ads Settings
          </a>
          .
        </li>
        <li>
          Alternatively, you can opt out of a third-party vendor&apos;s use of cookies for
          personalized advertising by visiting{' '}
          <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
            www.aboutads.info
          </a>
          .
        </li>
        <li>
          For more information on how Google uses data when you use our site, please visit{' '}
          <a
            href="https://policies.google.com/technologies/partner-sites"
            target="_blank"
            rel="noopener noreferrer"
          >
            How Google uses information from sites or apps that use our services
          </a>
          .
        </li>
      </ul>

      <h2>3. Children&apos;s Privacy</h2>
      <p>
        This website does not knowingly collect any personal information from children under the
        age of 13. Our content is intended for job-seeking adults and students. If you believe a
        child has provided us with personal information, please contact us so we can remove it.
      </p>

      <h2>4. Third-Party Links</h2>
      <p>
        Our website contains links to official websites of government departments and
        organizations, and may display ads from third-party networks. We are not responsible for
        the privacy practices or content of these external sites.
      </p>

      <h2>5. Data Security</h2>
      <p>
        We take reasonable technical measures to protect the limited data we collect from
        unauthorized access, alteration, or disclosure.
      </p>

      <h2>6. Your Rights</h2>
      <p>
        You may request access to, correction of, or deletion of any personal information (such as
        your Contact Us submission) that we hold about you by writing to us at the email address
        below.
      </p>

      <h2>7. Changes to This Policy</h2>
      <p>
        This Privacy Policy may be updated from time to time to reflect changes in our practices or
        for legal/regulatory reasons. Any changes will be published on this page along with the
        updated date.
      </p>

      <h2>8. Contact Us</h2>
      <p>
        If you have any questions regarding this policy, please reach out to us at{' '}
        <a href="mailto:officialsarkaripatrika@gmail.com">officialsarkaripatrika@gmail.com</a> or
        via our{' '}
        <a href="/contact-us">Contact Us</a> page.
      </p>

      <p className="text-sm text-slate-500">Last updated: {today}</p>
    </div>
  )
}
