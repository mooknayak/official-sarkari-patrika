import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Official Sarkari Patrika'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0B3D91 0%, #082B66 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 140,
            height: 140,
            borderRadius: 24,
            background: '#ffffff',
            marginBottom: 32,
          }}
        >
          <div style={{ fontSize: 56, fontWeight: 700, color: '#0B3D91' }}>OSP</div>
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 64,
            fontWeight: 800,
            color: '#ffffff',
            textAlign: 'center',
          }}
        >
          Official Sarkari Patrika
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 28,
            color: '#FBE1ED',
            marginTop: 16,
            letterSpacing: 2,
          }}
        >
          OFFICIALSARKARIPATRIKA.COM
        </div>
      </div>
    ),
    { ...size }
  )
}
