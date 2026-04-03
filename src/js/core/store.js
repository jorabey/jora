/*import {supabase} from "../utils/supabase.js"*/
/*
const { data, error } = await supabase
  .from('posts') // Jadval nomi
  .select('*'); 
  console.log(data)*/

class Store {
  constructor() {
    // Subscribers List
    this.subscribers = new Set();

    // App Default
    const initialState = {
      posts:[], // Barcha ustunlar
      menuData: JSON.parse(localStorage.getItem("jora_menu")) || [],
      user: JSON.parse(localStorage.getItem("jora_user")) || null,
      theme: localStorage.getItem("jora_theme") || [],
      lang:JSON.parse(localStorage.getItem("jora_lang")) || "uz",
      isLoading: false,
    };

    //Proxy
    this.state = this._createReactiveObject(initialState);
  }
  //Proxy
  _createReactiveObject(target) {
    const self = this;

    return new Proxy(target, {
      set(obj, prop, value) {
        if (obj[prop] === value) return true;

        obj[prop] = value;

        // LocalStorage save
        self._persistData(prop, value);

        // Warning to all subscribers
        self._notifySubscribers();

        return true;
      },
      get(obj, prop) {
        //  (Deep Proxy)
        const value = obj[prop];
        if (typeof value === "object" && value !== null) {
          return self._createReactiveObject(value);
        }
        return value;
      },
    });
  }

  //LocalStorage Save
  _persistData(key, value) {
    const keysToPersist = ["theme", "user","posts","lang","menu"];
    if (keysToPersist.includes(key)) {
      localStorage.setItem(`jora_${key}`, JSON.stringify(value));
    }
  }

  /**
   * Subscribe:Callback Function
   * @param {Function} callback
   */
  subscribe(callback) {
    this.subscribers.add(callback);
    // Unsubscribe
    return () => this.subscribers.delete(callback);
  }

  //Warning to all subscribers
  _notifySubscribers() {
    if (this._notifyTimeout) return;

    this._notifyTimeout = true;

    queueMicrotask(() => {
      this.subscribers.forEach((callback) => callback(this.state));
      this._notifyTimeout = false;
    });
  }

  /**
   * Set State
   * @param {Object} newState
   */
  setState(newState) {
    Object.assign(this.state, newState);
  }
}

// Singleton eksport
export const store = new Store();
