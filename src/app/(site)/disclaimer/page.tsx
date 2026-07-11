import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Disclaimer and Data Privacy Commitment of Official Sarkari Patrika',
}

export default function DisclaimerPage() {
  return (
    <div className="prose max-w-none">
      <h1>Disclaimer</h1>
      <p>
        Official Sarkari Patrika (officialsarkaripatrika.com) is an independent, privately-owned
        information portal. We are not affiliated with, endorsed by, or an official representative
        of any Central Government, State Government, ministry, department, board, or commission
        (such as UPSC, SSC, Railways, Banking sector, etc.).
      </p>

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

      <h2>5. External Links</h2>
      <p>
        All links on this website labeled &quot;Apply Online,&quot; &quot;Download Admit
        Card,&quot; and similar, redirect directly to the official website of the concerned
        department.
      </p>

      <p>For any queries, please contact us via our Contact Us page.</p>
    </div>
  )
}
