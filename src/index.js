import './styles/app.css';
// import Tooltip from './components/tooltip';

const context = require.context('.', true, /^(\.)*\/(?!styles|scripts).+\/([^/]*)\.js/, 'lazy');

// https://webpack.js.org/api/module-variables/#importmetawebpackcontext
// const context = import.meta.webpackContext('./components', {recursive: true, regExp: /^.+\/([^/]+)\/index\.js/, mode: 'lazy', chunkName: '[request]'})
context.keys().forEach(async path => {
  const name = path.replace(/^.+\/([^/]+)\.js/, "$1");
  // const comp = await context(path);
  console.log(path);
  const comp = await import(/* webpackChunkName:"[request]"*/ `${path}`);
  customElements.define(`sab-${name.toLowerCase()}`, comp.default);
})

