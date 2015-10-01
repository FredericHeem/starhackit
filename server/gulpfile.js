var path = require( 'path' );
var gulp = require( 'gulp' );
var webpack = require( 'webpack' );
var nodemon = require( 'gulp-nodemon' );
var mocha = require( 'gulp-mocha' );
var runSequence = require( 'run-sequence' );
var clean = require( 'gulp-clean' );
var connect = require('gulp-connect');
var babel = require('gulp-babel');

var devWebpackConfig = require( './webpack.dev' );
var testWebpackConfig = require( './webpack.test' );
var prodWebpackConfig = require( './webpack.prod' );

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
/*
gulp.task( 'build', function ( done ) {
    webpack( devWebpackConfig ).run( onBuild( done ) );
} );
*/
gulp.task( 'build:production', function ( done ) {
    runSequence(
        'clean:build',
        'cp:assets',
        'build:webpack:production',
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

gulp.task( 'build:test', function ( done ) {
    webpack( testWebpackConfig ).run( onBuild( done ) );
} );


gulp.task( 'build:webpack:production', function ( done ) {
    webpack( prodWebpackConfig ).run( onBuild( done ) );
} );

gulp.task( 'clean:build', function () {
    return gulp.src( 'build/*', { read: false } )
        .pipe( clean() );
} );

gulp.task( 'cp:assets', function () {
    return gulp.src( [
        './package.json'
    ] )
        .pipe( gulp.dest( 'build/' ) );
} );

gulp.task( 'watch', [ 'build' ], function () {
  gulp.watch(paths.scripts, ['build:watch']);
} );
/*
gulp.task( 'watch', [ 'build' ], function () {
    return webpack( devWebpackConfig ).watch( 250, function ( err, stats ) {
        onBuild()( err, stats );
        nodemon.restart();
    } );
} );
*/
gulp.task( 'run', ['build'], function () {
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

gulp.task( 'test', [ 'build:test' ], function () {
    return gulp.src( path.join( __dirname, 'test.build/api.js' ), { read: false } )
        .pipe( mocha( { reporter: 'spec' } ) )
        .once( 'end', process.exit.bind( process ) );
} );


function onBuild( done ) {
    return function ( err, stats ) {
        if ( err ) {
            console.log( 'Error', err );
        }
        else {
            console.log( stats.toString() );
        }
        if ( done ) {
            done();
        }
    };
}
