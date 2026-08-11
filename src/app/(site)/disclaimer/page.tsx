// ✏️ एडिट फ़ाइल — मौजूदा फाइल में बदलें: src/app/(site)/disclaimer/page.tsx
// 🆕 सबसे ऊपर एक साफ़ Highlighted Banner जोड़ा गया है, जो सीधे-सीधे कहता है कि
// यह कोई Government वेबसाइट नहीं है - यह Google AdSense Review में सबसे पहले
// नज़र आता है और भरोसा बनाता है। "Last updated" अब असली आज की तारीख दिखाएगा।
import type { Metadata } from 'next'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Disclaimer and Data Privacy Commitment of Official Sarkari Patrika',
}

export default function DisclaimerPage() {
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="prose max-w-none">
      <h1>Disclaimer</h1>

      <div className="not-prose bg-amber-50 border-2 border-amber-300 rounded-lg p-4 mb-6">
        <p className="font-bold text-amber-900 m-0">
          ⚠️ Official Sarkari Patrika (officialsarkaripatrika.com) is <u>NOT</u> a Government
          website.
        </p>
        <p className="text-amber-800 text-sm mt-2 mb-0">
          We are an independent, privately-owned information portal. We are not affiliated with,
          endorsed by, sponsored by, or an official representative of any Central Government,
          State Government, ministry, department, board, or commission (such as UPSC, SSC,
          Railways, Banking sector, etc.). All official names, logos, and trademarks mentioned on
          this website belong to their respective owners and are used here only for informational
          reference purposes.
        </p>
      </div>

      <h2>1. Source of Information</h2>
      <p>
        All information published on this website (job notifications, admit cards, results, etc.)
        is collected from the official websites and press releases of the concerned departments
        and presented here in simplified language.
      </p>

      <h2>2. Official Verification Required</h2>
      <p>
        Before applying for any post, appearing for an examination, or making any important
        decision, users are required to verify the information on the official website of the
        concerned department. In case of any discrepancy, the official notification shall prevail.
      </p>

      <h2>3. Data Privacy Commitment</h2>
      <ul>
        <li>
          We never ask users for Aadhaar cards, bank account details, OTPs, passwords, or any
          sensitive documents.
        </li>
        <li>
          There is no application facility on our website - applications must be submitted only
          through the official website of the concerned department.
        </li>
        <li>This portal is completely free, and no document upload is ever required.</li>
      </ul>

      <h2>4. Possibility of Errors</h2>
      <p>
        Given the possibility of human error, we are not responsible for any typographical errors,
        date changes, or technical mistakes.
      </p>

      <h2>5. External Links & Advertisements</h2>
      <p>
        All links on this website labeled &quot;Apply Online,&quot; &quot;Download Admit
        Card,&quot; and similar, redirect directly to the official website of the concerned
        department. This website may also display advertisements served by third-party networks
        such as Google AdSense; we do not control or endorse the content of these advertisements.
      </p>

      <p>For any queries, please contact us via our Contact Us page.</p>

      <p className="text-sm text-slate-500">Last updated: {today}</p>
    </div>
  )
}
