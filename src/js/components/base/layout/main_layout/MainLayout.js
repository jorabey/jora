//Utils import
import { el } from "../../../../utils/dom.js";
import { useCSSModule } from "../../../../utils/css-modul.js";

//Core
import { store } from "../../../../core/store.js";

//i18n
import {t} from "../../../../i18n/index.js";

//Components import
import { Header } from "../../header/Header.js";
import { Navbar } from "../../navbar/Navbar.js";
import { GlobalButton } from "../../global_button/GlobalButton.js";
import { NotificationHost } from "../../notification_host/NotificationHost.js";

//Import Component CSS Style
const MainLayoutStyle = await useCSSModule(
  "./src/js/components/base/layout/main_layout/MainLayout.css",
);

/**
 * @param {HTMLElement} pageContent - Page content (Coming from the Router)
 * @param {HTMLElement} pageName - Page Name
 */

export const MainLayout = (pageContent, pageName) => {
  return el(
    "div",
    { className: MainLayoutStyle.container, title: pageName },
    el("div",{className:MainLayoutStyle.header},Header(pageName)),
    Navbar(),
    pageContent,
    GlobalButton(el("i", { className: "material-icons" },"post_add"),t("post_add")),
    NotificationHost(),
  );
};
