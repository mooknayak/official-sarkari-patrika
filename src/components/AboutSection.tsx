// 🆕 नई फ़ाइल: src/components/AboutSection.tsx
// Homepage का "About" सेक्शन: Header पट्टी + Feature कार्ड + FAQ (सवाल-जवाब) + Official Channels।
// करीब 90% English, 10% Hindi। Sanity → Website Settings → "ℹ️ Homepage - हमारे बारे में" से बदला जा सकता है।
// WhatsApp / Telegram / Facebook के Link Sanity → "Social Links" में भरिए।
// ⚠️ Default में सिर्फ़ वही बातें रखिए जो आपकी साइट पर सच हों। कोई बात सच न हो तो Sanity में बदल दीजिए
//    (Google AdSense व Search दोनों के लिए सही और सच्ची जानकारी सबसे ज़रूरी है)।
type Point = { icon?: string; title?: string; text?: string }
type Faq = { question?: string; answer?: string }
type Social = { whatsapp?: string; telegram?: string; facebook?: string }

const DEFAULT_HEADING = 'About Official Sarkari Patrika'

const DEFAULT_INTRO = [
  'Official Sarkari Patrika is an independent information portal for government job seekers in India.',
  'We share Sarkari Naukri alerts, Admit Cards, Results and Answer Keys in simple language. सही जानकारी, सही समय पर - यही हमारा प्रयास है।',
]

const DEFAULT_POINTS: Point[] = [
  { icon: '📢', title: 'Latest Government Jobs', text: 'New recruitment notifications with posts, eligibility, important dates and how to apply.' },
  { icon: '🪪', title: 'Admit Card & Exam Updates', text: 'Exam dates, city intimation slips and admit card download information.' },
  { icon: '📊', title: 'Result & Answer Key', text: 'Results, cut-off marks, merit lists and answer key updates from various departments.' },
  { icon: '🛠️', title: 'Free Tools & Guides', text: 'Photo and signature resizer, JPG to PDF converter, age calculator and document guides.' },
]

const DEFAULT_FAQS: Faq[] = [
  {
    question: 'What is Official Sarkari Patrika?',
    answer:
      'It is a free and independent information website for government job aspirants in India. We publish job notifications, admit cards, results and answer keys in a simple, easy-to-read format.',
  },
  {
    question: 'What can I find on this website?',
    answer:
      'Latest government jobs, admit card updates, result and cut-off news, answer key updates, document guides, government scheme information and free online tools.',
  },
  {
    question: 'Is this a government website?',
    answer:
      'No. We are not a government website and we are not affiliated with any government department. The word "Official" in our name does not mean official government status. Always confirm details on the department\'s official notification.',
  },
  {
    question: 'Where does the information come from?',
    answer:
      'Our posts are based on official notifications, department websites and public announcements. Posts are reviewed before they are published, and official links are included wherever they are available.',
  },
  {
    question: 'How often is the website updated?',
    answer:
      'We publish new posts as updates are released, and we update existing posts when new information becomes available, such as date extensions or corrections.',
  },
  {
    question: 'Is it free to use? Do you charge any fee?',
    answer:
      'Yes, it is free. We never charge for jobs, admit cards or results. We never ask for Aadhaar, bank details or OTP, so please stay away from anyone who does in our name.',
  },
  {
    question: 'Are your online tools safe to use?',
    answer:
      'Our photo, signature, PDF and resume tools work in your browser. Your files are not uploaded to our server.',
  },
  {
    question: 'Which platform is the website built on?',
    answer:
      'It is a Jamstack website built with Next.js. Pages are pre-built for fast loading and refreshed when new content is published.',
  },
  {
    question: 'How can I report a mistake or contact you?',
    answer:
      'Please use the Contact Us page in the footer. If you find an error in any post, tell us and we will review and correct it.',
  },
]

const DEFAULT_NOTE =
  'Disclaimer: Information on this website is for general guidance only. Please verify all details on the official notification and website before applying or making any payment. (आवेदन से पहले आधिकारिक अधिसूचना ज़रूर जाँचें।)'

