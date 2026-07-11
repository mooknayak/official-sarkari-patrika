import { client } from '@/sanity/lib/client'
import { ALL_SLUGS_QUERY } from '@/sanity/lib/queries'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://officialsarkaripatrika.com'

export default async function sitemap() {
  const posts: { slug: string; category: string }[] = await client.fetch(
    `*[_type == "jobPost"]{ "slug": slug.current, "category": category->slug.current, updatedAt }`
  )

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

  const postPages = posts
    .filter((p) => p.slug && p.category)
    .map((post: any) => ({
      url: `${SITE_URL}/${post.category}/${post.slug}`,
      lastModified: post.updatedAt || new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }))

  return [...staticPages, ...postPages]
}
