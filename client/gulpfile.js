var path = require( 'path' );
var gulp = require( 'gulp' );
var gutil = require( 'gulp-util' );
var debug = require('gulp-debug');
var webpack = require( 'webpack' );
var gulpWebpack = require( 'webpack-stream' );
var WebpackDevServer = require( 'webpack-dev-server' );
var clean = require( 'gulp-rimraf' );
var runSequence = require( 'run-sequence' );
var imagemin = require( 'gulp-imagemin' );
var exec = require('child_process').exec;

function handleError( task ) {
    return function ( err ) {
        this.emit( 'end' );
        gutil.log( 'Error handler for', task, err.toString() );
    };
}

// The development server (the recommended option for development)
gulp.task( 'default', [ 'webpack-dev-server', 'build:cp' ] );

gulp.task( 'webpack-dev-server', function ( callback ) {
    var config = require( './webpack.dev.js' );
    var devServer = config.devServer;
    // Start a webpack-dev-server
    new WebpackDevServer( webpack( config ), devServer)
    .listen( devServer.port, devServer.host, function ( err ) {
            if ( err ) {
                throw new gutil.PluginError( 'webpack-dev-server', err );
            }
            gutil.log( '[webpack-dev-server]', 'port ' + devServer.port);
            callback();
        } );

} );

gulp.task('selenium:install', function(cb){
  var env = process.env.NODE_ENV || 'development';
  if(env === 'development'){
    return exec('webdriver-manager update', function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb(err);
    });
  }
});

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
        'build:cp',
        'build:webpack',
        'build:image:min',
        cb
    );
} );
