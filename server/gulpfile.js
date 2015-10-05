var path = require( 'path' );
var gulp = require( 'gulp' );
var nodemon = require( 'gulp-nodemon' );
var runSequence = require( 'run-sequence' );
var clean = require( 'gulp-clean' );
var connect = require('gulp-connect');
var babel = require('gulp-babel');

var paths = {
  scripts: ['src/**/*.js'],
  build: 'build'
};

gulp.task( 'default', [ 'watch', 'run', 'server:images' ] );

gulp.task('build', ['cp:fixtures'], function () {
    return gulp.src(paths.scripts)
        .pipe(babel({ stage: 1, optional: ["runtime"] }))
        .pipe(gulp.dest(paths.build));
});

gulp.task( 'build:production', function ( done ) {
    runSequence(
        'clean:build',
        'cp:assets',
        'cp:fixtures',
        'build',
        done
    );
} );

gulp.task( 'build:watch', function ( done ) {
    runSequence(
        'build',
        'cp:assets',
        'cp:fixtures',
        done
    );
} );

gulp.task( 'clean:build', function () {
    return gulp.src( 'build/*', { read: false } )
        .pipe( clean() );
} );

gulp.task( 'cp:assets', function () {
    return gulp.src( [
        './package.json', './src/models/fixtures/*.json'
    ] )
    .pipe( gulp.dest( 'build/' ) );
} );
gulp.task( 'cp:fixtures', function () {
    return gulp.src( [
        './src/models/fixtures/*.json'
    ] )
    .pipe( gulp.dest( 'build/models/fixtures' ) );
} );

gulp.task( 'watch', [ 'build' ], function () {
  gulp.watch(paths.scripts, ['build:watch']);
} );

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
