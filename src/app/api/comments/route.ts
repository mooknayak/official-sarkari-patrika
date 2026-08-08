// 🆕 नई फ़ाइल — Comments अब यहाँ से Sanity में सेव होते हैं (Firestore की जगह)।
import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/writeClient'
import { client } from '@/sanity/lib/client'

// GET /api/comments?slug=xxx — किसी एक पोस्ट के सारे Comments (नए सबसे ऊपर)
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  if (!slug) {
    return NextResponse.json({ message: 'slug ज़रूरी है' }, { status: 400 })
  }
  try {
    const comments = await client.fetch(
      `*[_type == "comment" && postSlug == $slug] | order(createdAt desc){
        _id, name, message, createdAt, reply
      }`,
      { slug }
    )
    return NextResponse.json({ comments })
  } catch (err) {
    return NextResponse.json(
      { message: (err as Error).message || 'Comments लोड नहीं हो पाए' },
      { status: 500 }
    )
  }
}

// POST /api/comments — नया Comment जोड़ना
export async function POST(req: NextRequest) {
  try {
    const { postSlug, postTitle, name, message } = await req.json()

    if (!postSlug || !message || !message.trim()) {
      return NextResponse.json({ message: 'postSlug और message ज़रूरी हैं' }, { status: 400 })
    }

    const created = await writeClient.create({
      _type: 'comment',
      postSlug,
      postTitle: postTitle || '',
      name: (name || '').trim().slice(0, 60) || 'अज्ञात',
      message: message.trim().slice(0, 1000),
      createdAt: new Date().toISOString(),
      reply: null,
    })

    return NextResponse.json({ success: true, comment: created })
  } catch (err) {
    return NextResponse.json(
      { message: (err as Error).message || 'Comment भेजने में समस्या हुई' },
      { status: 500 }
    )
  }
}
