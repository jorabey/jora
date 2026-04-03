/* ===== Main JS ===== */

//Core import
import { router } from "./core/router.js";
import { store } from "./core/store.js";
import { observer } from "./core/observer.js";
import { config } from "./core/constants.js";

//i18n
import { initI18n,t,setLang } from "./i18n/index.js";
store.subscribe(async (state) => {
  setLang(state.lang)
})

await initI18n(localStorage.getItem("jora_lang")?localStorage.getItem("jora_lang"):"uz");


//Utils
import { el } from "./utils/dom.js";

//Routes
const routes = [
  {
    path: "/",
    view: async () => {
      try {
        const { MainLayout } =
          await import("./components/base/layout/main_layout/MainLayout.js");
        const { TodoPage } = await import("./pages/TodoPage.js");
        return MainLayout(TodoPage(),t("name"));
      } catch (err) {
        console.error("Page Load Error:", err);
        return errorView("Sahifa moduli topilmadi.");
      }
    },
  },
  {
    path: "/home",
    view: async () => {
      try {
        const { MainLayout } =
          await import("./components/base/layout/main_layout/MainLayout.js");
        const { MainPage } = await import("./pages/main_page/MainPage.js");
        return MainLayout(MainPage(),t("navbar.home"));
      } catch (err) {
        console.error("Main Page Load Error:", err);
        return errorView("Asosiy sahifa moduli topilmadi.");
      }
    },
  },

 {
    path: "/messages",
    view: async () => {
      try {
        const { MainLayout } =
          await import("./components/base/layout/main_layout/MainLayout.js");
        const { MainPage } = await import("./pages/main_page/MainPage.js");
        return MainLayout(MainPage(),t("navbar.messages"));
      } catch (err) {
        console.error("Messages Page Load Error:", err);
        return errorView("Messages sahifa moduli topilmadi.");
      }
    },
  },

  {
    path: "/ai",
    view: async () => {
      try {
        const { MainLayout } =
          await import("./components/base/layout/main_layout/MainLayout.js");
        const { MainPage } = await import("./pages/main_page/MainPage.js");
        return MainLayout(MainPage(),t("navbar.ai"));
      } catch (err) {
        console.error("AI Page Load Error:", err);
        return errorView("AI sahifa moduli topilmadi.");
      }
    },
  },

  {
    path: "/apps",
    view: async () => {
      try {
        const { MainLayout } =
          await import("./components/base/layout/main_layout/MainLayout.js");
        const { MainPage } = await import("./pages/main_page/MainPage.js");
        return MainLayout(MainPage(),t("navbar.apps"));
      } catch (err) {
        console.error("APPS Page Load Error:", err);
        return errorView("Apps sahifa moduli topilmadi.");
      }
    },
  },

  {
    path: "/profile",
    view: async () => {
      try {
        const { MainLayout } =
          await import("./components/base/layout/main_layout/MainLayout.js");
        const { MainPage } = await import("./pages/main_page/MainPage.js");
        return MainLayout(MainPage(),t("navbar.profile"));
      } catch (err) {
        console.error("Profile Page Load Error:", err);
        return errorView("Profile sahifa moduli topilmadi.");
      }
    },
  },
];

//404 - page
const notFoundView = () => {
  return el(
    "div",
    {
      className: "not_found-container",
    },
    el(
      "div",
      { className: "not_found-div" },
      el("h1", { className: "not_found-name" }, "404"),
      el("p", { className: "not_found-text" }, "Kechirasiz, sahifa topilmadi!"),
      el(
        "a",
        {
          className: "not_found-button",
          href: "/",
          dataset: "/",
        },
        "Bosh Sahifaga qaytish",
      ),
    ),
  );
};

//error - page
const errorView = (message) => {
  const active = window.location.pathname === "/";
  return el(
    "div",
    { className: "error_container" },
    el(
      "div",
      {
        className: "error_div",
      },
      el(
        "div",
        {
          className: "error_icon",
        },
        "!",
      ),
      el("h2", { className: "error_name" }, "Yuklashda xatolik!"),
      el("p", { className: "error_messages" }, message),
      el(
        "button",
        {
          className: "error_button",
          onclick: () => location.reload(),
        },
        "Qayta Urinish",
      ),
      !active
        ? el(
            "a",
            {
              className: "not_found-button",
              href: "/",
              dataset: "/",
            },
            "Bosh Sahifaga qaytish",
          )
        : "",
    ),
  );
};

//App
const initApp = async () => {
  const startTime = performance.now();
  
const brandStyle = `
  background: #1e1e1e; 
  color: #00ffcc; 
  padding: 10px 20px; 
  border-radius: 8px; 
  font-family: 'Segoe UI', sans-serif; 
  font-size: 20px; 
  font-weight: bold;
  border: 1px solid #00ffcc;
  text-shadow: 2px 2px 5px rgba(0, 255, 204, 0.5);
`;

  try {
    const root = document.getElementById("app");

    if (!root) {
      throw new Error("Main Element (App) not found!");
    }

    // Routes safe format
    const safeRoutes = routes.map((route) => ({
      path: route.path,
      route: route,
      view: route.view,
    }));

    router.init(safeRoutes, root, notFoundView);

    // Global State (Theme)
    /* store.subscribe((state) => {
      const isDark = state.theme === "dark";
      document.body.classList.toggle("dark", isDark);
      document.body.style.backgroundColor = isDark ? "#0f172a" : "#f8fafc";
    });*/

    // Online/Offline monitoring
    window.addEventListener("online", () =>
      observer.emit(config.EVENTS.NOTIFICATION_SHOW, "Aloqa tiklandi"),
    );
    window.addEventListener("offline", () =>
      observer.emit(config.EVENTS.NOTIFICATION_SHOW, "Aloqa uzildi"),
    );
  } catch (criticalError) {
    console.error("CRITICAL_ERROR:", criticalError);
    if (document.body) {
      document.body.innerHTML = "";
      document.body.appendChild(
        errorView(
          "Ilovani ishga tushirishda texnik nosozlik yuz berdi. Konsolni tekshiring.",
        ),
      );
    }
  }
  const endTime = performance.now();
  const duration = (endTime - startTime).toFixed(2);
  console.log(`%c🚀 Jora Net Started ${duration}ms`,brandStyle);
};

// App Started
if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
