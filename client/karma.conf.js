/*eslint-env node */
const _ = require("lodash");
const webpackConfig = require("./webpack.dev");
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
      module: {
        rules: webpackConfig.module.rules
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
