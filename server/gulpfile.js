var path = require( 'path' );
var gulp = require( 'gulp' );
var nodemon = require( 'gulp-nodemon' );
var runSequence = require( 'run-sequence' );
var clean = require( 'gulp-rimraf' );
var connect = require('gulp-connect');
var babel = require('gulp-babel');
var debug = require('gulp-debug');

var paths = {
  scripts: ['src/**/*.js'],
  build: 'build'
};

gulp.task( 'default', [ 'watch', 'run', 'server:images' ] );

gulp.task('build', function () {
    return gulp.src(paths.scripts)
        .pipe(babel())
        .pipe(gulp.dest(paths.build));
});

gulp.task( 'build:production', function ( done ) {
    runSequence(
        'clean',
        'build',
        'cp:assets',
        done
    );
} );

gulp.task( 'build:watch', function ( done ) {
    runSequence(
        'build',
        'cp:assets',
        done
    );
} );

gulp.task( 'clean', function () {
    return gulp.src( ['build/*', 'coverage'], { read: false } )
        .pipe( clean() );
} );

gulp.task( 'cp:assets', function () {
    return gulp.src( [
        './package.json', './src/**/*.html', './src/**/*.json'
    ] )
    .pipe(debug())
    .pipe( gulp.dest( 'build/' ) );
} );

gulp.task( 'watch', [ 'build' ], function () {
  gulp.watch(paths.scripts, ['build:watch']);
} );

gulp.task( 'run', ['build', 'cp:assets'], function () {
    nodemon( {
        verbose: true,
        execMap: {
            js: 'node'
        },
        script: path.join( __dirname, 'build/index' ),
        watch:['build/package.json'],

    } ).on( 'restart', function () {
        console.log( 'nodemon restarted!' );
    } ).on('start', function () {
        console.log( 'nodemon started!' );
    }).on('change', function () {
        console.log( 'nodemon change' );
    });
} );

gulp.task( 'server:images', function () {
    connect.server({
        root: '../uploads',
        host: '0.0.0.0',
        port: 4000
    });
} );
