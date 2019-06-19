/*eslint-env node */
process.env.CHROME_BIN = require('puppeteer').executablePath()

const _ = require("lodash");
const path = require("path");
const webpackConfig = require("./webpack.dev");

webpackConfig.devtool = "cheap-module-source-map";
module.exports = function (config) {

  const configuration = {
    browsers: ['Chrome_without_security'],
    customLaunchers: {
      Chrome_without_security: {
        base: 'ChromeHeadless',
        flags: [
          '--headless',
          '--ignore-certificate-errors',
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--window-size=1920,1080',
          "--disable-accelerated-2d-canvas",
          '--disable-dev-shm-usage',
          "--disable-gpu"
        ]
      }
    },
    singleRun: true,
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ["mocha", "sinon"],
    files: ["src/**/*.spec.{js,jsx,ts,tsx}"],
    preprocessors: {
      "src/**/*.js": ["webpack", "sourcemap"]
    },
    reporters: ["mocha", "coverage", 'junit'],
    junitReporter: {
      outputDir: 'coverage',
      outputFile: 'test-results.xml'
    },
    webpack: {
      mode: "development",
      module: {
        rules: [
          {
            test: /.(gif|png|woff(2)?|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
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
