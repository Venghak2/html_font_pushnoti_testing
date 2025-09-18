importScripts('https://www.gstatic.com/firebasejs/12.1.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.1.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDEknhMLtR7yGyjfjI3Reyn1WGvkL9K6aI",
  authDomain: "notification-91d47.firebaseapp.com",
  projectId: "notification-91d47",
  storageBucket: "notification-91d47.appspot.com",
  messagingSenderId: "931826122946",
  appId: "1:931826122946:web:7840927810f854470ebb5b",
  measurementId: "G-30JJFRDNSX"
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  if (payload.data) {
    const { title, body, icon } = payload.data;

    self.registration.showNotification(title || 'No title', {
        body: body || '',
        icon: icon || '',
        tag: Date().toString(), 
        renotify: false,
    });
  }
});


self.addEventListener("push", function(event) {
  if (event.data) {
    const payload = event.data.json();

    if (payload.data) {
      const { title, body, icon } = payload.data;
      console.log('Push event received:', body);

      event.waitUntil(
        self.registration.showNotification(title || 'No title', {
            body: body || '',
            icon: icon || '',
            tag: Date().toString(),
            renotify: false,
            requireInteraction: true,
        })
      );
    }
  }
});