import { client } from '@/sanity/lib/client'
import { SINGLE_POST_QUERY, ALL_SLUGS_QUERY, RELATED_POSTS_QUERY, SITE_SETTINGS_QUERY } from '@/sanity/lib/queries'
import StatusBadge from '@/components/StatusBadge'
import PostInfoBlock from '@/components/PostInfoBlock'
import ShareButtons from '@/components/ShareButtons'
import PostDescription from '@/components/PostDescription'
import AIFaqAssistant from '@/components/AIFaqAssistant'
import PostFeedback from '@/components/PostFeedback'
import CustomSectionsList from '@/components/CustomSections'
import ImportantDates from '@/components/ImportantDates'
import ApplicationFeeTable from '@/components/ApplicationFeeTable'
import CategoryWiseVacancy from '@/components/CategoryWiseVacancy'
import ImportantLinks from '@/components/ImportantLinks'
import StatusTimeline from '@/components/StatusTimeline'
import SchemaMarkup from '@/components/SchemaMarkup'
import JobCard from '@/components/JobCard'
import Link from 'next/link'
import Image from 'next/image'
import CommentsSection from '@/components/CommentsSection'
import PostBottomBanner from '@/components/PostBottomBanner'
import DiscoverMore from '@/components/DiscoverMore'
import type { Metadata } from 'next'
// ✏️ एडिट फ़ाइल — मौजूदा फाइल में बदलें: src/app/(site)/[category]/[slug]/page.tsx
import { notFound } from 'next/navigation'

export const revalidate = 3600

type Props = {
  params: { category: string; slug: string }
}

// Full Description (Portable Text/rich blocks) से सादा टेक्स्ट निकालता है -
// ताकि Google के JobPosting Schema की अनिवार्य "description" फील्ड में
// असली, सही जानकारी जा सके, सिर्फ generic fallback टेक्स्ट न जाए।
function extractPlainText(blocks?: any[], maxLength = 300): string {
  if (!blocks || blocks.length === 0) return ''
  const text = blocks
    .filter((block) => block._type === 'block' && block.children)
    .map((block) => block.children.map((child: any) => child.text).join(''))
    .join(' ')
    .trim()
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
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
      description: post.seo?.metaDescription,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${realCategorySlug}/${params.slug}`,
      siteName: 'Official Sarkari Patrika',
      locale: 'hi_IN',
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      // 🆕 पोस्ट में अपलोड की गई असली फ़ोटो हो तो वही दिखेगी, वरना अब कभी भी
      // खाली/बिना-Thumbnail Preview नहीं जाएगा - Default OSP Banner हमेशा दिखेगा
      // (WhatsApp, Facebook, Telegram जहाँ भी Link शेयर करें)
      images: [
        post.featuredImageUrl
          ? { url: post.featuredImageUrl, width: 1200, height: 675, alt: post.featuredImageAlt || post.title }
          : { url: `${process.env.NEXT_PUBLIC_SITE_URL}/og-default.png`, width: 1200, height: 630, alt: 'Official Sarkari Patrika' },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.seo?.metaDescription,
      images: [post.featuredImageUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/og-default.png`],
    },
  }
}

export default async function JobPostPage({ params }: Props) {
  const post = await client.fetch(SINGLE_POST_QUERY, { slug: params.slug })
  if (!post) return notFound()

  // 🆕 Post के नीचे वाला Banner और Discover More (Website Settings से) - Sanity
  // पहले से Cache करता है, इसलिए हर Post पर अलग से भारी fetch नहीं होता।
  const siteSettings = await client.fetch(SITE_SETTINGS_QUERY).catch(() => null)

  const realCategorySlug = post.category?.slug || params.category

  const related = await client.fetch(RELATED_POSTS_QUERY, {
    categorySlug: realCategorySlug,
    currentSlug: params.slug,
  })

  const pageUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${realCategorySlug}/${params.slug}`
  const hasFeeInfo = post.applicationFee?.general || post.applicationFee?.scst || post.applicationFee?.paymentMode
  const hasDatesInfo = post.importantDates && Object.values(post.importantDates).some((v) => v)

  // Priority: SEO meta description > Full Description से निकाला टेक्स्ट > Result/Admit Card जानकारी
  const bestDescription =
    post.seo?.metaDescription ||
    extractPlainText(post.description) ||
    post.resultInfo ||
    post.admitCardInfo ||
    ''

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
        importantDates={post.importantDates}
        applicationFee={post.applicationFee}
        totalVacancies={post.categoryWiseVacancy?.total}
        description={bestDescription}
        imageUrl={post.featuredImageUrl}
        jobLocation={post.jobLocation}
        salary={post.salary}
        breadcrumb={[
          { name: 'होम', url: process.env.NEXT_PUBLIC_SITE_URL || '' },
          {
            name: realCategorySlug.replace(/-/g, ' '),
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/${realCategorySlug}`,
          },
          { name: post.title, url: pageUrl },
        ]}
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

      {post.featuredImageUrl && (
        <Image
          src={`${post.featuredImageUrl}?w=1200&h=675&fit=max&auto=format`}
          alt={post.featuredImageAlt || post.title}
          width={1200}
          height={675}
          className="w-full h-auto rounded-lg border border-blue-100 mb-4"
          priority
        />
      )}

      <ShareButtons title={post.title} url={pageUrl} />

      {/* Post Info Block - मार्कशीट स्टाइल */}
      <PostInfoBlock
        title={post.title}
        publishedAt={post.publishedAt}
        updatedAt={post.updatedAt}
        organizationName={post.organization?.name}
        jobLocation={post.jobLocation}
        salaryText={post.salary?.payScaleText}
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

      <CustomSectionsList sections={post.customSectionsBeforeLinks} />

      <ImportantLinks links={post.importantLinks} />
      <StatusTimeline timeline={post.statusTimeline} />

      <CustomSectionsList sections={post.customSectionsAfterLinks} />

      <PostDescription value={post.description} />

      <AIFaqAssistant postTitle={post.title} postContext={bestDescription} />

      <PostFeedback slug={post.slug} />

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

      <CommentsSection postSlug={post.slug} postTitle={post.title} />

      {/* 🆕 Post के नीचे Banner — पहले इसी Post का अपना Banner चेक करता है, अगर वह
          खाली है तो Website Settings वाला Common (Global) Banner दिखाता है */}
      <PostBottomBanner
        imageUrl={post.postBanner?.imageUrl || siteSettings?.postBottomBanner?.imageUrl}
        link={post.postBanner?.imageUrl ? post.postBanner?.link : siteSettings?.postBottomBanner?.link}
        altText={post.postBanner?.imageUrl ? post.postBanner?.altText : siteSettings?.postBottomBanner?.altText}
      />

      {/* 🆕 Discover More — यह पूरी तरह इसी Post का अपना है (Website Settings वाले
          Discover More से बिल्कुल अलग, जो सिर्फ़ Homepage पर दिखता है) */}
      <DiscoverMore panels={post.discoverMorePanels} />
    </article>
  )
}
