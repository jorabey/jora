/**
 * TITANIUM API CLIENT: High-Performance Fetch Wrapper
 * Maqsad: API so'rovlarini o'ta tez, xavfsiz va ishonchli (Retry/Timeout) boshqarish.
 */

import { config } from "../core/constants.js";

class ApiClient {
  constructor() {
    this.baseUrl = config.API.BASE_URL;
    this.defaultTimeout = config.API.TIMEOUT;
    this.maxRetries = config.API.RETRIES;
  }

  /**
   * Asosiy so'rov yuboruvchi metod (Retry mantiqi bilan)
   */
  async request(endpoint, options = {}, retryCount = 0) {
    const { timeout = this.defaultTimeout, ...fetchOptions } = options;

    // 1. Timeout boshqaruvi (Aborting long requests)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const url = `${this.baseUrl}${endpoint}`;

    // 2. Default Header-larni sozlash
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...fetchOptions.headers,
    };

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // 3. Xatolarni tekshirish
      if (!response.ok) {
        throw new Error(`API_ERROR: ${response.status} ${response.statusText}`);
      }

      // 4. Ma'lumotni JSON formatida qaytarish
      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      // 5. Retry mantiqi: Tarmoq xatosi yoki Timeout bo'lsa qayta urinish
      if (
        retryCount < this.maxRetries &&
        (error.name === "AbortError" || !window.navigator.onLine)
      ) {
        // Eksponentsial kutish (1s, 2s, 4s...)
        const delay = Math.pow(2, retryCount) * 1000;
        await new Promise((res) => setTimeout(res, delay));

        return this.request(endpoint, options, retryCount + 1);
      }

      throw error;
    }
  }

  // Qulaylik uchun shortcut metodlar
  get(endpoint, options) {
    return this.request(endpoint, { ...options, method: "GET" });
  }

  post(endpoint, body, options) {
    return this.request(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  put(endpoint, body, options) {
    return this.request(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  delete(endpoint, options) {
    return this.request(endpoint, { ...options, method: "DELETE" });
  }
}

// Singleton eksport
export const api = new ApiClient();
