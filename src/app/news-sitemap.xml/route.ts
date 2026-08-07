// 🆕 नई फ़ाइल — इसे इसी पाथ पर बनाएं: src/app/news-sitemap.xml/route.ts
// (यह फ़ाइल पहले गलती से डिलीट हो गई थी, अब वापस बनाई गई है + अब हर पोस्ट की फ़ोटो भी शामिल है)

import { client } from '@/sanity/lib/client'
import { NEWS_SITEMAP_QUERY, SITE_SETTINGS_QUERY } from '@/sanity/lib/queries'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://officialsarkaripatrika.com'

function escapeXml(value: unknown) {
  const str = value == null ? '' : String(value)
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// 📰 Google News Sitemap Standard: सिर्फ पिछले 48 घंटों के अंदर प्रकाशित लेख ही शामिल होने चाहिए।
// साथ ही हर <url> में उसकी असली फ़ोटो (news:image / image:image) भी भेजी जाती है, ताकि
// Google News और Discover में पोस्ट फ़ोटो के साथ दिखे।
// संदर्भ: https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemap
export async function GET() {
  const since = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()

  const [posts, settings]: [any[], any] = await Promise.all([
    client.fetch(NEWS_SITEMAP_QUERY, { since }).catch(() => []),
    client.fetch(SITE_SETTINGS_QUERY).catch(() => null),
  ])

  // Editor Website Settings में News Sitemap को OFF कर सकता है (आपातकाल में)
  if (settings && settings.enableNewsSitemap === false) {
    const emptyXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`
    return new Response(emptyXml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
  }

  const publicationName = settings?.googleNewsPublicationName || 'Official Sarkari Patrika'
  const validPosts = (posts || []).filter((post) => post?.title && post?.slug && post?.category)

  const urls = validPosts
    .map((post) => {
      const url = `${SITE_URL}/${post.category}/${post.slug}`
      const pubDate = new Date(post.publishedAt || post._createdAt).toISOString()
      const imageBlock = post.imageUrl
        ? `
    <image:image>
      <image:loc>${escapeXml(post.imageUrl)}</image:loc>
    </image:image>`
        : ''
      return `
  <url>
    <loc>${url}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(publicationName)}</news:name>
        <news:language>hi</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${escapeXml(post.title)}</news:title>
    </news:news>${imageBlock}
  </url>`
    })
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${urls}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      // News sitemap बार-बार अपडेट होना चाहिए, इसलिए Cache time छोटा रखा है
      'Cache-Control': 'public, max-age=300, s-maxage=300',
    },
  })
}
