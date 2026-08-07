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
  // Vercel के Environment Variable बॉक्स में \n असली नई-लाइन नहीं बन पाती,
  // इसलिए इसे टेक्स्ट के तौर पर \\n डालना होता है - यहाँ उसे वापस असली नई-लाइन में बदला जा रहा है
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

// 🗂️ Firestore - इसे 2 काम के लिए इस्तेमाल कर रहे हैं:
// 1) Indexing Retry Queue (अगर Google Indexing API fail हो जाए तो यहाँ लॉग होता है)
// 2) Real-time Comments (यह डेटा Sanity में नहीं, Firebase में रखा गया है, ताकि
//    Sanity सिर्फ "पोस्ट कंटेंट" के लिए साफ़-सुथरा रहे)
export function getFirestoreAdmin() {
  const app = getFirebaseAdminApp()
  if (!app) return null
  return getFirestore(app)
}
