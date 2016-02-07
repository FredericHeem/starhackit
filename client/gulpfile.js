var path = require( 'path' );
var gulp = require( 'gulp' );
var clean = require( 'gulp-rimraf' );
var exec = require('child_process').exec;

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
