// ✏️ एडिट फ़ाइल — मौजूदा फाइल में बदलें: src/app/robots.ts
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://officialsarkaripatrika.com'

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/studio/', '/api/'],
    },
    sitemap: [`${SITE_URL}/sitemap.xml`, `${SITE_URL}/news-sitemap.xml`],
  }
}
