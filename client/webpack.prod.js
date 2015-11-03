var path = require( 'path' );
var webpack = require( 'webpack' );
var CompressionPlugin = require('compression-webpack-plugin');

var webpackProdConfig = {
    overrides: {
        entry: {
            app: [
                './src/app/app.js'
            ]
        }
    },

    plugins: [
        new webpack.DefinePlugin( {
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production')
            }
        } ),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        new CompressionPlugin({
            asset: '{file}.gz',
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
