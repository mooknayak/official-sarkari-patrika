import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms & Conditions of Official Sarkari Patrika',
}

export default function TermsPage() {
  return (
    <div className="prose max-w-none">
      <h1>Terms & Conditions</h1>
      <p>
        By accessing and using Official Sarkari Patrika (officialsarkaripatrika.com), you agree to
        be bound by the following terms and conditions:
      </p>

      <h2>1. Purpose of the Website</h2>
      <p>
        This website is created solely to provide general information related to government job
        notifications, admit cards, and results. It is not the official website of any government
        department.
      </p>

      <h2>2. Accuracy of Information</h2>
      <p>
        We strive to keep all information as accurate and up to date as possible; however, we are
        not liable for any errors, omissions, or delays. Users are advised to verify information
        on the concerned department&apos;s official website before applying or making any
        decisions.
      </p>

      <h2>3. Intellectual Property</h2>
      <p>
        All original content, logos, and designs on this website are the property of Official
        Sarkari Patrika. Reproduction without permission is strictly prohibited.
      </p>

      <h2>4. User Conduct</h2>
      <p>Users agree to use this website only for lawful purposes.</p>

      <h2>5. Limitation of Liability</h2>
      <p>
        Official Sarkari Patrika shall not be held liable for any direct or indirect loss arising
        from the use of information provided on this website.
      </p>

      <h2>6. Changes to Terms</h2>
      <p>We reserve the right to modify these terms at any time without prior notice.</p>

      <p className="text-sm text-slate-500">Last updated: [Insert Date]</p>
    </div>
  )
}
