// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyC5qI-YCwJK9Xj5Fci7vIArFMetj1ZP2_w",
  authDomain: "ceritaberdua-9f71d.firebaseapp.com",
  projectId: "ceritaberdua-9f71d",
  storageBucket: "ceritaberdua-9f71d.firebasestorage.app",
  messagingSenderId: "1044481677281",
  appId: "1:1044481677281:web:9f420eb6da603e99fa24a0",
  measurementId: "G-NR86918PVB"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Menangani notifikasi background saat browser ditutup / di latar belakang
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background Push diterima:', payload);

  const title = payload.notification?.title || payload.data?.title || 'CoupleSync';
  const options = {
    body: payload.notification?.body || payload.data?.body || 'Ada pesan baru dari pasangan',
    icon: 'https://cdn-icons-png.flaticon.com/512/1077/1077035.png',
    badge: 'https://cdn-icons-png.flaticon.com/512/1077/1077035.png',
    data: {
      url: payload.data?.url || self.location.origin
    }
  };

  self.registration.showNotification(title, options);
});

// Aksi klik notifikasi
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data?.url || '/');
      }
    })
  );
});
