import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy of Official Sarkari Patrika',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="prose max-w-none">
      <h1>Privacy Policy</h1>
      <p>
        Thank you for visiting Official Sarkari Patrika (officialsarkaripatrika.com). Your privacy
        is important to us. This Privacy Policy explains what information we collect and how we
        use it.
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
          non-personal data, including browser type, page views, and session duration.
        </li>
      </ul>

      <h2>2. Use of Cookies</h2>
      <p>
        Our website uses third-party services such as Google AdSense and Google Analytics, which
        use cookies to serve advertisements and improve website performance.
      </p>

      <h2>3. Third-Party Links</h2>
      <p>
        Our website contains links to official websites of government departments and
        organizations. We are not responsible for the privacy practices of these external sites.
      </p>

      <h2>4. Data Security</h2>
      <p>
        We take reasonable technical measures to protect the limited data we collect from
        unauthorized access.
      </p>

      <h2>5. Changes to This Policy</h2>
      <p>
        This Privacy Policy may be updated from time to time. Any changes will be published on
        this page.
      </p>

      <h2>6. Contact Us</h2>
      <p>
        If you have any questions regarding this policy, please reach out to us via our Contact
        Us page.
      </p>

      <p className="text-sm text-slate-500">Last updated: [Insert Date]</p>
    </div>
  )
}
