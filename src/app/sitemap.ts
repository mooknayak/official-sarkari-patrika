import { client } from '@/sanity/lib/client'

// 🆕 Safety-Net: भले ही हर नई Post पर Revalidate Webhook अब Sitemap को Refresh
// करे, फिर भी अगर कभी कोई Webhook Fail हो जाए, तो यह Sitemap खुद-ब-खुद हर 1 घंटे
// में ताज़ा हो जाएगी - ताकि कोई भी नई Post कभी 1 घंटे से ज़्यादा Sitemap से बाहर न रहे।
export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://officialsarkaripatrika.com'

export default async function sitemap() {
  const [posts, categories] = await Promise.all([
    client.fetch<{ slug: string; category: string; updatedAt?: string }[]>(
      `*[_type == "jobPost" && !(seo.noIndex == true)]{ "slug": slug.current, "category": category->slug.current, updatedAt }`
    ),
    client.fetch<{ slug: string }[]>(`*[_type == "category" && defined(slug.current)]{ "slug": slug.current }`),
  ])

  const staticPages = [
    '',
    '/privacy-policy',
    '/terms-and-conditions',
    '/disclaimer',
    '/about-us',
    '/contact-us',
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.5,
  }))

  const categoryPages = categories
    .filter((c) => c.slug)
    .map((cat) => ({
      url: `${SITE_URL}/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }))

  const postPages = posts
    .filter((p) => p.slug && p.category)
    .map((post) => ({
      url: `${SITE_URL}/${post.category}/${post.slug}`,
      lastModified: post.updatedAt || new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }))

  return [...staticPages, ...categoryPages, ...postPages]
}
