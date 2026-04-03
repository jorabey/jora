/**
 * Element Creator
 * @param {string} tag - HTML tag (div, button, etc.)
 * @param {Object} props - Attributes and events
 * @param {...any} children - Children (text or element)
 * @returns {HTMLElement}
 */
export const el = (tag, props = {}, ...children) => {
  const element = document.createElement(tag);
  if (props) {
    for (const key in props) {
      const value = props[key];
      if (key.startsWith("on") && typeof value === "function") {
        // Event listenerlarni biriktirish (onclick -> click)
        element.addEventListener(key.slice(2).toLowerCase(), value);
      } else if (key === "className" || key === "class") {
        element.className = value;
      } else if (key === "style" && typeof value === "object") {
        // Inline stillarni optimallashtirilgan tarzda berish
        Object.assign(element.style, value);
      } else if (key === "dataset" && typeof value === "object") {
        Object.assign(element.dataset, value);
      }else if(key === "ariaLabel" && typeof value === "object"){
        element.ariaLabel
      }else {
        element.setAttribute(key, value);
      }
    }
  }

  const fragment = document.createDocumentFragment();

  children.flat(Infinity).forEach((child) => {
    if (child === null || child === undefined || child === false) return;

    if (child instanceof Node) {
      fragment.appendChild(child);
    } else {
      fragment.appendChild(document.createTextNode(String(child)));
    }
  });

  element.appendChild(fragment);
  return element;
};

/**
 * DOM Fast Update
 * @param {HTMLElement} parent - Parent element
 * @param {HTMLElement} newChild - New element
 */
export const mount = (parent, newChild) => {
  if (!parent) return;
  parent.replaceChildren(newChild);
};

//Get Elements
export const $ = (selector, context = document) =>
  context.querySelector(selector);
export const $$ = (selector, context = document) =>
  Array.from(context.querySelectorAll(selector));

//Dynamic class management
export const cls = (element, classes = {}) => {
  for (const [className, condition] of Object.entries(classes)) {
    element.classList.toggle(className, !!condition);
  }
};

//Element Delete
export const unmount = (element) => {
  if (element && element.parentNode) {
    element.parentNode.removeChild(element);
  }
};
