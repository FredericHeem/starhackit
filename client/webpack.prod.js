/*eslint-env node */
const path = require("path");
const webpack = require("webpack");
const CompressionPlugin = require("compression-webpack-plugin");
const CleanPlugin = require("clean-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const webpackProdConfig = {
  overrides: {
    mode: "production",
    entry: {
      app: ["./src/index.js"]
    },
    output: {
      path: path.join(__dirname, "dist"),
      filename: "[name].[hash].js"
    }
  },

  plugins: [
    new CleanPlugin(["./dist"]),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || "production")
      }
    }),

    new CompressionPlugin({
      asset: "[file].gz[query]",
      algorithm: "gzip",
      threshold: 10240,
      minRatio: 0.8
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: "static"
    })
  ],

  rules: [
    {
      test: /\.jsx?$/,
      use: ["babel-loader"],
      include: path.join(__dirname, "src"),
      exclude: path.join(__dirname, "node_modules")
    }
  ]
};

module.exports = require("./webpack.config")(webpackProdConfig);
