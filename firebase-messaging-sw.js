importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

// Get Firebase config from the main thread (passed via postMessage or global scope)
// This will be set by the main application
let firebaseConfig;

// Listen for config from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'FIREBASE_CONFIG') {
    firebaseConfig = event.data.config;
    initializeFirebase();
  }
});

// Check if config is already available globally (set by main app)
if (self.firebaseConfig) {
  firebaseConfig = self.firebaseConfig;
  initializeFirebase();
}

function initializeFirebase() {
  if (!firebaseConfig) {
    console.error('Firebase config not available in service worker');
    return;
  }
  
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage(({ notification }) => {
    self.registration.showNotification(notification.title ?? "Notification", {
      body: notification.body,
      icon: 'https://wecoppy-prod-asset.s3.ap-southeast-1.amazonaws.com/20250908/1757306493033e8564d4735.webp',
      url: "https://Danchai.com",
    });
  });
}