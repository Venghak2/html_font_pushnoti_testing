
import { initializeApp } from "firebase/app";
import { getMessaging, getToken,onMessage } from "firebase/messaging";

// Configurable via global variables (can be overridden by embedding site)
const API_BASE   = window.JAOSUA_CONFIG?.apiBase;  
const USERUID    = window.JAOSUA_CONFIG?.userUid;
const LOGO_URL   = window.JAOSUA_CONFIG?.logoUrl;

// Firebase configuration (configurable via window.JAOSUA_CONFIG)
const firebaseConfig = window.JAOSUA_CONFIG?.firebaseConfig;

const VAPID_KEY = window.JAOSUA_CONFIG?.vapidKey;

// Make firebaseConfig available globally (for service worker compatibility)
if (typeof self !== 'undefined') {
  self.firebaseConfig = firebaseConfig;
}

const app       = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

onMessage(messaging, payload => {console.log("[FCM] foreground message:", payload);});

// CSS styles to inject
const CSS_STYLES = `
  .jaosua-widget {
    margin: 0;
    padding: 0;
    font-family: 'Poppins', sans-serif;
  }
  
  .jaosua-pwa-install-prompt {
    background: linear-gradient(135deg, rgba(0, 0, 0, .98), rgba(10, 10, 10, .98));
  }
  
  .jaosua-prompt-content {
    align-items: center;
    display: flex;
    gap: 16px;
    justify-content: space-between;
    max-width: 100%;
    padding: 16px 20px;
  }
  
  .jaosua-prompt-logo {
    background: rgba(255, 255, 255, .1);
    border: 1px solid hsla(0, 0%, 100%, .2);
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .3);
    height: 48px;
    object-fit: contain;
    width: 48px;
  }
  
  .jaosua-prompt-logo-section {
    align-items: center;
    display: flex;
    flex: 1;
    gap: 12px;
    min-width: 0;
  }
  
  .jaosua-prompt-text {
    color: #fff;
    flex: 1;
    min-width: 0;
  }
  
  .jaosua-prompt-title {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 4px;
  }
  
  .jaosua-prompt-subtitle {
    color: rgba(255, 255, 255, .8);
    font-size: 14px;
    font-weight: 400;
    margin: 0;
  }
  
  .jaosua-prompt-actions {
    align-items: center;
    display: flex;
    flex-shrink: 0;
    gap: 12px;
  }
  
  .jaosua-dismiss-button {
    align-items: center;
    background: rgba(255, 255, 255, .1);
    border: 1px solid hsla(0, 0%, 100%, .2);
    border-radius: 50%;
    color: rgba(255, 255, 255, .8);
    cursor: pointer;
    display: flex;
    height: 36px;
    justify-content: center;
    transition: all .2s ease;
    width: 36px;
    -webkit-tap-highlight-color: transparent;
  }
  
  .jaosua-install-button {
    background: linear-gradient(135deg, #83f, #a855f7);
    border: none;
    border-radius: 24px;
    box-shadow: 0 4px 12px rgba(136, 51, 255, .3);
    color: #fff;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    overflow: hidden;
    padding: 10px 20px;
    position: relative;
    transition: all .3s cubic-bezier(.25, .8, .25, 1);
    -webkit-tap-highlight-color: transparent;
  }
  
  .jaosua-install-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -75%;
    width: 50%;
    height: 100%;
    background: rgba(255, 255, 255, 0.2);
    transform: skewX(-20deg);
    filter: blur(8px);
    transition: left 0.6s ease;
  }
  
  .jaosua-install-button:hover::before {
    left: 125%;
  }
  
  .jaosua-install-button:hover {
    box-shadow: 0 6px 20px rgba(136, 51, 255, 0.5);
    transform: translateY(-2px);
  }
  
  .jaosua-marquee {
    height: 25px;
    overflow: hidden;
    position: relative;
    color: #535857;
  }
  
  .jaosua-marquee div {
    display: block;
    width: 200%;
    height: 30px;
    position: absolute;
    overflow: hidden;
    animation: jaosua-marquee 10s linear infinite;
  }
  
  .jaosua-marquee span {
    float: left;
    width: 50%;
  }
  
  @keyframes jaosua-marquee {
    0% { left: 0; }
    100% { left: -100%; }
  }
  
  .jaosua-marquee:hover div {
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
  }
`;

// Function to inject CSS
function injectCSS() {
  if (document.getElementById('jaosua-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'jaosua-styles';
  style.textContent = CSS_STYLES;
  document.head.appendChild(style);
}

// Function to inject HTML
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
            <button class="jaosua-install-button">
              Install the app
            </button>
          </div>
        </div>
      </div>
      <div class="jaosua-marquee">
        <div>
          <span>Jaosua123 ยินดีให้บริการค่ะ ฝาก-ถอน โอนไว แอดมินบริการ24ชม. ถอนไม่อั้นทุกยอดฝาก</span>
          <span>Jaosua123 ยินดีให้บริการค่ะ ฝาก-ถอน โอนไว แอดมินบริการ24ชม. ถอนไม่อั้นทุกยอดฝาก</span>
        </div>
      </div>
    </div>
  `;
  
  // Insert at the beginning of body or at a specific container
  const targetContainer = document.querySelector(window.JAOSUA_CONFIG?.container || 'body');
  if (targetContainer) {
    targetContainer.insertAdjacentHTML('afterbegin', widgetHTML);
  }
}

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
            throw new Error(`Error registration service worker. ${err}`);
        }
    }

    await navigator.serviceWorker.ready;
    return registration;
}

async function requestNotificationPermission() {
    if (typeof Notification === "undefined") {
        throw new Error("Notifications are not supported in this browser");
    }

    if (Notification.permission === "denied") {
        throw new Error("Notification permission is permanently denied by the user");
    }

    if (Notification.permission !== "granted") {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
            throw new Error("Notification permission was not granted");
        }
    }
    return true;
}

async function authentication() {
    try {
        await requestNotificationPermission();
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

// Function to setup event listeners
function setupEventListeners() {
  const installBtn = document.querySelector(".jaosua-install-button");
  const dismissBtn = document.querySelector(".jaosua-dismiss-button");
  
  if (installBtn) {
    installBtn.addEventListener("click", authentication);
  }
  
  if (dismissBtn) {
    dismissBtn.addEventListener("click", () => {
      const widget = document.getElementById('jaosua-widget');
      if (widget) {
        widget.style.display = 'none';
      }
    });
  }
}

// Initialize the widget
function initializeWidget() {
  injectCSS();
  injectHTML();
  setupEventListeners();
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener("DOMContentLoaded", initializeWidget);
} else {
  initializeWidget();
}
