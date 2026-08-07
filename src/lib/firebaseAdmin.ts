// 🆕 नई फ़ाइल — इसे इसी पाथ पर बनाएं: src/lib/firebaseAdmin.ts
//
// यह सर्वर-साइड (Vercel Function के अंदर) चलने वाला Firebase Admin है -
// इसी से हम सभी Subscribers को Push Notification भेजते हैं (FCM)।
// Frontend/Browser वाला Firebase अलग फ़ाइल में है: src/lib/firebaseClient.ts

import { initializeApp, getApps, cert, type App } from 'firebase-admin/app'
import { getMessaging } from 'firebase-admin/messaging'
import { getFirestore } from 'firebase-admin/firestore'

function getFirebaseAdminApp(): App | null {
  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (!projectId || !clientEmail || !privateKey) {
    return null
  }

  if (getApps().length > 0) {
    return getApps()[0]
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  })
}

export function getFirebaseMessaging() {
  const app = getFirebaseAdminApp()
  if (!app) return null
  return getMessaging(app)
}

export function getFirestoreAdmin() {
  const app = getFirebaseAdminApp()
  if (!app) return null
  return getFirestore(app)
}
