/*eslint-env node */
var path = require( 'path' );
var webpack = require( 'webpack' );
var CompressionPlugin = require('compression-webpack-plugin');
var CleanPlugin = require('clean-webpack-plugin');
var purify = require("purifycss-webpack-plugin");

var webpackProdConfig = {
    overrides: {
        devtool: 'source-map',
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

        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true
        }),
        new CompressionPlugin({
            asset: '[file].gz[query]',
            algorithm: 'gzip',
            threshold: 10240,
            minRatio: 0.8
        })
    ],

    rules: [
        {
            test: /\.jsx?$/,
            use: [ 'babel-loader' ],
            include: path.join( __dirname, 'src'),
            exclude: path.join( __dirname, 'node_modules' )
        }
    ]
};

module.exports = require( './webpack.config' )( webpackProdConfig );
