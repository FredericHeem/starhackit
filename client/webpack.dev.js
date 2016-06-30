var path = require( 'path' );
var webpack = require( 'webpack' );
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var pkg = require('./package.json');

var webpackDevConfig = {
    overrides: {
        devtool: 'eval',
        debug: true,
        entry: {
            app: [
                'webpack-dev-server/client?http://localhost:8080',
                'webpack/hot/only-dev-server',
                './node_modules/babel-polyfill/lib/index.js',
                './src/app/index.js'
            ]
        }
    },

    plugins: [
        new webpack.DefinePlugin( {
            'process.env': {
                NODE_ENV: JSON.stringify( 'development' )
            }
        } ),
        new OpenBrowserPlugin({ url: 'http://localhost:8080' })
    ],

    loaders: [
        {
            test: /\.jsx?$/,
            loaders: [ 'react-hot', 'babel', 'eslint'],
            include: path.join( __dirname, 'src', 'app' ),
            exclude: path.join( __dirname, 'node_modules' )
        }
    ],
    eslint: {
      emitWarning: true
    }
};

module.exports = require( './webpack.config' )( webpackDevConfig );
