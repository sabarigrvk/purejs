const context = import.meta.webpackContext('./', {recursive: true, regExp: /^(\.)*\/.+\/([^/]*)\.js/, mode: 'lazy', chunkName: '[request]'})

const Pages = {};

context.keys().forEach(async path => {
  const name = path.replace(/^.+\/([^/]+)\.js/, "$1");
  Pages[name] = context(path).then(comp => {
    console.log(comp.default.config.pathname);
  });
});