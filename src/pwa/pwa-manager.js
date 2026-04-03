/**
 * PWA Unified Manager (Entry Point)
 * Role: Orchestrates all PWA modules and provides a simplified API for the main app.
 * Principle: Initialize security first, then lifecycle, then establish the bridge.
 */

import { pwaBridge } from "./core/sw-bridge.js";
import { pwaLifecycle } from "./core/lifecycle.js";
import { integrityGuard } from "./security/integrity.js";
import { sandbox } from "./security/sandbox.js";

class PWAManager {
  constructor() {
    this.isInitialized = false;
    this.config = {
      version: "1.0.0",
      autoUpdate: true,
      debug: false,
    };
  }

  /**
   * Butun PWA tizimini professional ketma-ketlikda ishga tushirish
   */
  async init(customConfig = {}) {
    if (this.isInitialized) return;

    this.config = { ...this.config, ...customConfig };

    try {
      // 1. Xavfsizlik qatlamini tayyorlash (Encryption Sandbox)
      await sandbox.initialize();
      if (this.config.debug) console.log("PWA: Security Sandbox ready.");

      // 2. Aloqa ko'prigini o'rnatish (UI <-> SW Bridge)
      pwaBridge.init();

      // 3. Lifecycle-ni ishga tushirish (Registration & Updates)
      await pwaLifecycle.register();

      // 4. Global yangilanish hodisalarini kuzatish
      this._setupUpdateListeners();

      this.isInitialized = true;
      console.log(
        `%c 🚀 PWA Manager v${this.config.version} Initialized `,
        "background: #000; color: #fff; border-radius: 4px; padding: 4px;",
      );
    } catch (error) {
      console.error("PWA Initialization failed:", error);
    }
  }

  /**
   * Yangilanishlarni boshqarish
   */
  _setupUpdateListeners() {
    window.addEventListener("pwa-update-available", () => {
      if (this.config.autoUpdate) {
        // Agar avtomatik yangilanish yoqilgan bo'lsa, foydalanuvchiga xabar berish
        // Haqiqiy ilova kabi bildirishnoma chiqarish mantiqi shu yerda bo'ladi
        this.notifyUser("Yangi versiya tayyor. Ilova yangilanmoqda...");
      }
    });
  }

  /**
   * Ma'lumotlarni xavfsiz saqlash (Main App uchun interfeys)
   */
  async secureSave(key, data) {
    const encrypted = await sandbox.encrypt(data);
    // Bu yerda encrypted ma'lumotni xohlasangiz LocalStorage,
    // xohlasangiz IndexedDB ga saqlashingiz mumkin.
    localStorage.setItem(`_secure_${key}`, JSON.stringify(encrypted));
  }

  /**
   * Shifrlangan ma'lumotni o'qish
   */
  async secureRead(key) {
    const raw = localStorage.getItem(`_secure_${key}`);
    if (!raw) return null;
    return await sandbox.decrypt(JSON.parse(raw));
  }

  /**
   * Foydalanuvchiga bildirishnoma ko'rsatish (Native UI)
   */
  notifyUser(message) {
    // Bu yerda minimalist toast yoki notification UI chaqiriladi
    console.log(
      `%c [PWA Notification]: ${message} `,
      "color: #00dbde; font-weight: bold;",
    );
  }
}

// Singleton: Butun loyiha bo'ylab yagona boshqaruvchi
export const pwaManager = new PWAManager();
