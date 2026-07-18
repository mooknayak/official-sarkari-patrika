import webpush from 'web-push'
import { writeClient } from '@/sanity/lib/writeClient'

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY

export async function sendPushToAllSubscribers(title: string, url: string) {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    return { success: false, message: 'Push Notification अभी सेट नहीं है (VAPID keys खाली हैं)' }
  }

  webpush.setVapidDetails(
    'mailto:officialsarkaripatrika@gmail.com',
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  )

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

  const results = await Promise.allSettled(
    subscribers.map((sub) =>
      webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        },
        payload
      )
    )
  )

  // जो subscription अब काम नहीं कर रही (expired/uninstalled), उन्हें Sanity से हटाना
  const toDelete: string[] = []
  results.forEach((result, idx) => {
    if (result.status === 'rejected') {
      const statusCode = (result.reason as any)?.statusCode
      if (statusCode === 404 || statusCode === 410) {
        toDelete.push(subscribers[idx]._id)
      }
    }
  })

  if (toDelete.length > 0) {
    await Promise.allSettled(toDelete.map((id) => writeClient.delete(id)))
  }

  const successCount = results.filter((r) => r.status === 'fulfilled').length
  return {
    success: true,
    message: `${successCount}/${subscribers.length} को notification भेजी गई`,
  }
}
