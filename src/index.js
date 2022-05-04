const componentPrefix = 'sab';
const Elements = {};

const context = import.meta.webpackContext('.', { recursive: true, regExp: /^(\.)*\/(?!scripts|styles).+\index.js/, mode: 'lazy'});
context.keys().forEach((path) => {
  const name = path
    .split('/')
    .map(str => str.replace(/\.js/g, '').replace(/\./g, ''))
    .filter(str => str !== '' && str !== 'index');
    Elements[`${componentPrefix}-${name.pop()}`] = () => import(/* webpackChunkName: "[request]" */`${path}`);

  // cache[name.join('-')] = () => context(/* webpackChunkName: "[request]" */ path)
});

const undefinedElements = document.querySelectorAll(':not(:defined)');
const loadElements = () => {
  [...undefinedElements].forEach(async ele => {
    const { default: component } = await Elements[ele.localName]();
    customElements.define(ele.localName, component);
  });
}

loadElements();