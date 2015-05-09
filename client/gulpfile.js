"use strict";

// Include Gulp and other build automation tools and utilities
// See: https://github.com/gulpjs/gulp/blob/master/docs/API.md
var gulp = require("gulp");
var $ = require("gulp-load-plugins")();
var del = require("del");
var path = require("path");
var runSequence = require("run-sequence");
var webpack = require("webpack");
var argv = require("minimist")(process.argv.slice(2));

// Settings
var DEST = "./build";                         // The build output folder
var RELEASE = !!argv.release;                 // Minimize and optimize during a build?
var AUTOPREFIXER_BROWSERS = [                 // https://github.com/ai/autoprefixer
  "ie >= 8",
  "ie_mob >= 10",
  "ff >= 24",
  "chrome >= 20",
  "safari >= 6",
  "opera >= 12",
  "ios >= 6",
  "bb >= 10",
  "Android 2.3",
  "Android >= 4"
];

// Gulp src wrapper, see: https://gist.github.com/floatdrop/8269868
gulp.plumbedSrc = function () {
  return gulp.src.apply(gulp, Array.prototype.slice.call(arguments))
    .pipe($.plumber());
};

var src = {};
var watch = false;

// The default task
gulp.task("default", ["watch"]);

// Clean up
gulp.task("clean", del.bind(null, [DEST]));

//HTML
gulp.task('html', function() {
    return gulp.src('src/*.html')
        //.pipe($.useref())
        .pipe(gulp.dest(DEST))
        .pipe($.size());
});

// Static files
gulp.task("assets", function () {
  src.assets = "assets/**";
  return gulp.src(src.assets)
    .pipe($.changed(DEST))
    .pipe(gulp.dest(DEST))
    .pipe($.size({title: "assets"}));
});

gulp.task("libraries", function() {
  var src = [
    "bower_components/jquery/dist/jquery.min.js",
    "bower_components/jquery/dist/jquery.min.map",
    "bower_components/foundation/js/foundation.min.js",
    "bower_components/modernizr/modernizr.js",
    "bower_components/fastclick/lib/fastclick.js",
    "./vendor/zxcvbn.js"
  ];
  return gulp.src(src)
    .pipe(gulp.dest("build/js/vendor"));
});

gulp.task("fonts", function() {
  // Move and minify font css
  gulp.src("bower_components/mdi/css/materialdesignicons.css")
    .pipe($.if(RELEASE, $.minifyCss()))
    .pipe(gulp.dest("build/css"));

  gulp.src("bower_components/mdi/css/materialdesignicons.css.map")
  .pipe(gulp.dest("build/css"));
  
  // Move font files
  gulp.src("bower_components/mdi/fonts/*.*")
    .pipe(gulp.dest("build/fonts"));
});

gulp.task("vendor", ["libraries", "fonts"]);

gulp.task("styles", ["sass-styles", "mui-styles"]);

// Combine language bundles
gulp.task("languageBundles", ["language_en"]);

gulp.task("language_en", function() {
  gulp.src("./src/**/locale_en.json")
    .pipe($.extend("app.json"))
    .pipe(gulp.dest("build/locales/en/"));
});

// CSS style sheets
gulp.task("sass-styles", function () {
  // Source files
  src.styles = ["styles/style.sass"];

  // Process
  return gulp.plumbedSrc(src.styles)
    // Process sass files
    .pipe($.sass({
      sourceMap: !RELEASE,
      sourceMapBasepath: __dirname
    }))

    // Auto prefix, concat and format
    .pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
    .pipe($.concat("style.css"))
    .pipe($.csscomb())

    // If in release mode, minify the css
    .pipe($.if(RELEASE, $.minifyCss()))

    // Write resulting css file to disk
    .pipe(gulp.dest(DEST + "/css"))
    .pipe($.size({title: "style"}));
});

gulp.task("mui-styles", function () {
  src.styles = [
    "styles/material-ui.less"
  ];
  return gulp.plumbedSrc(src.styles)
    .pipe($.less({
      strictMath: true,
      sourceMap: !RELEASE,
      sourceMapBasepath: __dirname
    }))
    .pipe($.if(RELEASE, $.minifyCss()))
    .pipe(gulp.dest(DEST + "/css"))
    .pipe($.size({title: "style"}));
});

// Bundle
gulp.task("bundle", function (cb) {
  var started = false;
  var config = require("./config/webpack.js")(RELEASE);
  var bundler = webpack(config);

  function bundle(err, stats) {
    if (err) {
      throw new $.util.PluginError("webpack", err);
    }

    var verbose = true;//!!argv.verbose;
    if (verbose) {
      $.util.log("[webpack]", stats.toString({colors: true}));
    }

    if (!started) {
      started = true;
      return cb();
    }
  }

  if (watch) {
    bundler.watch(200, bundle);
  } else {
    bundler.run(bundle);
  }
});

// Build the app from source code
gulp.task("build", ["clean"], function (cb) {
  runSequence(["html", "assets", "styles", "bundle", "vendor", "languageBundles"], cb);
});

// Setup live reload
var tinylr;
gulp.task("livereload", function(cb) {
  tinylr = require("tiny-lr")();
  tinylr.listen(35729, function() {
    console.log('livereload listening');
    cb();
  })
});

function notifyLiveReload(fileName) {
  console.log("notifyLiveReload ", fileName)
  tinylr.changed({
    body: {
      files: [fileName]
    }
  });
}

gulp.task("watch", function (cb) {
  watch = true;

  runSequence("build", "livereload", function () {
    gulp.watch(src.assets, ["assets"]);
    gulp.watch(["styles/**.*"], ["styles"]);
    gulp.watch(DEST + "/**/*.*", function (file) {
      var fileName = path.relative(__dirname, file.path);
      notifyLiveReload(fileName);
    });
    cb();
  });
});
