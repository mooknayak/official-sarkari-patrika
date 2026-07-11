import type { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Official Sarkari Patrika से संपर्क करें',
}

export default function ContactUsPage() {
  return (
    <div className="prose max-w-none">
      <h1>संपर्क करें (Contact Us)</h1>
      <p>
        आपके सुझाव, शिकायत या किसी त्रुटि की जानकारी हमारे लिए महत्वपूर्ण है। कृपया नीचे दिए गए
        माध्यम से हमसे संपर्क करें:
      </p>
      <p>
        <strong>ईमेल:</strong> contact@officialsarkaripatrika.com
      </p>

      <ContactForm />

      <p className="text-sm text-slate-500 mt-6">
        कृपया ध्यान दें: हम फोन कॉल या WhatsApp के माध्यम से किसी भी व्यक्तिगत जानकारी का आदान-प्रदान
        नहीं करते। सभी संचार केवल आधिकारिक ईमेल के माध्यम से करें।
      </p>
    </div>
  )
}
