// ✏️ एडिट फ़ाइल — मौजूदा फाइल में बदलें: src/app/api/cron/retry-indexing/route.ts
//
// यह अपने-आप चलता है (vercel.json में Schedule सेट है) - यह उन Post URLs को
// दोबारा Google को भेजने की कोशिश करता है जो पहले किसी वजह से Fail हो गए थे
// (अब Queue Firebase नहीं, Sanity - "indexingQueueItem" में रहती है)। 10 कोशिशों
// के बाद भी अगर Success न हो, तो उसे Queue से हटा दिया जाता है (तब भी वह पोस्ट
// sitemap.xml के ज़रिए Google को मिल ही जाएगी)।

import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/writeClient'
import { requestGoogleIndexing } from '@/lib/googleIndexing'

const MAX_ATTEMPTS = 10

export async function GET(req: NextRequest) {
  // ⚠️ सुरक्षा: सिर्फ़ Vercel Cron (या सही Secret वाला Request) ही इसे चला सके
  const authHeader = req.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const items: { _id: string; url: string; attempts: number }[] = await writeClient.fetch(
    `*[_type == "indexingQueueItem"] | order(createdAt asc) [0...50]{ _id, url, attempts }`
  )

  if (items.length === 0) {
    return NextResponse.json({ message: 'Queue खाली है - सब पहले से index हो चुका है 🎉' })
  }

  const results: { url: string; outcome: string }[] = []

  for (const item of items) {
    const attempts = (item.attempts || 0) + 1
    const result = await requestGoogleIndexing(item.url)

    if (result.success) {
      await writeClient.delete(item._id)
      results.push({ url: item.url, outcome: 'success - Queue से हटाया गया' })
    } else if (attempts >= MAX_ATTEMPTS) {
      // बहुत बार कोशिश हो चुकी - अब sitemap.xml के भरोसे छोड़ते हैं (वह हमेशा काम करता है)
      await writeClient.delete(item._id)
      results.push({
        url: item.url,
        outcome: `${MAX_ATTEMPTS} कोशिशों के बाद भी असफल - sitemap के भरोसे छोड़ा`,
      })
    } else {
      await writeClient
        .patch(item._id)
        .set({ attempts, lastTriedAt: new Date().toISOString() })
        .commit()
      results.push({ url: item.url, outcome: `असफल (कोशिश ${attempts}/${MAX_ATTEMPTS}) - फिर कोशिश होगी` })
    }
  }

  return NextResponse.json({ processed: results.length, results })
}
