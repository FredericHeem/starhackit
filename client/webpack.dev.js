/*eslint-env node */
const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const webpackDevConfig = {
  overrides: {
    mode: "development",
    entry: {
      micro: ["./src/app_micro/index.js"],
      public: ["./src/app_public/index.js"],
      user: ["./src/app_user/index.js"],
      admin: ["./src/app_admin/index.js"],
    },
  },

  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("development"),
      },
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
  eslint: {
    emitWarning: true,
  },
};

module.exports = require("./webpack.config")(webpackDevConfig);
