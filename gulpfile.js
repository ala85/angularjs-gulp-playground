/* File: gulpfile.js */

// grab our packages
var gulp       = require('gulp'),
    gutil      = require('gulp-util'),
    jshint     = require('gulp-jshint'),
    concat     = require('gulp-concat'),
    cssmin     =  require('gulp-minify-css'),
    uglify     = require('gulp-uglifyjs'),
    less       =  require('gulp-less'),
    sourcemaps = require('gulp-sourcemaps'),
    connect    = require('gulp-connect'),
    browserify = require('browserify'),
    bower      = require('gulp-bower'),
    source     = require('vinyl-source-stream');


var config = {
        appFolder : "app",
        jsSourceFolder : "source/javascript",
        lessSourceFolder : "less",
        publicAssetsFolder : "public/assets",
        bowerDir : "./bower_components"
    };


//Starts up a server
gulp.task('connect', function () {
    connect.server({
        root: 'public',
        port: 4000
    })
});

// configure the jshint task
gulp.task('jshint', function() {
    return gulp.src(config.lessSourceFolder + '/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});


// Builds js into a bundle.js file and writes its uglified content into the public folder
gulp.task('build-js', function() {
    return gulp.src(config.jsSourceFolder + '/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('bundle.js'))
        //only uglify if gulp is ran with '--type production'
        .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.publicAssetsFolder + '/javascript'));
});

// Transform less file into css and write it into the public folder
gulp.task('less', function(){
    return gulp.src(config.lessSourceFolder + '/**/*.less')
        .pipe(sourcemaps.init())  // Process the original sources
        .pipe(less())
        .on('error', gutil.log)
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.publicAssetsFolder + '/stylesheets'));
});

//Bundles app.js content into a single main.js file
gulp.task('browserify', function() {
    // Grabs the app.js file
    return browserify(config.appFolder + '/app.js')
        // bundles it and creates a file called main.js
        .bundle()
        .pipe(source('main.js'))

        // saves it the public/js/ directory
        .pipe(gulp.dest(config.publicAssetsFolder + '/javascript/'));
});


gulp.task('bower', function () {
   return bower()
       .pipe(gulp.dest(config.bowerDir));
});

// Watch for changes to javascript files
gulp.task('watch', function() {
    gulp.watch(config.jsSourceFolder + '/**/*.js', ['jshint']);
    gulp.watch(config.appFolder + '/**/*.js', ['browserify']);
    gulp.watch(config.lessSourceFolder + '**/*.less', ['less']);
});


// define the default task and add the watch task to it
gulp.task('default', ['build']) // development

gulp.task('build', ['bower', 'less', 'browserify', 'watch', 'connect']) // build for production
