// 🆕 नई फ़ाइल — इसे इसी पाथ पर बनाएं: src/lib/firebaseClient.ts
//
// यह Browser (User के Phone/Computer) में चलने वाला Firebase Config है -
// इसी से FCM Token लिया जाता है जब कोई "Allow" दबाता है।
// यह जानकारी Public है (यही इरादा है - Firebase Web Config हमेशा
// Client-side Code में दिखता है, इसमें कोई गोपनीय Secret नहीं होता)।

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

export function getFirebaseClientApp(): FirebaseApp | null {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) return null
  if (getApps().length > 0) return getApps()[0]
  return initializeApp(firebaseConfig)
}

export { firebaseConfig }
