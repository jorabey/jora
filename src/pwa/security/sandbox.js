/**
 * PWA Security: Encryption Sandbox
 * Role: Provides a secure wrapper for IndexedDB data.
 * Security: Uses AES-GCM 256-bit encryption for at-rest data protection.
 */

export class SecuritySandbox {
  constructor() {
    this.algo = { name: "AES-GCM", length: 256 };
    this._key = null;
  }

  /**
   * Qurilma uchun xos bo'lgan shifrlash kalitini yaratish yoki tiklash
   */
  async initialize() {
    if (this._key) return;

    // Eslatma: Haqiqiy tizimda kalit foydalanuvchi paroli yoki
    // Serverdan olingan hardware-bound token asosida hosil qilinishi kerak.
    const seed = "minimalist-startup-safety-salt";
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode(seed),
      "PBKDF2",
      false,
      ["deriveKey"],
    );

    this._key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: encoder.encode("unique-salt-123"),
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      this.algo,
      false,
      ["encrypt", "decrypt"],
    );
  }

  /**
   * Ma'lumotni shifrlash
   * @param {Object|string} data
   */
  async encrypt(data) {
    await this.initialize();
    const iv = crypto.getRandomValues(new Uint8Array(12)); // Initialization Vector
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(
      typeof data === "string" ? data : JSON.stringify(data),
    );

    const encryptedContent = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      this._key,
      encodedData,
    );

    // IV va shifrlangan ma'lumotni birlashtirib saqlash
    return {
      iv: Array.from(iv),
      content: Array.from(new Uint8Array(encryptedContent)),
    };
  }

  /**
   * Shifrlangan ma'lumotni o'qish
   * @param {Object} encryptedPackage
   */
  async decrypt(encryptedPackage) {
    await this.initialize();
    const { iv, content } = encryptedPackage;

    try {
      const decryptedContent = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: new Uint8Array(iv) },
        this._key,
        new Uint8Array(content),
      );

      const decoder = new TextDecoder();
      const decodedString = decoder.decode(decryptedContent);

      try {
        return JSON.parse(decodedString);
      } catch {
        return decodedString;
      }
    } catch (e) {
      console.error(
        "Sandbox Security: Decryption failed. Integrity compromised?",
        e,
      );
      return null;
    }
  }
}

export const sandbox = new SecuritySandbox();
