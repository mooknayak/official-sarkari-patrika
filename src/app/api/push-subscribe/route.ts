import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/writeClient'

export async function POST(req: NextRequest) {
  try {
    const subscription = await req.json()
    const { endpoint, keys } = subscription

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return NextResponse.json({ message: 'Invalid subscription data' }, { status: 400 })
    }

    const existing = await writeClient.fetch(
      `*[_type == "pushSubscriber" && endpoint == $endpoint][0]`,
      { endpoint }
    )

    if (existing) {
      return NextResponse.json({ message: 'पहले से Subscribe है', success: true })
    }

    await writeClient.create({
      _type: 'pushSubscriber',
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
      subscribedAt: new Date().toISOString(),
    })

    return NextResponse.json({ message: 'Subscribe हो गया', success: true })
  } catch (err) {
    return NextResponse.json({ message: 'कुछ गड़बड़ हो गई' }, { status: 500 })
  }
}
