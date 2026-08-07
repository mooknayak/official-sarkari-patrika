// ✏️ एडिट फ़ाइल — मौजूदा फाइल में बदलें: src/lib/firebaseClient.ts
// (अब पूरी Config Check होती है + Error कभी Silent crash नहीं होगी, Console में साफ़ बताएगी)
//
// यह Browser (User के Phone/Computer) में चलने वाला Firebase Config है -
// इसी से FCM Token लिया जाता है जब कोई "Allow" दबाता है, और Comments/Login भी
// इसी App से चलते हैं। यह जानकारी Public है (यही इरादा है - Firebase Web Config
// हमेशा Client-side Code में दिखता है, इसमें कोई गोपनीय Secret नहीं होता)।

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// सभी 6 values ज़रूरी हैं - एक भी खाली रही तो Firebase आधा-अधूरा शुरू होकर
// अजीब Errors दे सकता है, इसलिए यहीं पर रोक कर साफ़ बता दिया जाता है
const REQUIRED_KEYS: (keyof typeof firebaseConfig)[] = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
]

export function getFirebaseClientApp(): FirebaseApp | null {
  const missing = REQUIRED_KEYS.filter((key) => !firebaseConfig[key])

  if (missing.length > 0) {
    if (typeof window !== 'undefined') {
      console.error(
        `[Firebase] यह Environment Variables खाली/missing हैं - Vercel में डालें और Redeploy करें: ${missing
          .map((k) => `NEXT_PUBLIC_FIREBASE_${k.replace(/[A-Z]/g, (c) => '_' + c).toUpperCase()}`)
          .join(', ')}`
      )
    }
    return null
  }

  try {
    if (getApps().length > 0) return getApps()[0]
    return initializeApp(firebaseConfig)
  } catch (err) {
    console.error('[Firebase] initializeApp fail हुआ:', (err as Error).message)
    return null
  }
}

export { firebaseConfig }
