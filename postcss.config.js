const pkg = require("./package.json");
module.exports = (api) => {
  return {
    // You can specify any options from https://postcss.org/api/#processoptions here
    plugins: [
      require("postcss-import"),
      require("postcss-preset-env")({
        /* stage 2 features + features object */
        stage: 1,
        /* List of all features - https://cssdb.org/features */
        // Postcss specific feature id - https://github.com/csstools/postcss-preset-env/blob/master/src/lib/plugins-by-id.js#L36
        features: {
          "nesting-rules": true,
          "color-functional-notation": true,
          "custom-media-queries": true,
          "any-link-pseudo-class": true
        },
        browsers: pkg.browserslist[api.env],
        autoprefixer: {
          flexbox: "no-2009",
          grid: "autoplace"
        },
      }),
      // api.env === "development" &&
      require("cssnano")(
        {
          preset: [
            "default",
            {
              // List of all optimizations: https://github.com/cssnano/cssnano/blob/master/packages/cssnano-preset-default/src/index.js#L47
              discardComments: { removeAll: true },
            },
          ],
        })
      ,
    ].filter(Boolean),
  };
};