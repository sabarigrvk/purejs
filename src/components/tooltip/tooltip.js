import html from "./tooltip.html";
import css from "./tooltip.module.css";
import { setupShadow } from "../../scripts/helpers";

export default class Tooltip extends HTMLElement {
  
  // private variables
  #tooltipIcon;
  #tooltipVisible = false;
  #tooltipText = 'Some dummy tooltip text.';

  constructor() {
    super();
    setupShadow(this, html, css);
  }

  connectedCallback() {
    if (this.hasAttribute('text')) {
      this.#tooltipText = this.getAttribute('text');
    }
    this.#tooltipIcon = this.shadowRoot.querySelector('span');
    this.#tooltipIcon.addEventListener(
      'mouseenter',
      this.#showTooltip.bind(this)
    );
    this.#tooltipIcon.addEventListener(
      'mouseleave',
      this.#hideTooltip.bind(this)
    );
    this.#render();
  }

  disconnectedCallback() {
    this.#tooltipIcon.removeEventListener('mouseenter', this.#showTooltip);
    this.#tooltipIcon.removeEventListener('mouseleave', this.#hideTooltip);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }
    if (name === 'text') {
      this.#tooltipText = newValue;
    }
  }

  static get observedAttributes() {
    return ['text'];
  }

  #render() {
    let tooltipContainer = this.shadowRoot.querySelector('div');
    if (this.#tooltipVisible) {
      tooltipContainer = document.createElement('div');
      tooltipContainer.textContent = this.#tooltipText;
      this.shadowRoot.appendChild(tooltipContainer);
    } else {
      if (tooltipContainer) {
        this.shadowRoot.removeChild(tooltipContainer);
      }
    }
  }

  #showTooltip() {
    this.#tooltipVisible = true;
    this.#render();
  }

  #hideTooltip() {
    this.#tooltipVisible = false;
    this.#render();
  }
}
