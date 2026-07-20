import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/writeClient'

export async function POST(req: NextRequest) {
  try {
    const { slug, type } = await req.json()

    if (!slug || (type !== 'helpful' && type !== 'not-helpful')) {
      return NextResponse.json({ message: 'Invalid data' }, { status: 400 })
    }

    const post = await writeClient.fetch(`*[_type == "jobPost" && slug.current == $slug][0]{ _id, helpfulCount, notHelpfulCount }`, {
      slug,
    })

    if (!post) {
      return NextResponse.json({ message: 'पोस्ट नहीं मिली' }, { status: 404 })
    }

    const field = type === 'helpful' ? 'helpfulCount' : 'notHelpfulCount'
    const currentValue = post[field] || 0

    await writeClient
      .patch(post._id)
      .set({ [field]: currentValue + 1 })
      .commit()

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ message: 'कुछ गड़बड़ हो गई' }, { status: 500 })
  }
}
