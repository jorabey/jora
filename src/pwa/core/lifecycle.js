/**
 * PWA Core: Lifecycle Manager
 * Role: Handles Service Worker registration, auto-updates, and state transitions.
 * Security: Ensures that only validated and latest versions are activated.
 */

import { pwaBridge } from "./sw-bridge.js";

export class LifecycleManager {
  constructor() {
    this.registration = null;
    this.refreshing = false;
  }

  /**
   * Service Worker-ni ro'yxatdan o'tkazish
   */
  async register() {
    if (!("serviceWorker" in navigator)) return;

    try {
      // Service Worker-ni root-dan ro'yxatdan o'tkazamiz
      this.registration = await navigator.serviceWorker.register("./sw.js", {
        type: "module",
        scope: "./",
      });

      this._setupUpdateStrategy();
      this._monitorControllerChange();

      console.log(
        "%c PWA Lifecycle: Active ",
        "background: #222; color: #bada55; padding: 2px;",
      );
    } catch (error) {
      console.error("PWA Registration Error:", error);
    }
  }

  /**
   * Yangilanish strategiyasini sozlash
   */
  _setupUpdateStrategy() {
    // 1. Yangi versiya yuklanganda darhol aniqlash
    this.registration.addEventListener("updatefound", () => {
      const newWorker = this.registration.installing;

      newWorker.addEventListener("statechange", () => {
        if (newWorker.state === "installed") {
          if (navigator.serviceWorker.controller) {
            // Agar eski controller bo'lsa va yangisi o'rnatilgan bo'lsa
            console.log(
              "%c New version detected! Preparing immediate update... ",
              "color: #ff9900",
            );
            this._handleUpdate();
          }
        }
      });
    });

    // 2. Har 30 daqiqada serverdan yangilanish borligini tekshirish
    setInterval(
      () => {
        this.registration.update();
      },
      1000 * 60 * 30,
    );
  }

  /**
   * Yangilanishni boshqarish: "Skip Waiting" buyrug'ini yuborish
   */
  async _handleUpdate() {
    // Bridge orqali SW-ga darhol o'tish (Activate) buyrug'ini beramiz
    await pwaBridge.sendCommand("SKIP_WAITING_AND_ACTIVATE");

    // UI-ga bildirishnoma yuborish (pwa-update-ready hodisasi)
    window.dispatchEvent(new CustomEvent("pwa-update-available"));
  }

  /**
   * Controller o'zgarganda (yangi SW ishga tushganda) sahifani yangilash
   */
  _monitorControllerChange() {
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (this.refreshing) return;
      this.refreshing = true;

      // Sahifani avtomatik yangilash - yangi kod ishga tushishi uchun
      console.log(
        "%c PWA: Reloading to apply new version... ",
        "color: #00ff00",
      );
      window.location.reload();
    });
  }

  /**
   * O'rnatish (Install) tugmasi uchun (PWA Prompt)
   */
  async promptInstall() {
    // Bu yerda 'beforeinstallprompt' hodisasini tutish va ko'rsatish mantiqi bo'ladi
    console.log("PWA: Ready to be installed on device.");
  }
}

export const pwaLifecycle = new LifecycleManager();
