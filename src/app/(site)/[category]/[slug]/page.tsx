import { client } from '@/sanity/lib/client'
import { SINGLE_POST_QUERY, ALL_SLUGS_QUERY, RELATED_POSTS_QUERY } from '@/sanity/lib/queries'
import StatusBadge from '@/components/StatusBadge'
import PostInfoBlock from '@/components/PostInfoBlock'
import ImportantDates from '@/components/ImportantDates'
import ApplicationFeeTable from '@/components/ApplicationFeeTable'
import CategoryWiseVacancy from '@/components/CategoryWiseVacancy'
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
  return posts
    .filter((post: any) => post.category && post.slug)
    .map((post: any) => ({ category: post.category, slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await client.fetch(SINGLE_POST_QUERY, { slug: params.slug })
  if (!post) return {}

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
  const hasFeeInfo = post.applicationFee?.general || post.applicationFee?.scst || post.applicationFee?.paymentMode
  const hasDatesInfo = post.importantDates && Object.values(post.importantDates).some((v) => v)

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
      </div>
      <h1 className="text-2xl font-bold text-brand-blueDark mb-4">{post.title}</h1>

      {/* Post Info Block - मार्कशीट स्टाइल */}
      <PostInfoBlock
        title={post.title}
        publishedAt={post.publishedAt}
        updatedAt={post.updatedAt}
        organizationName={post.organization?.name}
      />

      {/* Important Dates + Application Fee - साथ-साथ, बॉर्डर वाले */}
      {(hasDatesInfo || hasFeeInfo) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {hasDatesInfo && <ImportantDates dates={post.importantDates} />}
          {hasFeeInfo && <ApplicationFeeTable fee={post.applicationFee} />}
        </div>
      )}

      {/* Status के हिसाब से conditional सेक्शन */}
      {post.status === 'job' && post.vacancyDetails && post.vacancyDetails.length > 0 && (
        <section className="my-6 border border-blue-200 rounded-lg overflow-hidden">
          <h2 className="bg-brand-blue text-white px-4 py-2 font-semibold text-center">Vacancy Details</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-brand-blueLight">
                  <th className="border border-blue-200 px-3 py-2 text-brand-blueDark">पद का नाम</th>
                  <th className="border border-blue-200 px-3 py-2 text-brand-blueDark">कुल पद</th>
                  <th className="border border-blue-200 px-3 py-2 text-brand-blueDark">पात्रता</th>
                </tr>
              </thead>
              <tbody>
                {post.vacancyDetails.map((v: any, idx: number) => (
                  <tr key={idx}>
                    <td className="border border-blue-200 px-3 py-2">{v.postName}</td>
                    <td className="border border-blue-200 px-3 py-2 font-semibold text-brand-pinkAccent">{v.totalPosts}</td>
                    <td className="border border-blue-200 px-3 py-2 text-slate-600">{v.eligibility}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <CategoryWiseVacancy data={post.categoryWiseVacancy} />

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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
