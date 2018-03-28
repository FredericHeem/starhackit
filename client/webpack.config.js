/*eslint-env node */
const _ = require("lodash");
const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
//const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");

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
        historyApiFallback: true,
        stats: "minimal",
        proxy: {
          "/api/v1/*": "http://localhost:9000"
        },
        host: "0.0.0.0",
        port: 8080
      },
      entry: {},
      output: {},
      plugins: [
        new HtmlWebpackPlugin({
          template: "src/index.ejs",
          title: pkg.title,
          inject: false,
          description: pkg.description
        }),
        new webpack.DefinePlugin({
          __VERSION__: JSON.stringify(pkg.version)
        }),
        new CopyWebpackPlugin([
          { from: "./src/favicon.ico" },
          { from: "./locales/**/*.json" }
        ]),
        new MiniCssExtractPlugin({
          filename: "[name].css",
          chunkFilename: "[id].css"
        })
        /*
            new LodashModuleReplacementPlugin({
              cloning: true,
              collections: true,
              paths: true
            }),

            */
      ],
      resolve: {
        modules: ["src", "node_modules"],
        extensions: [".js", ".jsx", ".css"],
        alias: {
          react: "preact-compat",
          "react-dom": "preact-compat",
          "mobx-react": "mobx-preact",
          "create-react-class": "preact-compat/lib/create-react-class",
          glamorous: "glamorous/dist/glamorous.esm.tiny.js"
        }
      },
      module: {
        rules: [
          {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, "css-loader"]
          },

          {
            test: /.(gif|png|woff(2)?|eot|ttf|svg)(\?[a-z0-9=\.]+)?$/,
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
