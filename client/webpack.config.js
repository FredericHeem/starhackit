/*eslint-env node */
const _ = require("lodash");
const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const pkg = require("./package.json");

module.exports = function(options) {
  const config = _.merge(
    {},
    {
      devServer: {
        contentBase: path.join(__dirname, "src"),
        publicPath: "/",
        hot: true,
        inline: true,
        historyApiFallback: {
          rewrites: [
            { from: /^\/$/, to: '/index.html' },
            { from: /^\/user/, to: '/user/index.html' },
            { from: /^\/admin/, to: '/admin/index.html' }
          ]
        },
        stats: "minimal",
        proxy: {
          "/api/v1/*": "http://localhost:9000"
        },
        host: "0.0.0.0",
        port: 8080
      },
      entry: {},
      output: {
        publicPath: "/"
      },
      plugins: [
        new HtmlWebpackPlugin({
          template: "src/index.ejs",
          title: pkg.title,
          chunks: ['public'],
          inject: false,
          description: pkg.description
        }),
        new HtmlWebpackPlugin({
          template: "src/index.ejs",
          title: pkg.title,
          chunks: ['user'],
          inject: false,
          filename: 'user/index.html',
          description: pkg.description
        }),
        new HtmlWebpackPlugin({
          template: "src/index.ejs",
          title: pkg.title,
          inject: false,
          chunks: ['admin'],
          filename: 'admin/index.html'
        }),
        new webpack.DefinePlugin({
          __VERSION__: JSON.stringify(process.env.BUILD_VERSION || pkg.version)
        }),
        new CopyWebpackPlugin([
          { from: "./src/favicon.ico" },
          { from: "./locales/**/*.json" }
        ]),
        new MiniCssExtractPlugin({
          filename: "[name].css",
          chunkFilename: "[id].css"
        })
      ],
      resolve: {
        modules: ["src", "node_modules"],
        extensions: [".mjs", ".js", ".jsx", ".ts", ".tsx"],
        alias: {
          "src": path.resolve('./src')
        }
      },
      module: {
        rules: [
          {
            test: /.(gif|png|woff(2)?|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
            use: ["url-loader"]
          },
          {
            test: /\.jpg/,
            use: ["file-loader"]
          }
        ]
      }
    },
    options.overrides
  );

  config.module.rules = _.union(config.module.rules, options.rules);
  config.plugins = _.union(config.plugins, options.plugins);
  return config;
};
