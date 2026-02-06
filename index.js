import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

// ---------------- Config ----------------
const API_BASE = "https://api.1xnoti.onesiamsoft.com/";
const API_SUBSCRIBE = API_BASE + "api/" + "subscribe";
const API_UNSUBSCRIBE = API_BASE + "api/" + "unsubscribe";

const SECRET_KEY = window.JAOSUA_CONFIG?.secretKey;
const PLAYERID = window.JAOSUA_CONFIG?.playerId;
const USERNAME = window.JAOSUA_CONFIG?.username;
const LOGO_URL = window.JAOSUA_CONFIG?.logoUrl;

const firebaseConfig = {
  apiKey: "AIzaSyDEknhMLtR7yGyjfjI3Reyn1WGvkL9K6aI",
  authDomain: "notification-91d47.firebaseapp.com",
  projectId: "notification-91d47",
  storageBucket: "notification-91d47.appspot.com",
  messagingSenderId: "931826122946",
  appId: "1:931826122946:web:7840927810f854470ebb5b",
  measurementId: "G-30JJFRDNSX",
};

const VAPID_KEY =
  "BNdpNyxjim_8r4LfhR08n9bEOrr5dcw5iOcomnqufFoXV6sK0x4qxDmaEv1Fh3Tta4czYsSvMR9UQMZqS7KKxUo";

// Make firebaseConfig available globally for service worker
if (typeof self !== "undefined") self.firebaseConfig = firebaseConfig;

// ---------------- Firebase Init ----------------
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// ---------------- Pass config to SW ----------------
const passConfigToServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.ready;
    if (registration.active) {
      registration.active.postMessage({
        type: "FIREBASE_CONFIG",
        config: firebaseConfig,
      });
    }
  }
};

// ---------------- CSS Injection ----------------
function injectCSS() {
  if (document.getElementById("jaosua-styles")) return;
  const style = document.createElement("style");
  style.id = "jaosua-styles";
  style.textContent = `
    .jaosua-widget { margin: 0; padding: 0; font-family: 'Poppins', sans-serif; }
    .jaosua-pwa-install-prompt { background: linear-gradient(135deg, rgba(0,0,0,.98), rgba(10,10,10,.98)); }
    .jaosua-prompt-content { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 16px 20px; max-width: 100%; }
    .jaosua-prompt-logo { width: 48px; height: 48px; object-fit: contain; border-radius: 12px; border: 1px solid hsla(0,0%,100%,.2); background: rgba(255,255,255,.1); box-shadow: 0 2px 8px rgba(0,0,0,.3);}
    .jaosua-prompt-logo-section { display: flex; gap: 12px; align-items: center; flex: 1; min-width: 0; }
    .jaosua-prompt-text { color: #fff; flex: 1; min-width: 0; }
    .jaosua-prompt-title { font-size: 16px; font-weight: 600; margin: 0 0 4px; }
    .jaosua-prompt-subtitle { font-size: 14px; font-weight: 400; margin: 0; color: rgba(255,255,255,.8); }
    .jaosua-prompt-actions { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
    .jaosua-dismiss-button { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 1px solid hsla(0,0%,100%,.2); background: rgba(255,255,255,.1); color: rgba(255,255,255,.8); transition: all .2s ease; }
    .jaosua-subscribe { padding: 10px 20px; border-radius: 24px; font-size: 14px; font-weight: 600; cursor: pointer; border: none; position: relative; overflow: hidden; transition: all .3s cubic-bezier(.25,.8,.25,1); }
    .subscribe-btn { background: linear-gradient(135deg,#83f,#a855f7); color: #fff; box-shadow: 0 4px 12px rgba(136,51,255,.3); }
    .subscribe-btn::before { content: ''; position: absolute; top: 0; left: -75%; width: 50%; height: 100%; background: rgba(255,255,255,.2); transform: skewX(-20deg); filter: blur(8px); transition: left .6s ease; }
    .subscribe-btn:hover::before { left: 125%; }
    .subscribe-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(136,51,255,.5); }
    .unsubscribe-btn { background: linear-gradient(#ADADAD); color: #fff; box-shadow: 0 4px 12px rgba(0,0,0,.2); }
    .jaosua-marquee { height: 25px; overflow: hidden; position: relative; color: #535857; }
    .jaosua-marquee div { width: 200%; position: absolute; animation: jaosua-marquee 10s linear infinite; }
    .jaosua-marquee span { float: left; width: 50%; }
    @keyframes jaosua-marquee { 0%{left:0} 100%{left:-100%} }
    .jaosua-marquee:hover div { animation-play-state: paused; }
    .jaosua-notification-alert { position: fixed; top: 16px; right: 16px; z-index: 99999; max-width: 360px; padding: 14px 18px; background: linear-gradient(135deg, rgba(180,40,40,.98), rgba(120,20,20,.98)); color: #fff; font-size: 14px; line-height: 1.4; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,.35); display: flex; align-items: flex-start; gap: 12px; animation: jaosua-notification-in .3s ease; font-family: 'Poppins', sans-serif; }
    .jaosua-notification-alert.is-out { animation: jaosua-notification-out .25s ease forwards; }
    .jaosua-notification-alert-icon { flex-shrink: 0; margin-top: 1px; }
    .jaosua-notification-alert-text { flex: 1; }
    .jaosua-notification-alert-close { flex-shrink: 0; width: 28px; height: 28px; border: none; border-radius: 50%; background: rgba(255,255,255,.2); color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0; transition: background .2s; }
    .jaosua-notification-alert-close:hover { background: rgba(255,255,255,.35); }
    @keyframes jaosua-notification-in { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes jaosua-notification-out { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(24px); } }
  `;
  document.head.appendChild(style);
}

