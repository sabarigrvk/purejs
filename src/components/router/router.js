import { setupShadow } from '../../scripts/helpers';
import html from './router.html';

const routeComponents = new Set();

export default class Router extends HTMLElement {
  #routeElements = [];
  #popStateChangedListener;
  #clickedLinkListener;
  #historyChangeStates;
  #previousLocation;

  constructor() {
    super();
    routeComponents.add(this);
    setupShadow(this, html);
    const children = this.children;
    Array.from(children).forEach(element => {
      this.#routeElements.push(element);
      this.shadowRoot.appendChild(element);
    });
  }

  connectedCallback() {
    this.#popStateChangedListener = this.popStateChanged.bind(this);
    window.addEventListener('popstate', this.#popStateChangedListener);

    this.bindLinks();

    this.#historyChangeStates = new Map([
      [window.history.pushState, 'pushState'],
      [window.history.replaceState, 'replaceState']
    ]);

    for (const [method, name] of this.#historyChangeStates) {
      window.history[name] = (state, title, url) => {
        const triggerRouteChange = !state || !state.triggerRouteChange;

        if (!triggerRouteChange) {
          delete state.triggerRouteChange;
        }

        method.call(history, state, title, url);

        if (this.#previousLocation) {
          this.hideRoute(this.#previousLocation.pathname);
        }

        this.showRoute(url);
      }
    }
    this.showRoute(this.getFullPathname(this.location));
  }

  disconnectedCallback() {
    window.removeEventListener('popstate', this.#popStateChangedListener);
    this.unbindLinks();
  }

  get location() {
    return window.location;
  }

  matchPathWithRegex(pathname = '', regex) {
    if (!pathname.startsWith('/')) {
      pathname = `${pathname.replace(/^\//, '')}`;
    }
    return pathname.match(regex);
  }

  getRouteElementByPath(pathname) {
    let element;
    if (!pathname) return;

    for (const child of this.#routeElements) {
      let path = pathname;
      const search = child.getAttribute('search-params');
      if (search) {
        path = `${pathname}?${search}`;
      }
      console.log(customElements.get("sab-home"));
      if (this.matchPathWithRegex(path, child.getAttribute('path'))) {
        element = child;
        break;
      }
    }
  }

  bindLinks() {
    this.#clickedLinkListener = (event) => {
      if (event.defaultPrevented) return;

      const link = event.composedPath().filter(element => element.tagName === 'A')[0];

      if (!link) {
        return;
      }

      this.clickedLink(link, event);
    }

    document.body.addEventListener('click', this.#clickedLinkListener);
  }

  unbindLinks() {
    document.body.removeEventListener('click', this.#clickedLinkListener);
  }

  clickedLink(link, event) {
    const { href } = link;
    if (!href || href.indexOf('mailto:') !== -1) return;

    const { location } = this;
    const origin = location.origin || location.protocol + '//' + location.host;

    // handle external links
    if (href.indexOf(origin) !== 0 || link.origin !== location.origin) {
      window.history.scrollRestoration = 'manual';
      sessionStorage.setItem(
        'currentScrollPosition',
        document.documentElement.scrollTop.toString()
      );
      return;
    }

    // internal links scroll to section
    const state = {};
    if (link.hash && link.pathname === location.pathname) {
      this.scrollToHash(link.hash);
      state.triggerRouteChange = false;
    }

    window.history.pushState(state, document.title, `${link.pathname}${link.search}${link.hash}`);
    event.preventDefault();
  }

  getFullPathname(location) {
    if (!location) {
      return '';
    }
    const { pathname, search, hash } = location;
    return `${pathname}${search}${hash}`;
  }

  popStateChanged() {
    const path = this.getFullPathname(this.location);
    window.history.replaceState({}, document.title, path);
  }

  async showRoute(location) {
    if (!location) return;
    const [pathname, hashString] = location.split('#');
    const routeElement = this.getRouteElementByPath(pathname);
    console.log(routeElement);
    this.#previousLocation = { ...this.location };
  }

  async hideRoute(location = '') {

  }

}