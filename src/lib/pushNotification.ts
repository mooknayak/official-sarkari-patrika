// ✏️ एडिट फ़ाइल — अब यह Firebase Cloud Messaging नहीं, बल्कि Standard Web Push
// ('web-push' library, VAPID keys के साथ) इस्तेमाल करता है। Subscribers की लिस्ट
// Sanity से आती है (Firestore की ज़रूरत नहीं)।

import webpush from 'web-push'
import { writeClient } from '@/sanity/lib/writeClient'

function isConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY &&
      process.env.VAPID_PRIVATE_KEY &&
      process.env.VAPID_SUBJECT
  )
}

function setupWebPush() {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT as string,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string,
    process.env.VAPID_PRIVATE_KEY as string
  )
}

export async function sendPushToAllSubscribers(title: string, url: string) {
  if (!isConfigured()) {
    return {
      success: false,
      message: 'Push Notification अभी सेट नहीं है (VAPID env variables खाली हैं)',
    }
  }

  setupWebPush()

  const subscribers: { _id: string; endpoint: string; p256dh: string; auth: string }[] =
    await writeClient.fetch(`*[_type == "pushSubscriber"]{ _id, endpoint, p256dh, auth }`)

  if (subscribers.length === 0) {
    return { success: true, message: 'कोई subscriber नहीं है अभी' }
  }

  const payload = JSON.stringify({
    title,
    body: 'नई जानकारी के लिए टैप करें',
    url,
  })

  let successCount = 0
  const toDelete: string[] = []

  await Promise.allSettled(
    subscribers.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          payload
        )
        successCount++
      } catch (err: any) {
        // 404/410 का मतलब है यह Subscription अब मान्य नहीं है (Browser Data Clear / Uninstall)
        if (err?.statusCode === 404 || err?.statusCode === 410) {
          toDelete.push(sub._id)
        }
      }
    })
  )

  if (toDelete.length > 0) {
    await Promise.allSettled(toDelete.map((id) => writeClient.delete(id)))
  }

  return {
    success: true,
    message: `${successCount}/${subscribers.length} को notification भेजी गई`,
  }
}
