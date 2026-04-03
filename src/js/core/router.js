class Router {
  constructor() {
    this.routes = [];
    this.rootElement = null;
    this.notFoundView = null;
    this.currentCleanup = null;
  }

  /**
   * Router Start
   * @param {Array} routes - [{ path: '/', view: Function }]
   * @param {HTMLElement} rootElement
   * @param {Function} notFoundView
   */
  init(routes, rootElement, notFoundView) {
    this.rootElement = rootElement;
    this.notFoundView = notFoundView;

    this.routes = routes.map((route) => ({
      route: route,
      regex: new RegExp(
        "^" + route.path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$",
      ),
    }));

    // Brauzer Buttons
    window.addEventListener("popstate", () => this._handleRoute());

    // Link Tracking
    this._interceptLinks();

    // First download
    this._handleRoute();
  }
  //Software navigation
  navigateTo(url) {
    if (location.pathname === url) return;
    history.pushState(null, null, url);
    this._handleRoute();
  }

  //Get dynamic parameters
  _getParams(match) {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.route.path.matchAll(/:(\w+)/g)).map(
      (result) => result[1],
    );
    return Object.freeze(
      Object.fromEntries(keys.map((key, i) => [key, values[i]])),
    );
  }

  //Basic rendering logic
  async _handleRoute() {
    if (typeof this.currentCleanup === "function") {
      this.currentCleanup();
      this.currentCleanup = null;
    }

    const currentPath = location.pathname;
    let match = this.routes.find((r) => currentPath.match(r.regex));

    let viewFunction;
    let params = {};

    if (match) {
      match.result = currentPath.match(match.regex);
      params = this._getParams(match);
      viewFunction = match.route.view;
    } else {
      viewFunction = this.notFoundView;
    }

    try {
      const viewResult = await viewFunction(params);

      const viewElement =
        viewResult instanceof HTMLElement ? viewResult : viewResult.element;
      if (viewResult.cleanup) this.currentCleanup = viewResult.cleanup;

      requestAnimationFrame(() => {
        if (this.rootElement) {
          this.rootElement.replaceChildren(viewElement);
          window.scrollTo(0, 0);
        }
      });
    } catch (error) {
      console.error("Routing Error:", error);
    }
  }

  //Global link capture (Event Delegation)
  _interceptLinks() {
    document.body.addEventListener("click", (e) => {
      const target = e.target.closest("a[data-link]");

      if (target) {
        e.preventDefault();
        const url = target.getAttribute("href");
        this.navigateTo(url);
      }
    });
  }
}

export const router = new Router();
