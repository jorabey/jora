//Core import
import { observer } from "../../../core/observer.js";
import { config } from "../../../core/constants.js";

//Utils import
import { el } from "../../../utils/dom.js";
import { useCSSModule } from "../../../utils/css-modul.js";


//Import Component CSS Style
const NotificationHostStyle = await useCSSModule(
  "./src/js/components/base/notification_host/NotificationHost.css",
);

//Component(export)
export const NotificationHost = () => {
//Notification host
const host = el("div", { className: NotificationHostStyle.container });

//Crate Toast
function createToast({ message, type, duration = 300 }) {
    const typeStyles = {
      success: NotificationHostStyle.success,
      error: NotificationHostStyle.error,
      info: NotificationHostStyle.info,
    };
  

    const toast = el(
      "div",
      { className: `${NotificationHostStyle.notif} glass` },
      el(
        "span",
        { className: typeStyles[type] || typeStyles.success, title: message },
        message,
      ),
    );

    // Hostga qo'shish
    host.appendChild(toast);

    setTimeout(() => (toast.style.animation = "liftNotif 0.5s forwards"), 2500);
    setTimeout(() => toast.remove(), 3000);

  }

  // Observer Listening
  observer.on(config.EVENTS.NOTIFICATION_SHOW, (data) => {
   
    if (data && data.message) {
      createToast(data);
    }
  });

  return host;
};
