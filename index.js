
import { initializeApp } from "firebase/app";
import { getMessaging, getToken,onMessage } from "firebase/messaging";
import { firebaseConfig, VAPID_KEY } from "./firebase-config.js";

const API_BASE   = "http://localhost:7000/api/subscribe";  
const USERUID    = "01989849-eafd-7a31-8e3f-0ddaa7d07330";

const app       = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

onMessage(messaging, payload => {console.log("[FCM] foreground message:", payload);});

async function getServiceWorkerRegistration() {
    if (!("serviceWorker" in navigator)) {
        throw new Error("Service Workers are not supported in this browser");
    }

    if (!self.isSecureContext) {
        throw new Error("Site must be served over HTTPS or localhost for Push/SW");
    }

    let registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
        try {
            registration = await navigator.serviceWorker.register("./firebase-messaging-sw.js");
        } catch (err) {
            registration = await navigator.serviceWorker.register("./dist/firebase-messaging-sw.js");
        }
    }

    await navigator.serviceWorker.ready;
    return registration;
}

async function authentication() {
    try {
        if (typeof Notification !== "undefined" && Notification.permission !== "granted") {
            const permission = await Notification.requestPermission();
            if (permission !== "granted") {
                throw new Error("Notification permission was not granted");
            }
        }
        const registration = await getServiceWorkerRegistration();
        const token = await getToken(messaging, {
            vapidKey: VAPID_KEY,
            serviceWorkerRegistration: registration,
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
            body   : JSON.stringify({ token, uuid: USERUID })
        });
        if (!res.ok) {
            const { message } = await res.json().catch(() => ({}));
            throw new Error(message || `Request failed (${res.status})`);
        }

        const result = await res.json();
        alert(result.message);
    } catch (err) {
        alert("Error while subscribing: " + err.message);
    }
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".install-button");
  if (btn) btn.addEventListener("click", authentication);
});