const CHANNELS: { key: keyof Social; label: string; glyph: string; color: string }[] = [
  { key: 'whatsapp', label: 'WhatsApp Channel', glyph: 'W', color: 'bg-[#25D366]' },
  { key: 'telegram', label: 'Telegram Channel', glyph: 'T', color: 'bg-[#229ED9]' },
  { key: 'facebook', label: 'Facebook Page', glyph: 'f', color: 'bg-[#1877F2]' },
]

export default function AboutSection({
  enabled,
  heading,
  intro,
  points,
  faqs,
  note,
  socialLinks,
}: {
  enabled?: boolean
  heading?: string
  intro?: string
  points?: Point[]
  faqs?: Faq[]
  note?: string
  socialLinks?: Social
}) {
  if (enabled === false) return null

  const paragraphs = intro?.trim()
    ? intro.split(/\n{1,}/).map((p) => p.trim()).filter(Boolean)
    : DEFAULT_INTRO
  const cards = (points && points.length > 0 ? points : DEFAULT_POINTS).filter((p) => p.title && p.text)
  const questions = (faqs && faqs.length > 0 ? faqs : DEFAULT_FAQS).filter((f) => f.question && f.answer)
  const channels = CHANNELS.filter((c) => /^https:\/\//i.test(socialLinks?.[c.key] || ''))

  return (
    <section
      aria-labelledby="about-heading"
      className="mt-12 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm"
    >
      {/* Header band */}
      <div className="bg-gradient-to-br from-brand-blue to-brand-blueDark px-5 py-6 text-white md:px-8">
        <h2 id="about-heading" className="text-xl font-bold md:text-2xl">
          {heading?.trim() || DEFAULT_HEADING}
        </h2>
        <div className="mt-2 space-y-1 text-sm leading-relaxed text-blue-100 md:text-[15px]">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <ul className="mt-4 flex flex-wrap gap-2 text-xs font-medium">
          <li className="rounded-full bg-white/15 px-3 py-1">Independent Portal</li>
          <li className="rounded-full bg-white/15 px-3 py-1">Free to Use</li>
          <li className="rounded-full bg-white/15 px-3 py-1">Jamstack Website (Next.js)</li>
        </ul>
      </div>

      <div className="p-5 md:p-8">
        {/* Feature cards */}
        {cards.length > 0 && (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {cards.map((c, i) => (
              <li key={i} className="flex gap-3 rounded-xl border border-blue-100 bg-brand-blueLight p-4">
                {c.icon && (
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-xl shadow-sm"
                  >
                    {c.icon}
                  </span>
                )}
                <div>
                  <h3 className="font-semibold text-brand-blueDark">{c.title}</h3>
                  <p className="mt-0.5 text-sm leading-relaxed text-slate-600">{c.text}</p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* FAQ - सवाल-जवाब */}
        {questions.length > 0 && (
          <div className="mt-8">
            <h3 className="mb-4 border-l-4 border-brand-pinkAccent pl-3 text-lg font-bold text-brand-blueDark">
              Frequently Asked Questions
            </h3>
            <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
              {questions.map((f, i) => (
                <div key={i} className="border-t border-blue-100 pt-3">
                  <h4 className="font-semibold text-brand-blueDark">{f.question}</h4>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{f.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Official channels */}
        {channels.length > 0 && (
          <div className="mt-8 rounded-xl border border-brand-pink bg-brand-pink/40 p-4 text-center">
            <h3 className="font-bold text-brand-blueDark">Join Our Official Channels</h3>
            <p className="mt-1 text-sm text-slate-600">
              Get job alerts, admit cards and results first. हमसे जुड़ें।
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {channels.map((c) => (
                <a
                  key={c.key}
                  href={socialLinks?.[c.key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 ${c.color}`}
                >
                  <span
                    aria-hidden="true"
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-white/25 text-xs font-bold"
                  >
                    {c.glyph}
                  </span>
                  {c.label}
                </a>
              ))}
            </div>
          </div>
        )}

        <p className="mt-6 rounded-lg border border-blue-100 bg-slate-50 p-3 text-xs leading-relaxed text-slate-600">
          {note?.trim() || DEFAULT_NOTE}
        </p>
      </div>
    </section>
  )
}
