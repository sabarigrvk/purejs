const { resolve } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const svgToMiniDataURI = require('mini-svg-data-uri');

module.exports = (_env, { mode = 'production' }) => {
  const isProd = mode === 'production',
    isDev = !isProd;

  return {
    mode,
    entry: {
      app: resolve(__dirname, 'src/index.js')
    },
    output: {
      path: resolve(__dirname, 'dist'),
      chunkFilename: isProd ? '[name].[chunkhash:8].js': '[name].js',
      filename: isProd ? '[name].[contenthash].js' : '[name].js',
      assetModuleFilename: 'assets/[name].[hash:8].[ext]'
    },
    devtool: isDev ? 'source-map' : 'inline-cheap-module-source-map',
    module: {
      parser: {
        javascript: {
          importMetaContext: true,
        },
      },
      rules: [
        {
          test: /\.html$/i,
          use: ['html-loader'],
        },
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: isDev,
              envName: mode,
              babelrc: false
            }
          }
        },
        {
          test: /\.css$/,
          exclude: /\.module\.css$/,
          use: [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            },
            {
              loader: 'postcss-loader',
              options: {}
            }
          ]
        },
        {
          test: /\.module\.css$/,
          include: /\.module.css$/,
          use: ['raw-loader', {
            loader: 'postcss-loader'
          }],
        },
        {
          test: /\.(png|jpe?g|gif)$/,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 20 * 1024 // 20kb
            }
          }
        },
        {
          test: /\.svg$/,
          type: 'asset',
          generator: {
            dataUrl: (content) => {
              if (typeof content !== 'string') {
                content = content.toString();
              }

              return svgToMiniDataURI(content);
            }
          }
        },
        {
          test: /\.(woff(2)?|ttf|eot)$/,
          type: 'asset/resource'
        }
      ]
    },
    plugins: [
      isProd &&
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
        chunkFilename: '[name].[contenthash].css'
      }),
      new HtmlWebpackPlugin({
        hash: true,
        filename: 'index.html',
        inject: true,
        template: resolve(__dirname, 'src/index.html')
      })
    ].filter(Boolean),
    devServer: {
      open: true,
      port: 4000,
      https: false,
      hot: true,
      liveReload: true,
      historyApiFallback: true
    },
    resolve: {
      alias: {}
    },
    stats: {
      errorDetails: true
    }
  };
};
