// ✏️ एडिट फ़ाइल — अब Firebase FCM Token की जगह Standard Web Push Subscription
// (endpoint + p256dh + auth) यहाँ Sanity में सेव होती है।
import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/writeClient'

export async function POST(req: NextRequest) {
  try {
    const { subscription } = await req.json()

    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return NextResponse.json({ message: 'Invalid subscription data' }, { status: 400 })
    }

    const existing = await writeClient.fetch(
      `*[_type == "pushSubscriber" && endpoint == $endpoint][0]`,
      { endpoint: subscription.endpoint }
    )

    if (existing) {
      return NextResponse.json({ message: 'पहले से Subscribe है', success: true })
    }

    await writeClient.create({
      _type: 'pushSubscriber',
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
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
