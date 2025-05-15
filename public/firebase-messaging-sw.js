importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyDFMpZJF-sZOmgwsby2QVHAFULM530BiBE',
  authDomain: 'diadoc-ca8c4.firebaseapp.com',
  projectId: 'diadoc-ca8c4',
  storageBucket: 'diadoc-ca8c4.appspot.com',
  messagingSenderId: '652619758422',
  appId: '1:652619758422:web:1daf4d9783cdb63acfb4f7',
  measurementId: 'G-5GTJDR71ET'
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    tag: payload.data?.tag || 'notification',
    data: payload.data || {},
    actions: payload.data?.actions ? JSON.parse(payload.data.actions) : [],
    requireInteraction: true,
    silent: false
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Get the action (if any)
  const action = event.action;
  const notification = event.notification;
  const data = notification.data;

  // Default URL is root
  let urlToOpen = new URL('/', self.location.origin).href;

  // If there's a specific URL in the data, use that
  if (data.url) {
    urlToOpen = data.url;
  }

  // Handle specific actions
  if (action) {
    switch (action) {
      case 'check_glucose':
        urlToOpen = new URL('/dashboard/log-glucose', self.location.origin).href;
        break;
      case 'view_insights':
        urlToOpen = new URL('/dashboard/insights', self.location.origin).href;
        break;
      // Add more actions as needed
    }
  }

  const promiseChain = clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  })
  .then((windowClients) => {
    // Check if there's already a window/tab open with the target URL
    let matchingClient = null;

    for (let i = 0; i < windowClients.length; i++) {
      const windowClient = windowClients[i];
      if (windowClient.url === urlToOpen) {
        matchingClient = windowClient;
        break;
      }
    }

    // If we found a matching client, focus it; otherwise, open new
    if (matchingClient) {
      return matchingClient.focus();
    } else {
      return clients.openWindow(urlToOpen);
    }
  });

  event.waitUntil(promiseChain);
}); 