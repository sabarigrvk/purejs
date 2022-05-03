import { setupShadow } from "../../scripts/helpers";
import html from "./modal.html";
import css from './modal.css';

export default class Modal extends HTMLElement {
  constructor() {
    super();
    setupShadow(this, html, css);
  } 
}