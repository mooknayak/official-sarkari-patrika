import { revalidatePath } from 'next/cache'
import { parseBody } from 'next-sanity/webhook'
import { NextRequest, NextResponse } from 'next/server'
import { requestGoogleIndexing } from '@/lib/googleIndexing'
import { sendPushToAllSubscribers } from '@/lib/pushNotification'
import { client } from '@/sanity/lib/client'

type WebhookPayload = {
  slug?: string
  category?: string
}

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<WebhookPayload>(
      req,
      process.env.SANITY_REVALIDATE_SECRET
    )

    if (!isValidSignature) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 401 })
    }
    if (!body?.slug || !body?.category) {
      return NextResponse.json({ message: 'Missing slug or category' }, { status: 400 })
    }

    revalidatePath(`/${body.category}/${body.slug}`)
    revalidatePath(`/${body.category}`)
    revalidatePath('/')

    const postUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${body.category}/${body.slug}`

    // Google Indexing और Push Notification एक साथ (parallel) - तेज़ रिस्पॉन्स
    const [indexingResult, pushResult] = await Promise.allSettled([
      requestGoogleIndexing(postUrl),
      client
        .fetch(`*[slug.current == $slug][0].title`, { slug: body.slug })
        .then((title: string) => sendPushToAllSubscribers(title || 'नई अपडेट उपलब्ध है', postUrl)),
    ])

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      googleIndexing:
        indexingResult.status === 'fulfilled'
          ? indexingResult.value
          : { success: false, message: (indexingResult.reason as Error)?.message },
      pushNotification:
        pushResult.status === 'fulfilled'
          ? pushResult.value
          : { success: false, message: (pushResult.reason as Error)?.message },
    })
  } catch (err) {
    console.error('[Revalidate] विफल:', (err as Error).message)
    return NextResponse.json({ message: (err as Error).message }, { status: 500 })
  }
}
