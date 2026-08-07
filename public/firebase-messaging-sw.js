// 🆕 नई फ़ाइल — इसे इसी पाथ पर बनाएं: public/firebase-messaging-sw.js
// (यह ज़रूरी है - Firebase Cloud Messaging इसी नाम की फ़ाइल को खोजता है)
//
// ⚠️ ज़रूरी: नीचे firebaseConfig में वही 6 values भरनी हैं जो
// Website Settings/.env में NEXT_PUBLIC_FIREBASE_* में डाली थीं
// (Firebase Console → Project Settings → General → Your Apps → Web App से मिलती हैं)
// Service Worker फ़ाइल में process.env काम नहीं करता, इसलिए यह values यहाँ
// सीधे लिखनी पड़ती हैं - कोई गोपनीय बात नहीं, यह Public Config ही है।

importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: 'YAHAN_NEXT_PUBLIC_FIREBASE_API_KEY_PASTE_KAREN',
  authDomain: 'YAHAN_NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN_PASTE_KAREN',
  projectId: 'YAHAN_NEXT_PUBLIC_FIREBASE_PROJECT_ID_PASTE_KAREN',
  storageBucket: 'YAHAN_NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET_PASTE_KAREN',
  messagingSenderId: 'YAHAN_NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID_PASTE_KAREN',
  appId: 'YAHAN_NEXT_PUBLIC_FIREBASE_APP_ID_PASTE_KAREN',
})

const messaging = firebase.messaging()

// जब Website बंद हो या Background में हो, तब भी Notification दिखाने के लिए
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'Official Sarkari Patrika'
  const options = {
    body: payload.notification?.body || 'नई जानकारी उपलब्ध है',
    icon: '/icon.svg',
    badge: '/icon.svg',
    data: { url: payload.fcmOptions?.link || payload.data?.url || '/' },
  }
  self.registration.showNotification(title, options)
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close()
  const url = event.notification.data?.url || '/'
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    })
  )
})
