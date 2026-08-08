// ✏️ एडिट फ़ाइल — मौजूदा फाइल में बदलें: src/app/(site)/contact-us/page.tsx
// 🆕 अब एक असली, नामित Contact Person (Diwakar Kumar) दिखता है - Google AdSense
// Review Team किसी अनाम ईमेल की जगह एक असली इंसान का नाम देखकर ज़्यादा भरोसा
// करती है। Response Time की जानकारी भी जोड़ी गई है।
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
        <strong>Contact Person:</strong> Diwakar Kumar (Founder)
        <br />
        <strong>Email:</strong>{' '}
        <a href="mailto:officialsarkaripatrika@gmail.com">officialsarkaripatrika@gmail.com</a>
        <br />
        <strong>Response Time:</strong> We usually respond within 24-48 hours on working days.
      </p>

      <ContactForm />

      <p className="text-sm text-slate-500 mt-6">
        Please note: We do not exchange any personal information via phone calls or WhatsApp. All
        communication should be conducted only through official email.
      </p>
    </div>
  )
}
