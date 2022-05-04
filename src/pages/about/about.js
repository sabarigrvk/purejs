import { setupShadow } from "../../scripts/helpers";

export default class About extends HTMLElement {

  static config = {
    title: 'About',
    description: 'Welcome to About page',
    pathname: '/about'
  }

  constructor() {
    super();
    console.log('about page');
    setupShadow(this, `<b>Hello about</b>`);
  }
}
