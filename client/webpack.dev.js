/*eslint-env node */
const path = require("path");
const webpack = require("webpack");

const webpackDevConfig = {
  
  overrides: {
    mode: "development",
    entry: {
      app: [
        "webpack-hud",
        "./src/index.js"
      ]
    }
  },

  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("development")
      }
    }),
  ],

  rules: [
    {
      test: /\.jsx?$/,
      use: ["babel-loader", "eslint-loader"],
      include: path.join(__dirname, "src"),
      exclude: path.join(__dirname, "node_modules")
    }
  ],
  eslint: {
    emitWarning: true
  }
};

module.exports = require("./webpack.config")(webpackDevConfig);
