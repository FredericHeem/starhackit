var path = require( 'path' );
var gulp = require( 'gulp' );
var gutil = require( 'gulp-util' );
var debug = require('gulp-debug');
var webpack = require( 'webpack' );
var gulpWebpack = require( 'webpack-stream' );
var WebpackDevServer = require( 'webpack-dev-server' );
var stylus = require( 'gulp-stylus' );
var clean = require( 'gulp-rimraf' );
var runSequence = require( 'run-sequence' );
var imagemin = require( 'gulp-imagemin' );

function handleError( task ) {
    return function ( err ) {
        this.emit( 'end' );
        gutil.log( 'Error handler for', task, err.toString() );
    };
}

// The development server (the recommended option for development)
gulp.task( 'default', [ 'webpack-dev-server', 'stylus:compile', 'build:cp' ] );

gulp.task( 'webpack-dev-server', function ( callback ) {
    var config = Object.create( require( './webpack.dev.js' ) );
    // Start a webpack-dev-server
    new WebpackDevServer( webpack( config ), {
        contentBase: path.join( __dirname, 'src' ),
        publicPath: config.output.publicPath,
        hot: true,
        historyApiFallback: true,
        stats: {
            colors: true
        },
        proxy: {
            '/api/v1/*': 'http://localhost:3000'
        }
    } ).listen( 8080, '0.0.0.0', function ( err ) {
            if ( err ) {
                throw new gutil.PluginError( 'webpack-dev-server', err );
            }
            gutil.log( '[webpack-dev-server]', 'http://localhost:8080' );
            callback();
        } );

    //setup stylus watcher
    gulp.watch( [ 'src/assets/stylus/*.styl', 'src/assets/stylus/**/*.styl' ], [ 'stylus:compile' ] );
} );

gulp.task( 'stylus:compile', function () {
    return gulp.src( './src/assets/stylus/main.styl' )
        .pipe( stylus().on( 'error', handleError( 'stylus:compile' ) ) )
        .pipe( gulp.dest( './src/assets' ) );
} );

gulp.task( 'clean', function () {
    return gulp.src( 'build/*', { read: false } )
        .pipe( clean() );
} );

gulp.task( 'build:image:min', function () {
    return gulp.src( './build/bundle/*.jpg' )
        .pipe( imagemin( {
            progressive: true,
            svgoPlugins: [ { removeViewBox: false } ]
        } ) )
        .pipe( gulp.dest( 'build/bundle' ) );
} );

gulp.task( 'build:cp', function () {
    return gulp.src( [
        './src/index.html',
        './src/favicon.png',
        './src/**/assets/img/*.png',
        './src/**/assets/img/*.jpg',
        './src/**/assets/img/*.svg'
    ] )
    .pipe(debug())
    .pipe( gulp.dest( 'build/' ) );
} );

gulp.task( 'build:webpack', function () {
    return gulp.src( 'src/app/app.js' )
        .pipe( gulpWebpack( require( './webpack.prod.js' ), webpack ) )
        .pipe( gulp.dest( 'build/bundle/' ) );
} );


gulp.task( 'build', function ( cb ) {
    runSequence(
        'clean',
        [ 'stylus:compile', 'build:cp' ],
        'build:webpack',
        'build:image:min',
        cb
    );
} );
