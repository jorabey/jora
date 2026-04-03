/**
 * PWA Master Service Worker
 * Location: /sw.js (Root)
 * Role: Central hub for networking, lifecycle management, and security audits.
 */

// Modullarni import qilish (Arxitektura bo'yicha src ichidan)
import { CACHE_NAME, ASSETS } from "./src/pwa/core/sw-assets.js";
import { NetworkEngine } from "./src/pwa/core/network.js";
import { integrityGuard } from "./src/pwa/security/integrity.js";

// Network mantiqini ishga tushiramiz
const network = new NetworkEngine(CACHE_NAME);

/**
 * 1. Install Event: Statik aktivlarni keshga o'rnatish
 */
self.addEventListener("install", (event) => {
  console.log("%c SW: Installing & Caching Assets... ", "color: #00bcd4");

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        // Muhim: Fayllarni keshga olishdan oldin ularni SRI auditidan o'tkazish mumkin
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting()), // Kutish bosqichini o'tkazib yuborish
  );
});

/**
 * 2. Activate Event: Eski keshni tozalash va yangi SW-ni nazoratga olish
 */
self.addEventListener("activate", (event) => {
  console.log("%c SW: Activating & Cleaning old caches... ", "color: #4caf50");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME && cache !== `${CACHE_NAME}-api`) {
              return caches.delete(cache);
            }
          }),
        );
      })
      .then(() => self.clients.claim()), // Barcha ochiq tablarni darhol nazoratga olish
  );
});

/**
 * 3. Fetch Event: Tarmoq so'rovlarini boshqarish (Network Engine orqali)
 */
self.addEventListener("fetch", (event) => {
  // Biz yaratgan professional NetworkEngine so'rovni tahlil qiladi va javob qaytaradi
  network.handleRequest(event);
});

/**
 * 4. Message Event: UI (sw-bridge.js) dan kelayotgan buyruqlarni bajarish
 */
self.addEventListener("message", (event) => {
  const { type, payload } = event.data;

  switch (type) {
    case "SKIP_WAITING_AND_ACTIVATE":
      self.skipWaiting();
      break;

    case "NETWORK_STATUS":
      console.log(`SW: App is now ${payload.online ? "Online" : "Offline"}`);
      break;

    case "GET_CACHE_VERSION":
      event.ports[0].postMessage({ version: CACHE_NAME });
      break;

    default:
      console.warn(`SW: Unknown command received: ${type}`);
  }
});

/**
 * 5. Push Notification: Bildirishnomalarni qabul qilish
 */
self.addEventListener("push", (event) => {
  const data = event.data
    ? event.data.json()
    : { title: "Yangi xabar", body: "Startapda o'zgarish bor!" };

  const options = {
    body: data.body,
    icon: "./src/assets/images/logos/png/logo.png",
    badge: "./src/assets/images/logos/png/logo.png",
    vibrate: [100, 50, 100],
    data: { url: data.url || "/" },
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});
