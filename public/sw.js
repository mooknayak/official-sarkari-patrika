// 🆕 यह Firebase वाली firebase-messaging-sw.js की जगह लेता है — अब यह Standard
// Web Push (हर ब्राउज़र में built-in, कोई भी बाहरी Service ज़रूरी नहीं) इस्तेमाल
// करता है।

self.addEventListener('push', function (event) {
  let data = {}
  try {
    data = event.data ? event.data.json() : {}
  } catch (e) {
    data = { title: 'Official Sarkari Patrika', body: 'नई जानकारी उपलब्ध है' }
  }

  const title = data.title || 'Official Sarkari Patrika'
  const options = {
    body: data.body || 'नई जानकारी उपलब्ध है',
    icon: '/icon.svg',
    badge: '/icon.svg',
    data: { url: data.url || '/' },
  }

  event.waitUntil(self.registration.showNotification(title, options))
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
