var _ = require( 'lodash' );
var path = require( 'path' );
var webpack = require( 'webpack' );

var pathAppTo;

function pathTo() {
    return path.join( __dirname, 'src', path.join.apply( path, arguments ) );
}

pathAppTo = _.partial( pathTo, 'app' );

module.exports = function ( options ) {
    var config = _.merge( {}, {
        entry: {
            vendor: [
                'bootstrap/dist/js/bootstrap.min.js',
                'assets/css/bootstrap-cosmo.css',
                'assets/css/animate.css',
                'font-awesome/css/font-awesome.min.css',
                'assets/css/filepicker.css',
                'checkit',
                'classnames',
                'debug',
                'events',
                'jquery',
                'lib/animatedModal.js',
                'lib/growl.js',
                'bootstrap-markdown/js/bootstrap-markdown',
                'load-script',
                'lodash',
                'marked',
                'moment',
                'react',
                'react-bootstrap',
                'react-cookie',
                'react-ga',
                'react-doc-meta',
                'react-ladda/node_modules/ladda/dist/ladda.min.css',
                'react-portal',
                'react-select/dist/react-select.min.css',
                'react-router',
                'react-textarea-autosize',
                'reflux',
                'url',
                'when'
            ]
        },

        output: {
            path: path.join( __dirname, 'bundle' ),
            filename: 'app.js',
            publicPath: '/bundle/'
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoErrorsPlugin(),
            new webpack.ProvidePlugin( {
                jQuery: 'jquery',
                $: 'jquery',
                'window.jQuery': 'jquery'
            } ),
            new webpack.ProvidePlugin( {
                React: 'react',
                'window.React': 'react'
            } ),
            new webpack.optimize.CommonsChunkPlugin( 'vendor', 'vendor.js' )
        ],
        resolve: {
            extensions: [ '', '.js', '.jsx' ],
            alias: {
                //application aliases
                actions: pathAppTo( 'actions' ),
                components: pathAppTo( 'components' ),
                lib: pathAppTo( 'lib' ),
                mixins: pathAppTo( 'mixins' ),
                modals: pathAppTo( 'modals' ),
                models: pathAppTo( 'models' ),
                resources: pathAppTo( 'resources' ),
                services: pathAppTo( 'services' ),
                stores: pathAppTo( 'stores' ),
                views: pathAppTo( 'views' ),
                utils: pathAppTo( 'utils' ),
                parts: pathAppTo( 'parts' ),

                assets: pathTo( 'assets' ),
                config: pathAppTo( 'config.js' ),

                //vendor aliases
                jquery: 'jquery/dist/jquery.min.js'
            }
        },
        module: {
            loaders: [
                { test: /\.css$/, loader: 'style-loader!css-loader' },
                { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
                { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' },
                {
                    test: /\.jpg|\.png|\.mp3/,
                    loader: 'file-loader'
                }

            ]
        },
        resolveLoader: {
            root: path.join( __dirname, 'node_modules' )
        }
    }, options.overrides );

    config.module.loaders = _.union( config.module.loaders, options.loaders );
    config.plugins = _.union( config.plugins, options.plugins );

    return config;
};
