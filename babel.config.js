const pkg = require("./package.json");
const config = (api) => {
  console.log(api.env());
  api.cache.using(() => process.env.NODE_ENV);
  return {
    sourceType: "unambiguous",
    presets: [
      // features enabled by default: https://github.com/babel/babel/blob/main/packages/babel-compat-data/scripts/data/plugin-features.js
      ["@babel/env", {
        modules: false,
        targets: {
          browsers: pkg.browserslist[api.env()],
        },
      }]
    ],
    plugins: ["@babel/plugin-transform-runtime"],
    ignore: ["node_modules", "build"]
  }
}

module.exports = config;