// ---------------- Notification alert (toast) ----------------
const NOTIFICATION_AUTO_CLOSE_MS = 5000;

function showNotificationAlert(message) {
  const existing = document.querySelector(".jaosua-notification-alert");
  if (existing) existing.remove();

  const el = document.createElement("div");
  el.className = "jaosua-notification-alert";
  el.setAttribute("role", "alert");
  el.innerHTML = `
    <span class="jaosua-notification-alert-icon" aria-hidden="true">🚫</span>
    <span class="jaosua-notification-alert-text">${escapeHtml(message)}</span>
    <button type="button" class="jaosua-notification-alert-close" aria-label="Close">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  `;

  const close = () => {
    el.classList.add("is-out");
    setTimeout(() => el.remove(), 260);
  };

  el.querySelector(".jaosua-notification-alert-close").addEventListener("click", close);
  const timer = setTimeout(close, NOTIFICATION_AUTO_CLOSE_MS);
  el.addEventListener("mouseenter", () => clearTimeout(timer));

  document.body.appendChild(el);
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ---------------- HTML Injection ----------------
function injectHTML() {
  if (document.getElementById("jaosua-widget")) return;
  const widgetHTML = `
    <div id="jaosua-widget" class="jaosua-widget">
      <div class="jaosua-pwa-install-prompt">
        <div class="jaosua-prompt-content">
          <div class="jaosua-prompt-logo-section">
            <img src="${LOGO_URL}" class="jaosua-prompt-logo" alt="JAOSUA123">
            <div class="jaosua-prompt-text">
              <p class="jaosua-prompt-title">JAOSUA123</p>
              <p class="jaosua-prompt-subtitle">Download the application</p>
            </div>
          </div>
          <div class="jaosua-prompt-actions">
            <button class="jaosua-dismiss-button" aria-label="turn off">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <button class="jaosua-subscribe subscribe-btn">Subscribe</button>
          </div>
        </div>
      </div>
      <div class="jaosua-marquee">
        <div>
          <span>Jaosua123 ยินดีให้บริการค่ะ กาก-ถอน โอนไว แอดมินบริการ24ชม. ถอนไม่อั้นทุกยอดกาก</span>
          <span>Jaosua123 ยินดีให้บริการค่ะ กาก-ถอน โอนไว แอดมินบริการ24ชม. ถอนไม่อั้นทุกยอดกาก</span>
        </div>
      </div>
    </div>
  `;
  const target = document.querySelector(
    window.JAOSUA_CONFIG?.container || "body",
  );
  if (target) target.insertAdjacentHTML("afterbegin", widgetHTML);
}

// ---------------- Helpers ----------------
async function getServiceWorkerRegistration() {
  if (!("serviceWorker" in navigator))
    throw new Error("Service Workers not supported");
  if (!self.isSecureContext)
    throw new Error("Site must use HTTPS or localhost");

  let registration = await navigator.serviceWorker.getRegistration();
  if (!registration)
    registration = await navigator.serviceWorker.register("./sw.js");
  await passConfigToServiceWorker();
  await navigator.serviceWorker.ready;
  return registration;
}

async function requestNotificationPermission() {
  if (typeof Notification === "undefined")
    throw new Error("Notifications not supported");
  if (Notification.permission === "denied")
    throw new Error("Notification permission denied");
  if (Notification.permission !== "granted") {
    const permission = await Notification.requestPermission();
    if (permission !== "granted")
      throw new Error("Notification permission not granted");
  }
}

function updateButtonState(isSubscribed) {
  const btn = document.querySelector(".jaosua-subscribe");
  if (!btn) return;

  if (isSubscribed) {
    btn.textContent = "Unsubscribe";
    btn.dataset.subscribed = "true";
    btn.classList.remove("subscribe-btn");
    btn.classList.add("unsubscribe-btn");
  } else {
    btn.textContent = "Subscribe";
    btn.dataset.subscribed = "false";
    btn.classList.remove("unsubscribe-btn");
    btn.classList.add("subscribe-btn");
  }
}

// ---------------- Debounce Helper ----------------
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    if (timer) return; // ignore repeated clicks within delay
    timer = setTimeout(() => {
      timer = null;
    }, delay);
    return fn.apply(this, args);
  };
}

