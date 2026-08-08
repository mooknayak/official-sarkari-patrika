// ✏️ एडिट फ़ाइल — मौजूदा फाइल में बदलें: src/components/SchemaMarkup.tsx
type Organization = {
  name?: string
  website?: string
}

type ImportantDatesType = {
  applicationStart?: string
  applicationEnd?: string
  admitCardDate?: string
  examDate?: string
  resultDate?: string
}

type ApplicationFeeType = {
  general?: string
  scst?: string
  paymentMode?: string
}

type SalaryType = {
  minAmount?: number
  maxAmount?: number
  payScaleText?: string
}

type SchemaProps = {
  title: string
  status: string
  publishedAt?: string
  updatedAt?: string
  applicationEnd?: string
  organization?: Organization
  url: string
  importantDates?: ImportantDatesType
  applicationFee?: ApplicationFeeType
  totalVacancies?: number
  description?: string
  breadcrumb?: { name: string; url: string }[]
  imageUrl?: string
  jobLocation?: string
  salary?: SalaryType
}

function formatDate(dateStr?: string) {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

// पोस्ट के मौजूदा डेटा से खुद-ब-खुद FAQ सवाल-जवाब बनाता है।
// यह Google AI Overview और "People Also Ask" में दिखने की संभावना बढ़ाता है,
// बिना Editor को अलग से कुछ लिखना पड़े।
function buildFAQEntities(
  title: string,
  organizationName: string,
  importantDates?: ImportantDatesType,
  applicationFee?: ApplicationFeeType,
  totalVacancies?: number
) {
  const faqs: { question: string; answer: string }[] = []

  const lastDate = formatDate(importantDates?.applicationEnd)
  if (lastDate) {
    faqs.push({
      question: `${title} के लिए आवेदन की अंतिम तिथि क्या है?`,
      answer: `${title} के लिए आवेदन की अंतिम तिथि ${lastDate} है। सटीक जानकारी के लिए आधिकारिक अधिसूचना अवश्य देखें।`,
    })
  }

  const examDate = formatDate(importantDates?.examDate)
  if (examDate) {
    faqs.push({
      question: `${title} की परीक्षा कब होगी?`,
      answer: `${title} की परीक्षा तिथि ${examDate} निर्धारित है। अपडेट के लिए आधिकारिक सूचना देखते रहें।`,
    })
  }

  if (applicationFee?.general) {
    faqs.push({
      question: `${title} के लिए आवेदन शुल्क कितना है?`,
      answer: `सामान्य/OBC वर्ग के लिए आवेदन शुल्क ${applicationFee.general} है।${
        applicationFee.scst ? ` SC/ST/PH वर्ग के लिए यह ${applicationFee.scst} है।` : ''
      }`,
    })
  }

  if (totalVacancies) {
    faqs.push({
      question: `${title} में कुल कितने पद हैं?`,
      answer: `${organizationName || 'संबंधित विभाग'} द्वारा ${title} के अंतर्गत कुल ${totalVacancies} पदों पर भर्ती निकाली गई है।`,
    })
  }

  return faqs
}

export default function SchemaMarkup({
  title,
  status,
  publishedAt,
  updatedAt,
  applicationEnd,
  organization,
  url,
  importantDates,
  applicationFee,
  totalVacancies,
  description,
  breadcrumb,
  imageUrl,
  jobLocation,
  salary,
}: SchemaProps) {
  // Google को हर JobPosting में "description" अनिवार्य चाहिए - खाली होने पर
  // Rich Result "invalid" मान लिया जाता है। इसलिए हमेशा एक भरोसेमंद
  // fallback टेक्स्ट तैयार रखते हैं, चाहे Editor ने कुछ अलग से न लिखा हो।
  const jobDescription =
    description && description.trim().length > 0
      ? description
      : `${title} - ${organization?.name || 'संबंधित सरकारी विभाग'} द्वारा जारी अधिसूचना। ${
          totalVacancies ? `कुल ${totalVacancies} पदों पर भर्ती। ` : ''
        }पूरी जानकारी, पात्रता, महत्वपूर्ण तिथियों और आवेदन प्रक्रिया के लिए Official Sarkari Patrika पर यह पोस्ट देखें।`

  // 🌍 Job Location — अगर Editor ने Location भरी है तो असली State/City Google को
  // दिखाएँगे, वरना सिर्फ़ Country-level (India) पर वापस चले जाएँगे। Google Jobs में
  // बिना सही Location के Listing दिखने की संभावना बहुत कम हो जाती है।
  const buildJobLocation = () => {
    const trimmed = jobLocation?.trim()
    const isAllIndia = !trimmed || /all india|पूरे भारत|भारत भर/i.test(trimmed)
    return {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'IN',
        ...(!isAllIndia && { addressRegion: trimmed }),
      },
    }
  }

  // 💰 Salary — अगर Editor ने न्यूनतम/अधिकतम राशि भरी है तो सही Structured Data
  // (baseSalary) भेजा जाएगा। सिर्फ़ Text (जैसे "Pay Level 4") भरने पर वह पेज पर
  // दिखेगा, पर तब Structured Data में नहीं जाएगा क्योंकि Google को इसके लिए ठोस
  // संख्या चाहिए, सिर्फ़ टेक्स्ट काफ़ी नहीं है।
  const buildBaseSalary = () => {
    if (!salary?.minAmount && !salary?.maxAmount) return null
    return {
      '@type': 'MonetaryAmount',
      currency: 'INR',
      value: {
        '@type': 'QuantitativeValue',
        ...(salary.minAmount && { minValue: salary.minAmount }),
        ...(salary.maxAmount && { maxValue: salary.maxAmount }),
        unitText: 'MONTH',
      },
    }
  }

  const baseSalary = buildBaseSalary()

  const mainSchema =
    status === 'job'
      ? {
          '@context': 'https://schema.org',
          '@type': 'JobPosting',
          title,
          description: jobDescription,
          datePosted: publishedAt,
          validThrough: applicationEnd,
          employmentType: 'FULL_TIME',
          ...(imageUrl && { image: imageUrl }),
          hiringOrganization: {
            '@type': 'Organization',
            name: organization?.name || 'Government of India',
            sameAs: organization?.website,
          },
          jobLocation: buildJobLocation(),
          ...(baseSalary && { baseSalary }),
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: title,
          description: jobDescription,
          datePublished: publishedAt,
          dateModified: updatedAt,
          mainEntityOfPage: url,
          ...(imageUrl && { image: [imageUrl] }),
          author: {
            '@type': 'Organization',
            name: 'Official Sarkari Patrika',
          },
        }

  const faqs = buildFAQEntities(title, organization?.name || '', importantDates, applicationFee, totalVacancies)

  const faqSchema =
    faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }
      : null

  const breadcrumbSchema =
    breadcrumb && breadcrumb.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumb.map((item, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: item.name,
            item: item.url,
          })),
        }
      : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mainSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
    </>
  )
}
