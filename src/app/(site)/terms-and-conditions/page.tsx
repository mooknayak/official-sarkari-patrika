// ✏️ एडिट फ़ाइल — मौजूदा फाइल में बदलें: src/app/(site)/terms-and-conditions/page.tsx
// 🆕 Governing Law/Jurisdiction, Advertising clause जोड़ी गई - Google AdSense
// Review में यह पेज ज़्यादा भरोसेमंद और पूरा लगता है। "Last updated" अब असली
// आज की तारीख अपने-आप दिखाएगा।
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms & Conditions of Official Sarkari Patrika',
}

export default function TermsPage() {
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="prose max-w-none">
      <h1>Terms & Conditions</h1>
      <p>
        By accessing and using Official Sarkari Patrika (officialsarkaripatrika.com), you agree to
        be bound by the following terms and conditions. If you do not agree with any part of these
        terms, please discontinue use of this website.
      </p>

      <h2>1. Purpose of the Website</h2>
      <p>
        This website is created solely to provide general information related to government job
        notifications, admit cards, and results. It is an independent, privately-owned information
        portal and is not the official website of any government department.
      </p>

      <h2>2. Accuracy of Information</h2>
      <p>
        We strive to keep all information as accurate and up to date as possible; however, we are
        not liable for any errors, omissions, or delays. Users are advised to verify information
        on the concerned department&apos;s official website before applying or making any
        decisions.
      </p>

      <h2>3. Advertising</h2>
      <p>
        This website displays advertisements served by third-party advertising companies,
        including Google AdSense. These advertisements are not endorsements or recommendations by
        Official Sarkari Patrika, and we are not responsible for the content of any advertisement
        or the products/services offered through it.
      </p>

      <h2>4. Intellectual Property</h2>
      <p>
        All original content, logos, and designs on this website are the property of Official
        Sarkari Patrika. Reproduction without permission is strictly prohibited.
      </p>

      <h2>5. User Conduct</h2>
      <p>
        Users agree to use this website only for lawful purposes and agree not to attempt to
        disrupt, hack, or misuse the website or its content.
      </p>

      <h2>6. Limitation of Liability</h2>
      <p>
        Official Sarkari Patrika shall not be held liable for any direct or indirect loss arising
        from the use of information provided on this website.
      </p>

      <h2>7. Governing Law</h2>
      <p>
        These Terms & Conditions shall be governed by and construed in accordance with the laws of
        India. Any disputes arising out of the use of this website shall be subject to the
        jurisdiction of the courts of India.
      </p>

      <h2>8. Changes to Terms</h2>
      <p>We reserve the right to modify these terms at any time without prior notice.</p>

      <p className="text-sm text-slate-500">Last updated: {today}</p>
    </div>
  )
}
