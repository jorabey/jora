/**
 * Titanium Utils: Security Sandbox
 * Role: Sanitizes user input and prevents XSS attacks.
 */

export const security = {
  /**
   * HTML belgilarni escape qilish (Eng xavfsiz usul)
   * <script> -> &lt;script&gt;
   */
  sanitize(str) {
    if (typeof str !== "string") return str;

    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#x27;",
      "/": "&#x2F;",
    };
    const reg = /[&<>"'/]/gi;
    return str.replace(reg, (match) => map[match]);
  },

  /**
   * Escape qilingan matnni yana HTML holatiga qaytarish (faqat ishonchli joylarda)
   */
  decode(str) {
    const doc = new DOMParser().parseFromString(str, "text/html");
    return doc.documentElement.textContent;
  },

  /**
   * Tasodifiy xavfsiz ID yaratish (Tokenlar yoki elementlar uchun)
   */
  generateSafeId(length = 16) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
      "",
    );
  },

  /**
   * Nozik ma'lumotlarni xotiradan o'chirish (Memory wipe)
   */
  clearSensitiveData(obj) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        obj[key] = null;
      }
    }
  },
};
