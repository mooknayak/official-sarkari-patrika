type Organization = {
  name?: string
  website?: string
}

type SchemaProps = {
  title: string
  status: string
  publishedAt?: string
  updatedAt?: string
  applicationEnd?: string
  organization?: Organization
  url: string
}

export default function SchemaMarkup({
  title,
  status,
  publishedAt,
  updatedAt,
  applicationEnd,
  organization,
  url,
}: SchemaProps) {
  // status = job होने पर JobPosting schema, अन्यथा Article schema
  const schema =
    status === 'job'
      ? {
          '@context': 'https://schema.org',
          '@type': 'JobPosting',
          title,
          datePosted: publishedAt,
          validThrough: applicationEnd,
          employmentType: 'FULL_TIME',
          hiringOrganization: {
            '@type': 'Organization',
            name: organization?.name || 'Government of India',
            sameAs: organization?.website,
          },
          jobLocation: {
            '@type': 'Place',
            address: { '@type': 'PostalAddress', addressCountry: 'IN' },
          },
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: title,
          datePublished: publishedAt,
          dateModified: updatedAt,
          mainEntityOfPage: url,
          author: {
            '@type': 'Organization',
            name: 'Official Sarkari Patrika',
          },
        }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
