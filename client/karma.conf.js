/*eslint-env node */
const _ = require("lodash");
const path = require("path");
const webpackConfig = require("./webpack.dev");
const webpackConfigProd = require("./webpack.prod");

webpackConfig.devtool = "cheap-module-source-map";
module.exports = function(config) {

  const configuration = {
    browsers: ["Chrome"], // ['Chrome'] run in Chrome, 'PhantomJS'
    singleRun: true,
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ["mocha", "sinon"],
    files: ["src/**/*.spec.js"],
    preprocessors: {
      "src/**/*.js": ["webpack", "sourcemap"]
    },
    reporters: ["mocha", "coverage"],
    webpack: {
      mode: "development",
      module: {
        rules: [
          {
            test: /.(gif|png|woff(2)?|eot|ttf|svg)(\?[a-z0-9=\.]+)?$/,
            use: ["url-loader"]
          },
          {
            test: /\.css$/,
            use: ["css-loader"]
          },
          {
            test: /\.(js|jsx|ts|tsx)$/,
            use: ["ts-loader"],
            include: path.join(__dirname, "src"),
            exclude: path.join(__dirname, "node_modules")
          }
        ]
      },
      plugins: webpackConfig.plugins,
      externals: {
        "react/addons": true,
        "react/lib/ExecutionEnvironment": true,
        "react/lib/ReactContext": true
      },
      resolve: webpackConfig.resolve
    },
    webpackServer: {
      noInfo: true
    },
    coverageReporter: {
      reporters: [
        {
          type: "text-summary"
        },
        {
          type: "html",
          dir: "coverage/"
        }
      ]
    },
    customLaunchers: {
      Chrome_travis_ci: {
        base: "Chrome",
        flags: ["--no-sandbox"]
      }
    }
  };

  if (process.env.TRAVIS) {
    configuration.browsers = ["Chrome_travis_ci"];
  }
  config.set(configuration);
};
