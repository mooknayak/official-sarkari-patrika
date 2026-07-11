import { revalidatePath } from 'next/cache'
import { parseBody } from 'next-sanity/webhook'
import { NextRequest, NextResponse } from 'next/server'

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

    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch (err) {
    return NextResponse.json({ message: (err as Error).message }, { status: 500 })
  }
}
