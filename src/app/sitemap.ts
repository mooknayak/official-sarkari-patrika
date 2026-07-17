import { client } from '@/sanity/lib/client'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://officialsarkaripatrika.com'

export default async function sitemap() {
  const [posts, categories, organizations] = await Promise.all([
    client.fetch<{ slug: string; category: string; updatedAt?: string }[]>(
      `*[_type == "jobPost"]{ "slug": slug.current, "category": category->slug.current, updatedAt }`
    ),
    client.fetch<{ slug: string }[]>(`*[_type == "category" && defined(slug.current)]{ "slug": slug.current }`),
    client.fetch<{ slug: string }[]>(
      `*[_type == "organization" && defined(slug.current)]{ "slug": slug.current }`
    ),
  ])

  const staticPages = [
    '',
    '/privacy-policy',
    '/terms-and-conditions',
    '/disclaimer',
    '/about-us',
    '/contact-us',
    '/organizations',
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

  const organizationPages = organizations
    .filter((org) => org.slug)
    .map((org) => ({
      url: `${SITE_URL}/organization/${org.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

  const postPages = posts
    .filter((p) => p.slug && p.category)
    .map((post) => ({
      url: `${SITE_URL}/${post.category}/${post.slug}`,
      lastModified: post.updatedAt || new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }))

  return [...staticPages, ...categoryPages, ...organizationPages, ...postPages]
}
