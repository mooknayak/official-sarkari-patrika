// ✏️ एडिट फ़ाइल — मौजूदा फाइल में बदलें: src/app/api/revalidate/route.ts
//
// 🔧 ज़रूरी सुधार: पहले अगर Slug/Category न मिले (जैसे "Website Settings"
// वाला Document Publish होने पर - उसमें कोई Slug/Category होता ही नहीं),
// यह Function सीधे 400 Error देकर रुक जाता था और कुछ भी Refresh नहीं करता
// था। मतलब Ad Code/Settings में किया कोई भी बदलाव कभी तुरंत नहीं दिखता था -
// हमेशा 1 घंटे के पुराने Cache का इंतज़ार करना पड़ता था। अब चाहे Post हो या
// Website Settings या कोई और Document, Publish होते ही पूरी Site हमेशा
// तुरंत Refresh होगी।
import { revalidatePath } from 'next/cache'
import { parseBody } from 'next-sanity/webhook'
import { NextRequest, NextResponse } from 'next/server'
import { requestGoogleIndexing } from '@/lib/googleIndexing'
import { pingIndexNow } from '@/lib/indexNow'
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

    // 🆕 सबसे पहले, हमेशा पूरी Site Refresh कर दें (Header/Footer/Homepage/
    // हर Post - सब कुछ) - चाहे Document किसी भी तरह का हो। इससे Website
    // Settings (Ad Code) में किया कोई भी बदलाव भी अब तुरंत असर दिखाएगा।
    revalidatePath('/', 'layout')

    // अगर यह किसी Post का Webhook नहीं था (जैसे Website Settings), तो यहीं
    // रुक जाएँ - ऊपर वाला Refresh काफ़ी है, आगे की (Google Indexing, Push
    // Notification वाली) Logic सिर्फ़ असली Post Publish होने पर ही चलनी चाहिए
    if (!body?.slug || !body?.category) {
      return NextResponse.json({
        revalidated: true,
        scope: 'पूरी Site (Settings या अन्य बदलाव)',
        now: Date.now(),
      })
    }

    revalidatePath(`/${body.category}/${body.slug}`)
    revalidatePath(`/${body.category}`)
    revalidatePath('/')
    // 🐛 FIX: पहले यहाँ Sitemap कभी Refresh नहीं होता था - इसलिए Google को Sitemap
    // के ज़रिए नई Post का कभी पता ही नहीं चलता था (भले ही Indexing API अलग से
    // "Success" बता रही हो)। अब हर नई/अपडेट हुई Post पर Sitemap भी साथ में Refresh होगी।
    revalidatePath('/sitemap.xml')
    revalidatePath('/news-sitemap.xml')

    const postUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${body.category}/${body.slug}`

    // Google Indexing, IndexNow (Bing/Yandex) और Push Notification एक साथ (parallel) - तेज़ रिस्पॉन्स
    const [indexingResult, indexNowResult, pushResult] = await Promise.allSettled([
      requestGoogleIndexing(postUrl),
      pingIndexNow(postUrl),
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
      indexNow:
        indexNowResult.status === 'fulfilled'
          ? indexNowResult.value
          : { success: false, message: (indexNowResult.reason as Error)?.message },
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

