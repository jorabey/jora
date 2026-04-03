class Observer {
  constructor() {
    //Events and Functions Map
    this.events = new Map();
  }

  /**
   *  Subscribe
   * @param {string} eventName -Event Name
   * @param {Function} callback - Callback Function
   * @returns {Function} - Unsubscribe Function
   */
  on(eventName, callback) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, new Set());
    }

    const listeners = this.events.get(eventName);
    listeners.add(callback);

    // Unsubcribe
    return () => this.off(eventName, callback);
  }

  /**
   * Event Emit
   * @param {string} eventName - Event Name
   * @param {any} data - Data
   */
  emit(eventName, data) {
    const listeners = this.events.get(eventName);

    if (!listeners || listeners.size === 0) return;

    //Translatsiya
    listeners.forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Observer Error [${eventName}]:`, error);
      }
    });
  }

  /**
   * Unsubscribe
   * @param {string} eventName
   * @param {Function} callback
   */
  off(eventName, callback) {
    const listeners = this.events.get(eventName);
    if (listeners) {
      listeners.delete(callback);

      if (listeners.size === 0) {
        this.events.delete(eventName);
      }
    }
  }

  // Once Subscribe
  once(eventName, callback) {
    const wrapper = (data) => {
      callback(data);
      this.off(eventName, wrapper);
    };
    return this.on(eventName, wrapper);
  }

  //Clear All Events
  clearAll() {
    this.events.clear();
  }
}

// Singleton eksport
export const observer = new Observer();
