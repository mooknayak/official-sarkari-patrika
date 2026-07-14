import { revalidatePath } from 'next/cache'
import { parseBody } from 'next-sanity/webhook'
import { NextRequest, NextResponse } from 'next/server'
import { requestGoogleIndexing } from '@/lib/googleIndexing'

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

    // Google को तुरंत बताना कि यह पेज नया/अपडेट हुआ है
    // (सिर्फ तभी काम करेगा जब Indexing API सेटअप हो, वरना चुपचाप स्किप हो जाता है)
    const postUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${body.category}/${body.slug}`
    const indexingResult = await requestGoogleIndexing(postUrl)

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      googleIndexing: indexingResult,
    })
  } catch (err) {
    return NextResponse.json({ message: (err as Error).message }, { status: 500 })
  }
}
