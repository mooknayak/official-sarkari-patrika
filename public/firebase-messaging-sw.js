// 🆕 नई फ़ाइल — इसे इसी पाथ पर बनाएं: public/firebase-messaging-sw.js
// (यह ज़रूरी है - Firebase Cloud Messaging इसी नाम की फ़ाइल को खोजता है)

importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: 'AIzaSyB1yGcD2RkCuMX-wxz07HScIUa7trTx_Gs',
  authDomain: 'official-sarkari-patrika.firebaseapp.com',
  projectId: 'official-sarkari-patrika',
  storageBucket: 'official-sarkari-patrika.firebasestorage.app',
  messagingSenderId: '661531699456',
  appId: '1:661531699456:web:48f3e89610b8f693a82be5',
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