// ---------------- Toggle Subscription ----------------
async function toggleSubscription() {
  try {
    const btn = document.querySelector(".jaosua-subscribe");
    if (!btn) return;

    const isSubscribed = btn.dataset.subscribed === "true";
    const url = isSubscribed ? API_UNSUBSCRIBE : API_SUBSCRIBE;

    await requestNotificationPermission();
    const registration = await getServiceWorkerRegistration();
    const generateToken = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });
    const stringPlayerId = PLAYERID.toString();
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Secret-Key": SECRET_KEY,
      },
      body: JSON.stringify({
        tokenDevice: generateToken,
        key: SECRET_KEY,
        playerId: stringPlayerId,
        username: USERNAME,
      }),
    });

    if (!res.ok) {
      const { message } = await res.json().catch(() => ({}));
      throw new Error(message || `Request failed (${res.status})`);
    }

    updateButtonState(!isSubscribed);
  } catch (err) {
    showNotificationAlert("Error while updating subscription: " + err.message);
  }
}

// ---------------- Check Subscription ----------------
async function checkSubscriptionStatus() {
  try {
    const stringPlayerId = PLAYERID.toString();
    const res = await fetch(
      `${API_SUBSCRIBE}/check?key=${SECRET_KEY}&playerid=${stringPlayerId}`,
    );
    const { subscribed } = await res.json();
    updateButtonState(subscribed);
  } catch (err) {
    console.warn("Subscription check failed:", err.message);
  }
}

// ---------------- Event Setup ----------------
function setupEventListeners() {
  const subBtn = document.querySelector(".jaosua-subscribe");
  const dismissBtn = document.querySelector(".jaosua-dismiss-button");

  if (subBtn)
    subBtn.addEventListener("click", debounce(toggleSubscription, 1000));

  if (dismissBtn)
    dismissBtn.addEventListener("click", () => {
      const widget = document.getElementById("jaosua-widget");
      if (widget) widget.style.display = "none";
    });
}

// ---------------- Initialization ----------------
function initializeWidget() {
  injectCSS();
  injectHTML();
  setupEventListeners();
  passConfigToServiceWorker();
  checkSubscriptionStatus();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeWidget);
} else {
  initializeWidget();
}
