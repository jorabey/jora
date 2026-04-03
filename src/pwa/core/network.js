/**
 * PWA Core: Network & Caching Engine
 * Role: Manages fetch strategies to ensure high performance and offline stability.
 * Goal: Zero-latency for static assets and resilient API handling.
 */

export class NetworkEngine {
  constructor(cacheName) {
    this.CACHE_NAME = cacheName;
    this.API_CACHE_NAME = `${cacheName}-api`;
    // Faqat GET so'rovlarini keshlaymiz
    this.BYPASS_METHODS = ["POST", "PUT", "DELETE", "PATCH"];
  }

  /**
   * Statik fayllar uchun: Cache-First (Performance-oriented)
   * CSS, JS, Rasmlar uchun ideal
   */
  async cacheFirst(request) {
    const cache = await caches.open(this.CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) return cachedResponse;

    try {
      const networkResponse = await fetch(request);
      if (networkResponse.status === 200) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      return new Response("Offline: Resource not found", { status: 404 });
    }
  }

  /**
   * Dinamik ma'lumotlar uchun: Stale-While-Revalidate (Dahshatli Tezkor)
   * Foydalanuvchi keshni ko'radi, ilova esa fonda ma'lumotni yangilaydi.
   */
  async staleWhileRevalidate(request) {
    const cache = await caches.open(this.API_CACHE_NAME);
    const cachedResponse = await cache.match(request);

    const fetchPromise = fetch(request)
      .then(async (networkResponse) => {
        if (networkResponse.status === 200) {
          await cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      })
      .catch(() => null);

    // Keshda bo'lsa darhol beramiz, bo'lmasa tarmoqni kutamiz
    return cachedResponse || fetchPromise;
  }

  /**
   * Muhim API so'rovlar uchun: Network-First (Freshness-oriented)
   * Internet bo'lsa yangi ma'lumot, bo'lmasa keshdagisi.
   */
  async networkFirst(request) {
    const cache = await caches.open(this.API_CACHE_NAME);

    try {
      const networkResponse = await fetch(request);
      if (networkResponse.status === 200) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      const cachedResponse = await cache.match(request);
      return cachedResponse || new Response("Network Error", { status: 503 });
    }
  }

  /**
   * So'rov turiga qarab strategiyani tanlash
   */
  handleRequest(event) {
    const { request } = event;
    const url = new URL(request.url);

    // 1. Tashqi metodlarni o'tkazib yuboramiz
    if (this.BYPASS_METHODS.includes(request.method)) return;

    // 2. Statik aktivlar (Static Assets)
    if (
      request.destination === "style" ||
      request.destination === "script" ||
      request.destination === "image" ||
      request.destination === "font"
    ) {
      event.respondWith(this.cacheFirst(request));
      return;
    }

    // 3. API so'rovlari
    if (url.pathname.startsWith("/api/")) {
      event.respondWith(this.staleWhileRevalidate(request));
      return;
    }

    // 4. Qolgan hamma narsa (Sahifalar) uchun Stale-While-Revalidate
    event.respondWith(this.staleWhileRevalidate(request));
  }
}
