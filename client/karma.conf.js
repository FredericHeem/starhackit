var webpack = require('webpack');
var webpackConfig = require('./webpack.dev');
webpackConfig.devtool = 'inline-source-map';

module.exports = function (config) {
  config.set({
    browsers: ['PhantomJS'], // ['Chrome'] run in Chrome
    singleRun: true,
    frameworks: ['mocha', 'sinon'],
    files: [
      'src/**/*.spec.js'
    ],
    plugins: ['karma-chrome-launcher', 'karma-phantomjs-launcher', 'karma-chai', 'karma-mocha', 'karma-sinon',
      'karma-sourcemap-loader', 'karma-webpack', 'karma-coverage', 'karma-mocha-reporter'
    ],
    preprocessors: {
      'src/**/*.js': ['webpack', 'sourcemap']
    },
    reporters: ['mocha', 'coverage'],
    webpack: {
      module: {
        loaders: [{
          test: /\.(js|jsx)$/, exclude: /(node_modules)/,
          loader: 'babel-loader'
        }],
        postLoaders: [{
          test: /\.(js|jsx)$/, exclude: /(node_modules|tests)/,
          loader: 'istanbul-instrumenter'
      },
       {
           test: /\.styl$/,
           loader: "css-loader!stylus-loader"
       }]
       },
      externals: {
        cheerio: 'window',
        'react/addons': true,
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true
      }
    },
    webpackServer: {
      noInfo: true
    },
    coverageReporter: {
      type: 'html',
      dir: 'coverage/'
    }
  });
};
