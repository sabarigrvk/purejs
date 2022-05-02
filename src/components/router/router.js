import { setupShadow } from '../../scripts/helpers';
import html from './router.html';

export default class Router extends HTMLElement {
  #popStateChangedListener;
  #clickedLinkListener;

  constructor() {
    super();
    setupShadow(this, html);
  }

  get location() {
    return window.location;
  }

  connectedCallback() {
    this.#popStateChangedListener = this.popStateChanged.bind(this);
    window.addEventListener('popstate', this.popStateChangedListener);

    this.bindLinks();
  }

  disconnectedCallback() {
    window.removeEventListener('popstate', this.popStateChangedListener);
    this.unbindLinks();
  }

  bindLinks() {
    this.clickedLinkListener = (event) => {
      if (event.defaultPrevented) return;

      const link = event.composedPath().filter(element => element.tagName === 'A')[0];

      if (!link) {
        return;
      }

      this.clickedLink(link, event);
    }

    document.body.addEventListener('click', this.clickedLinkListener);
  }

  unbindLinks() {
    document.body.removeEventListener('click', this.clickedLinkListener);
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

  #getFullPathname(location) {
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
}