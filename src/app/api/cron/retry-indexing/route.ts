// 🆕 नई फ़ाइल — इसे इसी पाथ पर बनाएं: src/app/api/cron/retry-indexing/route.ts
//
// यह हर 30 मिनट में अपने-आप चलता है (vercel.json में Schedule सेट है) -
// यह उन Post URLs को दोबारा Google को भेजने की कोशिश करता है जो पहले किसी वजह से
// Fail हो गए थे। 3 दिन (या 10 कोशिशों) के बाद भी अगर Success न हो, तो उसे Queue से
// हटा दिया जाता है (तब भी वह पोस्ट sitemap.xml के ज़रिए Google को मिल ही जाएगी)।

import { NextRequest, NextResponse } from 'next/server'
import { getFirestoreAdmin } from '@/lib/firebaseAdmin'
import { requestGoogleIndexing } from '@/lib/googleIndexing'

const MAX_ATTEMPTS = 10

export async function GET(req: NextRequest) {
  // ⚠️ सुरक्षा: सिर्फ़ Vercel Cron (या सही Secret वाला Request) ही इसे चला सके
  const authHeader = req.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const db = getFirestoreAdmin()
  if (!db) {
    return NextResponse.json({ message: 'Firebase सेट नहीं है, कुछ करने को नहीं' })
  }

  const snapshot = await db.collection('indexingRetryQueue').limit(50).get()

  if (snapshot.empty) {
    return NextResponse.json({ message: 'Queue खाली है - सब पहले से index हो चुका है 🎉' })
  }

  const results: { url: string; outcome: string }[] = []

  for (const doc of snapshot.docs) {
    const data = doc.data()
    const attempts = (data.attempts || 0) + 1

    const result = await requestGoogleIndexing(data.url)

    if (result.success) {
      await doc.ref.delete()
      results.push({ url: data.url, outcome: 'success - Queue से हटाया गया' })
    } else if (attempts >= MAX_ATTEMPTS) {
      // बहुत बार कोशिश हो चुकी - अब sitemap.xml के भरोसे छोड़ते हैं (वह हमेशा काम करता है)
      await doc.ref.delete()
      results.push({ url: data.url, outcome: `${MAX_ATTEMPTS} कोशिशों के बाद भी असफल - sitemap के भरोसे छोड़ा` })
    } else {
      await doc.ref.update({ attempts, lastTriedAt: new Date().toISOString() })
      results.push({ url: data.url, outcome: `असफल (कोशिश ${attempts}/${MAX_ATTEMPTS}) - फिर कोशिश होगी` })
    }
  }

  return NextResponse.json({ processed: results.length, results })
}
