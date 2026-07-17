import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/writeClient'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ message: 'कृपया एक सही ईमेल आईडी डालें।' }, { status: 400 })
    }

    // पहले चेक करें कि यह ईमेल पहले से मौजूद तो नहीं
    const existing = await writeClient.fetch(`*[_type == "subscriber" && email == $email][0]`, {
      email,
    })

    if (existing) {
      return NextResponse.json({ message: 'यह ईमेल पहले से रजिस्टर्ड है।', alreadyExists: true })
    }

    await writeClient.create({
      _type: 'subscriber',
      email,
      subscribedAt: new Date().toISOString(),
    })

    return NextResponse.json({ message: 'सफलतापूर्वक Subscribe हो गया!', success: true })
  } catch (err) {
    return NextResponse.json(
      { message: 'कुछ गड़बड़ हो गई, कृपया फिर से कोशिश करें।' },
      { status: 500 }
    )
  }
}
