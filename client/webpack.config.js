/*eslint-env node */
var _ = require( 'lodash' );
var path = require( 'path' );
var webpack = require( 'webpack' );
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
var XhrEvalChunkPlugin = require('xhr-eval-chunk-webpack-plugin').default;

var pkg = require('./package.json');

var pathAppTo;

function pathTo() {
    return path.join( __dirname, 'src', path.join.apply( path, arguments ) );
}

pathAppTo = _.partial( pathTo, 'app' );

module.exports = function ( options ) {
    var config = _.merge( {}, {
        devServer: {
            contentBase: path.join( __dirname, 'src' ),
            publicPath: '/',
            hot: true,
            inline: true,
            historyApiFallback: true,
            stats: 'minimal',
            proxy: {
                '/api/v1/*': 'http://localhost:9000'
            },
            host: '0.0.0.0',
            port: 8080
        },
        entry: {
        },

        output: {
            path: path.join( __dirname, 'build' ),
            filename: '[name].js'
        },
        plugins: [
            new XhrEvalChunkPlugin(),
            new HtmlWebpackPlugin({
              template: 'src/index.ejs',
              title: pkg.title,
              inject: false,
              description: pkg.description
            }),
            new webpack.DefinePlugin( {
                __VERSION__: JSON.stringify(pkg.version)
            } ),


            new CopyWebpackPlugin([
                { from: './src/favicon.ico' },
                { from: './locales/**/*.json' }
            ]),
            new LodashModuleReplacementPlugin({
              cloning: true,
              collections: true,
              paths: true
            }),

            new webpack.NamedModulesPlugin(),
        ],
        resolve: {
            modules: [
              "src",
              "node_modules"
            ],
            extensions: ['.js', '.jsx', 'css' ],
            alias: {
                'react': 'preact-compat',
                'react-dom': 'preact-compat',
                'create-react-class': 'preact-compat/lib/create-react-class',
                'glamorous': 'glamorous/dist/glamorous.esm.tiny.js',
                //application aliases
                components: pathAppTo( 'components' ),
                utils: pathAppTo( 'utils' ),
                services: pathAppTo( 'services' ),
                parts: pathAppTo( 'parts' ),
                assets: pathTo( 'assets' ),
                icons: pathAppTo( 'icons' ),
                config: pathAppTo( 'config.js' )
            }
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                      'style-loader',
                      'css-loader'
                    ]
                },
                {
                    test: /.(gif|png|woff(2)?|eot|ttf|svg)(\?[a-z0-9=\.]+)?$/,
                    use: ['url-loader']
                },
                {
                    test: /\.jpg/,
                    use: ['file-loader']
                }
            ]
        }
    }, options.overrides );

    config.module.rules = _.union( config.module.rules, options.rules );
    config.plugins = _.union( config.plugins, options.plugins );
    return config;
};
