//Utils import
import { el } from "../../../utils/dom.js";
import { useCSSModule } from "../../../utils/css-modul.js";

//Core import
import { observer } from "../../../core/observer.js";
import { config } from "../../../core/constants.js";

/*
//Import Component CSS Style
const GlobalButtonStyle = await useCSSModule(
  "./src/js/components/base/global_button/GlobalButton.css",
);*/

import GlobalButtonStyle from "./GlobalButton.module.css"

//Component(export)
export const GlobalButton = (icon,title = "+") => {
//Show Modal
  function showModal() {
    observer.emit(config.EVENTS.SHOW_ADD_MODAL_TODO, {});
    /*observer.emit(config.EVENTS.NOTIFICATION_SHOW, {
      message: "nima gap ukam",
      type: "error",
    });*/
  }
  return el(
    "button",
    {
      className: `${GlobalButtonStyle.btn} glass`,
      title: title,
      onclick: showModal,
    },
    icon,
  );
};
