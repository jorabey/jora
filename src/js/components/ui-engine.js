//Core import
import { store } from "../core/store.js";
//Utils import
import { mount } from "../utils/dom.js";

export class UIEngine {
  static createComponent({ root, view, selector, onMount }) {
    let isMounted = false;

    const render = async () => {
      requestAnimationFrame(async () => {
        const state = store.state;
        const data = selector ? selector(state) : state;
        const template = await view(data);
        mount(root, template);

        if (!isMounted && onMount) {
          onMount(root, data);
          isMounted = true;
        }
      });
    };

    // Store Subscribe
    const unsubscribe = store.subscribe(() => render());

    // Initial Render
    render();

    return unsubscribe;
  }

  static renderList(items, component) {
    if (!Array.isArray(items) || items.length === 0) return null;

    const fragment = document.createDocumentFragment();
    items.forEach((item) => {
      const element = component(item);
      if (element) fragment.appendChild(element);
    });

    return fragment;
  }
}
