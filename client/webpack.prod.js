/*eslint-env node */
const path = require("path");
const webpack = require("webpack");
const CompressionPlugin = require("compression-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const webpackProdConfig = {
  overrides: {
    mode: "production",
    entry: {
      //micro: ["./src/app_micro/index.js"],
      //public: ["./src/app_public/index.js"],
      user: ["./src/app_user/index.js"],
      admin: ["./src/app_admin/index.js"],
    },
    output: {
      path: path.join(__dirname, "dist"),
      filename: "[name].[hash].js",
    },
  },

  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || "production"),
      },
    }),

    new CompressionPlugin({
      filename: "[file].gz[query]",
      algorithm: "gzip",
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
    }),
  ],

  rules: [
    {
      test: /\.css$/,
      use: [MiniCssExtractPlugin.loader, "css-loader"],
    },
    {
      test: /\.(js|jsx|ts|tsx)$/,
      use: ["ts-loader"],
      include: path.join(__dirname, "src"),
      exclude: path.join(__dirname, "node_modules"),
    },
  ],
};

module.exports = require("./webpack.config")(webpackProdConfig);
