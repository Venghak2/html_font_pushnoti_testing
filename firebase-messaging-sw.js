importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

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

messaging.onBackgroundMessage(({ notification }) => {
  self.registration.showNotification(notification.title ?? "Notification", {
    body : notification.body,
    icon : "/icon-192.png"
  });
});
