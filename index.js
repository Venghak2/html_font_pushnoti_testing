
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getMessaging,
  getToken,
  onMessage,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js";
import { firebaseConfig, VAPID_KEY } from "./firebase-config.js";

const API_BASE   = "https://api.dev.1xnoti.onesiamsoft.com/api/docsapi/subscribe";  

const app       = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

onMessage(messaging, payload => {
  console.log("[FCM] foreground message:", payload);
});

async function authentication() {
    try {
        const token = await getToken(messaging, {
            vapidKey: VAPID_KEY,
        });

        if (!token) {
            alert("Notification permission denied or no token retrieved.");
            return;
        }
        console.log(token);
        const res = await fetch(`${API_BASE}`, {
            method : "POST",
            headers: {
                "Content-Type" : "application/json",
            },
            body   : JSON.stringify({ token })
        });

        if (!res.ok) {
            const { message } = await res.json().catch(() => ({}));
            throw new Error(message || `Request failed (${res.status})`);
        }

        alert("Device subscribed successfully!");
    } catch (err) {
        alert("Error while subscribing: " + err.message);
    }
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".install-button");
  if (btn) btn.addEventListener("click", authentication);
});
