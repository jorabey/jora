import { store } from "../core/store.js";
import { applyUI } from "./applyUI.js";

export function initUI() {

  const saved = localStorage.getItem("ui");

  if (saved) {
    store.setState({
      ui: JSON.parse(saved)
    });
  }

  store.subscribe(state => {

    applyUI(state.ui);

    localStorage.setItem(
      "ui",
      JSON.stringify(state.ui)
    );

  });
}