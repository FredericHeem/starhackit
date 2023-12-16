/*eslint-env node */
const _ = require("lodash");
const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const pkg = require("./package.json");

module.exports = function (options) {
  const config = _.merge(
    {},
    {
      target: "web",
      devServer: {
        open: true,
        hot: true,
        historyApiFallback: {
          rewrites: [
            { from: /^\/$/, to: "/index.html" },
            { from: /^\/user/, to: "/user/index.html" },
            { from: /^\/admin/, to: "/admin/index.html" },
            { from: /^\/public/, to: "/public/index.html" },
          ],
        },
        proxy: {
          "/api/v1/*": "http://localhost:9000",
        },
        host: "0.0.0.0",
        port: 8080,
      },
      entry: {},
      output: {
        publicPath: "/",
      },
      plugins: [
        new HtmlWebpackPlugin({
          template: "src/index.ejs",
          title: pkg.title,
          chunks: ["micro"],
          description: pkg.description,
          filename: "index.html",
        }),
        new HtmlWebpackPlugin({
          template: "src/index.ejs",
          title: pkg.title,
          chunks: ["public"],
          description: pkg.description,
          filename: "public/index.html",
        }),
        new HtmlWebpackPlugin({
          template: "src/index.ejs",
          title: pkg.title,
          chunks: ["user"],
          filename: "user/index.html",
          description: pkg.description,
        }),
        new HtmlWebpackPlugin({
          template: "src/index.ejs",
          title: pkg.title,
          chunks: ["admin"],
          filename: "admin/index.html",
        }),
        new webpack.DefinePlugin({
          __VERSION__: JSON.stringify(pkg.version),
        }),
        new CopyWebpackPlugin({
          patterns: [
            { from: "./src/favicon.ico" },
            { from: "./locales/**/*.json" },
            { from: "./assets/**/*" },
          ],
        }),
        new MiniCssExtractPlugin({
          filename: "[name].css",
          chunkFilename: "[id].css",
        }),
      ],
      resolve: {
        modules: ["src", "node_modules"],
        extensions: [".mjs", ".js", ".jsx", ".ts", ".tsx"],
        alias: {
          src: path.resolve("./src"),
        },
      },
      module: {
        rules: [
          {
            test: /.(gif|png|woff(2)?|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
            use: ["url-loader"],
          },
          {
            test: /\.jpg/,
            use: ["file-loader"],
          },
        ],
      },
    },
    options.overrides
  );

  config.module.rules = _.union(config.module.rules, options.rules);
  config.plugins = _.union(config.plugins, options.plugins);
  return config;
};
