import { NextResponse } from 'next/server';

export async function GET() {
  const serviceWorkerContent = `
    importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
    importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

    firebase.initializeApp({
      apiKey: '${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}',
      authDomain: '${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}',
      projectId: '${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}',
      storageBucket: '${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}',
      messagingSenderId: '${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}',
      appId: '${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}',
      measurementId: '${process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}'
    });

    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body,
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        tag: 'notification',
        data: payload.data,
      };

      self.registration.showNotification(notificationTitle, notificationOptions);
    });

    self.addEventListener('notificationclick', (event) => {
      event.notification.close();
      
      const urlToOpen = new URL('/', self.location.origin).href;

      const promiseChain = clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      })
      .then((windowClients) => {
        let matchingClient = null;

        for (let i = 0; i < windowClients.length; i++) {
          const windowClient = windowClients[i];
          if (windowClient.url === urlToOpen) {
            matchingClient = windowClient;
            break;
          }
        }

        if (matchingClient) {
          return matchingClient.focus();
        } else {
          return clients.openWindow(urlToOpen);
        }
      });

      event.waitUntil(promiseChain);
    });
  `;

  return new NextResponse(serviceWorkerContent, {
    headers: {
      'Content-Type': 'application/javascript',
      'Service-Worker-Allowed': '/',
    },
  });
} 