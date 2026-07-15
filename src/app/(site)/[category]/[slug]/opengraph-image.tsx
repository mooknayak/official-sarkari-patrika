import { ImageResponse } from 'next/og'
import { client } from '@/sanity/lib/client'
import { SINGLE_POST_QUERY } from '@/sanity/lib/queries'

export const runtime = 'edge'
export const alt = 'Official Sarkari Patrika'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: { category: string; slug: string } }) {
  const post = await client.fetch(SINGLE_POST_QUERY, { slug: params.slug })
  const title = post?.title || 'Official Sarkari Patrika'
  const displayTitle = title.length > 95 ? title.slice(0, 95) + '...' : title

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '56px',
          background: 'linear-gradient(135deg, #0B3D91 0%, #082B66 100%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 84,
              height: 84,
              borderRadius: 18,
              background: '#ffffff',
              flexShrink: 0,
            }}
          >
            <div style={{ fontSize: 34, fontWeight: 700, color: '#0B3D91' }}>OSP</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#ffffff' }}>
              Official Sarkari Patrika
            </div>
            <div style={{ fontSize: 16, color: '#FBE1ED', letterSpacing: 1 }}>
              OFFICIALSARKARIPATRIKA.COM
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 46,
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.35,
          }}
        >
          {displayTitle}
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 18,
            color: '#FBE1ED',
          }}
        >
          सटीक और समय पर सरकारी नौकरी, प्रवेश पत्र व परिणाम की जानकारी
        </div>
      </div>
    ),
    { ...size }
  )
}
