import { client } from '@/sanity/lib/client'
import { SINGLE_POST_QUERY, ALL_SLUGS_QUERY, RELATED_POSTS_QUERY } from '@/sanity/lib/queries'
import StatusBadge from '@/components/StatusBadge'
import ImportantDates from '@/components/ImportantDates'
import ImportantLinks from '@/components/ImportantLinks'
import StatusTimeline from '@/components/StatusTimeline'
import SchemaMarkup from '@/components/SchemaMarkup'
import JobCard from '@/components/JobCard'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const revalidate = 3600

type Props = {
  params: { category: string; slug: string }
}

export async function generateStaticParams() {
  const posts = await client.fetch(ALL_SLUGS_QUERY)
  // Safety filter: अगर किसी पोस्ट की category या slug खाली/undefined है,
  // तो उसे static pages की लिस्ट से बाहर रखें ताकि वो अकेली पोस्ट पूरी
  // वेबसाइट का बिल्ड न तोड़े। ऐसी पोस्ट सिर्फ तब दिखेगी जब उसमें category सेट होगी।
  return posts
    .filter((post: any) => post.category && post.slug)
    .map((post: any) => ({ category: post.category, slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await client.fetch(SINGLE_POST_QUERY, { slug: params.slug })
  if (!post) return {}

  // Canonical हमेशा पोस्ट की असली/स्थायी category से बनता है - भले ही यूज़र इसे
  // किसी status-based बॉक्स (जैसे /result) से खोलकर आया हो। इससे एक ही कंटेंट के
  // लिए एक ही canonical URL रहता है, duplicate-content की समस्या नहीं होती।
  const realCategorySlug = post.category?.slug || params.category

  return {
    title: post.seo?.metaTitle || `${post.title} - Apply Online, Dates, Eligibility`,
    description: post.seo?.metaDescription,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${realCategorySlug}/${params.slug}`,
    },
    robots: post.seo?.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: post.title,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
    },
  }
}

export default async function JobPostPage({ params }: Props) {
  const post = await client.fetch(SINGLE_POST_QUERY, { slug: params.slug })
  if (!post) return notFound()

  const realCategorySlug = post.category?.slug || params.category

  const related = await client.fetch(RELATED_POSTS_QUERY, {
    categorySlug: realCategorySlug,
    currentSlug: params.slug,
  })

  const pageUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${realCategorySlug}/${params.slug}`

  return (
    <article>
      <SchemaMarkup
        title={post.title}
        status={post.status}
        publishedAt={post.publishedAt}
        updatedAt={post.updatedAt}
        applicationEnd={post.importantDates?.applicationEnd}
        organization={post.organization}
        url={pageUrl}
      />

      <nav className="text-xs text-slate-500 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-blue">होम</Link>
        <span>/</span>
        <Link href={`/${realCategorySlug}`} className="hover:text-brand-blue capitalize">
          {realCategorySlug.replace(/-/g, ' ')}
        </Link>
        <span>/</span>
        <span className="text-slate-400 truncate max-w-[200px]">{post.title}</span>
      </nav>

      <div className="mb-3 flex items-center gap-2 flex-wrap">
        <StatusBadge status={post.status} />
        {post.updatedAt && (
          <span className="text-xs text-slate-400">
            Last Updated: {new Date(post.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        )}
      </div>
      <h1 className="text-2xl font-bold text-brand-blueDark mb-2">{post.title}</h1>
      {post.organization?.name && (
        <p className="text-slate-500 mb-4">{post.organization.name}</p>
      )}

      {/* Status के हिसाब से conditional सेक्शन */}
      {post.status === 'job' && post.vacancyDetails && post.vacancyDetails.length > 0 && (
        <section className="my-6 border border-slate-200 rounded-lg overflow-hidden">
          <h2 className="bg-brand-blue text-white px-4 py-2 font-semibold">पद विवरण (Vacancy Details)</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="px-4 py-2">पद का नाम</th>
                <th className="px-4 py-2">कुल पद</th>
                <th className="px-4 py-2">पात्रता</th>
              </tr>
            </thead>
            <tbody>
              {post.vacancyDetails.map((v: any, idx: number) => (
                <tr key={idx} className="border-t border-slate-100">
                  <td className="px-4 py-2">{v.postName}</td>
                  <td className="px-4 py-2">{v.totalPosts}</td>
                  <td className="px-4 py-2">{v.eligibility}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {post.status === 'admit_card' && post.admitCardInfo && (
        <section className="my-6 border border-slate-200 rounded-lg p-4 bg-yellow-50">
          <h2 className="font-semibold text-brand-blueDark mb-2">प्रवेश पत्र जानकारी</h2>
          <p className="text-slate-700 whitespace-pre-line">{post.admitCardInfo}</p>
        </section>
      )}

      {(post.status === 'result' || post.status === 'final_selection') && post.resultInfo && (
        <section className="my-6 border border-slate-200 rounded-lg p-4 bg-red-50">
          <h2 className="font-semibold text-brand-blueDark mb-2">परिणाम जानकारी</h2>
          <p className="text-slate-700 whitespace-pre-line">{post.resultInfo}</p>
        </section>
      )}

      <ImportantDates dates={post.importantDates} />
      <ImportantLinks links={post.importantLinks} />
      <StatusTimeline timeline={post.statusTimeline} />

      {post.description && (
        <section className="prose max-w-none my-6">
          {/* अगर आप Portable Text रेंडर करना चाहें तो यहाँ @portabletext/react इस्तेमाल करें */}
        </section>
      )}

      {related && related.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-bold text-brand-blueDark mb-4">संबंधित पोस्ट</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {related.map((r: any) => (
              <JobCard
                key={r.slug}
                title={r.title}
                slug={r.slug}
                category={r.category}
                status={r.status}
              />
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
