var path = require( 'path' );
var gulp = require( 'gulp' );
var gutil = require( 'gulp-util' );
var webpack = require( 'webpack' );
var gulpWebpack = require( 'webpack-stream' );
var WebpackDevServer = require( 'webpack-dev-server' );
var clean = require( 'gulp-rimraf' );
var runSequence = require( 'run-sequence' );
var exec = require('child_process').exec;

gulp.task( 'default', [ 'webpack-dev-server'] );
gulp.task( 'build', [ 'build:webpack'] );

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

gulp.task( 'build:webpack', function () {
    return gulp.src( 'src/app/app.js' )
        .pipe( gulpWebpack( require( './webpack.prod.js' ), webpack ) )
        .pipe( gulp.dest( 'build/' ) );
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
