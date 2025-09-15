
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

// ---------------- Config ----------------
//const API_BASE = "https://api.dev.1xnoti.onesiamsoft.com/"
const API_BASE = "http://localhost:7000/"
const API_SUBSCRIBE = API_BASE + "api/"+ "subscribe";
const API_UNSUBSCRIBE = API_BASE + "api/" + "unsubscribe";

const USERUID = window.JAOSUA_CONFIG?.userUid;
const PLAYERID = window.JAOSUA_CONFIG?.playerId;
const LOGO_URL = window.JAOSUA_CONFIG?.logoUrl;

const firebaseConfig = {
    apiKey: "AIzaSyDEknhMLtR7yGyjfjI3Reyn1WGvkL9K6aI",
    authDomain: "notification-91d47.firebaseapp.com",
    projectId: "notification-91d47",
    storageBucket: "notification-91d47.appspot.com",
    messagingSenderId: "931826122946",
    appId: "1:931826122946:web:7840927810f854470ebb5b",
    measurementId: "G-30JJFRDNSX"
};
const VAPID_KEY = "BNdpNyxjim_8r4LfhR08n9bEOrr5dcw5iOcomnqufFoXV6sK0x4qxDmaEv1Fh3Tta4czYsSvMR9UQMZqS7KKxUo"

// Make firebaseConfig available globally for service worker
if (typeof self !== 'undefined') self.firebaseConfig = firebaseConfig;

// Pass config to service worker
const passConfigToServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    if (registration.active) {
      registration.active.postMessage({
        type: 'FIREBASE_CONFIG',
        config: firebaseConfig
      });
    }
  }
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// ---------------- CSS Injection ----------------
function injectCSS() {
  if (document.getElementById('jaosua-styles')) return;
  const style = document.createElement('style');
  style.id = 'jaosua-styles';
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
    .unsubscribe-btn { background: linear-gradient(135deg,#ccc,#888); color: #fff; box-shadow: 0 4px 12px rgba(0,0,0,.2); }
    .jaosua-marquee { height: 25px; overflow: hidden; position: relative; color: #535857; }
    .jaosua-marquee div { width: 200%; position: absolute; animation: jaosua-marquee 10s linear infinite; }
    .jaosua-marquee span { float: left; width: 50%; }
    @keyframes jaosua-marquee { 0%{left:0} 100%{left:-100%} }
    .jaosua-marquee:hover div { animation-play-state: paused; }
  `;
  document.head.appendChild(style);
}

// ---------------- HTML Injection ----------------
function injectHTML() {
  if (document.getElementById('jaosua-widget')) return;
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
  const target = document.querySelector(window.JAOSUA_CONFIG?.container || 'body');
  if (target) target.insertAdjacentHTML('afterbegin', widgetHTML);
}

// ---------------- Helpers ----------------
async function getServiceWorkerRegistration() {
  if (!("serviceWorker" in navigator)) throw new Error("Service Workers not supported");
  if (!self.isSecureContext) throw new Error("Site must use HTTPS or localhost");

  let registration = await navigator.serviceWorker.getRegistration();
  if (!registration) registration = await navigator.serviceWorker.register("/sw.js");
  await passConfigToServiceWorker();
  await navigator.serviceWorker.ready;
  return registration;
}

async function requestNotificationPermission() {
  if (typeof Notification === "undefined") throw new Error("Notifications not supported");
  if (Notification.permission === "denied") throw new Error("Notification permission denied");
  if (Notification.permission !== "granted") {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") throw new Error("Notification permission not granted");
  }
  return true;
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

// ---------------- Toggle Subscription ----------------
async function toggleSubscription() {
  try {
    const btn = document.querySelector(".jaosua-subscribe");
    if (!btn) return;  
    
    const isSubscribed = btn.dataset.subscribed === "true";
    const url = isSubscribed ? API_UNSUBSCRIBE : API_SUBSCRIBE;

    await requestNotificationPermission();
    const registration = await getServiceWorkerRegistration();
    const generateToken = await getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: registration });

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tokenDevice: generateToken, uuid: USERUID, playerId: PLAYERID })
    });

    if (!res.ok) {
      const { message } = await res.json().catch(() => ({}));
      throw new Error(message || `Request failed (${res.status})`);
    }

    updateButtonState(!isSubscribed);

  } catch (err) {
    alert("Error while updating subscription: " + err.message);
  }
}

// ---------------- Check Subscription ----------------
async function checkSubscriptionStatus() {
  try {
    const res = await fetch(`${API_SUBSCRIBE}/check?playerid=${PLAYERID}&uuid=${USERUID}`);
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

  if (subBtn) subBtn.addEventListener("click", toggleSubscription);
  if (dismissBtn) dismissBtn.addEventListener("click", () => {
    const widget = document.getElementById('jaosua-widget');
    if (widget) widget.style.display = 'none';
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

if (document.readyState === 'loading') {
  document.addEventListener("DOMContentLoaded", initializeWidget);
} else {
  initializeWidget();
}
