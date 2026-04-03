const CONSTANTS = {
  // App Settings
  APP: {
    NAME: "Jora Net Web App",
    VERSION: "0.0.1",
    STORAGE_PREFIX: "jora_",
    DEFAULT_LOCALE: "uz",
  },

  // API Settings
  API: {
    BASE_URL: "https://api.jora.net/v1",
    TIMEOUT: 15000, // 15 soniya
    RETRIES: 3,
  },

  // Observer Events
  EVENTS: {
    USER_LOGIN: "auth:login",
    USER_LOGOUT: "auth:logout",
    THEME_CHANGED: "ui:theme-changed",
    NOTIFICATION_SHOW: "ui:notification",
  },
  // Status
  STATUS: {
    IDLE: "idle",
    LOADING: "loading",
    SUCCESS: "success",
    ERROR: "error",
  },
};

//Deep Freeze
const deepFreeze = (obj) => {
  Object.keys(obj).forEach((prop) => {
    if (typeof obj[prop] === "object" && obj[prop] !== null) {
      deepFreeze(obj[prop]);
    }
  });
  return Object.freeze(obj);
};

export const config = deepFreeze(CONSTANTS);
