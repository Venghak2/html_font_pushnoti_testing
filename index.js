// Using Firebase compat version loaded via CDN

// Default configuration
const DEFAULT_CONFIG = {
  firebaseConfig: {
    apiKey: "AIzaSyDEknhMLtR7yGyjfjI3Reyn1WGvkL9K6aI",
    authDomain: "notification-91d47.firebaseapp.com",
    projectId: "notification-91d47",
    storageBucket: "notification-91d47.appspot.com",
    messagingSenderId: "931826122946",
    appId: "1:931826122946:web:7840927810f854470ebb5b",
    measurementId: "G-30JJFRDNSX"
  },
  vapidKey: "BNdpNyxjim_8r4LfhR08n9bEOrr5dcw5iOcomnqufFoXV6sK0x4qxDmaEv1Fh3Tta4czYsSvMR9UQMZqS7KKxUo",
  apiBase: "https://your-production-api.com/user/subscribe", // TODO: Replace with your actual production API URL
  serviceWorkerPath: "firebase-messaging-sw.js"
};

let app, auth, messaging;

function initializeFirebase(config) {
  // Check if Firebase is already initialized
  if (window.firebase && window.firebase.apps && window.firebase.apps.length > 0) {
    console.warn('[JaosuaSDK] Firebase already initialized, using existing app');
    app = window.firebase.apps[0];
  } else {
    app = window.firebase.initializeApp(config.firebaseConfig);
  }
  
  auth = window.firebase.auth(app);
  messaging = window.firebase.messaging(app);
  
  // Set up message listener
  messaging.onMessage(payload => {
    console.log("[JaosuaSDK] Foreground message:", payload);
  });
}

async function authentication(userConfig = {}) {
  try {
    if (!app || !auth || !messaging) {
      throw new Error('Firebase not initialized. Call JaosuaSDK.init() first.');
    }

    await auth.signInAnonymously();

    const serviceWorkerPath = userConfig.serviceWorkerPath || DEFAULT_CONFIG.serviceWorkerPath;
    const registration = await navigator.serviceWorker.register(serviceWorkerPath);

    const vapidKey = userConfig.vapidKey || DEFAULT_CONFIG.vapidKey;
    const token = await messaging.getToken({
      vapidKey: vapidKey,
      serviceWorkerRegistration: registration
    });

    if (!token) {
      throw new Error("Notification permission denied or no token retrieved.");
    }
    
    console.log(`[JaosuaSDK] Token: ${token}`);

    const apiBase = userConfig.apiBase || DEFAULT_CONFIG.apiBase;
    const res = await fetch(`${apiBase}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        token, 
        userUid: userConfig.userUid || 123 
      })
    });

    if (!res.ok) {
      const { message } = await res.json().catch(() => ({}));
      throw new Error(message || `Request failed (${res.status})`);
    }

    console.log("[JaosuaSDK] Device subscribed successfully!");
    return { success: true, token };
  } catch (err) {
    console.error("[JaosuaSDK] Error:", err.message);
    throw err;
  }
}

function init(userConfig = {}) {
  try {
    // Merge user config with defaults
    const config = { ...DEFAULT_CONFIG, ...userConfig };
    
    // Initialize Firebase
    initializeFirebase(config);
    
    // Set up button listener if selector provided
    if (userConfig.buttonSelector && typeof userConfig.buttonSelector === 'string') {
      const btn = document.querySelector(userConfig.buttonSelector);
      if (btn) {
        btn.addEventListener("click", () => authentication(config));
      } else {
        console.warn(`[JaosuaSDK] Button with selector "${userConfig.buttonSelector}" not found`);
      }
    } else if (userConfig.buttonSelector) {
      console.warn('[JaosuaSDK] buttonSelector must be a string, got:', typeof userConfig.buttonSelector);
    }
    
    console.log("[JaosuaSDK] Initialized successfully");
    return { success: true };
  } catch (err) {
    console.error("[JaosuaSDK] Initialization failed:", err.message);
    throw err;
  }
}

// Export as SDK for Webpack UMD
export { init, authentication };
