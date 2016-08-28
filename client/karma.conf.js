/*eslint-env node */
var webpack = require('webpack');
var path = require('path');
var webpackConfig = require('./webpack.dev');
webpackConfig.devtool = 'inline-source-map';

function pathAppTo() {
    return path.join( __dirname, 'src', 'app', path.join.apply( path, arguments ) );
}

module.exports = function (config) {
  config.set({
    browsers: ['Chrome'], // ['Chrome'] run in Chrome, 'PhantomJS'
    singleRun: true,
    frameworks: ['mocha', 'sinon'],
    files: [
      'src/**/*.spec.js'
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
        },{
            test: /\.json$/,
            loader: 'json'
          }
        ],
        postLoaders: [{
          test: /\.(js|jsx)$/, exclude: /(node_modules|tests)/,
          loader: 'istanbul-instrumenter'
      },
      {
          test: /\.css$/,
          loader: 'style-loader!css-loader'
      },
       {
           test: /\.styl$/,
           loader: "css-loader!stylus-loader"
       }]
       },
       plugins: [
         //new webpack.IgnorePlugin(/jsdom$/),
         new webpack.DefinePlugin( {
             __VERSION__: JSON.stringify('1.0')
         } )
      ],
      externals: {
        'react/addons': true,
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true
      },
      resolve: {
          root: path.join( __dirname, 'src', 'app'),
          extensions: [ '', '.js', '.jsx', '.styl', '.css', '.json'],
          alias: {
              //application aliases
              components: pathAppTo( 'components' ),
              services: pathAppTo( 'services' ),
              utils: pathAppTo( 'utils' ),
              parts: pathAppTo( 'parts' ),
              assets: path.resolve( __dirname, 'src', 'assets'),
              config: pathAppTo( 'config.js' )
          }
      }
    },
    webpackServer: {
      noInfo: true
    },
    coverageReporter: {
      reporters: [
         {
             type: 'text-summary'
         },
         {
             type: 'html',
             dir: 'coverage/'
         }
     ]
    }
  });
};
