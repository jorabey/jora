/**
 * PWA Security: Integrity Guard
 * Role: Ensures subresource integrity and detects unauthorized file modifications.
 * Security: Uses SHA-256 hashing to validate cache consistency.
 */

export class IntegrityGuard {
  constructor() {
    this.algo = "SHA-256";
  }

  /**
   * Fayl mazmunidan xesh (hash) yaratish
   * @param {Response} response
   * @returns {Promise<string>}
   */
  async generateHash(response) {
    const clone = response.clone();
    const buffer = await clone.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest(this.algo, buffer);

    // Hashni o'n oltilik (hex) formatiga o'tkazish
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  /**
   * Keshdagi faylni tekshirish (Anti-tampering)
   * @param {Request} request
   * @param {string} expectedHash - Dasturchi tomonidan kutilayotgan hash
   */
  async validateResource(request, expectedHash) {
    const cache = await caches.match(request);
    if (!cache) return false;

    const currentHash = await this.generateHash(cache);

    if (currentHash !== expectedHash) {
      console.error(
        `%c Security Alert: Integrity mismatch for ${request.url} `,
        "background: red; color: white;",
      );

      // Xavfsizlik chorasi: Shubhali keshni o'chirish
      const cacheObj = await caches.open("v1-core-engine");
      await cacheObj.delete(request);

      return false;
    }

    return true;
  }

  /**
   * API javoblarini tekshirish (Xavfsiz tunnel)
   * @param {Object} data - Kelgan JSON ma'lumot
   * @param {string} signature - Serverdan kelgan raqamli imzo
   */
  verifyDataSignature(data, signature) {
    // Bu yerda HMAC yoki RSA imzosini tekshirish mantiqi bo'lishi mumkin
    // Hozircha oddiy string tekshiruvi (Placeholder)
    return btoa(JSON.stringify(data)) === signature;
  }

  /**
   * Critical Assets ro'yxatini tekshiruvdan o'tkazish
   */
  async auditCriticalAssets(assetMap) {
    const results = [];
    for (const [url, hash] of Object.entries(assetMap)) {
      const isValid = await this.validateResource(new Request(url), hash);
      results.push({ url, isValid });
    }
    return results;
  }
}

export const integrityGuard = new IntegrityGuard();
