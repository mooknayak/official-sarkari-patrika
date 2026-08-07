// ✏️ एडिट फ़ाइल — मौजूदा फाइल में बदलें: src/app/api/push-subscribe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/writeClient'

export async function POST(req: NextRequest) {
  try {
    const { fcmToken } = await req.json()

    if (!fcmToken) {
      return NextResponse.json({ message: 'Invalid token data' }, { status: 400 })
    }

    const existing = await writeClient.fetch(
      `*[_type == "pushSubscriber" && fcmToken == $fcmToken][0]`,
      { fcmToken }
    )

    if (existing) {
      return NextResponse.json({ message: 'पहले से Subscribe है', success: true })
    }

    await writeClient.create({
      _type: 'pushSubscriber',
      fcmToken,
      subscribedAt: new Date().toISOString(),
    })

    return NextResponse.json({ message: 'Subscribe हो गया', success: true })
  } catch (err) {
    const message = (err as Error).message || 'कुछ गड़बड़ हो गई'
    return NextResponse.json(
      { message: `Sanity Write Error: ${message}` },
      { status: 500 }
    )
  }
}
