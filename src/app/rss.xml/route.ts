import { client } from '@/sanity/lib/client'
import { HOMEPAGE_LATEST_QUERY } from '@/sanity/lib/queries'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://officialsarkaripatrika.com'

function escapeXml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const posts: any[] = await client.fetch(HOMEPAGE_LATEST_QUERY)

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/${post.category}/${post.slug}`
      const pubDate = post.updatedAt ? new Date(post.updatedAt).toUTCString() : new Date().toUTCString()
      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(post.categoryTitle || post.category)}</category>
      ${post.organization ? `<description>${escapeXml(post.organization)}</description>` : ''}
    </item>`
    })
    .join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Official Sarkari Patrika - नवीनतम सरकारी नौकरी, प्रवेश पत्र व परिणाम</title>
    <link>${SITE_URL}</link>
    <description>नवीनतम सरकारी नौकरी अधिसूचना, प्रवेश पत्र और परिणाम की सटीक व समय पर जानकारी।</description>
    <language>hi-IN</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
