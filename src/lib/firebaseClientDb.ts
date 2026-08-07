// 🆕 नई फ़ाइल — इसे इसी पाथ पर बनाएं: src/lib/firebaseClientDb.ts
//
// Browser में Firestore (Real-time Comments के लिए) और Firebase Auth
// (Admin Login के लिए) शुरू करने की जगह - दोनों एक ही Firebase App इस्तेमाल
// करते हैं जो firebaseClient.ts में पहले से बना है (Push Notification के लिए)

import { getFirestore, type Firestore } from 'firebase/firestore'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirebaseClientApp } from '@/lib/firebaseClient'

export function getFirestoreDb(): Firestore | null {
  const app = getFirebaseClientApp()
  if (!app) return null
  return getFirestore(app)
}

export function getFirebaseAuth(): Auth | null {
  const app = getFirebaseClientApp()
  if (!app) return null
  return getAuth(app)
}
