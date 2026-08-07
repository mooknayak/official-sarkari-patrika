// ✏️ एडिट फ़ाइल — मौजूदा फाइल में बदलें: src/lib/pushNotification.ts
// (पहले web-push library इस्तेमाल होती थी, अब Firebase Cloud Messaging - ज़्यादा भरोसेमंद)

import { getFirebaseMessaging } from '@/lib/firebaseAdmin'
import { writeClient } from '@/sanity/lib/writeClient'

export async function sendPushToAllSubscribers(title: string, url: string) {
  const messaging = getFirebaseMessaging()
  if (!messaging) {
    return { success: false, message: 'Push Notification अभी सेट नहीं है (Firebase env variables खाली हैं)' }
  }

  const subscribers: { _id: string; fcmToken: string }[] = await writeClient.fetch(
    `*[_type == "pushSubscriber"]{ _id, fcmToken }`
  )

  if (subscribers.length === 0) {
    return { success: true, message: 'कोई subscriber नहीं है अभी' }
  }

  const tokens = subscribers.map((s) => s.fcmToken).filter(Boolean)

  const response = await messaging.sendEachForMulticast({
    tokens,
    notification: {
      title,
      body: 'नई जानकारी के लिए टैप करें',
    },
    webpush: {
      fcmOptions: { link: url },
      notification: { icon: '/icon.svg' },
    },
  })

  // जो Token अब मान्य नहीं है (App Uninstall / Browser Data Clear), उसे Sanity से हटा देना
  const toDelete: string[] = []
  response.responses.forEach((res, idx) => {
    if (!res.success) {
      const code = res.error?.code || ''
      if (code.includes('registration-token-not-registered') || code.includes('invalid-argument')) {
        toDelete.push(subscribers[idx]._id)
      }
    }
  })

  if (toDelete.length > 0) {
    await Promise.allSettled(toDelete.map((id) => writeClient.delete(id)))
  }

  return {
    success: true,
    message: `${response.successCount}/${tokens.length} को notification भेजी गई`,
  }
}
