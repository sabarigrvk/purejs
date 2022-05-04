import { setupShadow } from "../../scripts/helpers";

export default class Home extends HTMLElement {

  static config = {
    title: 'Home',
    description: 'Welcome to Home page',
    pathname: '/'
  }

  constructor() {
    super();
    console.log('home page');
    setupShadow(this, `<b>Hello home</b>`);
  }
}
