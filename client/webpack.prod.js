/*eslint-env node */
var path = require( 'path' );
var webpack = require( 'webpack' );
var CompressionPlugin = require('compression-webpack-plugin');
var CleanPlugin = require('clean-webpack-plugin');
var purify = require("purifycss-webpack-plugin");

var webpackProdConfig = {
    overrides: {
        entry: {
            app: [
                './src/app/index.js'
            ]
        },
        output: {
            path: path.join( __dirname, 'build' ),
            filename: '[name].[hash].js'
        }
    },

    plugins: [
        new CleanPlugin(['./build']),
        new webpack.DefinePlugin( {
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production')
            }
        } ),
        new purify({
            basePath: __dirname
        }),
        new webpack.optimize.DedupePlugin(),

        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new CompressionPlugin({
            asset: '[file].gz[query]',
            algorithm: 'gzip',
            threshold: 10240,
            minRatio: 0.8
        })
    ],

    loaders: [
        {
            test: /\.jsx?$/,
            loaders: [ 'babel' ],
            include: path.join( __dirname, 'src', 'app' ),
            exclude: path.join( __dirname, 'node_modules' )
        }
    ]
};

module.exports = require( './webpack.config' )( webpackProdConfig );
