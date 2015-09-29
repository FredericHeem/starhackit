var path = require( 'path' );
var webpack = require( 'webpack' );

var webpackDevConfig = {
    overrides: {
        devtool: 'eval',
        debug: true,
        entry: {
            app: [
                'webpack-dev-server/client?http://localhost:8080',
                'webpack/hot/only-dev-server',
                './src/app/app.js'
            ]
        }
    },

    plugins: [
        new webpack.DefinePlugin( {
            'process.env': {
                NODE_ENV: JSON.stringify( 'development' )
            }
        } )
    ],

    loaders: [
        {
            test: /\.jsx?$/,
            loaders: [ 'react-hot', 'babel' ],
            include: path.join( __dirname, 'src', 'app' ),
            exclude: path.join( __dirname, 'node_modules' )
        }
    ]
};

module.exports = require( './webpack.config' )( webpackDevConfig );
