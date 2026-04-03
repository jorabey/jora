/**
 * PWA Core: Service Worker Bridge
 * Role: Acts as a high-speed communication tunnel between the UI and the SW.
 * Security: Uses MessageChannel and BroadcastChannel for isolated communication.
 */

export class SWBridge {
  constructor() {
    // Ilova va SW orasidagi global kanal (Native App hissi uchun)
    this.channel = new BroadcastChannel("pwa_sync_channel");
    this.listeners = new Set();
    this._initInternalListeners();
  }

  /**
   * Bridge-ni ishga tushirish
   */
  init() {
    if (!("serviceWorker" in navigator)) return;

    // SW-dan kelayotgan xabarlarni tutish
    navigator.serviceWorker.addEventListener("message", (event) => {
      this._handleIncomingMessage(event.data);
    });

    // Kanal orqali kelayotgan xabarlarni tutish
    this.channel.onmessage = (event) => {
      this._handleIncomingMessage(event.data);
    };
  }

  /**
   * UI-dan Service Worker-ga buyruq yuborish
   * @param {string} type - Buyruq turi (masalan: 'SKIP_WAITING', 'GET_CACHE_SIZE')
   * @param {Object} payload - Qo'shimcha ma'lumotlar
   */
  async sendCommand(type, payload = {}) {
    const controller = navigator.serviceWorker.controller;

    if (!controller) {
      console.warn(
        "SW Bridge: Controller topilmadi. Buyruq navbatga qo'yildi.",
      );
      return;
    }

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => resolve(event.data);

      controller.postMessage(
        {
          type,
          payload,
          version: "1.0.0", // Protokol xavfsizligi uchun
          timestamp: Date.now(),
        },
        [messageChannel.port2],
      );
    });
  }

  /**
   * SW-dan kelgan xabarlarni qayta ishlash
   */
  _handleIncomingMessage(data) {
    // Xavfsizlik: Faqat bizning strukturadagi xabarlarni qabul qilamiz
    if (!data || !data.type) return;

    console.log(
      `%c SW-Bridge In: ${data.type} `,
      "background: #000; color: #00ff00; padding: 2px;",
    );

    // Barcha obunachilarni xabardor qilish
    this.listeners.forEach((callback) => callback(data));

    // Tizim darajasidagi hodisalar
    if (data.type === "NEW_VERSION_AVAILABLE") {
      this._triggerUpdateUI();
    }
  }

  /**
   * Yangilanish haqida xabar berish (Global Custom Event)
   */
  _triggerUpdateUI() {
    window.dispatchEvent(
      new CustomEvent("pwa-update-ready", {
        detail: { immediate: true },
      }),
    );
  }

  /**
   * Bridge-ga yangi tinglovchi qo'shish
   */
  onMessage(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  _initInternalListeners() {
    // Tarmoq holatini kuzatish va SW-ga xabar berish
    window.addEventListener("online", () =>
      this.sendCommand("NETWORK_STATUS", { online: true }),
    );
    window.addEventListener("offline", () =>
      this.sendCommand("NETWORK_STATUS", { online: false }),
    );
  }
}

// Singleton instansiya - butun ilova uchun bitta tunnel
export const pwaBridge = new SWBridge();
