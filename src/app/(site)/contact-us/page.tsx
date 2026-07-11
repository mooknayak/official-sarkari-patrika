import type { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Official Sarkari Patrika',
}

export default function ContactUsPage() {
  return (
    <div className="prose max-w-none">
      <h1>Contact Us</h1>
      <p>
        Your feedback, complaints, or reports of any errors are important to us. Please reach out
        to us through the following channel:
      </p>
      <p>
        <strong>Email:</strong> contact@officialsarkaripatrika.com
      </p>

      <ContactForm />

      <p className="text-sm text-slate-500 mt-6">
        Please note: We do not exchange any personal information via phone calls or WhatsApp. All
        communication should be conducted only through official email.
      </p>
    </div>
  )
}
